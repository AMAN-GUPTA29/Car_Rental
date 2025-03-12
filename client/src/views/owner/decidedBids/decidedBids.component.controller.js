carRentalApp.controller(
  "ApprovedBidsOwnerController",
  function ($scope,ownerdb,SessionService,FilterService,AuthService,PaginationService) {

    /**
     * @type {Array} approvedBids
     * @type {Array} filteredBids
     * @type {Array} categories
     * @type {Array} transmissions
     * @type {Object} filter
     * @type {Number} currentPage
     * @type {Number} rowsPerPage
     * @type {Number} histPage
     * @type {Array} chatMessages
     */
    $scope.approvedBids = [];
    $scope.filteredBids = [];
    $scope.categories = [];
    $scope.transmissions = [];
    $scope.filter = {};
    $scope.currentPage = 1;
    $scope.rowsPerPage = 10;
    $scope.histPage=1,
    $scope.chatMessages = [];




    /**
     * @type {Function} init
     * @type {Function} loadApprovedBids
     * @description init function to load all approved bids
     */
    $scope.init = function () {
      loadApprovedBids();
    };





    /**
     * @function loadApprovedBids
     * @description This function is used to load all approved bids
     * @returns {
     *  Promise
     * }
     */
    function loadApprovedBids() {
        const user =SessionService.getUser();
      ownerdb.getApprovedBidsOwner(user.id)
        .then((result) => {

          $scope.approvedBids = result;
          $scope.filteredBids = [...result];

          $scope.categories = $scope.filteredBids
            .filter(
              (value, index, self) =>
                index ===
                self.findIndex(
                  (t) => t.cardata.carCategory === value.cardata.carCategory
                )
            )
            .map((car) => car.cardata.carCategory);

          $scope.transmissions = $scope.filteredBids
            .filter(
              (value, index, self) =>
                index ===
                self.findIndex(
                  (t) =>
                    t.cardata.carTransmission === value.cardata.carTransmission
                )
            )
            .map((car) => car.cardata.carTransmission);
          $scope.renderTable();
        })
        .catch((err) => {
            console.error(err);
        });

      
    }





    /**
     * @function pageChanged
     * @description This function is used to paginate the table
     * @returns {void}
     */
    $scope.pageChanged = function() {
      let start = ($scope.currentPage - 1) * $scope.rowsPerPage;
      let end = start + $scope.rowsPerPage;
      $scope.paginatedBids = $scope.filteredBids.slice(start, end);
  };

    
  

    $scope.applyFilters = function () {
        FilterService.applyFiltersApproved($scope);
    };

    /**
     * @function renderTable
     * @description This function is used to render the table
     * @returns {void}
     */
    $scope.renderTable = function () {
      let start = ($scope.currentPage - 1) * $scope.rowsPerPage;
      let end = start + $scope.rowsPerPage;
      $scope.paginatedBids = $scope.filteredBids.slice(start, end);
      $scope.totalPages = Math.ceil(
        $scope.filteredBids.length / $scope.rowsPerPage
      );
    };

  }
);
