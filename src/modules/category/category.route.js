import express from 'express';
import categoryController from './category.controller.js';

const categoryRouter = express.Router();

categoryRouter.get('/', categoryController.GetCategoryList);

export default categoryRouter;
