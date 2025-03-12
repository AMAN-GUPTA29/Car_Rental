/**
 * File service
 * @description for conversion to base 64
 */
carRentalApp.factory("FileService", function ($q) {
    return {
        convertToBase64: function (file) {
            let deferred = $q.defer();
            let reader = new FileReader();

            reader.onloadend = function () {
                deferred.resolve(reader.result);
            };

            reader.onerror = function (error) {
                deferred.reject(error);
            };

            reader.readAsDataURL(file);

            return deferred.promise;
        }
    };
});
