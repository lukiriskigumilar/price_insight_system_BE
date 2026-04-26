import productService from "./product.service.js";
import responseHelper from "../../helpers/response.helper.js";

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
};

export default productController;
