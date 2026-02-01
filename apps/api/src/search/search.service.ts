import { Injectable } from "@nestjs/common";
import { getElasticsearchClient } from "../../src/infra/elastic-search/elasticsearch.client";
import { redis } from "../infra/redis/redis.client";
import { PRODUCT_INDEX } from "../infra/elastic-search/index/product.index";
@Injectable()
export class SearchService {
    async searchProducts(params: {
        q?: string;
        category?: string;
        minPrice?: number;
        maxPrice?: number;
        size?: number;
        searchAfter?: string[];
    }) {
        const cacheKey = `search:${JSON.stringify(params)}`;

        // CACHE CHECK
        const cached = await redis.get(cacheKey);

        if (cached) {
            console.log("Cache hit for key:", cacheKey);
            return {
                source: "cache",
                ...JSON.parse(cached),
            };
        }

        // ES QUERY
        const must: any[] = [];
        const filter: any[] = [];

        if (params.q) {
            must.push({
                multi_match: {
                    query: params.q,
                    fields: ["title^3", "title.autocomplete", "description"],
                },
            });
        }

        if (params.category) {
            filter.push({ term: { category: params.category } });
        }

        if (params.minPrice || params.maxPrice) {
            filter.push({
                range: {
                    price: {
                        gte: params.minPrice,
                        lte: params.maxPrice,
                    },
                },
            });
        }

        const es = getElasticsearchClient();

        const response = await es.search({
            index: PRODUCT_INDEX,
            size: params.size ?? 20,
            ...(params.searchAfter && { search_after: params.searchAfter }),
            sort: [
                { _score: { order: "desc" } },
                { id: { order: "asc" } },
            ],
            query: {
                bool: { must, filter },
            },
        });

        const result = {
            items: response.hits.hits.map((h: any) => ({
                id: h._id,
                score: h._score,
                ...h._source,
            })),
            nextSearchAfter:
                response.hits.hits.length > 0
                    ? response.hits.hits[response.hits.hits.length - 1].sort
                    : null,
        };

        // CACHE SET (TTL 60s)
        console.log("Cache miss for key:", cacheKey);
        await redis.set(cacheKey, JSON.stringify(result), "EX", 60);

        return {
            source: "elasticsearch",
            ...result,
        };
    }
}
