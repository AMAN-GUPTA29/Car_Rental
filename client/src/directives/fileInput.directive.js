carRentalApp.directive("fileInput", function ($timeout) {
    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            element.bind("change", function (event) {
                $timeout(function () {
                    scope[attrs.fileInput] = event.target.files[0];
                });
            });
        }
    };
});