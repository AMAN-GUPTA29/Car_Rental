carRentalApp.directive("goBack", ["$window", function ($window) {
    return {
        restrict: "A",
        link: function (scope, element) {
            element.on("click", function (event) {
                event.preventDefault();
                console.log("goBack directive clicked");
                $window.history.back();
            });
        }
    };
}]);
