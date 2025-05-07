/**
 * @import User schema 
 * @import mongoose
 */
import User from '../../models/users/user.schema.js';
import mongoose from 'mongoose';
import { sendUserStatusMail,sendAuthorizationMail } from '../../utils/nodemailer.js';

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns {array} list of users
 */
 const getUsers = async (req, res) => {
    try {
        const { page = 1, limit = 5, email } = req.query;
        const skip = (page - 1) * limit;

        /**
         * @match matching the email for searching also checking partial email
         * @facet runs parrale aggregation which are here paginated result and total count one does pagination with skip and limit and other total count;
         * @project the required data
         */
        const pipeline = [
            {
                $match: {
                    role: { $ne: 'admin' },
                    ...(email && { 
                        email: { $regex: email, $options: 'i' }
                    })
                }
            },
            {
                $sort: { signupDate: -1 }  // newest first
            },
            {
                $facet: {
                    paginatedResults: [
                        { $skip: skip },
                        { $limit: parseInt(limit) },
                        { $project: { password: 0 } }
                    ],
                    totalCount: [
                        { $count: 'count' }
                    ]
                }
            },
            {
                $project: {
                    users: '$paginatedResults',
                    totalItems: { $arrayElemAt: ['$totalCount.count', 0] },
                    currentPage: { $literal: parseInt(page) },
                    totalPages: { 
                        $ceil: { 
                            $divide: [
                                { $arrayElemAt: ['$totalCount.count', 0] }, 
                                parseInt(limit)
                            ] 
                        } 
                    }
                }
            }
        ];

        const result = await User.aggregate(pipeline);
        const response = result[0] || { users: [], totalItems: 0 };
        
        /**
         * @response returns the paginated result Users with total count
         */
        res.status(200).json({
            success: true,
            data: response
        });

    } catch (error) {
        console.error('Error in getUsers:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching users',
            error: error.message
        });
    }
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns for blocking and unblocking of the user
 */
 const updateUserBlockStatus = async (req, res) => {
    try {
        console.log("scs")
        const { id } = req.params;
        const { blocked } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        /**
         * @param {ObjectId} id - user id
         * update the block status of the user and while returning updated document removes password
         */
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { $set: { blocked } },
            { 
                new: true,         // Return the modified document
            }
        ).select('-password');
        

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        sendUserStatusMail(updatedUser,blocked);
        /**
         * Returning message for updated data
         */
        res.status(200).json({
            success: true,
            message: `User ${blocked ? 'blocked' : 'unblocked'} successfully`,
            user: updatedUser
        });

    } catch (error) {
        console.error('Error in updateUserBlockStatus:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating user status',
            error: error.message
        });
    }
};

const updateUserAuthStatus = async (req, res) => {
    try {
        console.log("scs")
        const { id } = req.params;
        const { authorise } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        /**
         * @param {ObjectId} id - user id
         * update the block status of the user and while returning updated document removes password
         */
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { $set: { authorise } },
            { 
                new: true,         // Return the modified document
            }
        ).select('-password');
        

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        sendAuthorizationMail(updatedUser);
        /**
         * Returning message for updated data
         */
        res.status(200).json({
            success: true,
            message: `User authorised successfully`,
            user: updatedUser
        });

    } catch (error) {
        console.error('Error in updateUserBlockStatus:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating user status',
            error: error.message
        });
    }
};



export {getUsers,updateUserBlockStatus,updateUserAuthStatus}