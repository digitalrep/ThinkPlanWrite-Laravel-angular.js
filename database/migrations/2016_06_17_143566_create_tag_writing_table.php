<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTagWritingTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
		Schema::create('tag_writing', function(Blueprint $table){
			$table->increments('id');
			$table->integer('writing_id')->unsigned()->nullable();
			$table->integer('tag_id')->unsigned()->nullable();
			$table->timestamps();
		});
		
		Schema::table('tag_writing', function($table){
			$table->foreign('writing_id')->references('id')->on('writings');
		});
		
		Schema::table('tag_writing', function($table) {
			$table->foreign('tag_id')->references('id')->on('tags');
		});
   }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {

    }
}
