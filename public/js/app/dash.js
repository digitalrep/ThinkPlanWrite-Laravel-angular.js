		
	app.controller('DashboardController', function($http, $scope, $state, authenticate, $cookies, modalService){
		
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
		
		// Refresh token, then get user's projects, then get user's logs
		
		var before_refresh = performance.now();

		$http({
			method: 'POST',
			url: 'https://www.thinkplanwrite.com/api/auth/refresh',
			headers: { 'Authorization' : 'Bearer ' + $scope.token }
		}).then(function(result){
			
			var after_refresh = performance.now();
			//console.log("Refresh took " + (after_refresh - before_refresh) + " milliseconds");
			
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
			
			$scope.loading = true;
			
			$http({
				method: 'GET', 
				url: 'https://www.thinkplanwrite.com/api/project', 
				headers: { 'Authorization' : 'Bearer ' + $scope.token }
			}).then(function(response){
				
				$scope.projects = response.data;
				$scope.$broadcast('controllerUpdate', $scope.projects);
				
				$http({
					method: 'GET', 
					url: 'https://www.thinkplanwrite.com/api/user/logs', 
					headers: { 'Authorization' : 'Bearer ' + $scope.token }
				}).then(function(response){
					$scope.logs = response.data.logs;
					$scope.initVariables();
					$scope.convertLogsToArray();
					$scope.doLogStuff();
					$scope.otherCharts();
				}, function errorCallback(response) {
					//console.log("dash/logs: " + response.status + " " + response.statusText);
					if(response.status === 401) {
						authenticate.logout();
						$state.go('login');
					}
				});			
				
			}, function errorCallback(response) {
				console.log("dash/projects: " + response.status + " " + response.statusText);
				if(response.status === 401) {
					console.log("unauthorized 401 projects get");
					authenticate.logout();
					$state.go('login');
				} 
			}).finally(function() {
				$scope.loading = false;
			});	

		}, function errorCallback(response){
			console.log("refresh failed " + response.status + " " + response.statusText);
			authenticate.logout();
			$state.go('login');			
		});
		
		$scope.addLog = function(log) {

				var modalOptions = {
					headerText: 'Log Updated',
					bodyText: 'Your daily wordcount was successfully updated'
				};
				$http({
					method: "POST",
					url: "https://www.thinkplanwrite.com/api/log/store",
					headers: { 'Authorization' : 'Bearer: ' + $scope.token },
					data: { projectId: log.projectId, wordcount: log.wordcount, date: log.date },
				}).then(function(response){
					$http({
						method: 'GET', 
						url: '/api/project/', 
						headers: { 'Authorization' : 'Bearer ' + $scope.token }
					}).then(function(response){
						$scope.projects = response.data;
					}, function errorCallback(response) {
						if(response.status === 401) {
							authenticate.logout();
							$state.go('login');
						} else {
							//console.log("GET PROJECTS: " + response);
						}
					});	
					$http({
						method: 'GET', 
						url: 'https://www.thinkplanwrite.com/api/user/logs', 
						headers: { 'Authorization' : 'Bearer ' + $scope.token }
					}).then(function(response){
						$scope.initVariables();
						$scope.logs = response.data.logs;
						$scope.convertLogsToArray();
						$scope.doLogStuff();
					}, function errorCallback(response) {
						//console.log("dash/logs: " + response.status + " " + response.statusText);
						if(response.status === 401) {
							authenticate.logout();
							$state.go('login');
						}
					});			
					modalService.showModal({}, modalOptions);
				}, function errorCallback(response) {
					if(response.status === 401) {
						authenticate.logout();
						$state.go('login');
					} else {
						//console.log("PROJECT STORE: " + response.status + ", " + response.statusText);
					}
				});		
			
		}
		
		$scope.addProject = function(project) {
			var modalOptions = {
				headerText: 'Project Created',
				bodyText: 'Your new Project was successfully added'
			};
			$http({
				method: 'POST', 
				url: '/api/project/store', 
				headers: { 'Authorization' : 'Bearer ' + $scope.token },
				data: { 'title' : project.title }
			}).then(function(response){
				modalService.showModal({}, modalOptions);
				$http({
					method: 'GET', 
					url: '/api/project/', 
					headers: { 'Authorization' : 'Bearer ' + $scope.token }
				}).then(function(response){
					$scope.projects = response.data;
				}, function errorCallback(response) {
					if(response.status === 401) {
						authenticate.logout();
						$state.go('login');
					} else {
						//console.log("GET PROJECTS: " + response);
					}
				});	
				
			}, function errorCallback(response) {
				if(response.status === 401) {
					authenticate.logout();
					$state.go('login');
				} else {
					//console.log("PROJECT STORE: " + response.status + ", " + response.statusText);
				}
			});	
		}
		
		$scope.deleteProject = function(project) {
			var modalOptions = {
				closeButtonText: 'Cancel',
				actionButtonText: 'Delete Project',
				headerText: 'Delete Project Confirmation',
				bodyText: 'Are you sure you want to delete this project and all its associated writings?'
			};
			modalService.showModal({}, modalOptions)
			.then(function(result){
				$http({
					method: 'DELETE', 
					url: 'https://www.thinkplanwrite.com/api/project/' + project.id, 
					headers: { 'Authorization' : 'Bearer ' + $scope.token }
				}).then(function(response){
					$http({
						method: 'GET', 
						url: 'https://www.thinkplanwrite.com/api/project', 
						headers: { 'Authorization' : 'Bearer ' + $scope.token }
					}).then(function(response){
						$scope.projects = response.data;
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
		
		$scope.initVariables = function() {
				
			$scope.line = {};
			$scope.all = {};
			$scope.line.labels = [];
			$scope.all.labels = [];
			$scope.all.data = [];
			$scope.line.data = [];
			
			$scope.logyearmonths = {};
			$scope.logyearmonthslabels = [];
			
			$scope.total = 0;
			$scope.actual_days = 0;
			$scope.total_days = 0;
			$scope.average_daily = 0;
			$scope.longest_streak = 0;
			$scope.longest_drought = 0;
			$scope.streak = 0;
			$scope.drought = 0;
			
			$scope.months = ["", "", "", "", "", ""];
			$scope.months_totals = [0, 0, 0, 0, 0, 0];
			$scope.months_averages = [0, 0, 0, 0, 0, 0];
			
			$scope.calendarObjectsCurrent = 0;
			
			// Lines are individual 'months'
			$scope.line.labels = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
			$scope.line.series = [];
			$scope.line.data = [];
			
			// All means all months
			$scope.all.series = [];
			$scope.all.data = [];	
			
		}
		
		$scope.doLogStuff = function() {
					
			/*
				This graph plugin accepts arrays instead of objects as input
				So convert each label object (month - year) into strings in all.series[]
			*/
							
			angular.forEach($scope.logyearmonthslabels, function(value, key) {
				$scope.all.series.push(value.month + " - " + value.year);
			});
							
			var len = $scope.logyearmonthslabels.length
							
			/*
				Convert each logyearmonth[i][obj] into 
							 all.data[i][wordcount int/string] 
				with i corresponding to(month - year) labels now in all.series[]
			*/
					
			for(var i = 0; i < len; i++) {
				$scope.all.data[i] = [];
				angular.forEach($scope.logyearmonths[i], function(value, key) {
					if($scope.all.data[i][value.day - 1] == undefined) {
						$scope.all.data[i][value.day - 1] = parseInt(value.wordcount);
					}
					else 
					{
						$scope.all.data[i][value.day - 1] += parseInt(value.wordcount);
					}
				});
			}
							
			// To change which series (month - year) is currently displayed in graph call changeLogs with year, month as inputs
					
			len = $scope.all.series.length;
							
			if(len > 0) {
				// Take the last series of data - this year and month and pass it to changeLogs so it's added to line {}
				var date = $scope.all.series[len - 1].split(" - ");
				$scope.changeLogs(parseInt(date[1]), date[0]);
						
				$scope.average_daily = Math.floor($scope.total / $scope.actual_days);
				
				//var after_log_line_chart = performance.now();
				//console.log("Convert arrays to lines (months) for line chart " + (after_log_line_chart - after_logyearmonths) + " milliseconds");
								
				// Now create a calendar chart
								
				$scope.calendarObjects = [];
								
				var len = $scope.logyearmonthslabels.length;
				var week = 0;
				var count = 0;
						
				// For each year-month label (Aug-2016, e.g)
				for(var i=0; i<len; i++) {
					// Get month and year
					$scope.calendarObject = {};
					$scope.calendarObject.month = $scope.logyearmonthslabels[i].month;
					$scope.calendarObject.year = $scope.logyearmonthslabels[i].year;
					$scope.calendarObject.days = [];
				
					// Go through the corresponding log objects and assign their values (wordcounts) to calendarObject[week]
					for(var j=1; j<32; j++) {
						var found = false;
						angular.forEach($scope.logyearmonths[i], function(value, key) {
							if(value.day == j) {
								found = true;
								if(typeof($scope.calendarObject.days[j]) !== 'undefined') {
									$scope.calendarObject.days[j].wordcount += value.wordcount;
								} else {
									$scope.calendarObject.days[j] = value;
								}
							} 
						});		
								
						if(!found) {
							$scope.calendarObject.days[j] = { 
								month: $scope.calendarObject.month,
								year: $scope.calendarObject.year,
								day: j,
								wordcount: 0
							};
						}
					}

					// Add this calendarObject to calendarObjects array
					$scope.calendarObjects.push($scope.calendarObject);
					//console.log($scope.calendarObject);
					week = 0;
				}
			}
					
			var len2 = $scope.calendarObjects.length;
					
			for(var k=0; k<len2; k++) {
			
				week = 0;
				count = 0;
				$scope.calendarObjects[k].weeks = [];
				$scope.calendarObjects[k].weeks[week] = [];
				
				for(var i=1; i<32; i++) {
					if(count > 6) {
						count = 0;
						week++;
						$scope.calendarObjects[k].weeks[week] = [];
					}
					$scope.calendarObjects[k].weeks[week].push($scope.calendarObjects[k].days[i]);
					count++;
				} 
				
			}
				
			$scope.calendarLogCurrent = len-1;					
					
		}
		
		$scope.otherCharts = function() {
			$scope.getMonthlyData();
			$scope.barChartInit();
			$scope.pieChartInit();
			
			/* add days of week here */
			for(var a=0; a<$scope.calendarObjects.length; a++)
			{
				var firstWeek = $scope.calendarObjects[a].weeks[0];
				var firstDay = firstWeek[0];
				$scope.calendarObjects[a].daysOfWeek = [];
				var first = new Date(firstDay.year, firstDay.month, firstDay.day, 0, 0, 0, 0);
				var dayOfWeek = first.getDay();
				//int with 0 - Sunday, 6 = Saturday
				$scope.calendarObjects[a].daysOfWeek = $scope.getDays(dayOfWeek);
			}		
		}
		
		// Get author quote from json file
		$http.get('authors_quotes.json').success(function(data) {
			var random = Math.floor(Math.random() * 18);
			$scope.quote = data[random];
		});
		
		$scope.getMonthlyData = function() {
			var length = $scope.logyearmonthslabels.length;
			var first = length - 5;
			var monthIndex = 0;
			
			while(first !== length) {
				$scope.months[monthIndex] = $scope.logyearmonthslabels[first].month + " " + $scope.logyearmonthslabels[first].year;
				for(var i=0; i<$scope.logyearmonths[first].length; i++) {
					$scope.months_totals[monthIndex] += $scope.logyearmonths[first][i].wordcount;
				}
				first++;
				monthIndex++;
			}
			
			for(var j=0; j<6; j++) {
				var parts = $scope.months[j].split(" ");
				var numDays = $scope.getNumDaysInMonth(parts[0], parts[1]);
				$scope.months_averages[j] = $scope.months_totals[j] / numDays;
			}
		}
		
		$scope.leapYear = function(year) {
			if(((year % 4 == 0) && (year % 100 !== 0)) || (year % 400 == 0)) {
				return true;
			}
			return false;
		}
		
		$scope.getNumDaysInMonth = function(month, year) {
			if(month === "January") {
				return 31;
			}
			if(month === "February") {
				if($scope.leapYear(year)) {
					return 29;
				} else {
					return 28;
				}
			}
			if(month === "March") {
				return 31;
			}
			if(month === "April") {
				return 30;
			}
			if(month === "May") {
				return 31;
			}
			if(month === "June") {
				return 31;
			}
			if(month === "July") {
				return 30;
			}
			if(month === "August") {
				return 31;
			}
			if(month === "September") {
				return 30;
			}
			if(month === "October") {
				return 31;
			}
			if(month === "November") {
				return 30;
			}
			if(month === "December") {
				return 31;
			}			
		}
		
		$scope.barChartInit = function() {
			$scope.stackedChartObject = { 
				"type": "BarChart",
				"data": 
				{
					"cols": 
					[
						{
							"id": "m",
							"label": "Months",
							"type": "string"
						},
						{
							"id": "a",
							"label": "Monthly Average",
							"type": "number"
						},
						{
							"id": "t",
							"label": "Monthly Total",
							"type": "number"
						},
						
					],
					"rows": 
					[
						{
							"c": 
							[
								{
									"v": $scope.months[0]
								},
								{
									"v": $scope.months_averages[0]
								},
								{
									"v": $scope.months_totals[0]
								}
							]
						},
						{
							"c": 
							[
								{
									"v": $scope.months[1]
								},
								{
									"v": $scope.months_averages[1]
								},
								{
									"v": $scope.months_totals[1]
								}
							]
						},
						{
							"c": 
							[
								{
									"v": $scope.months[2]
								},
								{
									"v": $scope.months_averages[2]
								},
								{
									"v": $scope.months_totals[2]
								}
							]
						},
						{
							"c": 
							[
								{
									"v": $scope.months[3]
								},
								{
									"v": $scope.months_averages[3]
								},
								{
									"v": $scope.months_totals[3]
								}
							]
						},
						{
							"c": 
							[
								{
									"v": $scope.months[4]
								},
								{
									"v": $scope.months_averages[4]
								},
								{
									"v": $scope.months_totals[4]
								}
							]
						},
						{
							"c": 
							[
								{
									"v": $scope.months[5]
								},
								{
									"v": $scope.months_averages[5]
								},
								{
									"v": $scope.months_totals[5]
								}
							]
						}						
					]
				},
				"options": 
				{
					"backgroundColor": { fill: 'transparent' },
					"colors" : ["#a0cc8f", "#efc3a8", "#efd4a8"],
					"isStacked": "true",
					"fill": 60,
					"displayExactValues": true,
					"legend": "none",
			  },
			  "formatters": {}
			}
		}	
		
		$scope.pieChartInit = function() {
			$scope.chartObject = {
				"type": "PieChart",
				"displayed": false,
				"data": 
				{
					"cols": 
					[
						{
							"id": "month",
							"label": "Month",
							"type": "string",
							"p": {}
						},
						{
							"id": "laptop-id",
							"label": "Laptop",
							"type": "number",
							"p": {}
						}
					],
					"rows": 
					[
						{
							"c": 
							[
								{
									"v": "Writing Days"
								},
								{
									"v": $scope.actual_days
								}
							]
						},
						{
							"c": 
							[
								{
									"v": "Non Writing Days"
								},
								{
									"v": $scope.total_days - $scope.actual_days
								}
							]
						}
				
					]
				},
				"options": 
				{
					"backgroundColor": { fill: 'transparent' },
					"legend": { position: 'none' },
					"title": "",
					"colors" : ["#72849d", "#6c9a90", "#efc3a8", "#a0cc8f", "#efd4a8"],
					"isStacked": "true",
					"fill": 20,
					"displayExactValues": true,
					"vAxis": {
						"title": "Sales unit",
						"gridlines": {
							"count": 10
						}
					},
					"hAxis": {
						"title": "Date"
					}
			  },
			  "formatters": {}
			}
		}
		
		/*
			logyearmonthlabels contains month - year sections [jan - 2016, feb - 2016, etc]
			logyearmonths[i] contains an array of log objects, with i corresponding to labels (month - year) - [ id, wordcount, year, month, day ]
		
			logyearmonthslabels[0] 	= ['jan - 2016']
			logyearmonths[0]       	= [
			logyearmonths[0][0]	  	=   ['id' => 1, 'wordcount' = 0, year = 2016, month = 'jan', day = 1, project_id = null]
			logyearmonths[0][1]    	=   ['id' => 2, 'wordcount' = 24, year = 2016, month = 'jan', day = 2, project_id = 2]
			logyearmonths[0][2]    	=   ['id' => 3, 'wordcount' = 44, year = 2016, month = 'jan', day = 2, project_id = 5]
									  ]	
		*/
		$scope.convertLogsToArray = function() {
			var currYear, currMonth = "";
			var i = -1;
							
			/*
				Take log objects and put into $scope.logyearmonths array
				I wanted separate month/year properties instead of working with dates i.e. created_on 2016-07-16 01:48:39
			
				Counting how many year - month combos by filling logyearmonthslabels
				Also at the same time calculate some stats i.e drought, streak, total
			*/	
			angular.forEach($scope.logs, function(value, key) {
				if(currYear == value.year) 
				{
					if(currMonth == value.month) 
					{
						$scope.logyearmonths[i].push({
							'id' : value.id,
							'wordcount' : value.wordcount,
							'year' : value.year,
							'month' : value.month,
							'day' : value.day,
							'project_id' : value.project_id,
						});
						$scope.total += value.wordcount;
						$scope.total_days++;
						if(value.wordcount != 0) 
						{
							$scope.actual_days++;
							$scope.streak++
							if($scope.drought > $scope.longest_drought) 
							{
								$scope.longest_drought = $scope.drought;
							}
							$scope.drought = 0;
						} else {
							$scope.drought++;
							if($scope.streak > $scope.longest_streak) 
							{
								$scope.longest_streak = $scope.streak;
							} 
							$scope.streak = 0;
						}
					} else {
						currYear = value.year;
						currMonth = value.month;
						i++;
						$scope.logyearmonthslabels.push({
							'index' : i,
							'year' : value.year,
							'month' : $scope.getMonth(value.month)
						});
						$scope.logyearmonths[i] = [];
						$scope.logyearmonths[i].push({
							'id' : value.id,
							'wordcount' : value.wordcount,
							'year' : value.year,
							'month' : value.month,
							'day' : value.day,
							'project_id' : value.project_id,
						});
						$scope.total += value.wordcount;
						$scope.total_days++;
						if(value.wordcount != 0) {
							$scope.actual_days++;
							$scope.streak++
							if($scope.drought > $scope.longest_drought) {
								$scope.longest_drought = $scope.drought;
							}
							$scope.drought = 0;
						} else {
							$scope.drought++;
							if($scope.streak > $scope.longest_streak) {
								$scope.longest_streak = $scope.streak;
							} 
							$scope.streak = 0;
						}
					}
				} else {
					currYear = value.year;
					currMonth = value.month;
					i++;
					$scope.logyearmonthslabels.push({
						'index' : i,
						'year' : value.year,
						'month' : $scope.getMonth(value.month)
					});
					$scope.logyearmonths[i] = [];
					$scope.logyearmonths[i].push({
						'id' : value.id,
						'wordcount' : value.wordcount,
						'year' : value.year,
						'month' : value.month,
						'day' : value.day,
						'project_id' : value.project_id,
					});
					$scope.total += value.wordcount;
					$scope.total_days++;
					if(value.wordcount != 0) {
						$scope.actual_days++;
						$scope.streak++;
						if($scope.drought > $scope.longest_drought) {
							$scope.longest_drought = $scope.drought;
						}
						$scope.drought = 0;
					} else {
						$scope.drought++;
						if($scope.streak > $scope.longest_streak) {
							$scope.longest_streak = $scope.streak;
						} 
						$scope.streak = 0;
					}
				}
			});
		}
		
		$scope.getDays = function(f) {
			switch(f) {
				case 0: 
					return ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
					break;
				case 1:
					return ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"];
					break;		
				case 2: 
					return ["Tue", "Wed", "Thur", "Fri", "Sat", "Sun", "Mon"];
					break;
				case 3:
					return ["Wed", "Thur", "Fri", "Sat", "Sun", "Mon", "Tue"];
					break;		
				case 4: 
					return ["Thur", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed"];
					break;
				case 5:
					return ["Fri", "Sat", "Sun", "Mon", "Tue", "Wed", "Thur"];
					break;	
				case 6: 
					return ["Sat", "Sun", "Mon", "Tue", "Wed", "Thur", "Fri"];
					break;
				default:
					return ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
			}
		}
		
		$scope.changeCalendarLog = function(prev) {
			var len = $scope.logyearmonthslabels.length;
			if(prev) {
				if($scope.calendarLogCurrent - 1 > -1) {
					$scope.calendarLogCurrent--;
				}
			} else {
				if($scope.calendarLogCurrent + 1 < len) {
					$scope.calendarLogCurrent++;
				}
			}
		}
		
		/*
			Based on year and month that come in, find correct index
			then set line {} label and data to corresponding label and data
			If it's already there take it out, otherwise put it in
		*/
		$scope.changeLogs = function(year, month) {
			var len = $scope.logyearmonthslabels.length;
		
			for(var i = 0; i < len; i++) {
				if($scope.logyearmonthslabels[i].year === year && $scope.logyearmonthslabels[i].month === month) {
					var label = month + " - " + year;
					var index = $scope.line.series.indexOf(label);	
					if(index < 0) {
						$scope.line.series.push($scope.all.series[i]);
						$scope.line.data.push($scope.all.data[i]);
					} else {
						$scope.line.series.splice(index, 1);
						$scope.line.data.splice(index, 1);						
					}
				}
			}
		}
		
		$scope.getMonthNumber = function(month) {
			if(month === "January") {
				return 1;
			}
			if(month === "February") {
				return 2;
			}
			if(month === "March") {
				return 3;
			}
			if(month === "April") {
				return 4;
			}
			if(month === "May") {
				return 5;
			}
			if(month === "June") {
				return 6;
			}
			if(month === "July") {
				return 7;
			}
			if(month === "August") {
				return 8;
			}
			if(month === "September") {
				return 9;
			}
			if(month === "October") {
				return 10;
			}
			if(month === "November") {
				return 11;
			}
			if(month === "December") {
				return 12;
			}
		}
		
		$scope.getMonth = function(month) {
			if(month === 1) {
				return "January";
			}
			if(month === 2) {
				return "February";
			}
			if(month === 3) {
				return "March";
			}
			if(month === 4) {
				return "April";
			}
			if(month === 5) {
				return "May";
			}
			if(month === 6) {
				return "June";
			}
			if(month === 7) {
				return "July";
			}
			if(month === 8) {
				return "August";
			}
			if(month === 9) {
				return "September";
			}
			if(month === 10) {
				return "October";
			}
			if(month === 11) {
				return "November";
			}
			if(month === 12) {
				return "December";
			}
		}
		
	});