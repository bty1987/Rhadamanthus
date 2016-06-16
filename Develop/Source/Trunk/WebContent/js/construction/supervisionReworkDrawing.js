var drawing = {
	galleryId: null,
	saveBtn: null,
	cancellBtn: null,
	modal: null,
	drawingItems: {},
	
	mediaServer: "",
	
	editFlag: false
};

jQuery(function($) {
	
	drawing.galleryId = "reworkDrawingGallery";
	
	drawing.mediaServer = window.mediaServer;
	
	$("#btnBack").click(function(){
		$("#supervisionPageContent").load(api.index.supervisionReworkIndex.url);
	});
	
	com.post(api.construction.queryReworkDrawingByReworkId, supervisionPostData, function(res){
		var reworkDrawings = res.reworkDrawings;
		for(var i=0;i<reworkDrawings.length;i++){
			var reworkDrawing = reworkDrawings[i];
			var imgAddUrl = drawing.mediaServer + api.common.showImg.url + '?imgBasePath='+reworkDrawing.rwdUrl+'&divFlag=1&width=150&height=150&timestamp='+ new Date().getTime();
			var imgUrl = drawing.mediaServer + api.common.showImg.url + '?imgBasePath='+reworkDrawing.rwdUrl+'&timestamp='+ new Date().getTime();
			
			appendGalleryElement(drawing.galleryId, reworkDrawing.rwdId, imgUrl, imgAddUrl, "", api.construction.deleteReworkDrawingById.url);
		}
	});
	
	$("#pictureUpload").Huploadify({
        'debug': false, // 开启调试
        'auto': true, // 是否自动上传
        'successTimeout': 150, // 超时时间
        'formData': { // 附带值
            'uploadType':5,
            'username':'用户名',
            'rnd':'加密密文'
        },
        'buttonClass': 'btn btn-success',
        'buttonText': '上传',
        //'swf': "./js/uploadify/uploadify.swf", //flash
        'overrideEvents' : ['onDialogClose'], // 不执行默认的onSelect事件
        //'queueID':'uploadfileQueue', // 文件选择后的容器ID
        'fileObjName':'strutsUploads', // 服务器端脚本使用的文件对象的名称 $_FILES个['upload']
        'uploader':drawing.mediaServer + api.common.uploadImg.url, // 上传处理程序
        //'buttonImage':'upbutton.gif', // 浏览按钮的背景图片路径
        //'width':'100', // 浏览按钮的宽度
        'height':'45', // 浏览按钮的高度
        //'expressInstall':'expressInstall.swf', // expressInstall.swf文件的路径。
        'fileTypeDesc':'支持的格式:', // 在浏览窗口底部的文件类型下拉菜单中显示的文本
        'fileTypeExts':'*.jpg;*.jpge;*.gif;*.png', // 允许上传的文件后缀
        'fileSizeLimit':'3MB', // 上传文件的大小限制
        'queueSizeLimit' : 25, // 上传数量
        'onUploadProgress' : function(file, bytesUploaded, bytesTotal, totalBytesUploaded, totalBytesTotal) { // 每次更新上载的文件的进展
             //有时候上传进度什么想自己个性化控制，可以利用这个方法
             //使用方法见官方说明
        }, 'onSelect' : function(file) { // 选择上传文件后调用
                  
        }, 'onSelectError':function(file, errorCode, errorMsg){ // 返回一个错误，选择文件的时候触发
            switch(errorCode) {
                case -100:
                    alert("上传的文件数量已经超出系统限制的"+$('#file_upload').uploadify('settings','queueSizeLimit')+"个文件！");
                    break;
                case -110:
                    alert("文件 ["+file.name+"] 大小超出系统限制的"+$('#file_upload').uploadify('settings','fileSizeLimit')+"大小！");
                    break;
                case -120:
                    alert("文件 ["+file.name+"] 大小异常！");
                    break;
                case -130:
                    alert("文件 ["+file.name+"] 类型不正确！");
                    break;
            }
        }, 'onUploadSuccess':function(file, data, response){ // 上传到服务器，服务器返回相应信息到data里 
        	var dateObj = eval("("+data+")");
        	
        	if(dateObj.errorCode == 0){
				
				var options = {
					"reworkDrawing.rwId": supervisionPostData["reworkDrawing.rwId"],
					"reworkDrawing.rwdName": "",
					"reworkDrawing.rwdUrl": dateObj.resUrl,
					"reworkDrawing.rwdAddUrl": "",
				};
				
				var imgAddUrl = drawing.mediaServer + api.common.showImg.url + '?imgBasePath='+dateObj.resUrl+'&divFlag=1&width=150&height=150&timestamp='+ new Date().getTime();
				var imgUrl = drawing.mediaServer + api.common.showImg.url + '?imgBasePath='+dateObj.resUrl+'&timestamp='+ new Date().getTime();
				
				com.post(api.construction.addRework, options, function(res){
					var reworkDrawing = res.reworkDrawing;
					appendGalleryElement(drawing.galleryId, reworkDrawing.rwdId, imgUrl, imgAddUrl, "", api.construction.deleteReworkDrawingById.url);
				});
			}else{
				console.log(data);
			}
        }
    });
	
});

function appendGalleryElement(galleryId, imgId, imgUrl, imgAddUrl, editUrl, deleteFunc){
	var gallery = $("#"+galleryId);
	var imgLi = $("<li></li>").attr("id", "gallery_li"+imgId).appendTo(gallery);
	var imgA = $("<a></a>").attr("href", imgUrl).attr("data-rel", "colorbox").appendTo(imgLi);
	$("<img></img>").attr("src", imgAddUrl).attr("alt", "150x150").appendTo(imgA);
	var toolsDiv = $("<div></div>").addClass("tools tools-bottom").appendTo(imgLi);
	var toolsA = $("<a></a>").attr("href", "#").on("click", function(){
		var options = {
			"reworkDrawing.rwId": supervisionPostData["reworkDrawing.rwId"],
			"reworkDrawing.rwdId": imgId,
		};
		com.post(api.construction.deleteReworkDrawingById, options, function(res){
			$("#gallery_li"+imgId).remove();
		});
	}).appendTo(toolsDiv);
	$("<i></i>").addClass("icon-remove red").appendTo(toolsA);
};
