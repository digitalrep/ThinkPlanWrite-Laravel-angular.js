<?php

namespace App\Api\V1\Controllers;

use Illuminate\Http\Request;
use JWTAuth;
use App\Project;
use App\Writing;
use App\Log;
use DB;
use Crypt;
use Carbon\Carbon;
use Dingo\Api\Routing\Helpers;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Log as PrintyThing;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;

class WritingController extends Controller
{
    use Helpers;
	
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
				->writings()
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

		$writing = Writing::find($id);
		
		if(!$writing)
			throw new NotFoundHttpException; 
		
		$found = false;
		
		foreach($projects as $project) {
			$writings = $project->writings;
			if($writings->contains($id)) {
				$found = true;			
			}
		}
		
		if($found) {
			return $writing;
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

			// Create new writing 
			$writing = new Writing;
			$writing->title = strip_tags($request->get('title'));
			
			$writing->content = "";
			$writing->wordcount = 0;

			// Save writing
			if($project->writings()->save($writing)) {
				return $writing;
			} else {
				return $this->response->error('could_not_create_writing', 500);
			}
		}
	}
	
	private function advanceDay($log)
	{
		if($log->month == 4 || $log->month == 6 || $log->month == 9 || $log->month == 11)
		{
			if($log->day == 30)
			{
				$log->day = 1;
				$month = $log->month;
				$log->month = ++$month;
			}
			else 
			{
				$day = $log->day;
				$log->day = ++$day;
			}			
		} 
		else if($log->month == 2)
		{
			if($log->day == 28)
			{
				//TODO - better leapyear check
				if($log->year == 2016 || $log->year == 2020 || $log->year == 2024 || $log->year == 2028 || $log->year == 2032 || $log->year == 2036 || $log->year == 2040)
				{
					$log->day = 29;
				} 
				else 
				{
					$log->day = 1;
					$log->month = 3;
				}
			} 
			else if($log->day == 29)
			{
				$log->day = 1;
				$log->month = 3;								
			}
			else 
			{
				$day = $log->day;
				$log->day = ++$day;
			}								
		}
		else
		{
			if($log->day == 31)
			{
				$log->day = 1;
				if($log->month == 12)
				{
					$log->month = 1;
					$year = $log->year;
					$log->year = ++$year;
				} 
				else 
				{
					$month = $log->month;
					$log->month = ++$month;
				}
			}
			else 
			{
				$day = $log->day;
				$log->day = ++$day;
			}
		}
		return $log;
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

		$writing = Writing::find($id);
		$project = Project::find($writing->project_id);
		$user = $project->user;
		
		if($currentUser == $user) {

			$writing->title = strip_tags($request->get('title'));
			$content = $request->get('content');
			$writing->content = strip_tags($content, "<br>");
			$oldwordcount = $writing->wordcount;
			$stripped_content = strip_tags($content);
			$newwordcount = str_word_count(html_entity_decode($stripped_content));
			$writing->wordcount = $newwordcount;
			$difference = $newwordcount - $oldwordcount;
			$number = $request->get('order_number');
			$writing->order_number = $number;
			
			// Update project with new wordcount
			$oldprojectcount = $project->wordcount;
			$project->wordcount = $oldprojectcount + $difference;
			$project->save();
			
			$today = Carbon::now();

			// Are there any logs at all?
			if($latest_log = $currentUser->logs()->orderBy('id', 'desc')->first()) 
			{
				// Get latest logs for *this project*
				if($latest = $currentUser->logs()
					->where('project_id', $writing->project_id)
					->orderBy('id', 'desc')
					->first())
				{
					// Is latest log for this project *today* 
					$latest_log_date = Carbon::createFromDate($latest->year, $latest->month, $latest->day);
					if($latest_log_date->eq($today)) 
					{
						$oldcount = $latest->wordcount;
						$latest->wordcount = $latest->wordcount + $difference;
						$currentUser->logs()->save($latest);						
					}
					// Make new log for *this project* for *today*
					else 
					{
						$newlog = new Log;
						$newlog->day = $today->day;
						$newlog->month = $today->month;
						$newlog->year = $today->year;
						$newlog->wordcount = $difference;
						$newlog->project_id = $writing->project_id;
						$currentUser->logs()->save($newlog);							
					}
				}
				// No logs for this project yet
				else 
				{
					$newlog = new Log;
					$newlog->day = $today->day;
					$newlog->month = $today->month;
					$newlog->year = $today->year;
					$newlog->wordcount = $difference;
					$newlog->project_id = $writing->project_id;
					$currentUser->logs()->save($newlog);					
				}
			}
			// No logs at all
			else
			{
				$newlog = new Log;
				$newlog->day = $today->day;
				$newlog->month = $today->month;
				$newlog->year = $today->year;
				$newlog->wordcount = $newwordcount;
				$newlog->project_id = $writing->project_id;
				$currentUser->logs()->save($newlog);
			}
			
					
			if($project->writings()->save($writing)) {
				return $writing;
			} else {
				return $this->response->error('could_not_update_writing', 500);
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
			$writings = $project->writings;
			if($writings->contains($id)) {
				$found = true;
				$selected_project = $project;
			}
		}
		
		$writing = Writing::find($id);
		$selected_project->wordcount -= $writing->wordcount;
		$selected_project->save();
		
		if($found) {
			$writing->tags()->detach();
			Writing::destroy($id);
			return $this->response->noContent();
		} else {
			return $this->response->errorUnauthorized();
		}
	}
}
