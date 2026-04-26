import express from 'express'
import productController from './product.controller.js'

const productRouter = express.Router()

productRouter.get('/', productController.getProducts)
productRouter.get('/stats', productController.getProductStats)

export default productRouter