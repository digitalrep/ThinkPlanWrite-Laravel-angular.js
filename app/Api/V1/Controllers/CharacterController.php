<?php

namespace App\Api\V1\Controllers;

use Illuminate\Http\Request;
use JWTAuth;
use App\Project;
use App\Character;
use DB;
use Dingo\Api\Routing\Helpers;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;

class CharacterController extends Controller
{
    use Helpers;
	
	// Get a list of characters based on project_id
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
				->characters()
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

		$character = Character::find($id);
		
		if(!$character)
			throw new NotFoundHttpException; 
		
		$found = false;
		
		foreach($projects as $project) {
			$characters = $project->characters;
			if($characters->contains($id)) {
				$found = true;			
			}
		}
		
		if($found) {
			return $character;
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

			// Create new character 
			$character = new Character;
			$character->name = strip_tags($request->get('name'));
			$character->gender = strip_tags($request->get('gender'));
			$character->age = strip_tags($request->get('age'));
			$character->bio = strip_tags($request->get('bio'));

			// Save character
			if($project->characters()->save($character)) {
				return $character;
			} else {
				return $this->response->error('could_not_create_character', 500);
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

		$character = Character::find($id);
		
		$project = Project::find($character->project_id);
		
		$user = $project->user;
		
		if($currentUser == $user) {

			$character->name = strip_tags($request->get('name'));
			$character->gender = strip_tags($request->get('gender'));
			$character->age = strip_tags($request->get('age'));
			$character->bio = strip_tags($request->get('bio'));
			
			if($project->characters()->save($character)) {
				return $character;
			} else {
				return $this->response->error('could_not_update_character', 500);
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
			$characters = $project->characters;
			if($characters->contains($id)) {
				$found = true;
			}
		}
		
		$character = Character::find($id);
		
		if($found) {
			Character::destroy($id);
			return $this->response->noContent();
		} else {
			return $this->response->errorUnauthorized();
		}
	}
}
