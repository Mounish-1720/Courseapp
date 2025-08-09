/**
 * Standard success response wrapper
 * @param {import('express').Response} res 
 * @param {any} data 
 * @param {number} [status=200] 
 */
export const successResponse = (res, data, status = 200) => {
  res.status(status).json({
    success: true,
    data,
    timestamp: new Date().toISOString(),
    // Optional: Add request ID for tracing
    requestId: res.locals.requestId 
  });
};

/**
 * Standard error response wrapper
 * @param {import('express').Response} res 
 * @param {number} status 
 * @param {string} message 
 * @param {any} [details=null] 
 * @param {string} [code] - Custom error code (e.g., "INVALID_INPUT")
 */
export const errorResponse = (res, status, message, details = null, code) => {
  const response = {
    success: false,
    error: message,
    code: code || `HTTP_${status}`,
    timestamp: new Date().toISOString(),
    requestId: res.locals.requestId
  };

  // Only include details in development
  if (process.env.NODE_ENV === 'development' && details) {
    response.details = details instanceof Error ? details.stack : details;
  }

  res.status(status).json(response);
};

/**
 * Input validation helper
 * @param {import('express').Request} req 
 * @param {string[]} requiredFields 
 * @returns {string[]} Array of missing fields
 */
export const validateInput = (req, requiredFields) => {
  return requiredFields.filter(field => {
    const value = req.body[field] ?? req.query[field];
    return value === undefined || value === null || value === '';
  });
};

