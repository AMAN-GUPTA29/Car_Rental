carRentalApp.service("userSignupService", function ($q,dbService, idGeneratorService) {
    /**
     * 
     * @param {*} userData 
     * @returns {Promise}
     * @description This function is used to save signup info
     */
    this.saveSignupInfo = function (userData) {

        return dbService.openDB().then((db)=>{
            const deferred=$q.defer()
            const transaction = db.transaction("user", "readwrite");
            const store = transaction.objectStore("user");

            userData.userID = idGeneratorService.generateUserID(); 
            userData.blocked = false;
            userData.signupDate = new Date().toISOString();


            const request = store.add(userData);
            
            
                request.onsuccess = () => {
                    console.log("User data saved successfully:", userData.userID);
                    deferred.resolve(userData.userID);
                };

                request.onerror = (event) => {
                    console.error("Error saving user data:", event.target.error);
                    deferred.reject(event.target.error);
                };
         

            return deferred.promise;
        })
        
    };

    /**
     * 
     * @param {*} email 
     * @param {*} password 
     * @returns {Promise}
     * @description This function is used to login user
     */
    this.loginUser = function (email, password) {

        return dbService.openDB().then((db)=>{
            const deferred=$q.defer()
            const transaction = db.transaction("user", "readonly");
            const store = transaction.objectStore("user");
            const index = store.index("email");

            const request = index.get(email);

           
            request.onsuccess = () => {
                const user = request.result;
    
                    if (!user) {
                        console.log("User not found:", email);
                        deferred.resolve({ success: false, message: "User not found" });
                        return deferred.promise;
                    }
    
                    if (user.password !== password) {
                        console.log("Incorrect password for:", email);
                        deferred.resolve({ success: false, message: "Incorrect password" });
                        return deferred.promise;
                    }
    
                    if (user.blocked) {
                        console.log("Blocked user attempted login:", email);
                        return deferred.resolve({ success: false, message: "You are blocked" });
                        return deferred.promise;
                    }
    
                    console.log("Login successful for:", user.userID);
                    deferred.resolve({ success: true, user, message: "Login successful" });
                };
    
                request.onerror = (event) => {
                    console.error("Database error during login:", event.target.error);
                    deferred.reject("Database error");
                };

            return deferred.promise;
        })




       
    };
    
});
