/**
 * @import Car listing schema for database operations
 * @import ObjectId for MongoDB ID handling
 */
import Car from "../../models/bookings/listing.schema.js";
import { ObjectId } from "mongodb";

/**
 * @description Controller to fetch all car listings for a specific owner with pagination
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Returns paginated listing data
 */
const viewAllListingController = async (req, res) => {
  try {
    console.log("cssccs")
    /**
     * @type {String}
     * @description ID of the owner to fetch listings for
     */
    const { ownerId } = req.params;

     /**
     * @type {Number}
     * @description Current page number, defaults to 1
     */
    const page = parseInt(req.query.page) || 1;

    /**
     * @type {Number}
     * @description Number of listings per page
     */
    const limit = 10;
    console.log(ownerId)
    /**
     * @description Validate owner ID
     */
    if (!ownerId) {
      return res.status(400).json({ message: "Owner ID is required." });
    }

    /**
     * @type {Array}
     * @description MongoDB aggregation pipeline for filtering, sorting, and pagination
     */
    const aggregationPipeline = [
      {
        $match: {
          "ownerDetails.ownerID": new ObjectId(String(ownerId)),
        }
      },
      {
        $sort: { listingDate: -1 }
      },
      {
        $facet: {
          metadata: [
            { $count: "totalListings" }
          ],
          data: [
            { $skip: (page - 1) * limit },
            { $limit: limit }
          ]
        }
      },
      {
        $project: {
          listings: "$data",
          totalListings: { $ifNull: [{ $arrayElemAt: ["$metadata.totalListings", 0] }, 0] },
          totalPages: {
            $ceil: {
              $divide: [
                { $ifNull: [{ $arrayElemAt: ["$metadata.totalListings", 0] }, 0] },
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
    const [result] = await Car.aggregate(aggregationPipeline);

     /**
     * @description Return success response with paginated listings
     */
    res.status(200).json({
      message: "User listings fetched successfully.",
      page: result.page,
      totalPages: result.totalPages,
      totalListings: result.totalListings,
      listings: result.listings
    });

  } catch (error) {
     /**
     * @description Return error response
     */
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export { viewAllListingController };
