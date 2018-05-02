<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Following extends Model
{
	public $timestamps = false;
	
	/* user1 is the one being followed */
	protected $fillable = ['user_id', 'user2_id'];
	protected $primaryKey = 'id';
	
	public function user() {
		return $this->belongsTo('App\User');
	}
}
