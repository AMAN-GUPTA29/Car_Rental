/**
 * @import bcrypt and User schema
 */
import bcrypt from "bcryptjs";
import User from "../../models/users/user.schema.js";

/**
 * @description Controller function to handle user login
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Returns login response with auth token
 */
const loginController = async (req, res) => {

  /**
   * @type {String} email - User's email from request body
   * @type {String} password - User's password from request body
   */
  const { email, password } = req.body;

  try {
   console.log("dc");
   /**
    * @type {Object|null}
    * @description Finding the user in database by email
    */
    const user = await User.findOne({ email });

     /**
     * @description Return error if user not found
     */
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    if (user.blocked) {
      return res.status(404).json({ message: "User is blocked" });
    }

    if (!user.authorise) {
      return res.status(404).json({ message: "User is not authorised" });
    }


    /**
     * @type {Boolean}
     * @description Compare provided password with stored hash
     */
    const isMatch = await bcrypt.compare(password, user.password);

    /**
     * @description Return error if password doesn't match
     */
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials!" });
    }
    
   /**
     * @type {String}
     * @description Generate JWT token for authentication
     */

    const token = user.generateAuthToken(user);

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 3600000 * 24, 
      secure:"false"
    });

    
     /**
     * @description Return success response with token and user data
     */
    res.status(200).json({
      message: "Login successful!",
      token,
      user: {
        id: user._id,
        username: user.userName,
        email: user.email,
        phone:user.phone,
        role:user.role,
        aadhar:user.aadhar
      },
    });
  } catch (err) {
     /**
     * @description Log and return error response
     */
    console.error("Error during login:", err.message);
    res.status(500).json({ message: "Internal server error", error:err.message });
  }
};

export { loginController };
