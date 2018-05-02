<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Writing extends Model
{
    protected $fillable = ['title', 'content', 'wordcount', 'order_number'];
	
	public function project() {
		return $this->belongsTo('App\Project');
	}
	
	public function tags() {
		return $this->belongsToMany('App\Tag')->withTimestamps();
	}
}
