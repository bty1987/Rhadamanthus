/** app/js/construction/customer4feedback.js —— 客服回访（订单维度 CRUD）
 *  上下文：app.params.construction = { orderId, orderAddr, customerName }。
 *  pageCustomerServiceBackVisit / add / update / delete。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'laydate', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, laydate = layui.laydate, layer = layui.layer, $ = layui.jquery;
    constructionCommon.ensureApiStubs();
    var E = constructionCommon.ENUM;
    var pageConfig = constructionCommon.getPageConfig('customer4feedback');
    var ctx = app.params.construction || {};
    var state = { page: 1, rows: 10, total: 0, editFlag: false, csbvId: null };

    function btnVisible(key) { return pageConfig.pageBtn.length == 0 || pageConfig.pageBtn.indexOf(key) != -1; }
    laydate.render({ elem: '#backVisitTime', format: 'yyyy-MM-dd' });

    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 60 },
            { field: 'orderAddr', title: '楼盘地址', width: 260 },
            { field: 'customerName', title: '客户名', width: 110 },
            { field: 'backVisitTime', title: '时间', width: 120 },
            { field: 'backVisitType', title: '类型', width: 90, templet: function (d) { return constructionCommon.badge(E.backVisitType, d.backVisitType); } },
            { field: 'backVisitDes', title: '备注', minWidth: 220 },
            { title: '操作', width: 140, toolbar: '#rowToolbar' } ]] });

    table.on('tool(resultTable)', function (obj) {
        var v = obj.data;
        if (obj.event === 'edit') {
            if (!btnVisible('edit')) return;
            state.editFlag = true;
            state.csbvId = v.csbvId;
            $('#orderId').val(ctx.orderId);
            $('#orderAddr').val(ctx.orderAddr || v.orderAddr);
            $('#customerName').val(ctx.customerName || v.customerName);
            $('#backVisitTime').val((v.backVisitTime || '').substring(0, 10));
            $('#backVisitType').val(v.backVisitType != null ? v.backVisitType : 0);
            $('#backVisitDes').val(v.backVisitDes || '');
            form.render('select');
            openBox('编辑回访');
        } else if (obj.event === 'del') {
            if (!btnVisible('del')) return;
            app.showConfirm('确认删除吗?', function () {
                app.post(api.construction.deleteCustomerServiceBackVisit, { 'csbvIds[0]': v.csbvId }, function () { query(state.page); });
            });
        }
    });

    $('#btnAdd').on('click', function () {
        state.editFlag = false;
        state.csbvId = null;
        $('#backVisitForm')[0].reset();
        $('#orderId').val(ctx.orderId).prop('disabled', true);
        $('#orderAddr').val(ctx.orderAddr).prop('disabled', true);
        $('#customerName').val(ctx.customerName).prop('disabled', true);
        form.render('select');
        openBox('添加回访');
    });

    function openBox(title) {
        layer.open({ type: 1, title: title, content: $('#backVisitBox'), area: ['560px', 'auto'],
            btn: ['保存', '取消'], yes: function (idx) { saveData(idx); } });
    }

    function saveData(idx) {
        var options = {
            'customerServiceBackVisit.orderId': $('#orderId').val(),
            'customerServiceBackVisit.orderAddr': $('#orderAddr').val(),
            'customerServiceBackVisit.customerName': $('#customerName').val(),
            'customerServiceBackVisit.backVisitTime': $('#backVisitTime').val(),
            'customerServiceBackVisit.backVisitType': $('#backVisitType').val(),
            'customerServiceBackVisit.backVisitDes': $('#backVisitDes').val()
        };
        if (!options['customerServiceBackVisit.backVisitTime']) { app.showAlert(app.warning, '请填写回访时间'); return; }
        if (state.editFlag) {
            options['customerServiceBackVisit.csbvId'] = state.csbvId;
            app.post(api.construction.updateCustomerServiceBackVisit, options, function () { layer.close(idx); query(state.page); });
        } else {
            app.post(api.construction.addCustomerServiceBackVisit, options, function () { layer.close(idx); query(state.page); });
        }
    }

    function query(pg) {
        state.page = pg || 1;
        app.post(api.construction.pageCustomerServiceBackVisit, $.extend({ 'customerServiceBackVisit.orderId': ctx.orderId, 'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
            var p = res.paging || {};
            table.reload('resultTable', { data: p.data || [] });
            state.total = p.totalRecords || 0; rpg();
        });
    }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }

    query(1);
});
}); // end app.ready
