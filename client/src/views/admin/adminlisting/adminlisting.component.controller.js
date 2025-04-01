carRentalApp.controller("AdminListingController", function ($scope, admindb,$http,ListingFactory) {
    $scope.searchEmail = "";
    $scope.listings = [];

    $scope.init = function() {
        $scope.loadListings();
    };
    
    $scope.loadListings = async function() {
        try {
            params={
                email:$scope.searchEmail,
            }


            ListingFactory.fetchAllCarAdmin(params).then((result) => {
                console.log(result);
                $scope.listings = result.listings.map(listing => ({
                    ...listing,
                    currentImageIndex: 0
                }));

                console.log("cswda",$scope.listings)
                
            }).catch((err) => {
                console.error("Error loading listings:", err);

            });
        } catch (error) {
            console.error("Error loading listings:", error);
        }
    };

    $scope.applyFilter = function() {
        $scope.loadListings();
    };

    $scope.deleteListing = async function(listingId) {
        if (confirm("Are you sure you want to delete this listing?")) {
            const listingToBlock = new ListingFactory({_id:listingId});
            listingToBlock.block().then((result) => {
                $scope.loadListings();
                
            }).catch((err) => {
                console.error("Error loading listings:", err);

            });
        }
    };

    $scope.nextImage = function(listing) {
        listing.currentImageIndex = (listing.currentImageIndex + 1) % listing.images.length;
    };

    $scope.prevImage = function(listing) {
        listing.currentImageIndex = (listing.currentImageIndex - 1 + listing.images.length) % listing.images.length;
    };
});
