<?php

namespace App\Api\V1\Controllers;

use JWTAuth;
use Validator;
use Config;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Dingo\Api\Routing\Helpers;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Password;
use Tymon\JWTAuth\Exceptions\JWTException;
use Dingo\Api\Exception\ValidationHttpException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;

class AuthController extends Controller
{
    use Helpers;
	
	public function blog() 
	{
		$url = 'https://www.thinkplanwrite.com/blog';
		return Redirect::to($url);
	}

    public function login(Request $request)
    {
        $credentials = $request->only(['email', 'password']);

        $validator = Validator::make($credentials, [
            'email' => 'required',
            'password' => 'required',
        ]);

        if($validator->fails()) {
            throw new ValidationHttpException($validator->errors()->all());
        }

        try {
            if (!$token = JWTAuth::attempt($credentials)) {
                return $this->response->errorUnauthorized();
            }
        } catch (JWTException $e) {
            return $this->response->error('could_not_create_token', 300);
        }
		
		//Log::info('token: ' . $token);
		$request->headers->set('Authorization', 'Bearer: ' . $token);
		
		if(!$currentUser = JWTAuth::parseToken()->authenticate()) {
			return response()->json(['user_not_found'], 404);
		} else {			
			if(!$currentUser->confirmed == 1) {
				//JWTAuth::invalidate(JWTAuth::getToken());
				return $this->response->errorUnauthorized();
			}
			else 
			{
				return response()->json(compact('token'));
			}
		}
    }
	
	public function refresh(){
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
		
		$currentToken = JWTAuth::getToken();
		$token = JWTAuth::refresh($currentToken);
		return $this->response->array(compact('token'));
	}

    public function signup(Request $request)
    {
        $signupFields = Config::get('boilerplate.signup_fields');
        $hasToReleaseToken = Config::get('boilerplate.signup_token_release');

        $userData = $request->only($signupFields);

        $validator = Validator::make($userData, Config::get('boilerplate.signup_fields_rules'));

        if($validator->fails()) {
            throw new ValidationHttpException($validator->errors()->all());
        }
		
		$confirmation_code = str_random(30);

        User::unguard();
        $user = User::create([
			'name' => $request->input('name'),
			'email' => $request->input('email'),
			'password' => $request->input('password'),
			'confirmation_code' => $confirmation_code,
			'profile_pic' => 'https://www.thinkplanwrite.com/images/default.png'
		]);
        User::reguard();

        if(!$user->id) {
            return $this->response->error('could_not_create_user', 500);
        } else {
			Mail::send('emails.verify', ['confirmation_code' => $confirmation_code, 'name' => $request->input('name')], function($message) use ($user)
			{
				$message->from('admin@thinkplanwrite.com', 'Site Admin');
				$message->to($user['email'], 'name')->subject('ThinkPlanWrite - Verify your email address');
			});			
		}
        
        return $this->response->created();
    }

    public function register(Request $request)
    {
        $signupFields = Config::get('boilerplate.signup_fields');
        $hasToReleaseToken = Config::get('boilerplate.signup_token_release');

        $userData = $request->only($signupFields);

        $validator = Validator::make($userData, Config::get('boilerplate.signup_fields_rules'));

        if($validator->fails()) {
            throw new ValidationHttpException($validator->errors()->all());
        }
		
		$confirmation_code = str_random(30);

        User::unguard();
        $user = User::create([
			'name' => $request->input('name'),
			'email' => $request->input('email'),
			'password' => $request->input('password'),
			'confirmation_code' => $confirmation_code,
			'profile_pic' => 'https://www.thinkplanwrite.com/images/default.png'
		]);
        User::reguard();

        if(!$user->id) {
            return $this->response->error('could_not_create_user', 500);
        } else {
			/*
			Mail::send('emails.verify', ['confirmation_code' => $confirmation_code, 'name' => $request->input('name')], function($message) use ($user)
			{
				$message->from('admin@thinkplanwrite.com', 'Site Admin');
				$message->to($user['email'], 'name')->subject('ThinkPlanWrite - Verify your email address');
			});		
			*/
			$token = JWTAuth::fromUser($user);
			return $this->response->array(compact('token'));
		}
    }	
	
    public function recovery(Request $request)
    {
        $validator = Validator::make($request->only('email'), [
            'email' => 'required'
        ]);

        if($validator->fails()) {
            throw new ValidationHttpException($validator->errors()->all());
        }

        $response = Password::sendResetLink($request->only('email'), function ($message) {
            $message->subject('ThinkPlanWrite - Password Reset Link');
			$message->from('admin@thinkplanwrite.com', 'ThinkPlanWrite');
        });

        switch ($response) {
            case Password::RESET_LINK_SENT:
                return $this->response->noContent();
            case Password::INVALID_USER:
                return $this->response->errorNotFound();
        }
    }
	
    public function verify(Request $request)
    {
		$confirmation_code = $request->input('confirmation_code');
		
		if($confirmation_code == null) {
			return $this->response->error('no confirmation code', 500);	
		}
		
		$user = User::whereConfirmationCode($confirmation_code)->first();
		
		if(!$user) {
			Log::info('no user');
			throw new InvalidConfirmationCodeException;
		}
		
		Log::info('user' . $user);
		Log::info('code' . $confirmation_code);
		
		$user->confirmed = 1;
		$user->confirmation_code = null;
		$user->save();
		
		return $this->response->noContent();
    }

    public function reset(Request $request)
    {
        $credentials = $request->only(
            'email', 'password', 'password_confirmation', 'token'
        );

        $validator = Validator::make($credentials, [
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|confirmed|min:6',
        ]);

        if($validator->fails()) {
            throw new ValidationHttpException($validator->errors()->all());
        }
        
        $response = Password::reset($credentials, function ($user, $password) {
            $user->password = $password;
            $user->save();
        });

        switch ($response) {
            case Password::PASSWORD_RESET:
                if(Config::get('boilerplate.reset_token_release')) {
                    return $this->login($request);
                }
                return $this->response->noContent();

            default:
                return $this->response->error('could_not_reset_password', 500);
        }
    }
	
	public function logout()
	{
		JWTAuth::invalidate(JWTAuth::getToken());
	}
}