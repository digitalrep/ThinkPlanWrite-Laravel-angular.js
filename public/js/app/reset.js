	
	app.controller('ResetController', function($scope, authenticate, $stateParams) {		
		$scope.showUnknownError = false;		
		$scope.showEmailValidationError = false;
		$scope.showNoEmailError = false;
		$scope.showNomatchError = false;
		$scope.done = false;
		
		$scope.reset = function(user) {
			
			user.email = $stateParams.email;
			user.token = $stateParams.token; 
		
			if(angular.isUndefined(user.password1)) {
				$scope.showEmailValidationError = true;
			}
			
			if(angular.isUndefined(user.password2)) {
				$scope.showEmailValidationError = true;
			}
		
			authenticate.reset(user.email, user.password1, user.password2, user.token)
			.then(function(result) {
				$scope.done = true;	
			}, function(error){
				console.log(error.status + ", " + error.statusText);
				$scope.showUnknownError = true;
			});
		};

	});