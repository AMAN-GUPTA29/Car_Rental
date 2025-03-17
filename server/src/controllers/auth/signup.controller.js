import bcrypt from "bcryptjs";
import User from "../../models/users/user.schema.js";
import { validateUser } from "../../utils/index.js";

import dotenv from "dotenv";
dotenv.config();

const signupController = async (req, res) => {
  const { error } = validateUser(req.body);

  if (error) {
    return res.status(400).json({ error: error, message: "Validation failed" });
  }

  try {
    const {
      userName,
      email,
      phone,
      password,
      role,
      aadhar,
      authorise,
      blocked,
    } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(hashedPassword);
    await new User({
      userName,
      email,
      phone,
      role,
      aadhar,
      authorise,
      blocked,
      password: hashedPassword,
    }).save();
    res.status(201).send({ message: "User created Succesfully" });
  } catch (error) {
    res.status(500).send({ error, message: "internl server error" });
  }
};

export default signupController;
