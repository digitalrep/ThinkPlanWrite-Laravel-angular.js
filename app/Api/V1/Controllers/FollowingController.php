<?php

namespace App\Api\V1\Controllers;

use Illuminate\Http\Request;
use JWTAuth;
use DB;
use App\User;
use App\Following;
use Dingo\Api\Routing\Helpers;
use App\Http\Requests;
use App\Http\Controllers\Controller;

class FollowingController extends Controller
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
		
		$followings = DB::table('followings')->get();
		
		return $followings;
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
		
		if($currentUser->id == $request->get('user_id')) {
		
			$found = DB::table('followings')
			->where([
				['user_id', '=', strip_tags($request->get('user_id'))],
				['user2_id', '=', strip_tags($request->get('user2_id'))],			
			])->get();
			
			if($found == null)
			{
				$following = new Following;
				$following->user_id = strip_tags($request->get('user_id'));
				$following->user2_id = strip_tags($request->get('user2_id'));
				$following->save();
				//$currentUser->followings()->attach($following);
			}
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
		
		return $currentUser->followings->toArray();
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

		$following = Following::find($id);
		if($following->user_id == $currentUser->id) {
			$following->delete();
		}
	}
}
