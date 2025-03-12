carRentalApp.directive("priceValidation", ["validationService", "$timeout", function (validationService, $timeout) {
    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            if (!scope.warnings) {
                scope.warnings = {};
            }

            element.on("input", function () {
                $timeout(function () {
                    let fieldName = attrs.ngModel.split(".").pop();
                    scope.warnings[fieldName] = validationService.validatePrice(scope.newCar[fieldName]);
                });
            });
        }
    };
}]);
