jQuery(function ($) {

    var approve = {
        saveBtn: null,
        cancelBtn: null,
        modal: null,
        items: {},
        gorderId: params.gorderId,
        editFlg: false,
        postParam: {},
    };


    approve.saveBtn = com.focusPage("#saveBtn").bindClick(saveData);
    approve.cancelBtn = com.focusPage("#cancelBtn");
    approve.modal = com.focusPage("#groupUserModal");
    approve.items.userSel = com.focusPage("#userSel");
    approve.items.comment = com.focusPage("#comment");
    com.post(api.ds.approval, {"timestamp": new Date().getTime()}, function (res) {
        approve.approvalType = res.approvalType;

        approve.approvalTypeData = {};

        for (var i = 0; i < approve.approvalType.length; i++) {
            var _ = approve.approvalType[i];
            approve.approvalTypeData[_["key"]] = _["value"];
        }
    }, null, false);

    com.initTypeahead('userSel', api.personel.queryUserByPinyin, "pinyinName", {"user.status": "0", "departmentType.name": ""}, "autoFillKeyValue", "key", "value", null);

    approve.items.type = com.focusPage("#type").bindData(approve.approvalType, "key", "value", false);

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

    searcher.init([], "condList", api.decoration.queryDecorationUser, function (data) {
        displayFunc.init('resultList', data);
    }, "pagenation", "groupUserPostData", {"decorationUser.orderId": approve.gorderId}, false, null, function () {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addGroupUser').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        var $back = $('<a></a>').addClass('btn btn-minier btn-success pull-left').attr('name', 'back').css("margin", "0px 3px");
        var $$backi = $('<i></i>').addClass('icon-mail-forward bigger-110').appendTo($back);
        var $$backspan = $('<span></span>').text('返回').appendTo($back);

        return [$adda, $back];
    });

    com.focusPage('a[name="addGroupUser"]', '#pagenation').click(function () {
        editFlg = false;
        com.clearValidator();
        com.cleanTypeahead('userSel');
        approve.modal.modal("show");
    });


    com.focusPage('a[name="back"]', '#pagenation').click(function(){
        com.switchPage(api.index.crowd.url);
    });

    function deleteGroupUser(duid) {

        var options = {
            "decorationUser.duid": duid
        };

        com.post(api.decoration.deleteDecorationUser, options, function () {
            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
        }, null, false);
    }

    function saveData() {

        if (com.validate()) {
            return;
        }

        var url;
        var options = {
            'decorationUser.user.userId': com.typeahead("userSel"),
            'decorationUser.orderId': approve.gorderId,
            'decorationUser.content': approve.items.comment.val()
        };
        url = api.decoration.addDecorationUser;

        com.post(url, options, function (res) {
            searcher.doSearch();
        }, null, false);

        approve.modal.modal("hide");
    }

});