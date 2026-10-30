/** app/js/manifest/accessories.js —— 辅料单管理（列表 + 状态操作）
 *  对齐旧 WebContent/js/manifest/accessories.js。
 *  状态/类型来自 api.ds.manifest（accessories.status/accessories.type）。
 *  注：金蝶出库/入库集成（旧 kingdeeUtils）暂不在纯 layui 版本迁移，仅保留业务状态操作。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0 };
    var statusMap = {}, typeMap = {};

    app.post(api.ds.manifest, {}, function (res) {
        var st = res.accessoriesStatus || [], ty = res.accessoriesType || [];
        for (var i = 0; i < st.length; i++) { statusMap[st[i].key] = st[i].value; }
        for (var j = 0; j < ty.length; j++) { typeMap[ty[j].key] = ty[j].value; }
        initTable(); query(1);
    });

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 },
                { field: 'no', title: '辅料单号', width: 130 },
                { field: 'orderId', title: '装修单号', width: 120 },
                { field: 'creater', title: '创建人', width: 100, templet: function (d) { return d.creater ? (d.creater.currentName || '---') : '---'; } },
                { field: 'createTime', title: '创建时间', width: 170 },
                { field: 'approver', title: '审批人', width: 100, templet: function (d) { return d.approver ? d.approver.userName : ''; } },
                { field: 'approverTime', title: '审批时间', width: 120 },
                { field: 'total', title: '总价', width: 100, align: 'right', templet: function (d) { return app.formatMoney(d.total); } },
                { field: 'status', title: '状态', width: 90, templet: function (d) { return statusMap[String(d.status)] || '---'; } },
                { field: 'type', title: '类型', width: 80, templet: function (d) { return typeMap[String(d.type)] || '---'; } },
                { field: 'comment', title: '备注', minWidth: 120 },
                { title: '操作', width: 520, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) {
            var e = obj.event, d = obj.data;
            if (e === 'view') app.switchPage('accessories4view.html?aid=' + d.aid);
            else if (e === 'preout') {
                if (d.status != 0) { app.showAlert(app.warning, '辅料单状态不可操作'); return; }
                app.showConfirm('是否确认预出辅料单', function () {
                    app.post(api.inventory.preoutAccessories, { 'accessories.aid': d.aid }, function () { app.showAlert(app.success, '操作成功'); query(state.page); });
                });
            }
            else if (e === 'out') {
                if (d.status != 0 && d.status != 1) { app.showAlert(app.warning, '辅料单状态不可操作'); return; }
                app.switchPage('accessories2out.html?aid=' + d.aid + '&orderId=' + d.orderId);
            }
            else if (e === 'edit') {
                if (d.status != 0) { app.showAlert(app.warning, '辅料单状态不可操作'); return; }
                app.switchPage('accessories2edit.html?aid=' + d.aid + '&type=' + d.type + '&orderId=' + d.orderId);
            }
            else if (e === 'refuse') {
                if (d.status != 0) { app.showAlert(app.warning, '辅料单状态不可操作'); return; }
                app.showConfirm('是否确认拒绝辅料单', function () {
                    app.post(api.inventory.refuseAccessories, { 'accessories.aid': d.aid }, function () { app.showAlert(app.success, '操作成功'); query(state.page); });
                });
            }
            else if (e === 'refund') app.switchPage('accessories4refund.html?aid=' + d.aid);
            else if (e === 'delive') {
                if (d.status != 2) { app.showAlert(app.warning, '辅料单状态不可操作'); return; }
                app.showConfirm('确认到货?', function () {
                    app.post(api.inventory.deliveAccessories, { 'accessories.aid': d.aid }, function () { app.showAlert(app.success, '操作成功'); query(state.page); });
                });
            }
            else if (e === 'print') app.switchPage('accessories2print.html?aid=' + d.aid);
        });
    }
    function bF() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(pg) { state.page = pg || 1; app.post(api.inventory.pageAccessories, $.extend({}, bF(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) { var p = res.paging || {}; table.reload('resultTable', { data: p.data || [] }); state.total = p.totalRecords || 0; rpg(); }); }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); form.render(); query(1); });
    form.render();
});
}); // end app.ready
