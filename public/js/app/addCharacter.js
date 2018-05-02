	app.controller("AddCharacterController", function($scope, $modalInstance, newcharacter) {
		
			$scope.newcharacter = newcharacter;
			
			$scope.ok = function() {
				$modalInstance.close($scope.newcharacter);
			};
			
			$scope.cancel = function() {
				$modalInstance.dismiss("Cancel");
			};
	
	});