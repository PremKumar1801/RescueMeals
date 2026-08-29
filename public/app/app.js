

angular.module('rescueMealsApp',['appRoutes','userControllers','userServices','mainController','authServices','emailController'])

.config(function($httpProvider){
    $httpProvider.interceptors.push('AuthInterceptors');
});