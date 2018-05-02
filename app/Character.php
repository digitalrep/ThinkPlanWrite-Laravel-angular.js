<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Character extends Model
{
	public $timestamps = false;
    protected $fillable = ['name', 'gender', 'age', 'bio'];
	
	public function project() {
		return $this->belongsTo('App\Project');
	}
}