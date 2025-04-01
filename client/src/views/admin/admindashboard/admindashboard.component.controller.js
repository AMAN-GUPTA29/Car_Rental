carRentalApp.controller(
  "AdminHomeController",
  function ($scope, $window,db) {
    /**
     * @type {Object}
     * @property {String} adminName
     * @description This object is used to store the admin name
     */
    let user = JSON.parse(sessionStorage.getItem("user"));
    $scope.adminName = user.name;

    $scope.startDate = new Date(new Date().setDate(new Date().getDate() - 6));
    $scope.endDate = new Date();
    
    $scope.init=function(){
        console.log("fdv")
        console.log($scope.startDate);
        console.log($scope.endDate);
        loadlisting();
    }
    
    $scope.torunagain=true;



    let activeInactiveChart = null;
    let biddingChart7day=null;
    let mostBookedCarChart=null;
    let mostbookedCarCategories=null;
    let avgBidperCategory=null;
    let carCountperCategory=null;

   /**
     * @function async.parallel
     * @description This function is used to load charts of cars asyncrounsly and calling the callback function to render the cards.
     * @param {Function} callback
     * @returns {Promise}
     */

   function loadlisting(){
    console.log("sxc")
    if (window.biddingChartInstance) {
        window.biddingChartInstance.destroy();
    }

    
    async.parallel(
        {
          renderBiddingChart: function (callback) {
            db.getBidsPerDay().then((result) => {
                callback(null, {
                  days: result.days,
                  bidAmounts: result.bidAmounts,
                });
                console.log("scdsdc")
              })
              .catch((err) => {
                console.error("Error fetching bids:", err);
                
              });
          },
          getActiveInactiveUser:function (callback) {
            db.getActiveInactiveUsers($scope.startDate,$scope.endDate).then((result) => {
                console.log(result)
                console.log("cds")
                callback(null, {
                    activeUsers: result.activeUsers,
                    inactiveUsers: result.inactiveUsers,
                });
                console.log("scdsdc")
              })
              .catch((err) => {
                console.error("Error fetching bids:", err);
                
              });
          },
          renderMostPopularCarsChart:function (callback) {
            db.getMostPopularCars($scope.startDate,$scope.endDate).then((result) => {
                callback(null, {
                    carNames: result.carNames,
                    bookingCounts: result.bookingCounts,
                });
                console.log("scdsdc")
              })
              .catch((err) => {
                console.error("Error fetching bids:", err);
                
              });
          },
          renderMostBookedCarCategoriesChart:function (callback) {
            db.getMostBookedCarCategories($scope.startDate,$scope.endDate).then((result) => {
                callback(null, {
                    categories: result.categories,
                    bookingCounts: result.bookingCounts,
                });
                console.log("scdsdc")
              })
              .catch((err) => {
                console.error("Error fetching bids:", err);
                
              });
          },
          renderAverageBidPerCategoryChart:function (callback) {
            db.getAverageBidPerCategory($scope.startDate,$scope.endDate).then((result) => {
                callback(null, {
                    categories: result.categories,
                    avgBids: result.avgBids,
                });
                console.log("scdsdc")
              })
              .catch((err) => {
                console.error("Error fetching bids:", err);
                
              });
          },
          renderCarsListedByCategoryChart:function (callback) {
            db.getCarsListedByCategory($scope.startDate,$scope.endDate).then((result) => {
                callback(null, {
                    categories: result.categories,
                    carCounts: result.carCounts,
                });
                console.log("scdsdc")
              })
              .catch((err) => {
                console.error("Error fetching bids:", err);
                
              });
          },

        },
        function (err, results) {
          if (err) {
            console.error("Async Parallel Error:", err);
          } else {
            renderBiddingChart(
              results.renderBiddingChart.days,
              results.renderBiddingChart.bidAmounts
            );
            renderActiveInactiveUsersChart(
                results.getActiveInactiveUser.activeUsers,
                results.getActiveInactiveUser.inactiveUsers
            )
            renderMostPopularCarsChart(
                results.renderMostPopularCarsChart.carNames,
                results.renderMostPopularCarsChart.bookingCounts
            )
            renderMostBookedCarCategoriesChart(
                results.renderMostBookedCarCategoriesChart.categories,
                results.renderMostBookedCarCategoriesChart.bookingCounts
            )
            renderAverageBidPerCategoryChart(
                results.renderAverageBidPerCategoryChart.categories,
                results.renderAverageBidPerCategoryChart.avgBids
            )
            renderCarsListedByCategoryChart(
                results.renderCarsListedByCategoryChart.categories,
                results.renderCarsListedByCategoryChart.carCounts
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
       * @param {*} bidAmounts
       * @description This function is used to render the bidding chart 
       */
function renderBiddingChart(days, bidAmounts) {

    
     
  
    
        const ctx = document.getElementById("biddingChart").getContext("2d");
        if (biddingChart7day) {
            biddingChart7day.destroy();
        }
        biddingChart7day=new Chart(ctx, {
            type: "bar",
            data: {
                labels: days,
                datasets: [{
                    label: "Revenue (BidAmount per Day)",
                    data: bidAmounts,
                    backgroundColor: "#DDA853",
                    borderColor: "#A6CDC6",
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true, 
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true }
                },
                plugins: {
                
                    title: {
                        display: true,
                        text: "Total Earnings Across All Users last 7 days",
                        font: { size: 18, weight: "bold" },
                        padding: { top: 10, bottom: 20 }
                    }
                }
            }
        });
        
    }
    

    /**
     * 
     * @param {*} activeUsers 
     * @param {*} inactiveUsers
     * @description This function is used to render the active and inactive users chart 
     */
function renderActiveInactiveUsersChart(activeUsers, inactiveUsers ) {
        
        // const { activeUsers, inactiveUsers } =  getActiveInactiveUsers();
        console.log("qq",activeUsers,inactiveUsers)
        const ctx = document.getElementById("activeInactiveUsersChart").getContext("2d");
        if (activeInactiveChart) {
            activeInactiveChart.destroy();
        }
        activeInactiveChart = new Chart(ctx, {
            type: "pie",
            data: {
                labels: ["Active Users", "Inactive Users"],
                datasets: [{
                    label: "User Engagement",
                    data: [activeUsers, inactiveUsers],
                    backgroundColor: ["#36A2EB", "#FF6384"], 
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: `Active vs. Inactive Users from ${$scope.startDate.toLocaleDateString('en-GB')} to ${$scope.endDate.toLocaleDateString('en-GB')}`,
                        font: { size: 18, weight: "bold" },
                        padding: { top: 10, bottom: 20 }
                    }
                }
            }
        });
    }
    

    /**
     * 
     * @param {*} carNames 
     * @param {*} bookingCounts
     * @description This function is used to render the most popular cars chart 
     */
    function renderMostPopularCarsChart(carNames, bookingCounts) {
        
        if (mostBookedCarChart) {
            mostBookedCarChart.destroy();
        }
    
        const ctx = document.getElementById("mostPopularCarsChart").getContext("2d");
        mostBookedCarChart=new Chart(ctx, {
            type: "bar",
            data: {
                labels: carNames, 
                datasets: [{
                    label: "Total Bookings",
                    data: bookingCounts,
                    backgroundColor: ["#DDA853", "#A6CDC6", "#16404D", "#FBF5DD", "#ff6384"],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: `Top 5 Most Popular Cars (Most Booked) from ${$scope.startDate.toLocaleDateString('en-GB')} to ${$scope.endDate.toLocaleDateString('en-GB')}`,
                        font: { size: 18, weight: "bold" },
                        padding: { top: 10, bottom: 20 }
                    }
                },
                scales: {
                    y: { beginAtZero: true,ticks: {
                        stepSize: 1, 
                        callback: function (value) {
                          return Number.isInteger(value) ? value : null; 
                        },
                      }, }
                }
            }
        });
    }
    

    /**
     * 
     * @param {*} categories 
     * @param {*} bookingCounts
     * @description This function is used to render the most booked car categories chart 
     */
function renderMostBookedCarCategoriesChart(categories, bookingCounts ) {
   
    if (mostbookedCarCategories) {
        mostbookedCarCategories.destroy();
    }


    const ctx = document.getElementById("mostBookedCarCategoriesChart").getContext("2d");
    mostbookedCarCategories=new Chart(ctx, {
        type: "bar",
        data: {
            labels: categories, 
            datasets: [{
                label: "Total Bookings",
                data: bookingCounts,
                backgroundColor:[
                    "#DDA853", 
                    "#A6CDC6",
                    "#16404D", 
                    "#FBF5DD", 
                    "#ff6384", 
                    "#8BC34A",
                    "#455A64"  
                ]
                ,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: `Top 5 Most Booked Car Categories from ${$scope.startDate.toLocaleDateString('en-GB')} to ${$scope.endDate.toLocaleDateString('en-GB')}`,
                    font: { size: 18, weight: "bold" },
                    padding: { top: 10, bottom: 20 }
                }
            },
            scales: {
                y: { beginAtZero: true,ticks: {
                    stepSize: 1, 
                    callback: function (value) {
                      return Number.isInteger(value) ? value : null; 
                    },
                  }, }
            }
        }
    });
}


    /**
     * 
     * @param {*} categories 
     * @param {*} avgBids 
     * @description This function is used to render the average bid per category chart
     */
function renderAverageBidPerCategoryChart(categories, avgBids) {
    
     
    if (avgBidperCategory) {
        avgBidperCategory.destroy();
    }

    const ctx = document.getElementById("averageBidPerCategoryChart").getContext("2d");
    avgBidperCategory=new Chart(ctx, {
        type: "bar",
        data: {
            labels: categories, 
            datasets: [{
                label: "Average Bid Amount ($)",
                data: avgBids,
                backgroundColor: ["#DDA853", "#A6CDC6", "#16404D", "#FBF5DD", "#ff6384", "#36a2eb", "#cc65fe"],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: `Average Bid Amount per Car Category from ${$scope.startDate.toLocaleDateString('en-GB')} to ${$scope.endDate.toLocaleDateString('en-GB')}`,
                    font: { size: 18, weight: "bold" },
                    padding: { top: 10, bottom: 20 }
                }
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

/**
 * 
 * @param {*} categories 
 * @param {*} carCounts 
 * @description This function is used to render the cars listed by category chart
 */
function renderCarsListedByCategoryChart(categories, carCounts) {

    if (carCountperCategory) {
        carCountperCategory.destroy();
    }

    const ctx = document.getElementById("carsListedByCategoryChart").getContext("2d");
    carCountperCategory=new Chart(ctx, {
        type: "bar",
        data: {
            labels: categories,
            datasets: [{
                label: "Total Cars Listed",
                data: carCounts,
                backgroundColor: ["#DDA853", "#A6CDC6", "#16404D", "#FBF50D", "#ff6384", "#36a2eb", "#cc65fe"],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: `Total Cars Listed by Category from ${$scope.startDate.toLocaleDateString('en-GB')} to ${$scope.endDate.toLocaleDateString('en-GB')}`,
                    font: { size: 18, weight: "bold" },
                    padding: { top: 10, bottom: 20 }
                }
            },
            scales: {
                y: { beginAtZero: true,ticks: {
                    stepSize: 1, 
                    callback: function (value) {
                      return Number.isInteger(value) ? value : null; 
                    },
                  }, }
            }
        }
    });
}


    
  }
);
