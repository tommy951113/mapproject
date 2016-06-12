<?php
	$userName=$_POST['username'];
	$password=$_POST['passwd'];
	$qq=$_POST['qq'];
	//check whether the name exists
	$query="select * from account where username='{$userName}'";
	$res=queryDatabase($query);
	
	$flag=0;  //flag=0表示该用户名没有被注册
	while($row=mysqli_fetch_array($res)){
		//var_dump($row);
		if($row["username"]==$userName)
			{
			echo "对不起，该用户名已经被注册！";
			$flag=1;
			break;
			}
	}
	
	if($flag==0)
		{
			//echo "!";
			//insert the information into the database
			$insert="insert into account(username,password,qq) values('{$userName}','{$password}','{$qq}');";
			queryDatabase($insert);
			echo "注册成功!";
		}

	//connect and querythe database
	function queryDatabase($sql){
		$con=mysqli_connect("localhost","root","root");
		mysqli_select_db($con,"mapapp");
		mysqli_query($con,"set names 'utf8'");
		$result=mysqli_query($con,$sql);
		mysqli_close($con);
		return $result;
	}
?>