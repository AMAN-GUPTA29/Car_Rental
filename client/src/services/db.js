carRentalApp.service("db", function ($q,dbService,idGeneratorService) {
    
    this.saveListing = function (carData) {
        const deferred = $q.defer();
        return dbService.openDB().then((db) => {
            const transaction = db.transaction("listing", "readwrite");
            const store = transaction.objectStore("listing");

            carData.listingID = idGeneratorService.generateListingID(); 
            carData.listingDate = new Date().toISOString();

            const request = store.add(carData);
    
            
                request.onsuccess = () => {
                    console.log("Listing saved successfully:", carData.listingID);
                    deferred.resolve(carData.listingID);
                };
                request.onerror = (event) => {
                    console.error("Error saving listing:", event.target.error);
                    deferred.reject(event.target.error);
                };

                return deferred.promise;
           
        })  
    };

    this.getAllListings = function () {
        const deferred = $q.defer();

        return dbService.openDB().then((db) => {
            const transaction = db.transaction("listing", "readonly");
            const store = transaction.objectStore("listing");
            const request = store.getAll(); 
    
            request.onsuccess = function () {
                console.log("Listings:", request.result);
                deferred.resolve(request.result);
            };
    
            request.onerror = function (event) {
                console.error("Error fetching listings:", event.target.error);
                deferred.reject("Error fetching listings: " + event.target.error);
            };
    
            return deferred.promise;
        });
    };
    

    
    this.saveBookingConsumer= function(bookingData){
        return dbService.openDB().then((db)=>{
            const deferred=$q.defer()
            const transaction = db.transaction("biddings", "readwrite");
            const store = transaction.objectStore("biddings");

            bookingData.biddingID=idGeneratorService.generateBookingID();
            bookingData.biddingDate = new Date().toISOString();


            const request = store.add(bookingData);

            request.onsuccess = () => {
                console.log("Bid saved successfully:", bookingData.biddingID);
                deferred.resolve(bookingData.biddingID);
            };
            request.onerror = (event) => {
                console.error("Error saving listing:", event.target.error);
                deferred.reject(event.target.error);
            };

            return deferred.promise;
        }).catch((err) => {
            console.error(err)
         });


    }

    this.conversationcheck= function(car,user)
    {   
       
        return dbService.openDB().then((db)=>{
            const deferred=$q.defer()
            const transaction = db.transaction("conversation", "readwrite");
            const store = transaction.objectStore("conversation");
            const conversationID = `${car.ownerID}${user.id}`;
            const existingConvoRequest = store.get(conversationID);
            
            existingConvoRequest.onsuccess = () => {
            let conversation = existingConvoRequest.result;


                if (!conversation) {
                    console.log("No existing conversation. Creating a new one...");
                    const newConversation = {
                        conversationID,
                        bookerID: user.id,
                        ownerID: car.ownerID,
                        bookerName: user.name,
                        ownerName: car.owner.ownerName,
                    };
    
                    store.add(newConversation);
                    console.log("New conversation created:", newConversation);
                } else {
                    console.log("Existing conversation found:", conversationID);
                }
                deferred.resolve(conversationID);
            }
            existingConvoRequest.onerror = (event) => {
                console.error("Error saving listing:", event.target.error);
                deferred.reject(event.target.error);
            };
            

            return deferred.promise;
        
        }).catch((err)=>{

            console.error(err)
        
        })
    }

    this.chatMessagesave=function(chat)
    {
        return dbService.openDB().then((db)=>{
            const deferred=$q.defer();
            const transaction = db.transaction("chat", "readwrite");
          
            const store = transaction.objectStore("chat");


            const request = store.add(chat);

            request.onsuccess =()=>{
                deferred.resolve(chat);
            }

            request.onerror =(event) =>{
                console.error("Error saving listing:", event.target.error);
                deferred.reject(event.target.error);
            }

            return deferred.promise;

        }
    ).catch((err)=>{

            console.error(err)
        
        })
    }


    this.getchatmessages=function (conversationID)
    {
        return dbService.openDB().then((db)=>{
            const deferred=$q.defer();
            const transaction = db.transaction("chat", "readonly");
            const store = transaction.objectStore("chat");

            const request=store.getAll();

            request.onsuccess=()=>{
                chats=request.result;
                const filteredchat=chats.filter(chat => chat.conversationID === conversationID);
                deferred.resolve(filteredchat);
            }

            request.onerror=(event)=>{
                console.error("Error saving listing:", event.target.error);
                deferred.reject(event.target.error);
            }

            return deferred.promise;
            
        }
    ).catch((err)=>{

        console.error(err)
    
    })
    }


    this.getAllBiddings=function() {

        return dbService.openDB().then((db)=>{
            const deferred=$q.defer();
            const transaction = db.transaction("biddings", "readonly");
            const store = transaction.objectStore("biddings");

            const request=store.getAll();

            request.onsuccess=()=>{
                biddings=request.result;
                deferred.resolve(biddings);
            }

            request.onerror=(event)=>{
                console.error("Error saving listing:", event.target.error);
                deferred.reject(event.target.error);
            }

            return deferred.promise;
        })
    }

    this.statusrejectbooking=function(currbid)
    {
        return dbService.openDB().then((db)=>{
            const deferred=$q.defer();
            const transaction = db.transaction("biddings", "readwrite");
            const store = transaction.objectStore("biddings");

            const request=store.getAll();

            request.onsuccess=()=>{
                biddings=request.result;
                const acceptedStart = new Date(currbid.startDate);
                const acceptedEnd = new Date(currbid.endDate);
                


            for (let bid of biddings) {
            const bidStart = new Date(bid.startDate);
            const bidEnd = new Date(bid.endDate);

            if (bid.biddingID !== currbid.biddingID && bid.cardata.listingID === currbid.cardata.listingID && !(bidEnd < acceptedStart || bidStart > acceptedEnd)) {
                bid.status = "rejected"; 
                store.put(bid);
            }
            }

                deferred.resolve("success");
            }

            request.onerror=(err)=>{
                deferred.reject(err);
            }

            return deferred.promise;

        }
    )
        
    }

    this.statuschangebooking=function(bidid,status)
    {
        return dbService.openDB().then((db)=>{
            const deferred=$q.defer();
            const transaction = db.transaction(["biddings","history"], "readwrite");
            const store = transaction.objectStore("biddings");
            const historyStore = transaction.objectStore("history");


            const request  = store.get(bidid);

            request.onsuccess=()=>{
                const currentbid=request.result;
                currentbid.status=status;
                store.put(currentbid);

                const history=currentbid;

                if(status==="accepted" || status==="accept")
                {
                    history.historyID = idGeneratorService.generateHistoryID();
                    history.startkm="NA";
                    history.endkm="NA";
                    history.paid = "no";
                    historyStore.add(history);
                }

                

                deferred.resolve(currentbid);
            }
            request.onerror=(error)=>
            {
                deferred.reject(error);
            }

            return deferred.promise;

        })
    }

    this.getconversation=function()
    {
        return dbService.openDB().then((db)=>{
            const deferred=$q.defer();
            const transaction = db.transaction("conversation", "readonly");
            const store = transaction.objectStore("conversation");

            const request=store.getAll();

            request.onsuccess=()=>{
                const conversation=request.result;
                deferred.resolve(conversation);
            }
            request.onerror=(error)=>
            {
                deferred.reject(error);
            }

            return deferred.promise;
        })
    }

    this.getChatMessage=function()
    {
        return dbService.openDB().then((db)=>{
            const deferred=$q.defer();
            const transaction = db.transaction("chat", "readonly");
            const store = transaction.objectStore("chat");

            const request=store.getAll();

            request.onsuccess=()=>{
                const conversation=request.result;
                deferred.resolve(conversation);
            }
            request.onerror=(error)=>
            {
                deferred.reject(error);
            }

            return deferred.promise;

        }
    )
    }

    this.getAllBiddingsHistory=function()
    {
        return dbService.openDB().then((db)=>{
            const deferred=$q.defer();
            const transaction = db.transaction("history", "readonly");
            const store = transaction.objectStore("history");

            const request=store.getAll();

            request.onsuccess=()=>{
                const history=request.result;
                deferred.resolve(history);
            }
            request.onerror=(error)=>
            {
                deferred.reject(error);
            }

            return deferred.promise;
        }
    )
    }

    this.updateStartKm=function(historyID,startKm)
    {
        return dbService.openDB().then((db)=>{
            const deferred=$q.defer();
            const transaction = db.transaction("history", "readwrite");
            const store = transaction.objectStore("history");

            const request=store.get(historyID);

            request.onsuccess=()=>{
                const history=request.result;
                history.startkm=startKm;
                store.put(history);
                deferred.resolve(history);
            }
            request.onerror=(error)=>
            {
                deferred.reject(error);
            }

            return deferred.promise;
        }
    )
    }

    this.updateEndKm=function(historyID,endKm)
    {
        return dbService.openDB().then((db)=>{
            const deferred=$q.defer();
            const transaction = db.transaction("history", "readwrite");
            const store = transaction.objectStore("history");

            const request=store.get(historyID);

            request.onsuccess=()=>{
                const history=request.result;
                history.endkm=endKm;
                store.put(history);
                deferred.resolve(history);
            }
            request.onerror=(error)=>
            {
                deferred.reject(error);
            }

            return deferred.promise;
        }
    )
    }

    this.genrateInvoice=function(invoice)
    {
        return dbService.openDB().then((db)=>{
        const deferred=$q.defer();
        const transaction = db.transaction(["history", "invoice"], "readwrite");
        const historyStore = transaction.objectStore("history");
        const invoiceStore = transaction.objectStore("invoice");

        const request=historyStore.get(invoice.historyID);

        request.onsuccess=()=>{
            const history=request.result;
            history.BidAmount=invoice.finalamount;
            historyStore.put(history);
            const invoicerequest=invoiceStore.add(invoice);
            console.log("wedcvw")
            console.log(invoice)
                invoicerequest.onsuccess=()=>{
                    console.log("here");
                    
                    deferred.resolve(invoice);
                }
                invoicerequest.onerror=(error)=>
                {
                    deferred.reject(error);
                }
            
        }
        request.onerror=(error)=>
        {
            deferred.reject(error);
        }
        return deferred.promise;
    }
)}

this.getInvoices=function()
{
    
        return dbService.openDB().then((db)=>{
            const deferred=$q.defer();
            const transaction = db.transaction("invoice", "readonly");
            const store = transaction.objectStore("invoice");

            const request=store.getAll();

            request.onsuccess=()=>{
                const invoice=request.result;
                deferred.resolve(invoice);
            }
            request.onerror=(error)=>
            {
                deferred.reject(error);
            }

            return deferred.promise;

        }
    )
}

this.markInvoicePaid=function(invoiceid)
{
    return dbService.openDB().then((db)=>{
        const deferred=$q.defer();
        const transaction = db.transaction("invoice", "readwrite");
        const store = transaction.objectStore("invoice");

        const request=store.get(invoiceid);

        request.onsuccess=()=>{
            const invoice=request.result;
            invoice.paid=true;
            store.put(invoice);
            deferred.resolve(invoice);
        }
        request.onerror=(error)=>
        {
            deferred.reject(error);
        }

        return deferred.promise;

    }
)
}

this.markInvoicePaidHistory=function(historyID)
{           console.log(historyID);

    return dbService.openDB().then((db)=>{
        const deferred=$q.defer();
        const transaction = db.transaction("history", "readwrite");
        const store = transaction.objectStore("history");
        const request=store.get(historyID);

        request.onsuccess=()=>{
            const invoice=request.result;
            invoice.paid=true;
            store.put(invoice);
            deferred.resolve(invoice);
        }
        request.onerror=(error)=>
        {
            deferred.reject(error);
        }

        return deferred.promise;

    })
}

this.markInvoicePaidFalse=function(invoiceid)
{
    return dbService.openDB().then((db)=>{
        const deferred=$q.defer();
        const transaction = db.transaction("invoice", "readwrite");
        const store = transaction.objectStore("invoice");

        const request=store.get(invoiceid);

        request.onsuccess=()=>{
            const invoice=request.result;
            invoice.paid=false;
            store.put(invoice);
            deferred.resolve(invoice);
        }
        request.onerror=(error)=>
        {
            deferred.reject(error);
        }

        return deferred.promise;

    }
)
}

this.markHistoryPaid=function(historyID)
{
    return dbService.openDB().then((db)=>{
        const deferred=$q.defer();
        const transaction = db.transaction("history", "readwrite");
        const store = transaction.objectStore("history");

        console.log(historyID);
        const request=store.get(historyID);

        request.onsuccess=()=>{
            const history=request.result;
            console.log(history);
            history.paid=true;
            store.put(history);
            deferred.resolve("success");
        }
        request.onerror=(error)=>
        {
            deferred.reject(error);
        }

        return deferred.promise;

    }
)
}

this.editUserProfile=function(id,name,phone,password,newpassword)
{
    return dbService.openDB().then((db)=>{
        const deferred=$q.defer();
        const transaction = db.transaction("user", "readwrite");
        const store = transaction.objectStore("user");

        const request=store.get(id);

        request.onsuccess=()=>{
            const user=request.result;
            if(user.password!==password)
            {
                deferred.reject("wrong password");
                return deferred.promise;
            }
            user.name=name;
            user.phone=phone;
            user.password=newpassword;
            store.put(user);
            deferred.resolve(user);
        }
        request.onerror=(error)=>
        {
            deferred.reject(error);
        }

        return deferred.promise;

    }
)
}
this.getUserBiddingHistory = function (userId, filters, page, rowsPerPage) {
    console.log("Fetching bids for:", userId, JSON.stringify(filters), "Page:", page, "Rows per page:", rowsPerPage);

    return dbService.openDB().then((db) => {
        const deferred = $q.defer();
        const transaction = db.transaction("biddings", "readonly");
        const store = transaction.objectStore("biddings");

        let filteredBids = []; // Store only matching bids
        let allUserBids = []; // Store all user bids (for fallback)

        let categoriesSet = new Set();
        let citiesSet = new Set();
        let ownerEmailsSet = new Set();

        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        // Convert empty filters to null for easier comparison
        Object.keys(filters).forEach(key => {
            if (filters[key] === "") filters[key] = null;
        });

        const hasFilters = Object.values(filters).some(val => val !== null && val !== undefined);

        // Convert date filters correctly
        const startDate = filters.startDate ? new Date(filters.startDate).setHours(0, 0, 0, 0) : null;
        const endDate = filters.endDate ? new Date(filters.endDate).setHours(23, 59, 59, 999) : null;

        const request = store.openCursor();
        request.onsuccess = function (event) {
            const cursor = event.target.result;
            if (cursor) {
                const bid = cursor.value;

                if (bid.booker.bookerId === userId) {
                    allUserBids.push(bid); // Store all user bids for fallback

                    // Collect unique categories, cities, and owner emails
                    if (bid.cardata.carCategory) categoriesSet.add(bid.cardata.carCategory);
                    if (bid.cardata.carcity) citiesSet.add(bid.cardata.carcity);
                    if (bid.owner && bid.owner.owneremail) ownerEmailsSet.add(bid.owner.owneremail.toLowerCase()); // Normalize case

                    let isMatch = true;
                    const bidDate = new Date(bid.biddingDate).setHours(0, 0, 0, 0);

                    console.log("Checking bid:", bid);

                    // Apply filters one by one
                    if (filters.category && bid.cardata.carCategory !== filters.category) isMatch = false;
                    if (filters.city && bid.cardata.carcity !== filters.city) isMatch = false;
                    if (filters.ownerEmail && bid.owner && bid.owner.owneremail.toLowerCase() !== filters.ownerEmail.toLowerCase()) isMatch = false;
                    if (filters.status && bid.status !== filters.status) isMatch = false;
                    if (startDate && bidDate < startDate) isMatch = false;
                    if (endDate && bidDate > endDate) isMatch = false;

                    if (isMatch) {
                        console.log("✔ Bid matched filters:", bid);
                        filteredBids.push(bid);
                    } else {
                        console.log("✖ Bid did not match filters:", bid);
                    }
                }

                cursor.continue();
            } else {
                console.log("Filtering done. Total matching bids:", filteredBids.length, " | All user bids:", allUserBids.length);

                // Apply pagination AFTER filtering
                let paginatedBids = filteredBids.slice(start, end);

                // If no filtered results are found, return unfiltered paginated results
                if (paginatedBids.length === 0 && hasFilters) {
                    console.log("No filtered results found, returning unfiltered paginated results");
                    paginatedBids = allUserBids.slice(start, end);
                }

                // Convert sets to sorted arrays
                const categories = Array.from(categoriesSet).sort();
                const cities = Array.from(citiesSet).sort();
                const ownerEmails = Array.from(ownerEmailsSet).sort();

                deferred.resolve({
                    bids: paginatedBids,
                    categories: categories,
                    cities: cities,
                    ownerEmails: ownerEmails
                });
            }
        };

        request.onerror = function () {
            console.error("Error fetching user bidding history");
            deferred.reject("Error fetching user bidding history");
        };

        return deferred.promise;
    });
};

this.getAllUser=function()
{
    
    return dbService.openDB().then((db) => {
        const deferred = $q.defer();
        const transaction = db.transaction("user", "readonly");
        const store = transaction.objectStore("user");

        const request=store.getAll();

        request.onsuccess=()=>{
            const user= request.result;
            deferred.resolve(user);
        }
        request.onerror=()=>{
            deferred.reject("Error fetching user");
            }
            return deferred.promise;

    })
}

this.blockUser=function(userID)
{
    
    return dbService.openDB().then((db) => {
        const deferred = $q.defer();
        const transaction = db.transaction("user", "readwrite");
        const store = transaction.objectStore("user");

        const request=store.get(userID);

        request.onsuccess=()=>{
            const user= request.result;
            user.blocked=true;
            store.put(user);
            deferred.resolve(user);
        }
        request.onerror=()=>{
            deferred.reject("Error fetching user");
            }
            return deferred.promise;

    })
}

this.unBlockUser=function(userID)
{
    
    return dbService.openDB().then((db) => {
        const deferred = $q.defer();
        const transaction = db.transaction("user", "readwrite");
        const store = transaction.objectStore("user");

        const request=store.get(userID);

        request.onsuccess=()=>{
            const user= request.result;
            user.blocked=false;
            store.put(user);
            deferred.resolve(user);
        }
        request.onerror=()=>{
            deferred.reject("Error fetching user");
            }
            return deferred.promise;

    })
}

this.deleteListings=function(listingID)
{
    
    return dbService.openDB().then((db) => {
        const deferred = $q.defer();
        const transaction = db.transaction("listing", "readwrite");
        const store = transaction.objectStore("listing");

        const request=store.get(listingID);

        request.onsuccess=()=>{
            const listing= request.result;
           listing.cardata.isDeleted=true;
            store.put(listing);
            deferred.resolve(listing);
        }
        request.onerror=()=>{
            deferred.reject("Error fetching user");
            }
            return deferred.promise;

    })
}


this.getBidsPerDayOwner=function(ownerID) {
    return dbService.openDB().then((db) => {
    const deferred = $q.defer();
    const transaction = db.transaction("history", "readonly");
    const store = transaction.objectStore("history");

    const request = store.getAll();
    
    
    request.onsuccess = () => {
          
    const allBids = request.result.filter(item => item.owner.ownerID === ownerID);
           
        
          
            const days = [...Array(7)].map((_, i) => {
                const date = new Date();
                date.setDate(date.getDate() - i);
                return date.toISOString().split("T")[0]; 
            }).reverse();

           
            const bidCounts = days.map(day => 
                allBids.filter(bid => bid.biddingDate.startsWith(day)).length
            );
            
            deferred.resolve({ days, bidCounts });
        };
        
        request.onerror = () => {deferred.reject};
    return deferred.promise;
})
}




this.getBidsPerDayOfWeek=function() {
    return dbService.openDB().then((db) => {
        const deferred = $q.defer();
    const usern= JSON.parse(sessionStorage.getItem("user"));
    const transaction = db.transaction("history", "readonly");
    const store = transaction.objectStore("history");

   
        const request = store.getAll();

        request.onsuccess = () => {
            const bids = request.result;
            const bidsn = bids.filter(user => user.owner.ownerID === usern.id);
            const weeklyData = {
                Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0,
                Friday: 0, Saturday: 0, Sunday: 0
            };
        
            bidsn.forEach(bid => {
                const date = new Date(bid.biddingDate);
                if (!isNaN(date)) {
                    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }); 
                    console.log(dayName)
                    weeklyData[dayName] += parseFloat(bid.BidAmount) || 0; 
                }
            }); 


           
            deferred.resolve ({
                labels: Object.keys(weeklyData), 
                bidAmounts: Object.values(weeklyData) 
            });
        }; 
        request.onerror = () => deferred.reject("Error fetching bidding history.");
        
        return deferred.promise
})
}


