/**
 * @import Bidding and History schemas for database operations
 * @import ObjectId for MongoDB ID handling
 * @import startkm controller (though not used in this function)
 */
import Bidding from "../../models/bookings/booking.schema.js";
import History from "../../models/bookings/history.schema.js"
import { ObjectId } from "mongodb";
import { startkm } from "./startkm.controller.js";


/**
 * @description Controller to update the end kilometer reading for a booking and create a history entry
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Returns success or error message
 */
const updateBiddingEndKm = async (req, res) => {
  try {

    /**
     * @type {String}
     * @description ID of the booking to update
     */
    const { biddingId } = req.params; 

    /**
     * @type {String}
     * @description End kilometer reading from query parameters
     */
    const { endKm } = req.query; 

    /**
     * @type {Number}
     * @description Parse end kilometer reading to a number
     */
    const parsedEndKm = Number(endKm);

    /**
     * @type {Object}
     * @description Find and update the booking with end kilometer reading
     */
    const originalBidding = await Bidding.findOneAndUpdate(
      { _id: new ObjectId(String(biddingId)) },
      { $set: { endkm: parsedEndKm } },
      { returnDocument: 'after' } // Get document before update
    );

    /**
     * @description Handle case when booking is not found
     */
    if (!originalBidding) {
      return res.status(404).json({ error: "Bidding not found" });
    }
    
    /**
     * @description Calculate the duration of the booking in days
     */
    const startDate = new Date(originalBidding.startDate);
    const endDate = new Date(originalBidding.endDate);
    const differenceInMilliseconds = endDate - startDate;
    const differenceInDays = Math.ceil(differenceInMilliseconds / (1000 * 3600 * 24)) + 1;
    
    let finalamount = parseFloat(originalBidding.bidAmount);
    let extrakm = parsedEndKm - originalBidding.startkm - (differenceInDays * 100);
    extrakm = extrakm > 0 ? extrakm / differenceInDays : 0;

    if (extrakm > 0) {
      let increment = originalBidding.bookType === "outstation" ? 100 : 50;
      let additionalCharge = 0;
      let remainingKm = extrakm;

      while (remainingKm > 0) {
        additionalCharge += increment;
        increment += originalBidding.bookType === "outstation" ? 100 : 50;
        remainingKm -= 100;
      }

      finalamount += additionalCharge * differenceInDays;
    }


    
    /**
     * @description Create a new history entry
     */
    const historyEntry = new History({
      biddingId: originalBidding._id,
      bidAmount: finalamount,
      biddingDate:originalBidding.biddingDate,
      status:originalBidding.status,
      bookType:originalBidding.bookType,
      startDate:originalBidding.startDate,
      endDate:originalBidding.endDate,
      endkm:originalBidding.endkm,
      startkm:originalBidding.startkm,
      paid:false,
      carData:originalBidding.carData,
      images:originalBidding.images,
      ownerDetails:originalBidding.ownerDetails,
      bookerData:originalBidding.bookerData
      
    });
    
    /**
     * @description Save the history entry
     */
    await historyEntry.save();

     /**
     * @description Return success response
     */
    return res.status(200).json({
      message: "Bidding updated successfully",
      updatedCount: originalBidding,
    });
  } catch (error) {
    /**
     * @description Log and return error response
     */
    console.error("Error updating bidding:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export {updateBiddingEndKm}
