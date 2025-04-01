/**
 * @import Mongoose for MongoDB object modeling
 */
import mongoose from "mongoose";

/**
 * @description Mongoose schema for booking/bidding
 * @type {mongoose.Schema}
 */
const bookingSchema = new mongoose.Schema({
  biddingDate: {
    type: Date,
    default: Date.now,
  },
  bidAmount: {
    type: Number,
    required: true,
  },
  bookerData: {
    aadhar: {
      type: Number,
      required: true,
    },
    bookerId: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
    },
    bookerName: {
      type: String,
      required: true,
    },
  },
  bookType: {
    type: String,
    required: true,
  },
  carData: {
    listingId: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
    },
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
  images: [
    {
      type: String,
      required: false,
    },
  ],
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
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  startkm: {
    type: Number,
  },
  endkm: {
    type: Number,
  },
});

const Bidding = mongoose.model("Bidding", bookingSchema);

export default Bidding;
