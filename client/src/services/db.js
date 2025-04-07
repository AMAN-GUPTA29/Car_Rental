carRentalApp.service("db", function ($q,dbService,idGeneratorService,ApiService) {
    
    this.saveListing = function (carData) {
        const deferred = $q.defer();
        const user= JSON.parse(sessionStorage.getItem("user"));
        console.log("dbc",carData);
      
        const formData=new FormData();
            formData.append('ownerDetails', JSON.stringify(carData.ownerDetails));
            formData.append('carData',JSON.stringify( carData.carData));
            // formData.append("images",carData.images);
            for(let i in carData.images)
            {
                formData.append('images',carData.images[i]);
            }

            console.log("formData",formData);
        ApiService.postDataInternalimage(`/owner/createlisting`,formData,user.token)
        .then(function(response){
            console.log("API Listings:", response.data);
            deferred.resolve(response.data);
        })
        .catch(function(error) {
            console.error("API Error:", error);
            let errorMessage = "Failed to fetch listings";
            
         
            if (error.status === 401) {
                errorMessage = "Session expired - please login again";
            } else if (error.status === 500) {
                errorMessage = "Server error - try again later";
            }
            
            deferred.reject(errorMessage);
        });
        return deferred.promise;
    };

    this.imageUpload=function(file){
        const deferred = $q.defer();
        console.log(file);
        const formData=new FormData();
            formData.append('images',file);
        ApiService.postDataInternalimage(`/util/uploadimage`,formData)
        .then(function(response){
            console.log("API Listings:", response.data);
            deferred.resolve(response.data);
        })
        .catch(function(error) {
            console.error("API Error:", error);
            let errorMessage = "Failed to fetch listings";
            
         
            if (error.status === 401) {
                errorMessage = "Session expired - please login again";
            } else if (error.status === 500) {
                errorMessage = "Server error - try again later";
            }
            
            deferred.reject(errorMessage);
        });
        return deferred.promise;

    }

    this.getAllListings = function() {
        const deferred = $q.defer();
        
        const user = JSON.parse(sessionStorage.getItem("user"));
        
        console.log("dcsdc",user)
        console.log(user.token)
        ApiService.getDataInternal(`/owner/alllisting/${user.id}`,user.token)
        .then(function(response) {
            console.log("API Listings:", response.data);
            deferred.resolve(response.data.listings);
        })
        .catch(function(error) {
            console.error("API Error:", error);
            let errorMessage = "Failed to fetch listings";
            
         
            if (error.status === 401) {
                errorMessage = "Session expired - please login again";
            } else if (error.status === 500) {
                errorMessage = "Server error - try again later";
            }
            
            deferred.reject(errorMessage);
        });
    
        return deferred.promise;
    };
    
    this.getAllListingsConsumer = function(params) {
        const deferred = $q.defer();
        
        const user = JSON.parse(sessionStorage.getItem("user"));
        
        console.log("dcsfdc",user)
        console.log(user.token)
        ApiService.getDataInternaln(`/consumer/alllisting`,params,user.token)
        .then(function(response) {
            console.log("API Listings:", response.data);
            deferred.resolve(response.data);
        })
        .catch(function(error) {
            console.error("API Error:", error);
            let errorMessage = "Failed to fetch listings";
            
         
            if (error.status === 401) {
                errorMessage = "Session expired - please login again";
            } else if (error.status === 500) {
                errorMessage = "Server error - try again later";
            }
            
            deferred.reject(errorMessage);
        });
    
        return deferred.promise;
    };

    this.getListing = function(lisitngID) {
        const deferred = $q.defer();
        
        const user = JSON.parse(sessionStorage.getItem("user"));
        
        console.log("dcsfdc",user)
        console.log(user.token)
        ApiService.getDataInternal(`/consumer/listing/${lisitngID}`,user.token)
        .then(function(response) {
            console.log("API Listings:", response.data.listings);
            deferred.resolve(response.data.listings);
        })
        .catch(function(error) {
            console.error("API Error:", error);
            let errorMessage = "Failed to fetch listings";
            
         
            if (error.status === 401) {
                errorMessage = "Session expired - please login again";
            } else if (error.status === 500) {
                errorMessage = "Server error - try again later";
            }
            
            deferred.reject(errorMessage);
        });
    
        return deferred.promise;
    };
    
    this.getListingOwner = function(lisitngID) {
        const deferred = $q.defer();
        const user = JSON.parse(sessionStorage.getItem("user"));
        
        console.log("dcsfdc",user)
        console.log(user.token)
        ApiService.getDataInternal(`/owner/listing/${lisitngID}`,user.token)
        .then(function(response) {
            console.log("API Listings:", response.data.listings);
            deferred.resolve(response.data.listings);
        })
        .catch(function(error) {
            console.error("API Error:", error);
            let errorMessage = "Failed to fetch listings";
            
         
            if (error.status === 401) {
                errorMessage = "Session expired - please login again";
            } else if (error.status === 500) {
                errorMessage = "Server error - try again later";
            }
            
            deferred.reject(errorMessage);
        });
    
        return deferred.promise;
    };
    

    
    this.saveBookingConsumer= function(bookingData){
        const user = JSON.parse(sessionStorage.getItem("user"));  
            const deferred=$q.defer()
            console.log(bookingData);
            ApiService.postDataInternal('/consumer/bidding', bookingData,user.token)
            .then(response => {
              console.log("Bid saved successfully:", bookingData._id);
              deferred.resolve(response);
            })
            .catch(error => {
              console.error("Error saving listing:", error);
              deferred.reject(error.data?.message || "Server error");
            });
            return deferred.promise;
    }

    this.conversationcheck= function(owner,user,chat)
    {   
        // const user = JSON.parse(sessionStorage.getItem("user"));  
       const chatData={
        owner:owner,
        user:user,
        chat:chat
       }
            const deferred=$q.defer()
        console.log(chatData);
        ApiService.postDataInternal('/consumer/chats', chatData,user.token)
        .then(response => {
          console.log("Chat:", response.data);
          deferred.resolve(response.data);
        })
        .catch(error => {
          console.error("Error saving listing:", error);
          deferred.reject(error.data?.message || "Server error");
        });
        return deferred.promise;
      
    }

    this.conversationcheckowner= function(owner,user,chat)
    {   
        // const user = JSON.parse(sessionStorage.getItem("user"));  
       const chatData={
        owner:owner,
        user:user,
        chat:chat
       }
        const deferred=$q.defer()
        console.log(chatData);
        ApiService.postDataInternal('/owner/chats', chatData,user.token)
        .then(response => {
          console.log("Chat:", response.data);
          deferred.resolve(response.data);
        })
        .catch(error => {
          console.error("Error saving listing:", error);
          deferred.reject(error.data?.message || "Server error");
        });
            return deferred.promise;
        
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


    this.getchatmessages=function (conversationId)
    {
        const user = JSON.parse(sessionStorage.getItem("user"));
            const deferred=$q.defer()
            console.log(conversationId);
            ApiService.getDataInternal(`/consumer/getchats/${conversationId}`, user.token)
            .then(response => {
              console.log("Chat:", response.data);
              deferred.resolve(response.data);
            })
            .catch(error => {
              console.error("Error saving listing:", error);
              deferred.reject(error.data?.message || "Server error");
            });
            return deferred.promise;
    }


    this.getBiddingsOwner = function(listingId) {
        const deferred = $q.defer();
        const user = JSON.parse(sessionStorage.getItem("user"));  
        ApiService.getDataInternal(`/owner/allbidding/${listingId}`,user.token)
        .then(response => {
          deferred.resolve(response.data);
        })
        .catch(error => {
          console.error("Error fetching biddings:", error);
          deferred.reject(error.data?.message || "Server error");
        });

            return deferred.promise;
      };
      

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

    this.statuschangebooking = function(statusobj) {
        console.log("Dsv",statusobj);
        const deferred = $q.defer();
        const user = JSON.parse(sessionStorage.getItem("user"));  
        ApiService.postDataInternal(`/owner/decidebid`,statusobj,user.token)
          .then(response => {
            deferred.resolve(response.data.updatedBid);
          })
          .catch(error => {
            console.error("Error updating status:", error);
            deferred.reject(error.data?.message || "Server error");
          });
      
        return deferred.promise;
      };
      

   

    this.getconversationuser=function(bookerId)
    {
        // console.log("Dsv",statusobj);
        const deferred = $q.defer();
        const user = JSON.parse(sessionStorage.getItem("user"));  
        ApiService.getDataInternal(`/consumer/getconversation/${bookerId}`,user.token)
          .then(response => {
            console.log(response.data);
            deferred.resolve(response.data);
          })
          .catch(error => {
            console.error("Error updating status:", error);
            deferred.reject(error.data?.message || "Server error");
          });

            return deferred.promise;
    }

    this.getconversationowner=function(ownerId)
    {
        
        const deferred = $q.defer();
        const user = JSON.parse(sessionStorage.getItem("user"));  
        ApiService.getDataInternal(`/owner/getconversation/${ownerId}`,user.token)
          .then(response => {
            console.log(response.data);
            deferred.resolve(response.data);
          })
          .catch(error => {
            console.error("Error updating status:", error);
            deferred.reject(error.data?.message || "Server error");
          });
      
        return deferred.promise;
    }

    this.getChatMessageOwner=function()
    {
        const user = JSON.parse(sessionStorage.getItem("user"));
        const deferred=$q.defer()
        console.log(conversationId);
        ApiService.getDataInternal(`/owner/getchats/${conversationId}`, user.token)
        .then(response => {
          console.log("Chat:", response.data);
          deferred.resolve(response.data);
        })
        .catch(error => {
          console.error("Error saving listing:", error);
          deferred.reject(error.data?.message || "Server error");
        });
        return deferred.promise;
    }

    this.getUpcomingBiddings = function(ownerId) {
        console.log("Dsv",ownerId);
        const deferred = $q.defer();
        const user = JSON.parse(sessionStorage.getItem("user"));  
        ApiService.getDataInternal(`/owner/startkm/${ownerId}`,user.token)
          .then(response => {
            console.log("response",response.data);
            deferred.resolve(response.data);
          })
          .catch(error => {
            console.error("Error updating status:", error);
            deferred.reject(error.data?.message || "Server error");
          });
      
        return deferred.promise;
      };

    // this.getAllBiddingsHistory=function()
    // {
    //     return dbService.openDB().then((db)=>{
    //         const deferred=$q.defer();
    //         const transaction = db.transaction("history", "readonly");
    //         const store = transaction.objectStore("history");

    //         const request=store.getAll();

    //         request.onsuccess=()=>{
    //             const history=request.result;
    //             deferred.resolve(history);
    //         }
    //         request.onerror=(error)=>
    //         {
    //             deferred.reject(error);
    //         }

    //         return deferred.promise;
    //     }
    // )
    // }

    this.updateStartKm = function(listingId, startKm) { // Changed param from listingId → historyId
        const deferred = $q.defer();
        const user = JSON.parse(sessionStorage.getItem("user"));
        
        ApiService.patchDataInternal(`/owner/updatestartkm/${listingId}`, { startKm }, user.token)
          .then(response => {
            console.log("response", response.data);
            deferred.resolve(response.data.updatedHistory);
          })
          .catch(error => {
            console.error("Error updating start km:", error);
            deferred.reject(error.data?.message || "Server error");
          });

            return deferred.promise;
      };

      this.getEndingBiddings = function(ownerId) {
        console.log("Dsv",ownerId);
        const deferred = $q.defer();
        const user = JSON.parse(sessionStorage.getItem("user"));  
        ApiService.getDataInternal(`/owner/endkm/${ownerId}`,user.token)
          .then(response => {
            
            deferred.resolve(response.data);
          })
          .catch(error => {
            console.error("Error updating status:", error);
            deferred.reject(error.data?.message || "Server error");
          });

            return deferred.promise;
      };
     

    this.updateEndKm=function(listingId,endKm)
    {
        const deferred = $q.defer();
        const user = JSON.parse(sessionStorage.getItem("user"));
        
        ApiService.patchDataInternal(`/owner/updateendkm/${listingId}`, { endKm }, user.token)
          .then(response => {
            console.log("response", response.data);
            deferred.resolve(response.data.updatedHistory);
          })
          .catch(error => {
            console.error("Error updating start km:", error);
            deferred.reject(error.data?.message || "Server error");
          });

            return deferred.promise;
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

this.getInvoices=function(userId,page)
{
    const user = JSON.parse(sessionStorage.getItem("user"));  
    console.log("acthere")
    const deferred=$q.defer();
    ApiService.getDataInternaln(`/consumer/getinvoice/${userId}`, { filter:"all",page:page }, user.token)
    .then((response) => {
        console.log("response", response.data);
            deferred.resolve(response.data);
    }).catch((error) => {
        console.error("Error updating start km:", error);
            deferred.reject(error.data?.message || "Server error");
    });

    return deferred.promise;


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

this.markInvoicePaidHistory=function(historyId)
{     const user = JSON.parse(sessionStorage.getItem("user"));  

        const deferred=$q.defer();
    ApiService.getDataInternal(`/consumer/markaspaid/${historyId}`, user.token)
    .then((response) => {
        console.log("response", response.data);
            deferred.resolve(response.data);
    }).catch((error) => {
        console.error("Error updating start km:", error);
            deferred.reject(error.data?.message || "Server error");
    });

        return deferred.promise;

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

this.getRecommendedCarListings = function() {
    const user = JSON.parse(sessionStorage.getItem("user"));
    const deferred = $q.defer();
    console.log("recmend")
    ApiService.getDataInternal(`/consumer/getrecommendedcarlistings/${user.id}`, user.token)
    .then((response) => {
        console.log("response", response.data);
        deferred.resolve(response.data);
        }).catch((error) => {
            console.error("Error getting recommended car listings:", error);
            deferred.reject(error.data?.message || "Server error");
        });
    return deferred.promise;
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

this.editUserProfile=function(usern)
{
    const user = JSON.parse(sessionStorage.getItem("user"));
    console.log("userm",usern)
    // const params={
    //     userName:name,
    //     phone:phone,
    //     password:password,
    //     newpassword:newpassword
    // }
    console.log(usern.id),
    // console.log(params);
    
    
    deferred=$q.defer();
    ApiService.patchDataInternalne(`/util/profile/${usern.id}`, usern, user.token)
    .then((response) => {
        console.log("response", response.data);
            deferred.resolve(response.data);
    }).catch((error) => {
        console.error("Error updating start km:", error);
            deferred.reject(error.data?.message || "Server error");
    });

            return deferred.promise;
}



this.getUserBiddingHistory = function (userId, filters, page, rowsPerPage) {
    console.log("Fetching bids for:", userId, JSON.stringify(filters), "Page:", page, "Rows per page:", rowsPerPage);


    const user = JSON.parse(sessionStorage.getItem("user"));  
        
    const deferred=$q.defer();
    ApiService.getDataInternalne(`/consumer/history/${userId}`, filters,page, user.token)
    .then((response) => {
        console.log("response", response.data);
            deferred.resolve(response.data);
    }).catch((error) => {
        console.error("Error updating start km:", error);
            deferred.reject(error.data?.message || "Server error");
    });

           return deferred.promise;
       
};

this.getAllUser=function(params)
{
    const user = JSON.parse(sessionStorage.getItem("user"));  
        
    const deferred=$q.defer();
    ApiService.getDataInternaln(`/admin/getusers`, params, user.token)
    .then((response) => {
        console.log("response", response.data);
            deferred.resolve(response.data);
    }).catch((error) => {
        console.error("Error updating start km:", error);
            deferred.reject(error.data?.message || "Server error");
    });

    return deferred.promise;

        
  
}

this.updateuser=function(params,blocked)
{
    const user = JSON.parse(sessionStorage.getItem("user"));  
    
    const deferred=$q.defer();
    ApiService.patchDataInternalne(`/admin/users/${params.id}`,blocked, user.token)
    .then((response) => {
        console.log("response", response.data);
            deferred.resolve(response.data);
    }).catch((error) => {
        console.error("Error updating start km:", error);
            deferred.reject(error.data?.message || "Server error");
    });

    return deferred.promise;
 
}

this.updateuserauth=function(params,blocked)
{
    const user = JSON.parse(sessionStorage.getItem("user"));  
    
    const deferred=$q.defer();
    ApiService.patchDataInternalne(`/admin/usersauth/${params.id}`,blocked, user.token)
    .then((response) => {
        console.log("response", response.data);
            deferred.resolve(response.data);
    }).catch((error) => {
        console.error("Error updating start km:", error);
            deferred.reject(error.data?.message || "Server error");
    });

    return deferred.promise;
 
}

this.updatelisting=function(params,blocked)
{
    const user = JSON.parse(sessionStorage.getItem("user"));  
    
    const deferred=$q.defer();
    ApiService.patchDataInternalne(`/admin/updatelisting/${params.id}`,blocked, user.token)
    .then((response) => {
        console.log("response", response.data);
            deferred.resolve(response.data);
    }).catch((error) => {
        console.error("Error updating start km:", error);
            deferred.reject(error.data?.message || "Server error");
    });

            return deferred.promise;

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


this.authoriseUser=function(userID)
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


this.getAllListingsAdmin=function(params)
{
    const user = JSON.parse(sessionStorage.getItem("user"));  
        
    const deferred=$q.defer();
    ApiService.getDataInternaln(`/admin/getlistings`, params, user.token)
    .then((response) => {
        console.log("response", response.data);
            deferred.resolve(response.data);
    }).catch((error) => {
        console.error("Error updating start km:", error);
            deferred.reject(error.data?.message || "Server error");
    });

            return deferred.promise;

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


this.getBidsPerDayOwner=function() {
    const user = JSON.parse(sessionStorage.getItem("user"));  
        console.log("plplplplqaaq")
    const deferred=$q.defer();
    ApiService.getDataInternal(`/owner/stats/ownerbidlastweek/${user.id}`, user.token)
    .then((response) => {
            deferred.resolve(response.data.statistics);
    }).catch((error) => {
        console.error("Error updating start km:", error);
            deferred.reject(error.data?.message || "Server error");
    });

    return deferred.promise;
}




this.getBidsPerDayOfWeek=function(startDate,endDate) {
    const user = JSON.parse(sessionStorage.getItem("user"));  
    const deferred=$q.defer();
    const params={
        "startDate":startDate,
        "endDate":endDate
    }
    ApiService.getDataInternaln(`/owner/stats/ownerearningdaywise/${user.id}`,params, user.token)
    .then((response) => {
            deferred.resolve(response.data.statistics);
    }).catch((error) => {
        console.error("Error updating start km:", error);
            deferred.reject(error.data?.message || "Server error");
    });

    return deferred.promise;
}


this.getUserAndAvgBids=function(startDate,endDate) {

    const user = JSON.parse(sessionStorage.getItem("user"));  
    const deferred=$q.defer();
    const params={
        "startDate":startDate,
        "endDate":endDate
    }
    ApiService.getDataInternaln(`/owner/stats/getearningandplateformavg/${user.id}`,params, user.token)
    .then((response) => {
            console.log("qwertyuiop",response.data.statistics)
            deferred.resolve(response.data.statistics);
    }).catch((error) => {
        console.error("Error updating start km:", error);
            deferred.reject(error.data?.message || "Server error");
    });

    return deferred.promise;
    
}


 this.getListingWiseEarnings=function(startDate,endDate) {

    const user = JSON.parse(sessionStorage.getItem("user"));  
    const deferred=$q.defer();
    const params={
        "startDate":startDate,
        "endDate":endDate
    }
    ApiService.getDataInternaln(`/owner/stats/topearningcars/${user.id}`,params, user.token)
    .then((response) => {
            deferred.resolve(response.data.statistics);
    }).catch((error) => {
        console.error("Error updating start km:", error);
            deferred.reject(error.data?.message || "Server error");
    });
    
        return deferred.promise;

}


 this.getTopCarModels=function(startDate,endDate) {

    const user = JSON.parse(sessionStorage.getItem("user"));  
    const deferred=$q.defer();
    const params={
        "startDate":startDate,
        "endDate":endDate
    }
    ApiService.getDataInternaln(`/owner/stats/gettopearningcarmodal/${user.id}`,params, user.token)
    .then((response) => {
            deferred.resolve(response.data.statistics);
    }).catch((error) => {
        console.error("Error updating start km:", error);
            deferred.reject(error.data?.message || "Server error");
    });

        return deferred.promise;

}


this.getCategoryBookingCounts=function(startDate,endDate) {

    const user = JSON.parse(sessionStorage.getItem("user"));  
    const deferred=$q.defer();
    const params={
        "startDate":startDate,
        "endDate":endDate
    }
    ApiService.getDataInternaln(`/owner/stats/gettopearningcarcategories/${user.id}`,params, user.token)
    .then((response) => {
            deferred.resolve(response.data.statistics);
    }).catch((error) => {
        console.error("Error updating start km:", error);
            deferred.reject(error.data?.message || "Server error");
    });

    return deferred.promise;
    
}


this.getAcceptedBidOwner=function(param){
    const user = JSON.parse(sessionStorage.getItem("user"));  
    const deferred=$q.defer();
    const params=param
    console.log(params)
    console.log(user)
    ApiService.getDataInternaln(`/owner/approvedbidsowner/${user.id}`,params, user.token)
    .then((response) => {
            deferred.resolve(response.data);
    }).catch((error) => {
        console.error("Error updating start km:", error);
            deferred.reject(error.data?.message || "Server error");
    });

        return deferred.promise;
}

this.getBookedDate=function(listingId)
{
    const user = JSON.parse(sessionStorage.getItem("user"));  
    const deferred=$q.defer();
    console.log(user)
    ApiService.getDataInternal(`/consumer/getbookeddate/${listingId}`, user.token)
    .then((response) => {
            deferred.resolve(response.data);
    }).catch((error) => {
        console.error("Error updating start km:", error);
            deferred.reject(error.data?.message || "Server error");
    });

        return deferred.promise;
}


this.getOwnerEarnings=function() {
    const user = JSON.parse(sessionStorage.getItem("user"));  
    const deferred=$q.defer();
    
    ApiService.getDataInternal(`/owner/stats/ownerlastweeksearning/${user.id}`, user.token)
    .then((response) => {
            deferred.resolve(response.data.statistics);
    }).catch((error) => {
        console.error("Error updating start km:", error);
            deferred.reject(error.data?.message || "Server error");
    });

        return deferred.promise;
    
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
 
    const user = JSON.parse(sessionStorage.getItem("user"));  
    ApiService.getDataInternal(`/admin/stats/bidlast7days`,user.token)
      .then(response => {
        console.log(response.data);
        deferred.resolve(response.data.statistics);
      })
      .catch(error => {
        console.error("Error updating status:", error);
        deferred.reject(error.data?.message || "Server error");
        });
 
        return deferred.promise;
   
}


this.getActiveInactiveUsers=function(startDate,endDate) {
  
        const deferred=$q.defer();
    const params={
        "startDate":startDate,
        "endDate":endDate
    }
    const user = JSON.parse(sessionStorage.getItem("user"));  
    ApiService.getDataInternaln(`/admin/stats/getactiveinactiveuser`,params,user.token)
      .then(response => {
        console.log(response.data);
        deferred.resolve(response.data.statistics);
      })
      .catch(error => {
        console.error("Error updating status:", error);
        deferred.reject(error.data?.message || "Server error");
      });

        return deferred.promise;
   
       
 
}



this.getMostPopularCars=function(startDate,endDate) {
    
    const deferred=$q.defer();
    const params={
        "startDate":startDate,
        "endDate":endDate
    }
    const user = JSON.parse(sessionStorage.getItem("user"));  
    ApiService.getDataInternaln(`/admin/stats/getmostbookedcars`,params,user.token)
      .then(response => {
        console.log(response.data);
        deferred.resolve(response.data.statistics);
      })
      .catch(error => {
        console.error("Error updating status:", error);
        deferred.reject(error.data?.message || "Server error");
      });

        return deferred.promise;
}   

this.getNewUserOverTime=function(startDate,endDate) {
    console.log("ololoopp")
    const deferred=$q.defer();
    const params={
        "startDate":startDate,
        "endDate":endDate
    }
    const user = JSON.parse(sessionStorage.getItem("user"));
    ApiService.getDataInternaln(`/admin/stats/getNewUserOverTime`,params,user.token)
      .then(response => {
        console.log(response.data);
        deferred.resolve(response.data.statistics);
      })
      .catch(error => {
        console.error("Error updating status:", error);
        deferred.reject(error.data?.message || "Server error");
      });

        return deferred.promise;
}

this.getActiveBiddingPerHour=function(startDate,endDate) {

    const deferred=$q.defer();
    const params={
        "startDate":startDate,
        "endDate":endDate
    }
    const user = JSON.parse(sessionStorage.getItem("user"));
    ApiService.getDataInternaln(`/admin/stats/activeBiddingPerHour`,params,user.token)
      .then(response => {
        console.log("oioi",response.data);
        deferred.resolve(response.data.statistics);
      })
      .catch(error => {
        console.error("Error updating status:", error);
        deferred.reject(error.data?.message || "Server error");
      });

        return deferred.promise;
}


this.getActiveBiddingPerHourOwner=function(startDate,endDate) {
    console.log("ololoodspp")
    const deferred=$q.defer();
    const params={
        "startDate":startDate,
        "endDate":endDate
    }
    const user = JSON.parse(sessionStorage.getItem("user"));
    ApiService.getDataInternaln(`/owner/stats/activeBiddingPerHour/${user.id}`,params, user.token)
      .then(response => {
        console.log("vvb",response.data);
        deferred.resolve(response.data.statistics);
      })
      .catch(error => {
        console.error("Error updating status:", error);
        deferred.reject(error.data?.message || "Server error");
      });

        return deferred.promise;
}



this.getMostBookedCarCategories=function(startDate,endDate) {

        const deferred=$q.defer();
    const params={
        "startDate":startDate,
        "endDate":endDate
    }
    const user = JSON.parse(sessionStorage.getItem("user"));  
    ApiService.getDataInternaln(`/admin/stats/mostbookedcarcategories`,params,user.token)
      .then(response => {
        console.log(response.data);
        deferred.resolve(response.data.statistics);
      })
      .catch(error => {
        console.error("Error updating status:", error);
        deferred.reject(error.data?.message || "Server error");
      });

        return deferred.promise;
   
}





this.getAverageBidPerCategory=function(startDate,endDate) {
  
    const deferred=$q.defer();
    const params={
        "startDate":startDate,
        "endDate":endDate
    }
    const user = JSON.parse(sessionStorage.getItem("user"));  
    ApiService.getDataInternaln(`/admin/stats/avgbidamountpercarcategories`,params,user.token)
      .then(response => {
        console.log(response.data);
        deferred.resolve(response.data.statistics);
      })
      .catch(error => {
        console.error("Error updating status:", error);
        deferred.reject(error.data?.message || "Server error");
      });

        return deferred.promise;
 
}




this.getCarsListedByCategory=function (startDate,endDate){
        const deferred=$q.defer();
    const params={
        "startDate":startDate,
        "endDate":endDate
    }
    const user = JSON.parse(sessionStorage.getItem("user"));  
    ApiService.getDataInternaln(`/admin/stats/carcountpercategory`,params,user.token)
      .then(response => {
        console.log(response.data);
        deferred.resolve(response.data.statistics);
      })
      .catch(error => {
        console.error("Error updating status:", error);
        deferred.reject(error.data?.message || "Server error");
      });

        return deferred.promise;
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
