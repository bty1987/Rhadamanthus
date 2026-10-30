/** app/js/material/materialPostBalance.js —— 主材结算（列表 + 厂结值/厂结/结算值/结算/收款/子项）
 * 状态：0=预结 1=厂结 2=结算；类型：0=购货 1=预结退货 2=结算退货。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, vIndex: null, bIndex: null };
    function stB(d) { var s = d.status == 0 ? '预结' : d.status == 1 ? '厂结' : d.status == 2 ? '结算' : '-'; var c = d.status == 2 ? 'layui-bg-green' : d.status == 1 ? 'layui-bg-blue' : 'layui-bg-orange'; return '<span class="layui-badge ' + c + '">' + s + '<\/span>'; }
    function tpB(d) { return d.type == 0 ? '购货' : d.type == 1 ? '预结退货' : d.type == 2 ? '结算退货' : '-'; }
    initTable(); query(1);
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[
                { type: 'numbers', title: '#', width: 60 },
                { field: 'material.orderId', title: '装修单号', width: 120, templet: function (d) { return d.material ? d.material.orderId : ''; } },
                { field: 'material.no', title: '主材单号', width: 120, templet: function (d) { return d.material ? d.material.no : ''; } },
                { field: 'addr', title: '楼盘地址', minWidth: 200, templet: function (d) { return d.material && d.material.house ? ((d.material.house.village ? d.material.house.village.name : '') + ' ' + d.material.house.houseNumber) : ''; } },
                { field: 'material.brand', title: '品牌', width: 100, templet: function (d) { return d.material ? d.material.brand : ''; } },
                { field: 'total', title: '总价', width: 100, templet: function (d) { return app.formatMoney(d.total); } },
                { field: 'balance', title: '预结值', width: 100, templet: function (d) { return app.formatMoney(d.balance); } },
                { field: 'balanceTime', title: '预结时间', width: 160 },
                { field: 'vbalance', title: '厂结值', width: 100, templet: function (d) { return app.formatMoney(d.vbalance); } },
                { field: 'vbalanceTime', title: '厂结时间', width: 160 },
                { field: 'post', title: '结算值', width: 100, templet: function (d) { return app.formatMoney(d.post); } },
                { field: 'postTime', title: '结算时间', width: 160 },
                { field: 'status', title: '状态', width: 80, templet: stB },
                { field: 'type', title: '类型', width: 100, templet: tpB },
                { title: '操作', width: 460, toolbar: '#rowToolbar' }
            ]]
        });
        table.on('tool(resultTable)', function (obj) {
            var ev = obj.event, v = obj.data;
            if (ev === 'supBalance') openV(v);
            else if (ev === 'supPost') doPost(api.material.vpostMaterialBalance, v.mbid, '厂商成功结算');
            else if (ev === 'balance') openB(v);
            else if (ev === 'post') doPost(api.material.postMaterialBalance, v.mbid, '成功结算');
            else if (ev === 'charge') goCharge(v);
            else if (ev === 'sub') goDetail(v);
        });
    }
    function bF() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(pg) { state.page = pg || 1; app.post(api.material.pageMaterialBalance, $.extend({}, bF(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) { var p = res.paging || {}; table.reload('resultTable', { data: p.data || [] }); state.total = p.totalRecords || 0; rpg(); }); }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }
    function openV(v) {
        if (v.status != 0) { app.showAlert(app.warning, '非预结状态下不允许进行厂结'); return; }
        $('#vForm')[0].reset();
        $('#vForm [name="mbid"]').val(v.mbid);
        $('#vForm [name="total"]').val(v.total);
        $('#vForm [name="vbalance"]').val('');
        state.vIndex = layer.open({ type: 1, title: '厂商结算值 - ' + (v.material ? v.material.no : ''), content: $('#vBox'), area: ['520px', 'auto'] });
    }
    function openB(v) {
        if (v.status != 1) { app.showAlert(app.warning, '非厂结状态下不允许进行结算'); return; }
        $('#bForm')[0].reset();
        $('#bForm [name="mbid"]').val(v.mbid);
        $('#bForm [name="prebalance"]').val(app.utils.accSub(v.total, v.balance));
        $('#bForm [name="vbalance"]').val(v.vbalance);
        $('#bForm [name="balance"]').val('');
        state.bIndex = layer.open({ type: 1, title: '结算值 - ' + (v.material ? v.material.no : ''), content: $('#bBox'), area: ['520px', 'auto'] });
    }
    function doVSave() {
        if (app.validate('vForm')) return;
        app.post(api.material.updateMaterialBalanceForVBalance, { 'materialBalance.mbid': $('#vForm [name="mbid"]').val(), 'materialBalance.vbalance': $('#vForm [name="vbalance"]').val() }, function () { app.showAlert(app.success, '保存成功'); layer.close(state.vIndex); query(state.page); });
    }
    function doBSave() {
        if (app.validate('bForm')) return;
        app.post(api.material.updateMaterialBalanceForBalance, { 'materialBalance.mbid': $('#bForm [name="mbid"]').val(), 'materialBalance.balance': $('#bForm [name="balance"]').val() }, function () { app.showAlert(app.success, '保存成功'); layer.close(state.bIndex); query(state.page); });
    }
    function doPost(url, mbid, msg) { app.post(url, { 'materialBalance.mbid': mbid }, function () { app.showAlert(app.success, msg); query(state.page); }); }
    function goCharge(v) {
        app.params.materialSubOrder = { msoId: v.material ? v.material.mid : '', mpId: v.mpId, type: v.type };
        app.params.historyPage = api.index.materialPostBalanceIndex.url;
        app.switchPage(api.index.materialCollectionIndex.url);
    }
    function goDetail(v) {
        app.params.materialPostBalance = { msoId: v.material ? v.material.mid : '', type: v.type, ident: v.ident };
        app.switchPage(api.index.materialPostBalanceDetailIndex.url);
    }
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); query(1); });
    $('#btnExport').on('click', function () { app.post(api.material.pageMaterialBalance, $.extend({}, bF(), { 'paging.page': 1, 'paging.rows': 2000 }), function (res) { var p = res.paging || {}; app.exporter && app.exporter(p.data || [], '主材结算'); }); });
    $('#btnVSave').on('click', doVSave);
    $('#btnVCancel').on('click', function () { layer.close(state.vIndex); });
    $('#btnBSave').on('click', doBSave);
    $('#btnBCancel').on('click', function () { layer.close(state.bIndex); });
});
}); // end app.ready
