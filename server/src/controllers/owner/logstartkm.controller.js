/**
 * @import Bidding schema for database operations
 * @import ObjectId for MongoDB ID handling
 */
import Bidding from "../../models/bookings/booking.schema.js";
import { ObjectId } from "mongodb";

/**
 * @description Controller to update the start kilometer reading for a booking
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Returns success or error message
 */
const updateBiddingStartKm = async (req, res) => {
  try {

     /**
     * @type {String}
     * @description ID of the booking to update
     */
    const { biddingId } = req.params; 

    /**
     * @type {String}
     * @description Start kilometer reading from query parameters
     */
    const { startKm } = req.query; 

    console.log(biddingId,startKm);

    /**
     * @type {Number}
     * @description Parse start kilometer reading to a number
     */
    const parsedStartKm = Number(startKm);

    /**
     * @type {Object}
     * @description Update the start kilometer reading in the database
     */
    const result = await Bidding.updateOne(
      { _id: new ObjectId(String(biddingId)) }, 
      { $set: { startkm: parsedStartKm } } 
    );

    /**
     * @description Handle case when booking is not found
     */
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Bidding not found" });
    }

     /**
     * @description Return success response
     */
    return res.status(200).json({
      message: "Bidding updated successfully",
      updatedCount: result.modifiedCount,
    });
  } catch (error) {
     /**
     * @description Log and return error response
     */
    console.error("Error updating bidding:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export {updateBiddingStartKm}
