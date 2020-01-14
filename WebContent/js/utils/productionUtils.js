var productionUtils = {

    dateDiffer : function (createTime,timeLimit){
    var currentDate,createDate,createDateList,unit,workingDate,remainDate;
    unit = utils.accMul(24,utils.accMul(3600,1000));//转换单位
    currentDate = new Date();
    createDateList = createTime.split("-");
    createDate = new Date(createDateList[1]+"-"+createDateList[2]+"-"+createDateList[0]);

    workingDate = parseInt( utils.accDiv(utils.accSub(currentDate,createDate),unit));
    remainDate = utils.accSub(timeLimit,workingDate);

    return remainDate;

    },loadHuploadify : function (eId, ename, fileType, multi, callback, btnstyle) {

        com.focusPage("#" + eId).Huploadify({
            'debug': false, // 开启调试
            'auto': true, // 是否自动上传
            'successTimeout': 150, // 超时时间
            'formData': { // 附带值
                'uploadType': 2
            },
            'buttonClass': 'btn ' + btnstyle ? btnstyle : "btn-success",
            'buttonText': ename,
            'overrideEvents': ['onDialogClose'], // 不执行默认的onSelect事件
            'fileObjName': 'strutsUploads', // 服务器端脚本使用的文件对象的名称 $_FILES个['upload']
            'uploader': config.media + api.common.uploadImg.url, // 上传处理程序
            'width': '100', // 浏览按钮的宽度
            'height': '32', // 浏览按钮的高度
            'fileTypeDesc': '支持的格式:', // 在浏览窗口底部的文件类型下拉菜单中显示的文本
            'fileTypeExts': fileType, // 允许上传的文件后缀
            'fileSizeLimit': '5MB', // 上传文件的大小限制
            'multi': multi,
            'queueSizeLimit': 5, // 上传数量
            'onUploadSuccess': function (file, data, response) { // 上传到服务器,服务器返回相应信息到data里
                callback(data);
            }
        });

    }, createLine : function (path, no, $line){

       var _name = no +".xlsx";

       var $box = $("<div></div>").addClass("infobox infobox-blue infobox-dark");
       var $iconGrouop = $("<div></div>").addClass("infobox-icon");
       var $icondownload = $("<a></a>").addClass("icon-download-alt");
       com.downloadFile($icondownload, path, _name);

       var $dataGrouop = $("<div></div>").addClass("infobox-data");
       var $name = $("<div></div>").addClass("infobox-content").html(_name);

       $dataGrouop.append($name);
       $iconGrouop.append($icondownload);
       $box.append($iconGrouop).append($dataGrouop);
       $line.append($box);
   }
};
