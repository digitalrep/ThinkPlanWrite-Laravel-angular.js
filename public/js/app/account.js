	
	app.controller('AccountController', function($scope, $state, $http, $cookies) {
		
		$scope.token = "";
		$scope.uploaded;
		$scope.error = false;
		$scope.success = false;
		
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
			url: 'https://www.thinkplanwrite.com/api/auth/refresh',
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
				url: 'https://www.thinkplanwrite.com/api/user/profile', 
				headers: { 'Authorization' : 'Bearer ' + $scope.token }
			}).then(function(response){
				$scope.user = response.data.user;
			}, function errorCallback(response) {
				console.log(response.status + " " + response.statusText);
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
		
		$scope.clear = function() {
			$scope.error = false;
			$scope.success = false;
		};
		
		$scope.updateAccount = function() {
			console.log("updateAccount called");
			var fd = new FormData();
			var imgBlob = dataURItoBlob($scope.uploaded);
			fd.append("file", imgBlob);
			$http.post("https://www.thinkplanwrite.com/api/user/update", fd, {
				transformRequest: angular.identity,
				headers: {
					'Content-Type': undefined,
					'Authorization': 'Bearer ' + $scope.token
				}
			}).success(function(response) {
				console.log("success " + response.status);
				$scope.error = false;
				$scope.success = true;
			}).error(function(response) {
				console.log("fail " + response.status);
				$scope.error = true;
				$scope.success = false;
			});
		};
		
		function dataURItoBlob(dataURI) {
			var binary = window.atob(dataURI.split(',')[1]);
			var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
			var array = [];
			for (var i = 0; i < binary.length; i++) {
				array.push(binary.charCodeAt(i));
			}
			return new Blob([new Uint8Array(array)], {
				type: mimeString
			});
		};
		
		$scope.deleteAccount = function() {
			console.log("Delete");
			$http({
				method: 'DELETE', 
				url: 'https://www.thinkplanwrite.com/api/user', 
				headers: { 'Authorization' : 'Bearer ' + $scope.token }
			}).then(function(response){
				$scope.id = response.data;
				console.log(response);
				$state.go('home');
			}, function errorCallback(response) {
				console.log(response.status + " " + response.statusText);
				if(response.status === 401) {
					authenticate.logout();
					$state.go('login');
				}
			});				
		};	
	});