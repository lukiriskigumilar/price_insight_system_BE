import axios from 'axios';
import fetchProductsFromAPI from './api.scraper.js';
import AppError from '../../../helpers/appError.helper.js';

jest.mock('axios');

describe('fetchProductsFromAPI', () => {
    const originalEnv = process.env;

    beforeEach(() => {
        jest.resetModules();
        process.env = { ...originalEnv, API_SCRAPER_URL: 'http://test-url.com/api/products' };
        jest.clearAllMocks();
    });

    afterEach(() => {
        process.env = originalEnv;
    });

    it('should fetch and filter products correctly based on keyword', async () => {
        const mockData = [
            { title: 'Apple iPhone 13', price: 999, rating: 4.5, total_sold: 100, store_name: 'Store A', product_url: 'http://link1.com' },
            { title: 'Samsung Galaxy S22', price: 899, rating: 4.2, total_sold: 50, store_name: 'Store B', product_url: 'http://link2.com' },
            { title: 'Apple MacBook Pro', price: 1999, rating: 4.8, total_sold: 200, store_name: 'Store C', product_url: 'http://link3.com' }
        ];

        axios.get.mockResolvedValueOnce({ data: mockData });

        const result = await fetchProductsFromAPI('apple');

        expect(axios.get).toHaveBeenCalledWith('http://test-url.com/api/products');
        expect(result).toHaveLength(2);
        expect(result).toEqual([
            {
                title: 'Apple iPhone 13',
                price: 999,
                rating: 4.5,
                total_sold: 100,
                source: 'api',
                store_name: 'Store A',
                product_url: 'http://link1.com'
            },
            {
                title: 'Apple MacBook Pro',
                price: 1999,
                rating: 4.8,
                total_sold: 200,
                source: 'api',
                store_name: 'Store C',
                product_url: 'http://link3.com'
            }
        ]);
    });

    it('should return an empty array if no products match the keyword', async () => {
        const mockData = [
            { title: 'Samsung Galaxy S22', price: 899 }
        ];

        axios.get.mockResolvedValueOnce({ data: mockData });

        const result = await fetchProductsFromAPI('apple');

        expect(result).toHaveLength(0);
    });

    it('should handle missing properties by assigning null', async () => {
        const mockData = [
            { title: 'Apple Watch' } // Missing all other properties
        ];

        axios.get.mockResolvedValueOnce({ data: mockData });

        const result = await fetchProductsFromAPI('apple');

        expect(result[0]).toEqual({
            title: 'Apple Watch',
            price: null,
            rating: null,
            total_sold: null,
            source: 'api',
            store_name: null,
            product_url: null
        });
    });

    it('should throw an AppError when the API request fails', async () => {
        axios.get.mockRejectedValueOnce(new Error('Network Error'));

        let error;
        try {
            await fetchProductsFromAPI('apple');
        } catch (e) {
            error = e;
        }

        expect(error).toBeInstanceOf(AppError);
        expect(error.message).toBe('Failed to fetch products from API scraper: Network Error');
        expect(error.statusCode).toBe(500);
    });
});