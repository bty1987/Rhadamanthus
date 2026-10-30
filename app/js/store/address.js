/**
 * app/js/store/address.js —— 收货地址（CRUD + 启用/禁用）
 * 字段：name phone province proper city address status uid aid
 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table;
    var laypage = layui.laypage;
    var form = layui.form;
    var layer = layui.layer;
    var $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, editIndex: null, editAid: null };

    initTable();
    query(1);

    function initTable() {
        table.render({
            elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[
                { type: 'numbers', title: '#', width: 60 },
                { field: 'name', title: '收货人', width: 110 },
                { field: 'phone', title: '手机号', width: 130 },
                { field: 'province', title: '省', width: 90 },
                { field: 'proper', title: '市', width: 90 },
                { field: 'city', title: '区', width: 100 },
                { field: 'address', title: '详细地址', minWidth: 200 },
                {
                    field: 'status', title: '状态', width: 90,
                    templet: function (d) {
                        return d.status == 0
                            ? '<span class="layui-badge layui-bg-green">启用</span>'
                            : '<span class="layui-badge layui-bg-gray">禁用</span>';
                    }
                },
                { title: '操作', width: 240, toolbar: '#rowToolbar' }
                ]]
        });
        table.on('tool(resultTable)', function (obj) {
            var d = obj.data;
            if (obj.event === 'edit') openEdit(d);
            else if (obj.event === 'enable') updateStatus(d.aid, 0);
            else if (obj.event === 'disable') updateStatus(d.aid, 1);
        });
    }

    function buildFilters() {
        var p = {}, c = 0;
        $('#searchForm [name]').each(function () {
            var v = $.trim($(this).val());
            if (!v) return;
            p['filters[' + c + '].field'] = $(this).attr('name');
            p['filters[' + c + '].data'] = v;
            p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn';
            c++;
        });
        return p;
    }

    function query(page) {
        state.page = page || 1;
        app.post(api.store.pageAddress, $.extend({}, buildFilters(), {
            'paging.page': state.page, 'paging.rows': state.rows
        }), function (res) {
            var pg = res.paging || {};
            table.reload('resultTable', { data: pg.data || [] });
            state.total = pg.totalRecords || 0;
            renderPage();
        });
    }

    function renderPage() {
        laypage.render({
            elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows,
            limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
            jump: function (obj, first) { state.rows = obj.limit; if (!first) query(obj.curr); }
        });
    }

    function openEdit(d) {
        app.clearValidator();
        $('#editForm')[0].reset();
        state.editAid = null;
        if (d) {
            state.editAid = d.aid;
            $('#editForm [name="aid"]').val(d.aid);
            $('#editForm [name="name"]').val(d.name);
            $('#editForm [name="phone"]').val(d.phone);
            $('#editForm [name="province"]').val(d.province || '');
            $('#editForm [name="proper"]').val(d.proper || '');
            $('#editForm [name="city"]').val(d.city || '');
            $('#editForm [name="address"]').val(d.address);
            if (d.uid) $('#editForm [name="uid"]').val(d.uid);
        }
        state.editIndex = layer.open({
            type: 1, title: d ? '编辑地址' : '添加地址', content: $('#editBox'), area: ['520px', 'auto'],
            cancel: function () { app.clearValidator(); }
        });
    }

    function doSave() {
        if (app.validate('editForm')) return;
        var opt = {
            'address.name': $('#editForm [name="name"]').val(),
            'address.phone': $('#editForm [name="phone"]').val(),
            'address.province': $('#editForm [name="province"]').val(),
            'address.proper': $('#editForm [name="proper"]').val(),
            'address.city': $('#editForm [name="city"]').val(),
            'address.address': $('#editForm [name="address"]').val(),
            'address.uid': $('#editForm [name="uid"]').val()
        };
        var apiDef;
        if (state.editAid) { opt['address.aid'] = state.editAid; apiDef = api.store.updateAddress; }
        else { apiDef = api.store.addAddress; }
        app.post(apiDef, opt, function () {
            app.showAlert(app.success, '保存成功');
            layer.close(state.editIndex); state.editIndex = null;
            query(state.page);
        });
    }

    function updateStatus(aid, status) {
        app.post(api.store.updateAddressForStatus, { 'address.aid': aid, 'address.status': status }, function () {
            app.showAlert(app.success, status == 0 ? '已启用' : '已禁用');
            query(state.page);
        });
    }

    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); query(1); });
    $('#btnAdd').on('click', function () { openEdit(null); });
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
