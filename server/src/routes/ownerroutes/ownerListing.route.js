
/**
 * @import Express framework
 * @import JWT authentication middleware for owners
 * @import File upload middleware
 * @import Owner-related controllers
 */
import express from "express";
import {authenticateJwtOwner} from "../../middleware/authenticate/index.js"
import {singleImageUpload} from "../../middleware/s3FileUpload/index.js"
import {listingController} from "../../controllers/owner/ownerListing.controller.js"
import {viewAllListingController} from "../../controllers/owner/viewalllisting.controller.js"
import {viewAllBiddingParticularCar} from "../../controllers/owner/viewBidding.controller.js"
import {updateBidStatus} from "../../controllers/owner/decideBidding.controller.js"
import { startkm } from "../../controllers/owner/startkm.controller.js";
import { updateBiddingStartKm } from "../../controllers/owner/logstartkm.controller.js"
import {endkm} from "../../controllers/owner/endkm.controller.js"
import { updateBiddingEndKm } from "../../controllers/owner/logendkm.controller.js";
import {viewListingOwnerController} from "../../controllers/owner/listing.controller.js"
import { getAllConversations } from "../../controllers/owner/getConversation.controller.js";
import { getChatMessages } from "../../controllers/owner/getChats.controller.js";
import { conversationController } from "../../controllers/owner/chats.controller.js";
import { getApprovedBidsOwner } from "../../controllers/owner/approvedBidsTable.controller.js";
import {getBidsPerDayOwnerController,getBidsPerDayOfWeekController,getUserAndAvgBidsController,getListingWiseEarningsController,getTopCarModelsController,getCategoryBookingCountsController,getOwnerRecentEarningsController, activeBiddingPerHourController} from "../../controllers/owner/stats/ownerstats.controller.js"

/**
 * @type {express.Router}
 * @description Create an Express router instance for owner routes
 */
const router=express.Router();

/**
 * @description Route to create a new car listing
 */
router.post("/createlisting",authenticateJwtOwner,singleImageUpload,listingController);

/**
 * @description Route to view all listings for a specific owner
 */
router.get("/alllisting/:ownerId",authenticateJwtOwner,viewAllListingController);

/**
 * @description Route to view a specific listing by ID (owner view)
 */
router.get("/listing/:id",authenticateJwtOwner,viewListingOwnerController)

/**
 * @description Route to view all bids for a specific car listing
 */
router.get("/allbidding/:listingId",authenticateJwtOwner,viewAllBiddingParticularCar);

/**
 * @description Route to accept or reject a bid
 */
router.post("/decidebid",authenticateJwtOwner,updateBidStatus);

/**
 * @description Route to get cars that need start kilometer reading
 */
router.get("/startkm/:ownerId",authenticateJwtOwner,startkm);

/**
 * @description Route to get cars that need end kilometer reading
 */
router.get("/endkm/:ownerId",authenticateJwtOwner,endkm);

/**
 * @description Route to update start kilometer reading for a booking
 */
router.patch("/updatestartkm/:biddingId",authenticateJwtOwner,updateBiddingStartKm);

/**
 * @description Route to update end kilometer reading for a booking
 */
router.patch("/updateendkm/:biddingId",authenticateJwtOwner,updateBiddingEndKm)

/**
 * @description Route to get all conversations for a specific owner
 */
router.get("/getconversation/:ownerId",authenticateJwtOwner,getAllConversations)

/**
 * @description Route to get chat messages for a specific conversation
 */
router.get("/getchats/:conversationId",authenticateJwtOwner,getChatMessages)

/**
 * @description Route to create or manage conversations/chats
 */
router.post("/chats",authenticateJwtOwner,conversationController);

/**
 * @description Route to get approved bids for a specific owner
 */
router.get("/approvedbidsowner/:ownerId",authenticateJwtOwner,getApprovedBidsOwner)



/**
 * @description Route to get bids per day for last week for a specific owner
 */
router.get("/stats/ownerbidlastweek/:ownerId",authenticateJwtOwner,getBidsPerDayOwnerController)

/**
 * @description Route to get earnings by day of week for a specific owner
 */
router.get("/stats/ownerearningdaywise/:ownerId",authenticateJwtOwner,getBidsPerDayOfWeekController)

/**
 * @description Route to get owner earnings compared to platform average
 */
router.get("/stats/getearningandplateformavg/:ownerId",authenticateJwtOwner,getUserAndAvgBidsController)

/**
 * @description Route to get earnings by car listing for a specific owner
 */
router.get('/stats/topearningcars/:ownerId',authenticateJwtOwner,getListingWiseEarningsController);

/**
 * @description Route to get top earning car models for a specific owner
 */
router.get('/stats/gettopearningcarmodal/:ownerId',authenticateJwtOwner,getTopCarModelsController)

/**
 * @description Route to get top earning car categories for a specific owner
 */
router.get('/stats/gettopearningcarcategories/:ownerId',authenticateJwtOwner,getCategoryBookingCountsController)

/**
 * @description Route to get owner's earnings for the last week
 */
router.get('/stats/ownerlastweeksearning/:ownerId',authenticateJwtOwner,getOwnerRecentEarningsController)


router.get('/stats/activeBiddingPerHour/:ownerId',authenticateJwtOwner,activeBiddingPerHourController)





export default router;
