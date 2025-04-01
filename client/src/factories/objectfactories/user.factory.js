carRentalApp.factory('UserFactory', ['userSignupService', '$q', 'admindb', function(userSignupService, $q, admindb) {
  function User(initialData = {}) {
    this.email = initialData.email || '';
    this.role = initialData.role || 'user';
    this.aadhar = initialData.aadhar || null;
    this.userName = initialData.userName || '';
    this.phone = initialData.phone || null;
    this.password = initialData.password || '';
    this.authorise = initialData.authorise !== undefined ? initialData.authorise : true;
    this.blocked = initialData.blocked !== undefined ? initialData.blocked : false;
    this.id = initialData._id || null; 
  }

  User.prototype = {
    verify: function() {
      const deferred = $q.defer();
      const errors = [];
      
      // Email validation
      if (!this.email) {
        errors.push('Email is required');
      } else if (!isValidEmail(this.email)) {
        errors.push('Invalid email format');
      }
      
      // Role validation
      const validRoles = ['user', 'admin', 'owner'];
      if (!this.role) {
        errors.push('Role is required');
      } else if (!validRoles.includes(this.role)) {
        errors.push('Role must be one of: user, admin, owner');
      }
      
      // Aadhar validation (12 digits)
      if (this.aadhar !== null) {
        const aadharRegex = /^\d{12}$/;
        if (!aadharRegex.test(this.aadhar)) {
          errors.push('Aadhar number must be exactly 12 digits');
        }
      }
      
      // Username validation
      if (!this.userName || this.userName.trim() === '') {
        errors.push('Username is required');
      }
      
      // Phone validation (10 digits)
      if (!this.phone) {
        errors.push('Phone number is required');
      } else {
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(this.phone)) {
          errors.push('Phone number must be exactly 10 digits');
        }
      }
      
      // Password validation
      if (!this.password) {
        errors.push('Password is required');
      }
      
      // If there are any validation errors, reject with all errors
      if (errors.length > 0) {
        deferred.reject(new Error(errors.join('; ')));
      } else {
        // All validations passed
        deferred.resolve();
      }

      return deferred.promise;
    },

    create: function() {
      console.log("dsdss");
      const deferred = $q.defer();
    
      this.verify()
        .then(() => {
          return userSignupService.saveSignupInfo(this);
        })
        .then(() => {
          console.log("cscwwwq")
          deferred.resolve("Success");
        })
        .catch((error) => {
          deferred.reject(error);
        });
    
      return deferred.promise;
    }
,    
  
    edit: function() {
      const deferred = $q.defer();
      if (!this.id) {
        return deferred.reject(new Error('User ID is required to edit a user.'));
      }
      return dataService.updateUser(this)
        .then(response => {
          angular.extend(this, response.data);
          return response;
        });
    },
  
    block: function() {
      const deferred = $q.defer();
      if (!this.id) {
        return deferred.reject(new Error('User ID is required to block a user.'));
      }
      const params = {
        id: this.id,
      }
      admindb.updateuser(params, true).then((result) => {
        deferred.resolve(result);
      }).catch((err) => {
        deferred.reject(err)
      });

      return deferred.promise;
    },
  
    unblock: function() {
      const deferred = $q.defer();

      if (!this.id) {
        return deferred.reject(new Error('User ID is required to unblock a user.'));
      }
     
      const params = {
        id: this.id,
      }

      admindb.updateuser(params, false)
        .then((response) => {
          deferred.resolve(response);
        }).catch((err) => {
          deferred.reject(err)
        });

      return deferred.promise;
    }
  };

  // Helper function for email validation
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  return User;
}]);
