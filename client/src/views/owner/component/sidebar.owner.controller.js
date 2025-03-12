/**
 * Sidebar Controller
 * @param {Object} $scope
 * @param {Object} $state
 * 
 */

carRentalApp.controller("SidebarController", function ($scope, $state) {
    $scope.logout = function () {
      sessionStorage.removeItem("user");
      $state.go("login");
    };
  });

  carRentalApp.component("sidebar", {
    templateUrl: "/src/views/owner/component/sidebar.owner.component.html",
    controller: "SidebarController",
  });
  
  