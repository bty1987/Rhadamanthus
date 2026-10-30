/** app/js/construction/customer4complaint.js —— 客服投诉（订单维度 CRUD + 处理）
 *  上下文：app.params.construction = { orderId, customerName }。
 *  pageCustomerServiceComplaint / add / update / handle / delete（已处理不可删）。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'laydate', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, laydate = layui.laydate, layer = layui.layer, $ = layui.jquery;
    constructionCommon.ensureApiStubs();
    var E = constructionCommon.ENUM;
    var pageConfig = constructionCommon.getPageConfig('customer4complaint');
    var ctx = app.params.construction || {};
    var state = { page: 1, rows: 10, total: 0, editFlag: false, cscId: null, complaintStatus: null };

    function btnVisible(key) { return pageConfig.pageBtn.length == 0 || pageConfig.pageBtn.indexOf(key) != -1; }
    laydate.render({ elem: '#complaintTime', format: 'yyyy-MM-dd' });

    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 60 },
            { field: 'customerName', title: '客户名', width: 100 },
            { field: 'createrName', title: '创建人', width: 100 },
            { field: 'operaterName', title: '操作人', width: 100 },
            { field: 'level', title: '等级', width: 80, templet: function (d) { return constructionCommon.badge(E.complaintLevel, d.level); } },
            { field: 'type', title: '类型', width: 80, templet: function (d) { return constructionCommon.badge(E.complaintType, d.type); } },
            { field: 'createTime', title: '时间', width: 120 },
            { field: 'des', title: '备注', minWidth: 180 },
            { field: 'status', title: '状态', width: 90, templet: function (d) { return constructionCommon.badge(E.complaintStatus, d.complaintStatus != null ? d.complaintStatus : d.status); } },
            { field: 'handle', title: '处理信息', minWidth: 160 },
            { title: '操作', width: 150, toolbar: '#rowToolbar' } ]] });

    // 动态行按钮（处理 / 删除——已处理不可删）
    table.on('tool(resultTable)', function (obj) {
        var v = obj.data;
        var status = v.complaintStatus != null ? v.complaintStatus : v.status;
        if (obj.event === 'edit') {
            if (!btnVisible('edit')) return;
            dialogHandle(v);
        } else if (obj.event === 'del') {
            if (!btnVisible('del') || status == 1) return;
            app.showConfirm('确认删除投诉吗?', function () {
                app.post(api.construction.deleteCustomerServiceComplaint, { 'cscIds[0]': v.cscId }, function () { query(state.page); });
            });
        }
    });
    function renderToolbar(status) {
        var html = '';
        if (btnVisible('edit')) html += '<button class="layui-btn layui-btn-xs" lay-event="edit">处理<\/button>';
        if (btnVisible('del') && status != 1) html += '<button class="layui-btn layui-btn-xs layui-btn-danger" lay-event="del">删除<\/button>';
        $('#rowToolbar').html(html);
    }

    $('#btnAdd').on('click', function () {
        state.editFlag = false;
        state.cscId = null;
        $('#complaintForm')[0].reset();
        $('#orderId').val(ctx.orderId).prop('disabled', true);
        $('#customerName').val(ctx.customerName).prop('disabled', true);
        form.render('select');
        layer.open({ type: 1, title: '添加投诉', content: $('#complaintBox'), area: ['540px', 'auto'],
            btn: ['保存', '取消'], yes: function (idx) { saveData(idx); } });
    });

    function saveData(idx) {
        var options = {
            'customerServiceComplaint.orderId': $('#orderId').val(),
            'customerServiceComplaint.customerName': $('#customerName').val(),
            'customerServiceComplaint.level': $('#complaintLevel').val(),
            'customerServiceComplaint.createTime': $('#complaintTime').val(),
            'customerServiceComplaint.des': $('#complaintDes').val(),
            'customerServiceComplaint.type': $('#complaintType').val()
        };
        if (!options['customerServiceComplaint.createTime']) { app.showAlert(app.warning, '请填写投诉时间'); return; }
        if (state.editFlag) {
            options['customerServiceComplaint.cscId'] = state.cscId;
            app.post(api.construction.updateCustomerServiceComplaint, options, function () { layer.close(idx); query(state.page); });
        } else {
            app.post(api.construction.addCustomerServiceComplaint, options, function () { layer.close(idx); query(state.page); });
        }
    }

    function dialogHandle(v) {
        state.cscId = v.cscId;
        state.complaintStatus = v.complaintStatus != null ? v.complaintStatus : v.status;
        $('#handleOrderId').val(v.orderId);
        $('#handleCustomerName').val(v.customerName);
        $('#handleComplaintLevel').val(E.complaintLevel[v.level] != null ? E.complaintLevel[v.level] : v.level);
        $('#handleComplaintType').val(E.complaintType[v.type] != null ? E.complaintType[v.type] : v.type);
        $('#complaintHandleDes').val(v.handle || '').prop('disabled', state.complaintStatus == 1);
        layer.open({ type: 1, title: '处理投诉 - ' + v.orderId, content: $('#complaintHandleBox'), area: ['540px', 'auto'],
            btn: ['保存', '取消'], yes: function (idx) {
                if (state.complaintStatus == 1) { layer.close(idx); return; }
                app.post(api.construction.handleCustomerServiceComplaint, {
                    'customerServiceComplaint.cscId': state.cscId,
                    'customerServiceComplaint.handle': $('#complaintHandleDes').val()
                }, function () {
                    app.showAlert(app.success, '处理成功');
                    layer.close(idx); query(state.page);
                });
            } });
    }

    function query(pg) {
        state.page = pg || 1;
        app.post(api.construction.pageCustomerServiceComplaint, $.extend({ 'customerServiceComplaint.orderId': ctx.orderId, 'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
            var p = res.paging || {};
            var data = p.data || [];
            renderToolbar(data.length && (data[0].complaintStatus != null ? data[0].complaintStatus : data[0].status));
            table.reload('resultTable', { data: data });
            state.total = p.totalRecords || 0; rpg();
        });
    }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }

    query(1);
});
}); // end app.ready
