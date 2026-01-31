"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productIndexSettings = exports.PRODUCT_INDEX = void 0;
exports.PRODUCT_INDEX = "products_v1";
exports.productIndexSettings = {
    settings: {
        number_of_shards: 3,
        number_of_replicas: 0,
        refresh_interval: "30s",
        analysis: {
            analyzer: {
                autocomplete_analyzer: {
                    type: "custom",
                    tokenizer: "autocomplete_tokenizer",
                    filter: ["lowercase"],
                },
            },
            tokenizer: {
                autocomplete_tokenizer: {
                    type: "edge_ngram",
                    min_gram: 2,
                    max_gram: 10,
                    token_chars: ["letter", "digit"],
                },
            },
        },
    },
    mappings: {
        properties: {
            id: { type: "keyword" },
            sku: { type: "keyword" },
            title: {
                type: "text",
                analyzer: "standard",
                fields: {
                    autocomplete: {
                        type: "text",
                        analyzer: "autocomplete_analyzer",
                        search_analyzer: "standard",
                    },
                    keyword: { type: "keyword" },
                },
            },
            description: { type: "text" },
            brand: { type: "keyword" },
            category: { type: "keyword" },
            country: { type: "keyword" },
            tags: { type: "keyword" },
            price: { type: "float" },
            discountRate: { type: "float" },
            ratingAvg: { type: "float" },
            ratingCount: { type: "integer" },
            stockQty: { type: "integer" },
            isActive: { type: "boolean" },
            isFreeShip: { type: "boolean" },
            createdAt: { type: "date" },
        },
    },
};
//# sourceMappingURL=product.index.js.map