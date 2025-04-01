/**
 * @import Listing Schema
 * @import Mongoose
 */
import Listing from '../../models/bookings/listing.schema.js';
import mongoose from 'mongoose';

/**
 * @description Fetches all user listings for admin view with optional email filtering
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Returns all the user listings to admin 
 */
export const getAdminListings = async (req, res) => {
    try {
        /**
         * @type {String}
         * @description Email query parameter for filtering listings
         */
        const { email = '' } = req.query;

        /**
         * @type {Array}
         * @description MongoDB aggregation pipeline
         * @match matching with email and also partial matching 
         * @projecting the required data.
         */
        const aggregationPipeline = [
            {
                $match: email 
                    ? { 'ownerDetails.ownerEmail': { $regex: email, $options: 'i' } }
                    : {}
            },
            {
                $project: {
                    _id: 1,
                    carData: 1,
                    ownerDetails: 1,
                    images:1,
                    isDeleted:1,
                    isBlocked:1
                }
            }
        ];
          /**
         * @type {Array}
         * @description Execute aggregation to get filtered listings
         */
        const listings = await Listing.aggregate(aggregationPipeline);

        /**
         * @description Return the listings to admin
         */
        res.status(201).json({
            success: true,
            listings
        });

    } catch (error) {
        /**
         * @description Log and return error response
         */
        console.error('Error in getAdminListings:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching listings', 
            error: error.message 
        });
    }
};

/**
 * @description Deletes a listing by its ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Returns success or error message
 */
export const deleteListing = async (req, res) => {
    try {
        /**
         * @type {String}
         * @description ID of the listing to delete
         */
        const { id } = req.params;
        const { blocked } = req.body;


         /**
         * @description Validate if ID is a valid MongoDB ObjectId
         */
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid listing ID' 
            });
        }

        /**
         * @type {Object|null}
         * @description Find and delete the listing
         */
        const updatedListing = await Listing.updateOne(
            { _id: id },
            { $set: { isDeleted: blocked } }
          );
          

        /**
         * @description Return error if listing not found
         */
        if (!updatedListing) {
            return res.status(404).json({ 
                success: false, 
                message: 'Listing not found' 
            });
        }

        /**
         * @description Return success response
         */
        res.json({ 
            success: true, 
            message: 'Listing updated successfully' 
        });

    } catch (error) {
        /**
         * @description Log and return error response
         */
        console.error('Error in deleteListing:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error deleting listing', 
            error: error.message 
        });
    }
};
