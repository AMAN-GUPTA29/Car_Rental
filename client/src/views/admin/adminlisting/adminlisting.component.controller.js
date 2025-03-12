carRentalApp.controller("AdminListingController", function ($scope, $state, admindb) {

    /**
     * Admin Listing Controller
     * @param {Object} $scope
     * @param {Object} $state
     * @param {Object} admindb
     */
    $scope.searchEmail = "";
    $scope.listings = [];
    $scope.filteredListings = [];






    /**
     * @description This function is used to initialize the controller
     */
    $scope.init=function(){
        loadListings();
    }
    
    /**
     * @description This function is used to load all listings
     * @returns {Promise}
     */
    function loadListings() {
        admindb.getAllCarListings().then(function (response) {
            
            $scope.listings = response.map(listing => ({
                ...listing,
                currentImageIndex: 0 
            }));
            $scope.filteredListings = [...$scope.listings]; // putting listings in filterlistings so to manupulate only one array on filter
            console.log($scope.filteredListings);
        }).catch(function (error) {
            console.error("Error loading listings:", error);
        });
    }

    /**
     * @description This function is used to apply filters
     */
    $scope.applyFilter = function () { //for filters
        const emailQuery = $scope.searchEmail.toLowerCase().trim();
        $scope.filteredListings = $scope.listings.filter(listing => 
            listing.owner.ownerEmail.toLowerCase().includes(emailQuery)
        );
    };

    /**
     * 
     * @param {*} listingId 
     * @description This function is used to delete listing
     */
    $scope.deleteListing = function (listingId) {
        if (confirm("Are you sure you want to delete this listing?")) {
            admindb.deleteListing(listingId).then(function () {
                // $scope.listings = $scope.listings.filter(l => l.listingID !== listingId);
                $scope.applyFilter();
            }).catch(function (error) {
                console.error("Error deleting listing:", error);
            });
        }
    };

    /**
     * 
     * @param {*} listing 
     * @description This function is used to view listing image
     */
    $scope.nextImage = function (listing) {
        listing.currentImageIndex = (listing.currentImageIndex + 1) % listing.cardata.images.length;
    };

    /**
     * 
     * @param {*} listing
     * @description This function is used to view previous image 
     */
    $scope.prevImage = function (listing) {
        listing.currentImageIndex = (listing.currentImageIndex - 1 + listing.cardata.images.length) % listing.cardata.images.length;
    };

});
