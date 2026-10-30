/** app/js/construction/supervision4rework.js —— 返工信息（订单维度 CRUD + 图纸入口）
 *  上下文：app.params.construction = { orderId }。
 *  pageReworkByOrderId / add / update / delete；图纸跳 supervision4drawing。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'laydate', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, laydate = layui.laydate, layer = layui.layer, $ = layui.jquery;
    constructionCommon.ensureApiStubs();
    var pageConfig = constructionCommon.getPageConfig('supervision4rework');
    var ctx = app.params.construction || {};
    var state = { page: 1, rows: 10, total: 0, editFlag: false, rwId: null };

    function btnVisible(key) { return pageConfig.pageBtn.length == 0 || pageConfig.pageBtn.indexOf(key) != -1; }
    laydate.render({ elem: '#createTime', format: 'yyyy-MM-dd' });

    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 60 },
            { field: 'createrName', title: '创建人', width: 130 },
            { field: 'createTime', title: '返工时间', width: 170 },
            { field: 'reworkDes', title: '返工说明', minWidth: 300 },
            { title: '操作', width: 200, toolbar: '#rowToolbar' } ]] });

    table.on('tool(resultTable)', function (obj) {
        var v = obj.data;
        if (obj.event === 'view') {
            if (!btnVisible('view')) return;
            app.params.construction = $.extend({}, ctx, { rwId: v.rwId });
            app.popup('views/construction/supervision4drawing.html', '返工图纸', null, { area: ['70%', '70%'] });
        } else if (obj.event === 'edit') {
            if (!btnVisible('edit')) return;
            state.editFlag = true;
            state.rwId = v.rwId;
            $('#createTime').val((v.createTime || '').substring(0, 10));
            $('#reworkDes').val(v.reworkDes || '');
            openBox('编辑返工信息');
        } else if (obj.event === 'del') {
            if (!btnVisible('del')) return;
            app.showConfirm('确认删除返工信息吗?', function () {
                app.post(api.construction.deleteRework, { 'rwIds[0]': v.rwId }, function () { query(state.page); });
            });
        }
    });

    $('#btnAdd').on('click', function () {
        state.editFlag = false;
        state.rwId = null;
        $('#reworkForm')[0].reset();
        openBox('添加返工信息');
    });

    function openBox(title) {
        layer.open({ type: 1, title: title, content: $('#reworkBox'), area: ['500px', 'auto'],
            btn: ['保存', '取消'], yes: function (idx) { saveData(idx); } });
    }

    function saveData(idx) {
        var options = {
            'rework.createTime': $('#createTime').val(),
            'rework.reworkDes': $('#reworkDes').val(),
            'rework.orderId': ctx.orderId
        };
        if (!options['rework.createTime']) { app.showAlert(app.warning, '请填写返工时间'); return; }
        if (state.editFlag) {
            options['rework.rwId'] = state.rwId;
            app.post(api.construction.updateRework, options, function () { layer.close(idx); query(state.page); });
        } else {
            app.post(api.construction.addRework, options, function () { layer.close(idx); query(state.page); });
        }
    }

    function query(pg) {
        state.page = pg || 1;
        app.post(api.construction.pageReworkByOrderId, $.extend({ 'rework.orderId': ctx.orderId, 'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
            var p = res.paging || {};
            table.reload('resultTable', { data: p.data || [] });
            state.total = p.totalRecords || 0; rpg();
        });
    }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }

    query(1);
});
}); // end app.ready
