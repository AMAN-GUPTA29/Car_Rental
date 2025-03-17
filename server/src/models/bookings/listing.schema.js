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
      required: true, // Example values: Hatchback, Sedan, SUV
    },
    carColor: {
      type: String,
      required: true, // Example value: Hex color code like "#ff0000"
    },
    carDescription: {
      type: String,
      required: false, // Optional description
    },
    carName: {
      type: String,
      required: true, // Example values like "New", "Used"
    },
    carMileage: {
      type: Number,
      required: true, // In kilometers per liter (or other units)
    },
    carModel: {
      type: String,
      required: true, // Example value like "Honda"
    },
    carTransmission: {
      type: String, // Restrict to valid options
      required: true,
    },
    carYear: {
      type: Number,
      required: true, // Example value like 2012
    },
    carcity: {
      type: String,
      required: true, // City where the car is listed
    },
  },
  images: [
    {
      type: String, // Base64 encoded image or image URL
      required: false,
    },
  ],
  isDeleted: {
    type: Boolean,
    default: false, // Default to `false` if not provided
  },
  isBlocked: {
    type: Boolean,
    default: false, // Default to `false` if not provided
  },
  ownerDetails: {
    ownerID: {
      type: String,
      required: true, // Unique identifier for the owner
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
