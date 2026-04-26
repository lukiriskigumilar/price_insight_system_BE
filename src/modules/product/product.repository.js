import prisma from "../../config/prisma.client.js";

const productsRepository = {
    findByCategoryId: async (category_id) => {
        const products = await prisma.product.findMany({
            where: {
                category_id: category_id
            }
        });
        return products;
    },
    findAll: async () => {
        const products = await prisma.product.findMany();
        return products;
    }
};

export default productsRepository;