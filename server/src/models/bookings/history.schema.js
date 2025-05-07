import mongoose from "mongoose";


const historySchema = new mongoose.Schema({
    biddingId: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      unique: true
    },
    bidAmount: {
      type: Number,
      required: true
    },
    biddingDate: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      required: true
    },
    bookType: {
      type: String,
      required: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    startkm: {
      type: Number
    },
    endkm: {
      type: Number,
    },
    paid: {
      type: Boolean,
      default: false
    },
  carData: {
      listingId:{
          type:mongoose.SchemaTypes.ObjectId,
          required:true
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
        type: mongoose.Schema.Types.ObjectId,
        required: true
      },
      ownerName: {
        type: String,
        required: true
      },
      ownerEmail: {
        type: String,
        required: true
      }
    },
    bookerData: {
      bookerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
      },
      bookerName: {
        type: String,
        required: true
      },
      aadhar: {
        type: String,
        required: true
      }
    },
  });
  
  const History = mongoose.model('History', historySchema);



  historySchema.index({ "bookerData.bookerId": 1 });
  historySchema.index({ "carData.listingId": 1 });
  historySchema.index({ "ownerDetails.ownerID": 1 });
  historySchema.index({ status: 1 });

  export default History;
  