this.getUserAndAvgBids=function(userId) {

    return dbService.openDB().then((db) => {
        const deferred = $q.defer();
        const transaction = db.transaction("history", "readonly");
        const store = transaction.objectStore("history");

        const request = store.getAll();

        request.onsuccess=()=>{
            const bids=request.result;
            const days = [...Array(7)].map((_, i) => {
                const date = new Date();
                date.setDate(date.getDate() - i);
                return date.toISOString().split("T")[0]; 
            }).reverse();

            const userBids = {};
            const totalBidsPerDay = {};
            const uniqueUsersPerDay = {}; 

            days.forEach(day => {
                userBids[day] = 0;
                totalBidsPerDay[day] = 0;
                uniqueUsersPerDay[day] = new Set(); 
            });

            bids.forEach(bid => {
                const bidDate = bid.biddingDate.split("T")[0]; 
                if (days.includes(bidDate)) {
                    totalBidsPerDay[bidDate] += parseFloat(bid.BidAmount) || 0;
                    uniqueUsersPerDay[bidDate].add(bid.owner.ownerID); 
        
                    if (bid.owner.ownerID === userId) {
                        userBids[bidDate] += parseFloat(bid.BidAmount) || 0;
                    }
                }
            });

            const avgBids = days.map(day => 
                uniqueUsersPerDay[day].size > 0 ? totalBidsPerDay[day] / uniqueUsersPerDay[day].size : 0
            );

            deferred.resolve({days:days,
                userBidAmounts: days.map(day => userBids[day]),
                avgBidAmounts: avgBids})

        }

        request.onerror = () => deferred.reject("Error fetching bidding history.");
    
        return deferred.promise;
    }
    )   
  
    
}


 this.getListingWiseEarnings=function(userId) {

    return dbService.openDB().then((db) => {
        const deferred = $q.defer();
        const transaction = db.transaction("history", "readonly");
        const store = transaction.objectStore("history");

        const request = store.getAll();

        request.onsuccess=()=>
        {

            const allBids = request.result || [];
            const bids = allBids.filter(bid => bid.owner.ownerID === userId);
            const earningsPerListing = {};
            bids.forEach(bid => {
                const carName = `${bid.cardata.carMake} ${bid.cardata.carModel}`; 
                
                if (!earningsPerListing[carName]) {
                    earningsPerListing[carName] = 0;
                }
                earningsPerListing[carName] += parseFloat(bid.BidAmount) || 0;
            });

           deferred.resolve( {
                listingNames: Object.keys(earningsPerListing), 
                earnings: Object.values(earningsPerListing) 
            });

        }

        
            request.onerror = () => deferred.reject("Error fetching bidding history.");

        return deferred.promise;

    }
)
}


 this.getTopCarModels=function(ownerId) {

    return dbService.openDB().then((db) => {
        const deferred = $q.defer();
        const transaction = db.transaction("history", "readonly");
        const store = transaction.objectStore("history");

        const request = store.getAll();

        request.onsuccess=()=>{
            const ownerModelBids = {};
            const platformModelBids = {};
            const platformModelCounts = {};

            bids=request.result;

            bids.forEach(bid => {
                if(bid.status==="rejected"){
                    return;
                }
                const carName = `${bid.cardata.carMake} ${bid.cardata.carModel}`; 
        
                if (bid.owner.ownerID === ownerId) {
                    ownerModelBids[carName] = (ownerModelBids[carName] || 0) + 1;
                }
        
                platformModelBids[carName] = (platformModelBids[carName] || 0) + 1;
                platformModelCounts[carName] = (platformModelCounts[carName] || 0) + 1;
            });

            const sortedOwnerModels = Object.entries(ownerModelBids)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5); 

        const totalBids = Object.values(platformModelBids).reduce((sum, val) => sum + val, 0);
        const totalModels = Object.keys(platformModelBids).length;
        const avgBidPerModel = totalModels > 0 ? totalBids / totalModels : 0;

        const avgPlatformBids = new Array(sortedOwnerModels.length).fill(avgBidPerModel);

        deferred.resolve(  {
            carModels: sortedOwnerModels.map(item => item[0]),
            ownerBidCounts: sortedOwnerModels.map(item => item[1]), 
            avgPlatformBids: avgPlatformBids
        })
        }

        request.onerror = () => deferred.reject("Error fetching bidding history.");

        return deferred.promise;

        
    })


  
  
}


