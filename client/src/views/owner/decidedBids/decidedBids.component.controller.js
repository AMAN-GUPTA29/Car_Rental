carRentalApp.controller("ApprovedBidsOwnerController", function($scope, db, SessionService, FilterService,CAR_CATEGORIES,TRANSMISSION_TYPES,BiddingFactory) {
  $scope.bids = [];
  $scope.pagination = {
      currentPage: 1,
      itemsPerPage: 10,
      totalItems: 0
  };

  $scope.categories=CAR_CATEGORIES;
  $scope.transmissions=TRANSMISSION_TYPES;

  $scope.filters = {
      category: "",
      transmission: "",
      startDate: "",
      endDate: "",
      minBidPrice: ""
  };

  $scope.init = function() {
      $scope.loadBids();
  };

  $scope.loadBids = function() {
      const params = {
          page: $scope.pagination.currentPage,
          limit: $scope.pagination.itemsPerPage,
          ...FilterService.getQueryParams($scope.filters)
      };

      const user = SessionService.getUser();
      
      const bidding = new BiddingFactory();
    
    // Call the prototype method on the bidding object
    bidding.getAcceptedBidOwner(params)
      .then(function(response) {
        $scope.pagination.totalItems=response.totalItems;
        console.log("resssss", response);
        $scope.bids = response.bids; // setting bids
      })
      .catch(function(error) {
        console.error("Error fetching bidding history:", error);
      });
  };

  $scope.pageChanged = function() {
      $scope.loadBids();
  };

  $scope.applyFilters = function() {
      $scope.pagination.currentPage = 1;
      $scope.loadBids();
  };
});
