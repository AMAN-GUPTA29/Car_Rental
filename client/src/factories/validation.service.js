/**
 * @description This service is used to validate user inputs
 */
carRentalApp.factory("validationService", function (DateService,toastifyService) {
    return {
        validateEmail: function (email) {
            let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email) ? "" : "Invalid email format";
        },

        validatePhone: function (phone) {
            let phoneRegex = /^\d{10}$/;
            return phoneRegex.test(phone) ? "" : "Phone must be 10 digits";
        },

        validatePassword: function (password) {
            if (!password) return;
            if (password.length < 8) return "Password must be at least 8 characters";
            if (!/[A-Z]/.test(password)) return "Password must contain at least 1 uppercase letter";
            if (!/\d/.test(password)) return "Password must contain at least 1 number";
            return "";
        },

        validateYear: function (year) {
            let currentYear = new Date().getFullYear();
            return (year < 1900 || year > currentYear) ? `Year must be between 1900 and ${currentYear}` : null;
        },
        validateMileage: function (mileage) {
            if (mileage < 0) {
                return "Mileage cannot be less than 0";
            }
            if (mileage > 60) {
                return "Mileage cannot be more than 60 km/l";
            }
            return ""; 
        },
        validatePrice: function (price) {
            if (price < 0) {
                return "Price cannot be less than 0";
            }
            return ""; 
        },
       

        validateBid: function (bidplace, car) {
            console.log("sdd",bidplace,car);
            if (!bidplace.startDate || !bidplace.endDate || !bidplace.bidAmount) {
                toastifyService.error("Fill all the required field");

              return false;
            }
      
            if (new Date(bidplace.endDate) < new Date(bidplace.startDate)) {
                toastifyService.error("End date must after be start date");
              return false;
            }
      
            let minPrice = car.carData.basePrice * DateService.calculateDateDifference(bidplace.startDate, bidplace.endDate);
      
            if (bidplace.tripType === "outstation" && car.cardata.outstationPrice) {
              minPrice = car.carData.outstationPrice * DateService.calculateDateDifference(bidplace.startDate, bidplace.endDate);
              
            }
      
            if (bidplace.bidAmount < minPrice) {
                toastifyService.error(`Your bid amount should be at least $${minPrice}`);
            //   alert();
              return false;
            }
      
            return true;
          },
    };
});