this.getCategoryBookingCounts=function(ownerId) {

    return dbService.openDB().then((db) => {
        const deferred = $q.defer();
        const transaction = db.transaction("history", "readonly");
        const store = transaction.objectStore("history");

        const request = store.getAll();
        request.onsuccess = () => {
            const allBids = request.result || [];
            const bookings = allBids.filter(bid => bid.owner.ownerID === ownerId);

            const categoryCounts = {};

    bookings.forEach(booking => {
        const category = booking.cardata.carCategory; 

        if (!categoryCounts[category]) {
            categoryCounts[category] = 0;
        }
        categoryCounts[category]++;
    });

    deferred.resolve( {
        categories: Object.keys(categoryCounts),
        bookings: Object.values(categoryCounts) 
    });
        }

        request.onerror = () => deferred.reject("Error fetching bidding history.");

        return deferred.promise;
    })
    
}


this.getOwnerEarnings=function(ownerID) {
    return dbService.openDB().then((db) => {
        const deferred = $q.defer();
        const transaction = db.transaction("invoice", "readonly");
        const store = transaction.objectStore("invoice");

        const request = store.getAll();

        request.onsuccess=()=>{
            allHistory=request.result.filter(entry => entry.owner.ownerID === ownerID && entry.status === "accept");
            console.log("dcvs")
            console.log(allHistory);
            deferred.resolve(allHistory);
        }

        request.onerror = () => deferred.reject("Error fetching bidding history.");

        return deferred.promise;
    })
    
}

