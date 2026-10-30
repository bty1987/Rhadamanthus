/**
 * app/js/template/list.js —— 列表页逻辑模板（纯 LayUI）
 *
 * ★ 配套 views/template/list.html + api/_template.js 使用。
 *
 * 核心能力（对齐后端既有契约，后端零改动）：
 *   - 搜索：读取搜索条字段 → 构造 filters[N].{field,data,op}
 *   - 分页：laypage（后端 page>=60 或 rows>10 且 page>=30 返回空，已做上限保护）
 *   - 表格：layui.table.render（本地数据模式，数据由 app.post 拉取后灌入）
 *   - 新增/编辑：layer.open 弹出 #editBox，表单校验后 add/update
 *   - 删除：app.showConfirm + delete + 刷新
 *
 * 接口约定（复制后改名 template → 你的模块）：
 *   api.template.pageTemplate   分页查询
 *   api.template.addTemplate    新增
 *   api.template.updateTemplate 修改
 *   api.template.deleteTemplate 删除
 */
// 业务逻辑入口：先确保核心运行时就绪，再用 UI 模块
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'laydate', 'layer', 'jquery'], function () {
    var table = layui.table;
    var laypage = layui.laypage;
    var form = layui.form;
    var laydate = layui.laydate;
    var layer = layui.layer;
    var $ = layui.jquery;

    // —— 页面状态 ——
    var state = { page: 1, rows: 10, total: 0, editIndex: null, tableIns: null };

    // —— 初始化日期范围（ge/le 两条 filter） ——
    laydate.render({ elem: '#createTime', type: 'date', range: '~' });

    // —— 初始化表格（本地数据模式，分页交给 laypage，更贴合后端契约） ——
    initTable();
    query(1);

    // ====================================================================
    // 表格定义：cols 按业务字段调整
    // ====================================================================
    function initTable() {
        state.tableIns = table.render({
            elem: '#resultTable',
            data: [],                // 本地数据（由 query() 灌入）
            page: false,             // 分页由 laypage 接管（对齐后端 paging 契约）
            limit: 1000,             // 本地模式不分页，给一个大值
            even: true,
            cols: [[
                { type: 'numbers', title: '#', width: 60 },
                { field: 'name', title: '名称', minWidth: 160 },
                {
                    field: 'price', title: '金额', width: 120, align: 'right',
                    templet: function (d) { return app.formatMoney(d.price); }
                },
                    { field: 'status', title: '状态', width: 100, templet: function (d) {
                        return d.status == 0
                            ? '<span class="layui-badge layui-bg-green">启用</span>'
                            : '<span class="layui-badge">禁用</span>';
                    }},
                {
                    field: 'createTime', title: '创建时间', width: 170,
                    templet: function (d) { return app.dateFormat(d.createTime); }
                },
                { title: '操作', width: 150, fixed: 'right', toolbar: '#rowToolbar' }
                ]]
        });

        // 行工具条事件（编辑/删除）
        table.on('tool(resultTable)', function (obj) {
            var data = obj.data;
            if (obj.event === 'edit') openEdit(data);
            else if (obj.event === 'del') doDelete(data);
        });
    }

    // 行工具条模板（隐藏）
    if (!$('#rowToolbar').length) {
        $('body').append(
            '<script type="text/html" id="rowToolbar">'
            + '<button class="layui-btn layui-btn-xs" lay-event="edit"><i class="layui-icon layui-icon-edit"></i>编辑</button>'
            + '<button class="layui-btn layui-btn-danger layui-btn-xs" lay-event="del"><i class="layui-icon layui-icon-delete"></i>删除</button>'
            + '<\/script>'
        );
    }

    // ====================================================================
    // 构造后端 filters[N].* 参数（与旧 Searcher getParams 等价）
    // ====================================================================
    function buildFilters() {
        var params = {};
        var count = 0;
        $('#searchForm [name]').each(function () {
            var $el = $(this);
            var field = $el.attr('name');
            var val = $.trim($el.val());
            if (val === '' || val == null) return; // 空值不参与过滤

            var op = $el.attr('data-op') || 'eq';

            // 日期范围（createTime "~" 分隔）→ 拆成 ge + le 两条
            if (field === 'createTime' && val.indexOf('~') > -1) {
                var seg = val.split('~');
                var start = $.trim(seg[0]), end = $.trim(seg[1]);
                if (start) {
                    params['filters[' + count + '].field'] = 'createTime';
                    params['filters[' + count + '].data'] = start;
                    params['filters[' + count + '].op'] = 'ge';
                    count++;
                }
                if (end) {
                    params['filters[' + count + '].field'] = 'createTime';
                    params['filters[' + count + '].data'] = end;
                    params['filters[' + count + '].op'] = 'le';
                    count++;
                }
                return;
            }
            params['filters[' + count + '].field'] = field;
            params['filters[' + count + '].data'] = val;
            params['filters[' + count + '].op'] = op;
            count++;
        });
        return params;
    }

    // ====================================================================
    // 查询：app.post → 灌表格 + 渲染分页
    // ====================================================================
    function query(page) {
        state.page = page || 1;
        var params = $.extend({}, buildFilters(), {
            'paging.page': state.page,
            'paging.rows': state.rows
        });

        app.post(api.template.pageTemplate, params, function (res) {
            var pg = res.paging || { data: [], totalRecords: 0, totalPage: 0 };
            // 灌入表格（本地数据 reload）
            table.reload('resultTable', { data: pg.data || [] });
            state.total = pg.totalRecords || 0;
            renderPage(Math.min(pg.totalPage || 0, 59)); // 上限保护：后端 page>=60 返回空
        });
    }

    // ====================================================================
    // 分页（layui.laypage）
    // ====================================================================
    function renderPage(totalPage) {
        laypage.render({
            elem: 'pagenation',
            count: state.total,
            curr: state.page,
            limit: state.rows,
            limits: [10, 30],
            layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
            jump: function (obj, first) {
                state.rows = obj.limit;
                if (!first) query(obj.curr);
            }
        });
    }

    // ====================================================================
    // 新增 / 编辑（layer 弹窗）
    // ====================================================================
    function openEdit(data) {
        app.clearValidator();
        var $form = $('#editForm')[0];
        $form.reset();
        if (data) {
            // 编辑：回填
            $('#editForm [name="id"]').val(data.id);
            $('#editForm [name="name"]').val(data.name);
            $('#editForm [name="price"]').val(data.price);
            $('#editForm [name="status"]').val(data.status);
            $('#editForm [name="comment"]').val(data.comment || '');
            form.render('select');
        }
        state.editIndex = layer.open({
            type: 1,
            title: data ? '编辑' : '新增',
            content: $('#editBox'),
            area: ['560px', 'auto'],
            cancel: function () { app.clearValidator(); }
        });
    }

    function doSave() {
        // 表单校验（v_* 类机制）
        if (app.validate('editForm')) return;

        var opt = {
            'template.id': $('#editForm [name="id"]').val(),
            'template.name': $('#editForm [name="name"]').val(),
            'template.price': $('#editForm [name="price"]').val(),
            'template.status': $('#editForm [name="status"]').val(),
            'template.comment': $('#editForm [name="comment"]').val()
        };

        var id = opt['template.id'];
        var isEdit = id && id !== '';
        var apiDef = isEdit ? api.template.updateTemplate : api.template.addTemplate;
        if (!isEdit) delete opt['template.id'];

        app.post(apiDef, opt, function () {
            app.showAlert(app.success, '保存成功');
            layer.close(state.editIndex);
            state.editIndex = null;
            query(state.page);
        });
    }

    function doDelete(data) {
        app.showConfirm('确认删除该条记录？', function () {
            app.post(api.template.deleteTemplate, { 'template.id': data.id }, function () {
                app.showAlert(app.success, '删除成功');
                query(state.page);
            });
        });
    }

    // ====================================================================
    // 事件绑定
    // ====================================================================
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () {
        $('#searchForm')[0].reset();
        form.render('select');
        query(1);
    });
    $('#btnAdd').on('click', function () { openEdit(null); });
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () {
        layer.close(state.editIndex);
        state.editIndex = null;
    });
});
}); // end app.ready
