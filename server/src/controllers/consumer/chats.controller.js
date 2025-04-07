/**
 * @import Conversation schema for database operations
 * @import Chat Schema for database operations
 */
import Conversation from "../../models/chats/conversation.schema.js"
import Chat from "../../models/chats/chats.schema.js";
import Attachment from "../../models/chats/attachments.schema.js";

/**
 * @description Controller to handle conversation creation and chat messages
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Returns conversation details and new chat message
 */
const conversationController  = async (req, res) => {
    try {
       /**
       * @type {Object}
       * @description Destructure owner, user, and chat data from request body
       */
      const { owner, user , chat } = req.body;
    console.log(owner,user,chat);

    /**
       * @description Validate required fields
       */
      if (!owner || !user) {
        return res.status(400).json({ 
          message: "owner and user data are required" 
        });
      }

      
      /**
       * @type {String}
       * @description Generate unique conversation ID
       */
      const conversationId = `${owner.ownerId}${user.id}`;

       /**
       * @type {Object}
       * @description Check if conversation exists
       */
      const existingConversation = await Conversation.findOne({ conversationId });

      /**
       * @description Create new conversation if it doesn't exist
       */
      if (!existingConversation) {
        
        
        const newConversation = new Conversation({
          conversationId:conversationId,
          bookerId: user.id,
          ownerId: owner.ownerId,
          bookerName: user.name,
          ownerName: owner.ownerName || 'Unknown Owner',
        });

       /**
         * @description Save the new conversation
         */
        await newConversation.save();
        console.log("New conversation created:", newConversation);
      }


   /**
       * @type {Object}
       * @description Get Socket.IO instance
       */
      
      

      const newChat=new Chat({
        conversationId: conversationId,
        chatString:chat.chatString,
        isImage:chat.isImage,
        sentBy:chat.sentBy,
        attachment:{}   
        })

        if(chat.isImage==true){
          newChat.attachment={
            AttachmentString: chat.chatString,
            sentBy: chat.sentBy,
          }
        }


        await newChat.save();

        if(chat.isImage==true){
          const attachment=new Attachment({
            AttachmentString: chat.chatString,
            sentBy: chat.sentBy,
            conversationId: conversationId,
          });
  
          await attachment.save();
        }

        
      /**
       * @description Emit new message event to specific room
       */
        const io = req.app.get('io');
        io.to(conversationId).emit('newMessage',newChat);

      console.log("Existing conversation found:", conversationId);

         /**
       * @description Return success response
       */
      return res.status(200).json({
        message: "Conversation exists",
        conversationId: conversationId,
        chat:newChat
      });

    } catch (error) {
      /**
       * @description Log and return error response
       */
      console.error("Error in conversation check:", error);
      return res.status(500).json({
        message: "Internal server error",
        error: error.message
      });
    }
  
};

export {conversationController};
