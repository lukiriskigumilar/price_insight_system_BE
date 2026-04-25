import categoriesService from "./category.service.js";
import responseHelper from "../../helpers/response.helper.js";

const categoriesController = {
    GetCategoryList: async (req, res, next) => {
        try {
            const categories = await categoriesService.getAllCategories();
            responseHelper.sendSuccessResponse(res,"retrived categories successfully", categories, null,200);
        } catch (error) {
            next(error);
        }
        
    },
    
}

export default categoriesController;