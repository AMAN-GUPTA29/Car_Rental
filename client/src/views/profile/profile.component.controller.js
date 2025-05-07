carRentalApp.controller("profileController", function ($scope,SessionService,db,UserFactory) {
    
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
        console.log($scope.user)
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

        console.log($scope.editUser)
        const userToEdit = new UserFactory({ _id: $scope.user.id,userName: $scope.editUser.username,phone:$scope.editUser.phone,password :$scope.editUser.newPassword,aadhar: $scope.editUser.aadhar,
            email: $scope.editUser.email,role:$scope.user.role});

        userToEdit.edit().then((result) => {
            console.log("Updated User:", result);
            sessionStorage.setItem("user", JSON.stringify(result));
            sessionStorage.setItem("user", JSON.stringify({
                email: result.data.email,
                role: result.data.role,
                id: result.data._id,
                name: result.data.userName,
                aadhar: result.data.aadhar,
                mobile:result.data.phone,
                token:result.token
                
            }));
            location.reload();
    }).catch((err) => {
        console.log(err)
    }); 

        
    };

   
  
});
