/**
 * @import Booking schema
 * @import mongoose schema
 */
import Booking from "../../models/bookings/booking.schema.js";
import mongoose from "mongoose";

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns the all the already booked dates of the ca
 */
const getBookedDatesController = async (req, res) => {
    try {
        const { listingId } = req.params;
        
         /**
          *  Validate listing ID format
          * */ 
         
        if (!mongoose.Types.ObjectId.isValid(listingId)) {
            return res.status(400).json({ message: "Invalid listing ID format" });
        }

        /**
         * @match matching on fields based on listing id and status
         * @project to next stage data the differnce of days between start and end date
         * @project adding days in between the start and end date to dates
         * @unwind unwinding or spreding the dates 
         * @group frouping the dates to return unique date
         * @project project to return the dates
         */
        const aggregationPipeline = [
            {
                $match: {
                    "carData.listingId": new mongoose.Types.ObjectId(String(listingId)),
                    status: "accepted"
                }
            },
            {
                $project: {
                    startDate: 1,
                    endDate: 1,
               
                    dayDifference: {
                        $dateDiff: {
                            startDate: "$startDate",
                            endDate: "$endDate",
                            unit: "day"
                        }
                    }
                }
            },
            {
                $project: {
                    dates: {
                        $map: {
                            input: { $range: [0, { $add: ["$dayDifference", 1] }] },
                            as: "days",
                            in: {
                                $dateToString: {
                                    format: "%Y-%m-%d",
                                    date: {
                                        $add: [
                                            "$startDate",
                                            { $multiply: ["$$days", 24 * 60 * 60 * 1000] }
                                        ]
                                    }
                                }
                            }
                        }
                    }
                }
            },
            { $unwind: "$dates" },
            {
                $group: {
                    _id: null,
                    bookedDates: { $addToSet: "$dates" }
                }
            },
            {
                $project: {
                    _id: 0,
                    bookedDates: 1
                }
            }
        ];

        const result = await Booking.aggregate(aggregationPipeline);
        const bookedDates = result[0]?.bookedDates || [];
        
        /**
         * @returns the booked dates
         */
        res.status(200).json({
            message: "Booked dates retrieved successfully",
            bookedDates
        });

    } catch (error) {
        console.error("Error in getBookedDates:", error);
        res.status(500).json({
            message: "Error retrieving booked dates",
            error: error.message
        });
    }
};

export { getBookedDatesController };
