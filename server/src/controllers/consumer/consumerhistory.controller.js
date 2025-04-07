/**
 * @import History Schema 
 * @import Object Id
 */
import History from "../../models/bookings/history.schema.js";
import { ObjectId } from "mongodb";


/**
 * @description Controller to fetch user booking history with filtering and pagination
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Returns filtered and paginated user history
 */
const getUserHistory = async (req, res) => {
  try {
  
    /**
     * @type {String}
     * @description ID of the user to fetch history for
     */
    const { userId } = req.params;
    /**
     * @type {String}
     * @description JSON string of filters from query parameters
     */
    const filterss=req.query.filters;
    /**
     * @type {String}
     * @description Page number from query parameters
     */
    const page=req.query.page;
     /**
     * @type {Object}
     * @description Parse filters JSON string to object
     */
    const filters=JSON.parse(filterss)

      /**
     * @type {String}
     * @description Car category filter
     */
    const category=filters.category;

    /**
     * @type {String}
     * @description Booking status filter
     */
    const status=filters.status;

    /**
     * @type {String}
     * @description City filter
     */
    const city=filters.city;
    
     /**
     * @type {Number}
     * @description Number of records per page
     */
      const limit = 10;
    
    console.log(category)

      /**
     * @description Validate user ID
     */
    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

     /**
     * @type {Number}
     * @description Parse page and limit to numbers
     */
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    console.log("dcs");
    console.log(category)
     
    /**
     * @type {Object}
     * @description Base match criteria for MongoDB aggregation
     */
    const matchStage = {
      "bookerData.bookerId": new ObjectId(String(userId))
    };

    /**
     * @description Add filters if specified
     */
    if (category !== '') {console.log("fc");matchStage["carData.carCategory"] = category;}
    if (city !== '') matchStage["carData.carcity"] = city;
    if (status !== '') matchStage["status"] = status;
    

   /**
     * @type {Array}
     * @description MongoDB aggregation pipeline for filtering, sorting, and pagination
     * @match matching with specific filters specified
     * @project send specified documents to next stage 
     * @sort sort the documents based on date
     * @skip skip the documents based on page number
     * @limit limit the documents based on limit number
     * @project send the documents final
     */
    const aggregationPipeline = [
      { $match: matchStage },
      {
        $project: {
          _id: 1,
          biddingId: 1,
          bidAmount: 1,
          carData:1,
          biddingDate: 1,
          status: 1,
          bookType: 1,
          startDate: 1,
          endDate: 1,
          startkm: 1,
          endkm: 1,
          paid: 1,
          carData:1,
          ownerDetails:1,
          bookerData:1
        }
      },
      {
        $sort: { biddingDate: -1 }
      },
      {
        $facet: {
          metadata: [{ $count: "totalRecords" }],
          data: [
            { $skip: (pageNumber - 1) * limitNumber },
            { $limit: limitNumber }
          ]
        }
      },
      {
        $project: {
          records: "$data",
          totalRecords: { $ifNull: [{ $arrayElemAt: ["$metadata.totalRecords", 0] }, 0] },
          totalPages: {
            $ceil: {
              $divide: [
                { $ifNull: [{ $arrayElemAt: ["$metadata.totalRecords", 0] }, 0] },
                limitNumber
              ]
            }
          },
          page: { $literal: pageNumber }
        }
      }
    ];

    /**
     * @type {Array}
     * @description Execute aggregation and get first result
     */
    const [result] = await History.aggregate(aggregationPipeline);

    /**
     * @description Return success response with paginated history
     */
    res.status(200).json({
      message: "User history fetched successfully.",
      page: result?.page || 1,
      totalPages: result?.totalPages || 0,
      totalRecords: result?.totalRecords || 0,
      records: result?.records || []
    });

  } catch (error) {
    /**
     * @description Log and return error response
     */
    console.error("Error fetching user history:", error);
    res.status(500).json({ 
      message: "Internal server error", 
      error: error.message 
    });
  }
};

export { getUserHistory };
