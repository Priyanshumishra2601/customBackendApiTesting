/**
 * Application-level error with HTTP semantics.
 */
export class ApiError extends Error {
  /**
   * @param {number} statusCode
   * @param {string} message
   * @param {string} [code]
   * @param {unknown} [details]
   */
  constructor(statusCode, message, code = undefined, details = undefined) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

