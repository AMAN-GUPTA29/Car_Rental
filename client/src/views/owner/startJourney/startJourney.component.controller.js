carRentalApp.controller("StartJourneyController", function ($scope, $timeout,SessionService,ownerdb) {

    /**
     * @type {Array} bookings
     * @type {Boolean} isModalOpen
     * @type {String} kmValue
     * @type {Number} currentPage
     * @type {Number} rowsPerPage
     * @type {Array} paginatedBids
     * @type {Object} selectedBooking
     */
        $scope.bookings = [];
        $scope.isModalOpen = false;
        $scope.kmValue ;
        let selectedBooking = null;
        $scope.currentPage=1;
        $scope.rowsPerPage=10;
       


        /**
         * @description This function is used to load bookings
         * @returns {Promise}
         */
        $scope.init= function (){
            loadBookings();
        }
         

        /**
         * @description This function is used to load bookings
         * @returns {Promise}
         */
        function loadBookings(){
            const user =SessionService.getUser();
            ownerdb.getUpcomingBookings(user.id).then((result) => {
                $scope.bookings=result;
                
            }).catch((err) => {
                console.log(err)
            });
        }
        

        /**
         * 
         * @param {*} booking
         * @description This function is used to open log km modal 
         */
        $scope.openLogKmModal = function (booking) {
            selectedBooking = booking;
            $scope.isModalOpen = true;
        };


        /**
         * @description This function is used to close modal
         */
        $scope.closeModal = function () {
            $scope.isModalOpen = false;
            $scope.kmValue = "";
        };

        /**
         * @description This function is used to save km value
         * 
         */
        $scope.pageChanged = function() {
            let start = ($scope.currentPage - 1) * $scope.rowsPerPage;
            let end = start + $scope.rowsPerPage;
            $scope.paginatedBids = $scope.filteredBids.slice(start, end);
        };

        /**
         * 
         * @param {*} kmval 
         * @returns {Promise}
         * @description This function is used to save km
         */
         $scope.saveKm =  function (kmval) {
            
            if (!kmval || isNaN(kmval) || kmval < 0) {
                alert("Please enter a valid KM value.");
                return;
            }

           ownerdb.updateStartKm(selectedBooking.historyID,kmval).then((result) => {
            $scope.closeModal();
            loadBookings();
           }).catch((err) => {
            console.log(err);
           });

           
        };

    });
