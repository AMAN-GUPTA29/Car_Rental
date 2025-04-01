/**
 * @import Chat schema for database operations
 */

import Chat from "../../models/chats/chats.schema.js";


/**
 * @description Controller to fetch all chat messages for a specific conversation
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Returns all chat messages for the conversation
 */
const getChatMessages =  async (req, res) => {
    try {

        /**
       * @type {String}
       * @description ID of the conversation to fetch messages for
       */
      const { conversationId } = req.params;

      /**
       * @description Validate conversation ID
       */
      if (!conversationId) {
        return res.status(400).json({
          message: "Conversation ID is required"
        });
      }
       /**
       * @type {Array}
       * @description Find all chat messages for the conversation, sort by timestamp, and convert to plain objects
       * @description Used lean to return plain js object instead of mongo object
       */
      const chats = await Chat.find({ conversationId })
                              .sort({ timestamp: 1 }) 
                              .lean();


       /**
       * @description Return success response with chat messages
       */

      res.status(200).json({
        message: "Chat messages retrieved successfully",
        count: chats.length,
        conversationId,
        chats
      });

    } catch (error) {
      /**
       * @description Log and return error response
       */
      console.error("Error fetching chat messages:", error);
      res.status(500).json({
        message: "Failed to retrieve chat messages",
        error: error.message
      });
    }
  
};

export {getChatMessages};
