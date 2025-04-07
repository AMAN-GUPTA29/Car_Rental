import mongoose from "mongoose";

const attachmentSchema = new mongoose.Schema({
  AttachmentString: {
    type: String,
    required: true,
    trim: true
  },
  conversationId: {
    type: String,
    required: true,
    index: true,
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

attachmentSchema.index({ conversationId: 1, timestamp: -1 });

const Attachment = mongoose.model('Attachment', attachmentSchema);
export default Attachment;
