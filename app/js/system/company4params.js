/** app/js/system/company4params.js —— 公司级系统配置（目录+DB 合并管理）
 * 依赖 systemConfigCatalog.js 提供的 SYSTEM_CONFIG_CATALOG / SYSTEM_CONFIG_GROUPS
 * 流程：querySystemConfigByCid 取 DB 配置 → 与目录合并 → 表格展示（已配置/未配置）
 * 写：addSystemConfig / updateSystemConfig；删：deleteSystemConfig */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var CATALOG = window.SYSTEM_CONFIG_CATALOG || [];
    var GROUPS = window.SYSTEM_CONFIG_GROUPS || {};
    var state = { merged: [], filtered: [], page: 1, rows: 30, total: 0, editIndex: null, editing: null };

    initGroupSelects(); initTable(); loadConfigs();
    $('#btnAdd').on('click', function () { openEdit({ configured: false, custom: true }); });

    function initGroupSelects() {
        var keys = Object.keys(GROUPS).sort(function (a, b) { return (GROUPS[a].order || 99) - (GROUPS[b].order || 99); });
        var html = '<option value="">全部</option>';
        $.each(keys, function (i, k) { html += '<option value="' + k + '">' + GROUPS[k].name + '</option>'; });
        $('#groupSel').html(html);
        $('#editGroupSel').html('<option value="">请选择</option>' + html.replace('全部', '其他配置'));
        form.render('select');
    }

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { field: 'name', title: '配置项', minWidth: 180, templet: function (d) {
                        var h = '<b>' + (d.name || d.key) + '</b>';
                        if (d.type) h += ' <span class="layui-badge layui-bg-gray">' + d.type + '</span>';
                        if (!d.configured) h += ' <span class="layui-badge layui-bg-orange">未配置</span>';
                        return h;
                    } },
                { field: 'key', title: '键', width: 220, templet: function (d) { return '<code>' + d.key + '</code>'; } },
                { field: 'groupName', title: '分组', width: 130 },
                { field: 'valueDisplay', title: '当前值', minWidth: 200, templet: function (d) {
                        if (d.configured) return '<span style="color:#1E88E5;word-break:break-all;">' + escapeHtml(d.value || '(空)') + '</span>';
                        return '<span style="color:#999;">默认: ' + escapeHtml(d.defaultValue || '无') + '</span>';
                    } },
                { field: 'desc', title: '说明', minWidth: 200, templet: function (d) { return escapeHtml(d.desc || '-'); } },
                { title: '操作', width: 170, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) {
            if (obj.event === 'edit') openEdit(obj.data);
            else if (obj.event === 'set') openEdit(obj.data);
            else if (obj.event === 'del') delConfig(obj.data);
        });
    }

    function escapeHtml(t) {
        if (t == null) return '';
        return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    function loadConfigs() {
        app.post(api.system.querySystemConfigByCid, {}, function (res) {
            var dbMap = {};
            $.each(res.systemConfigs || [], function (i, c) { if (c.key) dbMap[c.key] = c; });
            var merged = [];
            $.each(CATALOG, function (i, meta) {
                var db = dbMap[meta.key];
                var item = $.extend({}, meta);
                item.groupName = (GROUPS[meta.group] && GROUPS[meta.group].name) || meta.group || '其他';
                if (db) { item.configured = true; item.value = db.value; item.comment = db.comment; item.scid = db.scid; }
                else { item.configured = false; }
                merged.push(item);
            });
            // DB 中不在目录的自定义项
            $.each(dbMap, function (key, db) {
                var inCatalog = false;
                for (var i = 0; i < CATALOG.length; i++) { if (CATALOG[i].key === key) { inCatalog = true; break; } }
                if (!inCatalog) {
                    merged.push({ key: key, group: db.group || 'default', groupName: (GROUPS[db.group] && GROUPS[db.group].name) || '其他',
                        name: db.comment || key, desc: '自定义配置项', type: 'string', defaultValue: '',
                        configured: true, value: db.value, comment: db.comment, scid: db.scid });
                }
            });
            state.merged = merged;
            applyFilter();
        });
    }

    function applyFilter() {
        var kw = $.trim($('#searchForm [name="keyword"]').val()).toLowerCase();
        var grp = $('#searchForm [name="group"]').val();
        var list = state.merged;
        if (grp) list = $.grep(list, function (c) { return c.group === grp; });
        if (kw) list = $.grep(list, function (c) {
            return (c.key && c.key.toLowerCase().indexOf(kw) >= 0) ||
                   (c.name && c.name.toLowerCase().indexOf(kw) >= 0) ||
                   (c.desc && c.desc.toLowerCase().indexOf(kw) >= 0) ||
                   (c.value && String(c.value).toLowerCase().indexOf(kw) >= 0);
        });
        state.filtered = list;
        state.total = list.length;
        renderPage();
        renderPageData();
    }

    function renderPageData() {
        var start = (state.page - 1) * state.rows;
        table.reload('resultTable', { data: state.filtered.slice(start, start + state.rows) });
    }

    function renderPage() {
        laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [30, 100, 200],
            layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (obj, first) {
                state.rows = obj.limit;
                if (!first) { state.page = obj.curr; renderPageData(); }
            } });
    }

    function openEdit(d) {
        app.clearValidator(); $('#editForm')[0].reset(); state.editing = d || { configured: false };
        var isCustom = !d || d.custom;
        if (d && d.configured) {
            $('#editForm [name="scid"]').val(d.scid);
            $('#editForm [name="group"]').val(d.group || '');
            $('#editForm [name="key"]').val(d.key).prop('disabled', true);
            $('#editForm [name="value"]').val(d.value || '');
            $('#editForm [name="comment"]').val(d.comment || '');
            $('#btnDel').show();
        } else {
            $('#editForm [name="group"]').val(d ? d.group : '');
            $('#editForm [name="key"]').val(d ? d.key : '').prop('disabled', !isCustom);
            $('#editForm [name="value"]').val(d ? (d.defaultValue || '') : '');
            $('#editForm [name="comment"]').val(d ? (d.desc || '') : '');
            $('#btnDel').hide();
        }
        form.render('select');
        state.editIndex = layer.open({ type: 1, title: (d && d.configured) ? '编辑配置' : '设置配置值', content: $('#editBox'), area: ['560px', 'auto'], cancel: function () { app.clearValidator(); } });
    }

    function doSave() {
        if (app.validate('editForm')) return;
        var d = state.editing || {};
        var opt = {
            'systemConfig.group': $('#editForm [name="group"]').val(),
            'systemConfig.key': $('#editForm [name="key"]').val(),
            'systemConfig.value': $('#editForm [name="value"]').val(),
            'systemConfig.comment': $('#editForm [name="comment"]').val()
        };
        var apiDef;
        if (d.configured && d.scid) { opt['systemConfig.scid'] = d.scid; apiDef = api.system.updateSystemConfig; }
        else { apiDef = api.system.addSystemConfig; }
        app.post(apiDef, opt, function () {
            app.showAlert(app.success, '保存成功');
            layer.close(state.editIndex); state.editIndex = null; loadConfigs();
        });
    }

    function delConfig(d) {
        app.showConfirm('确定删除配置项「' + d.key + '」？删除后将恢复为默认值。', function () {
            app.post(api.system.deleteSystemConfig, { 'systemConfig.scid': d.scid }, function () {
                app.showAlert(app.success, '已删除'); loadConfigs();
            });
        });
    }

    $('#btnSearch').on('click', function () { state.page = 1; applyFilter(); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); form.render('select'); state.page = 1; applyFilter(); });
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
    $('#btnDel').on('click', function () { if (state.editing && state.editing.scid) { var k = state.editing.key; layer.close(state.editIndex); state.editIndex = null;
        app.showConfirm('确定删除配置项「' + k + '」？', function () { app.post(api.system.deleteSystemConfig, { 'systemConfig.scid': state.editing ? state.editing.scid : null }, function () { app.showAlert(app.success, '已删除'); loadConfigs(); }); }); } });
});
}); // end app.ready
