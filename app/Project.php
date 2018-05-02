<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Crypt;

class Project extends Model
{
    protected $fillable = ['title', 'user_id', 'wordcount'];
	
	public function user() {
		return $this->belongsTo('App\User');
	}
	
	public function writings() {
		return $this->hasMany('App\Writing');
	}
	
	public function plotpoints() {
		return $this->hasMany('App\Plotpoint');
	}

	public function characters() {
		return $this->hasMany('App\Character');
	}
}
