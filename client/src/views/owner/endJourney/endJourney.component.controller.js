carRentalApp.controller("EndJourneyController", function ($scope, ownerdb,SessionService) {
        
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
        $scope.currentPage=1;
        $scope.rowsPerPage=10;
       selectedBooking = null;
       $scope.paginatedBids = [];

      

       /**
        * @description This function is used to load bookings
        * @returns {Promise}
        */
        function loadBookings () {
            const user =SessionService.getUser();
           
            ownerdb.getUpcomingBookingsend(user.id)
                .then(function (bookings) {
                    $scope.upcomingBookings = bookings;
                    $scope.pageChanged();
                })
                .catch(function (error) {
                    console.error("Error loading upcoming bookings:", error);
                });
        };

        /**
         * @description This function is used to initialize the controller
         */
        $scope.init= function (){
            loadBookings();
        }

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
        $scope.pageChanged = function() {
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
            
            console.log($scope.kmValue);
            console.log(selectedBooking);
            $scope.kmValue = parseInt(kmValue);
            

            
            

            if (!$scope.kmValue || isNaN($scope.kmValue)) {
                alert("Please enter a valid KM value.");
                return;
            }

            if($scope.kmValue<selectedBooking.startkm)
            {
                    alert("please enter a value greater than starting value");
                    return;
            }
            
            ownerdb.carEndKm(selectedBooking.historyID,$scope.kmValue).then((result) => {
                
                
                ownerdb.updateInvoice(result).then((result) => {
                    loadBookings();
                $scope.closeKmModal();
                }).catch((err) => {
                    console.error("Error loading upcoming bookings:", err);

                });
                
            }).catch((err) => {
                console.error("Error loading upcoming bookings:", err);

            });

        };

        
        
    });
