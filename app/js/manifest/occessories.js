/** app/js/manifest/occessories.js —— 外辅单管理（列表 + 状态操作）
 *  对齐旧 WebContent/js/manifest/occessories.js。
 *  pageType（URL ?type=）决定列表 endpoint 与默认状态过滤：
 *    默认 → pageOccessories, status=0；supplier → pageOccessoriesForSupplier；
 *    delive → status=2；receive → status=3；balance → status=4；bind → status=1。
 *  状态操作：bind/deliveOccessories/receiveOccessories/balanceOccessories/finishOccessories/
 *           rateOccessories（评分）/updateOccessoriesForRemark/cancelOccessories（作废,0/1/2态）/deleteOccessories。
 *  注：批量结算(batchBalanceOccessories)、金蝶集成暂不迁移。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0 };
    var pageType = getQueryParam('type') || '';
    var statusMap = {};

    app.post(api.ds.manifest, {}, function (res) {
        var st = res.occessoriesStatus || [];
        for (var i = 0; i < st.length; i++) { statusMap[st[i].key] = st[i].value; }
        initTable(); query(1);
    });

    function statusText(d) { return statusMap[String(d.status)] || '---'; }

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 },
                { field: 'no', title: '外辅单号', width: 130 },
                { field: 'decoration', title: '装修单号', width: 120, templet: function (d) { return d.decoration ? d.decoration.orderId : ''; } },
                { field: 'creater', title: '创建人', width: 100, templet: function (d) { return d.creater ? (d.creater.currentName || '') : ''; } },
                { field: 'supplier', title: '厂商', width: 100, templet: function (d) { return d.supplier ? (d.supplier.currentName || '') : ''; } },
                { field: 'createTime', title: '创建时间', width: 170 },
                { field: 'deliveTime', title: '送货时间', width: 120 },
                { field: 'receiveTime', title: '到货时间', width: 120 },
                { field: 'balanceTime', title: '结算时间', width: 120 },
                { field: 'total', title: '总额', width: 100, align: 'right', templet: function (d) { return app.formatMoney(d.total); } },
                { field: 'charge', title: '费用额', width: 100, align: 'right', templet: function (d) { return app.formatMoney(d.charge); } },
                { field: 'rbalance', title: '材料额', width: 100, align: 'right', templet: function (d) { return app.formatMoney(d.rbalance); } },
                { field: 'status', title: '状态', width: 90, templet: statusText },
                { field: 'comment', title: '备注', minWidth: 120 },
                { title: '操作', width: 480, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) {
            var e = obj.event, d = obj.data;
            if (e === 'view') app.switchPage('occessories4view.html?oid=' + d.oid);
            else if (e === 'bind') {
                if (d.status != 1) { app.showAlert(app.warning, '外辅单状态不可操作'); return; }
                app.showConfirm('确认绑定厂商?', function () { app.post(api.inventory.bindOccessories, { 'occessories.oid': d.oid }, function () { app.showAlert(app.success, '操作成功'); query(state.page); }); });
            }
            else if (e === 'delive') {
                if (d.status != 1) { app.showAlert(app.warning, '外辅单状态不可操作'); return; }
                app.showConfirm('确认送货?', function () { app.post(api.inventory.deliveOccessories, { 'occessories.oid': d.oid }, function () { app.showAlert(app.success, '操作成功'); query(state.page); }); });
            }
            else if (e === 'receive') {
                if (d.status != 2) { app.showAlert(app.warning, '外辅单状态不可操作'); return; }
                app.showConfirm('确认到货?', function () { app.post(api.inventory.receiveOccessories, { 'occessories.oid': d.oid }, function () { app.showAlert(app.success, '操作成功'); query(state.page); }); });
            }
            else if (e === 'balance') {
                if (d.status != 3) { app.showAlert(app.warning, '外辅单状态不可操作'); return; }
                app.showConfirm('确认结算?', function () { app.post(api.inventory.balanceOccessories, { 'occessories.oid': d.oid }, function () { app.showAlert(app.success, '操作成功'); query(state.page); }); });
            }
            else if (e === 'finish') {
                if (d.status != 4) { app.showAlert(app.warning, '外辅单状态不可操作'); return; }
                app.showConfirm('确认完结?', function () { app.post(api.inventory.finishOccessories, { 'occessories.oid': d.oid }, function () { app.showAlert(app.success, '操作成功'); query(state.page); }); });
            }
            else if (e === 'cancel') {
                if (d.status != 0 && d.status != 1 && d.status != 2) { app.showAlert(app.warning, '外辅单状态不可操作'); return; }
                app.showConfirm('确认作废?', function () { app.post(api.inventory.cancelOccessories, { 'occessories.oid': d.oid }, function () { app.showAlert(app.success, '操作成功'); query(state.page); }); });
            }
            else if (e === 'delete') {
                app.showConfirm('确认删除?', function () { app.post(api.inventory.deleteOccessories, { 'occessories.oid': d.oid }, function () { app.showAlert(app.success, '已删除'); query(state.page); }); });
            }
        });
    }

    function endpoint() { return pageType == 'supplier' ? api.inventory.pageOccessoriesForSupplier : api.inventory.pageOccessories; }
    function defaultStatus() {
        if (pageType == 'delive') return '2';
        if (pageType == 'receive') return '3';
        if (pageType == 'balance') return '4';
        if (pageType == 'bind') return '1';
        return '0';
    }
    function bF() {
        var p = {}, c = 0;
        $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; });
        return p;
    }
    function query(pg) {
        state.page = pg || 1;
        var filters = bF();
        // 若未指定 status，按 pageType 默认状态过滤
        var hasStatus = false;
        for (var k in filters) { if (filters[k] === 'status') { hasStatus = true; break; } }
        if (!hasStatus && pageType) { var ds = defaultStatus(); if (ds) { var n = 0; for (var kk in filters) { if (filters.hasOwnProperty(kk)) n++; } filters['filters[' + n + '].field'] = 'status'; filters['filters[' + n + '].data'] = ds; filters['filters[' + n + '].op'] = 'eq'; } }
        app.post(endpoint(), $.extend({}, filters, { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) { var p = res.paging || {}; table.reload('resultTable', { data: p.data || [] }); state.total = p.totalRecords || 0; rpg(); });
    }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); form.render(); query(1); });
    form.render();

    function getQueryParam(name) {
        var s = location.search.substring(1).split('&');
        for (var i = 0; i < s.length; i++) { var kv = s[i].split('='); if (decodeURIComponent(kv[0]) === name) return decodeURIComponent(kv[1] || ''); }
        return '';
    }
});
}); // end app.ready
