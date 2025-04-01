carRentalApp.controller(
  "OwnerHomeController",
  function ($scope, $state, $element, db) {
    
    $scope.user = JSON.parse(sessionStorage.getItem("user"));

    /**
     * @type {Chart}
     * @description Chart instance for the bidding chart
     */
    let biddingChartInstance = null;
    let renderWeeklyBid=null;
    let ownercomperisonchart=null;
    let topearningcarchart=null;
    let topmodalchart=null;
    let topcarcatagories=null;
    let weekearingcomperison=null;



    $scope.startDate = new Date(new Date().setDate(new Date().getDate() - 6));
    $scope.endDate = new Date();

    $scope.init=function(){
      console.log("fdv")
      console.log($scope.startDate);
      console.log($scope.endDate);
      loadlisting();
  }
  


    /**
     * @function async.parallel
     * @description This function is used to load charts of cars asyncrounsly and calling the callback function to render the cards.
     * @param {Function} callback
     * @returns {Promise}
     */

    function loadlisting(){
    async.parallel(
      {
        biddingChart: function (callback) {
          db.getBidsPerDayOwner()
            .then((result) => {
              callback(null, {
                days: result.days,
                bidCounts: result.bidCounts,
              });
            })
            
            .catch((err) => {
              console.error("Error fetching bids:", err);
              // callback(err);
            });
        },

        renderWeeklyBiddingChart: function (callback) {
          db.getBidsPerDayOfWeek($scope.startDate,$scope.endDate)
            .then((result) => {
              callback(null, {
                labels: result.labels,
                bidAmounts: result.bidAmounts,
              });
            })
            .catch((err) => {
              console.error("Error fetching bids:", err);
              // callback(err);
            });
        },

        renderUserComparisonChart: function (callback) {
          db.getUserAndAvgBids($scope.startDate,$scope.endDate)
            .then((result) => {
              callback(null, {
                days: result.days,
                userBidAmounts: result.userBidAmounts,
                avgBidAmounts: result.avgBidAmounts,
              });
            })
            .catch((err) => {
              console.error("Error fetching bids:", err);
              // callback(err);
            });
        },

       


        renderUserEarningsChart:function(callback){
          db.getListingWiseEarnings($scope.startDate,$scope.endDate)
          .then((result)=>{
            callback(null,{
              listingNames:result.listingNames,
              earnings:result.earnings,
            });
          })
          .catch((err)=>{
            console.error("Error fetching earnings:",err);
          })
        },
        renderPopularCarModelsChart:function(callback){
          db.getTopCarModels($scope.startDate,$scope.endDate)
          .then((result)=>{
            callback(null,{
              carModels:result.carModels,
              ownerBidCounts:result.ownerBidCounts,
              avgPlatformBids:result.avgPlatformBids
            });
          })
          .catch((err)=>{
            console.error("Error fetching earnings:",err);
          })
        },
        

        renderCategoryBookingsChart:function(callback){
          db.getCategoryBookingCounts($scope.startDate,$scope.endDate)
          .then((result)=>{
            callback(null,{
              categories:result.categories,
              bookings:result.bookings,
            });
          })
          .catch((err)=>{
            console.error("Error fetching earnings:",err);
          })
        },

        earningsComparisonChart:function(callback){
          db.getOwnerEarnings()
          .then((result)=>{
            callback(null,{
              earningsData:result,
            });
          })
          .catch((err)=>{
            console.error("Error fetching earnings:",err);
          })
        },
      },
      function (err, results) {
        if (err) {
          console.error("Async Parallel Error:", err);
        } else {
          renderBiddingChart(
            results.biddingChart.days,
            results.biddingChart.bidCounts
          );
          renderWeeklyBiddingChart(
            results.renderWeeklyBiddingChart.labels,
            results.renderWeeklyBiddingChart.bidAmounts
          );
          renderUserComparisonChart(
            results.renderUserComparisonChart.days,
            results.renderUserComparisonChart.userBidAmounts,
            results.renderUserComparisonChart.avgBidAmounts
          );
          renderUserEarningsChart(
            results.renderUserEarningsChart.listingNames,
            results.renderUserEarningsChart.earnings
          );
          renderPopularCarModelsChart(
            results.renderPopularCarModelsChart.carModels,
            results.renderPopularCarModelsChart.ownerBidCounts,
            results.renderPopularCarModelsChart.avgPlatformBids

          );
          renderCategoryBookingsChart(
            results.renderCategoryBookingsChart.categories,
            results.renderCategoryBookingsChart.bookings
          )
          earningsComparisonChart(
            results.earningsComparisonChart.earningsData
          )
        }
      }
    );
  }

    $scope.changedate = function() {
      // Your logic here
      console.log('Start Date:', $scope.startDate);
      console.log('End Date:', $scope.endDate);
      loadlisting();  
  };


    /**
     * 
     * @param {*} days 
     * @param {*} bidCounts 
     * @description This function is used to render the bidding chart
     */
    function renderBiddingChart(days, bidCounts) {
      console.log(days, bidCounts);
      const ctx = document.getElementById("biddingChart").getContext("2d");

      if (biddingChartInstance) {
        biddingChartInstance.destroy();
      }

      biddingChartInstance = new Chart(ctx, {
        type: "bar",
        data: {
          labels: days,
          datasets: [
            {
              label: "Bids Per Day",
              data: bidCounts,
              backgroundColor: "#DDA853",
              borderColor: "#A6CDC6",
              borderWidth: 1,
            },
          ],
        },
        options: {
          plugins: {
            title: {
              display: true,
              text: "Total Bids last 7 days",
              font: {
                size: 18,
                weight: "bold",
              },
              padding: {
                top: 10,
                bottom: 20,
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1,
                callback: function (value) {
                  return Number.isInteger(value) ? value : null;
                },
              },
            },
          },
        },
      });
    } 
    
   
    /**
     * 
     * @param {*} labels 
     * @param {*} bidAmounts 
     * @description This function is used to render the weekly bidding chart
     */
    function renderWeeklyBiddingChart(labels, bidAmounts) {

      if (renderWeeklyBid) {
        renderWeeklyBid.destroy();
      }


      const ctx = document
        .getElementById("weeklyBiddingChart")
        .getContext("2d");
      renderWeeklyBid= new Chart(ctx, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Total Revenue (BidAmount per Day)",
              data: bidAmounts,
              backgroundColor: "#DDA853",
              borderColor: "#A6CDC6",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: `Total revenue day wise from ${$scope.startDate.toLocaleDateString('en-GB')} to ${$scope.endDate.toLocaleDateString('en-GB')}`,
              font: {
                size: 18,
                weight: "bold",
              },
              padding: {
                top: 10,
                bottom: 20,
              },
            },
          },
          scales: {
            y: { beginAtZero: true },
          },
        },
      });
    }



    /**
     * 
     * @param {*} days 
     * @param {*} userBidAmounts 
     * @param {*} avgBidAmounts 
     * @description This function is used to render the user comparison chart user to avg bid amounts
     */
    function renderUserComparisonChart(days, userBidAmounts, avgBidAmounts) {

      if (ownercomperisonchart) {
        ownercomperisonchart.destroy();
      }


      const ctx = document
        .getElementById("userComparisonChart")
        .getContext("2d");
      ownercomperisonchart =new Chart(ctx, {
        type: "line",
        data: {
          labels: days,
          datasets: [
            {
              label: "Your Bids",
              data: userBidAmounts,
              borderColor: "#DDA853",
              backgroundColor: "rgba(221, 168, 83, 0.2)",
              borderWidth: 2,
              fill: true,
              tension: 0.4,
            },
            {
              label: "Average Bids (All Users)",
              data: avgBidAmounts,
              borderColor: "#A6CDC6",
              backgroundColor: "rgba(154, 33, 49, 0.2)",
              borderWidth: 2,
              fill: true,
              tension: 0.4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: `Your Earnings vs. Car Owners' Average Earnings  from ${$scope.startDate.toLocaleDateString('en-GB')} to ${$scope.endDate.toLocaleDateString('en-GB')}`,
              font: {
                size: 18,
                weight: "bold",
              },
              padding: {
                top: 10,
                bottom: 20,
              },
            },
          },
          scales: {
            y: { beginAtZero: true },
          },
        },
      });
    }


   /**
    * 
    * @param {*} listingNames 
    * @param {*} earnings 
    * @description This function is used to render the user earnings chart
    */
 function renderUserEarningsChart(listingNames, earnings) {

  if (topearningcarchart) {
    topearningcarchart.destroy();
  }


  const ctx = document.getElementById("userEarningsChart").getContext("2d");
  topearningcarchart=new Chart(ctx, {
    type: "pie",
    data: {
      labels: listingNames, 
      datasets: [
        {
          label: "Earnings Per Listing",
          data: earnings,
          backgroundColor: [
            "#DDA853",
            "#A6CDC6",
            "#16404D",
            "#FBF5DD",
            "#ff6384",
            "#36a2eb",
            "#cc65fe",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: `Top Most Earing Cars from ${$scope.startDate.toLocaleDateString('en-GB')} to ${$scope.endDate.toLocaleDateString('en-GB')} `,
          font: {
            size: 18,
            weight: "bold",
          },
          padding: {
            top: 10,
            bottom: 20,
          },
        },
      },
    },
  });
}


  /**
   * 
   * @param {*} carModels 
   * @param {*} ownerBidCounts 
   * @param {*} avgPlatformBids 
   * @description This function is used to render the popular car models chart
   */
function renderPopularCarModelsChart(carModels, ownerBidCounts, avgPlatformBids) {
  
  if (topmodalchart) {
    topmodalchart.destroy();
  }
  const colors = ["#DDA853", "#A6CDF6", "#16404D", "#FBF5DD", "#ff6384"];

  const ctx = document.getElementById("popularCarModelsChart").getContext("2d");
  topmodalchart=new Chart(ctx, {
    type: "bar",
    data: {
      labels: carModels,
      datasets: [
        {
          label: "Your Bids",
          data: ownerBidCounts,
          backgroundColor: colors, 
          borderWidth: 1,
        },
        {
          label: "Platform Avg Bids",
          data: avgPlatformBids,
          backgroundColor: colors.map((color) => color + "B4"), 
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: `Top 5 Most Popular Car Models (Your Bids vs. Platform Average) from ${$scope.startDate.toLocaleDateString('en-GB')} to ${$scope.endDate.toLocaleDateString('en-GB')}`,
          font: {
            size: 18,
            weight: "bold",
          },
          padding: {
            top: 10,
            bottom: 20,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1, 
            callback: function (value) {
              return Number.isInteger(value) ? value : null;
            },
          },
        },
      },
    },
  });
}


/**
 * 
 * @param {*} categories 
 * @param {*} bookings 
 * @description This function is used to render the category bookings chart
 */
 function renderCategoryBookingsChart(categories, bookings) {

  if (topcarcatagories) {
    topcarcatagories.destroy();
  }

  const ctx = document.getElementById("categoryBookingsChart").getContext("2d");
  topcarcatagories=new Chart(ctx, {
    type: "bar",
    data: {
      labels: categories, 
      datasets: [
        {
          label: "Total Bookings",
          data: bookings,
          backgroundColor: [
            "#DDA853",
            "#A6CDC6",
            "#16404D",
            "#FBF5DD",
            "#ff6384",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: `Most Booked Car Categories from ${$scope.startDate.toLocaleDateString('en-GB')} to ${$scope.endDate.toLocaleDateString('en-GB')}`,
          font: { size: 18, weight: "bold" },
          padding: { top: 10, bottom: 20 },
        },
      },
      scales: {
        y: { beginAtZero: true,ticks: {
            stepSize: 1, 
            callback: function (value) {
              return Number.isInteger(value) ? value : null;
            },
          }, },
      },
    },
  });
}

/**
 * 
 * @param {*} earningsData
 * @description This function is used to render the earnings comparison chart 
 */
function earningsComparisonChart(earningsData){
  console.log("dcsd",earningsData)
  const { days, earnings } = earningsData;


  const lastWeek = Array(7).fill(0);
  const thisWeek = Array(7).fill(0);
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  

  const today = new Date(days[days.length - 1]);
  const lastWeekStart = new Date(today);
  lastWeekStart.setDate(today.getDate() - 13);
  lastWeekStart.setHours(0, 0, 0, 0);
  
  const thisWeekStart = new Date(today);
thisWeekStart.setDate(today.getDate() - 6); // 7 days ago
thisWeekStart.setHours(0, 0, 0, 0);
 
  
days.forEach((dateStr, index) => {
  const earningsAmount = earnings[index];
  const bidDate = new Date(dateStr);
  
  // Adjust day index for Mon-Sun (0-6)
  let dayIndex = bidDate.getDay() - 1;
  if (dayIndex === -1) dayIndex = 6; // Handle Sunday
  
  // Determine which week to populate
  if (bidDate >= lastWeekStart && bidDate < thisWeekStart) {
      lastWeek[dayIndex] += earningsAmount;
  } else if (bidDate >= thisWeekStart && bidDate <= today) {
      thisWeek[dayIndex] += earningsAmount;
  }
});
  
  
   
 
  const ctx = document.getElementById("earningsComparisonChart").getContext("2d");


  console.log(lastWeek)
  console.log(thisWeek)


  if (weekearingcomperison) {
    weekearingcomperison.destroy();
  }

  weekearingcomperison=new Chart(ctx, {
    type: "line",
    data: {
        labels: daysOfWeek,
        datasets: [
            {
                label: "Last Week",
                data: lastWeek,
                borderColor: "#DDA853",
                backgroundColor: "rgba(221, 168, 83, 0.2)",
                borderWidth: 2,
                fill: true
            },
            {
                label: "This Week",
                data: thisWeek,
                borderColor: "#16404D",
                backgroundColor: "rgba(22, 64, 77, 0.2)",
                borderWidth: 2,
                fill: true
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                title: {
                    display: true,
                    text: "Earnings ($)"
                },
                beginAtZero: true
            }
        },
        plugins: {
            title: {
                display: true,
                text: "Earnings Comparison: Last Week vs. This Week",
                font: { size: 18, weight: "bold" }
            }
        }
    }
});
}


  }
);
