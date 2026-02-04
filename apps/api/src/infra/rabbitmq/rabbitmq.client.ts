import amqp from "amqplib";

let connection: any = null;
let channel: any = null;

export async function getRabbitChannel() {
    if (channel) return channel;

    const url =
        process.env.RABBITMQ_URL ||
        "amqp://localhost:5672";

    connection = await amqp.connect(url);

    channel = await connection.createChannel();

    connection.on("close", () => {
        console.error("RabbitMQ connection closed");
        connection = null;
        channel = null;
    });

    connection.on("error", (err: any) => {
        console.error("RabbitMQ error", err);
    });

    return channel;
}
