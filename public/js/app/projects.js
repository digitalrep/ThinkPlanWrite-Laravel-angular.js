		
	app.controller('ProjectsController', function($http, $rootScope, $scope, $state, $stateParams, $timeout, authenticate, $cookies, modalService, $uibModal) {
		
		var project_id = $stateParams.id;
		var count = 0;

		$scope.project = "";
		$scope.writings = "";
		$scope.plotpoints = "";
		$scope.characters = "";
		$scope.newplotpoint = {};
		$scope.newcharacter = {};
		$scope.genders = ["Female", "Male", "Transgender", "Other"];
		
		/*
		$scope.sortableOptions = {
			handle: '.sort',
			update: function(e, ui) {
			},
			stop: function(e, ui) {
				// update order_numbers to reflect ordering here
				//console.table($scope.plotpoints);
				for(var i=0; i<$scope.plotpoints.length; i++) {
					$scope.plotpoints[i].order_number = i;
					$scope.updatePlotpoint2($scope.plotpoints[i]);
				}
				var modalOptions = {
					headerText: 'Plotpoint Updated',
					bodyText: 'Your plotpoint was successfully updated'
				};	
				modalService.showModal({}, modalOptions);				
			},
			axis: 'x',
			'ui-floating': true
		};
		*/
		
		$scope.thingy = function(counter) {
			if($scope.plots.p1[counter] !== undefined) {
				$scope.plots.p1[counter].order_number = $scope.num;
				$scope.num++;
				$scope.plotpoints.push($scope.plots.p1[counter]);
			}
			if($scope.plots.p2[counter] !== undefined) {
				$scope.plots.p2[counter].order_number = $scope.num;
				$scope.num++;
				$scope.plotpoints.push($scope.plots.p2[counter]);
			}
			if($scope.plots.p3[counter] !== undefined) {
				$scope.plots.p3[counter].order_number = $scope.num;
				$scope.num++;
				$scope.plotpoints.push($scope.plots.p3[counter]);
			}
			if($scope.plots.p4[counter] !== undefined) {
				$scope.plots.p4[counter].order_number = $scope.num;
				$scope.num++;
				$scope.plotpoints.push($scope.plots.p4[counter]);
			}			
		};
		
		$scope.update = function() {
			console.log("update");
			$scope.num = 0;	
			var possible_counter = $scope.plotpoints.length+1;
			$scope.plotpoints = [];
			var counter = 0;
			
			for(var i=0; i<possible_counter; i++) {
				$scope.thingy(i);
			}
			
			console.log($scope.plotpoints);
			
			for(var j=0; j<$scope.plotpoints.length; j++) {
				$scope.updatePlotpoint2($scope.plotpoints[j]);				
			}
			
		};
		
		$scope.dragControlListeners = {
			containment: '#grid-container'
		};
		
		$scope.token = "";
		
		// COOKIES FALLBACK - NO LOCAL STORAGE
		
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
				$scope.loading = false;
			}, function errorCallback(response) {
				if(response.status === 401) {
					authenticate.logout();				
					$state.go('login');
				}
			});
		
			// GET PLOTPOINTS BASED ON PROJECT_ID
		
			$http({
				method: 'GET', 
				url: '/api/plotpoints/' + project_id, 
				headers: { 'Authorization' : 'Bearer ' + $scope.token }
			}).then(function(response){
				$scope.plotpoints = response.data;
				$scope.loading = false;

				$scope.plots = {
					p1: [],
					p2: [],
					p3: [],
					p4: []
				};
				
				var current = 1;
				
				angular.forEach($scope.plotpoints, function(value, key) {
					if(current==5) {
						current = 1;
					}
					if(current==1) {
						$scope.plots.p1.push(value);
					}
					if(current==2) {
						$scope.plots.p2.push(value);
					}
					if(current==3) {
						$scope.plots.p3.push(value);
					}
					if(current==4) {
						$scope.plots.p4.push(value);
					}
					current++;
				});
				
			}, function errorCallback(response) {
				$scope.loading = false;
				if(response.status === 401) {
					authenticate.logout();
					$state.go('login');
				}
			});			
		
			// GET CHARACTERS BASED ON PROJECT_ID
		
			$http({
				method: 'GET', 
				url: '/api/characters/' + project_id, 
				headers: { 'Authorization' : 'Bearer ' + $scope.token }
			}).then(function(response){
				$scope.characters = response.data;
				$scope.loading = false;
			}, function errorCallback(response) {
				$scope.loading = false;
				if(response.status === 401) {
					authenticate.logout();
					$state.go('login');
				}
			});
				
			/*
			$http({
				method: 'GET', 
				url: '/api/writings/' + project_id, 
				headers: { 'Authorization' : 'Bearer ' + $scope.token }
			}).then(function(response){
				$scope.writings = response.data;
				$scope.writing = $scope.writings[0];
				$scope.writing.changed = false;
				$scope.current = 0;
				$scope.previous = null;
				$scope.next = $scope.writings[1];
			}, function errorCallback(response) {
				if(response.status === 401) {
					authenticate.logout();
					$state.go('login');
				}
			});	
			*/
			
		}, function errorCallback(response){
			//console.log("refresh failed " + response.status + " " + response.statusText);
			authenticate.logout();
			$state.go('login');			
		});
		
		// sort plotpoints into columns
		
		
		// UPDATE PROJECT
	
		$scope.updateProject = function(project) {
			var modalOptions = {
				headerText: 'Project Updated',
				bodyText: 'Your project was successfully updated'
			};
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
					//window.confirm('Updated Project Title');
				}, function errorCallback(response) {
					//window.confirm('Project Title Could Not Be Updated');
					if(response.status === 401) {
						authenticate.logout();
						$state.go('login');
					}
				});
				modalService.showModal({}, modalOptions);
			}, function errorCallback(response) {
				if(response.status === 401) {
					$state.go('login');
				}
			});	
		}
		
		// DELETE CHARACTER
		
		$scope.deleteCharacter = function(character) {
			var modalOptions = {
				closeButtonText: 'Cancel',
				actionButtonText: 'Delete Character',
				headerText: 'Delete Character Confirmation',
				bodyText: 'Are you sure you want to delete this character?'
			};
			modalService.showModal({}, modalOptions)
			.then(function(result){
				console.log("result: " + result);
				var pid = character.project_id;
				$http({
					method: 'DELETE', 
					url: '/api/character/' + character.id, 
					headers: { 'Authorization' : 'Bearer ' + $scope.token }
				}).then(function(response){
					$http({
						method: 'GET', 
						url: '/api/characters/' + pid, 
						headers: { 'Authorization' : 'Bearer ' + $scope.token }
					}).then(function(response){
						$scope.characters = response.data;
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
		
		// ADD CHARACTER
		
		$scope.addCharacter = function() {
			var modalInstance = $uibModal.open({
				templateUrl: "characterModal.html",
				controller: "AddCharacterController",
				size: "sm",
				resolve: {
					newcharacter: function() {
						return $scope.newcharacter;
					}
				}
			});
				
			modalInstance.result.then(function(newcharacter) {
				$http({
					method: 'POST', 
					url: '/api/character/store', 
					headers: { 'Authorization' : 'Bearer ' + $scope.token },
					data: { 'name' : newcharacter.name, 'bio' : newcharacter.bio, 'gender' : newcharacter.gender, 'age' : newcharacter.age, 'project_id' :  $scope.project.id }
				}).then(function(response){				
					$http({
						method: 'GET', 
						url: '/api/characters/' + project_id, 
						headers: { 'Authorization' : 'Bearer ' + $scope.token }
					}).then(function(response){
						$scope.characters = response.data;
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
		
		// UPDATE CHARACTER
		
		$scope.updateCharacter = function(character) {
			var modalOptions = {
				headerText: 'Character Updated',
				bodyText: 'Your Character was successfully updated'
			};
			$http({
				method: 'PUT', 
				url: '/api/character/' + character.id, 
				headers: { 'Authorization' : 'Bearer ' + $scope.token },
				data: { 'name' : character.name, 'bio' : character.bio, 'gender' : character.gender, 'age' : character.age }
			}).then(function(response){
				$http({
					method: 'GET', 
					url: '/api/characters/' + project_id, 
					headers: { 'Authorization' : 'Bearer ' + $scope.token }
				}).then(function(response){
					$scope.characters = response.data;
				}, function errorCallback(response) {
					if(response.status === 401) {
						authenticate.logout();
						$state.go('login');
					}
				});
				modalService.showModal({}, modalOptions);
			}, function errorCallback(response) {
				if(response.status === 401) {
					$state.go('login');
				}
			});	
		}

		// DELETE PLOTPOINT
		
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
						$scope.plots = {
							p1: [],
							p2: [],
							p3: [],
							p4: []
						};
						
						var current = 1;
						
						angular.forEach($scope.plotpoints, function(value, key) {
							if(current==5) {
								current = 1;
							}
							if(current==1) {
								$scope.plots.p1.push(value);
							}
							if(current==2) {
								$scope.plots.p2.push(value);
							}
							if(current==3) {
								$scope.plots.p3.push(value);
							}
							if(current==4) {
								$scope.plots.p4.push(value);
							}
							current++;
						});
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
		
		// ADD PLOTPOINT
		
		$scope.addPlotpoint = function() {
			var modalInstance = $uibModal.open({
				templateUrl: "plotpointModal.html",
				controller: "AddPlotpointController",
				size: "sm",
				resolve: {
					newplotpoint: function() {
						return $scope.newplotpoint;
					}
				}
			});
				
			modalInstance.result.then(function(newplotpoint) {
				$http({
					method: 'POST', 
					url: '/api/plotpoint/store', 
					headers: { 'Authorization' : 'Bearer ' + $scope.token },
					data: { 'title' : newplotpoint.title, 'description' : newplotpoint.description, 'order_number' : '', 'project_id' :  $scope.project.id }
				}).then(function(response){				
					$http({
						method: 'GET', 
						url: '/api/plotpoints/' + project_id, 
						headers: { 'Authorization' : 'Bearer ' + $scope.token }
					}).then(function(response){
						$scope.plotpoints = response.data;
						$scope.plots = {
							p1: [],
							p2: [],
							p3: [],
							p4: []
						};
						
						var current = 1;
						
						angular.forEach($scope.plotpoints, function(value, key) {
							if(current==5) {
								current = 1;
							}
							if(current==1) {
								$scope.plots.p1.push(value);
							}
							if(current==2) {
								$scope.plots.p2.push(value);
							}
							if(current==3) {
								$scope.plots.p3.push(value);
							}
							if(current==4) {
								$scope.plots.p4.push(value);
							}
							current++;
						});
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
	
		
		// UPDATE PLOTPOINT
		
		$scope.updatePlotpoint = function(plotpoint) {
			var modalOptions = {
				headerText: 'Plotpoint Updated',
				bodyText: 'Your plotpoint was successfully updated'
			};
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
						$scope.plots = {
							p1: [],
							p2: [],
							p3: [],
							p4: []
						};
						
						var current = 1;
						
						angular.forEach($scope.plotpoints, function(value, key) {
							if(current==5) {
								current = 1;
							}
							if(current==1) {
								$scope.plots.p1.push(value);
							}
							if(current==2) {
								$scope.plots.p2.push(value);
							}
							if(current==3) {
								$scope.plots.p3.push(value);
							}
							if(current==4) {
								$scope.plots.p4.push(value);
							}
							current++;
						});
				}, function errorCallback(response) {
					if(response.status === 401) {
						authenticate.logout();
						$state.go('login');
					}
				});
				modalService.showModal({}, modalOptions);
			}, function errorCallback(response) {
				if(response.status === 401) {
					$state.go('login');
				}
			});	
		}
		
		$scope.updatePlotpoint2 = function(plotpoint) {
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
						$scope.plots = {
							p1: [],
							p2: [],
							p3: [],
							p4: []
						};
						
						var current = 1;
						
						angular.forEach($scope.plotpoints, function(value, key) {
							if(current==5) {
								current = 1;
							}
							if(current==1) {
								$scope.plots.p1.push(value);
							}
							if(current==2) {
								$scope.plots.p2.push(value);
							}
							if(current==3) {
								$scope.plots.p3.push(value);
							}
							if(current==4) {
								$scope.plots.p4.push(value);
							}
							current++;
						});
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
		
	});