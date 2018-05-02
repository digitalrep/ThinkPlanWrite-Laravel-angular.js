	app.controller('MenuController', function($scope, authenticate) {
		
		$scope.showLoggedInMenu = false;
		$scope.showNotLoggedInMenu = false;
		
		var token = authenticate.getLoggedIn();
		
		if (token) {
			$scope.showLoggedInMenu = true;
			$scope.showNotLoggedInMenu = false;
		} else {
			$scope.showLoggedInMenu = false;
			$scope.showNotLoggedInMenu = true;			
		}
		
	});