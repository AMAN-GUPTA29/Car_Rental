/**
 * @import Bidding schema for database operations
 * @import ObjectId for MongoDB ID handling
 * @import Moment.js for date manipulation
 */
import Bidding from "../../models/bookings/booking.schema.js";
import { ObjectId } from "mongodb";
// var moment = require('moment'); 
import moment from "moment"

/**
 * @description Controller to fetch bookings that need start kilometer readings
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Returns bookings that need start kilometer readings
 */
const startkm = async (req, res) => {
  try {
    /**
     * @type {String}
     * @description ID of the owner to fetch bookings for
     */
    const { ownerId } = req.params;

    /**
     * @type {Number}
     * @description Current page number, defaults to 1
     */

    const page = parseInt(req.query.page) || 1;

    /**
     * @type {Number}
     * @description Number of bookings per page, defaults to 10
     */
    const limit = parseInt(req.query.limit) || 10;

    /**
     * @type {Number}
     * @description Number of documents to skip for pagination
     */
    const skip = (page - 1) * limit;

    /**
     * @type {Date}
     * @description Current date for comparison
     */
    const currentDate = new Date();

    /**
     * @type {Array}
     * @description MongoDB aggregation pipeline to find bookings needing start km readings
     */
    console.log(currentDate)
    const aggregationPipeline = [
      {
        $match: {
          "ownerDetails.ownerID": new ObjectId(String(ownerId)),
          startDate: { $gte: currentDate },
          status:"accepted",
          startkm:-1
        }
      },
      {
        $addFields: {
          timeDifference: {
            $abs: { $subtract: ["$startDate", currentDate] }
          }
        }
      },
      {
        $sort: {
          "carData.listingId": 1,
          timeDifference: 1
        }
      },
      {
        $group: {
          _id: "$carData.listingId",
          closestBid: { $first: "$$ROOT" }
        }
      },
      {
        $replaceRoot: { newRoot: "$closestBid" }
      },
      {
        $facet: {
          data: [
            { $skip: skip },
            { $limit: limit },
            { $project: { timeDifference: 0 } }
          ],
          total: [
            { $count: "total" }
          ]
        }
      },
      {
        $unwind: "$total"
      },
      {
        $project: {
          data: 1,
          pagination: {
            totalItems: "$total.total",
            totalPages: { $ceil: { $divide: ["$total.total", limit] } },
            currentPage: page,
            pageSize: limit
          }
        }
      }
    ];

     /**
     * @type {Array}
     * @description Execute aggregation and get first result
     */
    const [result] = await Bidding.aggregate(aggregationPipeline);
    console.log(result);
    /**
     * @description Handle case when no results are found
     */
    if (!result) {
      return res.status(200).json({
        success: true,
        data: [],
        pagination: {
          totalItems: 0,
          totalPages: 0,
          currentPage: page,
          pageSize: limit
        }
      });
    }

    /**
     * @description Return success response with paginated data
     */
    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination
    });

  } catch (error) {
    /**
     * @description Log and return error response
     */
    console.error("Error fetching closest bids:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export { startkm };
