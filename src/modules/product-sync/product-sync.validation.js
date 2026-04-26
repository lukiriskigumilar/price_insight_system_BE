import Joi from 'joi';

const syncProductsSchema = Joi.object({
    keyword: Joi.string().trim().required().messages({
        'string.empty': 'Keyword is required for product scraping.',
        'any.required': 'Keyword is required for product scraping.'
    })
});

export default {
    syncProductsSchema
};