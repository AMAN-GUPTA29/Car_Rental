/**
 * @import {History} Schema
 * @import {CAR_Categories} Const
 */


import History from "../../../models/bookings/history.schema.js";
import { CAR_CATEGORIES } from "../../../utils/constant.js";
import Listing from "../../../models/bookings/listing.schema.js";
import User from "../../../models/users/user.schema.js";
import Bidding from "../../../models/bookings/booking.schema.js";






/**
 *
 * @param {*} req
 * @param {*} res
 * @returns
 * this returns the avg bid amount per car category
 *
 */
const getAverageBidPerCategoryController = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start) || isNaN(end)) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    /**
     * @$match match the document with specified parameter here
     * @$group group the document by car category and calculate the sum of bid amount
     * @$project project the result to only include the car category and the sum of bid amount and count
     */
    const aggregationPipeline = [
      {
        $match: {
          biddingDate: { $gte: start, $lte: end },
          status: "accepted",
        },
      },
      {
        $group: {
          _id: "$carData.carCategory",
          totalAmount: { $sum: { $toDouble: "$bidAmount" } },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          totalAmount: 1,
          count: 1,
        },
      },
    ];

    const aggregationResult = await History.aggregate(aggregationPipeline);


    /**
     * map the result calculate the average of bid amount
     */
    const categoryMap = new Map(
      aggregationResult.map((item) => [
        item.category,
        {
          avgBid:
            item.count > 0 ? (item.totalAmount / item.count).toFixed(2) : 0,
        },
      ])
    );


    
    /**
     * return the result with the average of bid amount
     */
    const result = CAR_CATEGORIES.map((category) => ({
      category,
      avgBid: categoryMap.has(category) ? categoryMap.get(category).avgBid : 0,
    }));

    /**
     * return the categories and avg bids
     */
    res.status(200).json({
      message: "Average bids per category retrieved successfully",
      statistics: {
        categories: result.map((item) => item.category),
        avgBids: result.map((item) => parseFloat(item.avgBid)),
      },
    });
  } catch (error) {
    console.error("Error in getAverageBidPerCategory:", error);
    res.status(500).json({
      message: "Error retrieving average bids per category",
      error: error.message,
    });
  }
};



/**
 * 
 * @param {*} req 
 * @param {*} res 
 * this method gets the last 7 days all bids of the plateform for the admin
 */
const getBidsPerDayController = async (req, res) => {
  try {
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    /**
     * @$match match the documets with the parameters,
     * @$group group the documents by the day and sum the bids
     * @$sort to sort with id in the group
     * @$group to get data in bidsDate with phusing date and amount
     */
    const aggregationPipeline = [
      {
        $match: {
          biddingDate: { $gte: sevenDaysAgo, $lte: today },
          status:"accepted"
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$biddingDate" } },
          totalAmount: { $sum: { $toDouble: "$bidAmount" } }
        }
      },
      {
        $sort: { _id: 1 }
      },
      {
        $group: {
          _id: null,
          bidsData: { $push: { date: "$_id", amount: "$totalAmount" } }
        }
      },
      {
        $project: {
          _id: 0,
          bidsData: 1
        }
      }
    ];

    const [aggregationResult] = await History.aggregate(aggregationPipeline);

    
    /**
     * getting last 7 days.
     */
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      return date.toISOString().split("T")[0];
    }).reverse();

    /**
     * mapping data in bidsMao which are date and amount
     */
    const bidsMap = new Map(
      aggregationResult?.bidsData?.map(item => [item.date, item.amount]) || []
    );

    /**
     * mapping bidAmounts with per day data and adding 0  where no bids.
     */
    const bidAmounts = days.map(date => bidsMap.get(date) || 0);

    /**
     * getting total bids amount per day last 7 days
     */
    res.status(200).json({
      message: "Bid statistics retrieved successfully",
      statistics: {
        days,
        bidAmounts
      }
    });

  } catch (error) {
    res.status(500).json({
      message: "Error retrieving bid statistics",
      error: error.message
    });
  }
};



/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns car count per category between start and end lisitng date
 */