this.getBiddingData=function() {
    return dbService.openDB().then((db) => {
        const deferred = $q.defer();
        const transaction = db.transaction("history", "readonly");
        const store = transaction.objectStore("history");

        const request = store.getAll();
        request.onsuccess=()=>{
         
            deferred.resolve(request.result || []); 
        }
        request.onerror = () => reject("Error fetching bidding history.");
        return deferred.promise;    


    })
   
}



this.getBidsPerDay=function() {
    const deferred=$q.defer();
   this.getBiddingData().then((result) => {
        bids=result;
        console.log("Csc")
        console.log(bids);
        const days = [...Array(7)].map((_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - i);
            return date.toISOString().split("T")[0]; 
        }).reverse();
        const bidAmounts = days.map(day =>
            bids
                .filter(bid => bid.biddingDate.startsWith(day))
                .reduce((sum, bid) => sum + (parseFloat(bid.BidAmount) || 0), 0) 
        );
        console.log(days,bidAmounts)
        deferred.resolve({days,bidAmounts});
        }).catch((err) => {
           deferred.reject(err);
        });
 
        return deferred.promise;
        
   
}


this.getActiveInactiveUsers=function() {
  
    return dbService.openDB().then((db) => {
        const deferred=$q.defer();
        const userTransaction = db.transaction("user", "readonly");
        const bidTransaction = db.transaction("history", "readonly");

        const userStore = userTransaction.objectStore("user"); 
        const bidStore = bidTransaction.objectStore("history");

        userRequest=userStore.getAll();
        bidRequest=bidStore.getAll();
        
        userRequest.onsuccess=()=>{
            
            bidRequest.onsuccess = () => {
                
                const users = userRequest.result || [];
                const bids = bidRequest.result || [];

                const activeUserIds = new Set(bids.map(bid => bid.booker.bookerId));

                
                let activeUsers = 0;
                let inactiveUsers = 0;

                users.forEach(user => {
                    if (user.role === "user") {
                        console.log(user);
                        if (activeUserIds.has(user.userID)) {
                            activeUsers++;
                        } else {
                            inactiveUsers++;
                        }
                    }
                });
                console.log(activeUsers.inactiveUsers)
                deferred.resolve({activeUsers, inactiveUsers});

            }
            bidRequest.onerror=(err)=>{
                console.log("scvdvb")
                deferred.reject(err);
            }
        }
        userRequest.onerror=(err)=>{
            console.log("scvdvb")
            deferred.reject(err);
        }

        return deferred.promise;
    });
 
}



