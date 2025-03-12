/**
 * AuthFactory
 * @namespace Factories
 * @description used for route protection
 */
carRentalApp.factory("AuthFactory", function ($q, $state,SessionService) {
    return {
        // route protection for admin
        checkAdmin: function () {
            const deferred = $q.defer();
            const user = SessionService.getUser();

            if (!user) {
                alert("You must be logged in to access this page.");
                $state.go("login"); 
                deferred.reject("Not Authenticated");
            } else if (user.role !== "admin") {
                alert("Access denied. Admins only.");
                $state.go("login"); 
                deferred.reject("Not Authorized");
            } else {
                deferred.resolve(); 
            }

            return deferred.promise;
        },
        // route protection for owner
        checkOwner: function () {
            const deferred = $q.defer();
            const user = SessionService.getUser();

            if (!user) {
                alert("You must be logged in to access this page.");
                $state.go("login"); 
                deferred.reject("Not Authenticated");
            } else if (user.role !== "owner") {
                alert("Access denied. owners only.");
                $state.go("login"); 
                deferred.reject("Not Authorized");
            } else {
                deferred.resolve(); 
            }

            return deferred.promise;
        },
        // route protection for user
        checkUser: function () {
            const deferred = $q.defer();
            const user = SessionService.getUser();

            if (!user) {
                alert("You must be logged in to access this page.");
                $state.go("login"); 
                deferred.reject("Not Authenticated");
            } else if (user.role !== "user") {
                alert("Access denied. user only.");
                $state.go("login");
                deferred.reject("Not Authorized");
            } else {
                deferred.resolve(); 
            }

            return deferred.promise;
        },
        checkProfile: function () {
            const deferred = $q.defer();
            const user = SessionService.getUser();

            if (!user) {
                alert("You must be logged in to access this page.");
                $state.go("login"); 
                deferred.reject("Not Authenticated");
            } else {
                deferred.resolve(); 
            }

            return deferred.promise;
        },
    };
});
