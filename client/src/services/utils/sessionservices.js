carRentalApp.service("SessionService", function() {
    this.getUser = function() {
        return JSON.parse(sessionStorage.getItem("user"));
    };

    this.setUser = function(user) {
        sessionStorage.setItem("user", JSON.stringify(user));
    };

    this.clearUser = function() {
        sessionStorage.removeItem("user");
    };
});
