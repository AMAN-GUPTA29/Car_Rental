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
    this.getAllCarListings = function () {
      const deferred = $q.defer();
      db.getAllListings()
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

    /**
     * 
     * @param {*} bidplace 
     * @param {*} car 
     * @param {*} user 
     * @returns {Promise}
     * @description This function is used to book a car
     */
    this.bookingServiceConsumer = function (bidplace, car, user) {
      const deferred = $q.defer();
      if (!validationService.validateBid(bidplace, car, user)) {
        deferred.reject("Bid not valid");
        return deferred.promise;
      }
      console.log("scaCscs");
      console.log(bidplace);
      let bookingData = {
        owner: { ...car.owner, ownerID: car.ownerID },
        cardata: { ...car.cardata, listingID: car.listingID },
        booker: {
          bookerName: user.name,
          bookerId: user.id,
          aadhar: user.aadhar,
        },
        startDate: bidplace.startDate,
        endDate: bidplace.endDate,
        BidAmount: bidplace.bidAmount,
        booktype: bidplace.triptype,
        status: "pending",
      };

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
    this.saveConversation = function (car, user, message, sentBy, isImage) {
      const deferred = $q.defer();
      db.conversationcheck(car, user)
        .then((result) => {
          this.saveChatMessage(result, message, sentBy, isImage)
            .then((result) => {
              deferred.resolve("saved");
            })
            .catch((err) => {
              deferred.reject(err);
            });
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
      db.getconversation()
        .then((result) => {
          const conversation = result.filter(
            (convo) => convo.bookerID === bookerID
          );
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
      db.getAllBiddings(listingId)
        .then((result) => {
          const bookings = result;
          const bookedDates = [];
          console.log(bookings);
          console.log(listingId);
          bookings
            .filter(
              (b) =>
                b.cardata.listingID === listingId &&
                (b.status === "accepted" || b.status === "accept")
            )
            .forEach((b) => {
              const start = new Date(b.startDate);
              const end = new Date(b.endDate);
              let current = new Date(start);

              while (current <= end) {
                bookedDates.push(current.toISOString().split("T")[0]);
                current.setDate(current.getDate() + 1);
              }
            });

          deferred.resolve(bookedDates);
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

      db.getInvoices()
        .then((result) => {
          const invoice = result.filter(
            (invo) => invo.booker.bookerId === userID 
          );
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
    this.markInvoicePaid = function (invoiceID, historyid) {
      const deferred = $q.defer();

      db.markInvoicePaid(invoiceID)
        .then((result) => {
          return Promise.resolve(result);
        })
        .then((result1) => {
        db.markInvoicePaidHistory(result1.historyID).then((result) => {
            deferred.resolve(result);
          }).catch((err)=>{
            db.markInvoicePaidFalse(result1.invoiceid).then((result) => {
                console.log("rollback")
                deferred.resolve("rolledback");
            }).catch((err) => {
                deferred.reject(err)
            });
          });
        })
        .catch((err) => {
          deferred.reject(err);
        });

      return deferred.promise;
    };
  },
]);
