	
	app.controller('VerifyController', function($scope, authenticate, $stateParams) {		
		$scope.showInvalidError = false;		
		$scope.showNoCodeError = false;
		$scope.done = false;
		
		$scope.code = $stateParams.code;
		
		if(angular.isUndefined($scope.code)) {
			$scope.showNoCodeError = true;
		}
			
		authenticate.verify($scope.code)
		.then(function(result) {
			$scope.done = true;	
		}, function(error){
			console.log(error.status + ", " + error.statusText);
			$scope.showInvalidError = true;
		});

	});