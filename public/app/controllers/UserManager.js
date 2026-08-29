angular.module('userControllers',['userServices'])

.controller('RegistrationManager',function(User,$http,$location,$timeout) {

    var app = this;

    this.regUser = function (regData) {
        app.loading = true;
        app.errMsg = false;
        app.successMsg = false;
        
        User.create(app.regData).then(function (data) {
            
            if ((data.data.status === 'ok')) {
                app.loading = false;
                app.successMsg = data.data.payload.message + ' Redirecting.....';
                $timeout(function () {
                    $location.path('/');
                }, 1000);
            }
            else {
                app.errMsg = data.data.payload.message;
                app.loading = false;
            }
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            

        });
    }


})

.directive('match', function () {
    return {
        restrict: 'A',
        controller:function($scope) {

            $scope.confirmed = false;

            $scope.doConfirm = function(values){
                
                
                values.forEach(function(letter){

                    if($scope.confirm == letter) {
                        $scope.confirmed = true;
                    }
                    else{
                        $scope.confirmed = false;
                    }
                    
                    
                });

            }

        },

        link: function(scope, element, attrs){

            attrs.$observe('match',function() {
                scope.matches = JSON.parse(attrs.match);
                scope.doConfirm(scope.matches);
            });

            scope.$watch('confirm',function() {
                scope.matches = JSON.parse(attrs.match);
                scope.doConfirm(scope.matches);
            });
        }
    };
})

.controller('BuyDonateManager', function (User,$timeout) {

    var app = this;

    User.displayproduct().then(function(data){
       if((data.data.status === 'ok')){
           app.item = data.data.payload.item;
       }
    });

    app.addtocart = function(id){
        
        User.addtocart(id).then(function(data){
            if((data.data.status === 'ok')){
                app.successMsg = data.data.payload.message;
            }
            else{
                app.errorMsg = data.data.payload.message;
            }
            $timeout(function(){
                app.successMsg = '';
            },1000);
        })
    }
})

.controller('DonateRawManager', function (User) {
    
    var app=this;

    app.successMsg = false;
    app.errorMsg = false;

    app.addData = function(rawfoodData){

        
        User.donaterawfood(app.rawfoodData).then(function(data){
            if((data.data.status === 'ok')){
                app.successMsg = data.data.payload.message;
            }
            else{
                app.errorMsg = data.data.payload.message;
            }
        })
    }
})

.controller('DonateCookedFoodManager', function (User) {
    var app=this;

    app.successMsg = false;
    app.errorMsg = false;

    app.addFood = function(foodData){

        
        User.donateCookedFood(app.foodData).then(function(data){
            if((data.data.status === 'ok')){
                app.successMsg = data.data.payload.message;
            }
            else{
                app.errorMsg = data.data.payload.message;
            }
        })
    }
})

.controller('DonateRequestsManager', function (User, $interval, $timeout, $scope) {
    var app = this;

    app.rawfood = [];
    app.cookedfood = [];
    app.allRescues = [];
    app.featuredRescues = [];
    app.loading = true;
    app.searchKeyword = '';
    app.categoryFilter = 'all';

    app.stats = {
        totalRescues: 0,
        cookedMeals: 0,
        rawItems: 0,
        citiesCovered: 0
    };

    app.setCategoryFilter = function(filter) {
        app.categoryFilter = filter;
    };

    app.matchesCategory = function(item) {
        if (app.categoryFilter === 'all') return true;
        return item.type === app.categoryFilter;
    };

    app.loadData = function() {
        app.loading = true;
        User.donaterequests().then(function(data) {
            app.loading = false;
            if (data.data.status === 'ok') {
                app.cookedfood = data.data.payload.food || [];
                app.rawfood = data.data.payload.user || [];
                app.institute = data.data.payload.institute;

                var combined = [];
                var cities = {};

                app.cookedfood.forEach(function(item) {
                    combined.push({
                        _id: item._id,
                        title: item.meal,
                        type: 'cooked',
                        typeLabel: 'Cooked Food',
                        quantityLabel: item.people ? (item.people + ' People') : 'Ready Meal',
                        city: item.city,
                        state: item.state,
                        postedby: item.postedby,
                        expiryDate: item.expiryDate,
                        address: item.address,
                        raw: item
                    });
                    if (item.city) cities[item.city.toLowerCase()] = true;
                });

                app.rawfood.forEach(function(item) {
                    combined.push({
                        _id: item._id,
                        title: item.name,
                        type: 'raw',
                        typeLabel: 'Raw Surplus',
                        quantityLabel: item.quantity ? (item.quantity + ' ' + (item.unit || 'units')) : 'Raw Items',
                        city: item.city,
                        state: item.state,
                        postedby: item.postedby,
                        expiryDate: item.expiryDate,
                        address: item.address,
                        raw: item
                    });
                    if (item.city) cities[item.city.toLowerCase()] = true;
                });

                app.allRescues = combined;
                app.stats.totalRescues = combined.length;
                app.stats.cookedMeals = app.cookedfood.length;
                app.stats.rawItems = app.rawfood.length;
                app.stats.citiesCovered = Object.keys(cities).length;

                // Fallback default featured rescues if db is fresh
                if (combined.length > 0) {
                    app.featuredRescues = combined;
                } else {
                    app.featuredRescues = [
                        { _id: 'sample1', title: 'Fresh Bakery & Bread', type: 'raw', typeLabel: 'Raw Surplus', quantityLabel: '25 kg', city: 'Central Park', state: 'NY', postedby: 'City Bakery' },
                        { _id: 'sample2', title: 'Vegetable Rice & Curry', type: 'cooked', typeLabel: 'Cooked Food', quantityLabel: '40 People', city: 'Downtown', state: 'CA', postedby: 'Community Kitchen' },
                        { _id: 'sample3', title: 'Organic Produce Crate', type: 'raw', typeLabel: 'Raw Surplus', quantityLabel: '15 Crates', city: 'Metro Market', state: 'TX', postedby: 'Green Grocery' }
                    ];
                }
            }
        }).catch(function() {
            app.loading = false;
        });
    };

    app.loadData();

    // 3D Carousel Continuous Rotation & Drag Logic
    app.carouselIndex = 0;
    app.isDragging = false;
    app.startX = 0;
    app.dragOffset = 0;
    app.autoRotatePaused = false;

    app.getCarouselTransform = function() {
        var offset = (-app.carouselIndex * 344) + app.dragOffset;
        return 'translateX(' + offset + 'px)';
    };

    app.pauseCarousel = function() {
        app.autoRotatePaused = true;
    };

    app.resumeCarousel = function() {
        app.autoRotatePaused = false;
    };

    var autoTimer = $interval(function() {
        if (!app.autoRotatePaused && !app.isDragging && app.featuredRescues.length > 0) {
            app.carouselIndex = (app.carouselIndex + 1) % app.featuredRescues.length;
        }
    }, 3500);

    $scope.$on('$destroy', function() {
        if (autoTimer) $interval.cancel(autoTimer);
    });

    app.onMouseDown = function(event) {
        app.isDragging = true;
        app.startX = event.clientX || (event.touches && event.touches[0].clientX) || 0;
        app.dragOffset = 0;
        app.pauseCarousel();
    };

    app.onMouseMove = function(event) {
        if (!app.isDragging) return;
        var currentX = event.clientX || (event.touches && event.touches[0].clientX) || 0;
        app.dragOffset = currentX - app.startX;
    };

    app.onMouseUp = function() {
        if (!app.isDragging) return;
        app.isDragging = false;
        if (app.dragOffset < -50 && app.featuredRescues.length > 0) {
            app.carouselIndex = (app.carouselIndex + 1) % app.featuredRescues.length;
        } else if (app.dragOffset > 50 && app.featuredRescues.length > 0) {
            app.carouselIndex = (app.carouselIndex - 1 + app.featuredRescues.length) % app.featuredRescues.length;
        }
        app.dragOffset = 0;
        $timeout(function() { app.resumeCarousel(); }, 2000);
    };
})

