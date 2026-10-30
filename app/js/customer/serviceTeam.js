/** app/js/customer/serviceTeam.js —— 客户群（旧 crowd.js → layui）
 *  列表：pageGroup（名称/装修单号 eq）。
 *  行操作：编辑 updateGroup；绑定 bindGroup（orderId 为空时）；群成员（弹 serviceTeam4user，orderId 非空时）；
 *  解绑 unbindGroup（orderId 非空时）。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    customerCommon.ensureApiStubs();
    var state = { page: 1, rows: 10, total: 0, gid: null, opengid: null, editIndex: null, bindIndex: null };

    table.render({
        elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[
            { type: 'numbers', title: '#', width: 60 },
            { field: 'name', title: '群名称', minWidth: 160 },
            { field: 'opengid', title: '群编号', width: 180 },
            { field: 'orderId', title: '装修单号', width: 120 },
            { field: 'content', title: '说明', minWidth: 160 },
            { title: '操作', width: 230, fixed: 'right', toolbar: '#rowToolbar' }
        ]]
    });
    table.on('tool(resultTable)', function (obj) {
        var v = obj.data;
        if (obj.event === 'edit') {
            state.gid = v.gid;
            $('#editForm [name="name"]').val(v.name);
            $('#editForm [name="content"]').val(v.content || '');
            app.clearValidator();
            state.editIndex = layer.open({ type: 1, title: '编辑群信息', content: $('#editBox'), area: ['480px', 'auto'] });
        } else if (obj.event === 'bind') {
            state.gid = v.gid;
            state.opengid = v.opengid;
            $('#bindOrderForm')[0].reset();
            app.clearValidator();
            state.bindIndex = layer.open({ type: 1, title: '绑定装修单', content: $('#bindOrderBox'), area: ['460px', 'auto'] });
        } else if (obj.event === 'addUser') {
            app.params.customer = $.extend({}, app.params.customer, { orderId: v.orderId });
            app.popup(api.index.serviceTeam4userIndex.url, '群成员');
        } else if (obj.event === 'unbind') {
            app.showConfirm('确定要解除绑定', function () {
                app.post(api.customer.unbindGroup, { 'group.gid': v.gid }, function () {
                    app.showAlert(app.success, '解除成功');
                    query(state.page);
                });
            });
        }
    });
    if (!$('#rowToolbar').length) {
        $('body').append(
            '<script type="text/html" id="rowToolbar">'
            + '<button class="layui-btn layui-btn-xs layui-btn-warm" lay-event="edit">编辑</button>'
            + '{{# if(d.orderId == null){ }}<button class="layui-btn layui-btn-xs" lay-event="bind">绑定</button>{{# } }}'
            + '{{# if(d.orderId != null){ }}<button class="layui-btn layui-btn-xs" lay-event="addUser">群成员</button>'
            + '<button class="layui-btn layui-btn-xs layui-btn-warm" lay-event="unbind">解绑</button>{{# } }}'
            + '<\/script>'
        );
    }

    function query(pg) {
        state.page = pg || 1;
        app.post(api.customer.pageGroup, $.extend({}, customerCommon.buildFilters($('#searchForm')), {
            'paging.page': state.page,
            'paging.rows': state.rows
        }), function (res) {
            var p = res.paging || { data: [], totalRecords: 0, totalPage: 0 };
            table.reload('resultTable', { data: p.data || [] });
            state.total = p.totalRecords || 0;
            laypage.render({
                elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30],
                layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
                jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); }
            });
        });
    }
    query(1);

    $('#btnSave').on('click', function () {
        if (app.validate('editForm')) return;
        app.post(api.customer.updateGroup, {
            'group.gid': state.gid,
            'group.name': $('#editForm [name="name"]').val(),
            'group.content': $('#editForm [name="content"]').val()
        }, function () {
            app.showAlert(app.success, '修改群信息成功');
            layer.close(state.editIndex);
            query(state.page);
        });
    });
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); });

    $('#btnBindSave').on('click', function () {
        if (app.validate('bindOrderForm')) return;
        app.post(api.customer.bindGroup, {
            'group.opengid': state.opengid,
            'group.orderId': $('#bindOrderForm [name="orderId"]').val()
        }, function () {
            app.showAlert(app.success, '绑定成功');
            layer.close(state.bindIndex);
            query(state.page);
        });
    });
    $('#btnBindCancel').on('click', function () { layer.close(state.bindIndex); });

    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); form.render('select'); query(1); });
});
}); // end app.ready
