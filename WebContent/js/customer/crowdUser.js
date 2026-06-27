jQuery(function ($) {

    var approve = {
        saveBtn: com.focusPage("#saveBtn"),
        cancelBtn: com.focusPage("#cancelBtn"),

        modals: {
            groupUserModal: com.focusPage("#groupUserModal")
        },
        items: {
            userSel: com.focusPage("#userSel"),
            comment: com.focusPage("#comment")
        },

        gorderId: params.customer.orderId,
        editFlg: false,
        postParam: {}
    };

    approve.saveBtn.bindClick(saveData);

    approve.modals.groupUserModal.on("hide.bs.modal", function () {
        com.clearValidator();
        com.cleanTypeahead('userSel');
        com.cleanItems(approve.items);
    });

    com.initTypeahead('userSel', api.personel.queryUserByPinyin, "pinyinName", {"user.status": "0", "departmentType.name": ""}, "autoFillKeyValue", "key", "value", null);

    var lineprops = (function() {

        return [{
            field: "user.userId",
            name: "编号",
            prop: "user.userId",
            clazz: "grey"
        }, {
            field: "user.duty.name",
            name: "职位",
            prop: "user.duty.name",
            clazz: "grey"
        }, {
            field: "content",
            name: "说明",
            prop: "content",
            clazz: "grey"
        }];
    })();

    var linebtns = (function() {

        return {
            del: {
                name: "删除",
                clazz: "btn-danger",
                handle: function(v) {

                    deleteGroupUser(v.duid);
                }
            }
        };
    })();

    var buttons = (function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('id', 'addGroupUser').css("margin", "0px 3px");
        $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    })();

    var searcher = new Searcher();

    searcher.set("condListas", "pagenationas", "resultListas", api.decoration.queryDecorationUser, {"decorationUser.orderId": approve.gorderId}, [], "groupUserPostData", null, false, buildCrowdUserButtons);
    searcher.line("user.currentName", lineprops, linebtns).render();

    com.focusPage('#addGroupUser', '#pagenationas').click(function () {
        approve.editFlg = false;

        approve.modals.groupUserModal.modal("show");
    });

    function deleteGroupUser(duid) {

        com.post(api.decoration.deleteDecorationUser, {"decorationUser.duid": duid}, function () {
            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
        }, null, false);
    }

    function saveData() {

        if (com.validate('form')) {
            return false;
        }

        var options = {
            'decorationUser.user.userId': com.typeahead("userSel"),
            'decorationUser.orderId': approve.gorderId,
            'decorationUser.content': approve.items.comment.val()
        };

        com.post(api.decoration.addDecorationUser, options, function (res) {
            searcher.doSearch();
        }, null, false);
        approve.modals.groupUserModal.modal("hide");
    }

});