import categoryRepository from "./category.repository.js";

const categoriesService = {
    getAllCategories: async () => {
        return await categoryRepository.getAllCategories();
    }
}
export default categoriesService;
