jQuery(function($) {

    // ===== 加载表单列表(不分页) =====
    function loadFormList() {

        com.post(api.approval.queryApprovalForm, {}, function(res) {

            var $body = com.focusPage("#formBody").empty();
            var forms = res.forms || [];

            com.focusPage("#notForm").toggle(forms.length === 0);

            $.each(forms, function(i, v) {

                var $tr = $('<tr></tr>');

                $('<td></td>').text(v.name).appendTo($tr);
                $('<td></td>').addClass("blue").text(v.code).appendTo($tr);
                $('<td></td>').text(v.flowId || "-").appendTo($tr);
                $('<td></td>').html(v.status == 0
                    ? "<span class='label label-success'>启用</span>"
                    : "<span class='label label-default'>禁用</span>").appendTo($tr);

                var $btnTd = $('<td></td>');

                $('<button></button>').addClass("btn btn-minier btn-yellow")
                    .html('<i class="icon-edit"></i> 编辑')
                    .on("click", function() {
                        params.approval.form = v;
                        com.popup4page("#layerPopUp", api.index.createApprovalFormIndex.url, "编辑表单", null, function() {
                            loadFormList();
                        });
                    }).appendTo($btnTd);

                $('<button></button>').addClass("btn btn-minier " + (v.status == 0 ? "btn-warning" : "btn-success"))
                    .css("margin-left", "3px")
                    .text(v.status == 0 ? "禁用" : "启用")
                    .on("click", function() {
                        com.post(api.approval.updateApprovalFormForStatus, {
                            "form.formId": v.formId,
                            "form.status": v.status == 0 ? 1 : 0
                        }, function() {
                            loadFormList();
                        });
                    }).appendTo($btnTd);

                $('<button></button>').addClass("btn btn-minier btn-danger")
                    .css("margin-left", "3px")
                    .html('<i class="icon-trash"></i> 删除')
                    .on("click", function() {
                        com.showConfirm("确认删除该表单?关联的字段将一并删除。", function() {
                            com.post(api.approval.deleteApprovalForm, {
                                "form.formId": v.formId
                            }, function() {
                                com.showAlert(com.info, "删除成功");
                                loadFormList();
                            });
                        });
                    }).appendTo($btnTd);

                $btnTd.appendTo($tr);
                $body.append($tr);
            });
        });
    }

    loadFormList();

    com.focusPage("#addApprovalForm").click(function() {
        params.approval.form = null;
        com.popup4page("#layerPopUp", api.index.createApprovalFormIndex.url, "添加表单", null, function() {
            loadFormList();
        });
    });

});
