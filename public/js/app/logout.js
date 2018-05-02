	
	app.controller('LogoutController', function($scope, $state, $http, authenticate) {
		authenticate.logout();
	});