/**
 * @import General JWT authentication middleware
 * @import Role-specific authentication middleware
 */
import authenticateJwt from "./authenticatejwt.middleware.js";
import {authenticateJwtAdmin,authenticateJwtUser,authenticateJwtOwner} from "./authenticatejwt/index.js"

/**
 * @description Export all authentication middleware functions
 * @exports authenticateJwt - General middleware to authenticate any user
 * @exports authenticateJwtAdmin - Middleware to authenticate and authorize admin users
 * @exports authenticateJwtUser - Middleware to authenticate and authorize regular users
 * @exports authenticateJwtOwner - Middleware to authenticate and authorize car owners
 */

export {authenticateJwt,authenticateJwtAdmin,authenticateJwtUser,authenticateJwtOwner};