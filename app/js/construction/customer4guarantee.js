/** app/js/construction/customer4guarantee.js —— 客服保修（订单维度 CRUD）
 *  上下文：app.params.construction = { orderId, customerName }。
 *  pageCustomerServiceGuarantee / add / update / delete。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'laydate', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, laydate = layui.laydate, layer = layui.layer, $ = layui.jquery;
    constructionCommon.ensureApiStubs();
    var pageConfig = constructionCommon.getPageConfig('customer4guarantee');
    var ctx = app.params.construction || {};
    var state = { page: 1, rows: 10, total: 0, editFlag: false, csgId: null };

    function btnVisible(key) { return pageConfig.pageBtn.length == 0 || pageConfig.pageBtn.indexOf(key) != -1; }
    laydate.render({ elem: '#guaranteeTime', format: 'yyyy-MM-dd' });

    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 60 },
            { field: 'customerName', title: '客户名', width: 120 },
            { field: 'guaranteeTime', title: '时间', width: 130 },
            { field: 'guaranteeDes', title: '备注', minWidth: 260 },
            { title: '操作', width: 140, toolbar: '#rowToolbar' } ]] });

    table.on('tool(resultTable)', function (obj) {
        var v = obj.data;
        if (obj.event === 'edit') {
            if (!btnVisible('edit')) return;
            state.editFlag = true;
            state.csgId = v.csgId;
            $('#orderId').val(v.orderId);
            $('#customerName').val(v.customerName);
            $('#guaranteeTime').val((v.guaranteeTime || '').substring(0, 10));
            $('#guaranteeDes').val(v.guaranteeDes || '');
            openBox('编辑保修');
        } else if (obj.event === 'del') {
            if (!btnVisible('del')) return;
            app.showConfirm('确认删除吗?', function () {
                app.post(api.construction.deleteCustomerServiceGuarantee, { 'csgIds[0]': v.csgId }, function () { query(state.page); });
            });
        }
    });

    $('#btnAdd').on('click', function () {
        state.editFlag = false;
        state.csgId = null;
        $('#guaranteeForm')[0].reset();
        $('#orderId').val(ctx.orderId).prop('disabled', true);
        $('#customerName').val(ctx.customerName).prop('disabled', true);
        openBox('添加保修');
    });

    function openBox(title) {
        layer.open({ type: 1, title: title, content: $('#guaranteeBox'), area: ['520px', 'auto'],
            btn: ['保存', '取消'], yes: function (idx) { saveData(idx); } });
    }

    function saveData(idx) {
        var options = {
            'customerServiceGuarantee.orderId': $('#orderId').val(),
            'customerServiceGuarantee.customerName': $('#customerName').val(),
            'customerServiceGuarantee.guaranteeTime': $('#guaranteeTime').val(),
            'customerServiceGuarantee.guaranteeDes': $('#guaranteeDes').val()
        };
        if (!options['customerServiceGuarantee.guaranteeTime']) { app.showAlert(app.warning, '请填写保修时间'); return; }
        if (state.editFlag) {
            options['customerServiceGuarantee.csgId'] = state.csgId;
            app.post(api.construction.updateCustomerServiceGuarantee, options, function () { layer.close(idx); query(state.page); });
        } else {
            app.post(api.construction.addCustomerServiceGuarantee, options, function () { layer.close(idx); query(state.page); });
        }
    }

    function query(pg) {
        state.page = pg || 1;
        app.post(api.construction.pageCustomerServiceGuarantee, $.extend({ 'customerServiceGuarantee.orderId': ctx.orderId, 'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
            var p = res.paging || {};
            table.reload('resultTable', { data: p.data || [] });
            state.total = p.totalRecords || 0; rpg();
        });
    }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }

    query(1);
});
}); // end app.ready
