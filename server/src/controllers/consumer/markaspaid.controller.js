/**
 * @import History schema for database operations
 * @import Mongoose for MongoDB operations
 * @import ObjectId for MongoDB ID handling
 */
import History from "../../models/bookings/history.schema.js";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";

/**
 * @description Controller to mark a booking as paid in the history
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Returns success or error message
 */
const markBookingAsPaidController = async (req, res) => {
    try {

        /**
         * @type {String}
         * @description ID of the history entry to mark as paid
         */
        const { historyId } = req.params;

         /**
         * @description Validate history ID format
         */
        
        if (!mongoose.Types.ObjectId.isValid(historyId)) {
            return res.status(400).json({ message: "Invalid booking ID format" });
        }

        console.log(historyId);
        /**
         * @type {Object}
         * @description Update the history entry to mark it as paid
         */
        const result = await History.updateOne(
            { _id: new ObjectId(historyId) },
            { $set: { paid: true} }
        );

         /**
         * @description Handle case when history entry is not found
         */
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "Booking not found" });
        }


         /**
         * @description Return success response
         */
        res.status(200).json({
            success: true,
            message: "Payment status updated successfully",
            updated: result.modifiedCount
        });

    } catch (error) {
        /**
         * @description Log and return error response
         */
        console.error("Error in markBookingAsPaid:", error);
        res.status(500).json({
            success: false,
            message: "Error updating payment status",
            error: error.message
        });
    }
};

export { markBookingAsPaidController };
