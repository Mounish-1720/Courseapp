export function success(res, data) {
  res.status(200).json({ success: true, data });
}

export function error(res, statusCode, message, details = null) {
  res.status(statusCode).json({
    success: false,
    message,
    ...(details && { details })
  });
}
