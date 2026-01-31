import "dotenv/config";
import { createProductIndex } from "../apps/api/src/infra/elastic-search/index/create-index";
import { bulkIndexProducts } from "../apps/api/src/infra/elastic-search/index/bulk-indexer";

async function main() {
    await createProductIndex();
    await bulkIndexProducts();
}

main().catch(console.error);
