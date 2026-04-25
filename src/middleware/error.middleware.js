import responseHelper from "../helpers/response.helper.js";

const errorMiddleware = (err, req, res, next) => {
    console.error("Error occurred:", err);
    responseHelper.sendErrorResponse(res, "An unexpected error occurred", err.message || "Internal Server Error", 500);
}

export default errorMiddleware;
