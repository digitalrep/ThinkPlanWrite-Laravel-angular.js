<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Tag extends Model
{
	protected $fillable = ['title'];
		
    public function writings()
    {
        return $this->belongsToMany('App\Writing')->withTimestamps();
    }
}
