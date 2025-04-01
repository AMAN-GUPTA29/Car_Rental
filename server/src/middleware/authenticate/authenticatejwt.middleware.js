/**
 * @import Passport for authentication
 */
import passport from "passport";
/**
 * @description Middleware to authenticate users using JWT
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
function authenticateJwt(req, res, next) {
    /**
   * @description Use passport JWT strategy to authenticate the request
   */
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    /**
     * @description Handle authentication errors
     */
    if (err) {
      console.error("Passport error:", err);
      return res.status(500).json({ message: "Internal server error", error: err });
    }
    /**
     * @description Handle case where no user is found or token is invalid
     */
    if (!user) {
      console.error("Unauthorized access:", info);
      return res.status(401).json({ message: "Unauthorized access", info });
    }
    
    /**
     * @description Attach user object to request for use in subsequent middleware
     */
    req.user = user;
    /**
     * @description Proceed to next middleware if authentication is successful
     */
    next(); 
  })(req, res, next);
}

export default authenticateJwt;
