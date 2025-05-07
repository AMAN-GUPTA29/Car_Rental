carRentalApp.config([
    "$stateProvider",
    "$urlRouterProvider",
    "$ocLazyLoadProvider",
    function ($stateProvider, $urlRouterProvider, $ocLazyLoadProvider) {

      ////
      $ocLazyLoadProvider.config({
        debug: false,
        events: true,
      });

     
      $urlRouterProvider.otherwise("/login");

     
      $stateProvider.state("login", {
        url: "/login",
        templateUrl: "/src/views/auth/login/login.component.html",
        controller: "LoginController",
        resolve: {
            loadCSS: [
              function () {
                var link = document.createElement("link");
                link.rel = "stylesheet";
                link.type = "text/css";
                link.href = "/src/views/auth/login/login.component.css";
                document.head.appendChild(link);
                return true;
            },
            ],
        },
    })
      .state("signup", {
          url: "/signup",
          templateUrl: "/src/views/auth/signup/signup.component.html",
          controller: "SignupController",
          resolve: {
            loadCSS: [
              function () {
                var link = document.createElement("link");
                link.rel = "stylesheet";
                link.type = "text/css";
                link.href = "/src/views/auth/signup/auth.component.css";
                document.head.appendChild(link);
                return true;
            },
            ],
          },
        })
        .state("ownerhome", {
          url: "/owner/home",
          templateUrl: "/src/views/owner/ownerhome/ownerhome.component.html",
          controller: "OwnerHomeController",
          resolve:{
            auth: ["AuthFactory", function (AuthFactory) {
              return AuthFactory.checkOwner();
          }],
            loadCSS: [
              function () {
                var link = document.createElement("link");
                link.rel = "stylesheet";
                link.type = "text/css";
                link.href = "/src/views/owner/ownerhome/ownerhome.controller.css";
                document.head.appendChild(link);
                return true;
            },
             
            ],
          }
        })
        .state("ownerlisting", {
          url: "/owner/listing",
          templateUrl: "/src/views/owner/ownerlisting/ownerlisting.component.html",
          controller: "CarListingController",
          resolve:{
            auth: ["AuthFactory", function (AuthFactory) {
              return AuthFactory.checkOwner();
          }],
            loadCSS: [
              function () {
                var link = document.createElement("link");
                link.rel = "stylesheet";
                link.type = "text/css";
                link.href = "/src/views/owner/ownerlisting/ownerlisting.component.css";
                document.head.appendChild(link);
                return true;
            },
            ],
          }
        })
        .state("home", {
          url: "/consumer/home",
          templateUrl: "/src/views/consumer/home/home.component.html",
          controller: "CarController",
          resolve:{
            auth: ["AuthFactory", function (AuthFactory) {
              return AuthFactory.checkUser();
          }],
            loadCSS: [
              function () {
                var link = document.createElement("link");
                link.rel = "stylesheet";
                link.type = "text/css";
                link.href = "/src/views/consumer/home/consumer.component.css";
                document.head.appendChild(link);
                return true;
            },
            ],
          }
        })
        .state("cardetails", {
          url: "/consumer/cardetails/:listingID",
          templateUrl: "/src/views/consumer/carDetails/carDetails.component.html",
          controller: "BookingController",
          resolve: {
            auth: ["AuthFactory", function (AuthFactory) {
              return AuthFactory.checkUser();
          }],
              loadCSS: [
                function () {
                  var link = document.createElement("link");
                  link.rel = "stylesheet";
                  link.type = "text/css";
                  link.href = "/src/views/consumer/carDetails/carDetails.component.css";
                  document.head.appendChild(link);
                  return true;
              },
              ],
          },
      })
      .state("carownerlisting",{
        url: "/owner/ownercar/:listingID",
        templateUrl: "/src/views/owner/listingDetails/listingdetails.component.html",
        controller: "OwnerCarController",
        resolve:{
          auth: ["AuthFactory", function (AuthFactory) {
            return AuthFactory.checkOwner();
        }],
          loadCSS: [
            function () {
              var link = document.createElement("link");
              link.rel = "stylesheet";
              link.type = "text/css";
              link.href = "/src/views/owner/listingDetails/listingdetails.component.css";
              document.head.appendChild(link);
              return true;
          },
            
          ],
        }
      })
      .state("carownerchat",{
        url: "/owner/ownerchat",
        templateUrl: "/src/views/owner/conversation/conversation.component.html",
        controller: "ChatControllerOwner",
        resolve:{
          auth: ["AuthFactory", function (AuthFactory) {
            return AuthFactory.checkOwner();
        }],
          loadCSS: [
            function () {
              var link = document.createElement("link");
              link.rel = "stylesheet";
              link.type = "text/css";
              link.href = "/src/views/owner/conversation/conversation.component.css";
              document.head.appendChild(link);
              return true;
          },
          ],
        }
      })
      .state("carconsumerchat",{
        url: "/consumer/consumerchat",
        templateUrl: "/src/views/consumer/conversation/conversation.component.html",
        controller: "ChatControllerConsumer",
        resolve:{
          auth: ["AuthFactory", function (AuthFactory) {
            return AuthFactory.checkUser();
        }],
          loadCSS: [
            function () {
              var link = document.createElement("link");
              link.rel = "stylesheet";
              link.type = "text/css";
              link.href = "/src/views/consumer/conversation/conversation.component.css";
              document.head.appendChild(link);
              return true;
          },
          ],
        }
      })
      .state("approvedBids",{
        url: "/owner/approvedBids",
        templateUrl: "/src/views/owner/decidedBids/decidedBids.component.html",
        controller: "ApprovedBidsOwnerController",
        resolve:{
          auth: ["AuthFactory", function (AuthFactory) {
            return AuthFactory.checkOwner();
        }],
          loadCSS: [
            function () {
              var link = document.createElement("link");
              link.rel = "stylesheet";
              link.type = "text/css";
              link.href = "/src/views/owner/decidedBids/decidedBids.component.css";
              document.head.appendChild(link);
              return true;
          },
          ],
        }
      })
      .state("startJourney",{
        url: "/owner/startJourney",
        templateUrl: "/src/views/owner/startJourney/startJourney.component.html",
        controller: "StartJourneyController",
        resolve:{
          auth: ["AuthFactory", function (AuthFactory) {
            return AuthFactory.checkOwner();
        }],
          loadCSS: [
            function () {
              var link = document.createElement("link");
              link.rel = "stylesheet";
              link.type = "text/css";
              link.href = "/src/views/owner/startJourney/startJourney.component.css";
              document.head.appendChild(link);
              return true;
          },
          ],
        }
      })
      .state("endJourney",{
        url: "/owner/endJourney",
        templateUrl: "/src/views/owner/endJourney/endJourney.component.html",
        controller: "EndJourneyController",
        resolve:{
          auth: ["AuthFactory", function (AuthFactory) {
            return AuthFactory.checkOwner();
        }],
          loadCSS: [
            function () {
              var link = document.createElement("link");
              link.rel = "stylesheet";
              link.type = "text/css";
              link.href = "/src/views/owner/endJourney/endJourney.component.css";
              document.head.appendChild(link);
              return true;
          },
          ],
        }
      })
      .state("invoice",{
        url: "/consumer/invoice",
        templateUrl: "/src/views/consumer/invoice/invoice.component.html",
        controller: "InvoiceController",
        resolve:{
          auth: ["AuthFactory", function (AuthFactory) {
            return AuthFactory.checkUser();
        }],
          loadCSS: [
            function () {
              var link = document.createElement("link");
              link.rel = "stylesheet";
              link.type = "text/css";
              link.href = "/src/views/consumer/invoice/invoice.component.css";
              document.head.appendChild(link);
              return true;
          },
          ],
        }
      })
      .state("profile",{
        url: "/profile",
        templateUrl: "/src/views/profile/profile.component.html",
        controller: "profileController",
        resolve:{
          auth: ["AuthFactory", function (AuthFactory) {
            return AuthFactory.checkProfile();
        }],
          loadCSS: [
            function () {
              var link = document.createElement("link");
              link.rel = "stylesheet";
              link.type = "text/css";
              link.href = "/src/views/profile/profile.component.css";
              document.head.appendChild(link);
              return true;
          },
          ],
        }
      })
      .state("allbids",{
        url: "/consumer/allbids",
        templateUrl: "/src/views/consumer/allbids/allbids.component.html",
        controller: "BiddingController",
        resolve:{
          auth: ["AuthFactory", function (AuthFactory) {
            return AuthFactory.checkUser();
        }],
          loadCSS: [
            function () {
              var link = document.createElement("link");
              link.rel = "stylesheet";
              link.type = "text/css";
              link.href = "/src/views/consumer/allbids/allbids.component.css";
              document.head.appendChild(link);
              return true;
          },
          ],
        }
      })
      .state("admindashboard",{
        url: "/admin/dashboard",
        templateUrl: "/src/views/admin/admindashboard/admindashboard.component.html",
        controller: "AdminHomeController",
        resolve:{
          auth: ["AuthFactory", function (AuthFactory) {
            return AuthFactory.checkAdmin();
        }],
          loadCSS: [
            function () {
              var link = document.createElement("link");
              link.rel = "stylesheet";
              link.type = "text/css";
              link.href = "/src/views/admin/admindashboard/admindashboard.component.css";
              document.head.appendChild(link);
              return true;
          },
          ],
        }
      })
      .state("manageUser",{
        url: "/admin/manageUser",
        templateUrl: "/src/views/admin/manageUser/manageUser.component.html",
        controller: "ManageUsersController",
        resolve:{
          auth: ["AuthFactory", function (AuthFactory) {
            return AuthFactory.checkAdmin();
        }],
          loadCSS: [
            function () {
              var link = document.createElement("link");
              link.rel = "stylesheet";
              link.type = "text/css";
              link.href = "/src/views/admin/manageUser/manageUser.component.css";
              document.head.appendChild(link);
              return true;
          },
          ],
        }
      })
      .state("adminListing",{
        url: "/admin/Listing",
        templateUrl: "/src/views/admin/adminlisting/adminlisting.component.html",
        controller: "AdminListingController",
        resolve:{
          auth: ["AuthFactory", function (AuthFactory) {
            return AuthFactory.checkAdmin();
        }],
          loadCSS: [
            function () {
              var link = document.createElement("link");
              link.rel = "stylesheet";
              link.type = "text/css";
              link.href = "/src/views/admin/adminlisting/adminlisting.component.css";
              document.head.appendChild(link);
              return true;
          },
          ],
        }
      }).state("allbidsowner",{
        url: "/consumer/allbidsowner",
        templateUrl: "/src/views/owner/allbids/allbids.component.html",
        controller: "AllBidsOwnerController",
        resolve:{
          auth: ["AuthFactory", function (AuthFactory) {
            return AuthFactory.checkOwner();
        }],
          loadCSS: [
            function () {
              var link = document.createElement("link");
              link.rel = "stylesheet";
              link.type = "text/css";
              link.href = "/src/views/consumer/allbids/allbids.component.css";
              document.head.appendChild(link);
              return true;
          },
          ],
        }
      })
         
        
    },
  ]);
