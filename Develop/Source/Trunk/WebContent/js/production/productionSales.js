$(function(){

    var $layerBind = $('#layerBind');
    var $status = params["status"];
    var $orderId = params["orderId"];
    var productionSalesPid = params["pid"];
    var productionSalesPostData={};

    if ($status == 5 || $status == 4 || $status == 3) {
        $("#bindBtn").addClass('hide');
    }

    var initList = function(tableId,listData) {
        var $tableWrap = $('#' + tableId);
        var $ul = $('<ul></ul>').addClass('item-list ui-sortable fl-table-list');

        if (listData && listData.length) {

            $.each(listData, function (i, v) {

                var propertyArr = {};

                if(v.type == 1){

                    com.post(api.inventory.querySalesBySid,{"sales.sid":v.sid},function (res) {
                        var data = res.sales;
                        var status = "";
                        var balanceStatus = "";

                        switch (data.status){
                            case 0: status = "初始"; break;
                            case 2: status = "全退"; break;
                            case 3: status = "倒单"; break;
                            case 4: status = "废单"; break;
                            case 5: status = "完结"; break;
                        }

                        switch (data.balanceStatus){
                            case 0: balanceStatus = "初始"; break;
                            case 1: balanceStatus = "预结算"; break;
                            case 2: balanceStatus = " 厂商结算"; break;
                            case 3: balanceStatus = " 结算"; break;
                        }

                        propertyArr = [
                           // ["订单编号:", data.orderId, "grey"],
                           // ["楼盘地址:", data.village.villageName + " " + data.houseNumber, "grey"],
                            ["客户名:", data.customer.customerName, "grey"],
                           // ["渠道:", data.salesman.userName, "grey"],
                           // ["部门:", data.dept.deptName, "grey"],
                           // ["分区:", data.region.deptName, "grey"],
                           // ["导购:", data.guider.userName, "grey"],
                           // ["驻店:", data.instorer.currentName, "grey"],
                           // ["主材部:", data.guideDept.deptName, "grey"],
                            ["品类:", data.category, "grey"],
                            ["品牌:", data.brand, "grey"],
                            ["创建时间:", data.createTime , "grey"],
                            //["结算时间:", data.balanceTime, "grey"],
                            //["全款时间:", data.fullpayTime, "grey"],
                            //["状态:", status, "grey"],
                            //["结算状态:", balanceStatus, "grey"],
                            ["总价:", data.total, "grey"],
                            //["抹零:", data.maling , "grey"],
                            //["厂商抹零:", data.venderMaling, "grey"],
                            //["券值:", data.coupon, "grey"],
                            //["券信息:", data.couponInfo, "grey"],
                            ["备注:", data.comment, "grey"]
                        ];
                        creatureRow(propertyArr,v,$ul,data);
                    },function (e) {
                       layer.msg("未查询到此订单！",{icon: 2,time:2e3});
                        propertyArr = {};
                    });

                }else{

                    com.post(api.material.queryMaterialSubOrderByMsoId,{"materialSubOrder.msoId":v.sid},function (res) {

                        var data = res.materialSubOrder;
                        var msoType = "";
                        var status = "";

                        switch (data.status){
                            case 0: msoType = "初始"; break;
                            case 2: msoType = "删除"; break;
                            case 3: msoType = "退货"; break;
                            case 4: msoType = "预结算"; break;
                            case 5: msoType = "结算"; break;
                            case 6: msoType = "全退"; break;
                            case 7: msoType = "倒单"; break;
                            case 8: msoType = "废单"; break;
                            case 9: msoType = "完结"; break;
                        }

                        switch (data.msoType){
                            case 0: msoType = "普通"; break;
                            case 1: msoType = "员工自购"; break;
                            case 2: msoType = " 老总关系"; break;
                            case 3: msoType = " 赠送"; break;
                            case 4: msoType = " 场内销售场外"; break;
                        }

                        propertyArr = [
                            ["客户名:", data.customerName, "grey"],
                            ["品类:", data.materialType, "grey"],
                            ["品牌:", data.materialBrand, "grey"],
                            ["创建时间:", data.createTime, "grey"],
                            //["类型:", data.createTime, "grey"],
                            ["总价:", data.total, "grey"],
                            //["折扣总价：",data.distotal,"grey"],
                            //["定金:", data.depositPayment, "grey"],
                            //["补款:", data.fullPayment, "grey"],
                            //["抹零:", data.maling, "grey"],
                            //["厂商抹零:", data.venderMaling, "grey"],
                            //["券额:", data.coupon, "grey"],
                            //["券信息:", data.couponInfo, "grey"],
                            //["状态:", status, "grey"],
                            ["备注:", data.des, "grey"],
                        ];
                        creatureRow(propertyArr,v,$ul,data);

                    },function (e) {
                       layer.msg("未查询到此订单！",{icon: 2,time:2e3});
                        propertyArr = {};
                    });
                }

            });

            $ul.appendTo($tableWrap);
        }
    };


    //写入每条绑定信息
    function creatureRow(propertyArr,v,$ul,data){

        var $liLine = $('<li></li>').addClass('clearfix item-blue');
        var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
        if(v.type == 1){
            var $h3 = $('<h3></h3>').css({color:"grey","font-weight":"bold"}).html('销售单  ' + data.no);
        }else{
            var $h3 = $('<h3></h3>').css({color:"grey","font-weight":"bold"}).html('主材单  ' + data.msoNo);
        }
        var $btnDiv = $('<div></div>').addClass('action-buttons pull-right');

        $.each(propertyArr, function (index, value) {

            var $liProperty = $('<li></li>');
            $('<strong></strong>').html(value[0]).appendTo($liProperty);
            $('<b></b>').html(value[1]).css({color:value[2]}).appendTo($liProperty);
            $liProperty.appendTo($ulProperty);
        });

        $liLine.appendTo($ul);
        $liLine.append($h3).append($ulProperty);

        $btnDiv.appendTo($h3);

        return  $ul;
    }

    createPage();

    function createPage(){

        com.post(api.production.queryProductionSalesByPid,{"productionSales.pid":productionSalesPid},function(data){

            initList('resultList',data.productionSaless);

        },function(e){

            layer.msg("未查到此生产单下的生产销售单",{icon: 2,time:2e3});

        });
    }



    //返回
    $('#backBtn').click(function () {
        com.switchPage(api.index.productionIndex.url);
    });
    //绑定
    $('#bindBtn').click(function () {
        com.clearValidator();
        productionUtils.clearForm('form1');
        productionSalesPostData = {};
        openBindlayer(function (index, layero) {
            bindSales(function () {
                layer.closeAll();
            });
        });
    });

    //绑定弹窗单号变化时动态查询相关信息
    $layerBind.find('input[name="saleNo"]').on("change",function(){

        var option = {};
        var _type = $("select option:selected").attr("value");

        if(_type == 1){

            option["sales.no"] = $layerBind.find('input[name="saleNo"]').val();
            productionSalesPostData["productionSales.type"] = _type;

            com.post(api.inventory.querySalesByNo,option,function (data) {

                if($orderId != data.sales.orderId){
                   layer.msg("此销售单与生产单非同一装修订单,无法绑定",{icon: 2,time:2e3});
                    return false;
                }

                if(data.sales.fullpayStatus  == -1 || data.sales.fullpayStatus == 0){
                   layer.msg("此销售订单未提交补款,无法绑定",{icon: 2,time:2e3});
                    return false;
                }

                $layerBind.find("input[name='brand']").val(data.sales.category+"-"+data.sales.brand);
                productionSalesPostData["productionSales.sid"] = data.sales.sid;
                productionSalesPostData["production.total"] = data.sales.total;

            },function (e) {
               layer.msg("未查询到此订单！",{icon: 2,time:2e3});
                $layerBind.find("input[name='brand']").val(null);
            });

        }else{

            option["materialSubOrder.msoNo"] = $layerBind.find('input[name="saleNo"]').val();
            productionSalesPostData["productionSales.type"] = _type;

            com.post(api.material.queryMaterialSubOrderByMsoNo,option,function (data) {

                if($orderId != data.materialSubOrder.orderId){
                   layer.msg("此主材单与生产单非同一装修订单,无法绑定",{icon: 2,time:2e3});
                    return false;
                }
                
                if(data.materialSubOrder.fullStatus == 0 || data.materialSubOrder.fullStatus == 1){
                   layer.msg("此主材订单未提交补款,无法绑定",{icon: 2,time:2e3});
                    return false;
                }

                $layerBind.find("input[name='brand']").val(data.materialSubOrder.materialType+"-"+data.materialSubOrder.materialBrand);

                productionSalesPostData["productionSales.sid"] = data.materialSubOrder.msoId;
                productionSalesPostData["production.total"] = data.materialSubOrder.total;

            },function (e) {
               layer.msg("未查询到此订单！",{icon: 2,time:2e3});
               $layerBind.find("input[name='brand']").val(null);
            });
        }

    });

    //绑定弹窗
    function openBindlayer(callback){
        layer.closeAll();
        layer.open({
            type: 1,
            //skin: 'layui-layer-lan',
            title:"绑定" ,
            content:$('#layerBind'),
            area: ( $(window).width()*0.6 < 620 ?  $(window).height()*0.6 : 620 )+"px",
            maxmin: false,
            zIndex:9999,
            btn: ['确定', '取消'],
            yes: function(index, layero){
                callback(index,layero);

            },
            btn2: function(index, layero){
                //按钮【按钮二】的回调

            },
            cancel: function(){
                //右上角关闭回调

            }
        });
    }

    //绑定调用方法
    function bindSales(callback){
        if(!com.validate("layerBind",null)){
            productionSalesPostData["productionSales.pid"] = productionSalesPid;

            com.post(api.production.bindProductionSales,productionSalesPostData,function(data){
                callback();
                layer.msg('绑定成功', {icon: 1, time: 2e3});
                $("#resultList ul.ui-sortable").remove();
                createPage();
            },function(e){
                callback();
                layer.msg('绑定失败', {icon: 2, time: 2e3});
            });
        }
    }

});






