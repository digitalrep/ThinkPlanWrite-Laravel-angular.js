<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ChangeColumnsOfLogsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
		Schema::table('logs', function(Blueprint $table){    
			$table->integer('day');
			$table->integer('month');
			$table->integer('year');
			$table->dropColumn(['created_at', 'updated_at']);
		});
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
		Schema::table('logs', function(Blueprint $table){         
			$table->dropColumn(['day', 'month', 'year']);
			$table->date('created_at');
			$table->date('updated_at');
		});
    }
}
