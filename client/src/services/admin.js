/**
 * @description This service is responsible for handling all the admin related operations
 */
carRentalApp.service("admindb", ["db","validationService","$q","idGeneratorService", function (db,validationService,$q,idGeneratorService) {

    /**
     * 
     * @returns {Promise}
     * @description This function is used to get all users
     */
    this.getUsers = function (params) {
        let deferred = $q.defer();
        db.getAllUser(params).then((result) => {
            deferred.resolve(result)
        }).catch((err) => {
            deferred.reject(err)
            
        });
        return deferred.promise;
    };

    /**
     * 
     * @param {*} userID 
     * @returns {Promise}
     * @description This function is used to block the user 
     */
    this.updateuser = function (params,blocked) {
        const blockedd={
            blocked:blocked
        }
        let deferred = $q.defer();
        db.updateuser(params,blockedd).then((result) => {
            deferred.resolve(result)
        }).catch((err) => {
            deferred.reject(err)
        });
        return deferred.promise;
    };

    /**
     * 
     * @param {*} userID 
     * @returns {Promise}
     * @description This function is used to unblock the user
     */
    this.unblockUser= function (userID) {
        
        let deferred = $q.defer();
        db.unBlockUser(userID).then((result) => {
            deferred.resolve(result)
        }).catch((err) => {
            deferred.reject(err)
            
        });
        return deferred.promise;
    };

    this.updateuserAuth=function(params,auth)
    {
        const blockedd={
            authorise:auth
        }
        let deferred = $q.defer();
        db.updateuserauth(params,blockedd).then((result) => {
            deferred.resolve(result)
        }).catch((err) => {
            deferred.reject(err)
        });
        return deferred.promise;
    }

    /**
     * 
     * @returns {Promise}
     * @description This function is used to get all car listings
     */
    
    this.loadListings = function (params) {
        const deferred=$q.defer();
        db.getAllListingsAdmin(params).then((result) => {
         
            deferred.resolve(result);
        }).catch((err) => {
            deferred.reject(err)
        });
        return deferred.promise;
    };

    /**
     * 
     * @param {*} listingId 
     * @returns {Promise}
     * @description This function is used to delete the car listing
     */
    this.deleteListing=function(listingId){
        const deferred=$q.defer();
        db.deleteListings(listingId).then((result) => {
            deferred.resolve(result);
        }).catch((err) => {
            deferred.reject(err)
        });
        return deferred.promise;
    }

    this.updatelisting = function (params,blocked) {
        const blockedd={
            blocked:blocked
        }
        
        let deferred = $q.defer();
        db.updatelisting(params,blockedd).then((result) => {
            deferred.resolve(result)
        }).catch((err) => {
            deferred.reject(err)
        });
        return deferred.promise;
    };

}
]
)
   