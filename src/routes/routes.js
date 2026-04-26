import express from 'express';
import categoryRouter from '../modules/category/category.route.js';
import productSyncRouter from '../modules/product-sync/product-sync.route.js';
import productRouter from '../modules/product/product.route.js';

const router = express.Router();

router.use('/categories', categoryRouter);
router.use('/product-sync', productSyncRouter);
router.use('/products', productRouter);

export default router;