import prisma from '../../config/prisma.client.js';

const categoryRepositoryShared = {
    findCategoryByName: async (keyword) => {
       const category = await prisma.category.findFirst({
           where: {
               name: {
                   equals: keyword,
                   mode: 'insensitive' // Pencarian yang mengabaikan huruf besar/kecil
               }
           }
       });
       return category;
    },
}

export default categoryRepositoryShared;