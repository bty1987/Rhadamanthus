/**
 * app/js/store/mcategory.js —— 商城品类（纯 CRUD + 显示状态切换）
 * 列：name isShow(0首页显示/1首页不显示) icon
 * 操作：编辑、显示(isShow=0)、不显示(isShow=1)
 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table;
    var laypage = layui.laypage;
    var form = layui.form;
    var layer = layui.layer;
    var $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, editIndex: null, editCid: null };

    initTable();
    query(1);

    function initTable() {
        table.render({
            elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[
                { type: 'numbers', title: '#', width: 60 },
                { field: 'name', title: '品类', minWidth: 180 },
                {
                    field: 'isShow', title: '首页显示', width: 120,
                    templet: function (d) {
                        return d.isShow == 0
                            ? '<span class="layui-badge layui-bg-green">首页显示</span>'
                            : '<span class="layui-badge layui-bg-gray">首页不显示</span>';
                    }
                },
                { field: 'icon', title: '图标', width: 160 },
                { title: '操作', width: 260, toolbar: '#rowToolbar' }
                ]]
        });
        table.on('tool(resultTable)', function (obj) {
            var d = obj.data;
            if (obj.event === 'edit') openEdit(d);
            else if (obj.event === 'show') updateShow(d.cid, 0);
            else if (obj.event === 'hide') updateShow(d.cid, 1);
        });
    }

    function buildFilters() {
        var p = {}, c = 0;
        $('#searchForm [name]').each(function () {
            var v = $.trim($(this).val());
            if (!v) return;
            p['filters[' + c + '].field'] = 'name';
            p['filters[' + c + '].data'] = v;
            p['filters[' + c + '].op'] = 'cn';
            c++;
        });
        return p;
    }

    function query(page) {
        state.page = page || 1;
        app.post(api.store.pageMcategory, $.extend({}, buildFilters(), {
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
        state.editCid = null;
        if (d) {
            state.editCid = d.cid;
            $('#editForm [name="cid"]').val(d.cid);
            $('#editForm [name="name"]').val(d.name);
            $('#editForm [name="icon"]').val(d.icon || '');
        }
        state.editIndex = layer.open({
            type: 1, title: d ? '编辑品类' : '添加品类', content: $('#editBox'), area: ['520px', 'auto'],
            cancel: function () { app.clearValidator(); }
        });
    }

    function doSave() {
        if (app.validate('editForm')) return;
        var opt = {
            'mcategory.name': $('#editForm [name="name"]').val(),
            'mcategory.icon': $('#editForm [name="icon"]').val()
        };
        var apiDef;
        if (state.editCid) { opt['mcategory.cid'] = state.editCid; apiDef = api.store.updateMcategory; }
        else { apiDef = api.store.addMcategory; }
        app.post(apiDef, opt, function () {
            app.showAlert(app.success, '保存成功');
            layer.close(state.editIndex); state.editIndex = null;
            query(state.page);
        });
    }

    function updateShow(cid, isShow) {
        app.post(api.store.updateMcategoryForShow, { 'mcategory.cid': cid, 'mcategory.isShow': isShow }, function () {
            app.showAlert(app.success, isShow == 0 ? '已设为首页显示' : '已设为首页不显示');
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
