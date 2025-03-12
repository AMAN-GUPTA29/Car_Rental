/**
 * @description This service is responsible for handling all the admin related operations
 */
carRentalApp.service("admindb", ["db","validationService","$q","idGeneratorService", function (db,validationService,$q,idGeneratorService) {

    /**
     * 
     * @returns {Promise}
     * @description This function is used to get all users
     */
    this.getUsers = function () {
        let deferred = $q.defer();
        db.getAllUser().then((result) => {
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
    this.blockUser = function (userID) {
        
        let deferred = $q.defer();
        db.blockUser(userID).then((result) => {
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

    /**
     * 
     * @returns {Promise}
     * @description This function is used to get all car listings
     */
    
    this.getAllCarListings = function () {
        const deferred=$q.defer();
        db.getAllListings().then((result) => {
         
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

}
]
)
   