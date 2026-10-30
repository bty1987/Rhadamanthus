/** app/js/system/module.js —— 模块管理（CRUD + 删除 + 上级模块/等级联动）
 * 字段：name/alias/code(module)/icon/url/level/fatherModule/order
 * 上级模块按 level-1 过滤候选，用 searchable select 替代旧 typeahead
 * system 取 app.config.system（菜单业务系统标识） */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, editIndex: null, editId: null, modules: [] };

    loadModules(); initTable(); query(1);

    function loadModules() {
        app.post(api.system.queryModule, { 'module.system': app.config.system }, function (res) {
            state.modules = res.modules || [];
        }, null, false);
    }

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 },
                { field: 'level', title: '等级', width: 80 },
                { field: 'name', title: '名称', minWidth: 140 },
                { field: 'module', title: '代码', width: 140 },
                { field: 'icon', title: '图标', width: 140 },
                { field: 'url', title: '链接', minWidth: 180, templet: function (d) { return d.url ? d.url : '---'; } },
                { field: 'fatherModule', title: '上级', width: 140, templet: function (d) { return d.fatherModule ? d.fatherModule.name : '---'; } },
                { field: 'order', title: '排序', width: 80 },
                { title: '操作', width: 160, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) { if (obj.event === 'edit') openEdit(obj.data); else if (obj.event === 'del') doDelete(obj.data); });
    }

    function buildFilters() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (v === '' || v == null) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(page) { state.page = page || 1; app.post(api.system.pageModule, $.extend({}, buildFilters(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) { var pg = res.paging || {}; table.reload('resultTable', { data: pg.data || [] }); state.total = pg.totalRecords || 0; renderPage(); }); }
    function renderPage() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (obj, first) { state.rows = obj.limit; if (!first) query(obj.curr); } }); }

    function refreshFatherSelect(level, selectedMid) {
        var fatherLevel = level - 1;
        var html = '<option value="">无</option>';
        if (fatherLevel >= 1) {
            $.each(state.modules, function (i, m) {
                if (m.level == fatherLevel) html += '<option value="' + m.mid + '">' + m.name + '</option>';
            });
        }
        $('#fatherModuleSel').html(html);
        if (selectedMid) $('#fatherModuleSel').val(selectedMid);
        form.render('select');
        // 一级无上级，置灰
        if (level == 1) $('#fatherModuleSel').prop('disabled', true);
        else $('#fatherModuleSel').prop('disabled', false);
        form.render('select');
    }

    form.on('select(levelSel)', function (data) {
        refreshFatherSelect(parseInt(data.value, 10) || 1, null);
    });

    function openEdit(d) {
        app.clearValidator(); $('#editForm')[0].reset(); state.editId = null;
        if (d) {
            state.editId = d.mid;
            $('#editForm [name="mid"]').val(d.mid);
            $('#editForm [name="name"]').val(d.name);
            $('#editForm [name="alias"]').val(d.alias);
            $('#editForm [name="code"]').val(d.module);
            $('#editForm [name="icon"]').val(d.icon);
            $('#editForm [name="url"]').val(d.url);
            $('#editForm [name="level"]').val(d.level);
            $('#editForm [name="order"]').val(d.order);
            refreshFatherSelect(d.level, d.fatherModule ? d.fatherModule.mid : null);
        } else {
            refreshFatherSelect(1, null);
        }
        form.render('select');
        state.editIndex = layer.open({ type: 1, title: d ? '编辑模块' : '添加模块', content: $('#editBox'), area: ['560px', 'auto'], cancel: function () { app.clearValidator(); } });
    }

    function doSave() {
        if (app.validate('editForm')) return;
        var opt = {
            'module.name': $('#editForm [name="name"]').val(),
            'module.alias': $('#editForm [name="alias"]').val() || $('#editForm [name="name"]').val(),
            'module.module': $('#editForm [name="code"]').val(),
            'module.icon': $('#editForm [name="icon"]').val(),
            'module.url': $('#editForm [name="url"]').val(),
            'module.level': $('#editForm [name="level"]').val(),
            'module.fatherModule.mid': $('#editForm [name="fatherModuleMid"]').val(),
            'module.system': app.config.system,
            'module.order': $('#editForm [name="order"]').val()
        };
        var apiDef;
        if (state.editId) { opt['module.mid'] = state.editId; apiDef = api.system.updateModule; }
        else { apiDef = api.system.addModule; }
        app.post(apiDef, opt, function () {
            // 保存后刷新上级模块缓存，便于下次编辑
            loadModules();
            app.showAlert(app.success, '保存成功');
            layer.close(state.editIndex); state.editIndex = null; query(state.page);
        });
    }

    function doDelete(d) {
        app.showConfirm('是否确定删除', function () {
            app.post(api.system.deleteModule, { 'module.mid': d.mid }, function () {
                app.showAlert(app.success, '已删除'); loadModules(); query(state.page);
            });
        });
    }

    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); form.render('select'); query(1); });
    $('#btnAdd').on('click', function () { openEdit(null); });
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
