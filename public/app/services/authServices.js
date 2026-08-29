

angular.module('authServices',[])

.factory('Auth',function($http,AuthToken,$window){
    var authFactory={};

    authFactory.login = function(loginData){
        return $http.post('/api/v1/members/auth',loginData).then(function(data){
            
            AuthToken.setToken(data.data.payload.token);
            return data;
        });
    };

    authFactory.isLoggedIn=function(){
        if(AuthToken.getToken()){
            return $http.post('/api/v1/members/me');
        }
        else {
            return false;
        }
    };

    

    authFactory.facebook=function(token)
    {
        AuthToken.setToken(token);
    };

    authFactory.google=function(token)
    {
        AuthToken.setToken(token);
    };

    authFactory.getUser=function(){
      if(AuthToken.getToken()){
          return $http.post('/api/v1/members/me');
      }
      else
      {
          $q.reject({message:"User has no token"});
      }
    };

    authFactory.logout=function(){
        AuthToken.setToken();
    };
    return authFactory;
})

.factory('AuthToken',function($window){
    var authTokenFactory={};

    authTokenFactory.setToken = function(token){
        if(token){
            $window.localStorage.setItem('rescuemeals_token',token);
        }
        else {
            $window.localStorage.removeItem('rescuemeals_token');
        }
    };

    authTokenFactory.getToken = function(){
        return $window.localStorage.getItem('rescuemeals_token');
    };


    return authTokenFactory;
})

.factory('AuthInterceptors',function(AuthToken) {

    var authInterceptorsFactory = {};

    authInterceptorsFactory.request = function(config){

        var token = AuthToken.getToken();

        if(token) config.headers['x-access-token'] = token;

        return config;
    };

    return authInterceptorsFactory;
});