this.getMostPopularCars=function() {
    return dbService.openDB().then((db) => {
        const deferred=$q.defer();
        const transaction = db.transaction("history", "readonly"); 
        const store = transaction.objectStore("history");
        const request = store.getAll();

        request.onsuccess = () => {
            const allBookings = request.result || [];
            const carBookings = {};

            allBookings.forEach(booking => {
                const carName = `${booking.cardata.carMake} ${booking.cardata.carModel}`; 

                if (!carBookings[carName]) {
                    carBookings[carName] = 0;
                }
                carBookings[carName]++;
            });

            const sortedCars = Object.entries(carBookings)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5);

            deferred.resolve({
                carNames: sortedCars.map(item => item[0]), 
                bookingCounts: sortedCars.map(item => item[1]) 
            });
        };

        request.onerror = () => deferred.reject("Error fetching booking history.");

        return deferred.promise;

    })
}   




this.getMostBookedCarCategories=function() {

    return dbService.openDB().then((db) => {
        const deferred=$q.defer();
        const transaction = db.transaction("history", "readonly"); 
        const store = transaction.objectStore("history");
        const request = store.getAll();
        request.onsuccess = () => {
            const allBookings = request.result || [];
            const categoryBookings = {};

            allBookings.forEach(booking => {
                const category = booking.cardata.carCategory; 

                if (!categoryBookings[category]) {
                    categoryBookings[category] = 0;
                }
                categoryBookings[category]++;
            });

            const sortedCategories = Object.entries(categoryBookings)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5);

            deferred.resolve({
                categories: sortedCategories.map(item => item[0]), 
                bookingCounts: sortedCategories.map(item => item[1]) 
            });
        };
        request.onerror = () => deferred.reject("Error fetching booking history.");

        return deferred.promise;

    })

   
}





