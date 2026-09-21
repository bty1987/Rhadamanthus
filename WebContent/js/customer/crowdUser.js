jQuery(function ($) {

    var groupUser = {
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

    groupUser.saveBtn.bindClick(saveData);

    groupUser.modals.groupUserModal.on("hide.bs.modal", function () {
        com.clearValidator();
        com.cleanTypeahead('userSel');
        com.cleanItems(groupUser.items);
    });

    com.initTypeahead('userSel', api.personel.queryUserByPinyin, "pinyinName", {"user.status": "0", "departmentType.name": ""}, "autoFillKeyValue", "key", "value", null);

    // 获取页面控制参数(按公司差异化配置)
    var pageConfig = customerPage.getConfig("crowdUser");

    // pageBtn 配置为空时, 所有按钮按原逻辑显示; 否则需在 pageBtn 中存在
    function btnVisible(key) {

        return pageConfig.pageBtn.length == 0 || pageConfig.pageBtn.contains(key);
    }

    var lineprops = (function() {

        var propertyMap = {
            "userId": {
                field: "user.userId",
                name: "编号",
                prop: "user.userId",
                clazz: "grey"
            },
            "duty": {
                field: "user.duty.name",
                name: "职位",
                prop: "user.duty.name",
                clazz: "grey"
            },
            "type": {
                field: "type",
                name: "类型",
                prop: function(v) {
                    var fallback = { 0: '业务', 1: '装饰', 2: '服务', 3: '合同', 4: '销售', 99: '其他' };
                    var key = v.type == null ? 99 : v.type;
                    var enumNode = constant.decoration().decorationUser.type;
                    if (enumNode && enumNode.keys && enumNode.keys[key] != undefined) return enumNode.keys[key];
                    return fallback[key] || '其他';
                },
                clazz: "grey"
            },
            "content": {
                field: "content",
                name: "说明",
                prop: "content",
                clazz: "grey"
            }
        };

        if (pageConfig.propertyArr.length == 0) {

            var all = [];
            $.each(propertyMap, function (key, prop) { all.push(prop); });
            return all;
        }

        var props = [];
        $.each(pageConfig.propertyArr, function (i, key) {

            if (propertyMap[key]) props.push(propertyMap[key]);
        });
        return props;
    })();

    var linebtns = (function() {

        return {
            del: {
                name: "删除",
                clazz: "btn-danger",
                handle: function(v) {

                    deleteGroupUser(v.duid);
                },
                show: function() { return btnVisible("del"); }
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

    searcher.set("condListas", "pagenationas", "resultListas", pageConfig.apiPage || api.decoration.queryDecorationUser, {"decorationUser.orderId": groupUser.gorderId}, pageConfig.condArr, "groupUserPostData", null, false, buttons);
    searcher.line("user.currentName", lineprops, linebtns).render();

    com.focusPage('#addGroupUser', '#pagenationas').click(function () {
        groupUser.editFlg = false;

        fillCommentOptions();

        groupUser.modals.groupUserModal.modal("show");
    });

    // 角色建议: communion.constant decoration.decorationUser.contentRole 驱动 datalist(customer 页无 decorationUtils, 本地实现)
    function fillCommentOptions() {

        var $datalist = com.focusPage("#commentOptions");

        if ($datalist.length == 0 || $datalist.children().length > 0) return;

        var roleNode = constant.decoration().decorationUser.contentRole;

        if (!roleNode || !roleNode.datas || roleNode.datas.length == 0) return;

        $.each(roleNode.datas, function (i, v) {
            $('<option></option>').attr("value", v.value).appendTo($datalist);
        });
    }

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
            'decorationUser.orderId': groupUser.gorderId,
            'decorationUser.type': com.focusPage("#guType").val(),
            'decorationUser.content': groupUser.items.comment.val()
        };

        com.post(api.decoration.addDecorationUser, options, function (res) {
            searcher.doSearch();
        }, null, false);
        groupUser.modals.groupUserModal.modal("hide");
    }

});