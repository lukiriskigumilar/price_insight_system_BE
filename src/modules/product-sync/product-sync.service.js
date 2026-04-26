import AppError from '../../helpers/appError.helper.js'
import categoryRepositoryShared from '../../shared/repository/category.repository.shared.js'
import fetchProductsFromAPI from './scrapers/api.scraper.js'
import scrapeProducts from './scrapers/lazada.scraper.js'
import productSyncRepository from './product-sync.repository.js'

const productSyncService = {
    addProductsFromScraper: async (keyword) => {
        // find category by name, if not found throw error
        const category = await categoryRepositoryShared.findCategoryByName(keyword)
        if (!category) {
            throw new AppError(`Category with name "${keyword}" not found.`, 404)
        }
        const categoryId = category.id

        // get products from both scrapers in parallel
        const [apiScrapedProducts, lazadaScrapedProducts] = await Promise.all([
            fetchProductsFromAPI(keyword),
            scrapeProducts(keyword)
        ])

        // Combine results from both scrapers
        const combinedScrapedProducts = [...apiScrapedProducts, ...lazadaScrapedProducts]

        // Prepare data for database by adding category_id
        const dataToSave = combinedScrapedProducts.map(item => ({
            ...item,
            category_id: categoryId
        }))

        // Save to database using repository
        const savedCount = await productSyncRepository.saveMultiple(dataToSave)

        return savedCount;
    }
}

export default productSyncService;