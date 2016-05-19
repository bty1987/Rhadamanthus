jQuery(function($) {
	var loginurl = "login.do";
	if(window.location.href.indexOf("login.do") == -1){
		window.parent.location.href= loginurl ;
	}
	
	$("#Verify").click(function(){
		$(this).attr("src","verifyCode.do?timestamp="+ new Date().getTime());
	});
	
	$('[data-rel=popover]').popover({container:'body'});
	
	$("#loginBtn").on('click',login);
	
	initPage();
	
	$("#backgroundImage").fullscreenBackground();
	$("#backgroundImage").css("position", "");
});

function initPage(){
	$("#newCodeIcon").attr("class", "icon-edit");
	$("#passwordIcon").attr("class", "icon-lock");
	$("#userIdIcon").attr("class", "icon-user");
	
	$("#newCodeIcon").attr("data-content", "请输入验证码");
	$("#userIdIcon").attr("data-content", "请输入登陆ID");
	$("#passwordIcon").attr("data-content", "请输入密码");
}

function login() {
	$.ajax({
		type: "POST",
		dataType: "json",
		url: "doLogin.do",
		data: {
			userId: $("#userId").val(),
			password: $("#password").val(),
			verifyCode: $("#nowCode").val()
		},
		success: function(data) {
			initPage();
			
			if(data.errorCode == 1){
				$("#newCodeIcon").attr("class", "icon-remove red");
				$("#newCodeIcon").attr("data-content", data.errorMsg);
				$("#errorMsg").html(data.errorMsg);
				$("#Verify").attr("src", "verifyCode.do?timestamp="+ new Date().getTime());
			}else if(data.errorCode == 0) {
				document.location.href = "index.do?timestamp="+ new Date().getTime();
			}else{
				$("#passwordIcon").attr("class", "icon-remove red");
				$("#passwordIcon").attr("data-content", data.errorMsg);
				$("#errorMsg").html(data.errorMsg);
				$("#Verify").attr("src","verifyCode.do?timestamp="+ new Date().getTime());
			} 
		}
	});
}

function keydown(e){
	var _e = e || event;
	if(_e.keyCode == 13){
		login();
		return false;
	}
} 

document.onkeydown=keydown;   
