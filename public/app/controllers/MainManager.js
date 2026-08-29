

angular.module('mainController',['authServices'])

.controller('MainManager',function(Auth,$timeout,$location,AuthToken,$rootScope){
    var app=this;

    app.isLoggedIn = false;
    app.mobileMenuOpen = false;

    app.isActiveRoute = function(path) {
        if (path === '/') {
            return $location.path() === '/' || $location.path() === '';
        }
        return $location.path().indexOf(path) === 0;
    };

    app.toggleMobileMenu = function() {
        app.mobileMenuOpen = !app.mobileMenuOpen;
    };

    app.closeMobileMenu = function() {
        app.mobileMenuOpen = false;
    };

    $rootScope.$on('$routeChangeStart', function(event, next, current) {
        app.mobileMenuOpen = false;
        app.currentPath = $location.path();

        if (Auth.isLoggedIn()) {
            app.isLoggedIn = true;
            Auth.getUser().then(function(data) {
                if (data && data.data && data.data.payload) {
                    var role = data.data.payload.role;
                    if (role === 'donator') {
                        app.isDonator = true;
                    } else if (role === 'receiver') {
                        app.isReceiver = true;
                    } else {
                        app.isDonator = true;
                        app.isReceiver = true;
                    }
                    app.username = data.data.payload.username;
                }
            });
        } else {
            app.isLoggedIn = false;
            app.username = "";
        }
    });

    this.google=function(){
        $window.location=$window.location.protocol+'//'+ $window.loaction.host + '/auth/google'
    };

    this.dologin = function(loginData) {
        
        app.loading=true;
        app.errMsg = false;
        app.successMsg=false;
        app.expired = false;
        

        Auth.login(app.loginData).then(function (data) {
            
            if((data.data.status === 'ok'))
            {
                app.loading=false;
                app.successMsg = data.data.payload.message + ' Redirecting.....';
                $timeout(function() {
                    $location.path('/about');
                },1500);

                app.loginData="";
            }
            else {
                if(data.data.payload.expired){

                    app.expired = true;
                    app.loading = false;
                    app.errMsg = data.data.payload.message;
                }
                else {
                    app.errMsg = data.data.payload.message;
                    app.loading=false;
                }
            }
        })
    };

    this.logout=function(){
        Auth.logout();
        $location.path('/logout');
        $timeout(function(){
            $location.path('/');
        },2000);
    };

})

.controller('FacebookManager',function($routeParams,Auth) {
    Auth.facebook($routeParams.token);
    $location.path('/');








})

.controller('GoogleManager',function($routeParams,Auth,$location) {
    Auth.google($routeParams.token);
    $location.path('/');








});