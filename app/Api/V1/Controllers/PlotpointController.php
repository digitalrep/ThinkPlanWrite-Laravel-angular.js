<?php

namespace App\Api\V1\Controllers;

use Illuminate\Http\Request;
use JWTAuth;
use App\Project;
use App\Plotpoint;
use DB;
use Dingo\Api\Routing\Helpers;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;

class PlotpointController extends Controller
{
    use Helpers;
	
	// Get a list of plotpoints based on project_id
	public function index($project_id)
	{
		try {
			$currentUser = JWTAuth::parseToken()->authenticate();
		} catch (\Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {
			return $this->response->error('Token Expired', 300);
		} catch (\Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
			return $this->response->error('Token Invalid', 300);
		} catch (\Tymon\JWTAuth\Exceptions\TJWTException $e) {
			return $this->response->error('Token Not Present', 300);
		}
		
		$projects = $currentUser->projects;
		
		$project = Project::find($project_id);
		
		if($projects->contains($project_id)) {
			return $project
				->plotpoints()
				->orderBy('order_number', 'ASC')
				->get()
				->toArray();		
		}
	}
	
	public function show($id)
	{
		try {
			$currentUser = JWTAuth::parseToken()->authenticate();
		} catch (\Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {
			return $this->response->error('Token Expired', 300);
		} catch (\Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
			return $this->response->error('Token Invalid', 300);
		} catch (\Tymon\JWTAuth\Exceptions\TJWTException $e) {
			return $this->response->error('Token Not Present', 300);
		}
		
		$projects = $currentUser->projects;

		$plotpoint = Plotpoint::find($id);
		
		if(!$plotpoint)
			throw new NotFoundHttpException; 
		
		$found = false;
		
		foreach($projects as $project) {
			$plotpoints = $project->plotpoints;
			if($plotpoints->contains($id)) {
				$found = true;			
			}
		}
		
		if($found) {
			return $plotpoint;
		} else {
			return $this->response->errorUnauthorized();
		}
	}
	
	public function store(Request $request)
	{
		
		try {
			$currentUser = JWTAuth::parseToken()->authenticate();
		} catch (\Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {
			return $this->response->error('Token Expired', 300);
		} catch (\Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
			return $this->response->error('Token Invalid', 300);
		} catch (\Tymon\JWTAuth\Exceptions\TJWTException $e) {
			return $this->response->error('Token Not Present', 300);
		}
		
		$project = Project::find($request->get('project_id'));
		
		$user = $project->user;
		
		if($currentUser == $user) {

			// Create new plotpoint 
			$plotpoint = new Plotpoint;
			$plotpoint->title = strip_tags($request->get('title'));
			$plotpoint->description = strip_tags($request->get('description'));
			$plotpoint->order_number = strip_tags($request->get('order_number'));

			// Save plotpoint
			if($project->plotpoints()->save($plotpoint)) {
				return $plotpoint;
			} else {
				return $this->response->error('could_not_create_plotpoint', 500);
			}
		}
	}

	public function update(Request $request, $id)
	{
		try {
			$currentUser = JWTAuth::parseToken()->authenticate();
		} catch (\Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {
			return $this->response->error('Token Expired', 300);
		} catch (\Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
			return $this->response->error('Token Invalid', 300);
		} catch (\Tymon\JWTAuth\Exceptions\TJWTException $e) {
			return $this->response->error('Token Not Present', 300);
		}

		$plotpoint = Plotpoint::find($id);
		
		$project = Project::find($plotpoint->project_id);
		
		$user = $project->user;
		
		if($currentUser == $user) {

			$plotpoint->title = strip_tags($request->get('title'));
			$plotpoint->description = strip_tags($request->get('description'));
			$plotpoint->order_number = strip_tags($request->get('order_number'));
			
			if($project->plotpoints()->save($plotpoint)) {
				return $plotpoint;
			} else {
				return $this->response->error('could_not_update_plotpoint', 500);
			}
		} else {
			return $this->response->errorUnauthorized();
		}
	}

	public function destroy($id)
	{
		try {
			$currentUser = JWTAuth::parseToken()->authenticate();
		} catch (\Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {
			return $this->response->error('Token Expired', 300);
		} catch (\Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
			return $this->response->error('Token Invalid', 300);
		} catch (\Tymon\JWTAuth\Exceptions\TJWTException $e) {
			return $this->response->error('Token Not Present', 300);
		}

		$projects = $currentUser->projects;
		
		$found = false;
				
		foreach($projects as $project) {
			$plotpoints = $project->plotpoints;
			if($plotpoints->contains($id)) {
				$found = true;
			}
		}
		
		$plotpoint = Plotpoint::find($id);
		
		if($found) {
			Plotpoint::destroy($id);
			return $this->response->noContent();
		} else {
			return $this->response->errorUnauthorized();
		}
	}
}
