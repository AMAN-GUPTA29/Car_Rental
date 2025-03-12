carRentalApp.controller("ManageUsersController", function ($scope, $state,admindb) {
    

    /**
     * @type {Array} users
     * @type {Array} filteredUsers
     * @type {Number} currentPage
     * @type {Number} rowsPerPage
     * @type {String} emailFilter
     * @type {Array} paginatedUsers
     * 
     */
    $scope.users = [];
    $scope.filteredUsers = [];
    $scope.currentPage = 1;
    $scope.rowsPerPage = 5;
    $scope.emailFilter = "";
    $scope.paginatedUsers = [];

    /**
     * @description This function is used to initialize the controller
     */
    $scope.init=function(){
        getUsers()
    }
    
    /**
     * @description This function is used to get all users
     * @returns {
     * Promise 
     * }
     */
    function getUsers   () {
        admindb.getUsers().then(function (users) {
            $scope.users = users.filter(user => user.role !== "admin"); 
            $scope.applyFilters();
        });
    };

    /**
     * @description This function is used to apply filters
     */ 
    $scope.applyFilters = function () {
        $scope.filteredUsers = $scope.users.filter(user =>
            !$scope.emailFilter || user.email.toLowerCase().includes($scope.emailFilter.toLowerCase())
        );
        $scope.currentPage = 1;
        $scope.paginateUsers();
    };

    /**
     * @description This function is used to paginate users 
     */
    $scope.paginateUsers = function () {
        let start = ($scope.currentPage - 1) * $scope.rowsPerPage;
        let end = start + $scope.rowsPerPage;
        $scope.paginatedUsers = $scope.filteredUsers.slice(start, end);
    };

    /**
     * @description This function is used to go to next page
     */
    $scope.nextPage = function () {
        if ($scope.currentPage * $scope.rowsPerPage < $scope.filteredUsers.length) {
            $scope.currentPage++;
            $scope.paginateUsers();
        }
    };

    /**
     * @description This function is used to go to previous page
     */
    $scope.prevPage = function () {
        if ($scope.currentPage > 1) {
            $scope.currentPage--;
            $scope.paginateUsers();
        }
    };

    /**
     * 
     * @param {*} user 
     * @description This function is used to block user by admin
     */
    $scope.blockUser = function (user) {
        if (confirm(`Are you sure you want to block ${user.email}?`)) {
            admindb.blockUser(user.userID).then(() => {
                user.blocked = true;
                // $scope.applyFilters();
            });
        }
    };

    /**
     * 
     * @param {*} user 
     * @description This function is used to unblock user by admin
     */
    $scope.unblockUser = function (user) {
        if (confirm(`Unblock ${user.email}?`)) {
            admindb.unblockUser(user.userID).then(() => {
                user.blocked = false;
                // $scope.applyFilters();
            });
        }
    };

    /**
     * @description This function is used to change the page
     * @returns {void}
     */
    $scope.pageChanged = function() {
        let start = ($scope.currentPage - 1) * $scope.rowsPerPage;
        let end = start + $scope.rowsPerPage;
        $scope.paginatedUsers = $scope.users.slice(start, end);
    };

    
  

   

});
