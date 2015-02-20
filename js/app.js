(function (){
	var app = angular.module('logic', ['ngRoute']);

	app.constant('API_URL', 'http://seletiene.cloudapp.net/');
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
                resolve:{Products: function($http,API_URL){
                    //$http.post(API_URL + 'api/Account/ChangeRol?userDbId=7c106a5a-1157-474e-8381-d4a8be5f1639&newRole=dpsvalidator');
                    return $http.get(API_URL + 'api/ProductServices?ignoreDpsValidation=true')
                    .then(function(data) {
                            return data.data;
                    });
                }}
			}).
			when('/validate/:idProduct', {
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
		$scope.sendLogin = function() {
            $scope.user.grant_type = "password";            
            $http.post($scope.url + 'token', $scope.param($scope.user),{headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).
                success(function(data, status){
                    $scope.status = status;                    
                    $http.defaults.headers.common.Authorization = 'Bearer '+data.access_token;
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
	 }]);

	app.controller('slttableController', function ($scope,$rootScope, $http, API_URL,Products,$location){
		$scope.email=$rootScope.email;
		$scope.url = API_URL;
        $scope.products=Products;

		$scope.openValidate = function  (id) {	    	    	
            $location.path("validate/"+id);    	
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
	});
	
	app.controller('sltvalidateController', function ($scope,$rootScope, $http, API_URL, $routeParams, Departments){
		$scope.Departments=Departments;
		$scope.Cities=[];
		$scope.url = API_URL;
		//console.log(Departments);
		console.log($routeParams.idProduct);



		$scope.getCities= function (idDepartment){

    		$http.get($scope.url + 'api/Departments/'+ idDepartment).then(function(data) {
    							$scope.Cities =	data.cities;
    							console.log($scope.Cities);
    						});	

		};

        $scope.validate = function(){
            $http.put();

        }

	});


})();