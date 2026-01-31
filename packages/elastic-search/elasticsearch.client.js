"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.elasticsearch = void 0;
const elasticsearch_1 = require("@elastic/elasticsearch");
exports.elasticsearch = new elasticsearch_1.Client({
    node: process.env.ELASTICSEARCH_URL,
    maxRetries: 5,
    requestTimeout: 30_000,
});
//# sourceMappingURL=elasticsearch.client.js.map