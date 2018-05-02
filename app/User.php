<?php

namespace App;

use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'email', 'password', 'confirmation_code'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * This mutator automatically hashes the password.
     *
     * @var string
     */
    public function setPasswordAttribute($value)
    {
        $this->attributes['password'] = \Hash::make($value);
    }
	
	public function projects()
	{
		return $this->hasMany('App\Project');
	}
	
	public function logs()
	{
		return $this->hasMany('App\Log');
	}
	
	public function writings()
	{
		return $this->hasManyThrough('App\Writing', 'App\Project');
	}
	
	public function followings()
	{
		return $this->hasMany('App\Following');
	}
}
