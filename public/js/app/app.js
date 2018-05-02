
	//var app = angular.module('tpw', ['fullPage.js', 'ngSanitize', 'ui.bootstrap', 'ui.router', 'monospaced.elastic', 'slick', 'chart.js', 'googlechart', 'ngCookies', 'ui.sortable']);
	var app = angular.module('tpw', ['fullPage.js', 'ngSanitize', 'ui.bootstrap', 'ui.router', 'monospaced.elastic', 'slick', 'chart.js', 'googlechart', 'ngCookies', 'as.sortable']);
	
	app.filter('myDateFormat', ['$filter', function($filter) {
		return function(input) {
			if(input === undefined) { return; }
			if(input === null) { return; }
			var  tempdate = new Date(input.replace(/-/g,"/"));
			return $filter('date')(tempdate, "MMMM dd, yyyy");
		}
	}]);
	
	app.filter('truncateContent', function () {
		return function(input) {
			if(input === undefined) { return; }
			var string = input;
			string = input.replace(/\<br>/g, " ");
			return string.substr(0, 70);
		}
	});
	
	app.filter('lineBreakify', function () {
		return function(input) {
			if(input === undefined) { return; }
			return input.replace(/\n/g, '<br/>') + "<br/><br/>";
		}
	});
	
	app.directive("contenteditable", function() {
		return {
			restrict: "A",
			require: "ngModel",
			link: function(scope, element, attrs, ngModel) {
				function read() {
					ngModel.$setViewValue(element.html());
				}
				
				/*
				ngModel.$render = function() {
					element.html($sce.getTrustedHtml(ngModel.$viewValue || ""));
				};
				*/
				
				ngModel.$render = function() {
					element.html(ngModel.$viewValue || "");
				};

				element.bind("blur keyup change", function() {
					scope.$apply(read);
				});
			}
		};
	});
	
	app.directive('truncate', function($parse) {
		return {
			require: 'ngModel',
			link: function(scope, element, attrs, modelController) {
				var trunc = function(input) {
					if(input === undefined) { input = ''; }
					var truncated = input.substr(0, 70);
					if(truncated !== input) {
						modelController.$setViewValue(truncated);
						modelController.$render();
					}
					return truncated;
				}
				modelController.$parsers.push(truncated);
				trunc($parse(attrs.ngModel)(scope));
			}
		};
	});
	
	app.directive('myChart', function() {
		return {
			restrict: 'A',
			scope: {},
			link: function($scope, $element, $attrs) {	
				$scope.$on('controllerUpdate', function(event, projects) {
					
					var colors = ["#72849d", "#efd4a8", "#6c9a90", "#a0cc8f", "#efc3a8", "#e29ea9"];
					var i = 0;
					var j = 0;
					
					$scope.ps = projects;
					$scope.maxwidth = 0;
					
					angular.forEach($scope.ps, function(value, key) {
						if(value.wordcount > $scope.maxwidth) {
							$scope.maxwidth = value.wordcount;
						}
						if(i < colors.length) {
							$scope.ps[j].color = colors[i];
						} else {
							i = 0;
							$scope.ps[j].color = colors[i];
						}
						i++;
						j++;
					});
					
					i = 0;
					
					angular.forEach($scope.ps, function(value, key) {
						$scope.ps[i].percentage = (value.wordcount / $scope.maxwidth) * 100;
						i++;
					});
				});
			},
			templateUrl: 'chart.html'
		};
	});
	
	app.directive('fileread', function() {
		return {
			scope: { fileread: "=" },
			link: function($scope, $element, $attrs) {
				$element.bind("change", function(changeEvent) {
					var reader = new FileReader();
					reader.onload = function(loadEvent) {
						$scope.$apply(function() {
							$scope.fileread = loadEvent.target.result;
						});
					}
					reader.readAsDataURL(changeEvent.target.files[0]);
				});
			}
		};
	});
	
	app.config(['ChartJsProvider', function(ChartJsProvider) {
		ChartJsProvider.setOptions({
			chartColors: ['#6c9a90', '#72849d', '#efd4a8', '#e29ea9', '#efc3a8', '#a0cc8f']
		});
	}]);
	
	app.service("modalService", ['$uibModal', function($uibModal) {
		
		var modalDefaults = {
			backdrop: true,
			keyboard: true,
			modalFade: true,
			templateUrl: '../../modal.html'
		};
		
		var modalOptions = {
			closeButtonText: 'Close',
			actionButtonText: 'OK',
			headerText: 'Proceed?',
			bodyText: 'Perform this action?'
		};
		
		this.showModal = function(customModalDefaults, customModalOptions) {
			if (!customModalDefaults) { customModalDefaults = {}; }
			customModalDefaults.backdrop = 'static';
			return this.show(customModalDefaults, customModalOptions);
		};
		
		this.show = function(customModalDefaults, customModalOptions) {
			
			var tempModalDefaults = {};
			var tempModalOptions = {};
			
			angular.extend(tempModalDefaults, modalDefaults, customModalDefaults);
			angular.extend(tempModalOptions, modalOptions, customModalOptions);
			
			if (!tempModalDefaults.controller) {
				tempModalDefaults.controller = function ($scope, $modalInstance) {
					$scope.modalOptions = tempModalOptions;
					$scope.modalOptions.ok = function (result) {
						$modalInstance.close(result);
					};
					$scope.modalOptions.close = function (result) {
						$modalInstance.dismiss('cancel');
					};
				};
            }
			
			return $uibModal.open(tempModalDefaults).result;
			
        };
		
	}]);
	
	app.service("plotpointModalService", ['$uibModal', function($uibModal) {
		
		var modalDefaults = {
			backdrop: true,
			keyboard: true,
			modalFade: true,
			templateUrl: '../../plotpointModal.html'
		};
		
		var modalOptions = {
			closeButtonText: 'Close',
			actionButtonText: 'OK',
			headerText: 'Proceed?',
			bodyText: 'Perform this action?'
		};
		
		this.showModal = function(modalDefaults, customModalOptions) {
			if (!customModalDefaults) { 
				customModalDefaults = {}; 
			}
			customModalDefaults.backdrop = 'static';
			return this.show(customModalDefaults, customModalOptions);
		};
		
		this.show = function() {
			
			var tempModalDefaults = {};
			var tempModalOptions = {};
			
			angular.extend(tempModalDefaults, modalDefaults, customModalDefaults);

			if (!tempModalDefaults.controller) {
				tempModalDefaults.controller = function ($scope, $modalInstance) {
					$scope.modalOptions = tempModalOptions;
					$scope.modalOptions.ok = function (newplotpoint) {
						$modalInstance.close(newplotpoint);
					};
				};
            }
			
			return $uibModal.open(tempModalDefaults).newplotpoint;
			
        };
		
	}]);
	
	app.service("modal2Service", ['$uibModal', function($uibModal) {
		
		var modalDefaults = {
			backdrop: true,
			keyboard: true,
			modalFade: true,
			templateUrl: '../../modal2.html'
		};
		
		var modalOptions = {
			closeButtonText: 'OK',
			headerText: 'Proceed?',
			bodyText: 'Perform this action?'
		};
		
		this.showModal = function(customModalDefaults, customModalOptions) {
			if (!customModalDefaults) { customModalDefaults = {}; }
			customModalDefaults.backdrop = 'static';
			return this.show(customModalDefaults, customModalOptions);
		};
		
		this.show = function(customModalDefaults, customModalOptions) {
			
			var tempModalDefaults = {};
			var tempModalOptions = {};
			
			angular.extend(tempModalDefaults, modalDefaults, customModalDefaults);
			angular.extend(tempModalOptions, modalOptions, customModalOptions);

			if (!tempModalDefaults.controller) {
				tempModalDefaults.controller = function ($scope, $modalInstance) {
					$scope.modalOptions = tempModalOptions;
					$scope.modalOptions.ok = function (result) {
						$modalInstance.close(result);
					};
				};
            }
			
			return $uibModal.open(tempModalDefaults).result;
			
        };
		
	}]);
	
	app.factory("authenticate", ["$http", "$q", "$window", "$cookies", function ($http, $q, $window, $cookies) {
		var userInfo;

		function login(email, password) {
			var deferred = $q.defer();
			$http.post("https://www.thinkplanwrite.com/api/auth/login", { email: email, password: password })
			.then(function (result) {
				if(typeof window.localStorage === 'object'){
					try {
						window.localStorage.token = result.data.token;
					} catch(e) {
						Storage.prototype._setItem = Storage.prototype.setItem;
						Storage.prototype.setItem = function() {};
						$cookies.put("token", result.data.token);
					}
					deferred.resolve(result.data.token);
				}
			}, function (error) {
				deferred.reject(error);
			});
			return deferred.promise;
		}
		
		function refresh() {
			var deferred = $q.defer();
			var token = "";
			if($cookies.get("token") !== undefined){
				token = $cookies.get("token");
			} else {
				token = window.localStorage.token;
			}
			$http({
				method: 'POST',
				url: 'https://www.thinkplanwrite.com/api/auth/refresh',
				headers: { 'Authorization' : 'Bearer' + token }
			}).then(function(result){
				if(typeof window.localStorage === 'object'){
					try {
						window.localStorage.token = result.data.token;
					} catch(e) {
						Storage.prototype._setItem = Storage.prototype.setItem;
						Storage.prototype.setItem = function() {};
						$cookies.put("token", result.data.token);
					}
					deferred.resolve(result.data.token);
				}
			}, function (error){
				deferred.reject(error);
			});
			return deferred.promise;
		}
		
		function getLoggedIn() {
			var token;
			if(typeof window.localStorage === 'object'){
				try {
					window.localStorage.blah = "blah";
					token = window.localStorage.token;
				} catch(e) {
					Storage.prototype._setItem = Storage.prototype.setItem;
					Storage.prototype.setItem = function() {};
					token = $cookies.get("token");
				}
			} 

			return token;
		}

		function logout() {
			
			/*
			var deferred = $q.defer();
			$http({
				method: "GET",
				url: "https://www.thinkplanwrite.com/api/auth/logout"
			}).then(function (result) {
				deferred.resolve(result);
			}, function (error) {
				deferred.resolve(error);
			});
			*/
			
			if(typeof window.localStorage === 'object'){
				try {
					window.localStorage.clear();
					window.localStorage.removeItem('token');
					window.localStorage.blah = "blah";
				} catch(e) {
					Storage.prototype._setItem = Storage.prototype.setItem;
					Storage.prototype.setItem = function() {};
					$cookies.put("token", "");
					$cookies.remove('token');
				}
			}
			//return deferred.promise;
		}
		
		function recovery(email) {
			var deferred = $q.defer();
			$http({
				method: 'POST', 
				url: 'https://www.thinkplanwrite.com/api/auth/recovery',
				data: { 'email' : email }
			}).then(function(response){
				deferred.resolve(response);
			}, function errorCallback(response) {
				deferred.reject(response);
			});	
			return deferred.promise;
		}
		
		function reset(email, password, password_confirmation, token){
			var deferred = $q.defer();
			$http.post("https://www.thinkplanwrite.com/api/auth/reset", { email: email, password: password, password_confirmation: password_confirmation, token: token })
			.then(function(response){
				deferred.resolve(response);
			}, function errorCallback(response) {
				deferred.reject(response);
			});	
			return deferred.promise;			
		}
		
		function verify(code){
			var deferred = $q.defer();
			console.log("authenticate verify");
			console.log("code: " + code);
			$http.post("https://www.thinkplanwrite.com/api/auth/verify", { confirmation_code: code })
			.then(function(response){
				deferred.resolve(response);
			}, function errorCallback(response) {
				deferred.reject(response);
			});	
			return deferred.promise;			
		}

		function getUserInfo() {
			return userInfo;
		}

		return {
			login: login,
			refresh: refresh,
			logout: logout,
			recovery: recovery,
			reset: reset,
			verify: verify,
			getLoggedIn: getLoggedIn
		};
	}]);
	
	app.config(function($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/');
		$stateProvider
		.state('logout', {
			url: '/logout', 
			views: {
				'main': {
					templateUrl: '../logout.html',
					controller: 'LogoutController'
				},
				'menu': {
					templateUrl: '../navigation.html',
					controller: 'MenuController'
				},
				'footer': {
					templateUrl: '../footer.html',					
				}
			}
		})
		.state('dash', {
			url: '/dashboard', 
			views: {
				'main': {
					templateUrl: '../dashboard.html',
					controller: 'DashboardController',
					resolve: {
						auth: function ($q, authenticate, $state) {
							var token = authenticate.getLoggedIn();
							if (token) {
								return $q.when(token);
							} else {
								return $q.reject();
							}
						}
					}
				},
				'menu': {
					templateUrl: '../navigation.html',
					controller: 'MenuController'
				}
			}
		})
		.state('account', {
			url: '/account', 
			views: {
				'main': {
					templateUrl: '../account.html',
					controller: 'AccountController',
					resolve: {
						auth: function ($q, authenticate, $state) {
							var token = authenticate.getLoggedIn();
							if (token) {
								return $q.when(token);
							} else {
								return $q.reject();
							}
						}
					}					
				},
				'menu': {
					templateUrl: '../navigation.html',
					controller: 'MenuController'
				},
				'footer': {
					templateUrl: '../footer.html',					
				}
			}
		})
		.state('projects', {
			url: '/projects/:id', 
			views: {
				'main': {
					templateUrl: '../projects.html',
					controller: 'ProjectsController',
					resolve: {
						auth: function ($q, authenticate, $state) {
							var token = authenticate.getLoggedIn();
							if (token) {
								return $q.when(token);
							} else {
								return $q.reject();
							}
						}
					}		
				},
				'menu': {
					templateUrl: '../navigation.html',
					controller: 'MenuController'
				}
			}
		})
		.state('writing', {
			url: '/writing/:id', 
			views: {
				'main': {
					templateUrl: '../writing.html',
					controller: 'WritingController',
					resolve: {
						auth: function ($q, authenticate, $state) {
							var token = authenticate.getLoggedIn();
							if (token) {
								return $q.when(token);
							} else {
								return $q.reject();
							}
						}
					}		
				},
				'menu': {
					templateUrl: '../navigation.html',
					controller: 'MenuController'
				}
			}
		})
		.state('plotpoints', {
			url: '/plotpoints/:id', 
			views: {
				'main': {
					templateUrl: '../plotpoints.html',
					controller: 'PlotpointsController',
					resolve: {
						auth: function ($q, authenticate, $state) {
							var token = authenticate.getLoggedIn();
							if (token) {
								return $q.when(token);
							} else {
								return $q.reject();
							}
						}
					}		
				},
				'menu': {
					templateUrl: '../navigation.html',
					controller: 'MenuController'
				}
			}
		})
		.state('characters', {
			url: '/characters/:id', 
			views: {
				'main': {
					templateUrl: '../characters.html',
					controller: 'CharactersController',
					resolve: {
						auth: function ($q, authenticate, $state) {
							var token = authenticate.getLoggedIn();
							if (token) {
								return $q.when(token);
							} else {
								return $q.reject();
							}
						}
					}		
				},
				'menu': {
					templateUrl: '../navigation.html',
					controller: 'MenuController'
				}
			}
		})
		.state('login', {
			url: '/login', 
			views: {
				'main': {
					templateUrl: '../login.html',
					controller: 'LoginController'		
				},
				'menu': {
					templateUrl: '../navigation.html',
					controller: 'MenuController'
				},
				'footer': {
					templateUrl: '../footer.html',					
				}
			}
		})
		.state('register', {
			url: '/register', 
			views: {
				'main': {
					templateUrl: '../register.html',
					controller: 'RegisterController'		
				},
				'menu': {
					templateUrl: '../navigation.html',
					controller: 'MenuController'
				},
				'footer': {
					templateUrl: '../footer.html',					
				}
			}
		})
		.state('verify', {
			url: '/verify/:code',
			views: {
				'main': {
					templateUrl: '../verify.html',
					controller: 'VerifyController'
				},
				'menu': {
					templateUrl: '../navigation.html',
					controller: 'MenuController'
				}
			}
		})
		.state('recovery', {
			url: '/recovery', 
			views: {
				'main':{
					templateUrl: '../recovery.html',
					controller: 'RecoveryController'
				},
				'menu': {
					templateUrl: '../navigation.html',
					controller: 'MenuController'
				}
			}
		})
		.state('reset', {
			url: '/reset/:token/:email', 
			views: {
				'main': {
					templateUrl: '../reset.html',
					controller: 'ResetController'
				},
				'menu': {
					templateUrl: '../navigation.html',
					controller: 'MenuController'
				},
				'footer': {
					templateUrl: '../footer.html',					
				}
			}
		})
		.state('home', {
			url: '/', 
			views: {
				'main': {
					templateUrl: '../landing.html',
					controller: 'HomeController'
				},
				'menu': {
					templateUrl: '../navigation.html',
					controller: 'MenuController'
				},
				'footer': {
					templateUrl: '../footer.html',					
				}
			}
		})
		.state('home.blog', {
			url: '/blog'
		})
		.state('privacy', {
			url: '/privacy', 
			views: {
				'main': {
					templateUrl: '../privacy.html'				
				},
				'menu': {
					templateUrl: '../navigation.html',
					controller: 'MenuController'
				},
				'footer': {
					templateUrl: '../footer.html',					
				}
			}
		})
		.state('terms', {
			url: '/terms',
			views: {
				'main': {
					templateUrl: '../terms.html'
				},
				'menu': {
					templateUrl: '../navigation.html',
					controller: 'MenuController'
				},
				'footer': {
					templateUrl: '../footer.html',					
				}
			}
		})
		.state('plotwheel', {
			url: '/plotwheel',
			views: {
				'main': {
					templateUrl: '../plotwheel.html'
				},
				'menu': {
					templateUrl: '../navigation.html',
					controller: 'MenuController'
				},
				'footer': {
					templateUrl: '../footer.html',					
				}
			}
		});
			
	});
	

	