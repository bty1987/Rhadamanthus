jQuery(function($) {

    var form = {
        data: params.approval.form,
        fields: [],
        selectedIndex: null
    };

    // 控件类型定义(含图标/颜色)
    var controlDefs = [
        { type: 1, name: "文本",     icon: "icon-font",       color: "btn-info" },
        { type: 2, name: "文本域",   icon: "icon-align-left",  color: "btn-info" },
        { type: 3, name: "数字",     icon: "icon-asterisk",    color: "btn-success" },
        { type: 4, name: "下拉",     icon: "icon-chevron-down", color: "btn-warning" },
        { type: 5, name: "日期",     icon: "icon-calendar",    color: "btn-warning" },
        { type: 6, name: "用户选择", icon: "icon-user",        color: "btn-primary" },
        { type: 7, name: "部门选择", icon: "icon-group",       color: "btn-primary" },
        { type: 8, name: "附件",     icon: "icon-paperclip",   color: "btn-danger" }
    ];
    var controlMap = {};
    $.each(controlDefs, function(i, c) { controlMap[c.type] = c; });

    // ===== 1. 渲染控件库 =====
    function renderControlLib() {

        var $lib = com.focusPage("#controlLib");
        if ($lib.length === 0) $lib = $("#controlLib");

        $.each(controlDefs, function(i, c) {
            var $btn = $('<a></a>')
                .addClass("btn btn-sm " + c.color)
                .css({ "width": "90%", "margin": "3px 5%", "text-align": "left", "padding": "6px 10px" })
                .attr("data-type", c.type);
            $('<i></i>').addClass(c.icon).css("margin-right", "6px").appendTo($btn);
            $('<span></span>').text(c.name).appendTo($btn);
            $btn.on("click", function() { addField(c.type); });
            $lib.append($btn);
        });
    }

    // ===== 2. 加载关联流程下拉 =====
    function loadFlowSelect() {

        com.post(api.approval.pageApprovalFlow, { "paging.page": 1, "paging.rows": 999 }, function(res) {
            var flows = res.paging.data || [];
            var $sel = com.focusPage("#flowId");
            if ($sel.length === 0) $sel = $("#flowId");

            $.each(flows, function(i, f) {
                if (f.status == 0) {
                    $('<option></option>').val(f.flowId)
                        .text(f.name + " (" + f.code + ")")
                        .appendTo($sel);
                }
            });
        });
    }

    // ===== 3. 添加字段 =====
    function addField(controlType) {

        var c = controlMap[controlType];
        var seq = form.fields.length;

        var field = {
            fieldKey: "field_" + (seq + 1),
            fieldLabel: c.name + "字段",
            controlType: controlType,
            sortOrder: seq,
            required: 0,
            defaultValue: "",
            dataSource: "",
            validateRule: "",
            status: 0
        };

        form.fields.push(field);
        renderPreview();
        selectField(seq);
    }

    // ===== 4. 渲染表单预览 =====
    function renderPreview() {

        var $preview = com.focusPage("#formPreview");
        if ($preview.length === 0) $preview = $("#formPreview");

        $preview.empty();

        var $empty = com.focusPage("#notfield");
        if ($empty.length === 0) $empty = $("#notfield");
        $empty.toggle(form.fields.length === 0);

        $.each(form.fields, function(i, field) {
            var c = controlMap[field.controlType] || controlDefs[0];

            var $row = $('<div></div>')
                .addClass("form-group")
                .css({
                    "padding": "8px 12px",
                    "margin": "4px 0",
                    "border": "1px solid " + (i === form.selectedIndex ? "#428bca" : "#eee"),
                    "border-radius": "4px",
                    "background": i === form.selectedIndex ? "#f0f7ff" : "#fff",
                    "cursor": "pointer"
                })
                .attr("data-index", i);

            // label
            var $label = $('<label></label>')
                .addClass("col-sm-4 control-label no-padding-right")
                .css("font-weight", "normal");
            $('<i></i>').addClass(c.icon).css({ "margin-right": "4px", "color": "#666" }).appendTo($label);

            var labelText = field.fieldLabel || "(未命名)";
            if (field.required == 1) labelText = '<span class="red">*</span>' + labelText;
            $label.append(labelText);
            $label.appendTo($row);

            // 控件渲染
            var $ctrl = $('<div></div>').addClass("col-sm-8");
            $ctrl.append(renderControl(field));
            $ctrl.appendTo($row);

            $row.on("click", function() {
                var idx = parseInt($(this).attr("data-index"));
                selectField(idx);
            });

            $preview.append($row);
        });
    }

    // 按控件类型渲染预览控件
    function renderControl(field) {

        var val = field.defaultValue || "";

        switch (field.controlType) {
            case 2: // 文本域
                return $('<textarea></textarea>').addClass("col-xs-12").attr("disabled", "disabled").val(val);
            case 3: // 数字
                return $('<input type="number">').addClass("col-xs-12").attr("disabled", "disabled").val(val);
            case 4: // 下拉
                var $sel = $('<select></select>').addClass("col-xs-12").attr("disabled", "disabled");
                $('<option></option>').text(val || "请选择").appendTo($sel);
                return $sel;
            case 5: // 日期
                return $('<input type="text">').addClass("col-xs-12").attr("disabled", "disabled").attr("placeholder", "YYYY-MM-DD").val(val);
            case 6: // 用户选择
                return $('<input type="text">').addClass("col-xs-12").attr("disabled", "disabled").attr("placeholder", "选择用户").val(val);
            case 7: // 部门选择
                return $('<input type="text">').addClass("col-xs-12").attr("disabled", "disabled").attr("placeholder", "选择部门").val(val);
            case 8: // 附件
                return $('<button></button>').addClass("btn btn-minier btn-danger").attr("disabled", "disabled").html('<i class="icon-upload"></i> 上传');
            default: // 文本
                return $('<input type="text">').addClass("col-xs-12").attr("disabled", "disabled").val(val);
        }
    }

    // ===== 5. 选中字段,加载属性面板 =====
    function selectField(index) {

        form.selectedIndex = index;
        renderPreview();

        var field = form.fields[index];
        if (!field) {
            com.focusPage("#propForm").hide();
            com.focusPage("#propEmpty").show();
            return;
        }

        com.focusPage("#propEmpty").hide();
        com.focusPage("#propForm").show();

        com.focusPage("#fieldIndex").val(index);
        com.focusPage("#fieldKey").val(field.fieldKey);
        com.focusPage("#fieldLabel").val(field.fieldLabel);
        com.focusPage("#required").prop("checked", field.required == 1);
        com.focusPage("#defaultValue").val(field.defaultValue);
        com.focusPage("#dataSource").val(field.dataSource);
        com.focusPage("#validateRule").val(field.validateRule);
    }

    // 应用属性修改
    com.focusPage("#applyPropBtn").click(function() {

        var idx = parseInt(com.focusPage("#fieldIndex").val());
        var field = form.fields[idx];
        if (!field) return;

        field.fieldKey = com.focusPage("#fieldKey").val() || field.fieldKey;
        field.fieldLabel = com.focusPage("#fieldLabel").val() || field.fieldLabel;
        field.required = com.focusPage("#required").prop("checked") ? 1 : 0;
        field.defaultValue = com.focusPage("#defaultValue").val();
        field.dataSource = com.focusPage("#dataSource").val();
        field.validateRule = com.focusPage("#validateRule").val();

        renderPreview();
        com.showAlert(com.info, "属性已应用");
    });

    // 删除字段
    com.focusPage("#deleteFieldBtn").click(function() {

        var idx = parseInt(com.focusPage("#fieldIndex").val());
        form.fields.splice(idx, 1);
        form.selectedIndex = null;

        // 重排序号
        $.each(form.fields, function(i, f) { f.sortOrder = i; });

        renderPreview();
        com.focusPage("#propForm").hide();
        com.focusPage("#propEmpty").show();
    });

    // ===== 6. 编辑模式:加载已有表单 =====
    if (form.data && form.data.formId) {

        com.focusPage("#code").val(form.data.code).prop("disabled", true);
        com.focusPage("#name").val(form.data.name);
        com.focusPage("#comment").val(form.data.comment);

        com.post(api.approval.queryApprovalFormField, { "form.formId": form.data.formId }, function(res) {
            form.fields = res.formFields || [];
            renderPreview();
        });
    }

    // ===== 7. 提交 =====
    com.focusPage("#submitBtn").click(function() {

        if (com.validate("#formForm")) return false;

        var options = {
            "form.code": com.focusPage("#code").val(),
            "form.name": com.focusPage("#name").val(),
            "form.comment": com.focusPage("#comment").val()
        };

        var flowIdVal = com.focusPage("#flowId").val();
        if (flowIdVal) options["form.flowId"] = flowIdVal;

        $.each(form.fields, function(i, field) {
            options["formFields[" + i + "].fieldKey"] = field.fieldKey;
            options["formFields[" + i + "].fieldLabel"] = field.fieldLabel;
            options["formFields[" + i + "].controlType"] = field.controlType;
            options["formFields[" + i + "].sortOrder"] = field.sortOrder;
            options["formFields[" + i + "].required"] = field.required;
            options["formFields[" + i + "].status"] = field.status;
            if (field.defaultValue) options["formFields[" + i + "].defaultValue"] = field.defaultValue;
            if (field.dataSource) options["formFields[" + i + "].dataSource"] = field.dataSource;
            if (field.validateRule) options["formFields[" + i + "].validateRule"] = field.validateRule;
        });

        var apiUrl = api.approval.addApprovalForm;

        if (form.data && form.data.formId) {
            options["form.formId"] = form.data.formId;
            apiUrl = api.approval.updateApprovalForm;
        }

        com.post(apiUrl, options, function(res) {
            com.showAlert(com.info, "保存成功");
            com.closePopup();
        });
    });

    // ===== 初始化 =====
    renderControlLib();
    loadFlowSelect();

});
