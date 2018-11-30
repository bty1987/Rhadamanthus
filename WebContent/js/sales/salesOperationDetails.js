$(function () {

    /**
     * 回调函数必须提供 init(tableId, result.list)方法
     * tableId ,用来显示的div的id
     * result.list 列表的json数组
     * */
    var displayFunc = (function () {

        var renderList = function (tableId, listData) {

            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (listData && listData.length) {
                $.each(listData, function (i, v) {

                    var $liLine = $('<li></li>').addClass('item-orange clearfix');
                    var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                    var $h3 = $('<h3></h3>').addClass('oid');
                    var $small = $('<small></small>').addClass('blue').html(v.no);
                    var $btnDiv = $('<div></div>').addClass('pull-right action-buttons');

                    var $btnDetail = $('<a></a>').addClass(' btn btn-minier btn-yellow').html('详细');

                    var status = "";
                    var balanceStatus = "";

                    switch (v.status) {
                        case 0:
                            status = "初始";
                            break;
                        case 2:
                            status = "全退";
                            break;
                        case 3:
                            status = "倒单";
                            break;
                        case 4:
                            status = "废单";
                            break;
                        case 5:
                            status = "完结";
                            break;

                    }

                    switch (v.balanceStatus) {
                        case 0:
                            balanceStatus = "初始";
                            break;
                        case 1:
                            balanceStatus = "预结算";
                            break;
                        case 2:
                            balanceStatus = " 厂商结算";
                            break;
                        case 3:
                            balanceStatus = " 结算";
                            break;

                    }
                    var propertyArr = [
                        ["装修单号:", v.orderId, "blue"],
                        ["楼盘地址:", v.house.village.name + " " + v.house.houseNumber, "grey"],
                        ["客户名:", v.customer.name, "grey"],
                        ["渠道:", v.salesman.currentName, "grey"],
                        ["部门:", v.dept.name, "grey"],
                        ["分区:", v.region.name, "grey"],
                        ["导购:", v.guider.currentName, "grey"],
                        ["驻店:", v.instorer.currentName, "grey"],
                        ["主材部:", v.guideDept.name, "grey"],
                        ["品类:", v.category, "grey"],
                        ["品牌:", v.brand, "grey"],
                        ["创建时间:", v.createTime, "green"],
                        ["结算时间:", v.balanceTime, "green"],
                        ["补款时间:", v.fullpayTime, "green"],
                        ["状态:", status, "red"],
                        ["结算状态:", balanceStatus, "red"],
                        ["总额:", v.total, "blue"],
                        ["抹零:", v.maling, "blue"],
                        ["厂商抹零:", v.venderMaling, "blue"],
                        ["券值:", v.coupon, "blue"],
                        ["券信息:", v.couponInfo, "grey"],
                        ["备注:", v.comment, "grey"]
                    ];

                    $.each(propertyArr, function (index, value) {
                        var $liProperty = $('<li></li>');
                        $('<strong></strong>').html(value[0]).appendTo($liProperty);
                        $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                        $liProperty.appendTo($ulProperty);
                    });

                    if(v.fullpayStatus == 2){
                        $btnDiv.append($btnDetail);
                    }

                    $btnDiv.appendTo($h3);
                    $liLine.appendTo($ul);
                    $liLine.append($h3).append($ulProperty);
                    $small.appendTo($h3);

                    $btnDetail.click(function () {
                        openOperationLayer(v.sid);
                    });

                });

                $ul.appendTo($tableWrap);
            }
        };


        return {
            init: function (tableId, listData) {
                com.focusPage('#' + tableId).html(null);
                renderList(tableId, listData);
            }
        };


    })();

    /*分页*/
    var _condArr = ['sales_no', 'sales_orderId', 'sales_instorer', 'sales_salesman', 'sales_deptName'];

    var salesSearcher = new Searcher();

    salesSearcher.init(_condArr, "condList", api.inventory.pageSalesForAdvance, function (data) {

        displayFunc.init('resultList', data);

    }, "pagenation", "salesOperationDetailsPostData", null, false, null);


    function openOperationLayer(sid) {
        var $popup = com.focusPage('#viewPopUp');
        $popup.attr({'data-sid': sid});
        //弹出即全屏
        layer.open({
            type: 1,
            skin: 'layui-layer-lan',
            title: "销售运转详情",
            content: $popup,
            area: ["1400px", ( $(window).height() * 0.84 < 1000 ? $(window).height() * 0.84 : 1000 ) + "px"],
            //maxmin: true,
            zIndex: 9000,
            btn: ['确定'],
            success: function (layer, index) {
                $popup.load("views/sales/salesOperationDetailsLayer.html");
            },
            end: function () {
                $popup.attr('data-sid', null);
            }
        });
    }
});
