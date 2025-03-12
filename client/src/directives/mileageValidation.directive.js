carRentalApp.directive("mileageValidation", ["validationService", "$timeout", function (validationService, $timeout) {
    return {
        restrict: "A",
        link: function (scope, element) {
            if (!scope.warnings) {
                scope.warnings = {};
            }

            element.on("input", function () {
                $timeout(function () {
                    scope.warnings.carMileage = validationService.validateMileage(scope.newCar.carMileage);
                });
            });
        }
    };
}]);
