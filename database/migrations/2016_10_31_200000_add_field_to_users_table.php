<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddFieldToUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
		Schema::table('users', function(Blueprint $table){   
			$table->boolean('confirmed')->after('remember_token')->default(0);
			$table->string('confirmation_code')->after('remember_token')->nullable();		
		});
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
		Schema::table('users', function(Blueprint $table){         
			$table->dropColumn(['confirmed', 'confirmation_code']);
		});
    }
}
