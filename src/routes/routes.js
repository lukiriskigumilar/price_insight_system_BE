import express from 'express';
import categoryRouter from '../modules/category/category.route.js';

const router = express.Router();

router.use('/categories', categoryRouter);

export default router;