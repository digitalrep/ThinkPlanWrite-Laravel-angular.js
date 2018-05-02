angular
.module('writingsApp')
.controller('loginController', function($location, AuthenticationService) 
{
	var vm = this;
	vm.login = login;
	
	initController();
	
	function initController()
	{
		AuthenticationService.Logout();
	}
	
	function login()
	{
		vm.loading = true;
		AuthenticationService.Login(vm.email, vm.password, function(result)
		{
			if(result === true)
			{
				$location.path('/');
			} 
			else 
			{
				vm.error = "Username or password incorrect.";
			}
		}
	}
}
