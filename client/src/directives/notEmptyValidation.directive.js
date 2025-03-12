carRentalApp.directive('validateNotEmpty', function (validationService) {
    return {
        restrict: 'A',
        scope: { fieldModel: '=', fieldName: '@' },
        template: '<div class="error-message" ng-show="errorMessage">{{ errorMessage }}</div>',
        link: function (scope) {
            // scope.$watch('fieldModel', function (newValue) {
            //     scope.errorMessage = validationService.validateNotEmpty(newValue, scope.fieldName);
            // });
        }
    };
});
