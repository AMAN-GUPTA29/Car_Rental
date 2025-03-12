carRentalApp.controller("SignupController", ["$scope", "$state", "userSignupService", "validationService", function ($scope, $state, userSignupService, validationService) {
    /**
     * @type {Object} user
     * @type {Object} warnings
     */
    $scope.user = {};
    $scope.warnings = {};

    /**
     * 
     * @returns {Promise}
     * @description This function is used to signup a user
     */
    $scope.signup = function () {
        $scope.warnings.email = validationService.validateEmail($scope.user.email);
        $scope.warnings.phone = validationService.validatePhone($scope.user.phone);
        $scope.warnings.password = validationService.validatePassword($scope.user.password);

       
        if ($scope.warnings.email || $scope.warnings.phone || $scope.warnings.password) {
            return;
        }   


        /**
         * @type {Object} userData
         * @type {String} userData.email
         * @type {Boolean} userData.role
         * @type {String} userData.aadhar
         * @type {String} userData.username
         * @type {String} userData.phone
         * @type {String} userData.password
         * @type {Boolean} userData.authorise
         * 
         */
        let userData = {
            email: $scope.user.email,
            role: $scope.user.role,
            aadhar: $scope.user.aadhar,
            username: $scope.user.username,
            phone: $scope.user.phone,
            password: CryptoJS.SHA256($scope.user.password).toString(),
            authorise: $scope.user.role === true
        };

        userSignupService.saveSignupInfo(userData)
            .then(function () {
                console.log("User data saved successfully");
                setTimeout(() => $state.go("login"), 2000);
            })
            .catch(function (error) {
                console.error("Error saving user data:", error);
            });
    };
}]);
