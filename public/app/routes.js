

var app = angular.module('appRoutes',['ngRoute'])

.config(function($routeProvider,$locationProvider){
	
	$routeProvider

	.when('/', {
		templateUrl: 'app/views/home.html',
		authenticated: false
	})

	.when('/explore', {
		templateUrl: 'app/views/explore.html',
		controller: 'DonateRequestsManager',
		controllerAs: 'donaterequests',
		authenticated: false
	})

	.when('/about',{
		templateUrl:'app/views/about.html',
        authenticated:false,
	})

	.when('/signup',{
		templateUrl:'/app/views/signup.html',
		controller:'RegistrationManager',
		controllerAs: 'register',
		authenticated:false,
	})

	.when('/signin',{
		templateUrl:'/app/views/signin.html',
        authenticated:false,
	})

	.when('/logout',{
		templateUrl:'/app/views/logout.html',
        authenticated:true,
	})

	.when('/overview',{
		templateUrl:'/app/views/overview.html',
        authenticated:true,
	})

	.when('/facebook/:token',{
		templateUrl:'/app/views/overview.html',
		controller :'FacebookManager',
		controllerAs: 'facebook',
        authenticated:false
	})

	.when('/google/:token',{
		templateUrl:'/app/views/overview.html',
		controller :'GoogleManager',
		controllerAs: 'google',
        authenticated:false
	})

	.when('/twitter/:token',{
		templateUrl:'/app/views/overview.html',
		controller :'TwitterManager',
		controllerAs: 'twitter',
        authenticated:false
	})

	.when('/googleerror',{
		templateUrl:'/app/views/signin.html',
        controller :'GoogleManager',
        controllerAs: 'google',
        authenticated:false
	})

	.when('/activate/:token',{
		templateUrl:'/app/views/activation/activate.html',
		controller :'EmailManager',
		controllerAs: 'email',
        authenticated:false
    })

	.when('/resend',{
		templateUrl:'/app/views/activation/resend.html',
		controller :'ResendManager',
		controllerAs: 'resend',
        authenticated:false
    })

	.when('/resetusername',{
		templateUrl:'/app/views/reset/username.html',
		controller :'UsernameManager',
		controllerAs: 'username',
        authenticated:false
    })

	.when('/resetpassword',{
		templateUrl:'/app/views/reset/password.html',
		controller :'PasswordManager',
		controllerAs: 'password',
        authenticated:false
    })

	.when('/changepassword/:token',{
		templateUrl:'/app/views/reset/changepassword.html',
		controller :'ChangePasswordManager',
		controllerAs: 'changepassword',
        authenticated:false
    })

	.when('/contribute' ,{
		templateUrl : 'app/views/contribute.html',
		authenticated : true
	})

	.when('/contributeraw', {
		templateUrl : 'app/views/contributeraw.html',
		authenticated : true,
		controller : 'DonateRawManager',
		controllerAs : 'donateraw'
	})

	.when('/contribute-meals', {
		templateUrl : 'app/views/contribute-meals.html',
		authenticated : true,
		controller : 'DonateCookedFoodManager',
		controllerAs : 'donatecookedfood'
	})

    .when('/donaterequest/:id', {
        templateUrl : 'app/views/readdonaterequest.html',
        authenticated : true,
        controller : 'ReadDonateRequestManager',
        controllerAs : 'readdonaterequest'
    })

    .when('/accepteddonaterequests', {
        templateUrl : 'app/views/accepted.html',
        authenticated : true,
        controller : 'AcceptedManager',
        controllerAs : 'accepted'
    })

	.when('/buydonate' ,{
		templateUrl : 'app/views/buydonate.html',
		controller : 'BuyDonateManager',
		controllerAs : 'buydonate',
		authenticated : true
	})

	.when('/donaterequests' ,{
		templateUrl : 'app/views/explore.html',
		controller : 'DonateRequestsManager',
		controllerAs : 'donaterequests',
		authenticated : false
	})

	.when('/cart' ,{
		templateUrl : 'app/views/cart.html',
		controller : 'CartManager',
		controllerAs : 'cart',
		authenticated : true
	})

	.when('/donators' ,{
		templateUrl : 'app/views/users/donators.html',
		controller : 'DonatorsManager',
		controllerAs : 'donators',
		authenticated : true
	})

	.when('/receivers' ,{
		templateUrl : 'app/views/users/receivers.html',
		controller : 'ReceiversManager',
		controllerAs : 'receivers',
		authenticated : true
	})

	.when('/volunteers' ,{
		templateUrl : 'app/views/users/volunteers.html',
		controller : 'VolunteersManager',
		controllerAs : 'volunteers',
		authenticated : true
	})

	.when('/team' ,{
		templateUrl : 'app/views/team.html',
		authenticated : true
	})

	.when('/addnewproduct',{
		templateUrl : 'app/views/addnewproduct.html',
		controller : 'AddNewProductManager',
		controllerAs : 'product',
		authenticated : true
	})

    .when('/orderplaced', {
        templateUrl : 'app/views/orderplaced.html',
        authenticated : true,
		controller : 'OrderPlacedManager'
    })


	.otherwise({redirectTo:'/'});

	$locationProvider.html5Mode(true);

});


app.run(['$rootScope','Auth','$location',function($rootScope, Auth , $location){

    $rootScope.$on('$routeChangeStart',function(event,next,current){
    	

        if(next.$$route.authenticated == true)
        {
            if(!Auth.isLoggedIn()){
            	event.preventDefault();
            	$location.path('/');
			}
        }
        else if(next.$$route.authenticated == false) {
            if (Auth.isLoggedIn()) {
                event.preventDefault();
                $location.path('/');
            }
        }
    });
}
]);





