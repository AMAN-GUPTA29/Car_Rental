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

      applyFiltersApproved: function (scope) {
        let { category, transmission, startDate, endDate, bidPrice } = scope.filter;

        scope.filteredBids = scope.approvedBids.filter((bid) => {
            return (
                (!category || bid.cardata.carCategory === category) &&
                (!transmission || bid.cardata.carTransmission === transmission) &&
                (!startDate || new Date(bid.startDate) >= new Date(startDate)) &&
                (!endDate || new Date(bid.endDate) <= new Date(endDate)) &&
                (!bidPrice || parseFloat(bid.BidAmount) >= parseFloat(bidPrice))
            );
        });

        scope.currentPage = 1;
        scope.renderTable();
    }
    };
  });
  