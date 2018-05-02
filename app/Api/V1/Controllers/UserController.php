<?php

namespace App\Api\V1\Controllers;

use Illuminate\Http\Request;
use JWTAuth;
use Validator;
use App\Log;
use App\User;
use Dingo\Api\Routing\Helpers;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Input;

class UserController extends Controller
{
    use Helpers;
	
	public function logs()
	{
		$currentUser = JWTAuth::parseToken()->authenticate();
		
		$logs = $currentUser->logs;
		
		return $logs;
	}
	
	public function profile()
	{
		$currentUser = JWTAuth::parseToken()->authenticate();

		return $currentUser;		
	}
	
	public function update(Request $request)
	{
		$currentUser = JWTAuth::parseToken()->authenticate();
		$id = $currentUser->id;
		
		if($request->hasFile('file')) 
		{
			if($request->file('file')->isValid()) 
			{
				if(substr($request->file('file')->getMimeType(), 0, 5) == 'image') 
				{
					$image = $request->file('file');
					$name = $image->getClientOriginalName();
					$path = public_path('images/' . $currentUser->id);
					$image->move($path, $name);
					$currentUser->profile_pic = "https://www.thinkplanwrite.com/images/" . $currentUser->id . '/' . $name;
					$currentUser->save();
				} 
				else 
				{
					return $this->response->error('File invalid', 500);	
				}
			} 
			else 
			{
				return $this->response->error('File invalid', 500);
			}
		} 
		else 
		{
			return $this->response->error('No file', 500);
		}
		
	}
	
	public function deleteAccount()
	{
		$currentUser = JWTAuth::parseToken()->authenticate();
		$id = $currentUser->id;
		$user = User::find($id);
		//return $user;
		//$user->delete();
		$user->logs()->delete();
		$user->writings()->delete();
		$user->projects()->delete();
		$user->destroy($id);
		//JWTAuth::parseToken()->invalidate();
	}
}
