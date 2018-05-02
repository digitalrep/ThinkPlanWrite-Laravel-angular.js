angular.module('writingsApp', ['ngRoute'])
	.config(['$locationProvider', '$routeProvider',
	function config($locationProvider, $routeProvider)
	{
		$locationProvider.hashPrefix('!');
		$routeProvider.when('/writings', 
		{
			template: '<writings-list></writings-list>'
		}).
		when('/writings/:writingsId',
		{
			template: '<writings-detail></writings-detail>'
		}).
		otherwise('/writings');
	}
]);