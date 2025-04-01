/**
 * @import bcryp 
 * @import user schema
 * @import validate user for validating schema
 */
import bcrypt from "bcryptjs";
import User from "../../models/users/user.schema.js";
import { validateUser } from "../../utils/index.js";

import dotenv from "dotenv";
dotenv.config();


/**
 * @description Controller function to handle user registration
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Returns signup response
 */
const signupController = async (req, res) => {
  console.log(req.body);
  /**
   * @type {Object}
   * @description Validate user input against schema
   */
  const { error } = validateUser(req.body);

  /**
   * @description Return error if validation fails
   */
  if (error) {
    console.log(error);
    return res.status(400).json({ error: error, message: "Validation failed" });
  }
  console.log(req.body)
  try {
     /**
     * @type {String} userName - User's name
     * @type {String} email - User's email
     * @type {String} phone - User's phone number
     * @type {String} password - User's password
     * @type {String} role - User's role
     * @type {String} aadhar - User's aadhar number
     * @type {Boolean} authorise - User's authorization status
     * @type {Boolean} blocked - User's blocked status
     */
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

    /**
     * @type {Object|null}
     * @description Check if user already exists in database
     */
    const existingUser = await User.findOne({ email });

    /**
     * @description Return error if user already exists
     */
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    /**
     * @type {String}
     * @description Generate salt for password hashing
     */
    const salt = await bcrypt.genSalt(Number(process.env.SALT));

     /**
     * @type {String}
     * @description Hash password with salt
     */
    const hashedPassword = await bcrypt.hash(password, salt);

     /**
     * @description Create and save new user to database
     */
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
    /**
     * @description Return success response
     */

    res.status(201).send({ message: "User created Succesfully" });
  } catch (error) {
    /**
     * @description Return error response
     */
    res.status(500).send({ error, message: "internl server error" });
  }
};

export default signupController;
