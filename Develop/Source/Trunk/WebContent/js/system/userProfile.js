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

function initUser(){
	$("#age").val(userProfile.age);
	$("#telephone").val(userProfile.phone);
	$("#qq").val(userProfile.qq);
	$("#wechat").val(userProfile.wechat);
	$("#email").val(userProfile.email);
	$("#emergencyMan").val(userProfile.emergencyMan);
	$("#emergencyPhone").val(userProfile.emergencyPhone);
	$("#picture").val(userProfile.userPhoto);
	$("#showImg").attr("src", window.mediaServer + api.common.showImg.url + '?imgBasePath='+userProfile.userPhoto+'&divFlag=1&width=150&height=150&timestamp='+ new Date().getTime());
	$("#infoPicture").attr("href", window.mediaServer + api.common.showImg.url + '?imgBasePath='+userProfile.userPhoto+'&timestamp='+ new Date().getTime());
}

function removePicture(){
	$("#showImg").attr("src","#");
	$("#picture").val("");
	$("#infoPicture").attr("href","javascript:void(0)");
}

jQuery(function($) {
	$("#removePicture").on("click",removePicture);
	
	com.post(api.personel.queryUserForSelfByUserId, {}, function(res){
		 
		userProfile.userPhoto=res.user.userPhoto;
		userProfile.age = res.user.age;
		userProfile.phone = res.user.phone;
		userProfile.emergencyMan = res.user.emergencyMan;
		userProfile.emergencyPhone = res.user.emergencyPhone;
		userProfile.qq=res.user.qq;
		userProfile.wechat=res.user.wechat;
		userProfile.email = res.user.email;
		
		initUser();
		
		$("#reset").on("click",function(){
			initUser();
		});
		
		$("#save").on("click",function(){
		
			if(com.validate()){
				return;
			}
			
			parm = {
				"user.userPhoto":$("#picture").val(),
				"user.age":$("#age").val(),
				"user.phone":$("#telephone").val(),
				"user.emergencyMan":$("#emergencyMan").val(),
				"user.emergencyPhone":$("#emergencyPhone").val(),
				"user.qq":$("#qq").val(),
				"user.wechat":$("#wechat").val(),
				"user.email":$("#email").val()	
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
		
	  $("#pictureUpload").Huploadify({
	        'debug' : false, // 开启调试
	        'auto':true, // 是否自动上传
	        'successTimeout': 99999, //超时时间
	        'formData': { //附带值
	            'uploadType':2,
	            'strutsUploadsFileName': '',
	            'username':'用户名',
	            'rnd':'加密密文'
	        },
	        //'swf': "./js/uploadify/uploadify.swf", // flash
	        'overrideEvents': ['onDialogClose'], // 不执行默认的onSelect事件
	        //'queueID': 'uploadfileQueue', // 文件选择后的容器ID
	        'fileObjName': 'strutsUploads', // 服务器端脚本使用的文件对象的名称 $_FILES个['upload']
	        'uploader': main.mediaServer + api.common.uploadImg.url, // 上传处理程序
	        //'buttonImage': 'upbutton.gif', // 浏览按钮的背景图片路径
	        'width': '100', // 浏览按钮的宽度
	        'height': '32', // 浏览按钮的高度
	        //'expressInstall': 'expressInstall.swf',  // expressInstall.swf文件的路径
	        'fileTypeDesc': '支持的格式:', // 在浏览窗口底部的文件类型下拉菜单中显示的文本
	        'fileTypeExts': '*.jpg;*.jpge;*.gif;*.png', // 允许上传的文件后缀
	        'fileSizeLimit': '3MB', // 上传文件的大小限制
	        'queueSizeLimit': 25, // 上传数量
	        'onUploadProgress': function(file, bytesUploaded, bytesTotal, totalBytesUploaded, totalBytesTotal) {
	        	 // 每次更新上载的文件的进展
	             // 有时候上传进度什么想自己个性化控制，可以利用这个方法
	             // 使用方法见官方说明
	        }, 'onSelect': function(file) { // 选择上传文件后调用
	                  
	        }, 'onSelectError': function(file, errorCode, errorMsg){ // 返回一个错误，选择文件的时候触发
	        	alert(errorCode);
	            switch(errorCode) {
	                case -100:
	                    alert("上传的文件数量已经超出系统限制的" + $('#file_upload').uploadify('settings','queueSizeLimit') + "个文件!");
	                    break;
	                case -110:
	                    alert("文件 [" + file.name + "] 大小超出系统限制的" + $('#file_upload').uploadify('settings','fileSizeLimit') + "大小!");
	                    break;
	                case -120:
	                    alert("文件 [" + file.name + "] 大小异常!");
	                    break;
	                case -130:
	                    alert("文件 [" + file.name + "] 类型不正确!");
	                    break;
	            }
	        }, 'onUploadSuccess':function(file, data, response){
				var dateObj=eval("("+data+")");
				if(dateObj.errorCode==0){
				 	$("#picture").val(dateObj.resUrl);
				 	$("#showImg").attr("src", window.mediaServer + api.common.showImg.url + '?imgBasePath='+dateObj.resUrl+'&divFlag=1&width=150&height=150&timestamp='+ new Date().getTime());
				 	$("#infoPicture").attr("href", window.mediaServer + api.common.showImg.url + '?imgBasePath='+dateObj.resUrl+'&timestamp='+ new Date().getTime());
				}else{
					alert(data);
				}
	        }
	    });
	});
});
