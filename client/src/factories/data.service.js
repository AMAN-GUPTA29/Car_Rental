/**
 * @description This service is used to calculate the date difference and get status color
 */
carRentalApp.factory("DateService", function () {
    return {
      calculateDateDifference: function (startDate, endDate) {
        let start = new Date(startDate);
        let end = new Date(endDate);
        return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
      },
      getStatusColor: function (status) {
        return status === "rejected" ? "red" :
               status === "accepted" ? "green" : "black";
    }
    };
  });
  