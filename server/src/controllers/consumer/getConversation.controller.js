/**
 * @import Conversation schema for database operations
 */
import Conversation from "../../models/chats/conversation.schema.js";


/**
 * @description Controller to fetch all conversations for a specific user/booker
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Returns all conversations for the user
 */
const getAllConversations = async (req, res) => {
    try {

      /**
         * @type {String}
         * @description ID of the booker/user to fetch conversations for
         */
        const { bookerId } = req.params;
        const conversations = await Conversation.find({ bookerId: bookerId }).lean();


          /**
         * @description Return success response with conversations
         */
      res.status(200).json({
        message: "Conversations retrieved successfully",
        count: conversations.length,
        conversations
      });

    } catch (error) {
      /**
         * @description Log and return error response
         */
      console.error("Error fetching conversations:", error);
      res.status(500).json({
        message: "Failed to retrieve conversations",
        error: error.message
      });
    }
};

export {getAllConversations};
