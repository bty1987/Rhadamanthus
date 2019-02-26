$(function () {

    var displayFunc = (function () {
        var renderList = function (tableId, listData) {
            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $("<ul></ul>").addClass('item-list fl-table-list ui-sortable');
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
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.name));
            var $ulProperty = $("<ul></ul>").addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnclaim = $("<a></a>").addClass("btn btn-minier btn-yellow").html("认领");
            var propertyArr = [
                ["客户电话: ", v.phone, 'grey'],
                ["性别: ", v.gender, "grey"],
                ["目的: ", v.purpose, "grey"],
                ["意向: ", v.intention, "grey"],
                ["需求价格: ", v.price, 'blue'],
                ["客户等级: ", v.grade, "grey"],
                ["创建人: ", v.creater.currentName, "grey"],
                ["创建时间: ", v.createTime, "green"],
                ["归属设计师: ", com.checkNull(v.designer.currentName,'无'), "grey"],
                ["楼盘名: ",com.checkNull(v.village.currentName,'无'), "grey"],
                ["楼牌号: ", v.houseNumber, "blue"],
                ["建筑面积: ", v.buildArea, "blue"],
                ["备注: ", com.checkNull(v.comment, '无'), "grey"]
            ];
            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2] ? value[2] : "").appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $divBtnWrap.append($btnclaim).appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            $btnclaim.click(function () {
                btnclaim(v);

            });

            return $liLine;
        };
        return {
            init: function (tableId, listData) {
                com.focusPage('#' + tableId).html(null);
                renderList(tableId, listData);
            },
            drawLine: function (v) {
                return creatLine(v);
            }
        };
    })();

    var searcher = new Searcher();
    searcher.init(["customerSourcePhone"], "condList", api.customer.pageCustomerOriginForCommunion, function (data) {
        displayFunc.init("resultList", data);
    }, "pagenation", "customercommunionPostDat", null, false, null, null);

    function btnclaim(v) {
        var btn = $(this);
        var span = btn.find("span");
        btn.find('i').remove();
        var loading = $('<i></i>').addClass('icon-spinner icon-spin white bigger-125');
        span.prepend(loading);
        var message = "<p>确定要领取该客源吗?</p>";
        bootbox.confirm(message, function (result) {
            if (result) {
                var options = {
                    "customerOrigin.csid": v.csid
                };
                com.post(api.customer.takeCustomerOrigin, options, function (res) {
                    searcher.doSearch();
                    com.showAlert(com.info, '领取成功');
                });
            } else {
                btn.find('i').remove();
                var prepared = $('<i></i>').addClass('icon-ok bigger-110');
                span.prepend(prepared);
            }
        });
    }
});
