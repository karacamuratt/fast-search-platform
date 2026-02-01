import { getRabbitChannel } from "../infra/rabbitmq/rabbitmq.client";
import { EXCHANGE, ROUTING_REINDEX } from "../infra/rabbitmq/rabbitmq.setup";

export async function publishReindexEvent(productId: string) {
    const channel = await getRabbitChannel();

    channel.publish(
        EXCHANGE,
        ROUTING_REINDEX,
        Buffer.from(JSON.stringify({ productId })),
        {
            persistent: true,
        }
    );
}