this.getAverageBidPerCategory=function() {
    return dbService.openDB().then((db) => {
        const deferred=$q.defer();
        const transaction = db.transaction("history", "readonly"); 
        const store = transaction.objectStore("history");
        const request = store.getAll();
        request.onsuccess = () => {
            const allBids = request.result || [];

            const carCategories = ["Sedan",
    "SUV",
    "Hatchback",
    "Convertible",
    "Coupe",
    "Minivan",
    "Pickup Truck"];
            const categoryBids = {};

            carCategories.forEach(category => {
                categoryBids[category] = { totalAmount: 0, count: 0 };
            });

            allBids.forEach(bid => {
                const category = bid.cardata.carCategory; 

                if (categoryBids[category]) { 
                    categoryBids[category].totalAmount += parseFloat(bid.BidAmount) || 0;
                    categoryBids[category].count++;
                }
            });

            const avgBidPerCategory = carCategories.map(category => ({
                category,
                avgBid: categoryBids[category].count ? (categoryBids[category].totalAmount / categoryBids[category].count).toFixed(2) : 0
            }));

            deferred.resolve({
                categories: avgBidPerCategory.map(item => item.category),
                avgBids: avgBidPerCategory.map(item => item.avgBid) 
            });
        };
        request.onerror = () => deferred.reject("Error fetching booking history.");

        return deferred.promise;

    
    
    
    })

   


 
}




