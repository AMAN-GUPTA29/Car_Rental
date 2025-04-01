carRentalApp.service("ownerdb", [
  "db",
  "$q",
  "idGeneratorService",
  function (db, $q, idGeneratorService) {
    this.createListing = function (carData) {
      db.saveListing(carData);
    };

    this.getListingsByOwner = function (ownerID) {
      const deferred = $q.defer();
      db.getAllListings()
        .then((listings) => {
          deferred.resolve(listings);
        })
        .catch((err) => {
          deferred.reject(err);
        });
      return deferred.promise;
    };

    this.getCarListingById = function (listingId) {
      const deferred = $q.defer();
      db.getListingOwner(listingId)
        .then((listing) => {
          const car = listing;
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
      db.getBiddingsOwner(listingID)
        .then((biddings) => {
          const bids = biddings;
          deferred.resolve(bids);
        })
        .catch((err) => {
          deferred.reject(bids);
        });

      return deferred.promise;
    };

    this.statusbiddings = function (bid, status, user, car) {
      console.log("sedsc",car)
  
      const deferred = $q.defer();
      const statusobj={
        biddingId : bid._id,
        listingId:car.id,
        accepted: status==="accept"
      }
      db.statuschangebooking(statusobj)
        .then((result) => {
          console.log(result);
         deferred.resolve(result);
        })
        .catch((err) => {
          deferred.reject(err);
        });

      return deferred.promise;
    };

    this.loadingconversation = function (ownerID) {
      const deferred = $q.defer();
      db.getconversationowner(ownerID)
        .then((result) => {
          const conversation = result.conversations;
          deferred.resolve(conversation);
        })
        .catch((err) => {
          deferred.reject(err);
        });

      return deferred.promise;
    };

    this.getChatMessageOwner = function (ownerID, userID) {
      const deferred = $q.defer();
      conversationId = `${ownerID}${userID}`;
      db.getChatMessageOwner(conversationId)
        .then((result) => {
          const chat = result.chats
          deferred.resolve(chat);
        })
        .catch((err) => {
          deferred.reject(err);
        });

      return deferred.promise;
    };

    this.saveConversation = function (owner, user, chatString, sentBy, isImage) {
      const deferred = $q.defer();
      let chat = {
        chatString:chatString,
        isImage:isImage,
        sentBy:sentBy   
      }
      db.conversationcheckowner(owner, user,chat)
        .then((result) => {
              deferred.resolve(result);
        })
        .catch((err) => {
          deferred.reject("convo invalid");
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
      db.getUpcomingBiddings(ownerID)
        .then((result) => {
          console.log(result);
          
          deferred.resolve(result);
        })
        .catch((err) => {
          deferred.reject(err);
        });

      return deferred.promise;
    };

    this.updateStartKm = function (listingId, startKm) {
      const deferred = $q.defer();
      db.updateStartKm(listingId, startKm)
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
      db.getEndingBiddings(ownerID)
        .then((result) => {
          console.log(result);
          
          deferred.resolve(result);
        })
        .catch((err) => {
          deferred.reject(err);
        });

      return deferred.promise;

    
    };

    this.carEndKm = function (listingId, endKm) {
      console.log("wwdw",listingId,endKm)
      const deferred = $q.defer();
      db.updateEndKm(listingId, endKm)
        .then((result) => {
          deferred.resolve(result);
        })
        .catch((err) => {
          deferred.reject(err);
        });

      return deferred.promise;
    };

    // this.carEndKm = function (historyID, endKm) {
    //   const deferred = $q.defer();
    //   db.updateEndKm(historyID, endKm)
    //     .then((result) => {
    //       const startDate = new Date(result.startDate);
    //       const endDate = new Date(result.endDate);
    //       const differenceInMilliseconds = endDate - startDate;
    //       const differenceInDays =
    //         differenceInMilliseconds / (1000 * 3600 * 24) + 1;
    //       let finalamount = parseFloat(result.BidAmount);
    //       let extrakm = result.endkm - result.startkm - differenceInDays * 100;
    //       extrakm = extrakm / differenceInDays;

    //       if (extrakm > 0) {
    //         let increment =
    //           selectedBooking.booktype === "outstation" ? 100 : 50;
    //         let additionalCharge = 0;

    //         while (extrakm > 0) {
    //           additionalCharge += increment;
    //           increment += selectedBooking.booktype === "outstation" ? 100 : 50;
    //           extrakm -= 100;
    //         }

    //         finalamount += additionalCharge * differenceInDays;
    //       }

    //       const invoicerecord = {
    //         invoiceid: idGeneratorService.getinvoiceID(),
    //         ...result,
    //         finalamount: finalamount,
    //         paid: false,
    //       };

    //       console.log(invoicerecord);

    //       deferred.resolve(invoicerecord);
    //     })
    //     .catch((err) => {
    //       deferred.reject(err);
    //     });

    //   return deferred.promise;
    // };

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
