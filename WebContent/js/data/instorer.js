$(function() {

    var instorer = {
        $nowLine: null,
        saveBtn: com.focusPage("#saveBtn").on("click", saveData),
        cancelBtn: com.focusPage("#cancelBtn"),
        saveUserBtn: com.focusPage("#saveUserBtn").on("click", saveUser),
        instorerRightModal: com.focusPage("#instorerRightModal").on("show.bs.modal", function(a) {

        }).on("hide.bs.modal", function(a) {

        }),
        modal: com.focusPage("#instorerModal").on("show.bs.modal", function(a) {

            com.clearValidator();
        }).on("hide.bs.modal", function(a) {

            instorer.editFlg = false;
            instorer.repeatFlg = false;
            com.focusPage("#password").removeAttr('disabled')
        }),
        instorerModelItems: {
            instorerName: com.focusPage("#instorerName"),
            loginId: com.focusPage("#loginId"),
            password: com.focusPage("#password"),
        },
        data: {
            materialTypeData: {},
            materialBrandData: {},
            measurementUnitData: {}
        },
        editFlg: !1,
        repeatFlg: !1,
    };
    var tag_input = com.focusPage("#user");

    tag_input.tag({
        placeholder: tag_input.attr('placeholder'),
        isStaticResource: false,
        flsource: {
            url: api.personel.queryUserByPinyin,
            postData: {
                "departmentType.name": '主材部',
                "user.status": 0
            },
            resultList: "autoFillKeyValue",
            keyPath: "key",
            valuePath: "value",
            isResultTypeMap: true, // 是否是key - value 形式的列表
        },
    });

    var lineprops = (function() {

        return [{
            field: "sid",
            name: "厂商ID",
            prop: "sid",
            clazz: "blue"
        }, {
            field: "loginId",
            name: "登陆名",
            prop: "loginId",
            clazz: "grey"
        }, {
            field: "isLogin",
            name: "登陆状态",
            prop: function(v) { return v.isLogin == 0 ? "禁用" : "启用"; },
            clazz: "red"
        }];
    })();

    var linebtns = (function() {

        return {
            edit: {
                name: "编辑",
                clazz: "btn-success",
                handle: function(v) {
                    instorer.$nowLine = v.sid;
                    editInstorer(v);
                }
            },
            status: {
                type: "switch",
                clazz: "status-lbl",
                init: function(v) { return v.isLogin; },
                handle: function(v, checked) { updateStatus(v.sid, checked ? 1 : 0, null); }
            }
        };
    })();

    var buttons = (function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'add').css("margin", "0px 3px");
        $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    })();

    var _condArr = [];

    var searcher = new Searcher();

    searcher.set("condList", "pagenation", "resultList", api.data.pageInstorer, null, _condArr, "materialModelPostData", null, false, buttons);
    searcher.line("currentName", lineprops, linebtns).render();

    $('a[name="add"]', com.focusPage('#pagenation')).click(function() {

        instorer.editFlg = !1;
        com.cleanItems(instorer.instorerModelItems);
        instorer.modal.modal("show");
    });

    function saveData() {

        if (!com.validate('instorerModal') && !instorer.repeatFlg) {

            var _params = {
                "instorer.name": instorer.instorerModelItems.instorerName.val(),
                "instorer.loginId": instorer.instorerModelItems.loginId.val(),
            };

            var extra = instorer.editFlg ? {
                "instorer.sid": instorer.$nowLine
            } : {
                "instorer.password": instorer.instorerModelItems.password.val()
            };

            com.post(instorer.editFlg ? api.data.updateInstorer : api.data.addInstorer, $.extend({}, _params, extra), function(a) {

                instorer.modal.modal("hide");
                searcher.doSearch();
            });
        }
    }

    function deleteMaterial(mmid) {

        var options = {};

        options["ids[0]"] = mmid;

        com.post(api.material.deleteMaterialModelByIds, options, function() {

            searcher.doSearch();
        });
    }

    function editInstorer(c) {

        instorer.editFlg = !0;

        instorer.instorerModelItems.instorerName.val(c.name);
        instorer.instorerModelItems.loginId.val(c.loginId);
        instorer.instorerModelItems.password.val(null).attr('disabled', true);

        instorer.modal.modal("show");
    }

    function updateStatus(id, isLogin, failcallBack) {

        com.post(api.data.updateInstorerForLogin, {
            "instorer.sid": id,
            "instorer.isLogin": isLogin,
        }, function() {

        }, function() {

            failcallBack && failcallBack();
        });
    }

    function saveUser() {

        var options = {
            "instorerUserRight.sid": instorer.sid,
        };

        var users = $("#user").val();

        if (users) {
            users = users.split(', ');
            if (users.length) {
                $.each(users, function(i, v) {

                    options['userIds[' + i + ']'] = v;
                });
            }
        }

        com.post(api.data.updateInstorerUserRight, options, function() {

            instorer.instorerRightModal.modal("hide");
        });
    }
});
