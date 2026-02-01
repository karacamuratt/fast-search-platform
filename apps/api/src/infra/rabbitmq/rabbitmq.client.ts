import * as amqp from "amqplib/callback_api";

let channel: amqp.Channel | null = null;

export function getRabbitChannel(): Promise<amqp.Channel> {
    if (channel) {
        return Promise.resolve(channel);
    }

    return new Promise((resolve, reject) => {
        amqp.connect("amqp://localhost", (err, connection) => {
            if (err) return reject(err);

            connection.createChannel((err, ch) => {
                if (err) return reject(err);

                channel = ch;
                resolve(ch);
            });
        });
    });
}
