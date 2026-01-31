import type { estypes } from "@elastic/elasticsearch";
type TokenChar = estypes.AnalysisTokenChar;
export declare const PRODUCT_INDEX = "products_v1";
export declare const productIndexSettings: {
    readonly settings: {
        readonly number_of_shards: 3;
        readonly number_of_replicas: 0;
        readonly refresh_interval: "30s";
        readonly analysis: {
            readonly analyzer: {
                readonly autocomplete_analyzer: {
                    readonly type: "custom";
                    readonly tokenizer: "autocomplete_tokenizer";
                    readonly filter: string[];
                };
            };
            readonly tokenizer: {
                readonly autocomplete_tokenizer: {
                    readonly type: "edge_ngram";
                    readonly min_gram: 2;
                    readonly max_gram: 10;
                    readonly token_chars: TokenChar[];
                };
            };
        };
    };
    readonly mappings: {
        readonly properties: {
            readonly id: {
                readonly type: "keyword";
            };
            readonly sku: {
                readonly type: "keyword";
            };
            readonly title: {
                readonly type: "text";
                readonly analyzer: "standard";
                readonly fields: {
                    readonly autocomplete: {
                        readonly type: "text";
                        readonly analyzer: "autocomplete_analyzer";
                        readonly search_analyzer: "standard";
                    };
                    readonly keyword: {
                        readonly type: "keyword";
                    };
                };
            };
            readonly description: {
                readonly type: "text";
            };
            readonly brand: {
                readonly type: "keyword";
            };
            readonly category: {
                readonly type: "keyword";
            };
            readonly country: {
                readonly type: "keyword";
            };
            readonly tags: {
                readonly type: "keyword";
            };
            readonly price: {
                readonly type: "float";
            };
            readonly discountRate: {
                readonly type: "float";
            };
            readonly ratingAvg: {
                readonly type: "float";
            };
            readonly ratingCount: {
                readonly type: "integer";
            };
            readonly stockQty: {
                readonly type: "integer";
            };
            readonly isActive: {
                readonly type: "boolean";
            };
            readonly isFreeShip: {
                readonly type: "boolean";
            };
            readonly createdAt: {
                readonly type: "date";
            };
        };
    };
};
export {};
