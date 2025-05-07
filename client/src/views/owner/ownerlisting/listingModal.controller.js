carRentalApp.controller('ListingModalController', function ($scope, $uibModalInstance, carModels, carCategories, transmissionTypes, cities) {
    $scope.carModels = carModels;
    $scope.carCategories = carCategories;
    $scope.transmissionTypes = transmissionTypes;
    $scope.cities = cities;
    
    $scope.newCar = {
        carMake: "",
        carModel: "",
        carYear: "",
        carPrice: "",
        carOutstationPrice: "",
        carColor: "",
        carMileage: "",
        carTransmission: "",
        carCategory: "",
        carDescription: "",
        carAddress: "",
        carcity: "",
        images: []
    };

    $scope.registerListing = function() {
        if ($scope.newCar) {
            $uibModalInstance.close($scope.newCar);
        }
    };

    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.previewImages = function(event) {
        let files = event.target.files;
        $scope.nimages = files;
        $scope.newCar.images = [];
        
        for (let i = 0; i < files.length; i++) {
            let reader = new FileReader();
            reader.onload = function(e) {
                $scope.$apply(function() {
                    $scope.newCar.images.push(e.target.result);
                });
            };
            reader.readAsDataURL(files[i]);
        }
    };
});