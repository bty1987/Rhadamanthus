/** app/js/manifest/manifest.js —— 货单管理（列表 + 查看/修改/确认/进退/出返/打印）
 *  对齐旧 WebContent/js/manifest/manifest.js。
 *  枚举来源：api.ds.manifest（manifestType/manifestStatus）。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0 };
    var manifestTypeMap = {}, manifestStatusMap = {};

    app.post(api.ds.manifest, {}, function (res) {
        var mt = res.manifestType || [], ms = res.manifestStatus || [];
        for (var i = 0; i < mt.length; i++) { manifestTypeMap[mt[i].key] = mt[i].value; }
        for (var j = 0; j < ms.length; j++) { manifestStatusMap[ms[j].key] = ms[j].value; }
        initTable(); query(1);
    });

    function typeText(d) { return manifestTypeMap[String(d.type)] || '---'; }
    function statusText(d) { return manifestStatusMap[String(d.status)] || '---'; }
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 },
                { field: 'code', title: '编号', width: 140 },
                { field: 'creater', title: '创建人', width: 100, templet: function (d) { return d.creater ? (d.creater.currentName || '---') : '---'; } },
                { field: 'createTime', title: '创建时间', width: 170 },
                { field: 'manifestTime', title: '货单时间', width: 120 },
                { field: 'status', title: '状态', width: 90, templet: statusText },
                { field: 'type', title: '类型', width: 90, templet: typeText },
                { field: 'comment', title: '备注', minWidth: 140 },
                { title: '操作', width: 460, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) {
            var e = obj.event, d = obj.data;
            if (e === 'view') app.switchPage('manifest4view.html?mid=' + d.mid);
            else if (e === 'edit') {
                if (d.status != 0) { app.showAlert(app.warning, '货单状态不可操作'); return; }
                app.switchPage('manifest2edit.html?mid=' + d.mid + '&type=' + d.type);
            }
            else if (e === 'confirm') {
                if (d.status != 0) { app.showAlert(app.warning, '货单状态不可操作'); return; }
                app.showConfirm('是否确认订单?', function () {
                    app.post(api.inventory.confirmManifest, { 'manifest.mid': d.mid }, function () { app.showAlert(app.success, '操作成功'); query(state.page); });
                });
            }
            else if (e === 'cr') {
                if (d.status != 1) { app.showAlert(app.warning, '货单状态不可操作'); return; }
                app.switchPage('manifest2cr.html?mid=' + d.mid);
            }
            else if (e === 'xb') {
                if (d.status != 1) { app.showAlert(app.warning, '货单状态不可操作'); return; }
                app.switchPage('manifest2xb.html?mid=' + d.mid);
            }
            else if (e === 'print') { app.switchPage('manifest2print.html?mid=' + d.mid); }
        });
    }
    function bF() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(pg) { state.page = pg || 1; app.post(api.inventory.pageManifest, $.extend({}, bF(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) { var p = res.paging || {}; table.reload('resultTable', { data: p.data || [] }); state.total = p.totalRecords || 0; rpg(); }); }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); form.render(); query(1); });
    form.render();
});
}); // end app.ready
