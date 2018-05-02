		
	app.controller('PlotpointsController', function($http, $rootScope, $scope, $state, $stateParams, $timeout, authenticate, $cookies, modalService) {
		
		var project_id = $stateParams.id;
		$scope.oneAtATime = false;
		
		$scope.project = "";
		$scope.plotpoints = "";
		$scope.newplot = { title : "New Plotpoint Title", description : "New Plotpoint Description" };
		
		// GET TOKEN - FROM LOCAL STORAGE OR COOKIE
		
		$scope.token = "";
		
		if(typeof window.localStorage === 'object'){
			try {
				window.localStorage.blah = "blah";
				$scope.token = window.localStorage.token;
			} catch(e) {
				Storage.prototype._setItem = Storage.prototype.setItem;
				Storage.prototype.setItem = function() {};
				$scope.token = $cookies.get("token");
			}
		}
		
		$scope.sortableOptions = {
			update: function(e, ui) {
			},
			stop: function(e, ui) {
				// update order_numbers to reflect ordering here
				console.table($scope.plotpoints);
				
				for(var i=0; i<$scope.plotpoints.length; i++) {
					$scope.plotpoints[i].order_number = i;
					$scope.updatePlotpoint($scope.plotpoints[i]);
				}
				
			}
		};
		
		$scope.loading = true;		
		
		// REFRESH TOKEN
		
		$http({
			method: 'POST',
			url: '/api/auth/refresh',
			headers: { 'Authorization' : 'Bearer ' + $scope.token }
		}).then(function(result){
			
			if(typeof window.localStorage === 'object'){
				try {
					window.localStorage.blah = "blah";
					window.localStorage.token = result.data.token;
					$scope.token = window.localStorage.token;
				} catch(e) {
					Storage.prototype._setItem = Storage.prototype.setItem;
					Storage.prototype.setItem = function() {};
					$cookies.put("token", result.data.token);
					$scope.token = $cookies.get("token");
				}
			}
		 
			// GET PROJECT BASED ON PROJECT_ID
		 
			$http({
				method: 'GET', 
				url: '/api/project/' + project_id, 
				headers: { 'Authorization' : 'Bearer ' + $scope.token }
			}).then(function(response){
				$scope.project = response.data.project;
			}, function errorCallback(response) {
				if(response.status === 401) {
					authenticate.logout();				
					$state.go('login');
				}
			});
			
			// NOW GET PLOTPOINTS BASED ON PROJECT_ID
		
			$http({
				method: 'GET', 
				url: '/api/plotpoints/' + project_id, 
				headers: { 'Authorization' : 'Bearer ' + $scope.token }
			}).then(function(response){
				$scope.plotpoints = response.data;
				$scope.loading = false;
			}, function errorCallback(response) {
				$scope.loading = false;
				if(response.status === 401) {
					authenticate.logout();
					$state.go('login');
				}
			});	
		}, function errorCallback(response){
			console.log("refresh failed " + response.status + " " + response.statusText);
			authenticate.logout();
			$state.go('login');			
		});
		
		/* not use this yet */
		
		$scope.updatePlotpoint = function(plotpoint) {

			$http({
				method: 'PUT', 
				url: '/api/plotpoint/' + plotpoint.id, 
				headers: { 'Authorization' : 'Bearer ' + $scope.token },
				data: { 
					'title' : plotpoint.title, 
					'description' : plotpoint.description,
					'order_number' : plotpoint.order_number 
				}
			}).then(function(response){
				$http({
					method: 'GET', 
					url: '/api/project/' + project_id, 
					headers: { 'Authorization' : 'Bearer ' + $scope.token }
				}).then(function(response){
					$scope.project = response.data.project;
				}, function errorCallback(response) {
					if(response.status === 401) {
						authenticate.logout();
						$state.go('login');
					}
				});
			}, function errorCallback(response) {
				if(response.status === 401) {
					$state.go('login');
				}
			});	
		}
		
		$scope.updateProject = function(project) {
			$http({
				method: 'PUT', 
				url: '/api/project/' + project.id, 
				headers: { 'Authorization' : 'Bearer ' + $scope.token },
				data: { 'title' : project.title }
			}).then(function(response){
				$http({
					method: 'GET', 
					url: '/api/project/' + project_id, 
					headers: { 'Authorization' : 'Bearer ' + $scope.token }
				}).then(function(response){
					$scope.project = response.data.project;
				}, function errorCallback(response) {
					if(response.status === 401) {
						authenticate.logout();
						$state.go('login');
					}
				});
			}, function errorCallback(response) {
				if(response.status === 401) {
					$state.go('login');
				}
			});	
		}
		
		$scope.deletePlotpoint = function(plotpoint) {
			var modalOptions = {
				closeButtonText: 'Cancel',
				actionButtonText: 'Delete Plotpoint',
				headerText: 'Delete Plotpoint Confirmation',
				bodyText: 'Are you sure you want to delete this plotpoint?'
			};
			modalService.showModal({}, modalOptions)
			.then(function(result){
				var pid = plotpoint.project_id;
				$http({
					method: 'DELETE', 
					url: '/api/plotpoint/' + plotpoint.id, 
					headers: { 'Authorization' : 'Bearer ' + $scope.token }
				}).then(function(response){
					$http({
						method: 'GET', 
						url: '/api/plotpoints/' + project_id, 
						headers: { 'Authorization' : 'Bearer ' + $scope.token }
					}).then(function(response){
						$scope.plotpoints = response.data;
					}, function errorCallback(response) {
						if(response.status === 401) {
							authenticate.logout();
							$state.go('login');
						}
					});
				}, function errorCallback(response) {
					if(response.status === 401) {
						authenticate.logout();
						$state.go('login');
					}
				});		
			});
		}
		
		/* not use this yet */
		
		$scope.addPlotpoint = function(plotpoint) {
			$http({
				method: 'POST', 
				url: '/api/plotpoint/store', 
				headers: { 'Authorization' : 'Bearer ' + $scope.token },
				data: { 'title' : plotpoint.title, 'description' : plotpoint.description, 'order_number' : '', 'project_id' :  $scope.project.id }
			}).then(function(response){				
				$http({
					method: 'GET', 
					url: '/api/plotpoints/' + project_id, 
					headers: { 'Authorization' : 'Bearer ' + $scope.token }
				}).then(function(response){
					$scope.plotpoints = response.data;
					// Clear add plotpoint nub
					var title = angular.element(document.querySelector("#newpptitle"));
					var desc = angular.element(document.querySelector("#newppdesc"));
					title.val('');
					desc.val('');
				}, function errorCallback(response) {
					if(response.status === 401) {
						authenticate.logout();
						$state.go('login');
					}
				});
			}, function errorCallback(response) {
				if(response.status === 401) {
					authenticate.logout();
					$state.go('login');
				}
			});	
		}
		
		$scope.print = function(writing) {
			var new_window = window.open();
			new_window.document.write("<div style='font-family: Raleway, sans-serif; line-height: 2; font-size: 14px;'>");
			new_window.document.write("<h3 style='font-weight: bold;'>" + writing.title + "</h3>");
			text = writing.content.replace(/\n\r?/g, '<br>');
			new_window.document.write(text);
			new_window.document.write("</div>");
			new_window.focus();
			new_window.print();
			new_window.close();
		}
		
	});