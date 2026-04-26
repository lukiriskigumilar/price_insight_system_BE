import productService from "./product.service.js";
import responseHelper from "../../helpers/response.helper.js";
import { get } from "node:http";

const productController = {
  getProducts: async (req, res, next) => {
    try {
      const { category } = req.query;
      const products = await productService.getProducts(req.query);
      const message = category
        ? `success get products with category "${category}"`
        : "success get all products";
      if (products.length === 0) {
        return responseHelper.sendSuccessResponse(
          res,
          "No products found",
          [],
          null,
          200,
        );
      }
      return responseHelper.sendSuccessResponse(
        res,
        message,
        products,
        null,
        200,
      );
    } catch (error) {
      next(error);
    }
  },

  getProductStats: async (req, res, next) =>{
    try {
        const stats = await productService.getProductStats(req.query);
        const message = req.query.category
        ? `success get product stats with category "${req.query.category}"`
        : "success get product stats for all products";
        return responseHelper.sendSuccessResponse(
            res,
            message,
            stats,
            null,
            200,
          );
    } catch (error) {
        next(error);
    }
  }

  
};

export default productController;
