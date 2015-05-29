'use strict';

EnmanApp.factory('AuthServices', ['$http', '$rootScope', '$cookies',  function($http, $rootScope, $cookies) {
    apiUrl = window.apiUrl;

    var authentication = {
        login: function(user) {
            return $http
                .post(apiUrl + "users/setsession", JSON.stringify(user))
                .then(this.loginSuccess, this.loginError);
        },

        loginSuccess: function(data, status, headers, config) {
            authentication.setAuthenticated(data.data);
            window.location = '/dashboard';
        },

        loginError: function(data, status, headers, config) {
            $rootScope.errMessage = "Login Failed!!"
            console.error('Login Failed!!');
        },

        logout: function() {
            authentication.unAuthenticate();
            window.location = "/login";
        },

        getAuthenticated: function() {
            if (!$cookies.authenticatedUser) {
                return;
            }
            return JSON.parse($cookies.authenticatedUser);
        },

        setAuthenticated: function(user) {
            user.logged = 1;
            $cookies.authenticatedUser = JSON.stringify(user);
        },

        isAuthenticated: function() {
            return $cookies.authenticatedUser;
        },

        unAuthenticate: function() {
            delete $cookies.authenticatedUser;
        },
        
        resetpass: function(user) {
            return $http
                .post(apiUrl + "users/resetpassword", JSON.stringify(user))
                .then(this.resetPassSuccess, this.resetPassError);
        },
        
        resetPassSuccess: function(data, status, headers, config) {
        	alert(data.data.message);
        	authentication.unAuthenticate();
            window.location = '/login';
        },

        resetPassError: function(data, status, headers, config) {
            $rootScope.errMessage = data.data.message;
        },
        
        
        forgotPass: function(userId) {
            return $http
                .get(apiUrl + "users/regeneratepassword?login_name=" + userId)
                .then(this.forgotPassSuccess, this.forgotPassError);
        },
        
        forgotPassSuccess: function(data, status, headers, config) {
        	alert(data.data.message);
        },

        forgotPassError: function(data, status, headers, config) {
            $rootScope.errMessage = data.data.message;
        }
    };

    return authentication;
}]);