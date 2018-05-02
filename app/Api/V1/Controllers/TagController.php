<?php

namespace App\Api\V1\Controllers;

use Illuminate\Http\Request;
use JWTAuth;
use DB;
use App\Tag;
use App\Project;
use App\Writing;
use Dingo\Api\Routing\Helpers;
use App\Http\Requests;
use App\Http\Controllers\Controller;

class TagController extends Controller
{
    use Helpers;
	
	public function index()
	{
		$currentUser = JWTAuth::parseToken()->authenticate();
		
		$tags = DB::table('tags')->get();
		
		return $tags;
	}
	
	public function store(Request $request)
	{
		$currentUser = JWTAuth::parseToken()->authenticate();
		
		$projects = $currentUser->projects;

		$writing = Writing::find($request->get('writing_id'));
		
		if(!$writing)
			throw new NotFoundHttpException; 
		
		$found = false;
		
		foreach($projects as $project) {
			$writings = $project->writings;
			foreach($writings as $writing) {
				if($writings->contains($request->get('writing_id'))) {
					$found = true;
				}			
			}
		}
		
		if($found) {
			$tag = DB::table('tags')->where('title', $request->get('title'))->first();
			if($tag) {
				foreach($writing->tags as $t) {
					if($tag->title !== strip_tags($request->get('title'))) {
						$writing->tags()->attach($tag);	
					}
				}
			} else {
				$tag = new Tag;
				$tag->title = strip_tags($request->get('title'));
				$tag->save();
				$writing->tags()->attach($tag);
			}
			
		} else {
			return $this->response->errorUnauthorized();
		}
	}
	
	public function show($writing_id)
	{
		$currentUser = JWTAuth::parseToken()->authenticate();
		
		$projects = $currentUser->projects;

		$writing = Writing::find($writing_id);
		
		if(!$writing)
			throw new NotFoundHttpException; 
		
		$found = false;
		
		foreach($projects as $project) {
			$writings = $project->writings;
			foreach($writings as $writing) {
				if($writings->contains($writing_id)) {
					$found = true;
				}			
			}
		}
		
		if($found) {
			return $writing->tags->toArray();
		} else {
			return $this->response->errorUnauthorized();
		}
	}
	
	public function destroy($tag_id, $writing_id)
	{
		$currentUser = JWTAuth::parseToken()->authenticate();
		
		$projects = $currentUser->projects;

		$writing = Writing::find($writing_id);
		
		if(!$writing)
			throw new NotFoundHttpException; 
		
		$found = false;
		
		foreach($projects as $project) {
			$writings = $project->writings;
			foreach($writings as $writing) {
				if($writings->contains($writing_id)) {
					$found = true;
				}			
			}
		}
		
		if($found) {
			$writing->tags()->detach($tag_id);
		} else {
			return $this->response->errorUnauthorized();
		}
	}
}
