carRentalApp.controller("profileController", function ($scope,SessionService,db) {
    
    $scope.isModalOpen = false;

    /**
     * @type {Object} user
     */
    $scope.user =SessionService.getUser();

    /**
     * @type {Object} editUser
     * @type {String} editUser.username
     * @type {String} editUser.email
     * @type {String} editUser.aadhar
     * @type {String} editUser.phone
     * @type {String} editUser.oldPassword
     * @type {String} editUser.newPassword
     * @description This object is used to store user details
     * 
     */
    $scope.openEditModal = function () {
        $scope.isModalOpen = true;

        $scope.editUser = {
            username: $scope.user.username,
            email: $scope.user.email,
            aadhar: $scope.user.aadhar,
            phone: $scope.user.phone,
            oldPassword: "",
            newPassword: "",
        };
    };

    /**
     * @description This function is used to
     * close the edit modal
     */
    $scope.closeEditModal = function () {
        $scope.isModalOpen = false;
    };

   /**
    * 
    * @returns {Promise}
    * @description This function is used to save profile
    */
    $scope.saveProfile = function () {

       

        if (!$scope.editUser.phone.match(/^[0-9]{10}$/)) {
            alert("Please enter a valid 10-digit phone number.");
            return;
        }

        if (
            $scope.editUser.newPassword &&
            !$scope.editUser.newPassword.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/)
        ) {
            alert("Password must be at least 8 characters long, with one uppercase letter, one lowercase letter, and one special character.");
            return;
        }
        db.editUserProfile(
            $scope.user.id,
            $scope.editUser.name,
            $scope.editUser.phone,
            $scope.editUser.oldPassword,
            $scope.editUser.newPassword).then((result) => {
                console.log("Updated User:", result);
                sessionStorage.setItem("user", JSON.stringify(result));
                location.reload();
        }).catch((err) => {
            console.log(err)
        }); 
    };

   
  
});
