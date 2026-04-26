import axios from 'axios';
import AppError from '../../../helpers/appError.helper.js';

const fetchProductsFromAPI = async (keyword) => {
    try {
        const response = await axios.get(process.env.API_SCRAPER_URL)
        const filtered = response.data.filter(
            (item) => (item.title||'').toLowerCase().includes(keyword.toLowerCase())
        )
        return filtered.map(
            (item) => ({
                title: item.title ?? null,
                price: item.price ?? null,
                rating: item.rating ?? null,
                total_sold: item.total_sold ?? null,
                source:'api',
                store_name: item.store_name ?? null,
                product_url: item.product_url ?? null,
            })
        )
    }catch(error){
        throw new AppError(`Failed to fetch products from API scraper: ${error.message}`, 500);
    }
}

export default fetchProductsFromAPI;