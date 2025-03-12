carRentalApp.directive("phoneValidation", ["validationService", "$timeout", function (validationService, $timeout) {
    return {
        restrict: "A",
        link: function (scope, element,) {
            element.on("input", function () {
                $timeout(function () {
                    scope.warnings.phone = validationService.validatePhone(scope.user.phone);
                });
            });
        }
    };
}]);
