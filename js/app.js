(function (){
	var app = angular.module('logic', ['ngRoute']);

	app.constant('API_URL', 'http://201.245.123.114:8089/seletiene/');
	//app.constant('API_URL', 'http://200.119.110.136:81/seletienea/');
	app.config(function($routeProvider) {
		$routeProvider
			.when('/login', {
				templateUrl: 'tpl/login.html',
				controller: 'sltController'
			}).
			when('/table', {
				templateUrl: 'tpl/table.html',
				controller: 'slttableController',
                resolve:{Products: function($http,API_URL,Providers){
                    //$http.post(API_URL + 'api/Account/ChangeRol?userDbId=7c106a5a-1157-474e-8381-d4a8be5f1639&newRole=dpsvalidator');
                    Providers.setProviders($http.get(API_URL + 'api/DPS/UnvalidatedProviders'));
                    return $http.get(API_URL + 'api/ProductServices?ignoreDpsValidation=true')
                    .then(function(data) {
                            return data.data;
                        });
                }}
			}).
			when('/validate', {
				templateUrl: 'tpl/validate.html',
				controller: 'sltvalidateController',
				resolve:{Departments: function($http,API_URL){
                    
					return $http.get(API_URL +'api/Departments')
						.then(function(data) {
							return data.data;
						});
				}}
			}).
			otherwise({
        	redirectTo: '/login'
      });
	});

	app.run();


	app.controller('sltController',['$scope','$rootScope', '$http','API_URL', function ($scope,$rootScope, $http, API_URL,Departments){

		$scope.url = API_URL;

		//$rootScope.email='';
		$scope.sendLogin = function() {
            $scope.user.grant_type = "password";            
            $http.post($scope.url + 'token', $scope.param($scope.user),{headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).
                success(function(data, status){
                    $scope.status = status;                    
                    $http.defaults.headers.common.Authorization = 'Bearer '+data.access_token;
                    //$http.get($scope.url + 'api/account');
                    
                    $rootScope.email = data.userName;
                    console.log ( $rootScope.email);
                    window.location = '#/table';
                    
                });
        };  
        
        $scope.param = function  (obj) {

	        var str = [];
	        for(var p in obj)
	        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
	        return str.join("&");
	    
	        }
	        /*
        $http({method: 'POST', url: $scope.url+'/token', json: $templateCache}).
                success(function(data, status){
                    $scope.status = status;
                    $scope.data = data;
                    $scope.opciones= data;
                }).
                error(function(data, status) {
                    $[scope.data = data || "Request failed";
                    $sco4pe.status = status;
                });
        */
	 }]);

	app.controller('slttableController', function ($scope,$rootScope, $http, API_URL,Products, Providers){
		$scope.email=$rootScope.email;
		$scope.url = API_URL;
        $scope.products=Products;

		$scope.openValidate = function  (id) {	    	    	
	        
	        window.location = '#/validate';
            ;
	    	
            console.log(Providers.getById(id));
            
	        }

	    $scope.logOut = function  () {

	    	console.log('logout');
	        $http.defaults.headers.common.Authorization='';
	        window.location = '#/login';
	    
	        }
        $scope.getType= function(id){
            return (id == 0)? 'Producto':'Servicio'
        }

		 //NG repeat by integer
	    $scope.number = 5;
		$scope.getNumber = function(num) {

    		return new Array(num);  

		}
	    ///

	});
	
	app.controller('sltvalidateController',['$scope','$rootScope', '$http','API_URL','Departments', function ($scope,$rootScope, $http, API_URL,Departments){
		$scope.Departments=Departments;
		$scope.Cities=[];
		$scope.url = API_URL;
		//console.log(Departments);

		$scope.getCities= function (idDepartment){

    		$http.get($scope.url + 'api/Departments/'+ idDepartment).then(function(data) {
    							$scope.Cities =	data.cities;
    							console.log($scope.Cities);
    						});	

		};

        $scope.validate = function(){
            $http.put();

        }

	}]);

    app.factory('Providers', function(){
        var providers = [];
        return {
            getById: function(id) {
                return providers.filter(function(data){
                    return data.data.Id == id;
                })[0];
            },

            setProviders: function(data) {
                providers = data;
            }
        };
    });

})();