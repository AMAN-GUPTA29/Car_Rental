/**
 * @import History Schema and object ID
 */
import History from "../../models/bookings/history.schema.js";
import { ObjectId } from "mongodb";

/**
 * @description Controller to fetch user invoices with filtering and pagination
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Returns paginated user invoices
 */
const getUserInvoices = async (req, res) => {
  try {

   /**
     * @type {String}
     * @description ID of the user to fetch invoices for
     */
    const { userId } = req.params;

    /**
     * @type {Number}
     * @description Current page number, defaults to 1
     */
    const page = parseInt(req.query.page) || 1;

    /**
     * @type {Number}
     * @description Number of invoices per page
     */
    const limit = 5;

    /**
     * @type {String}
     * @description Filter for paid status: 'all', 'paid', or 'unpaid'
     */

    const filter = req.query.filter || 'all';
      console.log("sfc",userId,page);

      /**
     * @description Validate user ID
     */
    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

     /**
     * @type {Object}
     * @description Base match criteria for MongoDB aggregation
     */
    const matchStage = {
      "bookerData.bookerId": new ObjectId(String(userId))
    };

    /**
     * @description Add paid status filter if specified
     */
    if (filter === 'paid') {
      matchStage.paid = true;
    } else if (filter === 'unpaid') {
      matchStage.paid = false;
    }
    /**
     * @type {Array}
     * @description MongoDB aggregation pipeline for filtering, sorting, and pagination
     * @match Stage - filter by user ID and paid status
     * @project Stage - project only required fields
     * @sort Stage - sort by date in descending order
     * @facet for pagination 
     * @project projecting the required fields 
     */
    const aggregationPipeline = [
      { $match: matchStage },
      {
        $project: {
            _id: 1,
            invoiceId: "$_id",
            biddingId: 1,
            bidAmount: 1,
            biddingDate: 1,
            status: 1,
            bookType: 1,
            startDate: 1,
            endDate: 1,
            startkm: 1,
            endkm: 1,
            paid: 1,
            carData: 1,
            ownerDetails: 1,
            bookerData: 1,
          }
      },
      {
        $sort: {
          paid: 1,
          changeTimestamp: -1
        }
      },
      {
        $facet: {
          metadata: [{ $count: "totalInvoices" }],
          data: [
            { $skip: (page - 1) * limit },
            { $limit: limit }
          ]
        }
      },
      {
        $project: {
          invoices: "$data",
          totalInvoices: { $ifNull: [{ $arrayElemAt: ["$metadata.totalInvoices", 0] }, 0] },
          totalPages: {
            $ceil: {
              $divide: [
                { $ifNull: [{ $arrayElemAt: ["$metadata.totalInvoices", 0] }, 0] },
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
    const [result] = await History.aggregate(aggregationPipeline);

     /**
     * @description Return success response with paginated invoices
     */
    res.status(200).json({
      message: "Invoices fetched successfully.",
      page: result?.page || 1,
      totalPages: result?.totalPages || 0,
      totalInvoices: result?.totalInvoices || 0,
      invoices: result?.invoices || []
    });

  } catch (error) {
    /**
     * @description Log and return error response
     */
    console.error("Error fetching invoices:", error);
    res.status(500).json({ 
      message: "Internal server error", 
      error: error.message 
    });
  }
};

export { getUserInvoices };
