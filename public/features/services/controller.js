function ServicesCtrl($scope, $http) {
	console.log("Hello from Services Controller");

	$scope.renderServiceClients = function(response) {
			$scope.serviceClients = response;
	};

	//get all
	$http.get("/serviceClients")
	.success($scope.renderServiceClients);

}