export function mapProductToEsDoc(product: any) {
    return {
        id: product.id,
        sku: product.sku,

        title: product.title,
        description: product.description ?? "",

        brand: product.brand,
        category: product.category,
        country: product.country,

        tags: product.tags ?? [],

        price: Number(product.price),
        discountRate: product.discountRate
            ? Number(product.discountRate)
            : 0,

        ratingAvg: product.ratingAvg ?? 0,
        ratingCount: product.ratingCount ?? 0,

        stockQty: product.stockQty,
        isActive: product.isActive,
        isFreeShip: product.isFreeShip,

        createdAt: product.createdAt,
    };
}
