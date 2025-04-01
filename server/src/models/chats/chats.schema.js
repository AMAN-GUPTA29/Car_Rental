import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  chatString: {
    type: String,
    required: true,
    trim: true
  },
  conversationId: {
    type: String,
    required: true,
    index: true,
  },
  isImage: {
    type: Boolean,
    default: false
  },
  sentBy: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
    index: true,
    default: Date.now
  }
}, {
  timestamps: true
});

chatSchema.index({ conversationId: 1, timestamp: -1 });

const Chat = mongoose.model('Chat', chatSchema);
export default Chat;
