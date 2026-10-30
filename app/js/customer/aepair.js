/** app/js/customer/aepair.js —— 维修工单（旧 aepair.js → layui）
 *  列表：pageAepair（状态检索）→ 说明/创建人/操作人/维修人/状态/水电动瓦木油工序状态。
 *  行操作：发送 sendAepair；查看（弹 repair，aid）；维修款（弹 repairPay，aid）；更新 updateAepair（支出×1000）；
 *  领取 receiveAepair；分配 deliveAepair / 转交 tranAepair（人员选择）；完工 finishAepair；关闭 closeAepair。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var E = customerCommon.ENUM;
    customerCommon.ensureApiStubs();
    var state = { page: 1, rows: 10, total: 0, aid: null, type: null, updateIndex: null, tranIndex: null, userId: null };

    table.render({
        elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[
            { type: 'numbers', title: '#', width: 60 },
            { field: 'comment', title: '说明', minWidth: 180 },
            { field: 'creater', title: '创建人', width: 100, templet: function (d) { return d.creater ? (d.creater.currentName || '') : ''; } },
            { field: 'updater', title: '操作人', width: 100, templet: function (d) { return d.updater ? (d.updater.currentName || '') : ''; } },
            { field: 'updateTime', title: '操作时间', width: 165 },
            { field: 'repaier', title: '维修人', width: 100, templet: function (d) { return d.repaier ? (d.repaier.currentName || '') : ''; } },
            { field: 'status', title: '状态', width: 80, templet: function (d) { return customerCommon.badge(E.aepairStatus, d.status); } },
            { field: 'onestate', title: '水', width: 70, templet: function (d) { return E.aepairNode[d.onestate] != null ? E.aepairNode[d.onestate] : ''; } },
            { field: 'twostate', title: '电', width: 70, templet: function (d) { return E.aepairNode[d.twostate] != null ? E.aepairNode[d.twostate] : ''; } },
            { field: 'thrstate', title: '瓦', width: 70, templet: function (d) { return E.aepairNode[d.thrstate] != null ? E.aepairNode[d.thrstate] : ''; } },
            { field: 'forstate', title: '木', width: 70, templet: function (d) { return E.aepairNode[d.forstate] != null ? E.aepairNode[d.forstate] : ''; } },
            { field: 'fivstate', title: '油', width: 70, templet: function (d) { return E.aepairNode[d.fivstate] != null ? E.aepairNode[d.fivstate] : ''; } },
            { title: '操作', width: 400, fixed: 'right', toolbar: '#rowToolbar' }
        ]]
    });
    table.on('tool(resultTable)', function (obj) {
        var v = obj.data;
        if (obj.event === 'send') {
            app.post(api.customer.sendAepair, {
                'code': '1b0c4d577a692ccbea1020147d2d851e1db9f9055d204872a3c76c9edab27204',
                'aepair.aid': v.aid
            }, function () {
                app.showAlert(app.success, '发送成功');
            });
        } else if (obj.event === 'view') {
            app.params.customer = $.extend({}, app.params.customer, { aid: v.aid });
            app.popup(api.index.repairIndex.url, '维修单');
        } else if (obj.event === 'pay') {
            app.params.customer = $.extend({}, app.params.customer, { aid: v.aid });
            app.popup(api.index.repairPayIndex.url, '维修款');
        } else if (obj.event === 'update') {
            state.aid = v.aid;
            $('#updateForm')[0].reset();
            app.clearValidator();
            state.updateIndex = layer.open({ type: 1, title: '更新支出', content: $('#updateBox'), area: ['420px', 'auto'] });
        } else if (obj.event === 'receive') {
            app.showConfirm('确认要领取吗', function () {
                app.post(api.customer.receiveAepair, { 'aepair.aid': v.aid }, function () {
                    app.showAlert(app.success, '领取成功');
                    query(state.page);
                });
            });
        } else if (obj.event === 'delive' || obj.event === 'tran') {
            state.aid = v.aid;
            state.type = obj.event === 'delive' ? 'delive' : null;
            $('#tranForm')[0].reset();
            app.clearValidator();
            state.userId = null;
            state.tranIndex = layer.open({ type: 1, title: obj.event === 'delive' ? '分配报修信息' : '转交报修信息', content: $('#tranBox'), area: ['480px', 'auto'] });
        } else if (obj.event === 'finish') {
            app.showConfirm('确认要完工吗', function () {
                app.post(api.customer.finishAepair, { 'aepair.aid': v.aid }, function () {
                    app.showAlert(app.success, '操作成功');
                    query(state.page);
                });
            });
        } else if (obj.event === 'close') {
            app.showConfirm('确认要关闭吗', function () {
                app.post(api.customer.closeAepair, { 'aepair.aid': v.aid }, function () {
                    app.showAlert(app.success, '关闭成功');
                    query(state.page);
                });
            });
        }
    });
    if (!$('#rowToolbar').length) {
        $('body').append(
            '<script type="text/html" id="rowToolbar">'
            + '<button class="layui-btn layui-btn-xs" lay-event="send">发送</button>'
            + '<button class="layui-btn layui-btn-xs layui-btn-warm" lay-event="view">查看</button>'
            + '<button class="layui-btn layui-btn-xs layui-btn-normal" lay-event="pay">维修款</button>'
            + '<button class="layui-btn layui-btn-xs" lay-event="update">更新</button>'
            + '<button class="layui-btn layui-btn-xs layui-btn-danger" lay-event="receive">领取</button>'
            + '<button class="layui-btn layui-btn-xs layui-btn-warm" lay-event="delive">分配</button>'
            + '<button class="layui-btn layui-btn-xs layui-btn-warm" lay-event="tran">转交</button>'
            + '<button class="layui-btn layui-btn-xs" lay-event="finish">完工</button>'
            + '<button class="layui-btn layui-btn-xs layui-btn-warm" lay-event="close">关闭</button>'
            + '<\/script>'
        );
    }

    function query(pg) {
        state.page = pg || 1;
        app.post(api.customer.pageAepair, $.extend({}, customerCommon.buildFilters($('#searchForm')), {
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

    // —— 更新支出 ——
    $('#btnUpdateSave').on('click', function () {
        if (app.validate('updateForm')) return;
        app.post(api.customer.updateAepair, {
            'aepair.aid': state.aid,
            'aepair.outlay': $('#updateForm [name="outlay"]').val()
        }, function () {
            app.showAlert(app.success, '操作成功');
            layer.close(state.updateIndex);
            state.updateIndex = null;
            query(state.page);
        });
    });
    $('#btnUpdateCancel').on('click', function () { layer.close(state.updateIndex); state.updateIndex = null; });

    // —— 分配/转交 ——
    $('#btnPickUser').on('click', function () {
        customerCommon.userPicker(function (u) {
            state.userId = u.userId;
            $('#userName').val(u.currentName);
        });
    });
    $('#btnTranSave').on('click', function () {
        if (app.validate('tranForm')) return;
        if (!state.userId) { app.showAlert(app.warning, '请选择维修人'); return; }
        var options = { 'aepair.aid': state.aid, 'aepair.repaier.userId': state.userId };
        app.post(state.type === 'delive' ? api.customer.deliveAepair : api.customer.tranAepair, options, function () {
            app.showAlert(app.success, state.type === 'delive' ? '分配成功' : '转交成功');
            layer.close(state.tranIndex);
            state.tranIndex = null;
            query(state.page);
        });
    });
    $('#btnTranCancel').on('click', function () { layer.close(state.tranIndex); state.tranIndex = null; });

    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); form.render('select'); query(1); });
});
}); // end app.ready
