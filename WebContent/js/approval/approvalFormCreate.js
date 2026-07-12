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

    // ===== 字段列表渲染 =====
    function renderFields() {

        var $list = com.focusPage("#fieldList").empty();

        com.focusPage("#notfield").toggle(form.fields.length === 0);

        $.each(form.fields, function(i, field) {
            var $li = $('<li></li>').addClass("item-blue").css({ "padding": "8px", "margin": "4px 0", "border": "1px solid #ddd", "border-radius": "4px" });

            $('<div></div>').html(
                "<strong>" + field.fieldLabel + " (" + field.fieldKey + ")</strong>" +
                " <span class='label label-warning'>" + (controlMap[field.controlType] || field.controlType) + "</span>" +
                (field.required == 1 ? " <span class='label label-important'>必填</span>" : "") +
                " <span class='label label-info'>排序" + field.sortOrder + "</span>"
            ).appendTo($li);

            var $btnGroup = $('<div></div>').css("margin-top", "5px");
            $('<button></button>').addClass("btn btn-minier btn-yellow").text("编辑").on("click", function() { editField(i); }).appendTo($btnGroup);
            $('<button></button>').addClass("btn btn-minier btn-danger").text("删除").css("margin-left", "5px").on("click", function() { deleteField(i); }).appendTo($btnGroup);

            $btnGroup.appendTo($li);
            $list.append($li);
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
            defaultValue: form.items.defaultValue.val() || null,
            dataSource: form.items.dataSource.val() || null,
            validateRule: form.items.validateRule.val() || null,
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
            "form.flowId": com.focusPage("#flowId").val() || null,
            "form.comment": com.focusPage("#comment").val(),
            "formFields": JSON.stringify(form.fields)
        };

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
