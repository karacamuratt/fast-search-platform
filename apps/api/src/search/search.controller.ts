import { Controller, Get, Param, Post, Query } from "@nestjs/common";
import { SearchService } from "./search.service";
import { publishReindexEvent } from "./search.producer";

@Controller("search")
export class SearchController {
    constructor(private readonly searchService: SearchService) { }

    @Get()
    search(
        @Query("q") q?: string,
        @Query("category") category?: string,
        @Query("minPrice") minPrice?: string,
        @Query("maxPrice") maxPrice?: string,
        @Query("size") size?: string,
        @Query("searchAfter") searchAfter?: string,
    ) {
        return this.searchService.searchProducts({
            q,
            category,
            minPrice: minPrice ? Number(minPrice) : undefined,
            maxPrice: maxPrice ? Number(maxPrice) : undefined,
            size: size ? Number(size) : undefined,
            searchAfter: searchAfter ? JSON.parse(searchAfter) : undefined,
        });
    }

    @Post("reindex/:id")
    async reindexProduct(@Param("id") id: string) {
        console.log(`Queueing reindex for product ID ${id}`);
        await publishReindexEvent(id);
        return {
            status: "queued",
            productId: id,
        };
    }
}
