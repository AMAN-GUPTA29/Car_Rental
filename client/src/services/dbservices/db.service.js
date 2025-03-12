/**
 * @description for accesing and modifying data in indexedDB
 */
carRentalApp.service("dbService", function ($q) {
  /**
   * @type {string} DB_NAME
   * @type {number} DB_VERSION
   * @type {object} db
   * @type {Array} user
   * @type {Array} listing
   * @type {Array} biddings
   * @type {Array} history
   * @type {Array} chat
   * @type {Array} conversation
   * @type {Array} invoice
   */
  const DB_NAME = "CarRental";
  const DB_VERSION = 15;
  let db = null;

  const user = [];
  const listing = [];
  const biddings = [];
  const history = [];
  const chat = [];
  const conversation = [];
  const invoice = [];

  /**
   * @type {object} schema
   */
  const schema = {
    user: {},
    listing: {},
    biddings: {},
    history: {},
    chat: {},
    conversation: {},
    invoice: {},
  };

  /**
   * 
   * @returns {Promise}
   * @description This function is used to open the database
   * 
   */
  this.openDB = function () {
    let deferred = $q.defer();

    /**
     * @description if db is already opened then resolve the promise
     */
    if (db) {
        deferred.resolve(db);
        return deferred.promise;
    }

    
    /**
     * @description open the database
     */
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    /**
     * 
     * @param {*} event 
     * @description This function runs when the version of the database is changed
     */
    request.onupgradeneeded = function (event) {
      console.log("Version Triggered :: ", event);
       db = event.target.result;

      Object.keys(schema).forEach((storeName) => {
        if (db.objectStoreNames.contains(storeName)) {
          const migrateRequest = event.target.transaction
            .objectStore(storeName)
            .openCursor();
          migrateRequest.onsuccess = function () {
            const eventCursor = migrateRequest.result;
            if (eventCursor) {
              const data = eventCursor.value;
              switch (storeName) {
                case "user":
                  user.push(data);
                  break;
                case "listing":
                  listing.push(data);
                  break;
                case "biddings":
                  biddings.push(data);
                  break;
                case "history":
                  history.push(data);
                  break;
                case "chat":
                  chat.push(data);
                  break;
                case "conversation":
                  conversation.push(data);
                  break;
                case "invoice":
                  invoice.push(data);
                  break;
              }
              eventCursor.continue();
            }
          };

          migrateRequest.onerror = function (errorEvent) {
            console.error(
              "Cursor migration failed for store: " + storeName,
              errorEvent
            );
          };

          

          migrateRequest.oncomplete = function () {
            console.log(user)
            console.log(listing) 
            console.log(biddings) 
            console.log(history) 
            console.log(chat) 
            console.log(conversation)
            console.log(invoice) 
          };
          console.log(user)
            console.log(listing) 
            console.log(biddings) 
            console.log(history) 
            console.log(chat) 
            console.log(conversation)
            console.log(invoice) 
        }
        else {
            const newStore = db.createObjectStore(storeName, storeConfig.store);
            createIndexes(newStore, storeConfig.indexes);
        }
      });

      if (!db.objectStoreNames.contains("user")) {
        const store = db.createObjectStore("user", { keyPath: "userID" });
        store.createIndex("email", "email", { unique: true });
      }

      if (!db.objectStoreNames.contains("listing")) {
        const listingStore = db.createObjectStore("listing", {
          keyPath: "listingID",
        });
        listingStore.createIndex("ownerID", "ownerID", { unique: false });
      }

      if (!db.objectStoreNames.contains("biddings")) {
        const biddingsStore = db.createObjectStore("biddings", {
          keyPath: "biddingID",
        });
        biddingsStore.createIndex("bookerID", "bookerID", { unique: false });
      }

      if (!db.objectStoreNames.contains("history")) {
        const historyStore = db.createObjectStore("history", {
          keyPath: "historyID",
        });
        historyStore.createIndex("listingID", "listingID", { unique: false });
      }

      if (!db.objectStoreNames.contains("chat")) {
        const chatStore = db.createObjectStore("chat", { keyPath: "chatID" });
        chatStore.createIndex("conversationID", "conversationID", {
          unique: false,
        });
      }

      if (!db.objectStoreNames.contains("conversation")) {
        db.createObjectStore("conversation", { keyPath: "conversationID" });
      }

      if (!db.objectStoreNames.contains("block")) {
        db.createObjectStore("block", { keyPath: "email" });
      }

      if (!db.objectStoreNames.contains("invoice")) {
        db.createObjectStore("invoice", { keyPath: "invoiceid" });
      }
    };

    request.onsuccess = function (event) {
      deferred.resolve(event.target.result);
    };

    request.onerror = function (event) {
      deferred.reject("Database error: " + event.target.errorCode);
    };

    return deferred.promise;
  };
});
