$(function(){

    var productionPlan = {

        saveBtn: com.focusPage("#saveBtn"),
        cancelBtn : com.focusPage("#cancelBtn"),

        modals: {
            productionPlanModal: com.focusPage("#productionPlanModal"),
            layerImport: com.focusPage("#layerImport")
        },

        items: {
            startTime: com.focusPage("#startTime"),
            endTime: com.focusPage("#endTime"),
            comment: com.focusPage("#comment")
        },

        editFlg: true,

        PostData : {
            pid: params.pid,
            status: params.status
        },

        status: {},
    }

    productionPlan.saveBtn.bindClick(saveData);

    com.datetime(com.focusPage(".date-picker-date"));//时间初始化

    productionPlan.modals.productionPlanModal.on("hide.bs.modal", function () {
        com.cleanItems(productionPlan.items);
        com.closeTip();
    });

    var displayFunc  = (function(){

        var renderList = function(tableId,listData){
            var $tableWrap = com.focusPage('#' + tableId).empty();
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if(listData && listData.length){
                $.each(listData,function(i, v){
                    var $liLine = creatLine(v);

                    $liLine.appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function(v){

            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid');
            var $title = $('<small></small>').addClass('blue').html(' ' + v.no);
            var $btnDiv = $('<div></div>').addClass('action-buttons pull-right');
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');

            var $btnSub = $('<a></a>').addClass('btn btn-minier btn-yellow').html('子项');
            var $btnPrograss = $('<a></a>').addClass('btn btn-minier btn-success').html('生产进度');
            var $btnUpload = $('<a></a>').addClass('btn btn-minier btn-warning').html('上传');
            var $product = $('<a></a>').addClass('btn btn-minier btn-inverse').html('开始生产');
            var $btnStorehouse = $('<a></a>').addClass('btn btn-minier btn-danger').html('入库');
            var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-pink').html('编辑');
            var $btnDelivery = $('<a></a>').addClass('btn btn-minier btn-purple').html('送货');

            com.post(api.ds.production, {}, function (res) {
                productionPlan.status = res.productionPlanStatus.split("key", "value");
            });

            var propertyArr = [
                ["投料时间:", v.startTime, "green"],
                ["出货时间:", v.endTime, "green"],
                ["状态:", productionPlan.status[v.status], "red"],
                ["备注:",v.comment,"grey"]
            ];

            $.each(propertyArr, function (index,value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            if(productionPlan.PostData.status == 4 || productionPlan.PostData.status == 5){
                $btnDiv.append($btnSub).append($btnPrograss).append($btnUpload);
            }else{

                if(v.status == 0){//状态为初始
                    $btnDiv.append($btnSub).append($btnPrograss).append($btnUpload).append($product).append($btnEdit);
                }

                if(v.status == 3){//状态为生产中
                    $btnDiv.append($btnSub).append($btnPrograss).append($btnUpload).append($btnStorehouse);
                }

                if(v.status == 1){//状态为入库
                    $btnDiv.append($btnSub).append($btnPrograss).append($btnUpload).append($btnDelivery);
                }

                if(v.status == 2 ){//状态为送货
                    $btnDiv.append($btnSub).append($btnPrograss).append($btnUpload);
                }
            }

            $h3.append($title).append($btnDiv);
            $liLine.append($h3).append($ulProperty);

            $btnSub.click(function () {
                params["productionPlan.ppid"] = v.ppid;
                params["productionPlan.status"] = v.status;
                params["production"] = productionPlan.PostData.status;
                com.switchPage(api.index.productionPlanItemIndex.url);
            });

            $btnPrograss.click(function () {
                params["productionPlan.ppid"] = v.ppid;
                params["productionPlan.status"] = v.status;
                params["production.status"] = productionPlan.PostData.status;
                com.switchPage(api.index.productionPlanDetailIndex.url);

            });

            $btnUpload.click(function(){

                //删除createLine画出来的上一个元素防止叠加
                com.focusPage("#layerImport").find('.infobox').remove();

                if(v.path){
                    createLine(v.path, v.comment);
                }

                hidBtn(com.focusPage('#importProductionPlanExcel'), v.status);

                com.uploadify("#importProductionPlanExcel", "添加上传文件", 'btn btn-success blue ', "*.xlsx", {'uploadType': 2}, 1, function(data){

                    var option = {
                        "productionPlan.ppid": v.ppid,
                        "productionPlan.path": data.resUrl
                    };

                    com.post(api.production.updateProductionPlan,option,function(res){
                        com.showAlert(com.info, "操作成功");
                        searcher.doSearch();
                    });
                });

                productionPlan.modals.layerImport.modal("show");
            });

            $btnEdit.click(function () {
                productionPlan.editFlg = false;

                productionPlan.items.ppid = v.ppid;
                productionPlan.items.startTime.val(v.startTime.substring(0, 10));
                productionPlan.items.endTime.val(v.endTime.substring(0, 10));
                productionPlan.items.comment.val(v.comment);

                productionPlan.modals.productionPlanModal.modal("show");

            });

            $btnStorehouse.click(function () {

                com.post(api.production.updateProductionPlanForStatus,{
                    "productionPlan.ppid" : v.ppid,
                    "productionPlan.status" : 1
                },function () {
                    com.showAlert(com.info, "操作成功");
                    searcher.doSearch();
                });
            });

            $product.click(function () {

                if(productionPlan.PostData.status == 0 || productionPlan.PostData.status == 1){
                    com.showAlert(com.warning, "未审核无法进行生产");
                    return false;
                }
                //将生产单的状态更改为生产
                com.post(api.production.updateProductionPlanForStatus,{
                    "productionPlan.ppid" : v.ppid,
                    "productionPlan.status" : 3
                },function () {
                    searcher.doSearch();
                    if(productionPlan.PostData.status != 3 ){
                        com.post(api.production.updateProductionForStatus, {
                            "production.pid":productionPlan.PostData.pid,"production.status":3
                        }, function () {
                            productionPlan.PostData.status = 3;
                            com.showAlert(com.info, "操作成功");
                        },null,false);
                    }
                })
            });

            $btnDelivery.click(function () {

                com.post(api.production.updateProductionPlanForStatus,{
                    "productionPlan.ppid" : v.ppid,
                    "productionPlan.status" : 2
                },function () {
                    com.showAlert(com.info, "操作成功");
                    searcher.doSearch();
                })
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

    var searcher  = new Searcher();

    var _arr = ["p_startTime","p_endTime","p_productionPlanStatus"];

    searcher.init(_arr,'condList',api.production.pageProductionPlan,function (data) {
        displayFunc.init('resultList', data);
    },"pagenation","productionPlanPostData",{"production.pid" : productionPlan.PostData.pid},false,null,function () {
        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('id', 'addProductionPlan').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        var $back = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('id', 'back').css("margin", "0px 3px");
        var $backi = $('<i></i>').addClass('icon-mail-forward bigger-110').appendTo($back);
        var $backspan = $('<span></span>').text('返回').appendTo($back);

        return [$adda,$back];

    });

    com.focusPage("#confirmBtn").click(function(){
        productionPlan.modals.layerImport.modal("hide");
    });

    com.focusPage("#back").click(function () {
        com.switchPage(api.index.productionIndex.url);
    });

    com.focusPage("#addProductionPlan").click(function() {
        productionPlan.editFlg = true;
        productionPlan.modals.productionPlanModal.modal("show");
    });

    function saveData() {

        if (com.validate('productionPlanModal')) {
            return false;
        }

        if(productionPlan.items.startTime.val() > productionPlan.items.endTime.val()) {
            com.showAlert(com.warning, "请检查投料时间和出货时间");
            return false;
        }
        var url;
        var options = {
            "productionPlan.pid":  productionPlan.PostData.pid,
            "productionPlan.startTime" : productionPlan.items.startTime.val(),
            "productionPlan.endTime" : productionPlan.items.endTime.val(),
            "productionPlan.comment" : productionPlan.items.comment.val()
        }

        productionPlan.editFlg ? url = api.production.addProductionPlan :
                                 url = api.production.updateProductionPlan, options["productionPlan.ppid"] = productionPlan.items.ppid;

        com.post(url, options, function(){
            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
        });

        productionPlan.modals.productionPlanModal.modal("hide");
    }

    function createLine(path, comment){

        var $line = productionPlan.modals.layerImport.find(".infobox-container");

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

    function hidBtn(btnId,otherStatus){
        btnId.removeClass('hide');
        if(productionPlan.PostData.status == 5 || productionPlan.PostData.status == 4 || productionPlan.PostData.status == 3) {
            btnId.addClass('hide');
        }else if(otherStatus != 0 ){
            btnId.addClass('hide');
        }

    }

});