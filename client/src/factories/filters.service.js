/**
 * @description This service is used to apply filters
 */
carRentalApp.factory("FilterService", function () {
    return {
      applyFilters: function (cars, filters) {
        if (!cars || cars.length === 0) return []; 
  
        return cars.filter((car) => {
          return (
            (filters.city === "all" || car.cardata.carcity === filters.city) &&
            (filters.category === "all" || car.cardata.carCategory === filters.category) &&
            (filters.transmission === "all" || car.cardata.carTransmission === filters.transmission) &&
            (filters.minPrice === "" || filters.minPrice === null || isNaN(filters.minPrice) || car.cardata.basePrice >= parseFloat(filters.minPrice)) &&
            (filters.maxPrice === "" || filters.maxPrice === null || isNaN(filters.maxPrice) || car.cardata.basePrice <= parseFloat(filters.maxPrice)) &&
            (filters.minMileage === "" || filters.minMileage === null || isNaN(filters.minMileage) || car.cardata.carMileage >= parseInt(filters.minMileage)) &&
            (filters.model === "" || filters.model === null || filters.model.trim() === "" || car.cardata.carModel.toLowerCase().includes(filters.model.toLowerCase()))
          );
        });
      },

      getQueryParams: function(filters) {
        const params = {};
        
        if (filters.category) params.category = filters.category;
        if (filters.transmission) params.transmission = filters.transmission;
        if (filters.startDate) params.startDate = filters.startDate;
        if (filters.endDate) params.endDate = filters.endDate;
        if (filters.minBidPrice) params.minBidPrice = filters.minBidPrice;
        
        return params;
      },

      applyFiltersApproved: function (scope) {
        const filterParams = this.getQueryParams(scope.filter);
        scope.currentPage = 1;
        scope.loadApprovedBids(filterParams);
      }
    };
  });
  