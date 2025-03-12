carRentalApp.service("ownerdb", [
  "db",
  "$q",
  "idGeneratorService",
  function (db, $q, idGeneratorService) {
    this.createListing = function (carDetails, owner) {
      console.log("dcsd");
      console.log(carDetails);
      console.log(owner);
      const carData = {
        ownerID: owner.id,
        owner: {
          ownerEmail: owner.email,
          ownerName: owner.name,
        },
        cardata: {
          carMake: carDetails.carMake,
          carModel: carDetails.carModel,
          carYear: carDetails.carYear,
          basePrice: carDetails.carPrice,
          outstationPrice: carDetails.carOutstationPrice,
          carColor: carDetails.carColor,
          carMileage: carDetails.carMileage,
          carTransmission: carDetails.carTransmission,
          carCategory: carDetails.carCategory,
          carDescription: carDetails.carDescription,
          carAddress: carDetails.carAddress,
          carcity: carDetails.carcity,
          images: carDetails.images,
          isDeleted: false,
        },
      };

      db.saveListing(carData);
    };

    this.getListingsByOwner = function (ownerID) {
      const deferred = $q.defer();
      db.getAllListings()
        .then((listings) => {
          listings = listings.filter((listing) => listing.ownerID === ownerID);
          deferred.resolve(listings);
        })
        .catch((err) => {
          deferred.reject(err);
        });
      return deferred.promise;
    };

    this.getCarListingById = function (listingID) {
      const deferred = $q.defer();
      db.getAllListings()
        .then((listing) => {
          const car = listing.find((car) => car.listingID === listingID);
          deferred.resolve(car);
        })
        .catch((err) => {
          deferred.reject(err);
        });

      return deferred.promise;
    };

    this.getPendingBiddingsOwnerCar = function (ownerID, listingID) {
      console.log(ownerID, listingID);
      const deferred = $q.defer();
      db.getAllBiddings()
        .then((biddings) => {
          const bids = biddings.filter(
            (bid) =>
              bid.cardata.listingID === listingID &&
              bid.owner.ownerID === ownerID &&
              bid.status === "pending"
          );
          deferred.resolve(bids);
        })
        .catch((err) => {
          deferred.reject(bids);
        });

      return deferred.promise;
    };

    this.statusbiddings = function (bid, status, user, car) {
      let bidid = bid.biddingID;
      const deferred = $q.defer();
      db.statuschangebooking(bidid, status)
        .then((result) => {
          if (status === "rejected") {
            deferred.resolve(result);
            return deferred.promise;
          }
          db.statusrejectbooking(result)
            .then((result) => {
              db.conversationcheck(car, user)
                .then((result) => {
                  deferred.resolve(result);
                })
                .catch((err) => {
                  deferred.reject(err);
                });
            })
            .catch((err) => {
              deferred.reject(err);
            });
        })
        .catch((err) => {
          deferred.reject(err);
        });

      return deferred.promise;
    };

    this.loadingconversation = function (ownerID) {
      const deferred = $q.defer();
      db.getconversation()
        .then((result) => {
          const conversation = result.filter(
            (convo) => convo.ownerID === ownerID
          );
          deferred.resolve(conversation);
        })
        .catch((err) => {
          deferred.reject(err);
        });

      return deferred.promise;
    };

    this.getChatMessageOwner = function (ownerID, userID) {
      const deferred = $q.defer();
      conversationID = `${ownerID}${userID}`;
      db.getChatMessage()
        .then((result) => {
          const chat = result.filter(
            (chat) => chat.conversationID === conversationID
          );
          deferred.resolve(chat);
        })
        .catch((err) => {
          deferred.reject(err);
        });

      return deferred.promise;
    };

    this.saveChatMessage = function (message, sentBy, isImage, selectedConvo) {
      const deferred = $q.defer();

      conversationID = `${selectedConvo.ownerID}${selectedConvo.bookerID}`;
      const chatid = idGeneratorService.generateChatID();
      const chat = {
        chatID: chatid,
        conversationID: conversationID,
        chatString: message,
        sentBy: sentBy,
        isImage: isImage,
        timestamp: new Date().toISOString(),
      };

      db.chatMessagesave(chat)
        .then((result) => {
          deferred.resolve(result);
        })
        .catch((err) => {
          deferred.reject(err);
        });

      return deferred.promise;
    };

    this.getBid = function (ownerID, bookerID) {
      const deferred = $q.defer();
      db.getAllBiddings()
        .then((result) => {
          const bids = result.filter(
            (res) =>
              res.booker.bookerId === bookerID && res.owner.ownerID === ownerID
          );
          deferred.resolve(bids);
        })
        .catch((err) => {
          deferred.reject(err);
        });

      return deferred.promise;
    };

    this.getApprovedBidsOwner = function (ownerID) {
      const deferred = $q.defer();
      db.getAllBiddingsHistory()
        .then((result) => {
          const bids = result.filter((res) => res.owner.ownerID === ownerID);

          deferred.resolve(bids);
        })
        .catch((err) => {
          deferred.reject(err);
        });

      return deferred.promise;
    };

    this.getUpcomingBookings = function (ownerID) {
      const deferred = $q.defer();
      db.getAllBiddingsHistory()
        .then((result) => {
          console.log(result);
          console.log(ownerID);
          const today = new Date();
          console.log(today);

          const history = result.filter(
            (res) =>
              res.owner.ownerID === ownerID &&
              res.startDate >= today &&
              (res.status === "accepted" || res.status === "accept") &&
              res.startkm === "NA"
          );
          const nearestBookings = {};
          history.forEach((booking) => {
            const listingID = booking.cardata.listingID;
            if (
              !nearestBookings[listingID] ||
              new Date(booking.startDate) <
                new Date(nearestBookings[listingID].startDate)
            ) {
              nearestBookings[listingID] = booking;
            }
          });
          deferred.resolve(Object.values(nearestBookings));
        })
        .catch((err) => {
          deferred.reject(err);
        });

      return deferred.promise;
    };

    this.updateStartKm = function (historyID, startKm) {
      const deferred = $q.defer();
      db.updateStartKm(historyID, startKm)
        .then((result) => {
          deferred.resolve(result);
        })
        .catch((err) => {
          deferred.reject(err);
        });

      return deferred.promise;
    };

    this.getUpcomingBookingsend = function (ownerID) {
      const deferred = $q.defer();
      db.getAllBiddingsHistory()
        .then((result) => {
          const today = new Date();
          console.log(today);

          const history = result.filter(
            (res) =>
              res.owner.ownerID === ownerID &&
              res.startDate >= today &&
              (res.status === "accepted" || res.status === "accept") &&
              res.startkm !== "NA" &&
              res.endkm === "NA"
          );
          const nearestBookings = {};
          history.forEach((booking) => {
            const listingID = booking.cardata.listingID;
            if (
              !nearestBookings[listingID] ||
              new Date(booking.endDate) <
                new Date(nearestBookings[listingID].endDate)
            ) {
              nearestBookings[listingID] = booking;
            }
          });
          deferred.resolve(Object.values(nearestBookings));
        })
        .catch((err) => {
          deferred.reject(err);
        });

      return deferred.promise;
    };

    this.carEndKm = function (historyID, endKm) {
      const deferred = $q.defer();
      db.updateEndKm(historyID, endKm)
        .then((result) => {
          const startDate = new Date(result.startDate);
          const endDate = new Date(result.endDate);
          const differenceInMilliseconds = endDate - startDate;
          const differenceInDays =
            differenceInMilliseconds / (1000 * 3600 * 24) + 1;
          let finalamount = parseFloat(result.BidAmount);
          let extrakm = result.endkm - result.startkm - differenceInDays * 100;
          extrakm = extrakm / differenceInDays;

          if (extrakm > 0) {
            let increment =
              selectedBooking.booktype === "outstation" ? 100 : 50;
            let additionalCharge = 0;

            while (extrakm > 0) {
              additionalCharge += increment;
              increment += selectedBooking.booktype === "outstation" ? 100 : 50;
              extrakm -= 100;
            }

            finalamount += additionalCharge * differenceInDays;
          }

          const invoicerecord = {
            invoiceid: idGeneratorService.getinvoiceID(),
            ...result,
            finalamount: finalamount,
            paid: false,
          };

          console.log(invoicerecord);

          deferred.resolve(invoicerecord);
        })
        .catch((err) => {
          deferred.reject(err);
        });

      return deferred.promise;
    };

    this.updateInvoice = function (invoice) {
      const deferred = $q.defer();
      db.genrateInvoice(invoice)
        .then((result) => {
          deferred.resolve(result);
        })
        .catch((err) => {
          deferred.reject(err);
        });

      return deferred.promise;
    };

    this.updateCarListing = function (lisitngID,careditdata) {
    //   console.log(careditdata);
      const cardata = {
        basePrice:careditdata.carPrice,
        carAddress: careditdata.carAddress,
        carCategory: careditdata.carCategory,
        carColor: careditdata.carColor,
        carMake:careditdata.carMake,
        carMileage: careditdata.carMileage,
        carModel: careditdata.carModel,
        carTransmission: careditdata.carTransmission,
        carYear: careditdata.carYear,
        outstationPrice: careditdata.carOutstationPrice,
      };
      const deferred=$q.defer();

      db.updateCarListing(lisitngID,cardata).then((result) => {
          deferred.resolve(result);
          }).catch((err) => {
              deferred.reject(err)
              });
            return deferred.promise;
    };
  },
]);
