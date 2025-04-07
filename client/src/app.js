const carRentalApp = angular.module("carRentalApp", ["ui.router","oc.lazyLoad","ui.bootstrap"]).config(['$httpProvider',function($httpProvider){
    // $httpProvider.defaults.withCredentials = true;
}]);
/**
 * @function run
 * @description This function is used to run the app
 */
carRentalApp.run(function () {
    console.log("CarRentalApp is running...");
});




// $scope.showBasicToast = function() {
//     toastifyService.showToast("This is a basic toast notification");
//   };
  
//   // Example with a success message
//   $scope.showSuccessToast = function() {
//     toastifyService.success("Operation completed successfully!");
//   };
  
//   // Example with an error message
//   $scope.showErrorToast = function() {
//     toastifyService.error("An error occurred!");
//   };