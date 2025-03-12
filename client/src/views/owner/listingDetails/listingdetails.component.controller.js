carRentalApp.controller("OwnerCarController", function ($scope,$stateParams,ownerdb,ImageService,SessionService,CAR_COMPANIES,CAR_CATEGORIES,TRANSMISSION_TYPES,) {
    /**
     * @type {Number} listingId
     * @type {Object} car
     * @type {Array} biddings
     * @type {Boolean} isEditModalOpen
     * @type {Object} editCar
     * @type {Array} carModels
     * @type {Array} carCategories
     * @type {Array} transmissionTypes
     */
    $scope.listingId = $stateParams.listingID;

    // initialization of the specific car selected to view
    $scope.car = {};
    $scope.biddings = []; // to load all the biddings
    $scope.isEditModalOpen = false; // to check is edit Modal open 
    $scope.editCar = { // to edit car object
        carMake: "",
        carModel: "",
        carYear: "",
        carPrice: "",
        carOutstationPrice: "",
        carColor: "",
        carMileage: "",
        carTransmission: "",
        carCategory: "",
        carAddress: "",
    };
    $scope.carimgno=0;
    let totalcarimg;
    // initalization of constant variable
    $scope.carModels = CAR_COMPANIES; 
    $scope.carCategories = CAR_CATEGORIES;
    $scope.transmissionTypes = TRANSMISSION_TYPES;

    // initialization function to load the data on page startup

    /**
     * @function init
     * @description This function is used to load car details and pending biddings
     */
    $scope.init= function (){
        
        getcardetails();
        getpendingbiddings();
        
    }
    /**
     * @function getcardetails
     * @description This function is used to get car details
     * @returns {Promise}
     */
    function getcardetails()
    {   
        const listingID=$scope.listingId;
        ownerdb.getCarListingById(listingID).then((result) => {
            $scope.car=result;
            totalcarimg=result.cardata.images.length;


        }).catch((err) => {
            
        });
            
    }

    /**
     * @function getpendingbiddings
     * @description This function is used to get pending biddings
     * @returns {Promise}
     */
    function getpendingbiddings()
    {

        const user =SessionService.getUser();
        const listingID=$scope.listingId;
        ownerdb.getPendingBiddingsOwnerCar(user.id,listingID).then((result) => {
            console.log( result);
            $scope.biddings=result;
        }).catch((err) => {
            console.log(err);
        });
    }


    /**
     * 
     * @param {*} bid 
     * @description This function is used to accept the bid
     */
    $scope.acceptBid = function (bid) {
        const car=$scope.car;
        const user =SessionService.getUser();
        ownerdb.statusbiddings(bid,"accept",user,car).then((result) => {
            getpendingbiddings();
        }).catch((err) => {
            console.log(err);
        });
    };

    /**
     * 
     * @param {*} bid 
     * @description This function is used to reject the bid
     */
    $scope.rejectBid = function (bid) {
        ownerdb.statusbiddings(bid,"rejected").then((result) => {
            getpendingbiddings();
        }).catch((err) => {
            console.log(err);
        });
    };

  /**
   * @description This function is used to navigate to next image
   */
  $scope.nextImage = function () {
    $scope.carimgno=ImageService.nextImagecar($scope.carimgno,totalcarimg);
    

  };

  /**
   * @description This function is used to navigate to previous image
   */
  $scope.prevImage = function () {
    $scope.carimgno=ImageService.prevImagecar($scope.carimgno,totalcarimg);
  };

  /**
   * @description This function is used to open edit modal
   */
  $scope.openEditModal=function(){
    console.log("cds")
    $scope.isEditModalOpen=true;
    console.log($scope.isEditModalOpen);
  }


   /**
   * @description This function is used to close edit modal
   */
  $scope.closeEditModal=function(){
    $scope.isEditModalOpen=false;
  }

    /**
     * @description This function is used to update car listing
     * @returns {Promise}
     */
    $scope.updateCarListing=function() {
        console.log($scope.car.listingID)
        
        console.log($scope.editCar)
        ownerdb.updateCarListing($scope.car.listingID,$scope.editCar).then((result) => {
            console.log(result);
            $scope.closeEditModal();
            getcardetails();
            }).catch((err) => {
                console.log(err);
            });
             

}
    
});

































