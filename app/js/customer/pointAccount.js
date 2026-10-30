/** app/js/customer/pointAccount.js —— 积分账户（旧 pointAccount.js → layui）
 *  列表：pagePointAccount（name eq，积分÷1000）→ 装修单号/客户信息/三类积分。
 *  创建：createPointAccount；行操作：操作积分（pointType=0 grantPoint / 1 consumePoint ×1000）；
 *  积分记录（弹 pointRecord，params.customer.accountId）。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    customerCommon.ensureApiStubs();
    var state = { page: 1, rows: 10, total: 0, createIndex: null, handleIndex: null, orderId: null };

    table.render({
        elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[
            { type: 'numbers', title: '#', width: 60 },
            { field: 'orderId', title: '装修单号', width: 120 },
            { field: 'customer', title: '客户', width: 110, templet: function (d) { return d.customer ? (d.customer.name || '') : ''; } },
            { field: 'customer', title: '性别', width: 70, templet: function (d) { return d.customer ? (d.customer.gender != null ? d.customer.gender : '') : ''; } },
            { field: 'customer', title: '身份证号', width: 170, templet: function (d) { return d.customer ? (d.customer.identity || '') : ''; } },
            { field: 'customer', title: '客户关系', width: 90, templet: function (d) { return d.customer ? (d.customer.relationshipType != null ? d.customer.relationshipType : '') : ''; } },
            { field: 'customer', title: '邮箱', width: 150, templet: function (d) { return d.customer ? (d.customer.email || '') : ''; } },
            { field: 'customer', title: 'QQ', width: 100, templet: function (d) { return d.customer ? (d.customer.qq || '') : ''; } },
            { field: 'wechat', title: '微信', width: 130 },
            { field: 'decorationPoint', title: '装修积分', width: 100, align: 'right' },
            { field: 'materialPoint', title: '主材积分', width: 100, align: 'right' },
            { field: 'operatePoint', title: '运营积分', width: 100, align: 'right' },
            { title: '操作', width: 170, fixed: 'right', toolbar: '#rowToolbar' }
        ]]
    });
    table.on('tool(resultTable)', function (obj) {
        var v = obj.data;
        if (obj.event === 'handle') {
            state.orderId = v.orderId;
            $('#handleForm')[0].reset();
            $('#handleForm [name="point"]').val(0);
            form.render('select');
            app.clearValidator();
            state.handleIndex = layer.open({ type: 1, title: '操作积分: ' + v.orderId, content: $('#handleBox'), area: ['420px', 'auto'] });
        } else if (obj.event === 'record') {
            app.params.customer = $.extend({}, app.params.customer, { accountId: v.accountId });
            app.popup(api.index.pointRecordIndex.url, '积分记录');
        }
    });
    if (!$('#rowToolbar').length) {
        $('body').append(
            '<script type="text/html" id="rowToolbar">'
            + '<button class="layui-btn layui-btn-xs layui-btn-warm" lay-event="handle">操作积分</button>'
            + '<button class="layui-btn layui-btn-xs layui-btn-normal" lay-event="record">积分记录</button>'
            + '<\/script>'
        );
    }

    function query(pg) {
        state.page = pg || 1;
        app.post(api.customer.pagePointAccount, $.extend({}, customerCommon.buildFilters($('#searchForm')), {
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

    // —— 创建积分账户 ——
    $('#btnCreate').on('click', function () {
        app.clearValidator();
        $('#createForm')[0].reset();
        state.createIndex = layer.open({ type: 1, title: '创建积分账户', content: $('#createBox'), area: ['420px', 'auto'] });
    });
    $('#btnCreateSave').on('click', function () {
        if (app.validate('createForm')) return;
        app.post(api.customer.createPointAccount, {
            'pointAccount.orderId': $('#createForm [name="orderId"]').val()
        }, function () {
            app.showAlert(app.success, '操作成功');
            layer.close(state.createIndex);
            state.createIndex = null;
            query(state.page);
        });
    });
    $('#btnCreateCancel').on('click', function () { layer.close(state.createIndex); state.createIndex = null; });

    // —— 操作积分 ——
    $('#btnHandleSave').on('click', function () {
        if (app.validate('handleForm')) return;
        var type = $('#handleForm [name="type"]').val();
        var pointType = $('#handleForm [name="pointType"]').val();
        var point = $('#handleForm [name="point"]').val();
        var options = { 'pointAccount.orderId': state.orderId };
        if (type == 0) options['pointAccount.decorationPoint'] = point;
        else if (type == 1) options['pointAccount.materialPoint'] = point;
        else options['pointAccount.operatePoint'] = point;
        app.post(pointType == 0 ? api.customer.grantPoint : api.customer.consumePoint, options, function () {
            app.showAlert(app.success, '操作成功');
            layer.close(state.handleIndex);
            state.handleIndex = null;
            query(state.page);
        });
    });
    $('#btnHandleCancel').on('click', function () { layer.close(state.handleIndex); state.handleIndex = null; });

    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); form.render('select'); query(1); });
});
}); // end app.ready
