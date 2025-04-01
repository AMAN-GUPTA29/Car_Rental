/**
 * @import Bidding schema for database operations
 * @import Mongoose for MongoDB operations
 * @import ObjectId for MongoDB ID handling
 */
import Bidding from "../../models/bookings/booking.schema.js";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";

/**
 * @description Controller to fetch all pending bids for a specific car listing with pagination
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Returns paginated bidding data
 */
const viewAllBiddingParticularCar = async(req,res)=>{

    try {

      /**
         * @type {String}
         * @description ID of the car listing to fetch bids for
         */
        const {listingId}=req.params;

        /**
         * @type {Number}
         * @description Current page number, defaults to 1
         */
        const page = parseInt(req.query.page) || 1;

        /**
         * @type {Number}
         * @description Number of bids per page
         */
        const limit = 10;
        console.log(listingId)
         /**
         * @description Validate listing ID
         */
        if(!listingId){
            return res.status(400).json({ message: "Listing ID is required." });
        }

        
        /**
         * @type {Array}
         * @description MongoDB aggregation pipeline for filtering, sorting, and pagination
         */
        const aggregationPipeline = [
          {
            $match: {
              "carData.listingId": new ObjectId(String(listingId)),
              "status":"pending"
            },
          },
          {
              $sort: { biddingDate: -1 }
          },
          {
              $facet: {
                metadata: [
                  { $count: "totalBiddings" }
                ],
                data: [
                  { $skip: (page - 1) * limit },
                  { $limit: limit }
                ]
              }
          },
          {
              $project: {
                biddings: "$data",
                totalBiddings: { $ifNull: [{ $arrayElemAt: ["$metadata.totalBiddings", 0] }, 0] },
                totalPages: {
                  $ceil: {
                    $divide: [
                      { $ifNull: [{ $arrayElemAt: ["$metadata.totalBiddings", 0] }, 0] },
                      limit
                    ]
                  }
                },
                page: { $literal: page }
              }
          }
        ];

         /**
         * @type {Array}
         * @description Execute aggregation and get first result
         */
        const [result] = await Bidding.aggregate(aggregationPipeline);

        /**
         * @description Return success response with paginated biddings
         */
        res.status(200).json({
            message: "Car Biddings fetched successfully.",
            page: result.page,
            totalPages: result.totalPages,
            totalListings: result.totalBiddings,
            biddings: result.biddings
          });


    } catch (error) {
       /**
         * @description Return error response
         */
        res.status(500).json({ message: "Internal server error", error: error.message });

    }

}

export {viewAllBiddingParticularCar};