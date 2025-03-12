carRentalApp.directive("passwordValidation", ["validationService", "$timeout", function (validationService, $timeout) {
    return {
        restrict: "A",
        link: function (scope, element) {
            element.on("input", function () {
                $timeout(function () {
                    scope.warnings.password = validationService.validatePassword(scope.user.password);
                });
            });
        }
    };
}]);