this.getCarsListedByCategory=function (){
    return dbService.openDB().then((db) => {
        const deferred=$q.defer();
        const transaction = db.transaction("listing", "readonly"); 
        const store = transaction.objectStore("listing");
        const request = store.getAll();
        request.onsuccess = () => {
            const allCars = request.result || [];

            const carCategories = ["Sedan",
                "SUV",
                "Hatchback",
                "Convertible",
                "Coupe",
                "Minivan",
                "Pickup Truck"];
            const categoryCounts = {};

            carCategories.forEach(category => {
                categoryCounts[category] = 0;
            });

            allCars.forEach(car => {
                if (categoryCounts[car.cardata.carCategory] !== undefined) {
                    categoryCounts[car.cardata.carCategory]++;
                }
            });

            deferred.resolve({
                categories: carCategories,
                carCounts: carCategories.map(category => categoryCounts[category])
            });
        };
        request.onerror = () => deferred.reject("Error fetching booking history.");

        return deferred.promise;

    })
}


this.updateCarListing=function(lisitngID,careditdata){
    return dbService.openDB().then((db) => {
        const deferred=$q.defer();
        const transaction = db.transaction("listing", "readwrite"); 
        const store = transaction.objectStore("listing");
        const request = store.get(lisitngID);
        console.log(lisitngID,careditdata);
        request.onsuccess = () => {
           const car=request.result;
           console.log(car)
           car.cardata.basePrice=careditdata.basePrice,
           car.cardata.carAddress= careditdata.carAddress,
           car.cardata.carCategory= careditdata.carCategory,
           car.cardata.carColor= careditdata.carColor,
           car.cardata.carMake=careditdata.carMake,
           car.cardata.carMileage= careditdata.carMileage,
           car.cardata.carModel= careditdata.carModel,
           car.cardata.carTransmission= careditdata.carTransmission,
           car.cardata.carYear= careditdata.carYear,
           car.cardata.outstationPrice= careditdata.outstationPrice,


           store.put(car);
           deferred.resolve(car)
           
        };
        request.onerror = () => deferred.reject("Error fetching booking history.");

        return deferred.promise;

    })
}


});
