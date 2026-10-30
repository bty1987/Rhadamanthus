/** app/js/customer/serviceTeam4user.js —— 群成员（原 crowdUser.js 两轮更名, 旧 ACE 版 → layui）
 *  上下文：app.params.customer.orderId。复用装修单人员接口（跨模块 api.decoration）：
 *  列表 queryDecorationUser；添加 addDecorationUser；删除 deleteDecorationUser。 */
app.ready(function () {
layui.use(['table', 'laypage', 'layer', 'jquery', 'form'], function () {
    var table = layui.table, laypage = layui.laypage, layer = layui.layer, form = layui.form, $ = layui.jquery;
    customerCommon.ensureApiStubs();
    var orderId = customerCommon.ctx('customer').orderId;
    var state = { page: 1, rows: 10, total: 0, editIndex: null, userId: null };

    if (orderId == null || orderId === '') { app.showAlert(app.warning, '缺少装修单上下文'); return; }

    var TYPE_TEXT = { 0: '业务', 1: '装饰', 2: '服务', 3: '合同', 4: '销售', 99: '其他' };

    // 角色建议: 镜像 communion.constant(decoration.decorationUser.contentRole), 库内字典调整须同步此处(app 页惯例为硬编码 ENUM 镜像)
    var ROLE_OPTIONS = ['合约专员', '拆单员', '大师班客户经理', '大师班客户管家', '前台服务咨询监理', '合同签署', '微管专员', '量房员', '主材服务管家', '主材下单员', '下单员', '主播'];

    function fillRoleOptions() {
        var $datalist = $('#contentOptions');
        if ($datalist.length == 0 || $datalist.children().length > 0) return;
        $.each(ROLE_OPTIONS, function (i, v) { $('<option></option>').attr('value', v).appendTo($datalist); });
    }

    table.render({
        elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[
            { type: 'numbers', title: '#', width: 60 },
            { field: 'user', title: '人员', minWidth: 120, templet: function (d) { return d.user ? (d.user.currentName || '') : ''; } },
            { field: 'user', title: '编号', width: 100, templet: function (d) { return d.user ? (d.user.userId != null ? d.user.userId : '') : ''; } },
            { field: 'user', title: '职位', width: 120, templet: function (d) { return d.user && d.user.duty ? (d.user.duty.name || '') : ''; } },
            { field: 'type', title: '类型', width: 90, templet: function (d) { return TYPE_TEXT[d.type == null ? 99 : d.type] || '其他'; } },
            { field: 'content', title: '说明', minWidth: 160 },
            { title: '操作', width: 100, fixed: 'right', toolbar: '#rowToolbar' }
        ]]
    });
    table.on('tool(resultTable)', function (obj) {
        if (obj.event === 'del') {
            app.post(api.decoration.deleteDecorationUser, { 'decorationUser.duid': obj.data.duid }, function () {
                app.showAlert(app.success, '操作成功');
                query(state.page);
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

    function query(pg) {
        state.page = pg || 1;
        app.post(api.decoration.queryDecorationUser, {
            'decorationUser.orderId': orderId,
            'paging.page': state.page,
            'paging.rows': state.rows
        }, function (res) {
            var list = res.decorationUsers || [];
            table.reload('resultTable', { data: list });
            state.total = list.length;
            laypage.render({
                elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows,
                layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
                jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); }
            });
        });
    }
    query(1);

    $('#btnAdd').on('click', function () {
        app.clearValidator();
        $('#editForm')[0].reset();
        $('#uType').val('99');
        layui.form.render('select');
        fillRoleOptions();
        state.userId = null;
        state.editIndex = layer.open({ type: 1, title: '添加群成员', content: $('#editBox'), area: ['520px', 'auto'] });
    });
    $('#btnPickUser').on('click', function () {
        customerCommon.userPicker(function (u) {
            state.userId = u.userId;
            $('#userName').val(u.currentName);
        });
    });
    $('#btnSave').on('click', function () {
        if (app.validate('editForm')) return;
        if (!state.userId) { app.showAlert(app.warning, '请选择人员'); return; }
        app.post(api.decoration.addDecorationUser, {
            'decorationUser.user.userId': state.userId,
            'decorationUser.orderId': orderId,
            'decorationUser.type': $('#uType').val(),
            'decorationUser.content': $('#editForm [name="content"]').val()
        }, function () {
            app.showAlert(app.success, '操作成功');
            layer.close(state.editIndex);
            state.editIndex = null;
            query(state.page);
        });
    });
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