.controller('CartManager', function (User, $location, $http, $scope) {

   var app = this;

   function cart() {

       User.cart().then(function(data){
           if((data.data.status === 'ok')) {
               app.cart = data.data.payload.cart;
               app.value = data.data.payload.value;
               $scope.cartDetails = data.data.payload;
           }
       });
   }

   cart();

   app.removeitem = function (id) {
       
       User.removeitem(id).then(function (data) {
           if((data.data.status === 'ok')) {
               cart();
           }
       });
   };

   $scope.confirmContribution = function() {
       $http.post('/api/v1/contribute/confirm', $scope.cartDetails)
           .then(function(response) {
               $location.path('/overview');
           })
           .catch(function(error) {
               $scope.errorMessage = "Failed to process contribution.";
           });
   };

   app.confirmContribution = $scope.confirmContribution;
})

.controller('OrderPlacedManager', function (User) {
    User.clearcart();
})


.controller('ReadDonateRequestManager', function (User, $routeParams,$timeout, $location) {
    
    var app = this;


    User.readdonaterequest($routeParams.id).then(function (data) {
        

        if((data.data.status === 'ok')){
            app.city = data.data.payload.food.city;
            app.meal = data.data.payload.food.meal;
            app.people = data.data.payload.food.people;
            app.state = data.data.payload.food.state;
            app.username = data.data.payload.user.username;
            app.name = data.data.payload.user.name;
            app.email = data.data.payload.user.email;
            app.institute = data.data.payload.user.institute;
            app.id = $routeParams.id;
        }
    });

    app.accept = function (id) {
        

        User.accept(id).then(function (data) {
            if((data.data.status === 'ok')) {
                app.successMsg = data.data.payload.message;
                $timeout(function () {
                    $location.path('/donaterequests')
                },1000);
            } else {
                app.errorMsg = data.data.payload.message;
            }
        })
    }
})

.controller('AcceptedManager', function (User) {
   

    var app = this;

    User.searchAccepted().then(function (data) {
        if((data.data.status === 'ok')) {
            app.cook = data.data.cook;
            app.raw = data.data.raw;
        }
    });

})

.controller('AddNewProductManager',function(User){

    var app = this;

    app.addnewproduct = function(Data){

        app.successMsg = false;
        app.errorMsg = false;

        User.addnewproduct(app.Data).then(function(data){
            if((data.data.status === 'ok')){
                app.successMsg = data.data.payload.message;
                app.Data = '';
            }
            else{
                app.errorMsg = data.data.payload.message;
            }
        })
    }
})

.controller('DonatorsManager',function (User) {
    var app = this;
    User.donators().then(function(data){
        if((data.data.status === 'ok')) {
            app.donators = data.data.payload.user;
        } else {
            app.errorMsg = data.data.payload.message;
        }
    });
})

.controller('ReceiversManager',function (User) {
    var app = this;
    User.receivers().then(function(data){
        if((data.data.status === 'ok')) {
            app.receivers = data.data.payload.user;
        } else {
            app.errorMsg = data.data.payload.message;
        }
    });
})

.controller('VolunteersManager',function (User) {
    var app = this;
    User.volunteers().then(function(data){
        if((data.data.status === 'ok')) {
            app.volunteers = data.data.payload.user;
        } else {
            app.errorMsg = data.data.payload.message;
        }
    });
});