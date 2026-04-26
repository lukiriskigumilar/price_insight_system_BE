import prisma from "../../config/prisma.client.js";

const productSyncRepository = {
  saveMultiple: async (dataToSave) => {
    // save multiple data with createMany, skip duplicates based on unique constraint
    const result = await prisma.product.createMany({
      data: dataToSave,
      skipDuplicates: true, 
    });
  
    return result.count; 
  },
  
};

export default productSyncRepository;
