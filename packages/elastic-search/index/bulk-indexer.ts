import { prisma } from "../../prisma/prisma.client";
import { elasticsearch } from "../elasticsearch.client";
import { PRODUCT_INDEX } from "../index/product.index";
import type { Product } from "@prisma/client";

const BATCH_SIZE = 1000;

export async function bulkIndexProducts() {
    let cursor: string | undefined = undefined;

    while (true) {
        const products: Product[] = await prisma.product.findMany({
            take: BATCH_SIZE,
            ...(cursor && { skip: 1, cursor: { id: cursor } }),
            orderBy: { id: "asc" },
        });

        if (products.length === 0) break;

        const body = products.flatMap((product) => [
            { index: { _index: PRODUCT_INDEX, _id: product.id } },
            {
                ...product,
                createdAt: product.createdAt.toISOString(),
            },
        ]);

        await elasticsearch.bulk({
            refresh: false,
            body,
        });

        cursor = products[products.length - 1].id;

        console.log(`Indexed ${products.length} products`);
    }

    console.log("Bulk indexing completed");
}
