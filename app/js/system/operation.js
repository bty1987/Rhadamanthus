/**
 * app/js/system/operation.js —— 操作日志配置（第 0 批首实例）
 *
 * 对齐旧 WebContent/js/system/operation.js 的全部业务行为：
 *   - 列表：pageOperation(paging, filters)，filter 字段 operationName/operation/operationType
 *   - 新增/编辑：layer 弹窗表单，校验后 addOperation/updateOpperation(保留拼写)
 *   - 删除：showConfirm + deleteOperation
 *   - 模块：从 queryModule 加载到 select（旧版用 typeahead，这里简化为带搜索的 select，避免阻塞）
 *   - 类型/日志记录：枚举（0/1/2/3 与 0/1/2）
 *
 * 后端契约已核实：OperationAction.pageOperation(getPaging(), getFilters())；
 *   OperationDaoImpl 白名单：operationName→name(cn), operation→operation(cn), operationType→type(eq)。
 */
// 业务逻辑入口：先确保核心运行时就绪（post/api/core/validate），再用 UI 模块
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table;
    var laypage = layui.laypage;
    var form = layui.form;
    var layer = layui.layer;
    var $ = layui.jquery;

    var state = { page: 1, rows: 10, total: 0, editIndex: null, editOid: null };

    // ========== 初始化 ==========
    loadModuleOptions();   // 填充模块下拉（编辑表单用）
    initTable();
    query(1);

    // ====================================================================
    // 加载模块选项（编辑表单里的 select）
    // ====================================================================
    function loadModuleOptions() {
        app.post(api.system.queryModule, { 'module.system': (window.parent && window.parent.app ? window.parent.app.config.system : app.config.system) }, function (res) {
            var modules = res.modules || [];
            var html = '<option value="">请选择模块</option>';
            for (var i = 0; i < modules.length; i++) {
                html += '<option value="' + modules[i].mid + '">' + modules[i].name + '</option>';
            }
            $('#editForm [name="moduleMid"]').html(html);
            form.render('select');
        }, null, false);
    }

    // ====================================================================
    // 表格定义
    // ====================================================================
    function initTable() {
        table.render({
            elem: '#resultTable',
            data: [],
            page: false,
            limit: 1000,
            even: true,
            cols: [[
                { field: 'oid', title: '编号', width: 80, sort: true },
                { field: 'name', title: '操作说明', minWidth: 180 },
                {
                    field: 'module', title: '模块', width: 150,
                    templet: function (d) { return d.module ? d.module.name : '---'; }
                },
                {
                    field: 'type', title: '类型', width: 100,
                    templet: function (d) {
                        var map = { 0: '权限', 1: '免检', 2: '通用', 3: '钉钉' };
                        return map[d.type] != null ? map[d.type] : '---';
                    }
                },
                {
                    field: 'logFlag', title: '日志记录', width: 110,
                    templet: function (d) {
                        // 0=不记录 1=始终记录 2=自动（默认）
                        var flag = (d.logFlag == null) ? 2 : d.logFlag;
                        return flag == 0 ? '不记录' : flag == 1 ? '始终记录' : '自动';
                    }
                },
                { field: 'operation', title: '操作', minWidth: 160 },
                { title: '操作', width: 150, fixed: 'right', toolbar: '#rowToolbar' }
                ]]
        });

        // 行工具条
        table.on('tool(resultTable)', function (obj) {
            if (obj.event === 'edit') openEdit(obj.data);
            else if (obj.event === 'del') doDelete(obj.data);
        });
    }

    // ====================================================================
    // 构造后端 filters[N].* 参数
    // ====================================================================
    function buildFilters() {
        var params = {};
        var count = 0;
        $('#searchForm [name]').each(function () {
            var $el = $(this);
            var field = $el.attr('name');
            var val = $.trim($el.val());
            if (val === '' || val == null) return;
            var op = $el.attr('data-op') || 'eq';
            params['filters[' + count + '].field'] = field;
            params['filters[' + count + '].data'] = val;
            params['filters[' + count + '].op'] = op;
            count++;
        });
        return params;
    }

    // ====================================================================
    // 查询
    // ====================================================================
    function query(page) {
        state.page = page || 1;
        var params = $.extend({}, buildFilters(), {
            'paging.page': state.page,
            'paging.rows': state.rows
        });

        app.post(api.system.pageOperation, params, function (res) {
            var pg = res.paging || { data: [], totalRecords: 0, totalPage: 0 };
            table.reload('resultTable', { data: pg.data || [] });
            state.total = pg.totalRecords || 0;
            renderPage(Math.min(pg.totalPage || 0, 59)); // 后端 page>=60 返回空，上限保护
        });
    }

    // ====================================================================
    // 分页
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
    // 新增 / 编辑
    // ====================================================================
    function openEdit(data) {
        app.clearValidator();
        $('#editForm')[0].reset();
        state.editOid = null;

        if (data) {
            state.editOid = data.oid;
            $('#editForm [name="oid"]').val(data.oid);
            $('#editForm [name="name"]').val(data.name);
            $('#editForm [name="operation"]').val(data.operation);
            $('#editForm [name="type"]').val(data.type);
            $('#editForm [name="logFlag"]').val(data.logFlag == null ? 2 : data.logFlag);
            if (data.module) $('#editForm [name="moduleMid"]').val(data.module.mid);
            form.render('select');
        } else {
            // 新增默认 logFlag=2（自动）
            $('#editForm [name="logFlag"]').val(2);
            form.render('select');
        }

        state.editIndex = layer.open({
            type: 1,
            title: data ? '编辑操作' : '添加操作',
            content: $('#editBox'),
            area: ['560px', 'auto'],
            cancel: function () { app.clearValidator(); }
        });
    }

    function doSave() {
        if (app.validate('editForm')) return;

        var opt = {
            'operation.name': $('#editForm [name="name"]').val(),
            'operation.operation': $('#editForm [name="operation"]').val(),
            'operation.module.mid': $('#editForm [name="moduleMid"]').val(),
            'operation.system': app.config.system,
            'operation.type': $('#editForm [name="type"]').val(),
            'operation.logFlag': $('#editForm [name="logFlag"]').val()
        };

        var apiDef;
        if (state.editOid) {
            opt['operation.oid'] = state.editOid;
            apiDef = api.system.updateOpperation; // 保留后端原始拼写
        } else {
            apiDef = api.system.addOperation;
        }

        app.post(apiDef, opt, function () {
            app.showAlert(app.success, '保存成功');
            layer.close(state.editIndex);
            state.editIndex = null;
            query(state.page);
        });
    }

    function doDelete(data) {
        app.showConfirm('是否确定删除', function () {
            app.post(api.system.deleteOperation, { 'operation.oid': data.oid }, function () {
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

