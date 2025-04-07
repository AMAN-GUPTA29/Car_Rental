carRentalApp.
factory('toastifyService', function() {
  var service = {};
  
  var defaultConfig = {
    duration: 3000,
    close: true,
    gravity: "top",
    position: "right",
    stopOnFocus: true,
    style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)"
    }
  };
  
  service.showToast = function(message, options) {
    var config = angular.extend({}, defaultConfig, options || {});
    config.text = message;
    
    Toastify(config).showToast();
  };
  
  service.success = function(message, options) {
    options = options || {};
    options.style = options.style || { background: "linear-gradient(to right, #00b09b, #96c93d)" };
    service.showToast(message, options);
  };
  
  service.error = function(message, options) {
    options = options || {};
    options.style = options.style || { background: "linear-gradient(to right, #ff5f6d, #ffc371)" };
    service.showToast(message, options);
  };
  
  service.info = function(message, options) {
    options = options || {};
    options.style = options.style || { background: "linear-gradient(to right, #2193b0, #6dd5ed)" };
    service.showToast(message, options);
  };
  
  service.warning = function(message, options) {
    options = options || {};
    options.style = options.style || { background: "linear-gradient(to right, #f7b733, #fc4a1a)" };
    service.showToast(message, options);
  };
  
  return service;
});
