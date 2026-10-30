/** app/js/system/role.js —— 角色管理（CRUD + 模块/操作权限配置）
 * 字段：no/name/content
 * 模块配置：queryModuleForLogin(取全部) + queryModuleByRid(回填) + updateRoleModuleByRid(保存)
 *   模块为树形（level1/2/3），有 url 的叶子带 权限/快捷/访问 三个复选框
 * 操作配置：queryOperationForSelf(全量) + queryOperationByRid(回填) + 实时 updateRoleOperation/deleteRoleOperation
 *   按 module 分组折叠展示，搜索过滤
 * 旧 advance 版的 复制/任务/图表/外链 等高级特性依赖多个其它模块 API，本批暂不迁移 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, editIndex: null, editId: null,
        currentRid: null, moduleIndex: null, opIndex: null, opData: null };

    initTable(); query(1);

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { field: 'no', title: '编号', width: 140 },
                { field: 'name', title: '角色名称', minWidth: 180 },
                { field: 'content', title: '描述', minWidth: 200 },
                { title: '操作', width: 360, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) {
            if (obj.event === 'edit') openEdit(obj.data);
            else if (obj.event === 'del') doDelete(obj.data);
            else if (obj.event === 'module') openModuleConfig(obj.data.rid);
            else if (obj.event === 'operation') openOperationConfig(obj.data.rid);
        });
    }

    function buildFilters() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(page) { state.page = page || 1; app.post(api.system.pageRole, $.extend({}, buildFilters(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) { var pg = res.paging || {}; table.reload('resultTable', { data: pg.data || [] }); state.total = pg.totalRecords || 0; renderPage(); }); }
    function renderPage() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (obj, first) { state.rows = obj.limit; if (!first) query(obj.curr); } }); }

    // ===== 角色 CRUD =====
    function openEdit(d) {
        app.clearValidator(); $('#editForm')[0].reset(); state.editId = null;
        if (d) {
            state.editId = d.rid;
            $('#editForm [name="rid"]').val(d.rid);
            $('#editForm [name="no"]').val(d.no).prop('disabled', true);
            $('#editForm [name="name"]').val(d.name);
            $('#editForm [name="content"]').val(d.content);
        } else {
            $('#editForm [name="no"]').prop('disabled', false);
        }
        state.editIndex = layer.open({ type: 1, title: d ? '编辑角色' : '添加角色', content: $('#editBox'), area: ['520px', 'auto'], cancel: function () { app.clearValidator(); } });
    }

    function doSave() {
        if (app.validate('editForm')) return;
        var opt = { 'role.name': $('#editForm [name="name"]').val(), 'role.content': $('#editForm [name="content"]').val(), 'role.no': $('#editForm [name="no"]').val() };
        var apiDef;
        if (state.editId) { opt['role.rid'] = state.editId; apiDef = api.system.updateRole; }
        else { apiDef = api.system.addRole; }
        app.post(apiDef, opt, function () {
            app.showAlert(app.success, '保存成功');
            layer.close(state.editIndex); state.editIndex = null; query(state.page);
        });
    }

    function doDelete(d) {
        app.showConfirm('是否确定删除该角色？', function () {
            app.post(api.system.deleteRoleByRid, { 'role.rid': d.rid }, function () {
                app.showAlert(app.success, '已删除'); query(state.page);
            });
        });
    }

    // ===== 模块配置 =====
    function openModuleConfig(rid) {
        state.currentRid = rid;
        $('#moduleTree').html('<div style="padding:30px;text-align:center;color:#999;">加载中...</div>');
        state.moduleIndex = layer.open({ type: 1, title: '模块配置', content: $('#moduleBox'), area: ['600px', '80%'] });
        // 加载全部模块（树形）+ 当前角色已选模块
        app.post(api.system.queryModuleForLogin, { 'module.system': 1 }, function (resAll) {
            renderModuleTree(resAll.modules || []);
            app.post(api.system.queryModuleByRid, { 'module.system': 1, 'role.rid': rid }, function (resRole) {
                var sel = {};
                $.each(resRole.modules || [], function (i, m) { sel[m.mid] = { link: m.link, access: m.access }; });
                // 回填勾选
                $('#moduleTree input[data-mid]').each(function () {
                    var mid = $(this).attr('data-mid');
                    var kind = $(this).attr('data-kind');
                    var s = sel[mid];
                    if (!s) return;
                    if (kind === 'module') $(this).prop('checked', true);
                    else if (kind === 'link' && s.link == 0) $(this).prop('checked', true);
                    else if (kind === 'access' && s.access == 0) $(this).prop('checked', true);
                });
            });
        });
    }

    function renderModuleTree(modules) {
        var $wrap = $('#moduleTree').empty();
        if (!modules.length) { $wrap.html('<div style="padding:30px;text-align:center;color:#999;">暂无模块数据</div>'); return; }
        var level1 = [], level2 = [], level3 = [];
        $.each(modules, function (i, v) {
            if (v.level == 1) level1.push(v); else if (v.level == 2) level2.push(v); else if (v.level == 3) level3.push(v);
        });
        var l2map = {}, l3map = {};
        $.each(level2, function (i, v) { l2map[v.mid] = { m: v, children: [] }; });
        $.each(level3, function (i, v) { if (v.fatherModule && l2map[v.fatherModule.mid]) l2map[v.fatherModule.mid].children.push(v); });
        var l1map = {};
        $.each(level1, function (i, v) { l1map[v.mid] = { m: v, children: [] }; });
        $.each(level2, function (i, v) { if (v.fatherModule && l1map[v.fatherModule.mid]) l1map[v.fatherModule.mid].children.push(l2map[v.mid]); });

        var mids = Object.keys(l1map).sort(function (a, b) { return a - b; });
        $.each(mids, function (i, k) { $wrap.append(renderModuleNode(l1map[k].m, l1map[k].children, 1)); });
    }

    function renderModuleNode(m, children, level) {
        var pad = (level - 1) * 20;
        var $row = $('<div style="padding:4px 0 4px ' + pad + 'px;border-bottom:1px solid #f0f0f0;"></div>');
        var label = (m.name || '') + (m.alias ? ' - ' + m.alias : '');
        var hasUrl = m.url && m.url !== '';
        $row.append(checkbox('module', m.mid, '权限'));
        if (hasUrl) { $row.append(checkbox('link', m.mid, '快捷')); $row.append(checkbox('access', m.mid, '访问')); }
        $row.append('<span style="margin-left:8px;">' + label + '</span>');
        if (children && children.length) {
            var $childBox = $('<div class="module-children" style="display:none;"></div>');
            $.each(children, function (i, c) {
                var sub = c.children || [];
                $childBox.append(renderModuleNode(c.m, sub, level + 1));
            });
            $row.append($childBox);
            // 展开/收起按钮
            var $toggle = $('<button type="button" class="layui-btn layui-btn-xs layui-btn-primary" style="margin-left:8px;">展开</button>');
            $toggle.on('click', function () {
                if ($childBox.is(':hidden')) { $childBox.show(); $toggle.text('收起'); } else { $childBox.hide(); $toggle.text('展开'); }
            });
            $row.append($toggle);
        }
        return $row;
    }

    function checkbox(kind, mid, label) {
        return '<label style="margin-right:8px;display:inline-block;min-width:48px;"><input type="checkbox" data-kind="' + kind + '" data-mid="' + mid + '"><span style="margin-left:2px;">' + label + '</span></label>';
    }

    function saveModule() {
        var params = { 'module.system': 1, 'role.rid': state.currentRid };
        // 收集所有勾选的 module（以 module kind 为准，link/access 同 mid 跟随）
        var idx = 0;
        $('#moduleTree input[data-kind="module"]:checked').each(function () {
            var mid = $(this).attr('data-mid');
            var link = $('#moduleTree input[data-kind="link"][data-mid="' + mid + '"]').prop('checked') ? 0 : 1;
            var access = $('#moduleTree input[data-kind="access"][data-mid="' + mid + '"]').prop('checked') ? 0 : 1;
            params['modules[' + idx + '].mid'] = mid;
            params['modules[' + idx + '].link'] = link;
            params['modules[' + idx + '].access'] = access;
            idx++;
        });
        app.post(api.system.updateRoleModuleByRid, params, function () {
            app.showAlert(app.success, '模块权限已保存');
            layer.close(state.moduleIndex); state.moduleIndex = null;
        });
    }

    // ===== 操作配置 =====
    function openOperationConfig(rid) {
        state.currentRid = rid;
        $('#operationSearch').val('');
        $('#operationList').html('<div style="padding:30px;text-align:center;color:#999;">加载中...</div>');
        state.opIndex = layer.open({ type: 1, title: '操作配置', content: $('#operationBox'), area: ['640px', '80%'] });
        if (state.opData) { renderOperationList(state.opData); loadRoleOperations(rid); }
        else {
            app.post(api.system.queryOperationForSelf, { 'operation.system': 1, 'operation.type': 0 }, function (res) {
                state.opData = res.operations || [];
                renderOperationList(state.opData);
                loadRoleOperations(rid);
            });
        }
    }

    function renderOperationList(operations) {
        var $wrap = $('#operationList').empty();
        if (!operations.length) { $wrap.html('<div style="padding:30px;text-align:center;color:#999;">暂无操作数据</div>'); return; }
        // 按 module.mid 分组
        var groups = {};
        $.each(operations, function (i, v) {
            var mid = (v.module && v.module.mid) ? v.module.mid : 0;
            var mname = (v.module && v.module.name) ? v.module.name : '未分类';
            if (!groups[mid]) groups[mid] = { name: mname, items: [] };
            groups[mid].items.push(v);
        });
        var mids = Object.keys(groups).map(Number).sort(function (a, b) { if (a === 0) return 1; if (b === 0) return -1; return a - b; });
        $.each(mids, function (i, mid) {
            var g = groups[mid];
            g.items.sort(function (a, b) { return a.oid - b.oid; });
            var $group = $('<div class="op-group" style="margin-bottom:8px;border:1px solid #eee;border-radius:4px;"></div>');
            var $head = $('<div class="op-head" style="padding:6px 10px;background:#f7f7f7;cursor:pointer;font-weight:bold;"></div>')
                .html('<i class="layui-icon layui-icon-right" style="transition:transform .2s;"></i> ' + g.name + ' (' + g.items.length + ')');
            var $body = $('<div class="op-body" style="display:none;padding:6px 10px;"></div>');
            $.each(g.items, function (j, op) {
                $body.append('<label style="display:inline-block;width:50%;padding:2px 0;"><input type="checkbox" name="operation" value="' + op.oid + '" data-opname="' + escapeAttr(op.name) + '"> <span>' + op.name + '</span></label>');
            });
            $head.on('click', function () {
                $body.slideToggle(100);
                var $icon = $head.find('.layui-icon');
                if ($body.is(':hidden')) $icon.css('transform', 'none'); else $icon.css('transform', 'rotate(90deg)');
            });
            $group.append($head).append($body);
            $wrap.append($group);
        });
        // 实时入库
        $('#operationList input[name="operation"]').off('change').on('change', function () {
            var checked = $(this).prop('checked');
            app.post(checked ? api.system.updateRoleOperation : api.system.deleteRoleOperation, {
                'role.rid': state.currentRid, 'operation.oid': $(this).val()
            });
        });
    }

    function escapeAttr(s) { return String(s == null ? '' : s).replace(/"/g, '&quot;'); }

    function loadRoleOperations(rid) {
        app.post(api.system.queryOperationByRid, { 'operation.system': 1, 'role.rid': rid }, function (res) {
            $('#operationList input[type="checkbox"]').prop('checked', false);
            $.each(res.operations || [], function (i, op) {
                $('#operationList input[value="' + op.oid + '"]').prop('checked', true);
            });
        });
    }

    // 操作搜索
    var opSearchTimer = null;
    $('#operationSearch').on('input', function () {
        var kw = $.trim($(this).val()).toLowerCase();
        clearTimeout(opSearchTimer);
        opSearchTimer = setTimeout(function () {
            if (!kw) {
                $('#operationList .op-body li').show();
                $('#operationList input[name="operation"]').closest('label').show();
                return;
            }
            $('#operationList input[name="operation"]').each(function () {
                var name = ($(this).attr('data-opname') || '').toLowerCase();
                $(this).closest('label').toggle(name.indexOf(kw) >= 0);
            });
            // 隐藏无命中的整组
            $('#operationList .op-body').each(function () {
                var hit = $(this).find('label:visible').length;
                $(this).closest('.op-group').toggle(hit > 0);
            });
        }, 200);
    });

    // 事件
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); query(1); });
    $('#btnAdd').on('click', function () { openEdit(null); });
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
    $('#btnModuleSave').on('click', saveModule);
    $('#btnModuleCancel').on('click', function () { layer.close(state.moduleIndex); state.moduleIndex = null; });
    $('#btnOpClose').on('click', function () { layer.close(state.opIndex); state.opIndex = null; });
});
}); // end app.ready
