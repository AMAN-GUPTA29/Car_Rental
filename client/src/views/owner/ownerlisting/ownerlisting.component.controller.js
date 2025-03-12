carRentalApp.controller("CarListingController", function ($scope, $state, $timeout, CityService,CAR_COMPANIES,CAR_CATEGORIES,TRANSMISSION_TYPES,validationService,ownerdb,SessionService,$q) {

    $scope.user=SessionService.getUser();

    /**
     * @type {Array} carModels
     * @type {Array} carCategories
     * @type {Array} transmissionTypes
     * @type {Object} warnings
     * @type {Array} listings
     * @type {Object} newCar
     * @type {Array} cities
     * @type {Object} currentSlideIndex
     */
    $scope.carModels = CAR_COMPANIES; 
    $scope.carCategories = CAR_CATEGORIES;
    $scope.transmissionTypes = TRANSMISSION_TYPES;

   
    $scope.warnings = $scope.warnings || {
        year: "",
        mileage: "",
        basePrice: "",
        outstationPrice: ""
    };


    $scope.isModalOpen = false;
    $scope.newCar = {
        carMake: "",
        carModel: "",
        carYear: "",
        carPrice: "",
        carOutstationPrice: "",
        carColor: "",
        carMileage: "",
        carTransmission: "",
        carCategory: "",
        carDescription: "",
        carAddress: "",
        carcity: "",
        images: []
    };


    $scope.cities = [];
    $scope.currentSlideIndex = {}; 

    /**
     * 
     * @returns {Promise}
     * @description This function is used to load listings
     */
    function loadListings () {
        const user = $scope.user; 
            const deferred=$q.defer();
            ownerdb.getListingsByOwner(user.id).then((listing) => {
            deferred.resolve(listing);
        }).catch((err) => {
            deferred.reject(err)
        });    

        return deferred.promise;
    };

    /**
     * @description This function is used to initialize the controller
     * @returns {Promise}
     */
   $scope.init= function (){
    loadListings().then((result) => {
        $scope.listings=result
    }).catch((err) => {
        console.log('error')
    });;

   }
    
    
   /**
    * @description This function is used to open modal to register new car
    */
    $scope.openModal = function () {
        $scope.isModalOpen = true;
    };
    /**
     * @description This function is used to close modal
     * 
     */
    $scope.closeModal = function () {
        $scope.isModalOpen = false;
        $scope.newCar = {}; 
        $timeout(); 
    };
    /**
     * @description This function is used to logout
     */
    $scope.logout = function () {
        sessionStorage.removeItem("user");
        $state.go("login");
    };

   /**
    * @description This function is used to get cities
    * @param {string} country
    * @returns {Promise}
    */
    CityService.getCities("India")
        .then(function (cities) {
            $scope.cities = cities;
        })
        .catch(function (error) {
            console.error(error);
        });
    
      /**
       * @description This function is used to register new car listing
       * @returns {Promise}
       */
    $scope.registerListing = function () {

        $scope.warnings = {}; 

        $scope.warnings.year = validationService.validateYear($scope.newCar.carYear);
        $scope.warnings.mileage = validationService.validateMileage($scope.newCar.carMileage);
        $scope.warnings.price = validationService.validatePrice($scope.newCar.carPrice);
        $scope.warnings.outstationPrice = validationService.validatePrice($scope.newCar.carOutstationPrice);
    
        if (
            !$scope.warnings.year &&
            !$scope.warnings.mileage &&
            !$scope.warnings.price &&
            !$scope.warnings.outstationPrice
        ) {
            

        ownerdb.createListing($scope.newCar, $scope.user);
           
    
            alert("Car listing registered successfully!");
        } else {
            console.log("Validation errors:", $scope.warnings);
        }

        

        $timeout(function () {
            alert("Listing registered successfully!");
            $scope.newCar = {
                carMake: "",
                carModel: "",
                carYear: "",
                carPrice: "",
                carOutstationPrice: "",
                carColor: "",
                carMileage: "",
                carTransmission: "",
                carCategory: "",
                carDescription: "",
                carAddress: "",
                carcity: "",
                images: []
            };
            $scope.closeModal();
        });
    };

    /**
     * 
     * @param {*} event
     * @description This function is used to preview images 
     */
    $scope.previewImages = function (event) {
        let files = event.target.files;
        for (let i = 0; i < files.length; i++) {
            let reader = new FileReader();
            reader.onload = function (e) {
                $timeout(function () {
                    $scope.newCar.images.push(e.target.result);
                });
            };
            reader.readAsDataURL(files[i]);
        }
    };
    

    

    

    $scope.prevSlide = function (listingID) {
        if (!$scope.currentSlideIndex[listingID]) {
            $scope.currentSlideIndex[listingID] = 0;
        }
    
        let listing = $scope.listings.find(l => l.listingID === listingID);
        if (!listing) {
            console.error("Listing not found for ID:", listingID);
            return;
        }
    
        if (!listing.cardata || !Array.isArray(listing.cardata.images) || listing.cardata.images.length === 0) {
            console.error("No images found or images array is invalid for listing:", listingID);
            return;
        }
    
        let images = listing.cardata.images;
        $scope.currentSlideIndex[listingID] = ($scope.currentSlideIndex[listingID] - 1 + images.length) % images.length;
        console.log("Previous slide index for", listingID, ":", $scope.currentSlideIndex[listingID]);
    };
    
    $scope.nextSlide = function (listingID) {
        if (!$scope.currentSlideIndex[listingID]) {
            $scope.currentSlideIndex[listingID] = 0;
        }
    
        let listing = $scope.listings.find(l => l.listingID === listingID);
        if (!listing) {
            console.error("Listing not found for ID:", listingID);
            return;
        }
    
        if (!listing.cardata || !Array.isArray(listing.cardata.images) || listing.cardata.images.length === 0) {
            console.error("No images found or images array is invalid for listing:", listingID);
            return;
        }
    
        let images = listing.cardata.images;
        $scope.currentSlideIndex[listingID] = ($scope.currentSlideIndex[listingID] + 1) % images.length;
        console.log("Next slide index for", listingID, ":", $scope.currentSlideIndex[listingID]);
    };
    
    
});
