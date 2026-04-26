import responseHelper from "../helpers/response.helper.js";

const errorMiddleware = (err, req, res, next) => {
    console.error("Error occurred:", err);
    
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    responseHelper.sendErrorResponse(res, message, [], statusCode);
}

export default errorMiddleware;
