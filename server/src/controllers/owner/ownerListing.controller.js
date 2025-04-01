
/**
 * @import Listing schema for database operations
 * @import Listing validation utility
 * @import Mongoose for MongoDB operations
 */
import Listing from "../../models/bookings/listing.schema.js";
import { validateListing } from "../../utils/index.js";
import mongoose from "mongoose";

/**
 * @description Controller to create a new car listing
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Returns success or error message
 */
const listingController = async (req, res) => {
  console.log("sccs")
  
  try {
    console.log(req.body);
     /**
     * @type {Object}
     * @description Parse JSON strings in request body
     */
    const parsedBody = {
      ...req.body,
      ownerDetails: JSON.parse(req.body.ownerDetails), // Convert to object
      carData: JSON.parse(req.body.carData), // Convert to object
    };

      /**
     * @description Validate listing data against schema
     */
    const { error } = validateListing(parsedBody);
    if (error) {
        console.log(error)
        return res.status(400).json({ error: error, message: "Validation failed" });
      }

       /**
     * @description Convert owner ID string to MongoDB ObjectId
     */
    parsedBody.ownerDetails.ownerID = new mongoose.Types.ObjectId(
      parsedBody.ownerDetails.ownerID
    );

     /**
     * @description Create and save new listing
     */
    const newListing = new Listing(parsedBody);
    await newListing.save();

    /**
     * @description Return success response
     */
    res.status(201).send({ message: "vehicle Listed succesfully" });
  } catch (err) {
        /**
     * @description Log and return error response
     */

    console.error("Error during listing:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export { listingController };
