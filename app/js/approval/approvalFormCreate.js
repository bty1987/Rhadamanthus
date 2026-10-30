/** app/js/approval/approvalFormCreate.js —— 审批表单设计器（P2-P3 新引擎）
  上下文：app.params.approvalForm = {formId}（编辑）或 null（新增）
  控件库：基础8类 + 业务控件 queryProcessRefer（按 type 分组 query/filling/condition/select/text/textarea/datetime/upload）
  预览：selectField 选中→显示右栏属性；保存：addApprovalForm/updateApprovalForm，嵌套 formFields[i].xxx */
app.ready(function () {
layui.use(['form', 'layer', 'jquery'], function () {
    var form = layui.form, layer = layui.layer, $ = layui.jquery;
    var data = (parent.app.params.approvalForm) || (app.params.approvalForm) || null;
    var fields = [], selectedIndex = null;

    var controlDefs = [
        { type: 1, name: '文本', icon: 'layui-icon-font', color: 'layui-btn-primary' },
        { type: 2, name: '文本域', icon: 'layui-icon-align', color: 'layui-btn-primary' },
        { type: 3, name: '数字', icon: 'layui-icon-nums', color: 'layui-btn-normal' },
        { type: 4, name: '下拉', icon: 'layui-icon-down', color: 'layui-btn-warm' },
        { type: 5, name: '日期', icon: 'layui-icon-date', color: 'layui-btn-warm' },
        { type: 6, name: '用户选择', icon: 'layui-icon-username', color: 'layui-btn-normal' },
        { type: 7, name: '部门选择', icon: 'layui-icon-group', color: 'layui-btn-normal' },
        { type: 8, name: '附件', icon: 'layui-icon-file', color: 'layui-btn-danger' }
    ];
    var controlMap = {}; $.each(controlDefs, function (i, c) { controlMap[c.type] = c; });
    var referControlTypeMap = { query: 6, filling: 1, select: 4, text: 1, textarea: 2, datetime: 5, upload: 8, condition: 3 };

    // ===== 渲染控件库 =====
    function renderBasicLib() {
        var $lib = $('#basicLib');
        $.each(controlDefs, function (i, c) {
            $('<button type="button" class="app-ctrl-btn layui-btn layui-btn-sm ' + c.color + '"><i class="layui-icon ' + c.icon + '"></i> ' + c.name + '</button>')
                .data('type', c.type).appendTo($lib);
        });
    }
    function renderBizLib() {
        app.post(api.approval.queryProcessRefer, {}, function (res) {
            var refers = res.processRefers || [];
            // 按 type 分组渲染
            var grouped = {};
            $.each(refers, function (i, r) { (grouped[r.type] = grouped[r.type] || []).push(r); });
            var order = ['query', 'filling', 'condition', 'select', 'text', 'textarea', 'datetime', 'upload'];
            var $lib = $('#bizLib');
            $.each(order, function (gi, type) {
                if (!grouped[type]) return;
                $.each(grouped[type], function (i, r) {
                    $('<button type="button" class="app-ctrl-btn layui-btn layui-btn-xs"><i class="layui-icon layui-icon-link"></i> ' + esc(r.name) + '</button>')
                        .data({ referId: r.id, referName: r.name, referType: r.type }).appendTo($lib);
                });
            });
        });
    }
    $('#basicLib').on('click', 'button', function () { addField($(this).data('type'), null, null); });
    $('#bizLib').on('click', 'button', function () {
        var d = $(this).data();
        addField(referControlTypeMap[d.referType] || 1, d.referId, d.referName);
    });

    function addField(controlType, referId, referName) {
        var c = controlMap[controlType] || controlDefs[0];
        var seq = fields.length;
        fields.push({
            fieldKey: referId || ('field_' + (seq + 1)),
            fieldLabel: referName || (c.name + '字段'),
            controlType: controlType,
            sortOrder: seq,
            required: referId ? 1 : 0,
            defaultValue: '', dataSource: '', validateRule: '', status: 0,
            referId: referId || ''
        });
        renderPreview(); selectField(seq);
    }

    function renderPreview() {
        var $p = $('#formPreview').empty();
        $('#notfield').toggle(fields.length === 0);
        $.each(fields, function (i, f) {
            var c = controlMap[f.controlType] || controlDefs[0];
            var required = f.required == 1 ? '<span class="app-req">*</span>' : '';
            var refer = f.referId ? ' <i class="layui-icon layui-icon-link" style="color:#999;font-size:11px;" title="业务字段: ' + esc(f.referId) + '"></i>' : '';
            var $row = $('<div class="app-designer-preview-row' + (i === selectedIndex ? ' active' : '') + '"></div>').attr('data-index', i);
            $row.html('<label class="layui-form-label" style="width:90px;text-align:left;font-weight:normal;"><i class="layui-icon ' + c.icon + '" style="color:#666;"></i> ' + required + esc(f.fieldLabel || '(未命名)') + refer + '</label><div class="layui-input-block">' + renderControlPreview(f) + '</div>');
            $p.append($row);
        });
    }
    function renderControlPreview(f) {
        var v = f.defaultValue || '';
        switch (f.controlType) {
            case 2: return '<textarea class="layui-textarea" disabled>' + esc(v) + '</textarea>';
            case 3: return '<input type="number" class="layui-input" disabled value="' + esc(v) + '">';
            case 4: return '<select class="layui-input" disabled><option>' + esc(v || '请选择') + '</option></select>';
            case 5: return '<input type="text" class="layui-input" disabled placeholder="YYYY-MM-DD" value="' + esc(v) + '">';
            case 6: return '<input type="text" class="layui-input" disabled placeholder="选择用户" value="' + esc(v) + '">';
            case 7: return '<input type="text" class="layui-input" disabled placeholder="选择部门" value="' + esc(v) + '">';
            case 8: return '<button type="button" class="layui-btn layui-btn-sm layui-btn-danger" disabled><i class="layui-icon layui-icon-upload"></i> 上传</button>';
            default: return '<input type="text" class="layui-input" disabled value="' + esc(v) + '">';
        }
    }

    function selectField(i) {
        selectedIndex = i; renderPreview();
        var f = fields[i];
        if (!f) { $('#propForm').hide(); $('#propEmpty').show(); return; }
        $('#propEmpty').hide(); $('#propForm').show();
        $('#propForm [name="fieldIndex"]').val(i);
        $('#propForm [name="fieldKey"]').val(f.fieldKey).prop('disabled', !!f.referId);
        $('#propForm [name="fieldLabel"]').val(f.fieldLabel);
        $('#propForm [name="required"]').prop('checked', f.required == 1);
        $('#propForm [name="defaultValue"]').val(f.defaultValue);
        $('#propForm [name="dataSource"]').val(f.dataSource);
        $('#propForm [name="validateRule"]').val(f.validateRule);
        form.render('checkbox');
    }
    $('#formPreview').on('click', '.app-designer-preview-row', function () { selectField(parseInt($(this).attr('data-index'))); });

    $('#applyPropBtn').on('click', function () {
        var idx = parseInt($('#propForm [name="fieldIndex"]').val()); var f = fields[idx]; if (!f) return;
        f.fieldKey = $('#propForm [name="fieldKey"]').val() || f.fieldKey;
        f.fieldLabel = $('#propForm [name="fieldLabel"]').val() || f.fieldLabel;
        f.required = $('#propForm [name="required"]').prop('checked') ? 1 : 0;
        f.defaultValue = $('#propForm [name="defaultValue"]').val();
        f.dataSource = $('#propForm [name="dataSource"]').val();
        f.validateRule = $('#propForm [name="validateRule"]').val();
        renderPreview(); app.showAlert(app.info, '属性已应用');
    });
    $('#deleteFieldBtn').on('click', function () {
        var idx = parseInt($('#propForm [name="fieldIndex"]').val());
        fields.splice(idx, 1); selectedIndex = null;
        $.each(fields, function (i, f) { f.sortOrder = i; });
        renderPreview(); $('#propForm').hide(); $('#propEmpty').show();
    });

    // 加载关联流程下拉
    function loadFlowSelect() {
        app.post(api.approval.pageApprovalFlow, { 'paging.page': 1, 'paging.rows': 999 }, function (res) {
            var flows = (res.paging && res.paging.data) || [];
            var $sel = $('#formForm [name="flowId"]');
            $.each(flows, function (i, f) {
                if (f.status == 0) $sel.append('<option value="' + f.flowId + '">' + esc(f.name) + ' (' + esc(f.code) + ')</option>');
            });
            // 编辑模式回填
            if (data && data.formId && data.flowId) $sel.val(data.flowId);
            form.render('select');
        });
    }

    // 编辑模式：回填 + 加载已有字段
    if (data && data.formId) {
        $('#formForm [name="code"]').val(data.code).prop('disabled', true);
        $('#formForm [name="name"]').val(data.name);
        $('#formForm [name="comment"]').val(data.comment);
        app.post(api.approval.queryApprovalFormField, { 'form.formId': data.formId }, function (res) {
            fields = (res.formFields || []).map(function (f) { f.referId = ''; return f; });
            renderPreview();
        });
    }

    // 提交
    $('#submitBtn').on('click', function () {
        if (app.validate('formForm')) return;
        var o = {
            'form.code': $('#formForm [name="code"]').val(),
            'form.name': $('#formForm [name="name"]').val(),
            'form.comment': $('#formForm [name="comment"]').val()
        };
        var flowId = $('#formForm [name="flowId"]').val();
        if (flowId) o['form.flowId'] = flowId;
        $.each(fields, function (i, f) {
            o['formFields[' + i + '].fieldKey'] = f.fieldKey;
            o['formFields[' + i + '].fieldLabel'] = f.fieldLabel;
            o['formFields[' + i + '].controlType'] = f.controlType;
            o['formFields[' + i + '].sortOrder'] = f.sortOrder;
            o['formFields[' + i + '].required'] = f.required;
            o['formFields[' + i + '].status'] = f.status;
            if (f.defaultValue) o['formFields[' + i + '].defaultValue'] = f.defaultValue;
            if (f.dataSource) o['formFields[' + i + '].dataSource'] = f.dataSource;
            if (f.validateRule) o['formFields[' + i + '].validateRule'] = f.validateRule;
        });
        var apiDef = api.approval.addApprovalForm;
        if (data && data.formId) { o['form.formId'] = data.formId; apiDef = api.approval.updateApprovalForm; }
        app.post(apiDef, o, function () { app.showAlert(app.success, '保存成功'); app.closePopup(); });
    });

    function esc(s) { return $('<div/>').text(s == null ? '' : s).html(); }

    renderBasicLib(); renderBizLib(); loadFlowSelect();
});
}); // end app.ready
