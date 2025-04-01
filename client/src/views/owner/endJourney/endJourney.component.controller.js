carRentalApp.controller(
  "EndJourneyController",
  function ($scope, ownerdb, SessionService, BiddingFactory) {
    /**
     * @type {Array} upcomingBookings
     * @type {Boolean} isModalOpen
     * @type {String} kmValue
     * @type {Number} currentPage
     * @type {Number} rowsPerPage
     * @type {Array} paginatedBids
     */
    $scope.upcomingBookings = [];
    $scope.isModalOpen = false;
    $scope.kmValue = "";
    $scope.currentPage = 1;
    $scope.rowsPerPage = 10;
    selectedBooking = null;
    $scope.paginatedBids = [];

    /**
     * @description This function is used to load bookings
     * @returns {Promise}
     */
    function loadBookings() {
      const user = SessionService.getUser();

      const bidding = new BiddingFactory();

      // Call the getUpcomingBookingsEnd method on the bidding object
      bidding
        .getUpcomingBookingsEnd(user.id)
        .then(function (bookings) {
          console.log(bookings);
          $scope.upcomingBookings = bookings.data;
          $scope.pageChanged();
        })
        .catch(function (error) {
          console.error("Error loading upcoming bookings:", error);
        });
    }

    /**
     * @description This function is used to initialize the controller
     */
    $scope.init = function () {
      loadBookings();
    };

    /**
     *
     * @param {*} booking
     * @description This function is used to open km modal
     *
     */
    $scope.openKmModal = function (booking) {
      selectedBooking = booking;
      $scope.isModalOpen = true;
    };

    /**
     * @description This function is used to close km modal
     */
    $scope.closeKmModal = function () {
      $scope.isModalOpen = false;
      $scope.kmValue = "";
    };

    /**
     * @description This function is used to change the page
     */
    $scope.pageChanged = function () {
      let start = ($scope.currentPage - 1) * $scope.rowsPerPage;
      let end = start + $scope.rowsPerPage;
      $scope.paginatedBids = $scope.upcomingBookings.slice(start, end);
    };
    /**
     *
     * @param {*} kmValue
     * @returns {Promise}
     * @description This function is used to save km
     *
     */
    $scope.saveKm = function (kmValue) {
      console.log(kmValue);
      console.log(selectedBooking);
      $scope.kmValue = parseInt(kmValue);

      if (!$scope.kmValue || isNaN($scope.kmValue)) {
        alert("Please enter a valid KM value.");
        return;
      }

      if ($scope.kmValue < selectedBooking.startkm) {
        alert("please enter a value greater than starting value");
        return;
      }

      const bidding = new BiddingFactory();

      // Call the updateEndKm method on the bidding object
      bidding
        .updateEndKm(selectedBooking._id, $scope.kmValue)
        .then((result) => {
          loadBookings();
          $scope.closeKmModal();
        })
        .catch((err) => {
          console.error("Error updating end kilometer:", err);
        });
    };
  }
);
