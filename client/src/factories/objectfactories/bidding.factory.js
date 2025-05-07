




carRentalApp.factory("BiddingFactory", [
  "validationService",
  "consumerdb",
  "$q",
  "db",
  "ownerdb",
  function (validationService, consumerdb, $q,db,ownerdb) {
    function Bidding(initialData = {}) {
       /**
     * @constructor
     * @param {Object} initialData - Initial data for the Bidding object
     */
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
       /**
       * @method verify
       * @description Validates the Bidding object data
       * @returns {Promise} A promise that resolves if validation passes, rejects with errors otherwise
       */
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
       /**
       * @method create
       * @description Creates a new bidding after verification
       * @returns {Promise} A promise that resolves with the created Bidding object
       */
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
      /**
       * @method getAcceptedBidOwner
       * @param {Object} params - Parameters for fetching accepted bids
       * @returns {Promise} A promise that resolves with accepted bids for the owner
       */
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

       /**
       * @method getPendingBiddingsOwnerCar
       * @param {string} ownerId - The ID of the owner
       * @param {string} listingId - The ID of the car listing
       * @returns {Promise} A promise that resolves with pending biddings for the owner's car
       */
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

      /**
       * @method getAllPendingBiddingsOwner
       * @param {string} ownerId - The ID of the owner
       * @returns {Promise} A promise that resolves with all pending biddings for all cars of an owner
       */
      getAllPendingBiddingsOwner : function(ownerId) {
        const deferred = $q.defer();
        console.log("ownerId", ownerId);
        ownerdb.getAllPendingBiddingsOwner(ownerId)
        .then(function(response) {
          deferred.resolve(response);
        })
        .catch(function(error) {
          deferred.reject(error);
        });
        return deferred.promise;
      },

      /**
       * @method acceptBid
       * @param {Object} bid - The bid to accept
       * @param {Object} user - The user accepting the bid
       * @param {Object} car - The car associated with the bid
       * @returns {Promise} A promise that resolves when the bid is accepted
       */
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

       /**
       * @method rejectBid
       * @param {Object} bid - The bid to reject
       * @param {Object} user - The user rejecting the bid
       * @param {Object} car - The car associated with the bid
       * @returns {Promise} A promise that resolves when the bid is rejected
       */
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

      /**
       * @method getUpcomingBookings
       * @param {string} userId - The ID of the user
       * @returns {Promise} A promise that resolves with upcoming bookings for the user
       */
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

       /**
       * @method updateStartKm
       * @param {string} bookingId - The ID of the booking
       * @param {number} kmValue - The starting kilometer value
       * @returns {Promise} A promise that resolves when the start km is updated
       */
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

       /**
       * @method getUpcomingBookingsEnd
       * @param {string} userId - The ID of the user
       * @returns {Promise} A promise that resolves with upcoming bookings ending for the user
       */
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

      /**
       * @method updateEndKm
       * @param {string} bookingId - The ID of the booking
       * @param {number} kmValue - The ending kilometer value
       * @returns {Promise} A promise that resolves when the end km is updated
       */
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


     
    };

     /**
     * @static
     * @method getUserBiddingHistory
     * @param {string} userId - The ID of the user
     * @param {Object} filters - Filters for the bidding history
     * @param {number} page - The page number
     * @param {number} rowsPerPage - The number of rows per page
     * @returns {Promise} A promise that resolves with the user's bidding history
     */
    Bidding.getUserBiddingHistory = function(userId, filters, page, rowsPerPage) {
      return consumerdb.getUserBiddingHistory(userId, filters, page, rowsPerPage);
    };

    /**
     * @function getDaysDifference
     * @param {Date} startDate - The start date
     * @param {Date} endDate - The end date
     * @returns {number} The number of days between the start and end dates
     */
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

        /**
     * @function getDaysDifference
     * @param {Date} startDate - The start date
     * @param {Date} endDate - The end date
     * @returns {number} The number of days between the start and end dates
     */

    function getDaysDifference(startDate, endDate) {
      console.log(typeof(startDate));
      const diffInTime = endDate.getTime() - startDate.getTime();
      return Math.round(diffInTime / (1000 * 60 * 60 * 24));
    }

    return Bidding;
  },
]);
