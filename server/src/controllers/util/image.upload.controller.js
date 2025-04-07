
/**
 * @import Listing schema for database operations
 * @import Listing validation utility
 * @import Mongoose for MongoDB operations
 */
// import Listing from "../../models/bookings/listing.schema.js";
// import { validateListing } from "../../utils/index.js";
// import mongoose from "mongoose";

/**
 * @description Controller to create a new car listing
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Returns success or error message
 */
const imageController = async (req, res) => {
  console.log("sccs")
  
  try {
    console.log("img",req.body);
     /**
     * @type {Object}
     * @description Parse JSON strings in request body
     */
    const parsedBody = {
      ...req.body,
    };

  

  

    /**
     * @description Return success response
     */
    res.status(201).send({ data:parsedBody });
  } catch (err) {
        /**
     * @description Log and return error response
     */

    console.error("Error during listing:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export { imageController };