const getCarsListedByCategoryController = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (isNaN(start) || isNaN(end)) {
            return res.status(400).json({ message: "Invalid date format" });
        }

        /**
         * @$match to match the listingDate between start and end date
         * @$group to group by category and count the number of cars
         * @$project project the required fields which is category and count
         */
        const aggregationPipeline = [
            {
                $match: {
                    listingDate: { 
                        $gte: start, 
                        $lte: end 
                    }
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

        const aggregationResult = await Listing.aggregate(aggregationPipeline);

        /**
         * mapping Item category to Item count in variable category Map
         */
        const categoryMap = new Map(
            aggregationResult.map(item => [item.category, item.count])
        );


        /**
         * getting the car Counts of a category by mapping CAR_CATOGIRIES to categoryMap
         */
        const carCounts = CAR_CATEGORIES.map(category => 
            categoryMap.get(category) || 0
        );

        
        /**
         * returning the car counts per catagory
         */
        res.status(200).json({
            message: "Car listings by category retrieved successfully",
            statistics: {
                categories: CAR_CATEGORIES,
                carCounts
            }
        });

    } catch (error) {
        console.error("Error in getCarsListedByCategory:", error);
        res.status(500).json({
            message: "Error retrieving car listings by category",
            error: error.message
        });
    }
};


/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns number of active and Inactive user;
 */
const getActiveInactiveUsersController = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        
        
        const start = new Date(startDate);
        const end = new Date(endDate);
    
        if (isNaN(start) || isNaN(end)) {
            return res.status(400).json({ message: "Invalid date format" });
        }


        /**
         * @$match on bases of role of the user
         * @$lookup (this is heavy task will replace it ) joins the bidding table to user and get the biddings of the user between that start and end date
         * @$addField is active
         * @$Grouping data based on isActive
         */
        const aggregationPipeline = 
        [
            {
              $match: {
                role: "user",
              },
            },
            {
              $lookup: {
                from: "biddings",
                let: {
                  userId: "$_id",
                  startDate: start,
                  endDate: end,
                },
          
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          {
                            $eq: [
                              "$bookerData.bookerId",
                              "$$userId",
                            ],
                          },
                          {
                            $gte: [
                              "$biddingDate",
                              "$$startDate",
                            ],
                          },
                          {
                            $lte: [
                              "$biddingDate",
                              "$$endDate",
                            ],
                          },
                        ],
                      },
                    },
                  },
                ],
                as: "userBids",
              },
            },
            {
              $addFields: {
                isActive: {
                  $gt: [{ $size: "$userBids" }, 0],
                },
              },
            },
          
            {
              $group: {
                _id: null,
                activeUsers: {
                  $sum: {
                    $cond: {
                      if: { $toBool: "$isActive" },
                      then: 1,
                      else: 0,
                    },
                  },
                },
                inactiveUsers: {
                  $sum: {
                    $cond: {
                      if: {
                        $toBool: { $not: "$isActive" },
                      },
                      then: 1,
                      else: 0,
                    },
                  },
                },
              },
            },
          ];
        
        const [result] = await User.aggregate(aggregationPipeline);
      
        const stats = result || { activeUsers: 0, inactiveUsers: 0 };

        /**
         * returning stats which is no of active and inactive user
         */
        res.status(200).json({
            message: "User activity statistics retrieved successfully",
            statistics: stats
        });

    } catch (error) {
        res.status(500).json({
            message: "Error retrieving user statistics",
            error: error.message
        });
    }
};


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


const getNewUserOverTimeController = async (req, res) => {

  try {
    const { startDate, endDate } = req.query;
    
    // Validate input
    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Both startDate and endDate are required' });
    }

    // Date handling
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // Include entire end day

    // Aggregation pipeline
    const pipeline = [
      {
        $match: {
          signupDate: {
            $gte: start,
            $lte: end
          }
        }
      },
      {
        $addFields: {
          dateStr: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$signupDate"
            }
          }
        }
      },
      {
        $group: {
          _id: "$dateStr",
          users: {
            $sum: { $cond: [{ $eq: ["$role", "user"] }, 1, 0] }
          },
          owners: {
            $sum: { $cond: [{ $eq: ["$role", "owner"] }, 1, 0] }
          }
        }
      },
      {
        $sort: {
          _id: 1
        }
      },
      {
        $group: {
          _id: null,
          dates: { $push: "$_id" },
          userCounts: { $push: "$users" },
          ownerCounts: { $push: "$owners" }
        }
      },
      {
        $project: {
          _id: 0,
          dates: 1,
          userCounts: 1,
          ownerCounts: 1
        }
      }
    ];

    const result = await User.aggregate(pipeline);

    const response = result[0] || { dates: [], userCounts: [], ownerCounts: [] };
 
    res.status(200).json({
      message: "Owner and user over time",
      statistics: response
  });

    

   
    
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch user data',
      details: error.message 
    });
  }
}

const activeBiddingPerHourController = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    console.log("startDate",startDate)
    // Validate input
    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Both startDate and endDate are required' });
    }

    // Date handling
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // Include entire end day

    // Aggregation pipeline
    const pipeline = [
      {
        $match: {
          biddingDate: {
            $gte: start,
            $lte: end
          }
        }
      },
      {
        $project: {
          hour: { $hour: "$biddingDate" }
        }
      },
      {
        $group: {
          _id: "$hour",
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ];

    const rawResults = await History.aggregate(pipeline);

    // Initialize 24-hour array with zeros
    const bidsPerHour = Array(24).fill(0);

    // Map MongoDB results to the array
    rawResults.forEach(result => {
      bidsPerHour[result._id] = result.count;
    });
    console.log("bidsPerHour",bidsPerHour)
    res.status(200).json({
      message: "Bids per hour retrieved successfully",
      statistics: bidsPerHour
  });

  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch bidding data',
      details: error.message 
    });
  }
}

export { getAverageBidPerCategoryController ,getBidsPerDayController,getCarsListedByCategoryController,getActiveInactiveUsersController,getMostPopularCarsController,getMostBookedCarCategoriesController,getNewUserOverTimeController,activeBiddingPerHourController};
