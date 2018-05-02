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

class LogController extends Controller
{
    use Helpers;
	
	public function index()
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
		
		$logs = $currentUser->logs;
		
		return $logs;
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

		$projectId = strip_tags($request->get('projectId'));
		$wordcount = strip_tags($request->get('wordcount'));
		$rawdate = strip_tags($request->get('date'));
		$date = Carbon::createFromFormat('d-m-Y', $rawdate);
		
		PrintyThing::info('Project id: ' . $projectId . ', wordcount: ' . $wordcount . ', date: ' . $date);
		
		// Do I really need to make sure this is this user's project?
		if($project = $currentUser->projects()->find($projectId)) 
		{
	
			$project->wordcount += $wordcount;
			$currentUser->projects()->save($project);
			
			$today = Carbon::now();
			
			// Get latest log
			if($latest_log = $currentUser->logs()->orderBy('id', 'desc')->first()) 
			{
				// Is latest log for today? 
				$latest_log_date = Carbon::createFromDate($latest_log->year, $latest_log->month, $latest_log->day);
					
				// If not, fill in days with 0 logs between latest log and today
				if(!$latest_log_date->eq($today)) {
						
					while($latest_log_date->lt($today)) {
							
						// Advance latest log by one day
						$latest_log = $this->advanceDay($latest_log);
						
						// Create empty log for missing log day
						$newlog = new Log;
						$newlog->day = $latest_log->day;
						$newlog->month = $latest_log->month;
						$newlog->year = $latest_log->year;
						$newlog->wordcount = 0;
						$currentUser->logs()->save($newlog);
							
						// Update latest log date
						$latest_log_date = Carbon::createFromDate($latest_log->year, $latest_log->month, $latest_log->day);						
					}
						
				}
				
				PrintyThing::info('year: ' . $date->year . ', month: ' . $date->month . ', day: ' . $date->day);				
				$matchThese = ['year' => $date->year, 'month' => $date->month, 'day' => $date->day];
				
				// Get log for this new log date
				if($latest = $currentUser->logs()
					->where($matchThese)
					->orderBy('id', 'desc')
					->first())
				{

					// Update wordcount
					$latest->wordcount += $wordcount;
					$latest->project_id = $project->id;
					$currentUser->logs()->save($latest);
					return $latest;								
				
				}
			
			}
			// No logs at all
			else
			{
				
				$log = new Log;
				$log->day = $date->day;
				$log->month = $date->month;
				$log->year = $date->year;
				$log->wordcount = $wordcount;
				$log->project_id = $project->id;
				$currentUser->logs()->save($log);				
				
			}
				
		}	
			
		return $log;
		
	}
	
	/* this was for the google chrome addon 
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

		// check if project already exists
		$projectName = strip_tags($request->get('document'));
		$session_count = strip_tags($request->get('session_wordcount'));
		PrintyThing::info('session_count: ' . $session_count);
		$count = strip_tags($request->get('wordcount'));
		
		$projects = $currentUser->projects;
		$found = false;
		
		// if found, retrieve project
		foreach($projects as $proj) {
			if($proj->title === $projectName) {
				$found = true;
				$project = $proj;
				$project->wordcount = $count;
				$currentUser->projects()->save($project);
			}
		}
		
		// if not, create it
		if(!$found) {
			$project = new Project;
			$project->title = strip_tags($request->get('document'));
			$project->wordcount = $count;
			$currentUser->projects()->save($project);
		}
		
		$today = Carbon::now();
		
		// This is to fix the null log days issue... 
		// Would rather do it here than in javascript
		if($latest_log = $currentUser->logs()->orderBy('id', 'desc')->first()) 
		{
				// Is latest log for this project *today*? 
				$latest_log_date = Carbon::createFromDate($latest_log->year, $latest_log->month, $latest_log->day);
				
				if(!$latest_log_date->eq($today)) {
					
					while($latest_log_date->lt($today)) {
						
						// Advance latest log by one day
						$latest_log = $this->advanceDay($latest_log);
						
						// Create empty log for missing log day
						$newlog = new Log;
						$newlog->day = $latest_log->day;
						$newlog->month = $latest_log->month;
						$newlog->year = $latest_log->year;
						$newlog->wordcount = 0;
						$currentUser->logs()->save($newlog);
						
						// Update latest log date
						$latest_log_date = Carbon::createFromDate($latest_log->year, $latest_log->month, $latest_log->day);						
					}
					
				}
		}

		// This is to update the latest log with latest day and project
		if($latest_log = $currentUser->logs()->orderBy('id', 'desc')->first()) 
		{
			// Get latest logs for *this project*
			if($latest = $currentUser->logs()
				->where('project_id', $project->id)
				->orderBy('id', 'desc')
				->first())
			{
				// Is latest log for this project *today*? 
				$latest_log_date = Carbon::createFromDate($latest->year, $latest->month, $latest->day);
				
				if($latest_log_date->eq($today)) 
				{

						$latest->wordcount = $session_count;
						$currentUser->logs()->save($latest);
						return $latest;						
					
				}
				// Make new log for *this project* for *today*
				else 
				{
				
						$log = new Log;
						$log->day = $today->day;
						$log->month = $today->month;
						$log->year = $today->year;
						$log->wordcount = $session_count;
						$log->project_id = $project->id;
						$currentUser->logs()->save($log);						
				
				}
			}
			// No logs for this project yet
			else 
			{
				
					$log = new Log;
					$log->day = $today->day;
					$log->month = $today->month;
					$log->year = $today->year;
					$log->wordcount = $session_count;
					$log->project_id = $project->id;
					$currentUser->logs()->save($log);							
				
			}
			
		}
		// No logs at all
		else
		{
			
				$log = new Log;
				$log->day = $today->day;
				$log->month = $today->month;
				$log->year = $today->year;
				$log->wordcount = $session_count;
				$log->project_id = $project->id;
				$currentUser->logs()->save($log);				
			
		}		
		
		return $log;
		
	}
	*/
	
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
}
