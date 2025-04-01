/**
 * @import Conversation schema for database operations
 */
import Conversation from "../../models/chats/conversation.schema.js";

/**
 * @description Controller to fetch all conversations for a specific owner
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Returns all conversations for the owner
 */
const getAllConversations = async (req, res) => {
    try {
        console.log("dcs")
          /**
         * @type {String}
         * @description ID of the owner to fetch conversations for
         */
        const { ownerId } = req.params;

         /**
         * @type {Array}
         * @description Find all conversations for the owner and convert to plain objects
         */
        const conversations = await Conversation.find({ ownerId: ownerId }).lean();

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
