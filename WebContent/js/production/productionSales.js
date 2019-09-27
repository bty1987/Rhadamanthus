$(function(){

    var productionSales = {
        modals: {
            productionSalesModal: com.focusPage("#productionSalesModal")
        },

        items: {
            saleNo: com.focusPage("#saleNo"),
            brand: com.focusPage("#brand")
        },

        transferData: params["transferData"],

        productionSalesPostData: {}
    };

    //判断状态是否显示按钮
    if (productionSales.transferData.status == 5 || productionSales.transferData.status == 4 || productionSales.transferData.status == 3) {
        com.focusPage("#bindBtn").addClass('hide');
    }

    var displayFunc = (function(){

        var renderList = function(tableId,listData){
            var $tableWrap = com.focusPage('#' + tableId).empty();
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if(listData && listData.length){
                $.each(listData,function(i, v){
                    var propertyArr = {};

                    if(v.type == 1){

                        com.post(api.inventory.querySalesBySid,{"sales.sid":v.sid},function (res) {

                            var data = res.sales;
                            var sales = {
                                status: {},
                                balanceStatus: {}
                            };
                            com.post(api.ds.sales, {}, function (res){
                                sales.status = res.statues.split("key", "value");
                                sales.balanceStatus = res.balanceStatuses.split("key", "value");
                            });

                            propertyArr = [
                                ["客户名:", data.customer.name, "grey"],
                                ["品类:", data.category, "grey"],
                                ["品牌:", data.brand, "grey"],
                                ["创建时间:", data.createTime , "green"],
                                ["总价:", data.total, "blue"],
                                ["状态:", sales.status[data.status], "red"],
                                ["结算状态:", sales.balanceStatus[data.balanceStatuses], "red"],
                                ["备注:", data.comment, "grey"]
                            ];
                            creatLine(propertyArr,data,v,$ul);

                        },function () {
                            com.showAlert(com.warning, "未查询到此订单");
                            propertyArr = {};
                        });

                    }else {

                        com.post(api.material.queryMaterialByMid, {"material.mid": v.sid}, function (res) {

                            var data = res.material;
                            var material = {
                                status: {}
                            };
                            com.post(api.ds.material, {}, function(res){
                                material.status = res.status.split("key", "value");
                            });

                            propertyArr = [
                                ["客户名: ", data.customer.name, "grey"],
                                ["品类: ", data.category, "grey"],
                                ["品牌: ", data.brand, "grey"],
                                ["创建时间: ", data.createTime, "green"],
                                ["总价: ", data.total, "blue"],
                                ["状态:", material.status[data.status], "red"],
                                ["说明: ", data.comment, "grey"],
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
                com.focusPage('#' + tableId).html(null);
                renderList(tableId,listData);
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

    createPage();//进行分页

    //返回
    com.focusPage('#backBtn').click(function () {
        com.switchPage(api.index.productionIndex.url);
    });

    com.focusPage('#bindBtn').click(function () {//绑定按钮
        com.clearValidator();
        productionSales.modals.productionSalesModal.modal("show");
    });

    //绑定弹窗单号变化时动态查询相关信息
    com.focusPage("#saleNo").on("change",function(){

        var option = {};
        var _type = com.focusPage("select option:selected").attr("value");

        if(_type == 1){

            option["sales.no"] = com.focusPage("#saleNo").val();
            productionSales.productionSalesPostData["productionSales.type"] = _type;

            com.post(api.inventory.querySalesByNo,option,function (data) {
                if(productionSales.transferData.orderId != data.sales.orderId){
                    com.showAlert(com.warning, "此销售单与生产单非同一装修订单,无法绑定");
                    return false;
                }

                if(data.sales.fullpayStatus  == -1 || data.sales.fullpayStatus == 0){
                    com.showAlert(com.warning, "此销售订单未提交补款,无法绑定");
                    return false;
                }

                com.focusPage("#brand").val(data.sales.category+"-"+data.sales.brand);
                productionSales.productionSalesPostData["productionSales.sid"] = data.sales.sid;
                productionSales.productionSalesPostData["production.total"] = data.sales.total;

            }, function () {
                com.showAlert(com.warning, "未查询到此订单");
                com.focusPage("#brand").val(null);
            });

        }else{

            option["material.no"] = com.focusPage("#saleNo").val();
            productionSales.productionSalesPostData["productionSales.type"] = _type;

            com.post(api.material.queryMaterialByNo,option,function (data) {

                if(productionSales.transferData.orderId != data.material.orderId){
                    com.showAlert(com.warning, "此主材单与生产单非同一装修订单,无法绑定");
                    return false;
                }

                if(data.material.fullStatus == 0 || data.material.fullStatus == 1){
                    com.showAlert(com.warning, "此主材订单未提交补款,无法绑定");
                    return false;
                }

                com.focusPage("#brand").val(data.material.category+"-"+data.material.brand);

                productionSales.productionSalesPostData["productionSales.sid"] = data.material.mid;
                productionSales.productionSalesPostData["production.total"] = data.material.total;

            },function () {
                com.showAlert(com.warning, "未查询到此订单");
                com.focusPage("#brand").val(null);
            });
        }

    });

    com.focusPage("#saveBtn").click(function(){
        if(com.validate('productionSalesModal')){
            return false
        }
        productionSales.productionSalesPostData["productionSales.pid"] = productionSales.transferData.pid;
        com.post(api.production.bindProductionSales ,productionSales.productionSalesPostData ,function(){
            com.showAlert(com.info, "操作成功");
            createPage();
            productionSales.modals.productionSalesModal.modal("hide");
        });
    });

    productionSales.modals.productionSalesModal.on("hide.bs.modal", function(e){
        com.cleanItems(productionSales.items);
        com.closeTip();
    });
});