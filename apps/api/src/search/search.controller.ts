import { Controller, Get, Query } from "@nestjs/common";
import { SearchService } from "./search.service";

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
}
