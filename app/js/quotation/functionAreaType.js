/** app/js/quotation/functionAreaType.js —— 功能区类型维护
 *  列表：pageFunctionAreaType；编辑：add/updateFunctionAreaType；状态：updateFunctionAreaTypeForStatus。
 *  functionAreaType 为 functionarea/quotationfunctionarea 共用字段的空间类型字典值（值关联，存名称文本）。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    quotationCommon.ensureApiStubs();
    var state = { page: 1, rows: 10, total: 0, fatId: 0 };

    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 60 },
            { field: 'name', title: '类型名称', width: 180 },
            { field: 'status', title: '状态', width: 100, templet: function (d) { return d.status == 0 ? '<span class="layui-badge layui-bg-green">启用</span>' : '<span class="layui-badge layui-bg-gray">停用</span>'; } },
            { title: '操作', width: 200, toolbar: '#rowToolbar' } ]] });
    table.on('tool(resultTable)', function (obj) {
        var v = obj.data, ev = obj.event;
        if (ev === 'edit') openEdit(v);
        else if (ev === 'status') doStatus(v);
    });

    function query(pg) {
        state.page = pg || 1;
        app.post(api.quotation.pageFunctionAreaType, { 'paging.page': state.page, 'paging.rows': state.rows }, function (res) {
            var p = res.paging || {};
            table.reload('resultTable', { data: p.data || [] });
            state.total = p.totalRecords || 0;
            rpg();
        });
    }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }

    function openEdit(v) {
        state.fatId = v ? v.fatId : 0;
        $('#typeName').val(v ? v.name : '');
        layer.open({ type: 1, title: state.fatId ? '编辑功能区类型' : '添加功能区类型', content: $('#editBox'), area: ['420px', 'auto'],
            btn: ['保存', '取消'], yes: function (idx) {
                var name = $.trim($('#typeName').val());
                if (!name) { app.showAlert(app.warning, '请填写类型名称'); return; }
                var url = api.quotation.addFunctionAreaType;
                var options = { 'functionAreaType.name': name };
                if (state.fatId != 0) { url = api.quotation.updateFunctionAreaType; options['functionAreaType.fatId'] = state.fatId; }
                app.post(url, options, function () {
                    app.showAlert(app.success, '操作成功');
                    layer.close(idx); query(state.page);
                });
            } });
    }
    function doStatus(v) {
        app.post(api.quotation.updateFunctionAreaTypeForStatus, { 'functionAreaType.fatId': v.fatId, 'functionAreaType.status': v.status == 0 ? 1 : 0 }, function () {
            query(state.page);
        });
    }

    $('#btnAdd').on('click', function () { openEdit(null); });
    query(1);
});
}); // end app.ready
