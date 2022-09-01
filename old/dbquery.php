<?php
function dbQuery($sql, $db = 'futbol') {
	$server = 'localhost';
	$user = 'root';
	if(strpos($_SERVER['HTTP_HOST'], 'localhost') !== false) {
		$pass = '';
	} else {
		$pass = 'f00f00';
	}
	if(preg_match("/^SELECT|^select/", $sql)) { $action = 1; }
	elseif(preg_match("/^UPDATE|^REPLACE|^DELETE|^update|^replace|^delete/", $sql)) {
		$action=2;
	}
	elseif(preg_match("/^INSERT|^insert/",$sql)) {
		$action=3;
	}
	else { return; }
	$dbc    = @mysql_connect($server, $user, $pass);
	mysql_select_db($db, $dbc);
	$select = mysql_query($sql, $dbc);
	$error = mysql_error();
	if($error) {
		echo $error.'=>'.$sql.'<br>';
	}

	$return = '';
	if( $action == 1 ) {
		$data = array();
		$row  = 0;
		if ($select) {
			while( $r = mysql_fetch_array($select) ) $data[$row++] = $r;
			mysql_free_result( $select );
		}
		$return = $data;
	}
	else if($action==3) {
		$return = mysql_insert_id();
	}

	return @$return;
}
