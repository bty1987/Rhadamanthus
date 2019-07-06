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

        gorderId: params.gorderId,
        editFlg: false,
        postParam: {},
    };

    approve.saveBtn.bindClick(saveData);

    approve.modals.groupUserModal.on("hide.bs.modal", function () {
        com.clearValidator();
        com.cleanTypeahead('userSel');
        com.cleanItems(approve.items);
    });

    com.initTypeahead('userSel', api.personel.queryUserByPinyin, "pinyinName", {"user.status": "0", "departmentType.name": ""}, "autoFillKeyValue", "key", "value", null);

    var displayFunc = (function () {

        var renderList = function (tableId, listData) {
            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (listData && listData.length) {
                $.each(listData, function (i, v) {
                    var $liLine = creatLine(v);

                    $liLine.appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function (v) {
            var userBase = v.user;

            var $liLine = $('<li></li>').addClass('item-blue clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(' ' + userBase.currentName));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnDel = $('<a></a>').addClass('btn btn-minier btn-danger').html('删除');

            var propertyArr = [
                ["编号:", userBase.userId, "grey"],
                ["职位:", userBase.duty.name, "grey"],
                ["说明:", v.content, "grey"]
            ];

            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $divBtnWrap.append($btnDel).appendTo($h3);

            $liLine.append($h3).append($ulProperty);


            $btnDel.bindClick(function () {
                deleteGroupUser(v.duid);
            });

            return $liLine;
        };

        return {
            init: function (tableId, listData) {
                com.focusPage('#' + tableId).html(null);
                renderList(tableId, listData);
            },
            drawLine: function (v) {
                return creatLine(v);
            }
        };
    })();

    var searcher = new Searcher();

    searcher.init([], "condListas", api.decoration.queryDecorationUser, function (data) {
        displayFunc.init('resultListas', data);
    }, "pagenationas", "groupUserPostData", {"decorationUser.orderId": approve.gorderId}, false, null, function () {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('id', 'addGroupUser').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    });

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