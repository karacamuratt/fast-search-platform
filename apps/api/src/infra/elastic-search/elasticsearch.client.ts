import { Client } from "@elastic/elasticsearch";

let client: Client | null = null;

export function getElasticsearchClient(): Client {
    if (client) return client;

    const node = process.env.ELASTICSEARCH_URL;
    if (!node) {
        throw new Error("ELASTICSEARCH_URL is not defined");
    }

    client = new Client({ node });
    return client;
}
