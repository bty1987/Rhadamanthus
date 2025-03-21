$(function(){

    var productionSales = {
        modals: {
            productionSalesModal: com.focusPage("#productionSalesModal")
        },

        items: {
            saleNo: com.focusPage("#saleNo"),
            brand: com.focusPage("#brand"),
            salesType: com.focusPage("#salesType")
        },

        transferData: params["transferData"],

        productionPostData: {},

        sales: {
            status: {},
            balanceStatus: {}
        },
        material: {
            status: {}
        },
    };

    if (productionSales.transferData.status != 0) {
        com.focusPage("#bindBtn").addClass('hide');
    }

    com.post(api.ds.production, {}, function(res){
        productionSales.items.salesType.bindData(res.salesType, "key", "value", false);
    });

    com.post(api.ds.material, {}, function(res){
        productionSales.material.status = res.status.split("key", "value");
    },null ,false);

    productionSales.modals.productionSalesModal.on("hide.bs.modal", function(e){
        com.cleanItems(productionSales.items);
        com.closeTip();
    });

    var displayFunc = (function(){

        var renderList = function(tableId,listData){
            var $tableWrap = com.focusPage('#' + tableId).empty();
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if(listData && listData.length){
                $.each(listData,function(i, v){
                    var propertyArr = {};

                    if(v.type == 1){

                        com.post(api.sales.querySalesBySid,{"sales.sid":v.sid},function (res) {
                            var data = res.sales;
                            propertyArr = [
                                ["客户名:", data.customer.name, "grey"],
                                ["品类:", data.category, "grey"],
                                ["品牌:", data.brand, "grey"],
                                ["创建时间:", data.createTime , "green"],
                                ["总价:", data.total, "blue"],
                                ["状态:", constant.sales().sales.status.keys[data.status], "red"],
                                ["结算状态:", constant.sales().sales.balanceStatus.keys[data.balanceStatus], "red"]
                            ];
                            creatLine(propertyArr,data,v,$ul);

                        },function () {
                            com.showAlert(com.warning, "未查询到此订单");
                            propertyArr = {};
                        });

                    }else {

                        com.post(api.material.queryMaterialByMid, {"material.mid": v.sid}, function (res) {
                            var data = res.material;

                            propertyArr = [
                                ["客户名: ", data.customer.name, "grey"],
                                ["品类: ", data.category, "grey"],
                                ["品牌: ", data.brand, "grey"],
                                ["创建时间: ", data.createTime, "green"],
                                ["总价: ", data.total, "blue"],
                                ["状态:", productionSales.material.status[data.status], "red"]
                            ];
                            creatLine(propertyArr,data,v,$ul);

                        }, function () {
                            com.showAlert(com.warning, "未查询到此订单");
                            propertyArr = {};
                        });
                    }
                });

                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function(propertyArr,data,v,$ul) {

            var $liLine = $('<li></li>').addClass('clearfix item-orange');
            var $h3 = $('<h3></h3>').addClass('oid');
            var $title = $('<small></small>').addClass('blue').html(v.type == 1 ? '销售单  ' + data.no : '主材单  ' + data.no);
            var $btnDiv = $('<div></div>').addClass('action-buttons pull-right');
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');

            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $liLine.appendTo($ul);
            $liLine.append($h3).append($ulProperty);
            $h3.append($title).append($btnDiv);

            return  $ul;
        };

        return {
            init : function(tableId,listData){
                if(!listData.length){
                    var $resultList = com.focusPage('#' + tableId).addClass('dz-default dz-message').html('');
                    var $zone = $('<div></div>').addClass('dropzone dz-clickable').css('margin', '20px').css('border', '0px').appendTo($resultList);
                    var $mesg = $('<div></div>').addClass('dz-default dz-message').appendTo($zone);
                    var $span = $('<span></span>').text('无可用数据提供').appendTo($mesg);
                    return $resultList;
                }else {
                    com.focusPage('#' + tableId).html(null);
                    renderList(tableId, listData);
                }
            },
            drawLine : function(v){
                return creatLine(v);
            }
        };
    })();

    function createPage(){
        com.post(api.production.queryProductionSalesByPid,{"productionSales.pid": productionSales.transferData.pid},function(data){
            displayFunc.init('resultList',data.productionSaless);
        },function(){
            com.showAlert(com.warning, "未查到此生产单下的生产销售单");
        });
    }

    createPage();

    com.focusPage('#backBtn').click(function () {
        com.switchPage(api.index.productionIndex.url);
    });

    com.focusPage('#bindBtn').click(function () {
        com.clearValidator();
        productionSales.modals.productionSalesModal.modal("show");
    });

    //绑定弹窗单号变化时动态查询相关信息
    productionSales.items.saleNo.on("change",function(){

        var option = {};
        var _type = productionSales.items.salesType.val();

        if(_type == 1){

            option["sales.no"] = productionSales.items.saleNo.val();

            productionSales.productionPostData["productionSales.type"] = _type;

            com.post(api.sales.querySalesByNo,option,function (data) {

                if(productionSales.transferData.orderId != data.sales.orderId){
                    com.showAlert(com.warning, "此销售单与生产单非同一装修订单,无法绑定");
                    return false;
                }

                if(data.sales.fullpayStatus  == -1 || data.sales.fullpayStatus == 0){
                    com.showAlert(com.warning, "此销售订单未提交补款,无法绑定");
                    return false;
                }

                productionSales.items.brand.val(data.sales.category+"-"+data.sales.brand.name);
                productionSales.productionPostData["productionSales.sid"] = data.sales.sid;
                productionSales.productionPostData["productionSales.total"] = data.sales.total;

            }, function () {
                com.showAlert(com.warning, "未查询到此订单");
                productionSales.items.brand.val(null);
            });

        }else{

            option["material.no"] = productionSales.items.saleNo.val();
            productionSales.productionPostData["productionSales.type"] = _type;

            com.post(api.material.queryMaterialByNo,option,function (data) {

                if(productionSales.transferData.orderId != data.material.orderId){
                    com.showAlert(com.warning, "此主材单与生产单非同一装修订单,无法绑定");
                    return false;
                }

                if(data.material.fullStatus == 0 || data.material.fullStatus == 1){
                    com.showAlert(com.warning, "此主材订单未提交补款,无法绑定");
                    return false;
                }

                productionSales.items.brand.val(data.material.category+"-"+data.material.brand);

                productionSales.productionPostData["productionSales.sid"] = data.material.mid;
                productionSales.productionPostData["productionSales.total"] = data.material.total;

            },function () {
                com.showAlert(com.warning, "未查询到此订单");
                productionSales.items.brand.val(null);
            });
        }

    });

    com.focusPage("#saveBtn").click(function(){
        if(com.validate('productionSalesModal')){
            return false
        }
        productionSales.productionPostData["productionSales.pid"] = productionSales.transferData.pid;
        com.post(api.production.bindProductionSales ,productionSales.productionPostData ,function(){
            com.showAlert(com.info, "操作成功");
            createPage();
            productionSales.modals.productionSalesModal.modal("hide");
        });
    });

});