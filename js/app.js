(function (){
	var app = angular.module('logic', ['ngRoute']);

	app.constant('API_URL', 'http://seletiene.cloudapp.net/');
	app.config(function($routeProvider) {
		$routeProvider
			.when('/login', {
				templateUrl: 'tpl/login.html',
				controller: 'sltController'
			});
	});


	app.controller('sltController',['$scope', '$http','API_URL', function ($scope, $http, API_URL){

		$scope.url = API_URL;
		$scope.sendLogin = function() {
            $scope.user.grant_type = "password";
            //$scope.user = {"grant_type":"password"};
            //console.log($scope.user);
            $http.post($scope.url + 'token', $scope.param($scope.user),{headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).
                success(function(data, status){
                    $scope.status = status;                    
                    $http.defaults.headers.common.Authorization = 'Bearer '+data.access_token;
                    //$http.get($scope.url + 'api/account');
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

})();