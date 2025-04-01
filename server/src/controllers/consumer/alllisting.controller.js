/**
 * @import Listing schema
 */
import Listing from "../../models/bookings/listing.schema.js";
/**
 * @description Controller to fetch and filter listings for consumers with pagination
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Returns paginated listings based on filters
 */
const viewAllConsumerListingsController = async (req, res) => {
  try {
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
    console.log(req.query);
     /**
     * @type {Object}
     * @description Extract filter parameters from query
     */
    const {
      city,
      category,
      transmission,
      model,
      minPrice,
      maxPrice,
      minMileage
    } = req.query;

     /**
     * @type {Object}
     * @description Build match stage for MongoDB aggregation based on filters
     */
    const matchStage = { 
      isDeleted: false,
      ...(city && { "carData.carcity": { $regex: city, $options: 'i' } }),
      ...(category && { "carData.carCategory": { $regex: category, $options: 'i' } }),
      ...(transmission && transmission !== 'all' && { "carData.carTransmission": transmission }),
      ...(model && { "carData.carModel": { $regex: model, $options: 'i' } }),
      ...(minPrice && { "carData.basePrice": { $gte: Number(minPrice) } }),
      ...(maxPrice && { "carData.basePrice": { $lte: Number(maxPrice) } }),
      ...(minMileage && { "carData.carMileage": { $gte: Number(minMileage) } })
    };

    /**
     * @type {Array}
     * @description MongoDB aggregation pipeline for filtering, sorting, and pagination
     */
    const aggregationPipeline = [
      { $match: matchStage },
      { $sort: { listingDate: -1 } },
      {
        $facet: {
          metadata: [{ $count: "totalListings" }],
          data: [
            { $skip: (page - 1) * limit },
            { $limit: limit },
            {
              $project: {
                _id: 1,
                carData: 1,
                owner: 1,
                images: 1,
                listingDate: 1
              }
            }
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
    const [result] = await Listing.aggregate(aggregationPipeline);

    /**
     * @description Return success response with paginated listings
     */
    res.status(200).json({
      message: "Listings fetched successfully",
      page: result.page,
      totalPages: result.totalPages,
      totalListings: result.totalListings,
      listings: result.listings
    });

  } catch (error) {
    /**
     * @description Return error response
     */
    res.status(500).json({ 
      message: "Internal server error", 
      error: error.message 
    });
  }
};

export { viewAllConsumerListingsController };
