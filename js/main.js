
'use strict';

var app = angular.module('WebApp', [
    'ngRoute'
]);

/**
 * Configure the Routes
 */
app.config(['$routeProvider', '$locationProvider', function($routes, $location) {
    $location.html5Mode(true).hashPrefix('!');
    $routes
    // Home
        .when("/", {
        templateUrl: "partials/home.html",
        controller: "PageCtrl",
        metadata: {
            title: 'TIM | Glavna',
            description: 'Glavna strana Tim - Tim International',
            keywords: 'TIM, Ukrasne, Kese, Ambalaza, Trake, Papir, Nosiljke, Tregerice'
        }

    })
    // Pages
        .when("/home", {
        templateUrl: "partials/home.html",
        controller: "PageCtrl",
        metadata: {
            title: 'TIM | Glavna',
            description: 'Glavna strana Tim - Tim International',
            keywords: 'TIM, Ukrasne, Kese, Ambalaza, Trake, Papir, Nosiljke, Tregerice'
        }
    })
        .when("/about", {
        templateUrl: "partials/about.html",
        controller: "PageCtrl",
        metadata: {
            title: 'TIM | O Nama',
            description: 'Rad i razvoj ',
            keywords: 'Istorija'
        }
    })

        .when("/media", {
        templateUrl: "partials/media.html",
        controller: "PageCtrl",
        metadata: {
            title: 'TIM - Media',
            description: 'Slike i Media Srpsko finskog drustva Seura',
            keywords: 'Galerija, Slike, Aktivnosti, Video'
        }   
    })
        .when("/contact", {
        templateUrl: "partials/contact.html",
        controller: "PageCtrl",
        metadata:{
            title: 'TIM - Kontakt',
            description: 'Kontakt strana TIM, za sva pitanja',
            keywords: 'Kontakt'
        }
    })
        .when("/post/:id", {
        templateUrl: "partials/post.html",
        controller: "SinglePostController",
        metadata: {
            title: 'TIM | Novosti',
            description: 'Seura novosti i desavanja - Blog',
            keywords: 'Blog, Servisi Aktivnosti, Video'
        }   
    })

        .when("/login", {
        templateUrl: "partials/login.html",
        controller: "LoginCtrl",
        metadata: {
            title: 'TIM - Admin Panel',
            description: 'Administrativni panel TIM ',
            keywords: 'Login, TIM'
        }   
    })
        .when("/admin", {
        templateUrl: "partials/admin.html",
        controller: "AdminCtrl",
        metadata: {
            title: 'TIM - Admin Panel',
            description: 'Administrativni panel TIM ',
            keywords: 'Login, TIM'
        }   
    })
    // else 404
        .otherwise("/", {
        templateUrl: "partials/home.html",
        controller: "PageCtrl",
        metadata: {
            title: 'TIM - 404 Page',
            description: 'Pogresan URL ',
            keywords: '404, povratak'
        }   
    });


}
           ]);


/**
 * Controls all other Pages
 */



//For SEO changes meta data on url change
app.service("metadataService", ['$rootScope', '$location', function($rootScope, $location) {
    var self = this;

    // Set custom options or use provided fallback (default) options
    self.loadMetadata = function(metadata) {
        self.title = document.title = metadata.title || 'TIM | Drustvo Specijalizovano za trgovinu na veliko';
        self.description = metadata.description || 'SEURA je srpsko finsko drustvo sa ogrankom u Beogradu';
        self.keywords = metadata.keywords || 'TIM, Ukrasne, Kese, Ambalaza, Trake, Papir, Nosiljke, Tregerice';
        self.url = metadata.url || $location.absUrl();

    };

    // Route change handler, sets the route's defined metadata
    $rootScope.$on('$routeChangeSuccess', function (event, newRoute) {
        self.loadMetadata(newRoute.metadata);
    });

}
                               ])

app.directive('metaproperty', ["metadataService", function(metadataService){
    return {
        restrict: 'A',
        scope: {
            metaproperty: '@'
        },
        link: function postLink(scope, element, attrs) {
            scope.default = element.attr('content');
            scope.metadata = metadataService;

            // Watch for metadata changes and set content
            scope.$watch('metadata', function (newVal, oldVal) {
                setContent(newVal);
            }, true);

            // Set the content attribute with new metadataService value or back to the default
            function setContent(metadata) {
                var content = metadata[scope.metaproperty] || scope.default;
                element.attr('content', content);
            }

            setContent(scope.metadata);
        }
    };
}]);

//login service
app.factory('loginService',function($http, $location, sesionService){
    return{
        login:function(user,scope){
            var $promise = $http.post('../user.php', user); //send data to user.php
            $promise.then(function(msg){
                var uid = msg.data;
                if (uid) {
                    sesionService.set('uid', uid);
                    $location.path('/admin');
                }
                else {
                    console.log(msg.data);
                    $location.path('/login');
                }

            });
        },
        logout: function(){
            sesionService.destroy('uid');
            $location.path('/login');

        },

        isLogged: function(){
         var $checkSessionServer =  $http.post('../check_session.php');
         return $checkSessionServer;
        }
    }

});

app.factory('sesionService', ['$http',  function($http, loginService){
    return {
        set: function(key, value){
            return sessionStorage.setItem(key,value);
        },
        get: function  (key) {
            return sessionStorage.getItem(key);
        },

        destroy: function  (key) {
            $http.post('../destroy_session.php');
            return sessionStorage.removeItem(key);
        },

    };
}])

app.run(function($rootScope, $location, loginService){
    var routepermision = ['/admin'];
    $rootScope.$on('$routeChangeStart', function(){
        if (routepermision.indexOf($location.path()) != -1) {
           var conected = loginService.isLogged();
            conected.then(function(msg){
                if(!msg.data){
                   $location.path('/login');     
                } 
            })
            
        };
    })
})

app.controller('LoginCtrl', function( $scope, loginService ) {
    $scope.login=function(user){
        loginService.login(user,$scope); //call login service
    };
});
app.controller('AdminCtrl', function($scope, $location, $http, loginService ) {
    $scope.txt = 'Welcome to Admin panel we wish you pleasent stay';
    $scope.logout = function  () {
        loginService.logout();
    }
});

app.controller('PageCtrl', function(/* $scope, $location, $http */) {

});



app.controller('SinglePostController', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams){
    $http.get('http://site1.local/api.php').success(function(data){
        $scope.post = data[$routeParams.id];
    });
}]);

app.controller('MetadataCtrl', function ($scope, metadataService) {
    $scope.meta = metadataService;
});



