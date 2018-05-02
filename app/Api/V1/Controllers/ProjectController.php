<?php

namespace App\Api\V1\Controllers;

use Illuminate\Http\Request;
use JWTAuth;
use App\Project;
use App\Writing;
use Dingo\Api\Routing\Helpers;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;

class ProjectController extends Controller
{
    use Helpers;
	
	public function index()
	{
		try {
			if(!$currentUser = JWTAuth::parseToken()->authenticate()) {
				return response()->json(['user_not_found'], 404);
			}
		} catch (\Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {
			return $response()->json(['token_expired'], $e->getStatusCode());
		} catch (\Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
			return $response()->json(['token_invalid'], $e->getStatusCode());
		} catch (\Tymon\JWTAuth\Exceptions\TJWTException $e) {
			return $response()->json(['token_absent'], $e->getStatusCode());
		}
		
		return $currentUser
			->projects()
//			->with('writings')
			->orderBy('created_at', 'DESC')
			->get()
			->toArray();
		
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
		
		$title = strip_tags($request->get('title'));
		$found = false;
		
		$projects = $currentUser->projects;
		
		// if found, retrieve project
		foreach($projects as $proj) {
			if($proj->title === $title) {
				$found = true;
			}
		}

		if(!$found) {
			$project = new Project;
			$project->title = $title;
			if($currentUser->projects()->save($project)) {
				return $project; 
			} else {
				return $this->response->error('could_not_create_project', 500);	
			}
		} else {
			return $this->response->error('A project with the same title already exists in your list of projects', 500);	
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

		$project = $currentUser->projects()->with('writings')->find($id);

		if(!$project)
			throw new NotFoundHttpException; 

		return $project;
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

		$project = $currentUser->projects()->find($id);
		
		if(!$project)
			throw new NotFoundHttpException;

		$project->title = strip_tags($request->get('title'));

		if($project->save())
			return $this->response->noContent();
		else
			return $this->response->error('could_not_update_project', 500);
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

		$project = $currentUser->projects()->find($id);

		if(!$project)
			throw new NotFoundHttpException;

		// delete writings associated with project first?
		//$project->writings()->tags()->detach();
		$project->writings()->delete();
		
		if($project->delete())
			return $this->response->noContent();
		else
			return $this->response->error('could_not_delete_project', 500);
	}

}
