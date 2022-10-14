$(function(){

   var hardware = {

        btns:{
            saveBtn: com.focusPage("#saveBtn"),
            saveFinishBtn : com.focusPage("#saveFinishBtn"),
            cancelBtn : com.focusPage("#cancelBtn"),
            confirmBtn : com.focusPage("#confirmBtn")
        },
        modals:{
            addHardwareModel: com.focusPage("#addHardwareModel"),
            finishModal: com.focusPage("#finishModal"),
            layerImportModal: com.focusPage("#layerImportModal")

        },
        items: {
            comment: com.focusPage("#comment"),
            num: com.focusPage("#num")
        },

       hdStatus : {},
    };

    var pageConfig = drawNode.getConfig(params['urlLoadParams'].depage);

    hardware.btns.saveBtn.bindClick(update);
    hardware.btns.saveFinishBtn.bindClick(finish);

    hardware.modals.addHardwareModel.on("hide.bs.modal", function () {
        com.cleanItems(hardware.items);
        com.clearValidator();
        com.closeTip();
    });

    hardware.modals.finishModal.on("hide.bs.modal", function () {
        com.cleanItems(hardware.items);
        com.clearValidator();
        com.closeTip();
    });

    com.post(api.ds.production, {}, function(res){
        hardware.hdStatus = res.hardwareStatus.split("key", "value");
    },null ,false);

    var displayFunc  = (function(){

            var renderList = function (tableId, listData) {
                var $tableWrap = com.focusPage('#' + tableId).empty();
                var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

                if (listData && listData.length) {
                    $.each(listData, function (i, v) {
                        var $liLine = creatLine(v);

                        $liLine.appendTo($ul);
                    });

                    $ul.appendTo($tableWrap);
                }
            };

            var creatLine = function (v) {
                var $liLine = $('<li></li>').addClass('item-orange clearfix');
                var $h3 = $('<h3></h3>').addClass('oid')
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

                var propertyArr = [];

                $.each(pageConfig.propertyArr, function (pi, pv) {
                    switch (pv) {
                        case "productionNo":
                            propertyArr.push(["生产单号:",v.production.pno,"blue"]);
                            break;
                        case "orderId":
                            propertyArr.push(["装修单号:", v.production.orderId, "blue"]);
                            break;
                        case "address":
                            propertyArr.push(["楼盘地址:", v.production.house.village.name + " " + v.production.house.houseNumber, "grey"]);
                            break;
                        case "creater":
                            propertyArr.push(["创建人:", v.creater.userName, "grey"]);
                            break;
                        case "createTime":
                            propertyArr.push(["创建时间:", v.createTime , "green"]);
                            break;
                        case "finishTime":
                            propertyArr.push(["结束时间:",v.finishTime,"green"]);
                            break;
                        case "status":
                            propertyArr.push(["状态:", hardware.hdStatus[v.status], "red"]);
                            break;
                        case "timeLimit":
                            propertyArr.push(["工期:", v.timeLimit, "green"]);
                            break;
                        case "remainingTime":
                            propertyArr.push(["订单剩余时间:",remainDay,(remainDate < 5 ? "red":"green")]);
                            break;
                        case "comment":
                            propertyArr.push(["说明:", v.comment, "grey"]);
                            break;
                    }
                });

                $.each(propertyArr, function (index, value) {
                    var $liProperty = $('<li></li>');
                    $('<strong></strong>').html(value[0]).appendTo($liProperty);
                    $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                    $liProperty.appendTo($ulProperty);
                });

                $.each(pageConfig.pageBtn, function (k, b) {
                    switch (b) {
                        case "btnUpdate"://编辑
                            if ([0, 1, 2].indexOf(v.status) != -1) {
                                $btnDiv.append($btnEdit);
                            }
                            break;
                        case "btnHard"://五金项
                            $btnDiv.append($btnHr);
                            break;
                        case "btnImport"://图表
                            $btnDiv.append($btnUpload);
                            break;
                        case "btnInstore"://入库
                            if (v.status == 1) {
                                $btnDiv.append($btnInstore);
                            }
                            break;
                        case "btnFinish"://完结
                            if (v.status == 2) {
                                $btnDiv.append($btnFinish);
                            }
                            break;
                    }
                    $h3.append($title).append($btnDiv);
                });

                $liLine.append($h3).append($ulProperty);

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
                //入库按钮
                $btnInstore.click(function (){
                    instore(v);
                })
                //完结按钮
                $btnFinish.click(function () {
                    showFinish(v);
                })

                return $liLine;

            };

        return {
            init : function(tableId,listData){
                com.focusPage('#' + tableId).html(null);
                renderList(tableId,listData);
            },
            drawLine : function(v){
                return creatLine(v);
            }
        };
    })();

    /*分页*/
    var hardwareSearcher = new Searcher();

    hardwareSearcher.init( pageConfig.condArr, "hardwareCondList", pageConfig.apiPage, function(data){
        displayFunc.init('hardwareResultList', data);
    }, "hardwarePagenation", pageConfig.postDataName, null, false, null, null,"hardwareResultList");

    function showUpdate(v){
        com.clearValidator();
        hardware.items.hid = v.hid;
        hardware.modals.addHardwareModel.modal("show");
    }
    //五金项
    function showItem(v){
        params.hid = v.hid;
        params.hardwareStatus = v.status;
        params.productionStatus = hardware.productionStatus;
        com.popup4page("#layerPopUp", "views/production/hardwareItem.html", "五金项");
    };

    function showFinish(v){
        hardware.items.hid = v.hid;
        hardware.modals.finishModal.modal("show");
    }

    function instore(v) {
        com.showConfirm("是否确认入库", function () {
            com.post(api.production.instoreHardware, {
                "hardware.hid": v.hid,
                "hardware.status": "2"
            }, function (res) {
                com.showAlert(com.info, "操作成功");
                hardwareSearcher.doSearch();
            });
        })
    }

    //修改
    function update(){

        if (com.validate('addHardwareModel')) {
            return false;
        };

        var options ={
            "hardware.hid":hardware.items.hid,
            "hardware.comment": hardware.items.comment.val(),
        };

        com.post(api.production.updateHardware,options,function (res) {
            com.closePopup();
            com.showAlert(com.info, "操作成功");
            hardwareSearcher.doSearch();
        })
        hardware.modals.addHardwareModel.modal("hide");
    };
    //完结
    function finish() {
        if (com.validate('finishModal')) {
            return false;
        };

        var options ={
            "hardware.hid":hardware.items.hid,
            "hardware.num": hardware.items.num.val(),
        };
        com.post(api.production.finishHardware,options,function (res) {
            com.focusPage('#list ul.item-list').remove();
            com.showAlert(com.info, "操作成功");
            hardwareSearcher.doSearch();
        })
        hardware.modals.finishModal.modal("hide");
    }

    function unload(v) {

        hardware.modals.layerImportModal.modal("show").find(".infobox").remove();
        var $line = com.focusPage('#download');

        if(v.path){
            productionUtils.createLine(v.path, v.no, $line);
        }

        com.focusPage('#importHardwareExcel').removeClass('hide');

        if(v.status == 3 || v.status == 4 ){
            com.focusPage('#importHardwareExcel').addClass('hide');
        }

        com.uploadify("#importHardwareExcel", "上传文件", api.common.uploadOther, 'btn btn-success blue ', "*.xlsx", {'uploadType': 2}, 1, function(data){
            var option = {};

            option["hardware.hid"] = v.hid;

            if (data.errorCode == 0) {
                option["hardware.path"] = data.resUrl;
                option["hardware.filesize"] = data.filesize;
            }else{
                com.showAlert(com.warning, "上传失败");
            }
            
            com.post(api.production.updateHardware,option,function(res){
                com.showAlert(com.info, "操作成功");
                $line.find(".infobox").remove();
                productionUtils.createLine(v.path, v.no, $line);
                hardwareSearcher.doSearch();
            });
        });
    };

    hardware.btns.confirmBtn.click(function () {
        hardware.modals.layerImportModal.modal("hide");
    });
});

