<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Tagentry extends Model
{
	protected $fillable = ['writings_id', 'tag_id'];
	protected $primaryKey = 'tag_entry_id';
	
}
