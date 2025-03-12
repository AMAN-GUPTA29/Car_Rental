
/**
 * Sidebar component controller
 * @param {Object} $scope
 * @param {Object} $state
 */
carRentalApp.component("adminSidebar", {
    templateUrl: "/src/views/admin/utils/sidebar/sidebar.component.html",
    controller: "AdminSidebarController",
});
carRentalApp.controller("AdminSidebarController", function ($scope, $state) {
    $scope.logout = function () {
        sessionStorage.removeItem("user");
        $state.go("login");
    };
});
