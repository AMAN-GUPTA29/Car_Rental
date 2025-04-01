
/**
 * importing the Bidding schema and CAR_CATAGORIES constant
 */

import Bidding from "../../../models/bookings/booking.schema.js";
import { CAR_CATEGORIES } from "../../../utils/constant.js";


/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns get Most Booked Car Categories between start and end date 
 */
const getMostBookedCarCategoriesController = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const start = new Date(startDate);
        const end = new Date(endDate);
        if (isNaN(start) || isNaN(end)) {
            return res.status(400).json({ message: "Invalid date format" });
        }

        const allCategories =CAR_CATEGORIES;

        /**
         * @match based on bidding dates between start and end date
         * @group based on category and summing up the count
         * @project project the required data
         */
        const aggregationPipeline = [
            {
                $match: {
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


        /**
         * mapping data to catefory map with catogry to count
         */
        const categoryMap = new Map(
            aggregationResult.map(item => [item.category, item.count])
        );

        
        /**
         * mapping data to CATOGORIES constant and marking 0 if no count for that category
         */
        const bookingCounts = allCategories.map(category => 
            categoryMap.get(category) || 0
        );

        /**
         * @return the booking counts for each category
         */
        res.status(200).json({
            message: "Car category statistics retrieved successfully",
            statistics: {
                categories: allCategories,
                bookingCounts
            }
        });

    } catch (error) {
        console.error("Error in getMostBookedCarCategories:", error);
        res.status(500).json({
            message: "Error retrieving car category statistics",
            error: error.message
        });
    }
};

export { getMostBookedCarCategoriesController };
