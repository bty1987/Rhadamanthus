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

    var displayFunc = (function() {

        var renderList = function(tableId, listData) {

            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (listData && listData.length) {
                $.each(listData, function(i, v) {

                    var $liLine = $('<li></li>').addClass('item-orange clearfix');
                    var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(' ' + v.userName));
                    var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                    var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

                    var $btnRight = $('<a></a>').addClass('btn btn-minier btn-success').html('权配');
                    var $resetPassword = $('<a></a>').addClass('btn btn-minier btn-danger').html('重置密码');
                    var $defaultPassword = $('<a></a>').addClass('btn btn-minier btn-warning').html('默认密码');

                    var propertyArr = [["编号:", v.userId, "grey"], ["用户名:", v.loginId, "grey"], ["部门:", v.dept.name, "grey"], ["职位:", v.duty.name, "grey"], ["联系方式:", v.phone, "grey"]];

                    $.each(propertyArr, function(index, value) {

                        var $liProperty = $('<li></li>');
                        $('<strong></strong>').html(value[0]).appendTo($liProperty);
                        $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                        $liProperty.appendTo($ulProperty);
                    });

                    com.focusPage('#closeM').click(function() {

                        com.focusPage("#tree3").removeData("tree");
                    });

                    $btnRight.click(function() {

                        showAdvance(v.userId);
                    });

                    $resetPassword.click(function() {

                        resetPassword(v.userId, v.userName);
                    });

                    $defaultPassword.click(function() {

                        defaultPassword(v.userId, v.userName);
                    });

                    $divBtnWrap.append($btnRight).append($resetPassword).append($defaultPassword).appendTo($h3);

                    $liLine.append($h3).append($ulProperty).appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };
        return {
            init: function(tableId, listData) {

                com.focusPage('#' + tableId).html(null);
                renderList(tableId, listData);
            }
        }
    })();
    var _condArr = ['personel-userId', 'personel-userName', 'personel-userstatus', 'personel-phone'];

    var seacher = new Searcher();

    seacher.init(_condArr, "condList", api.personel.pageAvenger, function(data) {

        displayFunc.init('resultList', data);
    }, "pagenation", "avengerPostData", null, false, null);

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
