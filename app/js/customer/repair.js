/** app/js/customer/repair.js —— 返修记录（旧 repair.js → layui）
 *  上下文：app.params.customer.aid。列表：queryRepair（repair.aid）。
 *  行操作：维修（status==0 → keepRepair）；完工（status==1 → finishRepair）；添加 addRepair。 */
app.ready(function () {
layui.use(['table', 'layer', 'jquery'], function () {
    var table = layui.table, layer = layui.layer, $ = layui.jquery;
    var E = customerCommon.ENUM;
    customerCommon.ensureApiStubs();
    var aid = customerCommon.ctx('customer').aid;
    var state = { editIndex: null, scheduleIndex: null, rid: null, type: null, userId: null };

    if (aid == null || aid === '') { app.showAlert(app.warning, '缺少上下文'); return; }

    table.render({
        elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[
            { type: 'numbers', title: '#', width: 60 },
            { field: 'repaier', title: '维修人', width: 110, templet: function (d) { return d.repaier ? (d.repaier.currentName || '') : ''; } },
            { field: 'creater', title: '创建人', width: 110, templet: function (d) { return d.creater ? (d.creater.currentName || '') : ''; } },
            { field: 'createTime', title: '创建时间', width: 170 },
            { field: 'updater', title: '更新人', width: 110, templet: function (d) { return d.updater ? (d.updater.currentName || '') : ''; } },
            { field: 'updateTime', title: '更新时间', width: 170 },
            { field: 'status', title: '状态', width: 90, templet: function (d) { return customerCommon.badge(E.repairStatus, d.status); } },
            { field: 'content', title: '内容', minWidth: 200 },
            { title: '操作', width: 110, fixed: 'right', toolbar: '#rowToolbar' }
        ]]
    });
    table.on('tool(resultTable)', function (obj) {
        var v = obj.data;
        if (obj.event === 'keep' || obj.event === 'finish') {
            state.rid = v.rid;
            state.type = obj.event === 'keep' ? 'keep' : null;
            $('#scheduleForm')[0].reset();
            app.clearValidator();
            state.scheduleIndex = layer.open({
                type: 1, title: obj.event === 'keep' ? '维修' : '完工',
                content: $('#scheduleBox'), area: ['480px', 'auto']
            });
        }
    });
    if (!$('#rowToolbar').length) {
        $('body').append(
            '<script type="text/html" id="rowToolbar">'
            + '{{# if(d.status == 0){ }}<button class="layui-btn layui-btn-xs layui-btn-danger" lay-event="keep">维修</button>{{# } }}'
            + '{{# if(d.status == 1){ }}<button class="layui-btn layui-btn-xs layui-btn-normal" lay-event="finish">完工</button>{{# } }}'
            + '<\/script>'
        );
    }

    function renderList() {
        app.post(api.customer.queryRepair, { 'repair.aid': aid }, function (res) {
            table.reload('resultTable', { data: res.repairs || [] });
        });
    }
    renderList();

    // —— 维修/完工 ——
    $('#btnScheduleSave').on('click', function () {
        if (app.validate('scheduleForm')) return;
        var option = {
            'repair.rid': state.rid,
            'repair.schedule': $('#scheduleForm [name="schedule"]').val()
        };
        var apiDef = state.type === 'keep' ? api.customer.keepRepair : api.customer.finishRepair;
        app.post(apiDef, option, function () {
            app.showAlert(app.success, '操作成功');
            layer.close(state.scheduleIndex);
            state.scheduleIndex = null;
            renderList();
        });
    });
    $('#btnScheduleCancel').on('click', function () { layer.close(state.scheduleIndex); state.scheduleIndex = null; });

    // —— 添加返修 ——
    $('#btnAdd').on('click', function () {
        app.clearValidator();
        $('#editForm')[0].reset();
        state.userId = null;
        state.editIndex = layer.open({ type: 1, title: '添加返修', content: $('#editBox'), area: ['520px', 'auto'] });
    });
    $('#btnPickUser').on('click', function () {
        customerCommon.userPicker(function (u) {
            state.userId = u.userId;
            $('#userNameRepair').val(u.currentName);
        });
    });
    $('#btnSave').on('click', function () {
        if (app.validate('editForm')) return;
        if (!state.userId) { app.showAlert(app.warning, '请选择维修人'); return; }
        app.post(api.customer.addRepair, {
            'repair.aid': aid,
            'repair.repaier.userId': state.userId,
            'repair.content': $('#editForm [name="content"]').val()
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
