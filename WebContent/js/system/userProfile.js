
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
	
		if(com.validate("edit-basic")){
			return false;
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
	
	com.uploadify("#pictureUpload", "上传图片", api.common.uploadImg, 'btn btn-success blue col-md-12', '*.jpg;*.jpge;*.gif;*.png', {'uploadType': 0}, 1, function(data){
	    com.focusPage("#picture").val(data.resUrl);
        com.focusPage("#infoPicture").attr("href", com.showImg(com.focusPage("#showImg"), data.resUrl, 150, 150, ''));
    });
	
});
