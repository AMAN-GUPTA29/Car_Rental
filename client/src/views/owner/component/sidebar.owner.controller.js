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

    $scope.toggleSidebar = function() {
      var sidebar = document.getElementById('sidebar');
      sidebar.classList.toggle('active');
  };
  });

  carRentalApp.component("sidebar", {
    templateUrl: "/src/views/owner/component/sidebar.owner.component.html",
    controller: "SidebarController",
  });




  
 