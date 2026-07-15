// utils/ApiResponse.js

/**
 * Standardized success response envelope.
 *
 * Keeping every successful response in the same shape means the frontend
 * (both the public site and the admin panel) can rely on one parsing
 * pattern everywhere, and it keeps success/error responses visually and
 * structurally distinct (success=true here vs. success=false on ApiError),
 * so consumers never have to guess which branch they're in.
 *
 * Usage:
 *   return res.status(200).json(new ApiResponse(200, data, "Fetched successfully"));
 *   return res.status(201).json(new ApiResponse(201, created, "Portfolio item created"));
 */
class ApiResponse {
  /**
   * @param {number} statusCode - HTTP status code (2xx)
   * @param {*} data - Payload to return to the client
   * @param {string} message - Human-readable success message
   */
  constructor(statusCode, data = null, message = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}

module.exports = ApiResponse;