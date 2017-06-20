
jQuery(function($) {
	
	var userProfile = {
		userPhoto:"",
		age:null,
		phone:"",
		qq:"",
		wechat:"",
		email:"",
		emergencyMan:"",
		emergencyPhone:""
	};
	
	$("#removePicture").on("click",removePicture);
	
	com.post(api.personel.queryUserForSelfByUserId, {}, function(res){
		
		var user = res.user;
		var userInfo = user.userInfo;
		 
		userProfile.userPhoto = user.userPhoto;
		userProfile.age = userInfo.age;
		userProfile.phone = res.user.phone;
		userProfile.emergencyMan = userInfo.emergencyMan;
		userProfile.emergencyPhone = userInfo.emergencyPhone;
		userProfile.qq = userInfo.qq;
		userProfile.wechat = userInfo.wechat;
		userProfile.email = userInfo.email;
		
		initUser();
	});
	
	function initUser(){
		$("#age").val(userProfile.age);
		$("#telephone").val(userProfile.phone);
		$("#qq").val(userProfile.qq);
		$("#wechat").val(userProfile.wechat);
		$("#email").val(userProfile.email);
		$("#emergencyMan").val(userProfile.emergencyMan);
		$("#emergencyPhone").val(userProfile.emergencyPhone);
		$("#picture").val(userProfile.userPhoto);
		$("#infoPicture").attr("href", com.showImg($("#showImg"), userProfile.userPhoto, 150, 150, ''));
	}
	
	$("#reset").on("click",function(){
		initUser();
	});
	
	$("#save").on("click",function(){
	
		if(com.validate()){
			return;
		}
		
		parm = {
			"userInfo.userPhoto":$("#picture").val(),
			"userInfo.user.age":$("#age").val(),
			"userInfo.user.phone":$("#telephone").val(),
			"userInfo.emergencyMan":$("#emergencyMan").val(),
			"userInfo.emergencyPhone":$("#emergencyPhone").val(),
			"userInfo.qq":$("#qq").val(),
			"userInfo.wechat":$("#wechat").val(),
			"userInfo.email":$("#email").val()	
		};
		
		com.post(api.personel.saveUserForBaseInfo, parm, function(res){
			userProfile.userPhoto = $("#picture").val();
			userProfile.age = $("#age").val();
			userProfile.phone = $("#telephone").val();
			userProfile.emergencyMan = $("#emergencyMan").val();
			userProfile.emergencyPhone = $("#emergencyPhone").val();
			userProfile.qq = $("#qq").val();
			userProfile.wechat=$("#wechat").val();
			userProfile.email = $("#email").val();
			com.showAlert(com.info, "操作成功");
		});
	});

	function removePicture(){
		$("#showImg").attr("src","#");
		$("#picture").val("");
		$("#infoPicture").attr("href","javascript:void(0)");
	}
	
	$("#pictureUpload").Huploadify({
        'debug' : false, // 开启调试
        'auto':true, // 是否自动上传
        'successTimeout': 99999, //超时时间
        'formData': { //附带值
            'uploadType':0,
            'strutsUploadsFileName': '',
            'username':'用户名',
            'rnd':'加密密文'
        },
        'overrideEvents': ['onDialogClose'], // 不执行默认的onSelect事件
        'fileObjName': 'strutsUploads', // 服务器端脚本使用的文件对象的名称 $_FILES个['upload']
        'uploader': config.media + api.common.uploadImg.url, // 上传处理程序
        'width': '100', // 浏览按钮的宽度
        'height': '32', // 浏览按钮的高度
        'fileTypeDesc': '支持的格式:', // 在浏览窗口底部的文件类型下拉菜单中显示的文本
        'fileTypeExts': '*.jpg;*.jpge;*.gif;*.png', // 允许上传的文件后缀
        'fileSizeLimit': '3MB', // 上传文件的大小限制
        'queueSizeLimit': 25, // 上传数量
        'onUploadSuccess':function(file, data, response){
			var dateObj=eval("("+data+")");
			if(dateObj.errorCode == 0){
			 	$("#picture").val(dateObj.resUrl);
			 	$("#infoPicture").attr("href", com.showImg($("#showImg"), dateObj.resUrl, 150, 150, ''));
			}else{
				alert(data);
			}
        }
    });
});
