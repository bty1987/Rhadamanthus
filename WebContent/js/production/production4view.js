$(function() {

    var productionView = {

        pid: params["pid"],
        outsourceStatus: {},
        hardwareStatus: {},
        productionPlanStatus: {}
    }

    com.post(api.ds.production, {}, function (res) {
        productionView.outsourceStatus = res.outsourceStatus.split("key", "value");
        productionView.hardwareStatus = res.hardwareStatus.split("key", "value");
        productionView.productionPlanStatus = res.productionPlanStatus.split("key", "value");
    }, null, false);

    var displayFunc = (function () {

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
            var $h3 = $('<h3></h3>').addClass('oid');
            var $title = $('<small></small>').addClass('blue').html(v.no);
            var $btnDiv = $('<div></div>').addClass('action-buttons pull-right');
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');

            var remainDate = dateDiffer(v.createTime, v.timeLimit);//计算剩余工期
            var remainDay = 0;  //显示剩余工期

            if (v.status == 3 || v.status == 4) {
                remainDay = "订单已结束";
            } else if (remainDate < 0) {
                remainDay = "已超过期限" + Math.abs(remainDate) + "天";
            } else {
                remainDay = "剩余工期" + Math.abs(remainDate) + "天"
            }

            var propertyArr = [
                ["生产单号:", v.production.pno, "blue"],
                ["装修单号:", v.production.orderId, "blue"],
                ["楼盘地址:", v.production.house.village.name + " " + v.production.house.houseNumber, "grey"],
                ["创建人:", v.creater.userName, "grey"],
                ["厂商:", v.supplier.userName, "grey"],
                ["类型:", "外协", "red"],
                ["创建时间:", v.createTime, "green"],
                ["结束时间:", v.finishTime, "green"],
                ["状态:", productionView.outsourceStatus[v.status], "red"],
                ["工期:", v.timeLimit, "green"],
                ["订单剩余时间:", remainDay, (remainDate < 5 ? "red" : "green")],
                ["说明:", v.comment, "grey"]
            ];

            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $liLine.append($h3).append($ulProperty);

            $h3.append($title).append($btnDiv);

            return $liLine;
        };

        return {
            init: function (tableId, listData) {
                if (!listData.length) {
                    nullDataView();
                } else {
                    com.focusPage('#' + tableId).html(null);
                    renderList(tableId, listData);
                }
            },
            drawLine: function (v) {
                return creatLine(v);
            }
        };
    })();

    var displayFunc1 = (function () {

        var renderList1 = function (tableId, listData) {
            var $tableWrap = com.focusPage('#' + tableId).empty();
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (listData && listData.length) {
                $.each(listData, function (i, v) {
                    var $liLine = creatLine1(v);

                    $liLine.appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };

        var creatLine1 = function (v) {
            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid')
            var $title = $('<small></small>').addClass('blue').html(' ' + v.no);
            var $btnDiv = $('<div></div>').addClass('action-buttons pull-right');
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');

            var remainDate = dateDiffer(v.createTime, v.timeLimit);//计算剩余工期
            var remainDay = 0;  //显示剩余工期

            if (v.status == 3 || v.status == 4) {
                remainDay = "订单已结束";
            } else if (remainDate < 0) {
                remainDay = "已超过期限" + Math.abs(remainDate) + "天";
            } else {
                remainDay = "剩余工期" + Math.abs(remainDate) + "天"
            }

            var propertyArr = [
                ["生产单号:", v.production.pno, "blue"],
                ["装修单号:", v.production.orderId, "blue"],
                ["楼盘地址:", v.production.house.village.name + " " + v.production.house.houseNumber, "grey"],
                ["创建人:", v.creater.userName, "grey"],
                ["类型:", "五金", "red"],
                ["创建时间:", v.createTime, "green"],
                ["结束时间:", v.finishTime, "green"],
                ["状态:", productionView.hardwareStatus[v.status], "red"],
                ["工期:", v.timeLimit, "green"],
                ["剩余时间:", remainDay, (remainDate < 5 ? "red" : "green")],
                ["说明:", v.comment, "grey"]
            ];

            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $liLine.append($h3).append($ulProperty);
            $h3.append($title).append($btnDiv);

            return $liLine;

        };

        return {
            init: function (tableId, listData) {
                if (!listData.length) {
                    nullDataView();
                } else {
                    com.focusPage('#' + tableId).html(null);
                    renderList1(tableId, listData);
                }
            },
            drawLine: function (v) {
                return creatLine1(v);
            }
        };
    })();

    var displayFunc2 = (function () {
        var renderList2 = function (tableId, listData) {

            var $tableWrap = com.focusPage('#' + tableId).empty();
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (listData && listData.length) {
                $.each(listData, function (i, v) {
                    var $liLine = creatLine2(v);

                    $liLine.appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };

        var creatLine2 = function (v) {

            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid');
            var $title = $('<small></small>').addClass('blue').html(' ' + v.no);
            var $btnDiv = $('<div></div>').addClass('action-buttons pull-right');
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');

            var remainDate = dateDiffer(v.createTime, v.timeLimit);//计算剩余工期
            var remainDay = 0;  //显示剩余工期

            if (v.status == 1) {
                remainDay = "订单已结束";
            } else if (remainDate < 0) {
                remainDay = "已超过期限" + Math.abs(remainDate) + "天";
            } else {
                remainDay = "剩余工期" + Math.abs(remainDate) + "天"
            }

            var propertyArr = [
                ["生产单号:", v.production.pno, "blue"],
                ["装修单号:", v.production.orderId, "blue"],
                ["楼盘地址:", v.production.house.village.name + " " + v.production.house.houseNumber, "grey"],
                ["创建人:", v.creater.userName, "grey"],
                ["类型:", "计划", "red"],
                ["创建时间:", v.createTime, "green"],
                ["完结时间:", v.finishTime == null ? "订单未完结" : v.finishTime, "green"],
                ["状态:", v.status == 1 ? "完结" : "初始", "red"],
                ["工期:", v.timeLimit, "green"],
                ["剩余时间:", remainDay, (remainDate < 5 ? "red" : "green")],
            ];

            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $h3.append($title).append($btnDiv);
            $liLine.append($h3).append($ulProperty);

            return $liLine;
        };

        return {
            init: function (tableId, listData) {
                if (!listData.length) {
                    nullDataView();
                } else {
                    com.focusPage('#' + tableId).html(null);
                    renderList2(tableId, listData);
                }
            },
            drawLine: function (v) {
                return creatLine2(v);
            }
        };
    })();


    function dateDiffer(createTime, timeLimit) {
        var currentDate, createDate, createDateList, unit, workingDate, remainDate;
        unit = utils.accMul(24, utils.accMul(3600, 1000));//转换单位
        currentDate = new Date();
        createDateList = createTime.split("-");
        createDate = new Date(createDateList[1] + "-" + createDateList[2] + "-" + createDateList[0]);

        workingDate = parseInt(utils.accDiv(utils.accSub(currentDate, createDate), unit));
        remainDate = utils.accSub(timeLimit, workingDate);

        return remainDate;
    }

    var num = 0;

    function productionDateView(){
        com.post(api.production.queryOutsourceByPid, {"outsource.production.pid": productionView.pid}, function (res) {
            displayFunc.init("outsourceViewResultList", res.outsources);
        });

        com.post(api.production.queryHardwareByPid, {"hardware.production.pid": productionView.pid}, function (data) {
            displayFunc1.init("hardwareViewResultList", data.hardwares);
        }, null, false);


        com.post(api.production.queryProductionPlanByPid, {"productionPlan.production.pid": productionView.pid}, function (data) {
            displayFunc2.init('productionPlansViewResultList', data.productionPlans);
        }, null, false);

    }

    productionDateView();

    function nullDataView() {
        num++;

        if (num == 3) {
            var $resultList = com.focusPage('#' + 'outsourceViewResultList').addClass('dz-default dz-message').html('');
            var $zone = $('<div></div>').addClass('dropzone dz-clickable').css('margin', '20px').css('border', '0px').appendTo($resultList);
            var $mesg = $('<div></div>').addClass('dz-default dz-message').appendTo($zone);
            var $span = $('<span></span>').text('无可用数据提供').appendTo($mesg);
            return $resultList;
        }
    }

});