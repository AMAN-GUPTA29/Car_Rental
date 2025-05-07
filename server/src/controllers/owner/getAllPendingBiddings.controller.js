/**
 * @module getAllPendingBiddingsOwner
 * @description Controller for retrieving all pending biddings for a specific owner across all their car listings
 */

import Listing from "../../models/bookings/listing.schema.js";
import Bidding from "../../models/bookings/booking.schema.js"
import User from "../../models/users/user.schema.js";

/**
 * @function getAllPendingBiddingsOwner
 * @description Get all pending biddings for a specific owner across all their car listings
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with all pending biddings
 */
export const getAllPendingBiddingsOwner = async (req, res) => {
  try {
    const ownerId = req.params.ownerId;
    
    // First, get all listings owned by this owner
    const ownerListings = await Bidding.find({ 
      "ownerDetails.ownerID": ownerId,

    });

    
    
    if (!ownerListings || ownerListings.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No listings found for this owner",
        biddings: []
      });
    }
    const biddingsWithCarData = ownerListings.filter(listing => listing.status === "pending");

    // Get the listing IDs
    // const listingIds = ownerListings.map(listing => listing._id);

    // // Now get all pending bids for these listings
    // const pendingBiddings = await Bidding.find({
    //   listingId: { $in: listingIds },
    //   status: "pending"
    // }).populate('userId', 'name email aadharNumber');

    // // Map the biddings to include car data
    // const biddingsWithCarData = await Promise.all(pendingBiddings.map(async (bid) => {
    //   // Find the car listing details
    //   const listing = ownerListings.find(listing => listing._id.toString() === bid.listingId.toString());
    //   a87+9
    //   // Get owner details
    //   const owner = await User.findById(ownerId);

    //   // Format the response
    //   return {
    //     _id: bid._id,
    //     bidAmount: bid.bidAmount,
    //     startDate: bid.startDate,
    //     endDate: bid.endDate,
    //     bookType: bid.tripType,
    //     status: bid.status,
    //     startkm: bid.startKm,
    //     endkm: bid.endKm,
    //     ownerDetails: {
    //       ownerId: owner._id,
    //       ownerEmail: owner.email,
    //       ownerName: owner.name
    //     },
    //     carData: {
    //       listingId: listing._id,
    //       carMake: listing.carMake,
    //       carModel: listing.carModel,
    //       carYear: listing.carYear,
    //       carColor: listing.carColor,
    //       carCategory: listing.carCategory,
    //       carTransmission: listing.carTransmission,
    //       basePrice: listing.basePrice,
    //       outstationPrice: listing.outstationPrice,
    //       carMileage: listing.carMileage,
    //       carAddress: listing.carAddress
    //     },
    //     bookerData: {
    //       bookerId: bid.userId._id,
    //       bookerName: bid.userId.name,
    //       aadhar: bid.userId.aadharNumber
    //     },
    //     images: listing.images
    //   };
    // }));

    // console.log("qwwaw",biddingsWithCarData);

    return res.status(200).json({
      success: true,
      message: "All pending biddings retrieved successfully",
      biddings: biddingsWithCarData
    });
    
  } catch (error) {
    console.error("Error in getAllPendingBiddingsOwner:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
}; 