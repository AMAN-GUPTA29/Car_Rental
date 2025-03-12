carRentalApp.controller("LoginController", ["$scope", "$state", "userSignupService", function ($scope, $state, userSignupService) {
    $scope.user = {};
    /**
     * @description This function is used to initialize the controller
     */
    let storedUser = sessionStorage.getItem("user");
    if (storedUser) {
        let user = JSON.parse(storedUser);
        redirectToHome(user.role);
    }
   
   /**
    * @description This function is used to login
    */
    $scope.login = function () {
        let email = $scope.user.email;
        let password = CryptoJS.SHA256($scope.user.password).toString();
        console.log(email,password)
        userSignupService.loginUser(email, password) //
            .then((response) => {
                if (!response.success) {
                    alert(response.message);
                    return;
                }
                
                if (response.user.blocked) {
                    alert("Cannot log in. Your account is blocked.");
                    return;
                }

                
                sessionStorage.setItem("user", JSON.stringify({
                    email: email,
                    role: response.user.role,
                    id: response.user.userID,
                    name: response.user.username,
                    aadhar: response.user.aadhar,
                    mobile:response.user.phone
                }));
            
                
                redirectToHome(response.user.role);
            })
            .catch((error) => {
                console.error(error);
                alert("Login failed. Please try again.");
            });
    };
    /**
     * 
     * @param {*} role
     * @description This function is used to redirect to home page based on role 
     */
    function redirectToHome(role) {
        if (role === "admin") {
            $state.go("admindashboard");
        } else if (role === "owner") {
            $state.go("ownerhome");
        } else if (role === "user") {
            $state.go("home");
        } else {
            alert("Invalid User");
        }
    }
}]);
