	
	app.controller('RecoveryController', function($scope, authenticate) {

		$scope.showUnknownError = false;		
		$scope.showEmailValidationError = false;
		$scope.showNoEmailError = false;
		$scope.done = false;
		
		console.log("recovery");
		
		$scope.recover = function(user) {
		
			if(angular.isUndefined(user)) {
				$scope.showEmailValidationError = true;
			}
		
			authenticate.recovery(user.email)
			.then(function(result) {
				$scope.done = true;	
			}, function(error){
				console.log(error.status + ", " + error.statusText);
				if(error.status === 404) {
					$scope.showUnknownError = true;
				} else {
					$scope.showNoEmailError = true;
				}
			});
		};

	});