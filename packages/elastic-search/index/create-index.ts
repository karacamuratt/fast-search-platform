import { elasticsearch } from "../elasticsearch.client";
import { PRODUCT_INDEX, productIndexSettings } from "./product.index";

export async function createProductIndex() {
    const exists = await elasticsearch.indices.exists({
        index: PRODUCT_INDEX,
    });

    if (exists) {
        console.log("Index already exists");
        return;
    }

    await elasticsearch.indices.create({
        index: PRODUCT_INDEX,
        settings: productIndexSettings.settings,
        mappings: productIndexSettings.mappings,
    });

    console.log("Product index created");
}
