const sendSuccessResponse = (res, message, data =[], pagination = null, statusCode=200) => {
    const responseData = {
        success: true,
        statusCode: statusCode,
        message,
        data,
    }
    if (pagination) {
        responseData.pagination = pagination
    }
    return res.status(statusCode).json(responseData)
}

const sendErrorResponse = (res, message, errors = [], statusCode=500 ) => {
    return res.status(statusCode).json({
        success: false,
        statusCode: statusCode,
        message,
        errors,
    })
} 

module.exports = {
    sendSuccessResponse,
    sendErrorResponse,
}