import productSyncService from "./product-sync.service.js";
import responseHelper from "../../helpers/response.helper.js";

const productSyncController = {
    addProducts: async (req, res, next) => {
        try {
            const { keyword } = req.body;
            const savedCount = await productSyncService.addProductsFromScraper(keyword);
            responseHelper.sendSuccessResponse(res, `Successfully added ${savedCount} products`, null, null, 201);
        } catch (error) {
            next(error);
        }
    }
}

export default productSyncController;
