/**
 * @import Bidding schema for database operations
 * @import Mongoose for MongoDB operations
 */
import Bidding from "../../models/bookings/booking.schema.js";
import mongoose from "mongoose";

/**
 * @description Controller to fetch approved bids for a specific owner with filtering and pagination
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Returns filtered and paginated approved bids
 */
const getApprovedBidsOwner = async (req, res) => {
    try {

         /**
         * @type {String}
         * @description ID of the owner to fetch approved bids for
         */
        const { ownerId } = req.params;

                /**
         * @type {Object}
         * @description Query parameters for filtering and pagination
         */

        const { 
            page = 1, 
            limit = 10,
            category,
            transmission,
            startDate,
            endDate,
            minBidPrice
        } = req.query;
        console.log(req.query)
        
        /**
         * @description Validate owner ID format
         */
        if (!mongoose.Types.ObjectId.isValid(ownerId)) {
            return res.status(400).json({ message: "Invalid owner ID format" });
        }

          /**
         * @type {Object}
         * @description Base match criteria for MongoDB aggregation
         */
        const matchStage = {
            "ownerDetails.ownerID": new mongoose.Types.ObjectId(ownerId),
            status: "accepted"
        };

        
       
        console.log(minBidPrice)
        

         /**
         * @description Add car category filter if provided
         */
        if (category) matchStage["carData.carCategory"] = category;


        /**
         * @description Add transmission type filter if provided
         */
        if (transmission) matchStage["carData.carTransmission"] = transmission;
        
          /**
         * @description Add date range filters if provided
         */
        if (startDate || endDate) {
            matchStage.startDate = {};
            matchStage.endDate = {};
            if (startDate) matchStage.startDate.$gte = new Date(startDate);
            if (endDate) matchStage.endDate.$lte = new Date(endDate);
        }
        
        /**
         * @description Add minimum bid price filter if provided
         */
        if (minBidPrice) matchStage.bidAmount = { $gte: parseFloat(minBidPrice) };

        /**
         * @type {Array}
         * @description MongoDB aggregation pipeline for filtering, sorting, and pagination
         */
        const aggregationPipeline = [
            { $match: matchStage },
            { $sort: { biddingDate: -1 } },
            { 
                $facet: {
                    paginatedResults: [
                        { $skip: (page - 1) * limit },
                        { $limit: parseInt(limit) },
                        {
                            $project: {
                                _id: 1,
                                bidAmount: 1,
                                biddingDate: 1,
                                carData: 1,
                                ownerDetails: 1,
                                status: 1,
                                startDate:1,
                                endDate:1
                            }
                        }
                    ],
                    totalCount: [
                        { $count: "count" }
                    ]
                }
            },
            {
                $project: {
                    bids: "$paginatedResults",
                    totalItems: { $arrayElemAt: ["$totalCount.count", 0] }
                }
            }
        ];

        /**
         * @type {Array}
         * @description Execute aggregation and get first result
         */
        const [result] = await Bidding.aggregate(aggregationPipeline);

         /**
         * @description Return success response with paginated data
         */
        res.json({
            bids: result.bids || [],
            totalItems: result.totalItems || 0,
            totalPages: Math.ceil((result.totalItems || 0) / limit),
            currentPage: parseInt(page),
            itemsPerPage: parseInt(limit)
        });

    } catch (error) {
          /**
         * @description Log and return error response
         */
        console.error("Error in getApprovedBidsOwner:", error);
        res.status(500).json({
            message: "Error retrieving approved bids",
            error: error.message
        });
    }
};


export {getApprovedBidsOwner}