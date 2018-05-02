<?php
	
// Custom Dingo API Router
$api = app('Dingo\Api\Routing\Router');

$api->version('v1', function ($api) {

	$api->get('/blog', 'App\Api\V1\Controllers\AuthController@blog');
	
	$api->post('auth/login', [
		'middleware' => 'api.throttle',
		'limit' => 15,
		'expires' => 15,
		'uses' => 'App\Api\V1\Controllers\AuthController@login'
	]);
	$api->post('auth/signup', 'App\Api\V1\Controllers\AuthController@signup');
	$api->post('auth/register', 'App\Api\V1\Controllers\AuthController@register');
	$api->post('auth/recovery', 'App\Api\V1\Controllers\AuthController@recovery');
	$api->post('auth/reset', 'App\Api\V1\Controllers\AuthController@reset');
	$api->post('auth/verify', 'App\Api\V1\Controllers\AuthController@verify');
	$api->get('auth/logout', 'App\Api\V1\Controllers\AuthController@logout');
	
	$api->group(['middleware' => ['api.auth']], function($api) {
		$api->get('log', 'App\Api\V1\Controllers\LogController@index');
		$api->post('log/store', 'App\Api\V1\Controllers\LogController@store');
	});	
	
	$api->group(['middleware' => 'api.auth'], function($api) {
		$api->post('project/store', 'App\Api\V1\Controllers\ProjectController@store');
		$api->get('project', 'App\Api\V1\Controllers\ProjectController@index');	
		$api->get('project/{id}', 'App\Api\V1\Controllers\ProjectController@show');
		$api->put('project/{id}', 'App\Api\V1\Controllers\ProjectController@update');
		$api->delete('project/{id}', 'App\Api\V1\Controllers\ProjectController@destroy');
		$api->post('auth/refresh', 'App\Api\V1\Controllers\AuthController@refresh');
	});
	
	$api->group(['middleware' => 'api.auth'], function($api) {
		$api->post('writing/store', 'App\Api\V1\Controllers\WritingController@store');
		$api->get('writings/{project_id}', 'App\Api\V1\Controllers\WritingController@index');	
		$api->get('writing/{id}', 'App\Api\V1\Controllers\WritingController@show');
		$api->put('writing/{id}', 'App\Api\V1\Controllers\WritingController@update');
		$api->delete('writing/{id}', 'App\Api\V1\Controllers\WritingController@destroy');
	});
	
	$api->group(['middleware' => 'api.auth'], function($api) {
		$api->post('plotpoint/store', 'App\Api\V1\Controllers\PlotpointController@store');
		$api->get('plotpoints/{project_id}', 'App\Api\V1\Controllers\PlotpointController@index');	
		$api->get('plotpoint/{id}', 'App\Api\V1\Controllers\PlotpointController@show');
		$api->put('plotpoint/{id}', 'App\Api\V1\Controllers\PlotpointController@update');
		$api->delete('plotpoint/{id}', 'App\Api\V1\Controllers\PlotpointController@destroy');
	});
	
	$api->group(['middleware' => 'api.auth'], function($api) {
		$api->post('character/store', 'App\Api\V1\Controllers\CharacterController@store');
		$api->get('characters/{project_id}', 'App\Api\V1\Controllers\CharacterController@index');	
		$api->get('character/{id}', 'App\Api\V1\Controllers\CharacterController@show');
		$api->put('character/{id}', 'App\Api\V1\Controllers\CharacterController@update');
		$api->delete('character/{id}', 'App\Api\V1\Controllers\CharacterController@destroy');
	});
	
	$api->group(['middleware' => 'api.auth'], function($api) {
		$api->post('tag/store', 'App\Api\V1\Controllers\TagController@store');
		$api->get('tags', 'App\Api\V1\Controllers\TagController@index');	
		$api->get('tags/{writing_id}', 'App\Api\V1\Controllers\TagController@show');	
		$api->delete('tag/{tag_id}/{writing_id}', 'App\Api\V1\Controllers\TagController@destroy');
	});
	
	$api->group(['middleware' => 'api.auth'], function($api) {
		$api->get('user/logs', 'App\Api\V1\Controllers\UserController@logs');	
		$api->get('user/profile', 'App\Api\V1\Controllers\UserController@profile');
		$api->post('user/update', 'App\Api\V1\Controllers\UserController@update');
		$api->delete('user', 'App\Api\V1\Controllers\UserController@deleteAccount');
	});

	$api->group(['middleware' => 'api.auth'], function($api) {
		$api->post('following/store', 'App\Api\V1\Controllers\FollowingController@store');
		$api->get('followings', 'App\Api\V1\Controllers\FollowingController@index');	
		$api->get('followings/{user_id}', 'App\Api\V1\Controllers\FollowingController@show');	
		$api->delete('following/{id}', 'App\Api\V1\Controllers\FollowingController@destroy');
	});	
});
