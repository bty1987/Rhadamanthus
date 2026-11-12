jQuery(function($) {

    api = parent.api;
    com = parent.com;
    utils = parent.utils;
    params = parent.params;

    // 变更记录查询条件: 定额单入口传参 qid, 只读时间线
    var query = params.quotation.normChangeRecord || {};

    var page = 1;
    var rows = 20;
    var totalPage = 1;

    var typeText = {
        1: "增减项制作",
        2: "增减项删除",
        3: "定材浮动额",
        4: "节点工费浮动",
        5: "下定材增删/重算",
        6: "定额单开关",
        7: "辅材绑定额",
        8: "报价项定额关联"
    };

    var changeTypeText = {
        1: "添加",
        2: "修改",
        3: "删除",
        4: "绑定",
        5: "解绑",
        6: "启用",
        7: "禁用"
    };

    var operaterNames = {};

    function buildOptions() {

        var options = {
            "paging.page": page,
            "paging.rows": rows
        };

        if (query.qid) options["normChangeRecord.qid"] = query.qid;

        return options;
    }

    function loadData() {

        com.post(api.quotation.pageNormChangeRecord, buildOptions(), function(res) {

            var records = res.paging.data || [];

            totalPage = res.paging.totalPage || 1;

            var $body = $("#normChangeRecordBody").html('');

            if (records.length == 0) {
                $body.append($('<tr></tr>').append($('<td></td>').attr('colspan', 7).addClass('text-center').text('暂无变更记录')));
            } else {

                $.each(records, function(i, record) {

                    var operater = operaterNames[record.operater] || record.operater || "---";

                    var $row = $('<tr></tr>');
                    $row.append($('<td class="record-time"></td>').text(record.operateTime || ''));
                    $row.append($('<td></td>').text(typeText[record.type] || record.type));
                    $row.append($('<td class="record-opertype"></td>').text(changeTypeText[record.changeType] || record.changeType));
                    $row.append($('<td></td>').text(record.refNo || (record.orderId || '---')));
                    $row.append($('<td></td>').text(record.beforeValue || '---'));
                    $row.append($('<td></td>').text(record.afterValue || '---'));
                    $row.append($('<td></td>').text(operater));

                    $body.append($row);
                });
            }

            $("#pageInfo").text("第 " + (totalPage == 0 ? 0 : page) + " / " + totalPage + " 页");

            $("#prevPageBtn").prop('disabled', page <= 1);
            $("#nextPageBtn").prop('disabled', page >= totalPage);
        });
    }

    $("#prevPageBtn").on("click", function() {
        if (page > 1) {
            page--;
            loadData();
        }
    });

    $("#nextPageBtn").on("click", function() {
        if (page < totalPage) {
            page++;
            loadData();
        }
    });

    loadData();
});
