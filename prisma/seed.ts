import { prisma } from "../packages/prisma/prisma.client";
import crypto from "node:crypto";

const BATCH_SIZE = 5000;
const TOTAL = 1_000_000;

async function main() {
    console.log("Seeding started...");

    for (let i = 0; i < TOTAL; i += BATCH_SIZE) {
        const data = Array.from({ length: BATCH_SIZE }).map(() => ({
            sku: crypto.randomUUID(),
            title: `Product ${Math.random().toString(36).slice(2)}`,
            description: "High scale marketplace product",
            brand: ["Apple", "Samsung", "Sony", "LG"][Math.floor(Math.random() * 4)],
            category: ["phone", "laptop", "tv", "audio"][Math.floor(Math.random() * 4)],
            price: Math.random() * 5000,
            currency: "EUR",
            discountRate: Math.random(),
            ratingAvg: Math.random() * 5,
            ratingCount: Math.floor(Math.random() * 10000),
            stockQty: Math.floor(Math.random() * 1000),
            isActive: true,
            isFreeShip: Math.random() > 0.5,
            country: ["DE", "FR", "ES", "IT"][Math.floor(Math.random() * 4)],
            tags: ["tech", "sale", "new"],
            attributes: {
                color: ["black", "white", "silver"][Math.floor(Math.random() * 3)],
                warranty: "2y",
            },
        }));

        await prisma.product.createMany({
            data,
            skipDuplicates: true,
        });

        console.log(`Inserted ${Math.min(i + BATCH_SIZE, TOTAL)}/${TOTAL}`);
    }

    console.log("Seeding completed!");
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
