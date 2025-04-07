import Bidding from "../../models/bookings/booking.schema.js";
import History from "../../models/bookings/history.schema.js";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import {sendMail} from "../../utils/nodemailer.js";

/**
 * @description Controller function to update bid status (accept/reject)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
const updateBidStatus = async (req, res) => {
  try { 
    console.log(req.body);
    /**
     * @type {String} biddingId - ID of the bid to update
     * @type {String} listingId - ID of the car listing
     * @type {Boolean} accepted - Whether the bid is accepted or rejected
     */
    const { biddingId, listingId, accepted } = req.body;

     /**
     * @type {mongoose.ClientSession}
     * @description Start MongoDB session for transaction
     */
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
       /**
       * @type {Object}
       * @description Find and update the status of the current bid
       */
      const currentBid = await Bidding.findByIdAndUpdate(
        biddingId,
        { status: accepted ? "accepted" : "rejected" },
        { new: true, session }
      );
      /**
       * @description Throw error if bid not found
       */
      if (!currentBid) {
        throw new Error("Bid not found");
      }

      /**
       * @description Send email notification about bid status
       */
      await sendMail(currentBid, accepted);
      /**
       * @description Handle accepted bid case
       */

      if (accepted) {
        /**
         * @type {Array}
         * @description Find all pending bids that overlap with the accepted bid
         */
        const overlappingBids = await Bidding.find({
          "carData.listingId": new ObjectId(String(listingId)),
          _id: { $ne: biddingId },
          startDate: { $lte: currentBid.endDate },
          endDate: { $gte: currentBid.startDate },
          status: "pending",
        }).session(session);

        /**
         * @description Process each overlapping bid
         */
        for (const bid of overlappingBids) {
          /**
           * @description Update bid status to rejected
           */
          bid.status = "rejected";
          await bid.save({ session });

          /**
           * @description Send rejection email
           */
          await sendMail(currentBid, false);

          /**
           * @type {Object}
           * @description Create history entry for rejected bid
           */
          const historyEntry = new History({
            biddingId: bid._id,
            carData: bid.carData,
            bidAmount:bid.bidAmount,
            biddingDate:bid.biddingDate,
            bookerData:bid.bookerData,
            bookType:bid.bookType,
            startDate:bid.startDate,
            endDate:bid.endDate,
            startkm:bid.startkm,
            endkm:bid.endkm,
            paid:false,
            status: "rejected",
            images:bid.images,
            ownerDetails:bid.ownerDetails
          });
          
          await historyEntry.save({ session });
        }
      } else {
         /**
         * @type {Object}
         * @description Create history entry for rejected bid
         */
        const historyEntry = new History({
          biddingId: currentBid._id,         
            carData: currentBid.carData,
            bidAmount:currentBid.bidAmount,
            biddingDate:currentBid.biddingDate,
            bookerData:currentBid.bookerData,
            bookType:currentBid.bookType,
            startDate:currentBid.startDate,
            endDate:currentBid.endDate,
            startkm:currentBid.startkm,
            endkm:currentBid.endkm,
            paid:false,
            status: "rejected",
            images:currentBid.images,
            ownerDetails:currentBid.ownerDetails

        });
        await historyEntry.save({ session });
      }
      /**
       * @description Commit transaction after all operations succeed
       */
      await session.commitTransaction();
      
       /**
       * @type {Array}
       * @description Get remaining pending bids for the listing
       */
      const pendingBids = await Bidding.find({
        "carData.listingId": listingId,
        status: "pending",
      });

      /**
       * @description Send success response with pending bids
       */
      res.status(200).json({
        message: accepted ? "Bid accepted" : "Bid rejected",
        pendingBids: pendingBids,
      });
    } catch (error) {
      /**
       * @description Log error and abort transaction
       */
      console.log(error)
      await session.abortTransaction();
      res.status(500).json({ message: error});
    } finally {
       /**
       * @description End session regardless of outcome
       */
      
      session.endSession();
    }
  } catch (error) {
     /**
     * @description Handle errors outside of transaction
     */
    res.status(500).json({ message: "Internal server error" });
  }
};

export { updateBidStatus };
