carRentalApp.controller("AllBidsOwnerController", function($scope, SessionService, BiddingFactory, $timeout){
    /**
     * @type {Array} allBiddings - to store all the biddings for all cars
     */
    $scope.allBiddings = [];
    $scope.isLoading = true;

    /**
     * @function init
     * @description Initialize the controller and fetch all biddings
     */
    $scope.init = function() {
        console.log("Initializing AllBidsOwnerController");
        $timeout(function() {
            getAllBiddings();
        }, 100);
    };

    /**
     * @function getAllBiddings
     * @description Fetch all biddings for the owner's cars
     */
    function getAllBiddings() {
        console.log("Fetching all biddings");
        const user = SessionService.getUser();
        
        if (!user || !user.id) {
            console.error("No user found or user ID missing");
            $scope.isLoading = false;
            return;
        }
        
        console.log("User ID:", user.id);
        const bidding = new BiddingFactory();

        bidding.getAllPendingBiddingsOwner(user.id)
            .then(function(result) {
                console.log("All biddings result:", result);
                if (result && result.biddings) {
                    $scope.allBiddings = result.biddings;
                   
                } else {
                    $scope.allBiddings = [];
                }
                $scope.isLoading = false;
            })
            .catch(function(err) {
                console.error("Error fetching all biddings:", err);
                $scope.isLoading = false;
             
            });
    }

    /**
     * @function acceptBid
     * @param {Object} bid - The bid object to accept
     * @description Accept the selected bid
     */
    $scope.acceptBid = function(bid) {
        $scope.isLoading = true;
        const user = SessionService.getUser();
        const bidding = new BiddingFactory();

        bidding.acceptBid(bid, user, bid.carData)
            .then(function(result) {
                console.log("Bid accepted successfully:", result);
                getAllBiddings(); // Refresh the biddings list
            })
            .catch(function(err) {
                console.error("Error accepting bid:", err);
                $scope.isLoading = false;
            });
    };

    /**
     * @function rejectBid
     * @param {Object} bid - The bid object to reject
     * @description Reject the selected bid
     */
    $scope.rejectBid = function(bid) {
        $scope.isLoading = true;
        const user = SessionService.getUser();
        const bidding = new BiddingFactory();

        bidding.rejectBid(bid, user, bid.carData)
            .then(function(result) {
                console.log("Bid rejected successfully:", result);
                getAllBiddings(); // Refresh the biddings list
            })
            .catch(function(err) {
                console.error("Error rejecting bid:", err);
                $scope.isLoading = false;
            });
    };
    
    // Manually call init when controller loads
    $timeout(function() {
        $scope.init();
    }, 0);
});