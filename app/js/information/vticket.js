/** app/js/information/vticket.js —— 活动票（列表 + 添加/编辑）*/
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, editIndex: null, editId: null };

    function regB(d) { return '<span class="layui-badge ' + (d.isregist == 0 ? 'layui-bg-gray' : 'layui-bg-green') + '">' + (d.isregist == 0 ? '未注册' : '已注册') + '<\/span>'; }
    function comeB(d) { return '<span class="layui-badge ' + (d.iscome == 0 ? 'layui-bg-gray' : 'layui-bg-green') + '">' + (d.iscome == 0 ? '未到场' : '已到场') + '<\/span>'; }

    loadVactivity();
    initTable(); query(1);
    function loadVactivity() {
        app.post(api.information.queryVactivity, {}, function (res) {
            var html = '<option value="">请选择活动</option>';
            $.each(res.vactivitys || [], function (i, v) { html += '<option value="' + v.vaid + '">' + v.name + '</option>'; });
            $('#vaid').html(html); form.render('select');
        }, null, false);
    }
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 },
                { field: 'tno', title: '票号', width: 130 },
                { field: 'name', title: '姓名', width: 110 },
                { field: 'phone', title: '电话', width: 130 },
                { field: 'address', title: '地址', minWidth: 160 },
                { field: 'orderId', title: '装修单号', width: 140 },
                { field: 'belonger', title: '归属人', width: 110, templet: function (d) { return d.belonger ? d.belonger.userName : ''; } },
                { field: 'department', title: '归属部门', width: 120, templet: function (d) { return d.department ? d.department.name : ''; } },
                { field: 'creater', title: '创建人', width: 110, templet: function (d) { return d.creater ? d.creater.userName : ''; } },
                { field: 'createTime', title: '创建时间', width: 160 },
                { field: 'isregist', title: '注册', width: 90, templet: regB },
                { field: 'iscome', title: '到场', width: 90, templet: comeB },
                { title: '操作', width: 110, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) { if (obj.event === 'edit') openEdit(obj.data); });
    }
    function buildFilters() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(page) { state.page = page || 1; app.post(api.information.pageVticket, $.extend({}, buildFilters(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) { var pg = res.paging || {}; table.reload('resultTable', { data: pg.data || [] }); state.total = pg.totalRecords || 0; renderPage(); }); }
    function renderPage() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (obj, first) { state.rows = obj.limit; if (!first) query(obj.curr); } }); }
    function openEdit(d) {
        app.clearValidator(); $('#editForm')[0].reset(); state.editId = null;
        if (d) {
            state.editId = d.vtid;
            $('#editForm [name="vtid"]').val(d.vtid);
            $('#editForm [name="tno"]').val(d.tno).prop('readonly', true);
            $('#editForm [name="belongerUserId"]').val(d.belonger ? d.belonger.userId : '');
            $('#editForm [name="orderId"]').val(d.orderId);
            $('#editForm [name="name"]').val(d.name);
            $('#editForm [name="phone"]').val(d.phone);
            $('#editForm [name="address"]').val(d.address);
            if (d.vaid != null) $('#editForm [name="vaid"]').val(d.vaid);
            form.render('select');
        } else {
            $('#editForm [name="tno"]').prop('readonly', false);
            form.render('select');
        }
        state.editIndex = layer.open({ type: 1, title: d ? '编辑票' : '添加票', content: $('#editBox'), area: ['600px', 'auto'], cancel: function () { app.clearValidator(); } });
    }
    function doSave() {
        if (app.validate('editForm')) return;
        var opt = {
            'vticket.belonger.userId': $('#editForm [name="belongerUserId"]').val(),
            'vticket.orderId': $('#editForm [name="orderId"]').val(),
            'vticket.name': $('#editForm [name="name"]').val(),
            'vticket.phone': $('#editForm [name="phone"]').val(),
            'vticket.address': $('#editForm [name="address"]').val(),
            'vticket.vaid': $('#editForm [name="vaid"]').val()
        };
        if (state.editId) { opt['vticket.vtid'] = state.editId; app.post(api.information.updateVticket, opt, function () { app.showAlert(app.success, '保存成功'); layer.close(state.editIndex); state.editIndex = null; query(state.page); }); }
        else { opt['vticket.tno'] = $('#editForm [name="tno"]').val(); app.post(api.information.createVticket, opt, function () { app.showAlert(app.success, '保存成功'); layer.close(state.editIndex); state.editIndex = null; query(state.page); }); }
    }
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); form.render('select'); query(1); });
    $('#btnAdd').on('click', function () { openEdit(null); });
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
