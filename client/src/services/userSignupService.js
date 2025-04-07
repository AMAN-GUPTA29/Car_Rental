carRentalApp.service("userSignupService", function ($q,dbService, idGeneratorService,ApiService,toastifyService) {
    /**
     * 
     * @param {*} userData 
     * @returns {Promise}
     * @description This function is used to save signup info
     */


    this.saveSignupInfo = function (userData) {
        const deferred = $q.defer();
    
        console.log(userData);
    
        ApiService.postData('/auth/signup', userData)
            .then(function(response) {
                console.log("User data saved successfully:", response.data);
                deferred.resolve(response.data.userID);
            })
            .catch(function(error) {
                console.error("Error saving user data:", error);
                deferred.reject(error);
            });
    
        return deferred.promise;
    };
    

    /**
     * 
     * @param {*} email 
     * @param {*} password 
     * @returns {Promise}
     * @description This function is used to login user
     */
    this.loginUser = function (email, password) {
        const deferred = $q.defer();
        
        const loginData = {
            email: email,
            password: password
        };
   
        
    
        ApiService.postDatalog('/auth/login', loginData)
            .then(function(response) {
                console.log("Login successful:", response.data);
                deferred.resolve({
                    success: true,
                    user: response.data,
                    message: "Login successful"
                });
            })
            .catch(function(error) {
                console.error("Login error:", error);
                    toastifyService.error(error.data.message);

                let errorMessage = "An error occurred during login";
                if (error.status === 401) {
                    errorMessage = "Invalid email or password";
                } else if (error.status === 403) {
                    errorMessage = "Account is blocked";
                }
                deferred.reject({
                    success: false,
                    message: errorMessage
                });
            });
    
        return deferred.promise;
    };
    
});
