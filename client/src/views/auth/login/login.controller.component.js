carRentalApp.controller("LoginController", ["$scope", "$state", "userSignupService", function ($scope, $state, userSignupService) {
    $scope.user = {};
    /**
     * @description This function is used to initialize the controller
     */
    // let storedUser = sessionStorage.getItem("user");
    // if (storedUser) {
    //     let user = JSON.parse(storedUser);
    //     redirectToHome(user.role);
    // }
   
   /**
    * @description This function is used to login
    */
    $scope.login = function () {
        let email = $scope.user.email;
        let password = $scope.user.password
       
        userSignupService.loginUser(email, password) 

            .then((response) => {
                console.log("wedrfvdfv",response);
                console.log(response.user)
                if (!response.success) {
                    alert(response.message);
                    return;
                }
                
                if (response.user.blocked) {
                    alert("Cannot log in. Your account is blocked.");
                    return;
                }

                console.log("sd",response);
                 
                sessionStorage.setItem("user", JSON.stringify({
                    email: email,
                    role: response.user.user.role,
                    id: response.user.user.id,
                    name: response.user.user.username,
                    aadhar: response.user.user.aadhar,
                    mobile:response.user.user.phone,
                    token:response.user.token
                }));
            
                
                redirectToHome(response.user.user.role);
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
