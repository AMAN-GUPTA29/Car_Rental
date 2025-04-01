carRentalApp.service("ApiService", function ($http, API_BASE_URL) {
  this.postData = function (endpoint, data) {
    return $http.post(API_BASE_URL + endpoint, data);
  };

  this.getData = function (endpoint) {
    return $http.get(API_BASE_URL + endpoint);
  };

  this.getDataInternal = function (endpoint, token) {
    console.log("xssx")
    console.log(API_BASE_URL)
    console.log(endpoint);
    return $http.get(API_BASE_URL + endpoint, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  this.getDataInternaln = function (endpoint, params,token) {
    return $http.get(API_BASE_URL + endpoint, {
      withCredentials: true,
      params:params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  this.getDataInternalne = function (endpoint, filters,page,token) {
    
    return $http.get(API_BASE_URL + endpoint, {
      withCredentials: true,
      params:{
        filters:filters,
        page:page
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  this.postDataInternal = function (endpoint, data, token) {
    return $http.post(API_BASE_URL + endpoint, data, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  this.postDataInternalimage = function (endpoint, data, token) {
    return $http.post(API_BASE_URL + endpoint, data, {
      // withCredentials: true,
      headers: {
        "Content-Type":undefined,
        Authorization: `Bearer ${token}`,
      },
    });
  };

  this.patchDataInternal=function(endpoint, params ,token)
  {
    return $http.patch(API_BASE_URL+endpoint,{},{
      withCredentials:true,
      params:params,
      headers:{
        Authorization:`Bearer ${token}`,
        },
    })
  }

  this.patchDataInternalne=function(endpoint,data,token)
  { 
    return $http.patch(API_BASE_URL+endpoint,data,{
      withCredentials:true,
      headers:{
        Authorization:`Bearer ${token}`,
        },
    })
  }
});
