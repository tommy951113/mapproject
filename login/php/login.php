<?php
	$userName=$_POST['username'];
	$password=$_POST['password'];
	
	//check whether there are matched account
	$query="select * from account where username='{$userName}'";
	$res=queryDatabase($query);
	
	$flag=0;  //flag=0表示该用户名不存在
	while($row=mysqli_fetch_array($res)){
		if($row["username"]==$userName)
			{
				$flag=1;
				//check if the password is correct
				if($row["password"]==$password){
					echo "登录成功!";
					break;
				}
				else{
					echo "密码错误!";
					break;
				}
			}
	}
	if($flag==0)
	{
		echo "用户名不存在!";
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