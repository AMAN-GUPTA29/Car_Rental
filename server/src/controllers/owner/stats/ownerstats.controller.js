/**
 * @import History and Bidding schemas for database operations
 * @import Mongoose for MongoDB operations
 * @import ObjectId for MongoDB ID handling
 * @import CAR_CATEGORIES constant
 */
import History from "../../../models/bookings/history.schema.js";
import Bidding from "../../../models/bookings/booking.schema.js";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import { CAR_CATEGORIES } from "../../../utils/constant.js";


/**
 * @description Controller to get owner's recent earnings for the last 14 days
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Returns earnings data for the last 14 days
 */
const getOwnerRecentEarningsController = async (req, res) => {
    try {
        const { ownerId } = req.params;

        // Validate owner ID
        if (!mongoose.Types.ObjectId.isValid(ownerId)) {
            return res.status(400).json({ message: "Invalid owner ID format" });
        }

        // Calculate date range
        const endDate = new Date();
        endDate.setHours(23, 59, 59, 999); // End of today
        const startDate = new Date(endDate);
        startDate.setDate(endDate.getDate() - 13); // Last 14 days inclusive
        startDate.setHours(0, 0, 0, 0);

        const aggregationPipeline = [
            {
                $match: {
                    "ownerDetails.ownerID": new mongoose.Types.ObjectId(String(ownerId)),
                    biddingDate: { $gte: startDate, $lte: endDate },
                    status: "accepted"
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$biddingDate"
                        }
                    },
                    totalEarnings: { $sum: { $toDouble: "$bidAmount" } }
                }
            },
            {
                $project: {
                    _id: 0,
                    date: "$_id",
                    earnings: { $round: ["$totalEarnings", 2] }
                }
            }
        ];

        const aggregationResult = await History.aggregate(aggregationPipeline);

        // Generate 14-day date range
        const days = Array.from({ length: 14 }, (_, i) => {
            const date = new Date(startDate);
            date.setDate(date.getDate() + i);
            return date.toISOString().split("T")[0];
        });

        // Create earnings map
        const earningsMap = new Map(
            aggregationResult.map(item => [item.date, item.earnings])
        );

        // Fill earnings array with 0 for missing days
        const earnings = days.map(date => earningsMap.get(date) || 0);

        res.status(200).json({
            message: "14-day earnings retrieved successfully",
            statistics: {
                days,
                earnings
            }
        });

    } catch (error) {
        console.error("Error in getOwnerRecentEarnings:", error);
        res.status(500).json({
            message: "Error retrieving earnings data",
            error: error.message
        });
    }
};


/**
 * @description Controller to get owner's recent earnings for the last 14 days
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Return avg of user and plateform bidding
 */
const getUserAndAvgBidsController = async (req, res) => {
    try {
        const { ownerId } = req.params;
        const { startDate, endDate } = req.query;
        
        // Validate inputs
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (isNaN(start) || isNaN(end)) {
            return res.status(400).json({ message: "Invalid date format" });
        }

      
        // Generate 7-day date range
        const days = Array.from({ length: end.getDate()-start.getDate()+1 }, (_, i) => {
            const date = new Date(end);
            date.setDate(date.getDate() - i);
            return date.toISOString().split("T")[0];
        }).reverse();

        const aggregationPipeline = [
            {
                $match: {
                    biddingDate: { $gte: start, $lte: end },
                    status:"accepted"
                }
            },
            {
                $addFields: {
                    dateStr: { $dateToString: { format: "%Y-%m-%d", date: "$biddingDate" } },
                    isUserBid: { $eq: ["$ownerDetails.ownerID", new ObjectId(String(ownerId))] }
                }
            },
            {
                $group: {
                    _id: "$dateStr",
                    totalBids: { $sum: { $toDouble: "$bidAmount" } },
                    userBids: { 
                        $sum: {
                            $cond: [
                                { $eq: ["$ownerDetails.ownerID", new ObjectId(String(ownerId))] },
                                { $toDouble: "$bidAmount" },
                                0
                            ]
                        }
                    },
                    uniqueUsers: { $addToSet: "$ownerDetails.ownerID" }
                }
            },
            {
                $project: {
                    _id: 0,
                    date: "$_id",
                    totalBids: 1,
                    userBids: 1,
                    userCount: { $size: "$uniqueUsers" }
                }
            }
        ];

        const aggregationResult = await History.aggregate(aggregationPipeline);
        

        // Create maps for fast lookup
        const totalBidsMap = new Map();
        const userBidsMap = new Map();
        const userCountMap = new Map();

        

        aggregationResult.forEach(item => {
            totalBidsMap.set(item.date, item.totalBids);
            userBidsMap.set(item.date, item.userBids);
            userCountMap.set(item.date, item.userCount);
        });

        

        // Generate results for all days
        const result = days.map(date => ({
            date,
            userBidAmount: userBidsMap.get(date) || 0,
            avgBidAmount: (totalBidsMap.get(date) || 0) / (userCountMap.get(date) || 1)
        }));

     
        res.status(200).json({
            message: "User and average bids retrieved successfully",
            statistics: {
                days: result.map(item => item.date),
                userBidAmounts: result.map(item => item.userBidAmount),
                avgBidAmounts: result.map(item => item.avgBidAmount)
            }
        });

    } catch (error) {
        console.error("Error in getUserAndAvgBids:", error);
        res.status(500).json({
            message: "Error retrieving bid statistics",
            error: error.message
        });
    }
};

