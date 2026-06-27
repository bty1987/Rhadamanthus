$(function() {

    var avenger = {

        btns: {
            saveBtn: com.focusPage("#saveUserBtn"),

            advanceSaveBtn: com.focusPage("#advanceSaveBtn")
        },

        modals: {
            advanceModal: com.focusPage("#avengerAdvanceModal")
        },

        items: {

            isLogin: com.focusPage("#isLogin", "#avengerAdvanceModal"),
            extranet: com.focusPage("#extranet", "#avengerAdvanceModal"),
            roleSel: com.focusPage("#roleSel", "#avengerAdvanceModal"),
        },

        deptType: {},
        statusType: {},

        roleList: {},

        userId: null,
        company: null,
        supplierUid: null
    };

    avenger.items.statusSel = com.focusPage("#statusSel").bindData(constant.personel().user.status.datas, "key", "value");

    com.post(api.system.queryRole, {
        "timestamp": new Date().getTime()
    }, function(res) {

        avenger.items.roleSel.bindData(res.roleList, "rid", "name");
    }, null, false);

    com.post(api.system.queryCompany, {}, function(res) {

        avenger.items.company.bindData(res.companys, "cid", "name");
    }, null, false);

    avenger.btns.advanceSaveBtn.on("click", saveAdvance);

    var lineprops = (function() {

        return [{
            field: "userId",
            name: "编号",
            prop: "userId",
            clazz: "grey"
        }, {
            field: "loginId",
            name: "用户名",
            prop: "loginId",
            clazz: "grey"
        }, {
            field: "dept.name",
            name: "部门",
            prop: "dept.name",
            clazz: "grey"
        }, {
            field: "duty.name",
            name: "职位",
            prop: "duty.name",
            clazz: "grey"
        }, {
            field: "phone",
            name: "联系方式",
            prop: "phone",
            clazz: "grey"
        }];
    })();

    var linebtns = (function() {

        return {
            right: {
                name: "权配",
                clazz: "btn-success",
                handle: function(v) {

                    showAdvance(v.userId);
                }
            },
            resetPassword: {
                name: "重置密码",
                clazz: "btn-danger",
                handle: function(v) {

                    resetPassword(v.userId, v.userName);
                }
            },
            defaultPassword: {
                name: "默认密码",
                clazz: "btn-warning",
                handle: function(v) {

                    defaultPassword(v.userId, v.userName);
                }
            }
        };
    })();

    var searcher = new Searcher();

    searcher.set("condList", "pagenation", "resultList", api.personel.pageAvenger, null, ['personel-userId', 'personel-userName', 'personel-userstatus', 'personel-phone'], "avengerPostData", null, false, null);
    searcher.line("userName", lineprops, linebtns).render();

    function showAdvance(userId) {

        avenger.userId = userId;

        var options = {
            "user.userId": userId
        };

        com.post(api.personel.queryUserByUserId, options, function(res) {

            var user = res.user;

            avenger.items.isLogin.prop("checked", (user.isLogin & 1) == 1 ? true : false);
            avenger.items.extranet.prop("checked", user.extranet == 1 ? true : false);

            avenger.items.roleSel.val(user.role.rid);

            avenger.modals.advanceModal.modal("show");

        }, null, false);
    }

    function saveAdvance() {

        var options = {
            "user.userId": avenger.userId,
            "user.isLogin": avenger.items.isLogin.prop("checked") ? 1 : -1,
            "user.extranet": avenger.items.extranet.prop("checked") ? 1 : 0,
            "user.role.rid": avenger.items.roleSel.val(),
        };

        com.post(api.personel.updateUserForAdvance, options, function(res) {

            com.showAlert(com.info, "提交成功");
        });

        avenger.modals.advanceModal.modal("hide");

        return false;
    }

    function resetPassword(userId, userName) {

        com.showConfirm("确定要重置(" + userName + ")的密码吗?", function(result) {

            com.post(api.personel.resetPassword, {
                'user.userId': userId
            });
        });
    }

    function defaultPassword(userId, userName) {

        com.showConfirm("确定要重置(" + userName + ")密码为默认密码?", function(result) {

            com.post(api.personel.defaultPassword, {
                'user.userId': userId
            });
        });
    }

});
