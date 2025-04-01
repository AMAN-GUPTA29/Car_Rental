carRentalApp.controller("ManageUsersController", function ($scope, admindb, $state,UserFactory) {
    $scope.currentPage = 1;
    $scope.itemsPerPage = 5;
    $scope.searchEmail = "";
    $scope.users = [];
    $scope.pagination = {};

    $scope.init = function() {
        $scope.loadUsers();
    };

    $scope.loadUsers = function() {
        const params = {
            page: $scope.currentPage,
            limit: $scope.itemsPerPage,
            email: $scope.searchEmail
        };

        admindb.getUsers(params).then((result) => {
            $scope.users = result.data.users;
            $scope.pagination = result.data.pagination || {};
           console.log($scope.users); 
        }).catch((err) => {
            console.error("Error loading users:", err);
        });

       
    };

    $scope.searchUsers = function() {
        $scope.currentPage = 1;
        $scope.loadUsers();
    };

    $scope.pageChanged = function() {
        $scope.loadUsers();
    };

    $scope.blockUser = function(user) {
        if (confirm(`Are you sure you want to block ${user.email}?`)) {

            const userToBlock = new UserFactory({ _id: user._id });

            userToBlock.block().then(function() {
                user.blocked = true;
              }).catch(function(error) {
                console.error('Error blocking user:', error);
              });

            // const params={
            //     id:user._id,
            // }
            // admindb.updateuser(params , true).then((result) => {
            //     user.blocked = true;
            // }).catch((err) => {
            //     console.error(err);
            // });
        }
    };

    $scope.unblockUser = function(user) {
        if (confirm(`Unblock ${user.email}?`)) {

            const userToUnBlock = new UserFactory({ _id: user._id });

            userToUnBlock.unblock().then(function() {
                user.blocked = false;
              }).catch(function(error) {
                console.error('Error blocking user:', error);
              });

            // const params={
            //     id:user._id,
            // }
            // admindb.updateuser(params , false)
            //     .then(() => {
            //         user.blocked = false;
            //     })
            //     .catch(console.error);
        }
    };
});
