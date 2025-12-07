jQuery(function($) {
	var loginurl = "login.do";
//	if(window.location.href.indexOf("login.do") == -1){
//		window.parent.location.href= loginurl ;
//	}
	
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

/**
 * 登录函数（新版 - 挑战-响应认证）
 */
function login() {
	var userId = $("#userId").val();
	var password = $("#password").val();
	var verifyCode = $("#nowCode").val();

	// 第一步：请求登录挑战（nonce）
	$.ajax({
		type: "POST",
		dataType: "json",
		url: config.communion + "requestLoginChallenge.do",
		data: { userId: userId },
		success: function(data) {
			if (data.errorCode != 0) {
				$("#errorMsg").html(data.errorMsg);
				return;
			}

			var nonce = data.nonce;

			// 第二步：计算响应哈希
			// 客户端：MD5(MD5(password) + nonce)
			var passwordMD5 = flcry(password);  // 第一次MD5
			var responseHash = flcry(passwordMD5 + nonce);  // 第二次MD5

			// 第三步：发送响应哈希进行登录
			$.ajax({
				type: "POST",
				dataType: "json",
				url: config.communion + "doLogin.do",
				data: {
					userId: userId,
					responseHash: responseHash,  // 使用响应哈希而非明文密码
					verifyCode: verifyCode,
					securityCode: window.securityCode || ""
				},
				success: function(data) {
					initPage();

					if(data.errorCode == 1){
						$("#newCodeIcon").attr("class", "icon-remove red");
						$("#newCodeIcon").attr("data-content", data.errorMsg);
						$("#errorMsg").html(data.errorMsg);
						$("#Verify").attr("src", "verifyCode.do?timestamp="+ new Date().getTime());
					} else if(data.errorCode == 0) {
						document.location.href = "index.do?timestamp="+ new Date().getTime();
					} else {
						$("#passwordIcon").attr("class", "icon-remove red");
						$("#passwordIcon").attr("data-content", data.errorMsg);
						$("#errorMsg").html(data.errorMsg);
						$("#Verify").attr("src","verifyCode.do?timestamp="+ new Date().getTime());
					}
				},
				error: function() {
					$("#errorMsg").html("网络错误，请重试");
				}
			});
		},
		error: function() {
			$("#errorMsg").html("网络错误，请重试");
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
