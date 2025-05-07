carRentalApp.controller("CarController", function ($scope, consumerdb, $state,$timeout,FilterService,ImageService, AuthService,CAR_CATEGORIES,CityService,CAR_COMPANIES,ListingFactory) {
 
    
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
  $scope.uniqueCategories = CAR_CATEGORIES;
  $scope.uniqueModal=CAR_COMPANIES;
  $scope.totalPages;
  $scope.currentPage;
  $scope.totalCars;

  $scope.recommendedCars = [];

  $scope.filters = {
    city: "",
    minPrice: "",
    maxPrice: "",
    category: "",
    minMileage: "",
    model: "",
    transmission: "all",
  };









  /**
   * @description This function is used to initialize the controller
   */
  $scope.init = function () {
    getallcars();
    getCities();
    getrecommendedCars();
  };


  // $scope.currpage=1;


  function getCities()
  {
      CityService.getCities("India")
      .then(function (cities) {
          $scope.uniqueCities = cities;
      })
      .catch(function (error) {
          console.error(error);
      });
  }
 
  /**
   * @description This function is used to get all cars listed on palatform
   */
   function getallcars(){
    console.log($scope.filters);
    if($scope.filters.city=="all")
    {
      $scope.filters.city="";
    }
    if($scope.filters.model=="all")
      {
        $scope.filters.model="";
      }
    const params = {
      page: $scope.currentPage,
      ...$scope.filters
    };
    // ListingFactory.fetchAll(user.id)
    console.log(params)
    ListingFactory.getAllCarListing(params).then((response) => {
      console.log("res",response)
      let cars=response.listings;
     $scope.totalCars=response.totalListings;
      // cars= cars.filter(car => car.isDeleted === false);
      console.log(cars)
      $scope.cars = cars.map((car) => ({
        ...car,
        currentImageIndex: 0,   
      }));

      console.log($scope.cars);

      $scope.filteredCars = [...$scope.cars];
      console.log("caaa",$scope.filteredCars)
      $scope.totalPages = response.totalPages;
      $scope.currentPage = response.page;

      

      
    }).catch((error) => {
      console.error("Error loading car listings:", error);
    });
  }

  function getrecommendedCars(){
    ListingFactory.getRecommendedCarListing().then((response) => {
      console.log("res",response)
      let cars=response.recommendations;
      // cars= cars.filter(car => car.isDeleted === false);
      console.log(cars)
      $scope.recommendedCars = cars.map((car) => ({
        ...car.latestBooking,
        currentImageIndex: 0, 
        count:car.count,  
      }));

      console.log("plpl",$scope.recommendedCars);

      
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
    console.log("listingID",listingID)
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

    getallcars();
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


  $scope.loadmore=function()
  {
    // $scope.currpage=$scope.currpage+1;
    getallcars();
  }
});
