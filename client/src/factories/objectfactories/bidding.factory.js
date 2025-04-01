carRentalApp.factory("BiddingFactory", [
  "validationService",
  "consumerdb",
  "$q",
  "db",
  "ownerdb",
  function (validationService, consumerdb, $q,db,ownerdb) {
    function Bidding(initialData = {}) {
      // Core properties with defaults
      this.ownerDetails = initialData.ownerDetails || {
        ownerId: "",
        ownerEmail: "",
        ownerName: "",
      };

      this.carData = initialData.carData || {
        listingId: "",
        carMake: "",
        carModel: "",
        basePrice: "",
        outstationPrice: "",
        carMileage: "",
        carYear: "",
        carColor: "",
        carAddress: "",
        carCategory: "",
        carDescription: "",
        carTransmission: "",
        carcity: "",
      };

      this.bookerData = initialData.bookerData || {
        bookerName: "",
        bookerId: "",
        aadhar: "",
      };

      this.images = initialData.images || [];
      this.startDate = initialData.startDate || null;
      this.endDate = initialData.endDate || null;
      this.bidAmount = initialData.bidAmount || 0;
      this.bookType = initialData.bookType || "";
      this.startkm = initialData.startkm || -1;
      this.endkm = initialData.endkm || -1;
      this.status = initialData.status || "pending";
      this.id = initialData._id || null;
    }

    Bidding.prototype = {
      verify: function () {
        const deferred = $q.defer();
        const errors = [];
        console.log("this", this);
        // Owner validation
        if (!this.ownerDetails.ownerID) {
          errors.push("Owner ID is required");
        }

        if (!this.ownerDetails.ownerEmail) {
          errors.push("Owner email is required");
        }

        if (!this.ownerDetails.ownerName) {
          errors.push("Owner name is required");
        }

        // Car validation
        if (!this.carData.listingId) {
          errors.push("Listing ID is required");
        }

        // Booker validation
        if (!this.bookerData.bookerName) {
          errors.push("Booker name is required");
        }

        if (!this.bookerData.bookerId) {
          errors.push("Booker ID is required");
        }

        if (!this.bookerData.aadhar) {
          errors.push("Aadhar is required");
        } else {
          // Validate Aadhar format (12 digits)
          const aadharRegex = /^\d{12}$/;
          if (!aadharRegex.test(this.bookerData.aadhar)) {
            errors.push("Aadhar must be exactly 12 digits");
          }
        }

        // Booking validation
        if (!this.startDate) {
          errors.push("Start date is required");
        }

        if (!this.endDate) {
          errors.push("End date is required");
        }

        if (
          this.startDate &&
          this.endDate &&
          new Date(this.startDate) > new Date(this.endDate)
        ) {
          errors.push("End date must be after start date");
        }

        if (!this.bidAmount || this.bidAmount <= 0) {
          errors.push("Bid amount must be greater than zero");
        } else {
          const amountError = validationService.validatePrice(this.bidAmount);
          if (amountError) errors.push(amountError);
        }

        if (!this.bookType) {
          errors.push("Trip type is required");
        } else {
          const validBookTypes = ["local", "outstation"];
          if (!validBookTypes.includes(this.bookType.toLowerCase())) {
            errors.push("Trip type must be either local or outstation");
          }
        }

        if(this.bookType=='local')
        {
          const startdate = new Date(this.startDate);
          const enddate = new Date(this.endDate);
          
          if(this.bidAmount<(getDaysDifference(startdate , enddate)+1)*this.carData.basePrice)
          {
            errors.push("Bid amount must be greater than base price");
          }
        }
        if(this.bookType=='outstation')
          {
            const startdate = new Date(this.startDate);
            const enddate = new Date(this.endDate);
            
            if(this.bidAmount<(getDaysDifference(startdate , enddate)+1)*this.carData.outstationPrice)
            {
              errors.push("Bid amount must be greater than outstation price");
            }
          }

        if (!this.images || this.images.length < 1) {
          errors.push("At least one image is required");
        }

        // If there are any validation errors, reject with all errors
        if (errors.length > 0) {
          deferred.reject(new Error(errors.join("; ")));
        } else {
          // All validations passed
          deferred.resolve();
        }

        return deferred.promise;
      },

      create: function () {
        const deferred = $q.defer();

        // Call verify method before creating the bidding
        this.verify()
          .then(() => {
            // Call the consumerdb service
            return consumerdb.bookingServiceConsumer(this);
          })
          .then((result) => {
            // Handle successful creation
            this.id = result._id; // Assuming the result contains the new ID
            deferred.resolve(this);
          })
          .catch((error) => {
            deferred.reject(error);
          });

        return deferred.promise;
      },

      getAcceptedBidOwner: function(params) {
        const deferred = $q.defer();
        
        db.getAcceptedBidOwner(params)
          .then(function(response) {
            deferred.resolve(response);
          })
          .catch(function(error) {
            deferred.reject(error);
          });
        
        return deferred.promise;
      },


      getPendingBiddingsOwnerCar : function(ownerId, listingId) {
        const deferred = $q.defer();
        ownerdb.getPendingBiddingsOwnerCar(ownerId, listingId)
        .then(function(response) {
          deferred.resolve(response);
        })
        .catch(function(error) {
          deferred.reject(error);
        });
        return deferred.promise;
      },


      acceptBid : function(bid, user, car) {
        
        const deferred = $q.defer();
        ownerdb.statusbiddings(bid, "accept", user, car)
        .then(function(response) {
          deferred.resolve(response);
        })
        .catch(function(error) {
          deferred.reject(error);
        });
        return deferred.promise;
      },

      rejectBid: function(bid,user,car) {
        const deferred = $q.defer();
        ownerdb.statusbiddings(bid, "rejected",user,car)
        .then(function(response) {
          deferred.resolve(response);
        })
        .catch(function(error) {
          deferred.reject(error);
        });
        return deferred.promise;
      },

      getUpcomingBookings: function(userId) {
        const deferred = $q.defer();
         ownerdb.getUpcomingBookings(userId)
         .then(function(response) {
          deferred.resolve(response);
        })
        .catch(function(error) {
          deferred.reject(error);
        });
        return deferred.promise;
      },

      updateStartKm : function(bookingId, kmValue) {
        const deferred = $q.defer();
        ownerdb.updateStartKm(bookingId, kmValue)
        .then(function(response) {
          deferred.resolve(response);
        })
        .catch(function(error) {
          deferred.reject(error);
        });
        return deferred.promise;
      },

      getUpcomingBookingsEnd : function(userId) {
        const deferred = $q.defer();
         ownerdb.getUpcomingBookingsend(userId)
         .then(function(response) {
          deferred.resolve(response);
        })
        .catch(function(error) {
          deferred.reject(error);
        });
        return deferred.promise;
      },

      updateEndKm : function(bookingId, kmValue) {
        const deferred = $q.defer();
         ownerdb.carEndKm(bookingId, kmValue)
         .then(function(response) {
          deferred.resolve(response);
        })
        .catch(function(error) {
          deferred.reject(error);
        });
        return deferred.promise;
      },

      

      update: function () {
        if (!this.id) throw new Error("Bidding ID required for update");
        //   return dataService.updateBidding(this);
      },

      fetch: function () {
        if (!this.id) throw new Error("Bidding ID required for fetch");
        //   return dataService.getBidding(this.id)
        //     .then(response => Object.assign(this, response.data));
      },

      cancel: function () {
        if (!this.id) throw new Error("Bidding ID required for cancellation");
        //   return dataService.updateBiddingStatus(this.id, 'cancelled')
        //     .then(() => this.status = 'cancelled');
      },

     
    };

    Bidding.getUserBiddingHistory = function(userId, filters, page, rowsPerPage) {
      return consumerdb.getUserBiddingHistory(userId, filters, page, rowsPerPage);
    };

    Bidding.getUserBiddingHistory=function(userId, filters, page, rowsPerPage)
    {
      const deferred = $q.defer();

      db.getUserBiddingHistory(userId, filters, page, rowsPerPage)
      .then(function (biddings) {
        deferred.resolve(biddings);
      })
      .catch(function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    }

    function getDaysDifference(startDate, endDate) {
      console.log(typeof(startDate));
      const diffInTime = endDate.getTime() - startDate.getTime();
      return Math.round(diffInTime / (1000 * 60 * 60 * 24));
    }

    return Bidding;
  },
]);
