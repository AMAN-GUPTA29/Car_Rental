/**
 * @import Authentication middleware for different user roles
 */
import authenticateJwtOwner from "./authenticatejwtowner.middleware.js"
import authenticateJwtUser from "./authenticatejwtconsumer.middleware.js"
import authenticateJwtAdmin from "./authenticatejwtadmin.middleware.js"


/**
 * @description Export authentication middleware functions for different user roles
 * @exports authenticateJwtAdmin - Middleware to authenticate and authorize admin users
 * @exports authenticateJwtUser - Middleware to authenticate and authorize regular users
 * @exports authenticateJwtOwner - Middleware to authenticate and authorize car owners
 */
export {authenticateJwtAdmin,authenticateJwtUser,authenticateJwtOwner};