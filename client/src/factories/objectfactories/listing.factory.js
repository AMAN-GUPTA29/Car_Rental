carRentalApp.factory("ListingFactory", [
  "validationService",
  "ownerdb",
  "$q",
  "consumerdb",
  "admindb",
  function (validationService, ownerdb, $q, consumerdb,admindb) {
    function Listing(initialData = {}) {
      this.ownerDetails = initialData.owner || {
        ownerID: "",
        ownerEmail: "",
        ownerName: "",
      };

      this.images = initialData.images || [];

      this.carData = initialData.cardata || {
        carMake: "",
        carModel: "",
        carYear: "",
        basePrice: "",
        outstationPrice: "",
        carColor: "#000000",
        carMileage: "",
        carTransmission: "",
        carCategory: "",
        carDescription: "",
        carAddress: "",
        carcity: "",
      };

      this.id = initialData._id || null;
    }

    Listing.prototype = {
      // New verification method using promises
      verify: function () {
        const deferred = $q.defer();
        const errors = [];
        console.log("verify", this);
        // Validate owner details
        if (!this.ownerDetails.ownerID) {
          errors.push("Owner ID is required");
        }

        if (!this.ownerDetails.ownerEmail) {
          errors.push("Owner email is required");
        } else if (!isValidEmail(this.ownerDetails.ownerEmail)) {
          errors.push("Invalid owner email format");
        }

        if (
          !this.ownerDetails.ownerName ||
          this.ownerDetails.ownerName.trim() === ""
        ) {
          errors.push("Owner name is required");
        }

        // Validate car data
        if (!this.carData.carMake || this.carData.carMake.trim() === "") {
          errors.push("Car make is required");
        }

        if (!this.carData.carModel || this.carData.carModel.trim() === "") {
          errors.push("Car model is required");
        }

        // Validate year
        if (!this.carData.carYear) {
          errors.push("Car year is required");
        } else {
          const yearError = validationService.validateYear(
            this.carData.carYear
          );
          if (yearError) errors.push(yearError);
        }

        // Validate prices
        if (!this.carData.basePrice) {
          errors.push("Base price is required");
        } else {
          const basePriceError = validationService.validatePrice(
            this.carData.basePrice
          );
          if (basePriceError) errors.push(basePriceError);
        }

        if (!this.carData.outstationPrice) {
          errors.push("Outstation price is required");
        } else {
          const outstationPriceError = validationService.validatePrice(
            this.carData.outstationPrice
          );
          if (outstationPriceError) errors.push(outstationPriceError);
        }

        // Validate mileage
        if (!this.carData.carMileage) {
          errors.push("Car mileage is required");
        } else {
          const mileageError = validationService.validateMileage(
            this.carData.carMileage
          );
          if (mileageError) errors.push(mileageError);
        }

        // Validate other car details
        if (!this.carData.carTransmission) {
          errors.push("Transmission type is required");
        } else {
          const validTransmissions = ["Manual", "Automatic", "Semi-Automatic"];
          if (!validTransmissions.includes(this.carData.carTransmission)) {
            errors.push(
              "Invalid transmission type. Must be Manual, Automatic, or Semi-Automatic"
            );
          }
        }

        if (!this.carData.carCategory) {
          errors.push("Car category is required");
        }

        if (!this.carData.carAddress || this.carData.carAddress.trim() === "") {
          errors.push("Car address is required");
        }

        if (!this.carData.carcity || this.carData.carcity.trim() === "") {
          errors.push("Car city is required");
        }

        // Validate images
        if (!this.images || this.images.length === 0) {
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
        console.log("csdw");
        // Call verify method before creating the listing
        this.verify()
          .then(() => {
            return ownerdb.createListing(this);
          })
          .then(() => {
            deferred.resolve("Success");
          })
          .catch((error) => {
            deferred.reject(error);
          });

        return deferred.promise;
      },

      update: function () {
        if (!this.id) {
          return Promise.reject(new Error("Listing ID is required for update"));
        }
        // return dataService.updateListing(this);
      },

      fetch: function () {
        const deferred = $q.defer();

        if (!this.id) {
          deferred.reject(new Error("Listing ID is required to fetch data"));
          return deferred.promise;
        }

        ownerdb
          .getCarListingById(this.id)
          .then((result) => {
            console.log("wccwcw", result);

            this.ownerDetails = result.ownerDetails;

            this.images = result.images;

            this.carData = result.carData;

            deferred.resolve(this);
          })
          .catch((error) => {
            deferred.reject(error);
          });

        return deferred.promise;
      },

      fetchConsumer: function () {
        const deferred = $q.defer();
        const self = this;

        consumerdb
          .getCarListingById(this.id)
          .then(function (car) {
            // Update the current instance with fetched data
              console.log("carll",car)
              self.ownerDetails = car.ownerDetails;
            

          
              self.images = car.images;
            

            
              self.carData = car.carData;
            


              deferred.resolve(self);
            
          })
          .catch(function (error) {
            deferred.reject(error);
          });

        return deferred.promise;
      },

      block: function() {
        const deferred = $q.defer();
        // console.log("this",this)
        if (!this.id) {
          return deferred.reject(new Error('Listing is required to block a user.'));
        }
        const params = {
          id: this.id,
        }
    
        admindb.updatelisting(params, true).then((result) => {
          deferred.resolve(result);
        }).catch((err) => {
          deferred.reject(err)
        });
  
        return deferred.promise;
      },
    
      unblock: function() {
        const deferred = $q.defer();
  
        if (!this.id) {
          return deferred.reject(new Error('Listing is required to unblock a user.'));
        }
       
        const params = {
          id: this.id,
        }
  
        admindb.updatelisting(params, false)
          .then((response) => {
            deferred.resolve(response);
          }).catch((err) => {
            deferred.reject(err)
          });
  
        return deferred.promise;
      },

      // Keep the existing validate method for backward compatibility
      validate: function () {
        const errors = {};

        if (!this.ownerDetails.ownerID) errors.ownerID = "Owner ID is required";
        if (!this.ownerDetails.ownerEmail)
          errors.ownerEmail = "Owner email is required";
        if (!this.ownerDetails.ownerName)
          errors.ownerName = "Owner name is required";

        if (!this.carData.carMake) errors.carMake = "Car make is required";
        if (!this.carData.carModel) errors.carModel = "Car model is required";

        const yearError = validationService.validateYear(this.carData.carYear);
        if (yearError) errors.carYear = yearError;

        const basePriceError = validationService.validatePrice(
          this.carData.basePrice
        );
        if (basePriceError) errors.basePrice = basePriceError;

        const outstationPriceError = validationService.validatePrice(
          this.carData.outstationPrice
        );
        if (outstationPriceError) errors.outstationPrice = outstationPriceError;

        const mileageError = validationService.validateMileage(
          this.carData.carMileage
        );
        if (mileageError) errors.carMileage = mileageError;

        if (!this.carData.carTransmission)
          errors.carTransmission = "Transmission type is required";
        if (!this.carData.carCategory)
          errors.carCategory = "Car category is required";
        if (!this.carData.carAddress)
          errors.carAddress = "Car address is required";
        if (!this.carData.carcity) errors.carcity = "Car city is required";

        if (!this.images || this.images.length === 0)
          errors.images = "At least one image is required";

        return Object.keys(errors).length === 0 ? null : errors;
      },
    };

    Listing.fetchAll = function (ownerId) {
      const deferred = $q.defer();

      ownerdb
        .getListingsByOwner(ownerId)
        .then(function (listings) {
          deferred.resolve(listings);
        })
        .catch(function (error) {
          deferred.reject(error);
        });

      return deferred.promise;
    };

    Listing.fetchAllCarAdmin=function(params)
    {
      const deferred = $q.defer();

      admindb.loadListings(params)
      .then(function (listings) {
        // return listings;
        deferred.resolve(listings);
      })
      .catch(function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    }

    Listing.getAllCarListing = function (params) {
      const deferred = $q.defer();

      consumerdb
        .getAllCarListings(params)
        .then(function (listings) {
          // return listings;
          deferred.resolve(listings);
        })
        .catch(function (error) {
          deferred.reject(error);
        });
      return deferred.promise;
    };

    // Helper function for email validation
    function isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }

    return Listing;
  },
]);
