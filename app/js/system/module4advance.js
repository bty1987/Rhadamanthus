/** app/js/system/module4advance.js —— 模块高级配置
 * 旧版三栏树形导航：queryModule(level=1) → 点"下级"展开 queryModuleByFatherModule
 * 每个模块带"角色"(module4role)/"人员"(module4user)入口（弹窗子页）
 * 这里用 layui table 树形展示（按 level 缩进 + 父子关系），保留 角色/人员 操作 */
app.ready(function () {
layui.use(['table', 'laypage', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, layer = layui.layer, $ = layui.jquery;
    var state = { all: [], rows: [], page: 1, rowsPage: 30, total: 0, keyword: '' };

    initTable(); loadAll();

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 5000, even: true,
            cols: [[ { field: 'displayName', title: '模块', minWidth: 280, templet: function (d) {
                        var pad = ''; for (var i = 1; i < d.level; i++) pad += '&nbsp;&nbsp;&nbsp;&nbsp;';
                        var icon = d.icon ? '<i class="' + d.icon + '"></i> ' : '';
                        return pad + icon + d.name + (d.alias ? ' - ' + d.alias : '');
                    } },
                { field: 'level', title: '等级', width: 80, templet: function (d) { return { 1: '一级', 2: '二级', 3: '三级' }[d.level] || d.level; } },
                { field: 'url', title: '链接', minWidth: 160, templet: function (d) { return d.url ? d.url : '---'; } },
                { field: 'order', title: '排序', width: 80 },
                { title: '操作', width: 180, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) {
            if (obj.event === 'role') openSub('module4role.html', obj.data, '角色配置');
            else if (obj.event === 'user') openSub('module4user.html', obj.data, '人员配置');
        });
    }

    function openSub(view, mod, title) {
        // 通过 app.params 传递当前 module 给子页
        app.params.system = app.params.system || {};
        app.params.system.module = mod;
        app.popup('views/system/' + view, title + ' - ' + mod.name, null, { area: ['80%', '80%'] });
    }

    // 递归加载三级模块：queryModule(level=1) → 各节点 queryModuleByFatherModule
    function loadAll() {
        app.post(api.system.queryModule, { 'module.system': app.config.system, 'module.level': 1 }, function (res) {
            state.all = [];
            var level1 = (res.modules || []).sort(function (a, b) { return (a.order || 0) - (b.order || 0); });
            var pending = level1.length;
            if (pending === 0) { applyFilter(); return; }
            $.each(level1, function (i, m1) {
                state.all.push(m1);
                loadChildren(m1, function () {
                    pending--;
                    if (pending === 0) applyFilter();
                });
            });
        });
    }

    function loadChildren(parent, done) {
        if (parent.url && parent.url !== '') { done(); return; } // 叶子节点无下级
        app.post(api.system.queryModuleByFatherModule, { 'module.system': app.config.system, 'module.fatherModule.mid': parent.mid }, function (res) {
            var children = (res.modules || []).sort(function (a, b) { return (a.order || 0) - (b.order || 0); });
            var pending = children.length;
            if (pending === 0) { done(); return; }
            $.each(children, function (i, c) {
                state.all.push(c);
                loadChildren(c, function () { pending--; if (pending === 0) done(); });
            });
        }, function () { done(); });
    }

    function applyFilter() {
        var kw = state.keyword;
        var list = state.all;
        if (kw) list = $.grep(list, function (m) { return (m.name || '').indexOf(kw) >= 0 || (m.alias || '').indexOf(kw) >= 0; });
        state.rows = list;
        state.total = list.length;
        renderPage();
        renderPageData();
    }

    function renderPageData() {
        var start = (state.page - 1) * state.rowsPage;
        table.reload('resultTable', { data: state.rows.slice(start, start + state.rowsPage) });
    }

    function renderPage() {
        laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rowsPage, limits: [30, 100, 300],
            layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (obj, first) {
                state.rowsPage = obj.limit;
                if (!first) { state.page = obj.curr; renderPageData(); }
            } });
    }

    $('#btnSearch').on('click', function () { state.keyword = $.trim($('#searchForm [name="name"]').val()); state.page = 1; applyFilter(); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); state.keyword = ''; state.page = 1; applyFilter(); });
});
}); // end app.ready
