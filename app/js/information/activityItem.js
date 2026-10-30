/** app/js/information/activityItem.js —— 活动物品（按活动ID加载 + 添加/删除）*/
app.ready(function () {
layui.use(['table', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { editIndex: null, aid: null, activityName: '' };

    // 从父窗口读取 aid / activityName
    try {
        var p = (parent && parent.params && parent.params.infomation) ? parent.params.infomation : (window.params ? window.params.infomation : null);
        if (p) { state.aid = p.aid; state.activityName = p.activityName || ''; }
    } catch (e) {}

    if (state.activityName) $('#activityName').val(state.activityName);

    var TYPE_MAP = { 0: '券', 1: '物品', 2: '红包' };

    initTable();
    if (state.aid) query();
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 },
                { field: 'name', title: '物品名', minWidth: 180 },
                { field: 'type', title: '类型', width: 90, templet: function (d) { return TYPE_MAP[d.type] || '---'; } },
                { field: 'money', title: '金额', width: 100, align: 'right', templet: function (d) { return app.formatMoney(d.money); } },
                { field: 'integral', title: '积分', width: 100, align: 'right' },
                { title: '操作', width: 110, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) { if (obj.event === 'del') doDelete(obj.data.aiid, obj.data.name); });
    }
    function query() {
        app.post(api.information.queryActivityItemByAid, { 'activity.aid': state.aid }, function (res) {
            table.reload('resultTable', { data: res.activityItems || [] });
        });
    }
    function openEdit() {
        app.clearValidator(); $('#editForm')[0].reset();
        state.editIndex = layer.open({ type: 1, title: '添加活动物品', content: $('#editBox'), area: ['480px', 'auto'], cancel: function () { app.clearValidator(); } });
    }
    function doSave() {
        if (app.validate('editForm')) return;
        app.post(api.information.addActivityItem, {
            'activity.aid': state.aid,
            'activityItem.asid': $('#editForm [name="asid"]').val(),
            'activityItem.money': $('#editForm [name="money"]').val(),
            'activityItem.integral': $('#editForm [name="integral"]').val(),
            'activityItem.activity': state.activityName
        }, function () { app.showAlert(app.success, '添加成功'); layer.close(state.editIndex); state.editIndex = null; query(); });
    }
    function doDelete(aiid, name) {
        app.showConfirm('确认删除' + name + '？', function () {
            app.post(api.information.deleteActivityItem, { 'activityItem.aiid': aiid }, function () { app.showAlert(app.success, '已删除'); query(); });
        });
    }
    $('#btnAdd').on('click', openEdit);
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
