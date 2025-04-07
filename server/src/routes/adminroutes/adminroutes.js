/**
 * @import Express framework
 * @import JWT authentication middleware for admin
 * @import User management controllers
 * @import Listing management controller
 * @import Statistics controllers
 */
import express from "express";
import { authenticateJwtAdmin } from "../../middleware/authenticate/index.js";
import { getUsers, updateUserAuthStatus, updateUserBlockStatus } from "../../controllers/admin/manageUsers.controllers.js";
import { deleteListing, getAdminListings } from "../../controllers/admin/manageListing.controller.js";

import{getBidsPerDayController,getActiveInactiveUsersController,getMostPopularCarsController,getMostBookedCarCategoriesController,getAverageBidPerCategoryController,getCarsListedByCategoryController, getNewUserOverTimeController, activeBiddingPerHourController}from "../../controllers/admin/stats/stats.controller.js"
/**
 * @type {express.Router}
 * @description Create an Express router instance
 */
const router=express.Router();

/**
 * @description Route to get all users (admin only)
 */
router.get("/getusers",authenticateJwtAdmin,getUsers)

/**
 * @description Route to update user block status (admin only)
 */
router.patch("/users/:id",authenticateJwtAdmin,updateUserBlockStatus);

router.patch("/usersauth/:id",authenticateJwtAdmin,updateUserAuthStatus);


/**
 * @description Route to get all listings (admin only)
 */
router.get("/getlistings",authenticateJwtAdmin,getAdminListings)

/**
 * @description Route to update listings (admin only)
*/
router.patch("/updatelisting/:id",authenticateJwtAdmin,deleteListing)



/**
 * @description Route to get bids per day for last 7 days (admin only)
 */
router.get("/stats/bidlast7days",authenticateJwtAdmin,getBidsPerDayController)
/**
 * @description Route to get active and inactive user counts (admin only)
 */
router.get("/stats/getactiveinactiveuser",authenticateJwtAdmin,getActiveInactiveUsersController)
/**
 * @description Route to get most popular cars (admin only)
 */
router.get("/stats/getmostbookedcars",authenticateJwtAdmin,getMostPopularCarsController)
/**
 * @description Route to get most booked car categories (admin only)
 */
router.get("/stats/mostbookedcarcategories",authenticateJwtAdmin,getMostBookedCarCategoriesController)
/**
 * @description Route to get average bid amount per car category (admin only)
 */
router.get("/stats/avgbidamountpercarcategories",authenticateJwtAdmin,getAverageBidPerCategoryController)
/**
 * @description Route to get car count per category (admin only)
 */
router.get("/stats/carcountpercategory",authenticateJwtAdmin,getCarsListedByCategoryController)

router.get("/stats/getNewUserOverTime",authenticateJwtAdmin,getNewUserOverTimeController)


router.get("/stats/activeBiddingPerHour",authenticateJwtAdmin,activeBiddingPerHourController)



export default router