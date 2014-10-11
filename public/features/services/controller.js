function ServicesCtrl($scope, $http) {

	$scope.message = "Hello from controller";

	$scope.create = function () {
		$http.post("/serviceClients", $scope.serviceClient)
		.success(function (response) {
			$scope.all();
		});
	}

	$scope.renderServiceClients = function (response) {
		$scope.serviceClients = response;
	};

	$scope.remove = function (id) {
		$http.delete("/serviceClients/" + id)
		.success(function (response) {
			$scope.all();
		});
	};

	$scope.update = function () {
		$http.put("/serviceClients/" + $scope.serviceClient._id, $scope.serviceClient)
		.success(function(response) {
				$scope.all();
		});
	};

	$scope.select = function (id) {
		$http.get("/serviceClients/" + id)
		.success(function (response) {
			$scope.serviceClient = response;
		});
	};

	$scope.all = function () {
		$http.get("/serviceClients")
		.success($scope.renderServiceClients);
	}

	$scope.all();
}



/*function ServicesCtrl($scope, $http) {
	console.log("Hello from Services Controller");

	$scope.create = function() {
		console.log($scope.serviceClient);
		$http.post("/serviceClients", $scope.serviceClients)
		.success(function(response) {console.log(response);});
	}

	$scope.renderServiceClients = function(response) {
			$scope.serviceClients = response;
	};

	//get all
	$http.get("/serviceClients")
	.success($scope.renderServiceClients);

}*/