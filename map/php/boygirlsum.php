<?php
	include('ch_json_encode.php');
	$class=$_GET['class'];
	$sql="SELECT gender,count(*) AS pop from ".$class." group by gender";
	
	$res=queryDatabase($sql);
	$arr=array();
	while($row=mysqli_fetch_array($res)){
		$arr[]=$row;
	}
	$json_string=ch_json_encode($arr);
	echo $json_string;
	//echo $array;
	function queryDatabase($sql){
		$con=mysqli_connect("localhost","root","root") or die("cannot connect");
		mysqli_select_db($con,"mapapp");
		mysqli_query($con,"set names 'utf8'");
		$result=mysqli_query($con,$sql);
		mysqli_close($con);
		return $result;
	}	
?>