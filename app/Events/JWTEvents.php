<?php 

	namespace App\Events;

	class JWTEvents extends Event {

		// Other methods        

		public function invalid()
		{
			return response()->json(['error' => 'Token Invalid'], 401);
			die();
		}
		
		public function expired()
		{
			return response()->json(['error' => 'Token Invalid'], 401);
			die();
		}
		
		public function absent()
		{
			return response()->json(['error' => 'Token Invalid'], 401);
			die();
		}
		
		public function valid()
		{
			return response()->json(['error' => 'Token Invalid'], 401);
			die();
		}
		
		public function user_not_found()
		{
			return response()->json(['error' => 'Token Invalid'], 401);
			die();
		}
	}