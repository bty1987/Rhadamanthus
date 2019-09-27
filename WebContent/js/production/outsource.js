$(function(){
    var outsource = {
        saveBtn : com.focusPage("#saveBtn"),
        cancelBtn : com.focusPage("#cancelBtn"),

        modals: {
            outsourceModal: com.focusPage("#outsourceModal"),
            layerImportModal: com.focusPage("#layerImportModal")
        },
        items : {
            comment : com.focusPage("#comment")
        },
        editFlg : true,
        outsourcePostData : {},
        pid : params["pid"],
        status : params["status"]
    };

    outsource.saveBtn.bindClick(saveData);

    outsource.modals.outsourceModal.on("hide.bs.modal", function(){
        com.clearValidator();
        com.cleanItems(outsource.items);
    });

    var displayFunc = (function(){

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

        var  creatLine = function(v) {

            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid');
            var $title = $('<small></small>').addClass('blue') .html(v.comment);
            var $btnDiv = $('<div></div>').addClass('action-buttons pull-right');
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');

            var $btnimport = $('<a></a>').addClass(' btn btn-minier btn-yellow').html('图表');
            var $btnChild = $('<a></a>').addClass(' btn btn-minier btn-success').html('外协项');
            var $btnReceipt = $('<a></a>').addClass(' btn btn-minier btn-warning').html('收货');
            var $btnaBolition = $('<a></a>').addClass(' btn btn-minier btn-inverse').html('废除');
            var $btnEdit = $('<a></a>').addClass(' btn btn-minier btn-danger').html('编辑');

            var propertyArr = [
                ["状态:",v.status == 0 ? "未到货" : (v.status == 1 ? "已到货" :  "废除"),"grey"]
            ];

            $.each(propertyArr, function (index,value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $liLine.append($h3).append($ulProperty);
            if (v.status ==0 && (outsource.status != 4 && outsource.status != 5)){
                $btnDiv.append($btnChild).append($btnimport).append($btnEdit).append($btnReceipt).append($btnaBolition);

            }else{
                $btnDiv.append($btnChild).append($btnimport);
            }

            $h3.append($title).append($btnDiv);


            $btnReceipt.click(function () {
                com.showConfirm("是否确认到货", function(){
                    arrivedAndDestory(v.oid,"1");
                });
            });

            $btnaBolition.click(function () {
                com.showConfirm("是否确认废除", function(){
                    arrivedAndDestory(v.oid,"2");
                });
            });

            $btnEdit.click(function() {
                outsource.editFlg = false;
                outsource.items.oid = v.oid;
                outsource.items.comment.val(v.comment);
                outsource.modals.outsourceModal.modal("show");
            });

            $btnimport.click(function () {

                outsource.modals.layerImportModal.modal("show").find(".infobox").remove();
                if(v.path){
                    createLine(v.path, v.comment);//显示文件与下载
                }

                com.focusPage('#importProductionPicture').empty();
                hidBtn( com.focusPage('#importProductionPicture'), v.status);

                com.uploadify("#importProductionPicture","添加上传文件",'btn btn-success col-sm-12',"*.xlsx","'uploadType': 2",1,function(data) {
                    var option = {
                        "outsource.oid": v.oid,
                        "outsource.path": data.resUrl
                    };
                    com.post(api.production.updateOutsource,option,function(res){
                        com.showAlert(com.info, "操作成功");
                        salesSearcher.doSearch();
                    });
                });
            });

            $btnChild.click(function () {
                params["oid"] = v.oid;
                params.outsourceStatus = v.status;
                params.productionStatus = outsource.status;
                com.switchPage(api.index.outsourceItemIndex.url);
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

    var salesSearcher = new Searcher();

    salesSearcher.init(null, "condList", api.production.pageOutsource, function(data){
        displayFunc.init('resultList', data);
    }, "pagenation", "salesPostData",{"pid":outsource.pid}, false, null,function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('id', 'addOutsource').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);
        var $backBtn = $('<a></a>').addClass('btn btn-minier pull-left').attr('id', 'backs').css("margin", "0px 3px");
        var $backBtns = $('<i></i>').addClass('icon-mail-forward bigger-110').appendTo($backBtn);
        var $backSpan = $('<span></span>').text('返回').appendTo($backBtn);

        hidBtn($adda,0);
        return [$adda,$backBtn];
    });

    com.focusPage('#backs').click(function() {
        com.switchPage(api.index.productionIndex.url)
    });

    com.focusPage("#addOutsource").click(function() {
        outsource.editFlg = true;
        outsource.modals.outsourceModal.modal("show");
    });

    function arrivedAndDestory(id,statusType){

        com.post(api.production.updateOutsourceForStatus, {
            "outsource.oid":id ,
            "outsource.status": statusType//状态为 1或2 1.收货 2.废除
        },function(res){
            com.showAlert(com.info, "操作成功");
            salesSearcher.doSearch();
        });
    }

    function saveData() {
        if (com.validate('outsourceModal')) {
            return false;
        }
        var url;
        var options = {
            "outsource.pid": outsource.pid,
            "outsource.path" : "",
            "outsource.comment":  outsource.items.comment.val()
        };
        //判断editFlg是否为true或false true执行添加 false执行更新
        outsource.editFlg ? url = api.production.addOutsource : url = api.production.updateOutsource, options["outsource.oid"] = outsource.items.oid;

        com.post(url, options, function(res){
            com.closePopup();
            salesSearcher.doSearch();
            com.showAlert(com.info, "操作成功");
        });
        outsource.modals.outsourceModal.modal("hide");
    }

    function hidBtn(btnId,otherStatus){
        btnId.removeClass('hide');
        if (outsource.status == 5 || outsource.status == 4 ) {
            btnId.addClass('hide');
        }else if(otherStatus != 0 ){
            btnId.addClass('hide');
        }
    }

    function createLine(path, comment){

        var $line = outsource.modals.layerImportModal.find("#download");
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
    }
});