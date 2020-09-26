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

        com.uploadify("#" + eId, ename, api.common.uploadImg, ('btn ' + btnstyle ? btnstyle : "btn-success"), fileType, {'uploadType': 2}, 5, function(data){
            callback(data);
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
