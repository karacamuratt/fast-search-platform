import { getRabbitChannel } from "./rabbitmq.client";

export const EXCHANGE = "search.events";
export const QUEUE_REINDEX = "search.reindex";
export const ROUTING_REINDEX = "product.reindex";

export async function setupRabbitMQ() {
    const channel = await getRabbitChannel();

    await channel.assertExchange(EXCHANGE, "topic", { durable: true });

    await channel.assertQueue(QUEUE_REINDEX, {
        durable: true,
        deadLetterExchange: "search.dlx",
    });

    await channel.bindQueue(
        QUEUE_REINDEX,
        EXCHANGE,
        ROUTING_REINDEX
    );
}
