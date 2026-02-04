import { randomUUID } from "crypto";
import { getRabbitChannel } from "../infra/rabbitmq/rabbitmq.client";
import { EXCHANGE, ROUTING_REINDEX } from "../infra/rabbitmq/rabbitmq.setup";

export async function publishReindexEvent(productId: string) {
    const channel = await getRabbitChannel();

    const event = {
        eventId: randomUUID(),
        productId,
        timestamp: new Date().toISOString(),
    };

    channel.publish(
        EXCHANGE,
        ROUTING_REINDEX,
        Buffer.from(JSON.stringify(event)),
        {
            persistent: true,
        }
    );
}
