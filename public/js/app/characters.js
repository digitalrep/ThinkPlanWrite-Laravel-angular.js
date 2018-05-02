		
	app.controller('CharactersController', function($http, $rootScope, $scope, $state, $stateParams, $timeout, authenticate, $cookies, modalService) {
		
		var project_id = $stateParams.id;
		
		$scope.project = "";
		$scope.characters = "";
		$scope.newchar = { name : "New Character Name", bio : "New Character Bio" };
		$scope.genders = ["Female", "Male", "Transgender", "Other"];
		
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
			
			// NOW GET CHARACTERS BASED ON PROJECT_ID
		
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
		}, function errorCallback(response){
			console.log("refresh failed " + response.status + " " + response.statusText);
			authenticate.logout();
			$state.go('login');			
		});
		
		/* not use this yet */
		
		$scope.updateCharacter = function(character) {
			console.log(character.name);
			console.log(character.bio);
			console.log(character.gender);
			console.log(character.age);
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
		
		$scope.deleteCharacter = function(character) {
			console.log("delete character");
			var modalOptions = {
				closeButtonText: 'Cancel',
				actionButtonText: 'Delete Character',
				headerText: 'Delete Character Confirmation',
				bodyText: 'Are you sure you want to delete this character?'
			};
			modalService.showModal({}, modalOptions)
			.then(function(result){
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
		
		/* not use this yet */
		
		$scope.addCharacter = function(character) {
			$http({
				method: 'POST', 
				url: '/api/character/store', 
				headers: { 'Authorization' : 'Bearer ' + $scope.token },
				data: { 'name' : character.name, 'bio' : character.bio, 'gender' : character.gender, 'age' : character.age, 'project_id' :  $scope.project.id }
			}).then(function(response){				
				$http({
					method: 'GET', 
					url: '/api/characters/' + project_id, 
					headers: { 'Authorization' : 'Bearer ' + $scope.token }
				}).then(function(response){
					$scope.characters = response.data;
					// Clear add character nub
					var title = angular.element(document.querySelector("#newchartitle"));
					var desc = angular.element(document.querySelector("#newchardesc"));
					var age = angular.element(document.querySelector("#newcharage"));
					var gender = angular.element(document.querySelector("#newchargender"));
					title.val('New Character Name');
					desc.val('New Character Bio');
					age.val('');
					gender.val('');
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