/**
 * @description Controller to get owner's recent earnings for the last 14 days
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Return bids per day of the weeks
 */
const getBidsPerDayOfWeekController = async (req, res) => {
    try {
        const { ownerId } = req.params;
        const { startDate, endDate } = req.query;

       
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (isNaN(start) || isNaN(end)) {
            return res.status(400).json({ message: "Invalid date format" });
        }
        if (!mongoose.Types.ObjectId.isValid(ownerId)) {
            return res.status(400).json({ message: "Invalid owner ID format" });
        }

        
        const dayOrder = [
            "Monday", "Tuesday", "Wednesday", 
            "Thursday", "Friday", "Saturday", "Sunday"
        ];

        const aggregationPipeline = [
            {
                $match: {
                    "ownerDetails.ownerID": new mongoose.Types.ObjectId(ownerId),
                    biddingDate: { $gte: start, $lte: end }
                }
            },
            {
                $addFields: {
                    dayOfWeek: { $isoDayOfWeek: "$biddingDate" } 
                }
            },
            {
                $group: {
                    _id: "$dayOfWeek",
                    totalAmount: { $sum: { $toDouble: "$bidAmount" } }
                }
            },
            {
                $project: {
                    _id: 0,
                    dayNumber: "$_id",
                    totalAmount: { $round: ["$totalAmount", 2] }
                }
            }
        ];

        const aggregationResult = await Bidding.aggregate(aggregationPipeline);

        // Initialize with zeros
        const bidAmounts = new Array(7).fill(0);
        
        
        aggregationResult.forEach(item => {
            const index = item.dayNumber - 1; 
            if (index >= 0 && index < 7) {
                bidAmounts[index] = item.totalAmount;
            }
        });

        res.status(200).json({
            message: "Weekly bid statistics retrieved successfully",
            statistics: {
                labels: dayOrder,
                bidAmounts
            }
        });

    } catch (error) {
        console.error("Error in getBidsPerDayOfWeek:", error);
        res.status(500).json({
            message: "Error retrieving weekly bid statistics",
            error: error.message
        });
    }
};

/**
 * @description Controller to get owner's recent earnings for the last 14 days
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Bids per day owner controller
 */
const getBidsPerDayOwnerController = async (req, res) => {
    
    try {
        const { ownerId } = req.params;
       
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 6);
        const aggregationPipeline = [
            {
                $match: {
                    "ownerDetails.ownerID": new ObjectId(String(ownerId)),
                    biddingDate: { $gte: sevenDaysAgo, $lte: today }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$biddingDate"
                        }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    date: "$_id",
                    count: 1
                }
            }
        ];

        const aggregationResult = await Bidding.aggregate(aggregationPipeline);

        const days = Array.from({ length: 7 }, (_, i) => {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            return date.toISOString().split("T")[0];
        }).reverse();

        const bidsMap = new Map(
            aggregationResult.map(item => [item.date, item.count])
        );
           
        const bidCounts = days.map(date => bidsMap.get(date) || 0);

        res.status(200).json({
            message: "Bid statistics retrieved successfully",
            statistics: {
                days,
                bidCounts
            }
        });

    } catch (error) {
        console.error("Error in getBidsPerDayOwner:", error);
        res.status(500).json({
            message: "Error retrieving bid statistics",
            error: error.message
        });
    }
};

/**
 * @description Controller to get owner's recent earnings for the last 14 days
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Returns category booking count
 */
const getCategoryBookingCountsController = async (req, res) => {
    try {
        const { ownerId } = req.params;
        const { startDate, endDate } = req.query;

        // Validate inputs
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (isNaN(start) || isNaN(end)) {
            return res.status(400).json({ message: "Invalid date format" });
        }
        if (!mongoose.Types.ObjectId.isValid(ownerId)) {
            return res.status(400).json({ message: "Invalid owner ID format" });
        }

        const aggregationPipeline = [
            {
                $match: {
                    "ownerDetails.ownerID": new mongoose.Types.ObjectId(String(ownerId)),
                    biddingDate: { $gte: start, $lte: end }
                }
            },
            {
                $group: {
                    _id: "$carData.carCategory",
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    category: "$_id",
                    count: 1
                }
            }
        ];

        const aggregationResult = await Bidding.aggregate(aggregationPipeline);

        const categoryMap = new Map(
            aggregationResult.map(item => [item.category, item.count])
        );

        const bookings = CAR_CATEGORIES.map(category => 
            categoryMap.get(category) || 0
        );

        res.status(200).json({
            message: "Category booking counts retrieved successfully",
            statistics: {
                categories: CAR_CATEGORIES,
                bookings
            }
        });

    } catch (error) {
        console.error("Error in getCategoryBookingCounts:", error);
        res.status(500).json({
            message: "Error retrieving category booking counts",
            error: error.message
        });
    }
};

