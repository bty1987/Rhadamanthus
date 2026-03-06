jQuery(function($) {

    var decorationAtttype = {

        daid: null,

        status: ["启用", "禁用"],
    };

    var seacher = new Searcher();

    seacher.base("condList", "pagenation", "resultList", api.data.pageDecorationAtttype);

    seacher.history("decorationAtttypePostData");

    var lineprops = [{
        field: "name",
        name: "名称",
        prop: "name",
        clazz: "red",
    }, {
        field: "key",
        name: "键值",
        prop: "key",
        clazz: "red",
    }, {
        field: "type",
        name: "类型",
        prop: "type",
        clazz: "red",
        dataset: constant.data().decorationAtttype.type.keys
    }, {
        field: "manageDiscount",
        name: "管理费折扣",
        prop: "manageDiscount",
        clazz: "red",
        formatter: function(value) {
            // 0=不打折, 1=打折
            return value == 0 ? '<span class="label label-default">不打折</span>' : '<span class="label label-success">打折</span>';
        }
    }, {
        field: "taxDiscount",
        name: "税金折扣",
        prop: "taxDiscount",
        clazz: "red",
        formatter: function(value) {
            // 0=不打折, 1=打折
            return value == 0 ? '<span class="label label-default">不打折</span>' : '<span class="label label-success">打折</span>';
        }
    }, {
        field: "status",
        name: "状态",
        prop: "status",
        clazz: "red",
        dataset: decorationAtttype.status
    }, ];

    // 编辑按钮
    var linebtus = [{
        text: "编辑",
        icon: "icon-edit",
        click: function(row) {
            openEditDialog(row);
        }
    }];

    seacher.line("name", lineprops, linebtus).render();

    /**
     * 打开编辑弹窗
     */
    function openEditDialog(row) {
        var dialogHtml = '<div class="modal-dialog" style="width: 500px;">' +
            '  <div class="modal-content">' +
            '    <div class="modal-header">' +
            '      <button type="button" class="close" data-dismiss="modal">&times;</button>' +
            '      <h4 class="modal-title">编辑装饰属性类型</h4>' +
            '    </div>' +
            '    <div class="modal-body">' +
            '      <form id="editForm" class="form-horizontal">' +
            '        <div class="form-group">' +
            '          <label class="col-sm-4 control-label">名称：</label>' +
            '          <div class="col-sm-7">' +
            '            <input type="text" class="form-control" value="' + row.name + '" disabled>' +
            '          </div>' +
            '        </div>' +
            '        <div class="form-group">' +
            '          <label class="col-sm-4 control-label">管理费折扣：</label>' +
            '          <div class="col-sm-7">' +
            '            <select id="manageDiscount" class="form-control">' +
            '              <option value="0" ' + (row.manageDiscount == 0 ? 'selected' : '') + '>不打折</option>' +
            '              <option value="1" ' + (row.manageDiscount == 1 ? 'selected' : '') + '>打折</option>' +
            '            </select>' +
            '          </div>' +
            '        </div>' +
            '        <div class="form-group">' +
            '          <label class="col-sm-4 control-label">税金折扣：</label>' +
            '          <div class="col-sm-7">' +
            '            <select id="taxDiscount" class="form-control">' +
            '              <option value="0" ' + (row.taxDiscount == 0 ? 'selected' : '') + '>不打折</option>' +
            '              <option value="1" ' + (row.taxDiscount == 1 ? 'selected' : '') + '>打折</option>' +
            '            </select>' +
            '          </div>' +
            '        </div>' +
            '      </form>' +
            '    </div>' +
            '    <div class="modal-footer">' +
            '      <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>' +
            '      <button type="button" class="btn btn-primary" id="saveBtn">保存</button>' +
            '    </div>' +
            '  </div>' +
            '</div>';

        var $dialog = $(dialogHtml);
        $('body').append($dialog);
        $dialog.modal({ backdrop: 'static' });

        // 取消时移除弹窗
        $dialog.on('hidden.bs.modal', function() {
            $dialog.remove();
        });

        // 保存按钮
        $dialog.find('#saveBtn').on('click', function() {
            var manageDiscount = $dialog.find('#manageDiscount').val();
            var taxDiscount = $dialog.find('#taxDiscount').val();

            com.post(api.data.updateDecorationAtttype, {
                "decorationAtttype.daid": row.daid,
                "decorationAtttype.manageDiscount": manageDiscount,
                "decorationAtttype.taxDiscount": taxDiscount
            }, function(res) {
                com.showAlert(com.info, "保存成功");
                $dialog.modal('hide');
                seacher.reload(); // 刷新列表
            });
        });
    }

});
