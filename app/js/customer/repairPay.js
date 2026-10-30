/** app/js/customer/repairPay.js —— 维修款项（旧 repairPay.js → layui）
 *  上下文：app.params.customer.aid。列表：queryRepairpay（repairpay.aid，金额÷1000）。
 *  添加 addRepairpay（金额×1000）；删除 deleteRepairpay。 */
app.ready(function () {
layui.use(['table', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var E = customerCommon.ENUM;
    customerCommon.ensureApiStubs();
    var aid = customerCommon.ctx('customer').aid;
    var state = { editIndex: null };

    if (aid == null || aid === '') { app.showAlert(app.warning, '缺少上下文'); return; }

    table.render({
        elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[
            { type: 'numbers', title: '#', width: 60 },
            { field: 'type', title: '类型', width: 100, templet: function (d) { return E.aepairPayType[d.type] != null ? E.aepairPayType[d.type] : ''; } },
            { field: 'money', title: '金额', width: 120, align: 'right', templet: function (d) { return app.formatMoney(d.money); } },
            { field: 'status', title: '状态', width: 100, templet: function (d) { return E.aepairPayStatus[d.status] != null ? E.aepairPayStatus[d.status] : ''; } },
            { field: 'creater', title: '创建人', width: 110, templet: function (d) { return d.creater ? (d.creater.currentName || '') : ''; } },
            { field: 'createTime', title: '创建时间', width: 170 },
            { title: '操作', width: 100, fixed: 'right', toolbar: '#rowToolbar' }
        ]]
    });
    table.on('tool(resultTable)', function (obj) {
        if (obj.event === 'del') {
            app.post(api.customer.deleteRepairpay, { 'repairpay.rpid': obj.data.rpid }, function () {
                app.showAlert(app.success, '删除成功');
                renderList();
            });
        }
    });
    if (!$('#rowToolbar').length) {
        $('body').append(
            '<script type="text/html" id="rowToolbar">'
            + '<button class="layui-btn layui-btn-danger layui-btn-xs" lay-event="del"><i class="layui-icon layui-icon-delete"></i>删除</button>'
            + '<\/script>'
        );
    }

    function renderList() {
        app.post(api.customer.queryRepairpay, { 'repairpay.aid': aid }, function (res) {
            table.reload('resultTable', { data: res.repairpays || [] });
        });
    }
    renderList();

    $('#btnAdd').on('click', function () {
        app.clearValidator();
        $('#editForm')[0].reset();
        form.render('select');
        state.editIndex = layer.open({ type: 1, title: '添加维修款', content: $('#editBox'), area: ['420px', 'auto'] });
    });
    $('#btnSave').on('click', function () {
        if (app.validate('editForm')) return;
        app.post(api.customer.addRepairpay, {
            'repairpay.aid': aid,
            'repairpay.type': $('#editForm [name="type"]').val(),
            'repairpay.money': $('#editForm [name="money"]').val()
        }, function () {
            app.showAlert(app.success, '添加成功');
            layer.close(state.editIndex);
            state.editIndex = null;
            renderList();
        });
    });
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
