const carRentalApp = angular.module("carRentalApp", ["ui.router","oc.lazyLoad","ui.bootstrap"]);
/**
 * @function run
 * @description This function is used to run the app
 */
carRentalApp.run(function () {
    console.log("CarRentalApp is running...");
});