		//the contents of Helper.js
		function getBarChartData(num)
		{
			data = 
			{
				labels: shortLabels[num],
				datasets: [
					{
						label: "Writing Logs",
						fillColor: "#90a4ae",
						strokeColor: "#607d8b",
						pointColor: "rgba(220,220,220,1)",
						pointStrokeColor: "#fff",
						pointHeighlightFill: "#fff",
						pointHighlightStroke: "rgba(220,220,220,1)",
						data: shortValues[num]
					}
				]
			};
			return data;
		}
			
		var options = 
		[
			{
				scaleShowGridLines : true,
				scaleGridLineColor : "rgba(0,0,0,.05)",
				scaleGridLineWidth : 1,
				scaleShowHorizontalLines: true,
				scaleShowVerticalLines: true,
				bezierCurve : false,
				//bezierCurveTension : 0.4,
				pointDot : true,
				pointDotRadius : 4,
				pointDotStrokeWidth : 1,
				pointHitDetectionRadius : 20,
				datasetStroke : true,
				datasetStrokeWidth : 2,
				datasetFill : true,
				{% verbatim %}
					legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"
				{% endverbatim %}
			}
		];
		
		function displayLineChart(num, chartName)
		{
			var ctx = document.getElementById(chartName).getContext('2d');
			var lineChart = new Chart(ctx).Bar(getBarChartData(num), options);
		}
		
		function advanceDate(currentDay, currentMonth, currentYear)
		{
			if(currentMonth === "04" || currentMonth === "06" || currentMonth === "09" || currentMonth === "11")
			{
				if(currentDay === "30")
				{
					currentDay = "01";
					var month = parseInt(currentMonth);
					currentMonth = ++month;
					if(currentMonth < 10)
					{
						currentMonth = "0" + currentMonth;
					}
				}
				else 
				{
					var day = parseInt(currentDay);
					currentDay = ++day;
					if(currentDay < 10)
					{
						currentDay = "0" + currentDay;
					}
				}			
			} 
			else if(currentMonth === "02")
			{
				if(currentDay === "28")
				{
					//TODO - better leapyear check
					if(currentYear === "2016" || currentYear === "2020" || currentYear === "2024" || currentYear === "2028" || currentYear === "2032" || currentYear === "2036" || currentYear === "2040")
					{
						currentDay = "29";
					} 
					else 
					{
						currentDay = "01";
						currentMonth = "03";
					}
				} 
				else if(currentDay === "29")
				{
					currentDay = "01";
					currentMonth = "03";								
				}
				else 
				{
					var day = parseInt(currentDay);
					currentDay = ++day;
					if(currentDay < 10)
					{
						currentDay = "0" + currentDay;
					}
				}								
			}
			else
			{
				if(currentDay === "31")
				{
					currentDay = "01";
					if(currentMonth === "12")
					{
						currentMonth = "01";
						year = parseInt(currentYear);
						currentYear = ++year;
					} 
					else 
					{
						var month = parseInt(currentMonth);
						currentMonth = ++month;
						if(currentMonth < 10)
						{
							 currentMonth = "0" + currentMonth;
						}
					}
				}
				else 
				{
					var day = parseInt(currentDay);
					currentDay = ++day;
					if(currentDay < 10)
					{
						currentDay = "0" + currentDay;
					}
				}	
			}
			return currentDay + "-" + currentMonth + "-" + currentYear;
		}
			
		function contains(a, obj)
		{
			for (var i=0; i<a.length; i++)
			{
				if(a[i] === obj)
				{
					return i;
				}
			}
			return -1;
		}
		
		var values = [];
		var labels = [];
		var shortLabels = [];
		var shortValues = [];	