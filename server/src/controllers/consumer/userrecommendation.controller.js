import mongoose from "mongoose";
import History from "../../models/bookings/history.schema.js";
import User from "../../models/users/user.schema.js";
import { ObjectId } from "mongodb";

const getUserRecommendation = async (req, res) => {

    try {
       
        console.log("qqa")
        const { userId } = req.params;
        console.log(userId)
  
        const pipeline = [

            { $match: { 'bookerData.bookerId': new ObjectId(String(userId)) } },
    
           
            { $sort: { bookingDate: -1 } },
    
          
            { $limit: 10 },
    
            { $group: { 
                _id: '$carData.listingId', 
                count: { $sum: 1 },

                latestBooking: { $first: '$$ROOT' } 
              } 
            },
    
      
            { $sort: { count: -1 } },
    
      
            { $limit: 3 }
          ];

          
  
        const recommendations = await History.aggregate(pipeline);
        console.log(recommendations);
        
        res.status(200).json({
          userId,
          recommendations,
        });
      } catch (error) {
        console.log(error)
        res.status(500).json({
            
          message: 'An error occurred while fetching recommendations.',
          error: error.message,
        });
      }
}




export { getUserRecommendation };