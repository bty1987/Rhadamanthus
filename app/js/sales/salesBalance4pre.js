/** app/js/sales/salesBalance4pre.js —— 销售单预结
 * type: predompany|prepompany|其他，决定接口 pageSalesForBalanceByDompany / pageSalesForBalanceByPompany / pageSalesForBalance */
app.ready(function () {
layui.use(['table', 'laypage', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, layer = layui.layer, $ = layui.jquery;
    var pageType = (app.params.urlLoadParams && app.params.urlLoadParams.type) || '';
    var state = { page: 1, rows: 10, total: 0, editIndex: null, curData: null };
    var listApi = api.sales.pageSalesForBalance;
    if (pageType == 'predompany') listApi = api.sales.pageSalesForBalanceByDompany;
    else if (pageType == 'prepompany') listApi = api.sales.pageSalesForBalanceByPompany;
    var STATUS = { 0: '初始', 1: '已推送', 2: '已确认', 3: '已完成', 4: '已完结' };
    initTable(); query(1);

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 },
                { field: 'no', title: '销售单号', width: 140 },
                { field: 'orderId', title: '装修单号', width: 140 },
                { field: 'address', title: '楼盘地址', width: 200, templet: function (d) { return (d.house && d.house.village ? d.house.village.name : '') + ' ' + (d.house ? d.house.houseNumber : ''); } },
                { field: 'customer', title: '客户', width: 110, templet: function (d) { return (d.customer && d.customer.name) || '-'; } },
                { field: 'brand', title: '品牌', width: 140, templet: function (d) { return (d.brand && d.brand.name) || '-'; } },
                { field: 'category', title: '品类', width: 110 },
                { field: 'total', title: '总额', width: 110, templet: function (d) { return app.formatMoney(d.total); } },
                { field: 'maling', title: '抹零', width: 90, templet: function (d) { return app.formatMoney(app.utils.accAdd(d.maling, d.venderMaling)); } },
                { field: 'coupon', title: '券值', width: 90, templet: function (d) { return app.formatMoney(d.coupon); } },
                { field: 'status', title: '状态', width: 90, templet: function (d) { return STATUS[d.status] != null ? STATUS[d.status] : '-'; } },
                { field: 'createTime', title: '创建时间', width: 170 },
                { title: '操作', width: 230, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) {
            var ev = obj.event, v = obj.data;
            if (ev === 'detail') openDetail(v);
            else if (ev === 'wipezero') openWipezero(v);
            else if (ev === 'pre') doPre(v);
        });
    }
    function bF() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(pg) {
        state.page = pg || 1;
        app.post(listApi, $.extend({}, bF(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
            var p = res.paging || {}; table.reload('resultTable', { data: p.data || [] }); state.total = p.totalRecords || 0; rpg();
        });
    }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }
    function openDetail(v) {
        // dompany flag：predompany → false（不可改结算）；其他 → true
        app.params.sales = { sid: v.sid, dompany: pageType != 'predompany' };
        app.popup(api.index.querySalesIndex ? '/views/sales/salesBalance4detail.html' : '/views/sales/salesBalance4detail.html', '预结销售单号 ' + v.no, null, { area: ['90%', '80%'] });
    }
    function openWipezero(v) {
        app.clearValidator();
        state.curData = v;
        $('#editForm [name="sid"]').val(v.sid);
        $('#maling').val(app.utils.accAdd(v.maling, v.venderMaling));
        $('#editForm [name="originalMaling"]').val(v.maling);
        $('#editForm [name="venderMaling"]').val(v.venderMaling);
        $('#editVenderMaling').val(0);
        state.editIndex = layer.open({ type: 1, title: '修改抹零', content: $('#editBox'), area: ['480px', 'auto'] });
    }
    function doSave() {
        if (app.validate('editForm')) return;
        var v = state.curData;
        app.post(api.sales.updateSalesForMaling, {
            'sales.sid': v.sid,
            'sales.venderMaling': $('#editVenderMaling').val()
        }, function () { app.showAlert(app.success, '保存成功'); layer.close(state.editIndex); state.editIndex = null; query(state.page); });
    }
    function doPre(v) {
        app.showConfirm('确定要将单号为 ' + v.no + ' 的销售单进行预结吗?', function () {
            app.post(api.sales.preSalesBalance, { 'sid[0]': v.sid }, function () { app.showAlert(app.success, '预结成功'); query(state.page); });
        });
    }
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); query(1); });
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
