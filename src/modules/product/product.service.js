import productsRepository from "./product.repository.js";
import categoryRepositoryShared from "../../shared/repository/category.repository.shared.js";
import AppError from "../../helpers/appError.helper.js";

const productService = {
    
    getProducts: async (query) => {
        const categoryName = query.category;
        
        // If a category query parameter is provided, filter the products by that category
        if (categoryName) {
            const categoryNameLower = categoryName.toLowerCase();
            const category = await categoryRepositoryShared.findCategoryByName(categoryNameLower);
            
            // Throw a 400 Bad Request error if the category is invalid/not supported
            if (!category) {
                throw new AppError(`Invalid category: "${categoryName}". This category is not supported.`, 400);
            }
            
            // Fetch and return products associated with the found category ID
            const products = await productsRepository.findByCategoryId(category.id);
            return products;
        }
        
        // If no category filter is provided, fetch and return all products
        const products = await productsRepository.findAll();
        return products;
    },

    getProductStats: async (query) => {
        let allProducts = [];
        const categoryName = query.category;

        if (categoryName) {
            const categoryNameLower = categoryName.toLowerCase();
            const category = await categoryRepositoryShared.findCategoryByName(categoryNameLower);
            if (!category) {
                throw new AppError(`Invalid category: "${categoryName}". This category is not supported.`, 400);
            }
            allProducts = await productsRepository.findByCategoryId(category.id);
        } else {
            allProducts = await productsRepository.findAll();
        }

        const totalProducts = allProducts.length;

        // Pengecekan jika tidak ada produk sama sekali (mencegah NaN dan Infinity)
        if (totalProducts === 0) {
            return { totalProducts: 0, averagePrice: 0, minPrice: 0, maxPrice: 0 };
        }

        // Kumpulkan semua array harga yang valid
        const validPrices = allProducts.map(product => product.price || 0);
        
        return {
            totalProducts,
            averagePrice: Math.round(validPrices.reduce((sum, price) => sum + price, 0) / totalProducts),
            minPrice: Math.min(...validPrices),
            maxPrice: Math.max(...validPrices)
        };
    }
}

export default productService;
        