$(function(){

   var hardware = {

        btns:{
            saveBtn: com.focusPage("#saveBtn"),
            cancelBtn : com.focusPage("#cancelBtn"),
            confirmBtn : com.focusPage("#confirmBtn")
        },
        modals:{
            addHardwareModel: com.focusPage("#addHardwareModel"),
            layerImportModal: com.focusPage("#layerImportModal")

        },
        items: {
            comment: com.focusPage("#comment"),
        },
        editFlg : true,
        pid : params.pid,
        productionStatus : params.status

    };


    hardware.btns.saveBtn.bindClick(saveData);


    hardware.modals.addHardwareModel.on("hide.bs.modal", function () {
        com.clearValidator();
        com.cleanItems(hardware.items);
    });


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
                var $title = $('<small></small>').addClass('blue').html(' ' + v.comment);
                var $btnDiv = $('<div></div>').addClass('action-buttons pull-right');
                var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');

                var $btnEdit = $('<a></a>').addClass(' btn btn-minier btn-yellow').html('编辑');
                var $btnUpload = $('<a></a>').addClass(' btn btn-minier btn-success').html('图表');
                var $btnHr = $('<a></a>').addClass(' btn btn-minier btn-warning').html('五金项');
                var $btnArrival = $('<a></a>').addClass(' btn btn-minier btn-inverse').html('到货');
                var $btnDestory = $('<a></a>').addClass(' btn btn-minier btn-danger').html('废弃');

                var status = "";

                switch (v.status) {
                    case 0:
                        status = "未到货";
                        break;
                    case 1:
                        status = "已到货";
                        break;
                    case 2:
                        status = "废除";
                        break;
                }
                var propertyArr = [
                    ["状态:", status, "red"]
                ];

                $.each(propertyArr, function (index, value) {
                    var $liProperty = $('<li></li>');
                    $('<strong></strong>').html(value[0]).appendTo($liProperty);
                    $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                    $liProperty.appendTo($ulProperty);
                });

                $liLine.append($h3).append($ulProperty);
                if (v.status == 0 && (hardware.productionStatus != 4 && hardware.productionStatus != 5)) {
                    $btnDiv.append($btnEdit)
                        .append($btnUpload).append($btnHr)
                        .append($btnArrival).append($btnDestory)
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

                //废除按钮
                $btnDestory.click(function () {
                    hardwareDestory(v.hid);
                });

                //已到货按钮
                $btnArrival.click(function () {
                    hardwareArrived(v.hid);
                });

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

    var _condArr = [];

    hardwareSearcher.init( _condArr, "condList", api.production.pageHardware, function(data){
        displayFunc.init('resultList', data);
    }, "pagenation", "hardwarePostData", {"production.pid":hardware.pid}, false, null, function(){

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('id', 'addHardware').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);
        var $backBtn = $('<a></a>').addClass('btn btn-minier pull-left').attr('id', 'backs').css("margin", "0px 3px");
        var $backBtns = $('<i></i>').addClass('icon-mail-forward bigger-110').appendTo($backBtn);
        var $backSpan = $('<span></span>').text('返回').appendTo($backBtn);


        if (hardware.productionStatus == 5 || hardware.productionStatus == 4 ) {
            $adda.addClass('hide');
        }

        return [$adda,$backBtn];

    });


    com.focusPage('#addHardware').click(function(){
        hardware.editFlg = true;
        com.clearValidator();
        hardware.modals.addHardwareModel.modal("show");
    });

    com.focusPage('#backs').click(function(){
        com.switchPage(api.index.productionIndex.url)
    });

    function unload(v) {

        com.focusPage("#layerImportModal").find('.infobox').remove();

        if(v.path){
            createLine(v.path, v.comment);
        }

        com.focusPage('#importHardwareExcel').empty();

        if(v.status != 0 ){
            btnId.addClass('hide');
        }


        com.uploadify("#importHardwareExcel", "添加上传文件", 'btn btn-success blue ', "*.xlsx", {'uploadType': 2}, 1, function(data){
            var option = {};

            option["hardware.hid"] = v.hid;

            if (data.errorCode == 0) {
                option["hardware.path"] = data.resUrl;
            }else{
                com.showAlert(com.warning, "上传失败");
            }

            com.post(api.production.updateHardware,option,function(res){
                com.showAlert(com.info, "操作成功");
                hardwareSearcher.doSearch();
            });
        });

        hardware.modals.layerImportModal.modal("show");

    }

    function showItem(v){
        params.hid = v.hid;
        params.hardwareStatus = v.status;
        params.productionStatus = hardware.productionStatus;
        com.switchPage(api.index.hardwareItemIndex.url);
    };


    //状态已到货
    function hardwareArrived(id){
        com.showConfirm("是否确认到货", function () {
            com.post(api.production.updateHardwareForStatus, {
                "hardware.hid": id,
                "hardware.status": "1"
            }, function (res) {
                com.showAlert(com.info, "操作成功");
                hardwareSearcher.doSearch();
            });
        })
    }

    //状态废除
    function hardwareDestory(id){

        com.showConfirm("是否确认删除", function () {
            com.post(api.production.updateHardwareForStatus,{
                "hardware.hid":id,
                "hardware.status":"2"
            },function(res){
                com.showAlert(com.info, "操作成功");
                hardwareSearcher.doSearch();
            });
        });
    };

    function showUpdate(v){
        com.clearValidator();
        hardware.editFlg = false;
        hardware.items.hid = v.hid;
        hardware.items.comment.val(v.comment);
        hardware.modals.addHardwareModel.modal("show");
    }

    function saveData(){

        if (com.validate('addHardwareModel')) {
            return false;
        };

        var url;
        var options ={
            "hardware.pid":hardware.pid,
            "hardware.path":"",
            "hardware.comment": hardware.items.comment.val(),
        };

        hardware.editFlg ? url = api.production.addHardware : url = api.production.updateHardware, options["hardware.hid"] = hardware.items.hid;

        com.post(url,options,function (res) {
            com.closePopup();
            com.showAlert(com.info, "操作成功");
            hardwareSearcher.doSearch();
        })
        hardware.modals.addHardwareModel.modal("hide");
    };

    function createLine(path, comment){

        var $line = hardware.modals.layerImportModal.find(".infobox-container");

        var $name = comment+".xlsx";

        var $box = $("<div></div>").addClass("infobox infobox-blue infobox-dark");

        var $iconGrouop = $("<div></div>").addClass("infobox-icon");
        var $icondownload = $("<a></a>").addClass("icon-download-alt");
        com.downloadFile($icondownload, path, $name);

        var $dataGrouop = $("<div></div>").addClass("infobox-data");
        var $name = $("<div></div>").addClass("infobox-content").html($name);

        $dataGrouop.append($name);
        $iconGrouop.append($icondownload);
        $box.append($iconGrouop).append($dataGrouop);
        $line.append($box)
    };

    hardware.btns.confirmBtn.click(function () {
        hardware.modals.layerImportModal.modal("hide");
    })


});

