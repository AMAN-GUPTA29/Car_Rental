import mongoose from "mongoose";

const carSchema = new mongoose.Schema({
  listingDate: {
    type: Date,
    default: Date.now,
  },
  carData: {
    basePrice: {
      type: Number,
      required: true,
    },
    outstationPrice: {
      type: Number,
      required: true,
    },
    carAddress: {
      type: String,
      required: true,
    },
    carCategory: {
      type: String,
      required: true, 
    },
    carColor: {
      type: String,
      required: true, 
    },
    carDescription: {
      type: String,
      required: false, 
    },
    carMake: {
      type: String,
      required: true, 
    },
    carMileage: {
      type: Number,
      required: true, 
    },
    carModel: {
      type: String,
      required: true, 
    },
    carTransmission: {
      type: String,
      required: true,
    },
    carYear: {
      type: Number,
      required: true, 
    },
    carcity: {
      type: String,
      required: true, 
    },
  },
  images: [{
    type: String, // Directly store URLs as strings
    required: false,
  }],
  isDeleted: {
    type: Boolean,
    default: false, 
  },
  isBlocked: {
    type: Boolean,
    default: false, 
  },
  ownerDetails: {
    ownerID: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true, 
    },
    ownerName: {
      type: String,
      required: true,
    },
    ownerEmail: {
      type: String,
      required: true,
    },
  },
});

const Listing = mongoose.model("Listing", carSchema);

export default Listing;
