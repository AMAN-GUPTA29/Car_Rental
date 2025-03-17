import bcrypt from "bcryptjs";
import User from "../../models/users/user.schema.js"; // Import your User model

const loginController = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials!" });
    }

    // Generate JWT token
    
    const token = user.generateAuthToken(user);

    // Send response with token and user info
    res.status(200).json({
      message: "Login successful!",
      token,
      user: {
        id: user._id,
        username: user.userName,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Error during login:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export { loginController };
