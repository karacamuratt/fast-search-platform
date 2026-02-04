import { getRabbitChannel } from "./rabbitmq.client";

export const EXCHANGE = "search.events";
export const QUEUE_REINDEX = "product.reindex";
export const ROUTING_REINDEX = "product.reindex";

export async function setupRabbitMQ() {
    const channel = await getRabbitChannel();

    // Exchange
    await channel.assertExchange(EXCHANGE, "topic", {
        durable: true,
    });

    // Queue
    await channel.assertQueue(QUEUE_REINDEX, {
        durable: true,
    });

    // Bind
    await channel.bindQueue(
        QUEUE_REINDEX,
        EXCHANGE,
        ROUTING_REINDEX
    );

    console.log("RabbitMQ setup completed");
}
