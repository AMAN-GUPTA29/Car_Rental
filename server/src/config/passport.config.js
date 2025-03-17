import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import User from "../models/users/user.schema.js"; // Import your Admin model

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract token from Authorization header
  secretOrKey: process.env.JWT_SECRET, // Use the same secret key as in generateAuthToken
};

const jwtStrategy = (passport) => {
  passport.use(
    new JwtStrategy(options, async (jwt_payload, done) => {
      try {
        const user = await User.findById(jwt_payload._id); // Find admin by ID in payload
        if (user) {
          return done(null, user); // Pass authenticated admin to the next middleware
        }
        return done(null, false); // No admin found
      } catch (err) {
        return done(err, false); // Handle errors
      }
    })
  );
};

export { jwtStrategy };
