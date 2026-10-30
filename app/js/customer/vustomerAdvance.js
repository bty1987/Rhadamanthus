/** app/js/customer/vustomerAdvance.js —— 预进客户（旧 vustomerAdvance.js → layui）
 *  列表：pageVustomerForAdvance（name eq），列含归属人。
 *  行操作：绑定装修单号 updateVustomer；记录（弹 vrecord）；积分（弹 vscoreRecord id=1）；
 *  归属（人员选择 → updateVustomerForBelonger）。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var E = customerCommon.ENUM;
    customerCommon.ensureApiStubs();
    var state = { page: 1, rows: 10, total: 0, vid: null, belongerUid: null, bindIndex: null, belongerIndex: null };

    table.render({
        elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[
            { type: 'numbers', title: '#', width: 60 },
            { field: 'phone', title: '电话', width: 130 },
            { field: 'name', title: '客户名称', minWidth: 110 },
            { field: 'address', title: '客户地址', minWidth: 160 },
            { field: 'orderId', title: '装修单号', width: 120 },
            { field: 'belonger', title: '归属人', width: 100, templet: function (d) { return d.belonger ? (d.belonger.userName || '') : ''; } },
            { field: 'referrer', title: '推荐人', width: 100 },
            { field: 'referphone', title: '推荐人电话', width: 120 },
            { field: 'createTime', title: '创建时间', width: 170 },
            { field: 'contractPrice', title: '合同额', width: 110, align: 'right', templet: function (d) { return app.formatMoney(d.contractPrice); } },
            { field: 'status', title: '状态', width: 80, templet: function (d) { return customerCommon.badge(E.vustomerStatus, d.status); } },
            { field: 'comment', title: '说明', minWidth: 130 },
            { title: '操作', width: 230, fixed: 'right', toolbar: '#rowToolbar' }
        ]]
    });
    table.on('tool(resultTable)', function (obj) {
        var v = obj.data;
        if (obj.event === 'bind') {
            state.vid = v.vid;
            $('#bindOrderForm')[0].reset();
            app.clearValidator();
            if (v.orderId != null) {
                $('#bindOrderForm [name="orderId"]').val(v.orderId).attr('readonly', 'readonly');
            } else {
                $('#bindOrderForm [name="orderId"]').removeAttr('readonly');
            }
            state.bindIndex = layer.open({ type: 1, title: '绑定装修单号', content: $('#bindOrderBox'), area: ['460px', 'auto'] });
        } else if (obj.event === 'record') {
            app.params.customer = $.extend({}, app.params.customer, { vid: v.vid });
            app.popup(api.index.vrecordIndex.url, '记录');
        } else if (obj.event === 'score') {
            app.params.customer = $.extend({}, app.params.customer, { unionId: v.unionId, id: 1 });
            app.popup(api.index.vscoreRecordIndex.url, '积分');
        } else if (obj.event === 'belonger') {
            state.vid = v.vid;
            state.belongerUid = v.belonger ? v.belonger.uid : '';
            $('#belongerName').val(v.belonger ? (v.belonger.userName || '') : '');
            state.belongerIndex = layer.open({ type: 1, title: '修改归属人', content: $('#belongerBox'), area: ['520px', 'auto'] });
        }
    });
    if (!$('#rowToolbar').length) {
        $('body').append(
            '<script type="text/html" id="rowToolbar">'
            + '<button class="layui-btn layui-btn-xs layui-btn-warm" lay-event="bind">绑定</button>'
            + '<button class="layui-btn layui-btn-xs" lay-event="record">记录</button>'
            + '<button class="layui-btn layui-btn-xs layui-btn-normal" lay-event="score">积分</button>'
            + '<button class="layui-btn layui-btn-xs layui-btn-disabled" lay-event="belonger">归属</button>'
            + '<\/script>'
        );
    }

    function query(pg) {
        state.page = pg || 1;
        app.post(api.customer.pageVustomerForAdvance, $.extend({}, customerCommon.buildFilters($('#searchForm')), {
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

    // —— 绑定装修单号 ——
    $('#btnBindSave').on('click', function () {
        if (app.validate('bindOrderForm')) return;
        app.post(api.customer.updateVustomer, {
            'vustomer.vid': state.vid,
            'vustomer.orderId': $('#bindOrderForm [name="orderId"]').val()
        }, function () {
            app.showAlert(app.success, '绑定装修单号成功');
            layer.close(state.bindIndex);
            query(state.page);
        });
    });
    $('#btnBindCancel').on('click', function () { layer.close(state.bindIndex); });

    // —— 修改归属人 ——
    $('#btnPickBelonger').on('click', function () {
        customerCommon.userPicker(function (u) {
            state.belongerUid = u.userId;
            $('#belongerName').val(u.currentName);
        });
    });
    $('#btnBelongerSave').on('click', function () {
        if (app.validate('belongerForm')) return;
        if (!state.belongerUid) { app.showAlert(app.warning, '请选择归属人'); return; }
        app.post(api.customer.updateVustomerForBelonger, {
            'vustomer.vid': state.vid,
            'vustomer.belonger.uid': state.belongerUid
        }, function () {
            app.showAlert(app.success, '修改成功');
            layer.close(state.belongerIndex);
            query(state.page);
        });
    });
    $('#btnBelongerCancel').on('click', function () { layer.close(state.belongerIndex); });

    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); form.render('select'); query(1); });
});
}); // end app.ready
