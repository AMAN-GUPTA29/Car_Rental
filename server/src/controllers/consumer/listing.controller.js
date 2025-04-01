/**
 * @import Listing schema for database operations
 */
import Listing from "../../models/bookings/listing.schema.js";


/**
 * @description Controller to fetch a specific car listing by ID for consumer view
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Returns the requested listing
 */
const viewListingController = async (req, res) => {
  try {
    /**
     * @type {String}
     * @description ID of the listing to fetch
     */
    const { id } = req.params;
/**
     * @type {Object}
     * @description Find listing by ID in the database
     */
    const result=await Listing.findById(id);

    console.log("scscw1qq",result)


     /**
     * @description Return success response with listing data
     */
    res.status(200).json({
      message: "Listings fetched successfully",
      listings: result
    });

  } catch (error) {

      /**
     * @description Return error response
     */
    
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export { viewListingController };
