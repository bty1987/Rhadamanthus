
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
	
	com.focusPage("#removePicture").on("click",removePicture);
	var userid=-null;
	com.post(api.personel.queryUserForSelfByUserId, {}, function(res){
  
		userProfile.userPhoto=res.userInfo.user.userPhoto;
		userProfile.age = res.userInfo.age;
		userProfile.phone = res.userInfo.user.phone;
		userProfile.emergencyMan = res.userInfo.emergencyMan;
		userProfile.emergencyPhone = res.userInfo.emergencyPhone;
		userProfile.qq=res.userInfo.qq;
		userProfile.wechat=res.userInfo.wechat;
		userProfile.email = res.userInfo.email;

		userid=res.userInfo.user.userId;
		initUser();
	});

	function initUser(){
		com.focusPage("#age").val(userProfile.age);
		com.focusPage("#telephone").val(userProfile.phone);
		com.focusPage("#qq").val(userProfile.qq);
		com.focusPage("#wechat").val(userProfile.wechat);
		com.focusPage("#email").val(userProfile.email);
		com.focusPage("#emergencyMan").val(userProfile.emergencyMan);
		com.focusPage("#emergencyPhone").val(userProfile.emergencyPhone);
		com.focusPage("#picture").val(userProfile.userPhoto);
		com.focusPage("#infoPicture").attr("href", com.showImg(com.focusPage("#showImg"), userProfile.userPhoto, 150, 150, ''));
	}
	
	com.focusPage("#reset").on("click",function(){
		initUser();
	});
	
	com.focusPage("#saveBtn").on("click",function(){
	
		if(com.validate()){
			return;
		}
		
		parm = {
			"userInfo.user.userPhoto":com.focusPage("#picture").val(),
			"userInfo.user.userId": userid,
			"userInfo.user.phone":com.focusPage("#telephone").val(),
			"userInfo.age":com.focusPage("#age").val(),
			"userInfo.emergencyMan":com.focusPage("#emergencyMan").val(),
			"userInfo.emergencyPhone":com.focusPage("#emergencyPhone").val(),
			"userInfo.qq":com.focusPage("#qq").val(),
			"userInfo.wechat":com.focusPage("#wechat").val(),
			"userInfo.email":com.focusPage("#email").val()
		};

		com.post(api.personel.updateUserForBaseInfo, parm, function(res){
			userProfile.userPhoto = com.focusPage("#picture").val();
			userProfile.age = com.focusPage("#age").val();
			userProfile.phone = com.focusPage("#telephone").val();
			userProfile.emergencyMan = com.focusPage("#emergencyMan").val();
			userProfile.emergencyPhone = com.focusPage("#emergencyPhone").val();
			userProfile.qq = com.focusPage("#qq").val();
			userProfile.wechat=com.focusPage("#wechat").val();
			userProfile.email = com.focusPage("#email").val();
			com.showAlert(com.info, "操作成功");
		});
	});

	function removePicture(){
		com.focusPage("#showImg").attr("src","#");
		com.focusPage("#picture").val("");
		com.focusPage("#infoPicture").attr("href","javascript:void(0)");
	}
	
	com.focusPage("#pictureUpload").Huploadify({
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
			 	com.focusPage("#picture").val(dateObj.resUrl);
			 	com.focusPage("#infoPicture").attr("href", com.showImg(com.focusPage("#showImg"), dateObj.resUrl, 150, 150, ''));
			}else{
				alert(data);
			}
        }
    });
});
