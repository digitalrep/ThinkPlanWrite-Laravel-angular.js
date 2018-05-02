	app.controller("AddPlotpointController", function($scope, $modalInstance, newplotpoint) {
		
			$scope.form = {};
			
			$scope.newplotpoint = newplotpoint;
			
			$scope.ok = function() {
				$modalInstance.close($scope.newplotpoint);
			};
			
			$scope.cancel = function() {
				$modalInstance.dismiss("Cancel");
			};
	
	});