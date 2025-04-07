/**
 * @import Express framework
 * @import JWT authentication middleware for users
 * @import Consumer-related controllers
 */
import express from "express";
import {authenticateJwtUser} from "../../middleware/authenticate/index.js"
import {viewAllConsumerListingsController} from "../../controllers/consumer/alllisting.controller.js"
import {consumerBiddingController} from "../../controllers/consumer/bidding.controller.js"
import { getUserInvoices } from "../../controllers/consumer/invoice.controller.js";
import {getUserHistory} from "../../controllers/consumer/consumerhistory.controller.js"
import { viewListingController } from "../../controllers/consumer/listing.controller.js";
import {conversationController} from "../../controllers/consumer/chats.controller.js"
import { getChatMessages } from "../../controllers/consumer/getChats.controller.js";
import { getAllConversations } from "../../controllers/consumer/getConversation.controller.js";
import { getBookedDatesController } from "../../controllers/consumer/bookedDates.controller.js";
import { markBookingAsPaidController } from "../../controllers/consumer/markaspaid.controller.js";
import { getUserRecommendation } from "../../controllers/consumer/userrecommendation.controller.js";

/**
 * @type {express.Router}
 * @description Create an Express router instance for consumer routes
 */
const router=express.Router();

/**
 * @description Route to get all listings for consumers
 */
router.get("/alllisting",authenticateJwtUser,viewAllConsumerListingsController)

/**
 * @description Route to view a specific listing by ID
 */
router.get("/listing/:id",authenticateJwtUser,viewListingController)

/**
 * @description Route to create a new bid on a listing
 */
router.post("/bidding",authenticateJwtUser,consumerBiddingController)

/**
 * @description Route to get invoices for a specific user
 */
router.get("/getinvoice/:userId",authenticateJwtUser,getUserInvoices)

/**
 * @description Route to get booking history for a specific user
 */
router.get("/history/:userId",authenticateJwtUser,getUserHistory)

/**
 * @description Route to create or manage conversations/chats
 */
router.post("/chats",authenticateJwtUser,conversationController)

/**
 * @description Route to get chat messages for a specific conversation
 */
router.get("/getchats/:conversationId",authenticateJwtUser,getChatMessages)

/**
 * @description Route to get all conversations for a specific booker
 */
router.get("/getconversation/:bookerId",authenticateJwtUser,getAllConversations)

/**
 * @description Route to get booked dates for a specific listing
 */
router.get("/getbookeddate/:listingId",authenticateJwtUser,getBookedDatesController)

/**
 * @description Route to mark a booking as paid
 */
router.get("/markaspaid/:historyId",authenticateJwtUser,markBookingAsPaidController)


/**
 * @description Route to get recommended car listings for a specific user
*/
router.get("/getrecommendedcarlistings/:userId",authenticateJwtUser,getUserRecommendation)

export default router;
