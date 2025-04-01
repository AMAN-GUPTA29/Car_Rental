import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
  bookerId: {
    type: String,
    required: true,
  },
  bookerName: {
    type: String,
    required: true,
    trim: true
  },
  conversationId: {
    type: String,
    required: true,
    index:true
  },
  ownerId: {
    type: String,
    required: true,
  },
  ownerName: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true 
});


conversationSchema.index({ bookerID: 1, ownerID: 1 });

const Conversation = mongoose.model('conversation', conversationSchema);
export default Conversation;
