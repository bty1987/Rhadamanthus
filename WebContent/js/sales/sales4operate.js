$(function() {

    // 销售单高权限操作记录(只读): 数据源=sales.salesoperate, 由系统动作写入(废单/恢复/完结/反付款/归属/活动标记/删明细/明细结算改)
    // 按钮"记录"经 salesfunction(pageBtn.operate)配置显隐; 查询接口 querySalesOperateBySid 按 sales.sid 固定条件

    var salesOperateType = { 1: "废单", 2: "恢复", 3: "完结", 4: "反付款", 5: "归属变更", 6: "活动标记", 7: "删明细", 8: "明细结算改" };

    var sales = params.sales.sales;

    com.focusPage('#salesOperateInfo').html("销售单号: " + (sales.no || sales.sid) + "&nbsp;&nbsp;&nbsp;&nbsp;装修单号: " + (sales.orderId || "-"));

    com.post(api.sales.querySalesOperateBySid, {
        "sales.sid": sales.sid
    }, function(res) {

        var $wrap = com.focusPage('#salesOperateList').html('');

        var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

        if (!res.salesOperates || !res.salesOperates.length) {

            $('<li></li>').addClass('item-orange clearfix').append(
                $('<div></div>').html("暂无操作记录").css({ "text-align": "center", "color": "#999", "padding": "8px" })).appendTo($ul);
        }

        $.each(res.salesOperates, function(i, v) {

            var $li = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid');
            var $small = $('<small></small>').addClass('red').text(salesOperateType[v.type] || v.type);
            var $span = $('<span></span>').addClass('grey').css('margin-left', '10px').text(v.comment);

            $h3.append($small).append($span);

            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix').css('padding-left', '12px').appendTo($li);

            var props = [
                ["操作人:", v.operater ? (v.operater.currentName || v.operater.userName) : "", "grey"],
                ["操作时间:", v.operateTime, "green"]
            ];

            $.each(props, function(j, p) {

                var $liProp = $('<li></li>').appendTo($ulProperty);
                $('<strong></strong>').text(p[0]).appendTo($liProp);
                $('<b></b>').text(p[1] == null || p[1] == "" ? "-" : p[1]).addClass(p[2]).appendTo($liProp);
            });

            $li.prepend($h3);

            $ul.append($li);
        });

        $wrap.append($ul);
    });
});
