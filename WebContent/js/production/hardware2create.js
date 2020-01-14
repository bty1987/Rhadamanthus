$(function (){
    var queryHardware={
        btns:{
            saveFinishBtn : com.focusPage("#saveFinishBtn"),
            saveBtn : com.focusPage("#saveBtn"),//添加确定
            addHardwareBtn : com.focusPage("#addHardwareBtn"),//创建按钮
            backBtn : com.focusPage("#backBtn"),//返回
        },

        modals:{
            hardwareModal:com.focusPage("#hardwareModal"),
            finishModal: com.focusPage("#finishModal"),
            layerImportModal:com.focusPage("#layerImportModal")
        },

        items:{
            comment: com.focusPage("#comment"),
            timeLimit: com.focusPage("#timeLimit"),
            hrStatus: com.focusPage("#hrStatus"),
            num: com.focusPage("#num")
        },
        hdStatus : {},
        editFlg : true,
        pid : params.pid,
        productionStatus : params.status
    };

    com.post(api.ds.production, {}, function(res){
        queryHardware.items.hrStatus.bindData(res.hrStatus, "key", "value");
        queryHardware.hdStatus = res.hardwareStatus.split("key", "value");
    },null ,false);

    queryHardware.btns.addHardwareBtn.click(function(){
        com.clearValidator();
        queryHardware.editFlg = true;
        styleDisplay(true);
        queryHardware.modals.hardwareModal.modal("show");
    });
    queryHardware.btns.saveBtn.bindClick(saveDate);
    queryHardware.btns.saveFinishBtn.bindClick(finish);

    queryHardware.btns.backBtn.click(function () {
        com.switchPage(api.index.productionIndex.url);
    });

    com.focusPage('#finishModal,#hardwareModal').on("hide.bs.modal", function () {
        com.cleanItems(queryHardware.items);
        com.clearValidator();
        com.closeTip();
    });

    var initList = function (listData) {
        var $tableWrap = com.focusPage('#list').empty();
        var $ul = $('<ul></ul>').addClass('item-list ui-sortable  fl-table-list');

        if(!listData.length){
            var $resultList = com.focusPage("#list").addClass('dz-default dz-message').html('');
            var $zone = $('<div></div>').addClass('dropzone dz-clickable').css('margin', '20px').css('border', '0px').appendTo($resultList);
            var $mesg = $('<div></div>').addClass('dz-default dz-message').appendTo($zone);
            var $span = $('<span></span>').text('无可用数据提供').appendTo($mesg);
            return $resultList;
        }else if (listData && listData.length) {

            $.each(listData, function (i, v) {
                var $liLine = $('<li></li>').addClass('item-orange clearfix');
                var $h3 = $('<h3></h3>').addClass('oid');
                var $title = $('<small></small>').addClass('blue').html(' ' + v.no);
                var $btnDiv = $('<div></div>').addClass('action-buttons pull-right');
                var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');

                var $btnEdit = $('<a></a>').addClass(' btn btn-minier btn-yellow').html('编辑');
                var $btnUpload = $('<a></a>').addClass(' btn btn-minier btn-success').html('图表');
                var $btnHr = $('<a></a>').addClass(' btn btn-minier btn-warning').html('五金项');
                var $btnInstore = $('<a></a>').addClass(' btn btn-minier btn-inverse').html('入库');
                var $btnFinish = $('<a></a>').addClass(' btn btn-minier btn-danger').html('完结');

                var remainDate = productionUtils.dateDiffer(v.createTime, v.timeLimit);//计算剩余工期
                var remainDay = 0 ;  //显示剩余工期

                if(v.status == 3 || v.status == 4){
                    remainDay = "订单已结束";
                }else if(remainDate < 0){
                    remainDay = "已超过期限"+Math.abs(remainDate)+"天";
                }else {
                    remainDay = "剩余工期"+Math.abs(remainDate)+"天"
                }

                var propertyArr = [
                    ["生产单号:", v.production.pno, "blue"],
                    ["装修单号:", v.production.orderId, "blue"],
                    ["楼盘地址:", v.production.house.village.name + " " + v.production.house.houseNumber, "blue"],
                    ["创建人:", v.creater.userName, "grey"],
                    ["创建时间:", v.createTime , "green"],
                    ["结束时间:", v.finishTime, "green"],
                    ["状态:", queryHardware.hdStatus[v.status], "red"],
                    ["工期:", v.timeLimit, "green"],
                    ["剩余时间:",remainDay,(remainDate < 5 ? "red":"green")],
                    ["备注:", v.comment, "grey"]
                ];

                $.each(propertyArr, function (index, value) {
                    var $liProperty = $('<li></li>');
                    $('<strong></strong>').html(value[0]).appendTo($liProperty);
                    $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                    $liProperty.appendTo($ulProperty);
                });

                $liLine.appendTo($ul);
                $liLine.append($h3).append($ulProperty);

                if (queryHardware.productionStatus != 6 && queryHardware.productionStatus != 7) {
                    if (v.status == 0){
                        $btnDiv.append($btnEdit).append($btnUpload).append($btnHr)
                    }else if (v.status == 1){
                        $btnDiv.append($btnEdit).append($btnUpload).append($btnHr).append($btnInstore)
                    }else if (v.status == 2){
                        $btnDiv.append($btnEdit).append($btnUpload).append($btnHr).append($btnFinish)
                    }else {
                        $btnDiv.append($btnUpload).append($btnHr)
                    }
                } else {
                    $btnDiv.append($btnUpload).append($btnHr)
                }

                $h3.append($title).append($btnDiv);

                //编辑按钮
                $btnEdit.click(function () {
                    showUpdate(v);
                });

                //上传按钮
                $btnUpload.click(function () {
                    unload(v);
                });

                //五金项按钮
                $btnHr.click(function () {
                    showItem(v);
                });

                $btnInstore.click(function (){
                    instore(v);
                })

                $btnFinish.click(function () {
                    showFinish(v);
                })

            });
            $ul.appendTo($tableWrap);
        }
    };

    queryHardwareByPid(queryHardware.pid);

    function queryHardwareByPid(pid) {

        com.post(api.production.queryHardwareByPid, {"hardware.production.pid": pid}, function (data) {
            initList(data.hardwares);
        }, function (e) {
            com.showAlert(com.error, e.errorMsg);
        }, false);
    };

    function showFinish(v){
        queryHardware.items.hid = v.hid;
        queryHardware.items.num.val();
        queryHardware.modals.finishModal.modal("show");
    };

    function showItem(v){
        params.hid = v.hid;
        params.hardwareStatus = v.status;
        params.productionStatus = queryHardware.productionStatus;
        com.popup4page("#layerPopUp", "views/production/hardwareItem.html", "五金项");
    };

    function showUpdate(v){
        com.clearValidator();
        queryHardware.editFlg = false;

        queryHardware.items.hid = v.hid;
        queryHardware.items.hrStatus.val(v.status);
        queryHardware.items.timeLimit.val(v.timeLimit);
        queryHardware.items.comment.val(v.comment);

        styleDisplay(false);//将类型与工期的输入框显示设为无
        queryHardware.modals.hardwareModal.modal("show");
    };

    function instore(v) {
        com.showConfirm("是否确认入库", function () {
            com.post(api.production.instoreHardware, {
                "hardware.hid": v.hid,
                "hardware.status": "2"
            }, function (res) {
                com.showAlert(com.info, "操作成功");
                queryHardwareByPid(queryHardware.pid)
            });
        })
    };

    if(queryHardware.productionStatus ==6 || queryHardware.productionStatus ==7){
        queryHardware.btns.addHardwareBtn.addClass('hide');
    }

    function saveDate(){
        if (com.validate('hardwareModal')) {
            return false;
        };

        var url;

        var options ={
            "hardware.production.pid" : queryHardware.pid,
            "hardware.status": queryHardware.items.hrStatus.val(),
            "hardware.timeLimit": queryHardware.items.timeLimit.val(),
            "hardware.path" : "",
            "hardware.comment": queryHardware.items.comment.val(),
        };

        queryHardware.editFlg == true ? url = api.production.addHardware : url = api.production.updateHardware,options["hardware.hid"] = queryHardware.items.hid;

        com.post(url,options,function(){

            com.showAlert(com.info, "添加成功");
            queryHardwareByPid(queryHardware.pid);
        })

        queryHardware.modals.hardwareModal.modal("hide");
    };

    function finish() {
        if (com.validate('finishModal')) {
            return false;
        };

        var options ={
            "hardware.hid":queryHardware.items.hid,
            "hardware.num": queryHardware.items.num.val(),
        };
        com.post(api.production.finishHardware,options,function (res) {
            com.focusPage('#list ul.item-list').remove();
            com.showAlert(com.info, "操作成功");
            queryHardwareByPid(queryHardware.pid);
        })
        queryHardware.modals.finishModal.modal("hide");
    }


    if (queryHardware.productionStatus == 6 || queryHardware.productionStatus == 7 ) {
        queryHardware.btns.addHardwareBtn.addClass('hide');
    }

    function unload(v) {

        queryHardware.modals.layerImportModal.modal("show").find(".infobox").remove();
        var $line = com.focusPage('#download');

        if(v.path){
            productionUtils.createLine(v.path, v.no, $line);//显示文件与下载
        }

        com.focusPage('#importHardwareExcel').removeClass('hide');

        if(v.status == 3||v.status == 4){
            com.focusPage('#importHardwareExcel').addClass('hide');
        }

        com.uploadify("#importHardwareExcel","添加上传文件",'btn btn-success col-sm-12',"*.xlsx","'uploadType': 2",1,function(data) {

            var option = {
                "hardware.hid": v.hid,
                "hardware.path": data.resUrl
            };
            com.post(api.production.updateHardware,option,function(res){
                com.showAlert(com.info, "操作成功");
                $line.find(".infobox").remove();
                productionUtils.createLine(v.path, v.no, $line);
                queryHardwareByPid(queryHardware.pid);
            });
        });
    };

    function styleDisplay (display){//隐藏输入框
        var $none = com.focusPage('#typeDisplay,#timeLimitDisplay');
        display == true ? $none.removeAttr("style", "display: none;") : $none.attr("style", "display: none;");
    }
});
