
window.onload=function()
{
	var flag=true;
	var oEma=document.getElementById("email");
	var oUser=document.getElementById("userid");
	var oPsw=document.getElementById("passwd");
	var oPsw1=document.getElementById("repasswd");
	var oBtn=document.getElementById("submit");
	
	
	oEma.onblur=function()
	{
		var re=/^\w+@[0-9a-z]+\.[a-z]{2,4}$/;//邮箱的正则表达式
		var emailfd=document.getElementById("emailfd");//fd是feedback(反馈的缩写)
		if(!re.test(oEma.value))
		{
			flag=false;
			document.getElementById("checkemail").style.display="inline";
			oEma.style.border="2px solid #d16d62";	
		}
		else
		{
			flag=true;
			document.getElementById("checkemail").style.display="none";
			oEma.style.border="2px solid #ccc";
		}
		
	}

	oPsw.onfocus=function()
	{
		document.getElementById("hints").style.display="block";
	}

	oPsw1.onfocus=function()
	{
		document.getElementById("hintss").style.display="block";
	}
	
	
	oPsw.onblur=function()//第一次输入密码的事件
	{
		var repsw=/^[0-9a-z]{6,16}$/i;//密码的正则表达式
		var pswfd=document.getElementById("pswfd");//fd是feedback(反馈的缩写)
		if(!repsw.test(oPsw.value))
		{
			flag=false;
			document.getElementById("checkpsw").style.display="inline";
			oPsw.style.border="2px solid #d16d62";	
		}
		else
		{
			flag=true;
			document.getElementById("checkpsw").style.display="none";
			oPsw.style.border="2px solid #ccc";
		}

		document.getElementById("hints").style.display="none";
		
		
	}
	
	oPsw1.onblur=function()//第2次输入密码的事件
	{
		document.getElementById("hintss").style.display="none";
		var repsw=/^[0-9a-z]{6,16}$/i;//密码的正则表达式
		var psw1fd=document.getElementById("psw1fd");//fd是feedback(反馈的缩写)
		if(!repsw.test(oPsw1.value))
		{
			flag=false;
			document.getElementById("checkpsw1").style.display="inline";
			oPsw1.style.border="2px solid #d16d62";	//格式错误
		}
		else if(oPsw1.value!=oPsw.value)
		{
			flag=false;
			document.getElementById("checkpsw2").style.display="inline";//两次输入不一样
			oPsw1.style.border="2px solid #d16d62";
		}
		else
		{
			flag=true;
			document.getElementById("checkpsw1").style.display="none";
			document.getElementById("checkpsw2").style.display="none";
			oPsw1.style.border="2px solid #ccc";
		}
		
	}
	
	
	
	oBtn.onclick=function()
	{
		var check=oEma.value==""||oUser.value==""||oPsw.value==""||oPsw1.value=="";
		if(oEma.value==""||oUser.value==""||oPsw.value==""||oPsw1.value=="")
		{
			alert("表单内容不能为空，请重新填写");
		}
		else if(flag&&!check)
		{
			console.log("注册成功");
		}
		else if(!flag)
		{
			alert("填写有错误，再多看一下-。-");
		}
	}
}// JavaScript Document