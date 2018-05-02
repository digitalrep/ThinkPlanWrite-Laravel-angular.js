		
	app.controller('WritingController', function($http, $rootScope, $scope, $state, $stateParams, $interval, authenticate, $cookies, modalService) {
		
		var writing_id = $stateParams.id;
		$scope.project_name = $stateParams.project_name;
		$scope.project_id = 0;
		var count = 0;
		$scope.textarea = document.getElementById('writingTextArea');
		$scope.pos = 0;
		
		$scope.writing = "";
		$scope.wordcount = 0;
		$scope.saveStatus = "unchanged";
		
		$scope.textarea.oninput = function() {
			var words = this.value.match(/\S+/g).length;
			$scope.wordcount = words;
			console.log("Firing");
		}
		
		$scope.$watch('writing.content', function(){
			count++;
			if(count > 2){
				var updatedstr = "updated";
				var idx = $scope.saveStatus.indexOf(updatedstr);
				var updated = false;
				if(idx > -1) { updated = true; }
				if($scope.saveStatus == "unchanged" | updated){
					$scope.saveStatus = "updated but not saved";
				}
			}
		});
		
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
		 
			$http({
				method: 'GET', 
				url: '/api/writing/' + writing_id, 
				headers: { 'Authorization' : 'Bearer ' + $scope.token }
			}).then(function(response){
				$scope.writing = response.data.writing;
				$scope.project_id = $scope.writing.project_id;
				$scope.wordcount = response.data.writing.wordcount;
				$scope.loading = false;
			}, function errorCallback(response) {
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

		$scope.setSelectionRange = function(input, selectionStart, selectionEnd) {
			if (input.setSelectionRange) {
				input.focus();
				input.setSelectionRange(selectionStart, selectionEnd);
			}
			else if (input.createTextRange) {
				var range = input.createTextRange();
				range.collapse(true);
				range.moveEnd('character', selectionEnd);
				range.moveStart('character', selectionStart);
				range.select();
			}
		}
		
		$scope.updateWriting = function(writing) {
			$scope.pos = $scope.getCaretPosition($scope.textarea);
			console.log("Position before save: " + $scope.pos.start);
			$http({
				method: 'PUT', 
				url: '/api/writing/' + writing.id, 
				headers: { 'Authorization' : 'Bearer ' + $scope.token },
				data: { 'title' : writing.title, 'content' : writing.content, 'wordcount' : writing.wordcount, 'order_number' : writing.order_number }
			}).then(function(response){
				$http({
					method: 'GET', 
					url: '/api/writing/' + writing_id, 
					headers: { 'Authorization' : 'Bearer ' + $scope.token }
				}).then(function(response){
					$scope.wordcount = response.data.writing.wordcount;
				}, function errorCallback(response) {
					console.log(response.status + ", " + response.statusText);
					if(response.status === 401) {
						authenticate.logout();
						$state.go('login');
					}
					if(response.status === 404) {
						console.log("404 error");
					}
				});
				$scope.saveStatus = "updated";
			}, function errorCallback(response) {
				console.log(response.status + ", " + response.statusText);
				if(response.status === 401) {
					$state.go('login');
				}
			});	
		}
		
		$scope.deleteWriting = function(writing) {
			var modalOptions = {
				closeButtonText: 'Cancel',
				actionButtonText: 'Delete Writing',
				headerText: 'Delete Writing Confirmation',
				bodyText: 'Are you sure you want to delete this writing?'
			};
			modalService.showModal({}, modalOptions)
			.then(function(result){
				$http({
					method: 'DELETE', 
					url: '/api/writing/' + writing.id, 
					headers: { 'Authorization' : 'Bearer ' + $scope.token }
				}).then(function(response){
					$http({
						method: 'GET', 
						url: '/api/writings/' + writing_id, 
						headers: { 'Authorization' : 'Bearer ' + $scope.token }
					}).then(function(response){
						//window.confirm('Writing Deleted');
						$state.go('dash');
					}, function errorCallback(response) {
						//window.confirm('Writing Could Not Be Deleted');
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
			$scope.writing = $scope.writings[0];
		}
		
		function countWords(str) {
			return str.split(/\s+/).length;
		}
		
	});
