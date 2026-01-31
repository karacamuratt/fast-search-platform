import { getElasticsearchClient } from "../elasticsearch.client";
import { PRODUCT_INDEX, productIndexSettings } from "./product.index";

export async function createProductIndex() {
    const es = getElasticsearchClient();
    const exists = await es.indices.exists({
        index: PRODUCT_INDEX,
    });

    if (exists) {
        console.log("Index already exists");
        return;
    }

    await es.indices.create({
        index: PRODUCT_INDEX,
        settings: productIndexSettings.settings,
        mappings: productIndexSettings.mappings,
    });

    console.log("Product index created");
}
