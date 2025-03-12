carRentalApp.directive("emailValidation", ["validationService", "$timeout", function (validationService, $timeout) {
    return {
        restrict: "A",
        link: function (scope, element) {
            element.on("input", function () {
                $timeout(function () {
                    scope.warnings.email = validationService.validateEmail(scope.user.email);
                });
            });
        }
    };
}]);
