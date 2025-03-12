/**
 * @description This factory is used to logout the user from the application.
 */
carRentalApp.factory("AuthService", function ($state) {
    return {
      logout: function () {
        sessionStorage.clear();
        $state.go("login");
      },
    };
  });
  