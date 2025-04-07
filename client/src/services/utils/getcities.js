carRentalApp.service("CityService", function ($http, $q) {
    this.getCities = function (country) {
        let deferred = $q.defer();
        console.log("cs")
        $http.get(`https://countriesnow.space/api/v0.1/countries/cities/q?country=${country}`)
            .then(response => {
                if (response.data.data) {
                    deferred.resolve(response.data.data);
                } else {
                    deferred.reject("No cities found.");
                }
            })
            .catch(error => {
                deferred.reject("Error fetching cities: " + error);
            });

        return deferred.promise;
    };
});
