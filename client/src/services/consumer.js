/**
 * @description this service is used to handle everything related to consumer
 */
carRentalApp.service("consumerdb", [
  "db",
  "validationService",
  "$q",
  "idGeneratorService",
  function (db, validationService, $q, idGeneratorService) {



    /**
     * @returns {Promise}
     * @description This function is used to get all car listings
     */
    this.getAllCarListings = function (params) {
      const deferred = $q.defer();
      db.getAllListingsConsumer(params)
        .then((result) => {
          deferred.resolve(result);
        })
        .catch((err) => {
          deferred.reject(err);
        });
      return deferred.promise;
    };

    /**
     * 
     * @param {*} listingID 
     * @returns {Promise}
     * @description This function is used to get car listing by id
     */
    this.getCarListingById = function (listingID) {
      const deferred = $q.defer();
      db.getListing(listingID)
        .then((listing) => {
          const car = listing;
          deferred.resolve(car);
        })
        .catch((err) => {
          deferred.reject(err);
        });

      return deferred.promise;
    };

    /**
     * 
     * @param {*} bidplace 
     * @param {*} car 
     * @param {*} user 
     * @returns {Promise}
     * @description This function is used to book a car
     */
    this.bookingServiceConsumer = function (bookingData) {
      const deferred = $q.defer();
      // if (!validationService.validateBid(bidplace, car, user)) {
      //   deferred.reject("Bid not valid");
      //   return deferred.promise;
      // }
      
      // let bookingData = {
      //   ownerDetails: { ...car.ownerDetails, ownerId: car.ownerID },
      //   carData: { ...car.carData, listingId: car._id },
      //   bookerData: {
      //     bookerName: user.name,
      //     bookerId: user.id,
      //     aadhar: user.aadhar,
      //   },

      //   images:car.images,
      //   startDate: bidplace.startDate,
      //   endDate: bidplace.endDate,
      //   bidAmount: bidplace.bidAmount,
      //   bookType: bidplace.triptype,
      //   startkm:-1,
      //   endkm:-1,
      //   status: "pending",
      // };

      db.saveBookingConsumer(bookingData)
        .then((result) => {
          deferred.resolve(result);
        })
        .catch((err) => {
          deferred.reject("Bid not valid");
        });

      return deferred.promise;
    };

    /**
     * 
     * @param {*} car 
     * @param {*} user 
     * @param {*} message 
     * @param {*} sentBy 
     * @param {*} isImage 
     * @returns {Promise}
     * @description This function is used to save conversation
     */
    this.saveConversation = function (owner, user, chatString, sentBy, isImage) {
      const deferred = $q.defer();
      let chat = {
        chatString:chatString,
        isImage:isImage,
        sentBy:sentBy   
      }
      db.conversationcheck(owner, user,chat)
        .then((result) => {
              deferred.resolve(result);
        })
        .catch((err) => {
          deferred.reject("convo invalid");
        });
      return deferred.promise;
    };

    /**
     * 
     * @param {*} conversationID 
     * @param {*} message 
     * @param {*} sentBy 
     * @param {*} isImage 
     * @returns {Promise}
     * @description This function is used to save chat message
     */
    this.saveChatMessage = function (conversationID, message, sentBy, isImage) {
      const deferred = $q.defer();

      const chatid = idGeneratorService.generateChatID();
      const newchat = {
        chatID: chatid,
        conversationID: conversationID,
        chatString: message,
        sentBy: sentBy,
        isImage: isImage,
        timestamp: new Date().toISOString(),
      };

      db.chatMessagesave(newchat)
        .then((result) => {
          deferred.resolve("saved");
        })
        .catch((err) => {
          deferred.reject("chat invalid");
        });

      return deferred.promise;
    };

    /**
     * 
     * @param {*} conversationID 
     * @returns {Promise}
     * @description This function is used to get chat messages
     */
    this.getchatmessages = function (conversationID) {
      const deferred = $q.defer();
      db.getchatmessages(conversationID)
        .then((result) => {
          deferred.resolve(result);
        })
        .catch((err) => {
          deferred.reject(err);
        });

      return deferred.promise;
    };

    /**
     * 
     * @param {*} bookerID 
     * @returns {Promise}
     * @description This function is used to load conversation
     */
    this.loadingconversation = function (bookerID) {
      const deferred = $q.defer();
      db.getconversationuser(bookerID)
        .then((result) => {
          const conversation = result
          deferred.resolve(conversation);
        })
        .catch((err) => {
          deferred.reject(err);
        });

      return deferred.promise;
    };


    /**
     * 
     * @param {*} ownerID 
     * @param {*} bookerID 
     * @returns {Promise}
     * @description This function is used to get bid
     */
    this.getBid = function (ownerID, bookerID) {
      const deferred = $q.defer();
      db.getAllBiddings()
        .then((result) => {
          console.log(result);
          console.log(bookerID, ownerID);
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

    /**
     * 
     * @param {*} ownerID 
     * @param {*} userID 
     * @returns {Promise}
     * @description This function is used to get chat message consumer
     */
    this.getChatMessageConsumer = function (ownerID, userID) {
      const deferred = $q.defer();
      conversationID = `${ownerID}${userID}`;
      console.log(conversationID)
      db.getchatmessages(conversationID)
      .then((result) => {
        deferred.resolve(result);
      })
      .catch((err) => {
        deferred.reject(err);
      });

      return deferred.promise;
    };

    /**
     * 
     * @param {*} message 
     * @param {*} sentBy 
     * @param {*} isImage 
     * @param {*} selectedConvo 
     * @returns {Promise}
     * @description This function is used to save chat message
     */
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

    /**
     * 
     * @param {*} listingId 
     * @returns {Promise}
     * @description This function is used to get booked dates
     */
    this.getBookedDates = function (listingId) {
      const deferred = $q.defer();
      db.getBookedDate(listingId)
        .then((result) => {
          const bookings = result;
         console.log("qsw",bookings)
          deferred.resolve(bookings);
        })
        .catch((err) => {
          deferred.reject(err);
        });

      return deferred.promise;
    };

    /**
     * 
     * @param {*} userID 
     * @returns {Promise}
     * @description This function is used to get unpaid invoices 
     */
    this.getUnpaidInvoices = function (userID) {
      const deferred = $q.defer();

      db.getInvoices(userID)
        .then((result) => {
          console.log("qqq",result);
          const invoice = result.invoices
          const sortedInvoices = invoice.sort((a, b) => a.paid - b.paid);
          console.log(sortedInvoices)
          deferred.resolve(sortedInvoices);
        })
        .catch((err) => {
          deferred.reject(err);
        });

      return deferred.promise;
    };

    /**
     * 
     * @param {*} invoiceID 
     * @param {*} historyid 
     * @returns {Promise}
     * @description This function is used to mark invoice as paid
     */
    this.markInvoicePaid = function ( historyid) {
      const deferred = $q.defer();

      db.markInvoicePaidHistory(historyid)
        .then((result) => {
          deferred.resolve(result);
        })
        
        .catch((err) => {
          deferred.reject(err);
        });

      return deferred.promise;
    };
  },
]);
