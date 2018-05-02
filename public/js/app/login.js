	
	app.controller('LoginController', function($scope, $state, $http, authenticate, $location, $window) {
		
		$scope.login = function(user) {
			$scope.showError = false;		
			$scope.showValidationError = false;
			$scope.showRateError = false;
			$scope.showNoUserError = false;

			if(angular.isUndefined(user)) {
				$scope.showValidationError = true;
				$state.go('login');
			}

			authenticate.login(user.email, user.password)
			.then(function(result) {
				$state.go('dash');
			}, function(error) {
				if(error.status == 401) {
					$scope.showError = true;
				}
				if(error.status == 403) {
					$scope.showRateError = true;
				}
				if(error.status == 422) {
					$scope.showValidationError = true;
				}
				if(error.status == 500) {
					$scope.showInternalError = true;
				}
				console.log("login: " + error.status + " " + error.statusText);
			});
		};
		
	});