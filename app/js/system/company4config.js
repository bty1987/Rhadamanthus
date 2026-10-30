/** app/js/system/company4config.js —— 公司配置（多分区只读 + 系统配置 CRUD）
 * 旧版 wizard 拆为 layui 卡片分区：系统配置/放线小组/收据类型/款项比例/施工节点
 * 当前公司取自 app.params.company（或 queryCompanyByCid 兜底）
 * 报价版本分区依赖 quotation API（未迁移），暂省略 */
app.ready(function () {
layui.use(['table', 'form', 'layer', 'element', 'jquery'], function () {
    var table = layui.table, form = layui.form, layer = layui.layer, element = layui.element, $ = layui.jquery;
    var state = { company: null, editIndex: null, editId: null };

    initCompany();

    function initCompany() {
        if (app.params.company && app.params.company.cid) {
            state.company = app.params.company;
            renderAll();
        } else {
            // 兜底：从当前公司接口取（后端按 authentication 解析当前公司）
            app.post(api.system.queryCompanyByCid, {}, function (res) {
                state.company = res.company || { name: '当前公司' };
                renderAll();
            }, function () { state.company = { name: '当前公司' }; renderAll(); });
        }
    }

    function renderAll() {
        $('#companyName').text(state.company.name || '-');
        loadSystemConfig();
        loadDrawline();
        loadReceiptType();
        loadPaymentScale();
        loadConstructionNode();
    }

    // ===== 系统配置 =====
    function loadSystemConfig() {
        table.render({ elem: '#systemConfigTable', data: [], page: false, limit: 1000, even: true,
            toolbar: '#configHead',
            cols: [[ { field: 'comment', title: '说明', minWidth: 180 },
                { field: 'value', title: '值', minWidth: 160 },
                { field: 'creater', title: '创建人', width: 120, templet: function (d) { return d.creater ? (d.creater.currentName || '') : ''; } },
                { field: 'createTime', title: '创建时间', width: 170, templet: function (d) { return app.dateFormat(d.createTime); } },
                { title: '操作', width: 160, toolbar: '#configToolbar' } ]] });
        app.post(api.system.querySystemConfigByCid, {}, function (res) {
            table.reload('systemConfigTable', { data: res.systemConfigs || [] });
        });
        table.on('toolbar(systemConfigTable)', function (obj) { if (obj.event === 'addConfig') { /* fallback */ } });
        table.on('tool(systemConfigTable)', function (obj) {
            if (obj.event === 'edit') openConfigEdit(obj.data);
            else if (obj.event === 'del') delConfig(obj.data);
        });
    }

    function openConfigEdit(d) {
        app.clearValidator(); $('#configForm')[0].reset(); state.editId = null;
        if (d) {
            state.editId = d.scid;
            $('#configForm [name="scid"]').val(d.scid);
            $('#configForm [name="group"]').val(d.group || '');
            $('#configForm [name="key"]').val(d.key).prop('disabled', true);
            $('#configForm [name="value"]').val(d.value);
            $('#configForm [name="comment"]').val(d.comment || '');
        } else {
            $('#configForm [name="key"]').prop('disabled', false);
        }
        state.editIndex = layer.open({ type: 1, title: d ? '编辑配置' : '添加配置', content: $('#configEditBox'), area: ['520px', 'auto'], cancel: function () { app.clearValidator(); } });
    }

    function doConfigSave() {
        if (app.validate('configForm')) return;
        var opt = {
            'systemConfig.group': $('#configForm [name="group"]').val(),
            'systemConfig.key': $('#configForm [name="key"]').val(),
            'systemConfig.value': $('#configForm [name="value"]').val(),
            'systemConfig.comment': $('#configForm [name="comment"]').val()
        };
        var apiDef;
        if (state.editId) { opt['systemConfig.scid'] = state.editId; apiDef = api.system.updateSystemConfig; }
        else { apiDef = api.system.addSystemConfig; }
        app.post(apiDef, opt, function () {
            app.showAlert(app.success, '保存成功');
            layer.close(state.editIndex); state.editIndex = null; loadSystemConfig();
        });
    }

    function delConfig(d) {
        app.showConfirm('确认删除该配置项？', function () {
            app.post(api.system.deleteSystemConfig, { 'systemConfig.scid': d.scid }, function () {
                app.showAlert(app.success, '已删除'); loadSystemConfig();
            });
        });
    }

    // ===== 放线小组 =====
    function loadDrawline() {
        table.render({ elem: '#drawlineTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 }, { field: 'name', title: '名称', minWidth: 200 } ]] });
        app.post(api.data.queryDrawlineGroup, { 'drawlineGroup.company': state.company.cid }, function (res) {
            table.reload('drawlineTable', { data: res.drawlineGroups || [] });
        });
    }

    // ===== 收据类型 =====
    function loadReceiptType() {
        table.render({ elem: '#receiptTypeTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 },
                { field: 'name', title: '名称', minWidth: 160 },
                { field: 'no', title: '键值', width: 140 },
                { field: 'type', title: '类型', width: 100, templet: function (d) { var m = { 1: '现金', 2: '银行', 3: '转账', 4: '对公账户', 5: '券' }; return m[d.type] || '---'; } },
                { field: 'status', title: '状态', width: 80, templet: function (d) { return d.status == 0 ? '<span class="layui-badge layui-bg-green">启用<\/span>' : '<span class="layui-badge layui-bg-gray">禁用<\/span>'; } } ]] });
        app.post(api.data.queryReceiptType, {}, function (res) {
            table.reload('receiptTypeTable', { data: res.receiptTypes || [] });
        });
    }

    // ===== 款项比例 =====
    function loadPaymentScale() {
        table.render({ elem: '#paymentScaleTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 },
                { field: 'name', title: '款型名称', minWidth: 200 },
                { field: 'comment', title: '说明', minWidth: 200 } ]] });
        app.post(api.data.queryPaymentScale, { 'paymentScale.company': state.company.cid }, function (res) {
            table.reload('paymentScaleTable', { data: res.paymentScales || [] });
        });
    }

    // ===== 施工节点 =====
    function loadConstructionNode() {
        table.render({ elem: '#constructionNodeTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 },
                { field: 'name', title: '节点名称', minWidth: 240 } ]] });
        app.post(api.data.queryConstructionNode, {}, function (res) {
            table.reload('constructionNodeTable', { data: res.constructionNodes || [] });
        });
    }

    // 添加配置按钮（顶部工具条，layui table toolbar 事件名需匹配，这里用委托兜底）
    $(document).on('click', '#btnAddConfig', function () { openConfigEdit(null); });
    $('#btnConfigSave').on('click', doConfigSave);
    $('#btnConfigCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
