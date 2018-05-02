<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Plotpoint extends Model
{
	public $timestamps = false;
    protected $fillable = ['title', 'description', 'order_number'];
	
	public function project() {
		return $this->belongsTo('App\Project');
	}
}
