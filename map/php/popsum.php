<?php
	include('ch_json_encode.php');
	$arr=array();
	for($i=2;$i<=5;$i++){
		//循环查询s2012~s2015
		$sql = "select gender,count(*) from s201".$i." group by gender";
		$res=queryDatabase($sql);
		while($row=mysqli_fetch_array($res,MYSQL_NUM)){
			$arr[]=$row;
		}
	}
			//print_r($arr);

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