carRentalApp.directive("yearValidation", ["validationService", "$timeout", function (validationService, $timeout) {
    return {
        restrict: "A",
        link: function (scope, element) {
            element.on("input", function () {
                $timeout(function () {
                    scope.warnings.year = validationService.validateYear(scope.newCar.carYear);
                });
            });
        }
    };
}]);
