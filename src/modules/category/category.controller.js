import categoriesService from "./category.service.js";
import responseHelper from "../../helpers/response.helper.js";

const categoriesController = {
    GetCategoryList: async (req, res) => {
        try {
            const categories = await categoriesService.getAllCategories();
            responseHelper.sendSuccessResponse(res,"retrived categories successfully", categories,200);
        } catch (error) {
            console.error("Error fetching categories:", error);
            responseHelper.sendErrorResponse(res,"Failed to fetch categories", error,500);
        }
    },
    
}

export default categoriesController;