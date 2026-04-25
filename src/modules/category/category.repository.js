import prisma from "../../config/prisma.client.js";

const categoryRepository = {
    getAllCategories: async () => {
       return await prisma.category.findMany();
    },
};

export default categoryRepository;
