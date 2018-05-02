	app.controller('HomeController', function($scope, authenticate, $location, $anchorScroll) {
		
		$scope.scrollTo = function(id) {
			$location.hash(id);
			$anchorScroll();
		}
		
	});