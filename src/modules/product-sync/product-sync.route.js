import express from 'express'
import productSyncController from './product-sync.controller.js'
import validate from '../../middleware/validate.middleware.js'
import productSyncValidation from './product-sync.validation.js'

const productSyncRouter = express.Router()

productSyncRouter.post('/', validate(productSyncValidation.syncProductsSchema), productSyncController.addProducts)

export default productSyncRouter