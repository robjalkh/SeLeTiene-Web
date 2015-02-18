(function (){
	var app = angular.module('logic', ['ngRoute']);

	//app.constant('API_URL', 'http://seletiene.cloudapp.net/');
	app.constant('API_URL', 'http://200.119.110.136:81/seletienea/');
	app.config(function($routeProvider) {
		$routeProvider
			.when('/login', {
				templateUrl: 'tpl/login.html',
				controller: 'sltController'
			}).
			when('/table', {
				templateUrl: 'tpl/table.html',
				controller: 'slttableController'
			}).
			when('/validate', {
				templateUrl: 'tpl/validate.html',
				controller: 'sltvalidateController',
				resolve:{Departments: function($http){
					return $http.get('http://seletiene.cloudapp.net/api/Departments')
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
                    $http.get($scope.url + 'api/ProductServices');
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

	app.controller('slttableController',['$scope','$rootScope', '$http','API_URL', function ($scope,$rootScope, $http, API_URL){
		$scope.email=$rootScope.email;
		$scope.url = API_URL;

		$scope.openValidate = function  (id) {	    	    	
	        
	        window.location = '#/validate';
	    	
	        }

	    $scope.logOut = function  () {

	    	console.log('logout');
	        $http.defaults.headers.common.Authorization='';
	        window.location = '#/login';
	    
	        }

		 //NG repeat by integer
	    $scope.number = 5;
		$scope.getNumber = function(num) {

    		return new Array(num);  

		}
	    ///

	}]);
	
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

	}]);

})();