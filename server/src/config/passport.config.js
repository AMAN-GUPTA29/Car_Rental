import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import User from "../models/users/user.schema.js";
/**
 * @type {Object}
 * @description Configuration options for JWT strategy
 * @property {Function} jwtFromRequest - Function to extract JWT from request
 * @property {String} secretOrKey - Secret key to verify JWT signature
 */
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

/**
 * @description Configure passport with JWT strategy
 * @param {Object} passport - Passport instance
 * @returns {void}
 */
const jwtStrategy = (passport) => {
  passport.use(
    new JwtStrategy(options, async (jwt_payload, done) => {
      try {
        /**
         * @type {Object|null}
         * @description Find user by ID from JWT payload
         */
        const user = await User.findById(jwt_payload._id);
        /**
         * @description Return user if found
         */
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      } catch (err) {
         /**
         * @description Return error if exception occurs
         */
        return done(err, false);
      }
    })
  );
};

export { jwtStrategy };
