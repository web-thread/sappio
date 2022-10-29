import { log } from '../../utils/logger.js';
import { env } from '../../config/dotenv.js';
import { 
  getErrorMessage, 
  getHttpStatusCode,
  logErrorMessage
} from '../../utils/error-handler.js'

const NODE_ENVIRONMENT = env.NODE_ENV || "test";

// Error handling Middleware functions
const errorLogger = (error, req, res, next) => {
  log('error', `error ${error.message}`) 
  
  // call next middleware
  next(error)
}

const errorResponder = (error, req, res, next) => {
  log('error', error.message)

  res.header("Content-Type", 'application/json')
  
  const status = error.status || 500
  
  res.status(status).send(error.message)
}

/**
 * Generic Express error handler middleware.
 *
 * @param {Error} error - An Error object.
 * @param {Object} request - Express request object
 * @param {Object} response - Express response object
 * @param {Function} next - Express `next()` function
 */
const errorHandlerMiddleware = (error, request, response, next) => {
  const errorMessage = getErrorMessage(error);

  logErrorMessage(errorMessage);

  /**
   * If response headers have already been sent,
   * delegate to the default Express error handler.
   */
  if (response.headersSent) {
    return next(error);
  }

  const errorResponse = {
    statusCode: getHttpStatusCode({ error, response }),
    body: undefined
  };

  /**
   * Error messages and error stacks often reveal details
   * about the internals of your application, potentially
   * making it vulnerable to attack, so these parts of an
   * Error object should never be sent in a response when
   * your application is running in production.
   */
  if (NODE_ENVIRONMENT !== "production") {
    errorResponse.body = errorMessage;
  }

  /**
   * Set the response status code.
   */
  response.status(errorResponse.statusCode);

  /**
   * Send an appropriately formatted response.
   *
   * The Express `res.format()` method automatically
   * sets `Content-Type` and `Vary: Accept` response headers.
   *
   * @see https://expressjs.com/en/api.html#res.format
   *
   * This method performs content negotation.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Content_negotiation
   */
  response.format({
    //
    // Callback to run when `Accept` header contains either
    // `application/json` or `*/*`, or if it isn't set at all.
    //
    "application/json": () => {
      /**
       * Set a JSON formatted response body.
       * Response header: `Content-Type: `application/json`
       */
      response.json({ message: errorResponse.body });
    },
    /**
     * Callback to run when none of the others are matched.
     */
    default: () => {
      /**
       * Set a plain text response body.
       * Response header: `Content-Type: text/plain`
       */
      response.type("text/plain").send(errorResponse.body);
    },
  });

  /**
   * Ensure any remaining middleware are run.
   */
  next();
}

export const errors_MWs = [
    errorHandlerMiddleware,
    errorLogger,
    errorResponder
  ]; 

