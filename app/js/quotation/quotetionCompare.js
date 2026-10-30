/** app/js/quotation/quotetionCompare.js —— 预报对比
 *  左侧预报：queryQuotetionByNo → queryQuotetionFunctionAreaByQid；
 *  右侧报价：queryQuotationById → queryQuotationFunctionAreaByQuotationId；
 *  按项名（quotationItemId）对齐，输出 差异列（数量差/单价差/金额差）。 */
app.ready(function () {
layui.use(['table', 'jquery'], function () {
    var table = layui.table, $ = layui.jquery;
    quotationCommon.ensureApiStubs();
    var qc = quotationCommon;
    var u = app.utils;

    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 50 },
            { field: 'areaName', title: '功能区', width: 110, fixed: 'left' },
            { field: 'itemName', title: '项目名', width: 160 },
            { field: 'qNum', title: '预报数量', width: 90, templet: function (d) { return qc.money(d.qNum); } },
            { field: 'qUnitPrice', title: '预报单价', width: 90, templet: function (d) { return qc.money(d.qUnitPrice); } },
            { field: 'qTotal', title: '预报金额', width: 100, templet: function (d) { return qc.money(d.qTotal); } },
            { field: 'tNum', title: '报价数量', width: 90, templet: function (d) { return qc.money(d.tNum); } },
            { field: 'tUnitPrice', title: '报价单价', width: 90, templet: function (d) { return qc.money(d.tUnitPrice); } },
            { field: 'tTotal', title: '报价金额', width: 100, templet: function (d) { return qc.money(d.tTotal); } },
            { field: 'numDiff', title: '数量差', width: 90, templet: function (d) { return qc.money(u.accSub(d.qNum, d.tNum)); } },
            { field: 'totalDiff', title: '金额差', width: 100, templet: function (d) { return qc.money(u.accSub(d.qTotal, d.tTotal)); } } ]] });

    function flatItems(areas, isQuotetion) {
        var list = [];
        $.each(areas || [], function (i, area) {
            var items = isQuotetion ? area.quotetionFunctionAreaItems : area.quotationFunctionAreaItems;
            $.each(items || [], function (j, it) {
                list.push({
                    key: (it.quotationItemId != null ? it.quotationItemId : it.quoteItemId) + '-' + it.itemName,
                    areaName: isQuotetion ? area.functionAreaName : (area.functionAreaName || ''),
                    itemName: it.itemName,
                    num: it.num, unitPrice: it.unitPrice,
                    total: u.accMul(it.unitPrice, it.num)
                });
            });
        });
        return list;
    }

    $('#btnCompare').on('click', function () {
        var no = $.trim($('#quotetionNo').val());
        var qid = $.trim($('#quotationNo').val());
        if (no === '' || qid === '') { app.showAlert(app.warning, '请填写预报编号与报价编号'); return; }
        var left = [], right = [];
        app.post(api.quotation.queryQuotetionByNo, { 'quotetion.no': no }, function (res) {
            if (!res.quotetion || !res.quotetion.qid) { app.showAlert(app.warning, '预报不存在'); return; }
            app.post(api.quotation.queryQuotetionFunctionAreaByQid, { 'quotetion.qid': res.quotetion.qid }, function (r) {
                left = flatItems(r.quotetionFunctionAreas, true);
                after();
            }, null, false);
        }, null, false);
        app.post(api.quotation.queryQuotationById, { 'quotation.qid': qid }, function (res) {
            if (!res.quotation || !res.quotation.qid) { app.showAlert(app.warning, '报价不存在'); return; }
            app.post(api.quotation.queryQuotationFunctionAreaByQuotationId, { 'quotation.qid': res.quotation.qid }, function (r) {
                right = flatItems(r.quotationFunctionAreas, false);
                after();
            }, null, false);
        }, null, false);

        var count = 0;
        function after() {
            count++;
            if (count < 2) return;
            var map = {};
            $.each(left, function (i, v) { map[v.key] = $.extend({ qNum: v.num, qUnitPrice: v.unitPrice, qTotal: v.total, tNum: 0, tUnitPrice: 0, tTotal: 0 }, v); });
            $.each(right, function (i, v) {
                if (map[v.key]) {
                    map[v.key].tNum = v.num; map[v.key].tUnitPrice = v.unitPrice; map[v.key].tTotal = v.total;
                } else {
                    map[v.key] = { areaName: v.areaName, itemName: v.itemName, qNum: 0, qUnitPrice: 0, qTotal: 0, tNum: v.num, tUnitPrice: v.unitPrice, tTotal: v.total };
                }
            });
            var rows = [];
            $.each(map, function (k, v) { rows.push(v); });
            table.reload('resultTable', { data: rows });
        }
    });

    $('#btnBack').on('click', function () { app.switchPage(app.params.historyPage || api.index.quotetionIndex.url); });
});
}); // end app.ready
