import passport from "passport";

function authenticateJwt(req, res, next) {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      console.error("Passport error:", err);
      return res.status(500).json({ message: "Internal server error", error: err });
    }
    if (!user) {
      console.error("Unauthorized access:", info);
      return res.status(401).json({ message: "Unauthorized access", info });
    }

    req.user = user; // Attach authenticated user to request object
    next(); // Pass control to next middleware/route handler
  })(req, res, next);
}

export default authenticateJwt;
