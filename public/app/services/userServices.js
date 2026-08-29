
angular.module('userServices',[])

.factory('User',function($http){
    userFactory={};

    userFactory.create = function(regData){
        return $http.post('/api/v1/members/register',regData);
    };

    
    
    
    
    
    

    userFactory.activateAccount = function(token){
        return $http.put('/api/v1/members/activate/' + token);
    };

    userFactory.checkCredentials = function(loginData){
        
        return $http.post('/api/v1/members/resend',loginData);
    };

    userFactory.resendLink = function(username){
        
        return $http.put('/api/v1/members/sendlink',username);
    };

    userFactory.resetUsername = function(email){
        
        return $http.post('/api/v1/members/resetusername',email);
    };

    userFactory.resetPassword = function(email){
        return $http.post('/api/v1/members/resetpassword',email);
    };

    
    userFactory.changepassword = function(logObj) {
        return $http.put('/api/v1/members/changepassword', logObj);
    };

    userFactory.donaterawfood = function(rawfoodData){
        
        return $http.post('/api/v1/members/donaterawfood',rawfoodData);
    };

    userFactory.donateCookedFood = function(foodData){
        
        return $http.post('/api/v1/members/donateCookedFood',foodData);
    };

    userFactory.donaterequests = function(){
        
        return $http.get('/api/v1/members/donaterequests');
    };

    userFactory.readdonaterequest = function (id) {
        return $http.get('/api/v1/members/readdonaterequest/'+id);
    };

    userFactory.donators = function () {
        return $http.get('/api/v1/members/donators');
    };

    userFactory.receivers = function () {
        return $http.get('/api/v1/members/receivers');
    };

    userFactory.volunteers = function () {
        return $http.get('/api/v1/members/volunteers');
    };

    userFactory.addtocart = function (id) {
        
        return $http.post('/api/v1/members/addtocart/'+ id);
    };

    userFactory.cart = function () {
        return $http.get('/api/v1/members/cart');
    };

    userFactory.addnewproduct = function (Data) {
        return $http.post('/api/v1/members/addnewproduct',Data);
    };

    userFactory.displayproduct = function(){
      return $http.get('/api/v1/members/displayproduct');
    };

    userFactory.accept = function (id) {
        
        return $http.put('/api/v1/members/accept/'+id);
    };

    userFactory.searchAccepted = function () {
        return $http.get('/api/v1/members/searchAccepted');
    };

    userFactory.removeitem = function (id) {
        return $http.post('/api/v1/members/removeitem/'+id);
    };

    userFactory.clearcart = function () {
        return $http.post('/api/v1/members/clearcart');
    };
    

    return userFactory;
});