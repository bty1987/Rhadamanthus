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

    var displayFunc = (function() {

        var renderList = function(tableId, listData) {

            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (listData && listData.length) {
                $.each(listData, function(i, v) {

                    var $liLine = creatLine(v);

                    $liLine.appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function(v) {

            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.currentName));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-success').html('编辑');

            var $btnStatus = $('<div></div>').addClass('pull-right');
            var $statusSwitch = $('<input/>').addClass('ace ace-switch ace-switch-5').prop({
                "type": "checkbox"
            });
            var $span = $('<span></span>').addClass('lbl status-lbl');

            var propertyArr = [["厂商ID:", v.sid, "blue "], ["登陆名:", v.loginId, "grey"], ["登陆状态:", v.isLogin == 0 ? "禁用" : "启用", "red "]];

            $.each(propertyArr, function(index, value) {

                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $btnStatus.append($statusSwitch).append($span);

            $divBtnWrap.append($btnEdit).append($btnStatus).appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            $btnEdit.click(function() {

                instorer.$nowLine = v.sid;
                editInstorer(v);
            });

            v.isLogin && $statusSwitch.prop("checked", true);
            $statusSwitch.switchBtn("status-lbl").on("click", function() {

                $statusSwitch.prop("checked") ? (updateStatus(v.sid, 1, function() {

                    $statusSwitch.removeAttr("checked")
                })) : (updateStatus(v.sid, 0, function() {

                    $statusSwitch.prop("checked")
                }));
            });

            return $liLine;
        };

        return {
            init: function(tableId, listData) {

                com.focusPage('#' + tableId).html(null);
                renderList(tableId, listData);
            },
            drawLine: function(v) {

                return creatLine(v);
            }
        }
    })();

    var _condArr = [];

    var searcher = new Searcher();

    searcher.init(_condArr, "condList", api.data.pageInstorer, function(data) {

        displayFunc.init('resultList', data);
    }, "pagenation", "materialModelPostData", null, false, null, function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'add').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    });

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
