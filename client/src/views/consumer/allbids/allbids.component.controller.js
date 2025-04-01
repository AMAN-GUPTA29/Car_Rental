carRentalApp.controller("BiddingController", function ($scope,db,SessionService,CAR_CATEGORIES,CityService,BiddingFactory) {

    /**
     * @type {Array} bids
     * @type {Array} categories
     * @type {Array} cities
     * @type {Array} ownerEmails
     * @type {Number} currentPage
     * @type {Number} rowsPerPage
     */
    $scope.bids = [];   
    $scope.categories =CAR_CATEGORIES;
    $scope.cities = [];
    $scope.ownerEmails = [];
    $scope.currentPage = 1;
    $scope.rowsPerPage = 10;


    /**
     * @type {Object} filters
     * @description filters to apply on bids
     * @type {String} category
     * @type {String} city
     * @type {String} ownerEmail
     * @type {String} status
     * @type {String} startDate
     */
    $scope.filters = {
        category: "",
        city: "",
        ownerEmail: "",
        status: "",
    };

    /**
     * @description This function is used to initialize the controller
     */
    $scope.init= function (){
        loadBids();
        getCities();
    }

    function getCities()
    {
        CityService.getCities("India")
        .then(function (cities) {
            $scope.cities = cities;
        })
        .catch(function (error) {
            console.error(error);
        });
    }

    /**
     * @description This function is used to load bids
     * @returns {Promise}
     */
    function loadBids() {
        console.log($scope.filters);
        if($scope.filters.category==null)
        {
            $scope.filters.category="";
        }
        if($scope.filters.city==null)
        {
                $scope.filters.city="";
        }
        $scope.user =SessionService.getUser();
        BiddingFactory.getUserBiddingHistory($scope.user.id, $scope.filters, $scope.currentPage, $scope.rowsPerPage)
        .then(function(response) {
          console.log("resssss", response);
          $scope.bids = response.records; // setting bids
        })
        .catch(function(error) {
          console.error("Error fetching bidding history:", error);
        });
    }
    /**
     * @description This function is used to apply filters
     */
    $scope.applyFilters = function () {
        $scope.currentPage = 1;
        loadBids();
    };
    /**
     * @description This function is used to navigate to previous page
     */
    $scope.prevPage = function () {
        if ($scope.currentPage > 1) {
            $scope.currentPage--;
            loadBids();
        }
    };  

    /**
     * @description This function is used to navigate to next page
     */
    $scope.nextPage = function () {
        if ($scope.bids.length === $scope.rowsPerPage) {
            $scope.currentPage++;
            loadBids();
        }
    };


    

   

});
