angular.module('emailController',['userServices'])

.controller('EmailManager',function($routeParams,User,$timeout,$location){

    var app = this;
    
    User.activateAccount($routeParams.token).then(function(data){

        app.successMsg = false;
        app.errorMsg=false;

        if((data.data.status === 'ok')){
            app.successMsg = data.data.payload.message + ' Redirecting.......';
            $timeout(function() {
                $location.path('/login');
            },3000);
        }
        else{
            app.errorMsg = data.data.payload.message + '  Redirecting.......';
            $timeout(function() {
                $location.path('/login');
            },3000);
        }
    })
})

.controller('ResendManager',function(User){

    var app = this;

    
    app.checkCredentials = function(loginData) {

        app.errorMsg = false;
        app.successMsg = false;
        app.linksent = false;

        User.checkCredentials(app.loginData).then(function(data) {

            if((data.data.status === 'ok')){
                User.resendLink(app.loginData).then(function(data){
                    if((data.data.status === 'ok')){
                        app.linksent = true;
                        app.successMsg = data.data.payload.message;
                    }
                })
            }
            else{
                app.errorMsg = data.data.payload.message;
            }
        });
    };
})

.controller('UsernameManager',function(User){

    var app = this;

    
    app.resetUsername = function(loginData) {

        app.errorMsg = false;
        app.successMsg = false;
        app.sent = false;

        User.resetUsername(app.loginData).then(function(data) {

            if((data.data.status === 'ok')){

                app.sent = true;
                app.successMsg = data.data.payload.message;
            }
            else{
                app.errorMsg = data.data.payload.message;
            }
        });
    }
})

.controller('PasswordManager',function(User){

    var app = this;


    app.errorMsg = false;
    app.successMsg = false;
    app.sent = false;

    
    app.resetPassword = function(loginData) {


        User.resetPassword(app.loginData).then(function(data) {

            if((data.data.status === 'ok')){

                app.sent = true;
                app.successMsg = data.data.payload.message;
            }
            else{
                app.errorMsg = data.data.payload.message;
            }
        });
    }

})

.controller('ChangePasswordManager', function (User , $routeParams) {
    var app = this;

    app.errorMsg = false;
    app.successMsg = false;
    app.sent = false;
    var logObj = {};

    app.resetPassword = function (loginData) {

        logObj.password = app.loginData.password;
        logObj.token = $routeParams.token;
        User.changepassword(logObj).then(function (data) {
            if((data.data.status === 'ok')) {
                app.successMsg = data.data.payload.message;
            } else {
                app.errorMsg = data.data.payload.message;
            }
        });
    }
});