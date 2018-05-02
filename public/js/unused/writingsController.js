angular
.module('writingsApp')
.controller('writingsController', function($scope) 
{
	$scope.writings = 
	[
		{
			"title":"Beginnings",
			"text":"In the beginning, blah blah blah.",
			"wordcount":6,
			"created":"10/02/15"
		},
		{
			"title":"Salt",
			"text":"Apparently we are all eating way too much salt.",
			"wordcount":9,
			"created":"12/02/15"
		}
	];
});