/**
 * @description Controller to get owner's recent earnings for the last 14 days
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Returns top car modal
 */
const getTopCarModelsController = async (req, res) => {
    try {

        
        const { ownerId } = req.params;
        const { startDate, endDate } = req.query;

        // Validate inputs
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (isNaN(start) || isNaN(end)) {
            return res.status(400).json({ message: "Invalid date format" });
        }
        if (!mongoose.Types.ObjectId.isValid(ownerId)) {
            return res.status(400).json({ message: "Invalid owner ID format" });
        }

        const aggregationPipeline = [
            {
                $match: {
                    status: "accepted",
                    biddingDate: { $gte: start, $lte: end }
                }
            },
            {
                $facet: {
                    ownerModels: [
                        {
                            $match: {
                                "ownerDetails.ownerID": new mongoose.Types.ObjectId(ownerId)
                            }
                        },
                        {
                            $group: {
                                _id: {
                                    make: "$carData.carMake",
                                    model: "$carData.carModel"
                                },
                                count: { $sum: 1 }
                            }
                        },
                        { $sort: { count: -1 } },
                        { $limit: 5 },
                        {
                            $project: {
                                _id: 0,
                                carModel: { 
                                    $concat: ["$_id.model"] 
                                },
                                count: 1
                            }
                        }
                    ],
                    platformStats: [
                        {
                            $group: {
                                _id: null,
                                totalBids: { $sum: 1 },
                                uniqueModels: {
                                    $addToSet: {
                                        make: "$carData.carMake",
                                        model: "$carData.carModel"
                                    }
                                }
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                totalBids: 1,
                                modelCount: { $size: "$uniqueModels" }
                            }
                        }
                    ]
                }
            },
            {
                $project: {
                    ownerModels: 1,
                    platformStats: { $arrayElemAt: ["$platformStats", 0] }
                }
            }
        ];

        const [result] = await Bidding.aggregate(aggregationPipeline);
        console.log(result);
        // Calculate platform average
        const platformStats = result.platformStats || {};
        const avgBidPerModel = platformStats.modelCount > 0 
            ? (platformStats.totalBids || 0) / platformStats.modelCount 
            : 0;

        // Prepare owner models data
        const ownerModels = result.ownerModels || [];
        const responseData = {
            carModels: ownerModels.map(item => item.carModel),
            ownerBidCounts: ownerModels.map(item => item.count),
            avgPlatformBids: ownerModels.map(() => avgBidPerModel)
        };

      

        res.status(200).json({
            message: "Top car models retrieved successfully",
            statistics: responseData
        });

    } catch (error) {
        console.error("Error in getTopCarModels:", error);
        res.status(500).json({
            message: "Error retrieving top car models",
            error: error.message
        });
    }
};


/**
 * @description Controller to get owner's recent earnings for the last 14 days
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Returns top car modal
 */
const getListingWiseEarningsController = async (req, res) => {
    try {
        const { ownerId } = req.params;
        const { startDate, endDate } = req.query;

        // Validate inputs
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (isNaN(start) || isNaN(end)) {
            return res.status(400).json({ message: "Invalid date format" });
        }
        if (!mongoose.Types.ObjectId.isValid(ownerId)) {
            return res.status(400).json({ message: "Invalid user ID format" });
        }

        const aggregationPipeline = [
            {
                $match: {
                    "ownerDetails.ownerID": new mongoose.Types.ObjectId(String(ownerId)),
                    biddingDate: { $gte: start, $lte: end }
                }
            },
            {
                $group: {
                    _id: {
                        make: "$carData.carMake",
                        model: "$carData.carModel"
                    },
                    totalEarnings: { $sum: { $toDouble: "$bidAmount" } }
                }
            },
            {
                $project: {
                    _id: 0,
                    listingName: { 
                        $concat: ["$_id.make", " ", "$_id.model"] 
                    },
                    earnings: { $round: ["$totalEarnings", 2] }
                }
            },
            {
                $sort: { earnings: -1 }
            }
        ];

        const result = await Bidding.aggregate(aggregationPipeline);

        res.status(200).json({
            message: "Listing-wise earnings retrieved successfully",
            statistics: {
                listingNames: result.map(item => item.listingName),
                earnings: result.map(item => item.earnings)
            }
        });

    } catch (error) {
        console.error("Error in getListingWiseEarnings:", error);
        res.status(500).json({
            message: "Error retrieving listing earnings",
            error: error.message
        });
    }
};



/**
 * @description Additional controller functions for various statistics
 * - getUserAndAvgBidsController
 * - getBidsPerDayOfWeekController
 * - getBidsPerDayOwnerController
 * - getCategoryBookingCountsController
 * - getTopCarModelsController
 * - getListingWiseEarningsController
 */


export { getOwnerRecentEarningsController ,getUserAndAvgBidsController,getBidsPerDayOfWeekController,getBidsPerDayOwnerController, getCategoryBookingCountsController,getTopCarModelsController,getListingWiseEarningsController};
