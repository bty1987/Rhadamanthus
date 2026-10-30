/** app/js/construction/qualiter4detail.js —— 质检员管理（工程单下的质检人员 CRUD）
 *  上下文：app.params.construction = { orderId }。addQualiter（schedule=0/rate=0）/ deleteQualiter。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    constructionCommon.ensureApiStubs();
    var E = constructionCommon.ENUM;
    var pageConfig = constructionCommon.getPageConfig('qualiter4detail');
    var ctx = app.params.construction || {};
    var state = { page: 1, rows: 10, total: 0, cid: null };

    $('#orderIdLabel').text(ctx.orderId || '-');

    if (!ctx.orderId) { app.showAlert(app.warning, '缺少订单上下文'); return; }

    app.post(api.construction.queryConstructionByOrderId, { 'construction.orderId': ctx.orderId }, function (res) {
        state.cid = res.construction ? res.construction.cid : null;
    });

    function btnVisible(key) { return pageConfig.pageBtn.length == 0 || pageConfig.pageBtn.indexOf(key) != -1; }

    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 60 },
            { field: 'orderId', title: '装修单', width: 130, templet: function (d) { return d.decoration ? d.decoration.orderId : ''; } },
            { field: 'user', title: '质检员', width: 130, templet: function (d) { return d.user ? d.user.currentName : ''; } },
            { field: 'creater', title: '创建人', width: 120, templet: function (d) { return d.creater ? d.creater.currentName : ''; } },
            { field: 'createTime', title: '创建时间', width: 170 },
            { field: 'status', title: '状态', width: 100, templet: function (d) { return constructionCommon.badge(E.qualiterStatus, d.status); } },
            { title: '操作', width: 120, toolbar: '#rowToolbar' } ]] });

    // 人员下拉（全部在职人员）
    app.post(api.personel.queryUserByPinyin, { 'departmentType.name': '', 'user.status': 0 }, function (res) {
        var html = '<option value="">请选择人员</option>';
        $.each(res.autoFillKeyValue || [], function (i, u) { html += '<option value="' + u.key + '">' + u.value + '<\/option>'; });
        $('#user').html(html);
        form.render('select');
    }, null, false);

    $('#qualiterBtn').on('click', function () {
        if (!btnVisible('add')) { app.showAlert(app.warning, '无操作权限'); return; }
        $('#user').val('');
        form.render('select');
        layer.open({ type: 1, title: '添加质检员 - ' + ctx.orderId, content: $('#qualiterBox'), area: ['440px', 'auto'],
            btn: ['保存', '取消'], yes: function (idx) {
                var userId = $('#user').val();
                if (!userId) { app.showAlert(app.warning, '请选择人员'); return; }
                app.post(api.construction.addQualiter, {
                    'qualiter.decoration.orderId': ctx.orderId,
                    'qualiter.cid': state.cid,
                    'qualiter.schedule': 0,
                    'qualiter.rate': 0,
                    'qualiter.user.userId': userId
                }, function () {
                    app.showAlert(app.success, '操作成功');
                    layer.close(idx); query(state.page);
                });
            } });
    });

    table.on('tool(resultTable)', function (obj) {
        if (obj.event === 'del') {
            if (!btnVisible('del')) return;
            var v = obj.data;
            app.post(api.construction.deleteQualiter, { 'qualiter.qid': v.qid }, function () {
                app.showAlert(app.success, '删除成功');
                query(state.page);
            });
        }
    });

    function query(pg) {
        state.page = pg || 1;
        app.post(api.construction.queryQualiter, $.extend({ 'qualiter.decoration.orderId': ctx.orderId, 'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
            var p = res.paging || {};
            table.reload('resultTable', { data: p.data || [] });
            state.total = p.totalRecords || 0; rpg();
        });
    }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }

    query(1);
});
}); // end app.ready
