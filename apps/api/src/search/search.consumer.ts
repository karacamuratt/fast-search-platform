import { getRabbitChannel } from "../infra/rabbitmq/rabbitmq.client";
import { ROUTING_REINDEX } from "../infra/rabbitmq/rabbitmq.setup";
import { getElasticsearchClient } from "../infra/elastic-search/elasticsearch.client";
import { prisma } from "../../../../prisma/prisma.client";
import { mapProductToEsDoc } from "./search.mapper";

export async function startReindexConsumer() {
    const channel = await getRabbitChannel();

    await channel.consume(ROUTING_REINDEX, async (msg) => {
        if (!msg) return;

        try {
            const es = getElasticsearchClient();
            const { productId } = JSON.parse(msg.content.toString());

            const product = await prisma.product.findUnique({
                where: { id: productId },
            });

            if (!product) {
                // Delete from ES if not found in DB
                console.log(`Product with ID ${productId} not found in DB. Deleting from ES.`);
                await es.delete({
                    index: "products_v1",
                    id: productId,
                });

                channel.ack(msg);
                return;
            }

            const esDoc = mapProductToEsDoc(product);
            console.log(`Reindexing product with ID ${productId} into Elasticsearch.`);
            await es.update({
                index: "products_v1",
                id: productId,
                doc: esDoc,
                doc_as_upsert: true,
            });

            channel.ack(msg);
        } catch (err) {
            console.error("Reindex failed", err);
            channel.nack(msg, false, true);
        }
    });
}
