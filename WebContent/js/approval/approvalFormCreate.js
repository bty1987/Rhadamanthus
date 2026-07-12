jQuery(function($) {

    var form = {
        data: params.approval.form,
        fields: [],
        editIndex: null,

        modal: com.focusPage("#fieldModal").on('hide.bs.modal', function() {
            com.cleanItems(form.items);
            form.editIndex = null;
        }),

        items: {
            fieldKey: com.focusPage("#fieldKey"),
            fieldLabel: com.focusPage("#fieldLabel"),
            controlType: com.focusPage("#controlType"),
            sortOrder: com.focusPage("#sortOrder"),
            required: com.focusPage("#required"),
            defaultValue: com.focusPage("#defaultValue"),
            dataSource: com.focusPage("#dataSource"),
            validateRule: com.focusPage("#validateRule")
        }
    };

    var controlMap = { 1: "文本", 2: "文本域", 3: "数字", 4: "下拉", 5: "日期", 6: "用户选择", 7: "部门选择", 8: "附件" };

    // ===== 编辑模式:加载已有表单 + 字段 =====
    if (form.data && form.data.formId) {

        com.focusPage("#code").val(form.data.code).prop("disabled", true);
        com.focusPage("#name").val(form.data.name);
        com.focusPage("#flowId").val(form.data.flowId);
        com.focusPage("#comment").val(form.data.comment);

        com.post(api.approval.queryApprovalFormField, { "form.formId": form.data.formId }, function(res) {
            form.fields = res.formFields || [];
            renderFields();
        });
    }

    // ===== 字段列表渲染(表格) =====
    function renderFields() {

        var $body = com.focusPage("#fieldBody").empty();

        com.focusPage("#fieldTable").toggle(form.fields.length > 0);
        com.focusPage("#notfield").toggle(form.fields.length === 0);

        $.each(form.fields, function(i, field) {

            var $tr = $('<tr></tr>');

            $('<td></td>').text(field.sortOrder).appendTo($tr);
            $('<td></td>').text(field.fieldKey).appendTo($tr);
            $('<td></td>').text(field.fieldLabel).appendTo($tr);
            $('<td></td>').html("<span class='label label-warning'>" + (controlMap[field.controlType] || field.controlType) + "</span>").appendTo($tr);
            $('<td></td>').html(field.required == 1 ? "<span class='label label-important'>是</span>" : "否").appendTo($tr);

            var detail = field.defaultValue ? "默认:" + field.defaultValue + " " : "";
            detail += field.dataSource ? "<br/>数据源:" + field.dataSource.substring(0, 30) : "";
            detail += field.validateRule ? "<br/>验证:" + field.validateRule : "";
            $('<td></td>').addClass("small muted").html(detail || "-").appendTo($tr);

            var $btnTd = $('<td></td>');
            $('<button></button>').addClass("btn btn-minier btn-yellow").html('<i class="icon-edit"></i>').attr("title", "编辑").on("click", function() { editField(i); }).appendTo($btnTd);
            $('<button></button>').addClass("btn btn-minier btn-danger").html('<i class="icon-trash"></i>').css("margin-left", "3px").attr("title", "删除").on("click", function() { deleteField(i); }).appendTo($btnTd);
            $btnTd.appendTo($tr);

            $body.append($tr);
        });
    }

    // ===== 添加 / 编辑字段 =====
    com.focusPage("#addFieldBtn").click(function() {
        form.editIndex = null;
        com.cleanItems(form.items);
        form.items.sortOrder.val(form.fields.length);
        form.modal.modal("show");
    });

    function editField(index) {
        form.editIndex = index;
        var field = form.fields[index];
        form.items.fieldKey.val(field.fieldKey);
        form.items.fieldLabel.val(field.fieldLabel);
        form.items.controlType.val(field.controlType);
        form.items.sortOrder.val(field.sortOrder);
        form.items.required.val(field.required);
        form.items.defaultValue.val(field.defaultValue);
        form.items.dataSource.val(field.dataSource);
        form.items.validateRule.val(field.validateRule);
        form.modal.modal("show");
    }

    function deleteField(index) {
        com.showConfirm("确认删除该字段?", function() {
            form.fields.splice(index, 1);
            renderFields();
        });
    }

    com.focusPage("#saveFieldBtn").click(function() {

        if (com.validate("#fieldFormField")) return false;

        var field = {
            fieldKey: form.items.fieldKey.val(),
            fieldLabel: form.items.fieldLabel.val(),
            controlType: parseInt(form.items.controlType.val()),
            sortOrder: parseInt(form.items.sortOrder.val() || 0),
            required: parseInt(form.items.required.val()),
            defaultValue: form.items.defaultValue.val() || "",
            dataSource: form.items.dataSource.val() || "",
            validateRule: form.items.validateRule.val() || "",
            status: 0
        };

        if (form.editIndex !== null) {
            form.fields[form.editIndex] = field;
        } else {
            form.fields.push(field);
        }

        renderFields();
        form.modal.modal("hide");
    });

    // ===== 提交表单 =====
    com.focusPage("#submitBtn").click(function() {

        if (com.validate("#formForm")) return false;

        var options = {
            "form.code": com.focusPage("#code").val(),
            "form.name": com.focusPage("#name").val(),
            "form.comment": com.focusPage("#comment").val()
        };

        // flowId 选填,有值才传(避免传 null 被 jQuery 序列化成 "null" 字符串)
        var flowIdVal = com.focusPage("#flowId").val();
        if (flowIdVal) {
            options["form.flowId"] = flowIdVal;
        }

        // 嵌套 List 参数:直接传数组对象(与 process2create.js 一致),
        // jQuery $.param 展开成 formFields[0].fieldKey=xxx&formFields[0].fieldLabel=yyy,
        // Struts2 OGNL 自动组装成 List<ApprovalFormFieldVO>。
        // 不能用 JSON.stringify(会变成字符串,Struts2 无法转换)。
        $.each(form.fields, function(i, field) {
            options["formFields[" + i + "].fieldKey"] = field.fieldKey;
            options["formFields[" + i + "].fieldLabel"] = field.fieldLabel;
            options["formFields[" + i + "].controlType"] = field.controlType;
            options["formFields[" + i + "].sortOrder"] = field.sortOrder;
            options["formFields[" + i + "].required"] = field.required;
            options["formFields[" + i + "].status"] = field.status;
            // 选填字段:有值才传,避免 "null" 字符串污染
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

});
