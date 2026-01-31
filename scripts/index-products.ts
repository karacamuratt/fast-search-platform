import "dotenv/config";
import { createProductIndex } from "../packages/elastic-search/index/create-index";
import { bulkIndexProducts } from "../packages/elastic-search/index/bulk-indexer";

async function main() {
    await createProductIndex();
    await bulkIndexProducts();
}

main().catch(console.error);
