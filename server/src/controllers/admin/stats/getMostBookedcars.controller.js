/**
 * @import Bidding Schema
 */
import Bidding from "../../../models/bookings/booking.schema.js";

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns the most popular and booked cars in between start and end dates
 */
const getMostPopularCarsController = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start) || isNaN(end)) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    /**
     * @$match matching document on  basis of start and end date
     * @group based on car Make and Modal and counting their numbers which will be no of biddings
     * @$sort sorting the data
     * @$limit limiting the data to 5
     * @$project project the required fields car name and count of bids
     */
    const aggregationPipeline = [
      {
        $match: {
          biddingDate: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: {
            make: "$carData.carMake",
            model: "$carData.carModel",
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 5,
      },
      {
        $project: {
          _id: 0,
          carName: {
            $concat: ["$_id.make", " ", "$_id.model"],
          },
          count: 1,
        },
      },
    ];

    const result = await Bidding.aggregate(aggregationPipeline);

    /**
     * formatting the data in car name and booking count
     */
    const formattedResult = {
      carNames: result.map((item) => item.carName),
      bookingCounts: result.map((item) => item.count),
    };

    /**
     * returning the formatted result
     */
    res.status(200).json({
      message: "Popular cars retrieved successfully",
      statistics: formattedResult,
    });
  } catch (error) {
    console.error("Error in getMostPopularCars:", error);
    res.status(500).json({
      message: "Error retrieving popular cars",
      error: error.message,
    });
  }
};

export { getMostPopularCarsController };
