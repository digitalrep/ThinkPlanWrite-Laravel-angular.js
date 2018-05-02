	
	app.controller('RegisterController', function($scope, $state, $http){
		$scope.showError = false;
		$scope.done = false;
		
		$scope.error;
		$scope.projects;
		$scope.id;
		
		$scope.register = function(user) {
			$http.post("https://www.thinkplanwrite.comapi/auth/signup", {
				name: user.name,
				email: user.email,
				password: user.password
			}).then(function(result) {
				//token = result.data.token;
				//window.localStorage.token = token;
				$scope.done = true;	
			}, function(error) {
				if(error.status === 422) {
					$scope.showError = true;
				} else {
					$scope.showError2 = true;
				}
			});			
		};	
		
	});