jQuery(function($) {

    var form = {
        data: params.approval.form,
        fields: [],
        selectedIndex: null
    };

    // popup 子页 DOM 在 layer 容器内,统一用 com.focusPage(基于 active tab scope)

    // 基础控件定义(含图标/颜色)
    var controlDefs = [
        { type: 1, name: "文本",      icon: "icon-font",        color: "btn-info" },
        { type: 2, name: "文本域",    icon: "icon-align-left",   color: "btn-info" },
        { type: 3, name: "数字",      icon: "icon-asterisk",     color: "btn-success" },
        { type: 4, name: "下拉",      icon: "icon-chevron-down", color: "btn-warning" },
        { type: 5, name: "日期",      icon: "icon-calendar",     color: "btn-warning" },
        { type: 6, name: "用户选择",  icon: "icon-user",         color: "btn-primary" },
        { type: 7, name: "部门选择",  icon: "icon-group",        color: "btn-primary" },
        { type: 8, name: "附件",      icon: "icon-paperclip",    color: "btn-danger" }
    ];
    var controlMap = {};
    $.each(controlDefs, function(i, c) { controlMap[c.type] = c; });

    // 业务控件类型 → 前端分组的映射(processRefer.type)
    var referGroupMap = {
        "query":     { label: "查询类",   icon: "icon-search",     color: "btn-success" },
        "filling":   { label: "自动填充", icon: "icon-magic",      color: "btn-primary" },
        "condition": { label: "条件校验", icon: "icon-check-sign", color: "btn-purple" }
    };
    // processRefer.type → approvalFormField.controlType 的映射
    var referControlTypeMap = {
        "query": 6,     // 用户选择(选装修单)
        "filling": 1,   // 文本(只读填充)
        "select": 4,    // 下拉
        "text": 1,      // 文本
        "textarea": 2,  // 文本域
        "datetime": 5,  // 日期
        "upload": 8,    // 附件
        "condition": 3  // 数字(条件阈值)
    };

    // ===== 1. 渲染控件库(基础控件 + 业务控件) =====
    function renderControlLib() {

        var $lib = com.focusPage("#controlLib");

        // 1a. 基础控件
        $('<h6></h6>').addClass("header lighter grey").html('<i class="icon-th-large"></i> 基础控件').appendTo($lib);

        $.each(controlDefs, function(i, c) {
            var $btn = makeControlBtn(c.icon, c.color, c.name, false);
            $btn.on("click", function() { addField(c.type, null, null); });
            $lib.append($btn);
        });

        // 1b. 业务控件(从 processRefer 动态加载)
        $('<h6></h6>').addClass("header lighter grey")
            .css("margin-top", "15px")
            .html('<i class="icon-building"></i> 业务控件')
            .appendTo($lib);
        $('<p></p>').addClass("muted small").text("字段键自动绑定业务字段").appendTo($lib);

        com.post(api.approval.queryProcessRefer, {}, function(res) {

            var refers = res.processRefers || [];

            // 按 type 分组
            var grouped = {};
            $.each(refers, function(i, r) {
                if (!grouped[r.type]) grouped[r.type] = [];
                grouped[r.type].push(r);
            });

            // 按分组的顺序渲染
            var groupOrder = ["query", "filling", "condition", "select", "text", "textarea", "datetime", "upload"];
            $.each(groupOrder, function(gi, type) {

                if (!grouped[type]) return;
                var group = referGroupMap[type];

                if (group) {
                    // query/filling/condition 有分组标题
                    $('<div></div>').addClass("small muted")
                        .css({ "margin-top": "8px", "margin-bottom": "2px" })
                        .text(group.label).appendTo($lib);
                }

                $.each(grouped[type], function(i, r) {

                    var icon = group ? group.icon : "icon-pencil";
                    var color = group ? group.color : "btn-default";

                    var $btn = makeControlBtn(icon, color, r.name, true);
                    $btn.attr("data-refer-id", r.id).attr("data-refer-type", r.type).attr("data-refer-name", r.name);
                    $btn.on("click", function() {
                        var controlType = referControlTypeMap[r.type] || 1;
                        addField(controlType, r.id, r.name);
                    });
                    $lib.append($btn);
                });
            });
        });
    }

    function makeControlBtn(icon, color, name, isBiz) {

        var $btn = $('<a></a>')
            .addClass("btn btn-xs " + color)
            .css({ "width": "95%", "margin": "2px 2.5%", "text-align": "left", "padding": "4px 8px", "font-size": "12px" });
        $('<i></i>').addClass(icon).css("margin-right", "4px").appendTo($btn);
        $('<span></span>').text(name).appendTo($btn);
        if (isBiz) {
            $('<i></i>').addClass("icon-link pull-right").css("opacity", "0.6").appendTo($btn);
        }
        return $btn;
    }

    // ===== 2. 加载关联流程下拉 =====
    function loadFlowSelect() {

        com.post(api.approval.pageApprovalFlow, { "paging.page": 1, "paging.rows": 999 }, function(res) {
            var flows = res.paging.data || [];
            var $sel = com.focusPage("#flowId");

            $.each(flows, function(i, f) {
                if (f.status == 0) {
                    $('<option></option>').val(f.flowId).text(f.name + " (" + f.code + ")").appendTo($sel);
                }
            });
        });
    }

    // ===== 3. 添加字段 =====
    // controlType: 前端控件类型(1-8)
    // referId: 业务字段标识(来自 processRefer.id, 如 "orderId"), null 表示基础控件
    // referName: 业务字段中文名(来自 processRefer.name, 如 "装修单号")
    function addField(controlType, referId, referName) {

        var c = controlMap[controlType] || controlDefs[0];
        var seq = form.fields.length;

        var field = {
            fieldKey: referId || ("field_" + (seq + 1)),
            fieldLabel: referName || (c.name + "字段"),
            controlType: controlType,
            sortOrder: seq,
            required: referId ? 1 : 0,
            defaultValue: "",
            dataSource: "",
            validateRule: "",
            status: 0,
            referId: referId || ""
        };

        form.fields.push(field);
        renderPreview();
        selectField(seq);
    }

    // ===== 4. 渲染表单预览 =====
    function renderPreview() {

        var $preview = com.focusPage("#formPreview");
        $preview.empty();

        com.focusPage("#notfield").toggle(form.fields.length === 0);

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

            // 业务字段标记
            if (field.referId) {
                $('<i></i>').addClass("icon-link").css({ "margin-left": "3px", "color": "#999", "font-size": "10px" })
                    .attr("title", "业务字段: " + field.referId).appendTo($label);
            }
            $label.appendTo($row);

            // 控件渲染
            var $ctrl = $('<div></div>').addClass("col-sm-8");
            $ctrl.append(renderControl(field));
            $ctrl.appendTo($row);

            $row.on("click", function() {
                selectField(parseInt($(this).attr("data-index")));
            });

            $preview.append($row);
        });
    }

    // 按控件类型渲染预览控件
    function renderControl(field) {

        var val = field.defaultValue || "";
        var isBiz = !!field.referId;
        var placeholder = isBiz ? "自动填充" : "";

        switch (field.controlType) {
            case 2:
                return $('<textarea></textarea>').addClass("col-xs-12").attr("disabled", "disabled").attr("placeholder", placeholder).val(val);
            case 3:
                return $('<input type="number">').addClass("col-xs-12").attr("disabled", "disabled").val(val);
            case 4:
                var $sel = $('<select></select>').addClass("col-xs-12").attr("disabled", "disabled");
                $('<option></option>').text(val || "请选择").appendTo($sel);
                return $sel;
            case 5:
                return $('<input type="text">').addClass("col-xs-12").attr("disabled", "disabled").attr("placeholder", "YYYY-MM-DD").val(val);
            case 6:
                return $('<input type="text">').addClass("col-xs-12").attr("disabled", "disabled").attr("placeholder", isBiz ? "选择装修单" : "选择用户").val(val);
            case 7:
                return $('<input type="text">').addClass("col-xs-12").attr("disabled", "disabled").attr("placeholder", "选择部门").val(val);
            case 8:
                return $('<button></button>').addClass("btn btn-minier btn-danger").attr("disabled", "disabled").html('<i class="icon-upload"></i> 上传');
            default:
                return $('<input type="text">').addClass("col-xs-12").attr("disabled", "disabled").attr("placeholder", placeholder).val(val);
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
        com.focusPage("#fieldKey").val(field.fieldKey).prop("disabled", !!field.referId);
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
