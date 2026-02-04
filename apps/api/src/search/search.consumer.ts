import type { ConsumeMessage } from "amqplib";
import { getRabbitChannel } from "../infra/rabbitmq/rabbitmq.client";
import { ROUTING_REINDEX } from "../infra/rabbitmq/rabbitmq.setup";
import { getElasticsearchClient } from "../infra/elastic-search/elasticsearch.client";
import { acquireIdempotencyLock } from "./idempotency.service";
import { prisma } from "../../../../prisma/prisma.client";
import { mapProductToEsDoc } from "./search.mapper";

export async function startReindexConsumer() {
    const channel = await getRabbitChannel();

    await channel.consume(
        ROUTING_REINDEX,
        async (msg: ConsumeMessage | null) => {
            if (!msg) return;

            try {
                const { productId, eventId } = JSON.parse(
                    msg.content.toString()
                );

                console.log("EVENT RECEIVED:", eventId, productId);

                const es = getElasticsearchClient();

                const canProcess = await acquireIdempotencyLock(productId);

                if (!canProcess) {
                    console.log("Duplicate event skipped:", eventId);
                    channel.ack(msg);
                    return;
                }

                const product = await prisma.product.findUnique({
                    where: { id: productId },
                });

                if (!product) {
                    await es.delete({
                        index: "products_v1",
                        id: productId,
                    });

                    channel.ack(msg);
                    return;
                }

                const esDoc = mapProductToEsDoc(product);

                await es.update({
                    index: "products_v1",
                    id: productId,
                    doc: esDoc,
                    doc_as_upsert: true,
                });

                channel.ack(msg);
            } catch (err) {
                console.error("Reindex failed", err);

                if (msg) {
                    channel.nack(msg, false, true);
                }
            }
        }
    );
}
