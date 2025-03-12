carRentalApp.controller("CarController", function ($scope, consumerdb, $state,$timeout,FilterService,ImageService, AuthService) {
 
    
  $scope.user = JSON.parse(sessionStorage.getItem("user")); 

  /**
   * @type {Boolean} sidebarOpen
   * @type {Array} cars
   * @type {Array} filteredCars
   * @type {Array} uniqueCities
   * @type {Array} uniqueCategories
   * @type {Object} filters
   */
  $scope.sidebarOpen = false;
  $scope.cars = [];
  $scope.filteredCars = [];
  $scope.uniqueCities = [];
  $scope.uniqueCategories = [];

  $scope.filters = {
    city: "all",
    minPrice: "",
    maxPrice: "",
    category: "all",
    minMileage: "",
    model: "",
    transmission: "all",
  };









  /**
   * @description This function is used to initialize the controller
   */
  $scope.init = function () {
    getallcars();
  };
 
  /**
   * @description This function is used to get all cars listed on palatform
   */
   function getallcars(){
    consumerdb.getAllCarListings().then((cars) => {
      cars= cars.filter(car => car.cardata.isDeleted === false);
      $scope.cars = cars.map((car) => ({
        ...car,
        currentImageIndex: 0,   
      }));

      console.log($scope.cars);

      $scope.filteredCars = [...$scope.cars];

      $scope.uniqueCities = $scope.filteredCars
        .filter(
          (value, index, self) =>
            index ===
            self.findIndex((t) => t.cardata.carcity === value.cardata.carcity)
        )
        .map((car) => car.cardata.carcity);

      $scope.uniqueCategories = $scope.filteredCars
        .filter(
          (value, index, self) =>
            index ===
            self.findIndex(
              (t) => t.cardata.carCategory === value.cardata.carCategory
            )
        )
        .map((car) => car.cardata.carCategory);

      

      
    }).catch((error) => {
      console.error("Error loading car listings:", error);
    });
  }
  

  /**
   * @description This function is used to
   * toggle the sidebar
   */
  $scope.toggleSidebar = function () {
    $scope.sidebarOpen = !$scope.sidebarOpen;
  };
  
  /**
   * @description This function is used to
   * logout the user
   */
  $scope.logout = function () {
    AuthService.logout();
  };
 
  /**
   * 
   * @param {*} listingID 
   * @returns 
   * @description This function is used to navigate to car details page
   */
  $scope.goToCarDetails = function (listingID) {
    if (!listingID) {
      alert("Invalid car listing.");
      return;
    }
    $state.go("cardetails", { listingID: listingID });
  };
 

  /**
   * @description This function is used to apply filters
   */
  $scope.applyFilters= function applyFilters() {
    $scope.filteredCars =  FilterService.applyFilters($scope.cars, $scope.filters);  
}

  /**
   * 
   * @param {*} car 
   * @description This function is used to navigate to next image
   */
  $scope.nextImage = function (car) {
    ImageService.nextImage(car);
  };

/**
 * 
 * @param {*} car
 * @description This function is used to navigate to previous 
 */
  $scope.prevImage = function (car) {
    ImageService.prevImage(car);
  };
});
