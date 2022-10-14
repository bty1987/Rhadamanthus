$(function() {

    var worksheet = {

        saveBtn: com.focusPage("#saveBtn"),
        handBtn: com.focusPage("#handBtn"),
        cancelBtn: com.focusPage("#cancelBtn"),

        modals: {
            addWorksheetModal: com.focusPage("#addWorksheetModal"),
            handWorksheetModal: com.focusPage("#handWorksheetModal")
        },
        items: {
            module: com.focusPage("#module"),
            content: com.focusPage("#content"),
            result: com.focusPage("#result")
        },

        wsid: null,

        status: {},

    };

    worksheet.saveBtn.bindClick(saveData);
    worksheet.handBtn.bindClick(handData);

    com.focusPage(".modal").on("hide.bs.modal", function() {

        com.clearValidator();
        com.cleanItems(worksheet.items);
    });

    var displayFunc = (function() {

        var renderList = function(tableId, listData) {

            var $tableWrap = com.focusPage('#' + tableId).empty();
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

            var $liLine = $('<li></li>').addClass('item-blue clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.module));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnCancel = $('<a></a>').addClass('btn btn-minier btn-yellow').html('取消');
            var $btnHanl = $('<a></a>').addClass('btn btn-minier btn-danger').html('处理');

            var createTime = v.createTime.replace('T', ' ');
            var handTime = handTime == null ? v.handTime : v.handTime.replace('T', ' ');

            var propertyArr = [["单号:", v.code, "grey"], ["内容:", v.content, "grey"], ["创建人:", v.creater.currentName, "grey"], ["创建时间:", createTime, "green"], ["处理人:", v.handler.currentName, "grey"], ["处理时间:", handTime, "green"], ["状态:", constant.information().worksheet.status.keys[v.status], "red"], ["结果:", v.result, "grey"]];

            $.each(propertyArr, function(index, value) {

                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            if (v.status == constant.information().worksheet.STATUS_INIT_INT)
                $divBtnWrap.append($btnCancel).append($btnHanl).appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            $btnCancel.click(function() {

                com.showConfirm("确定取消吗?", function(reslut) {

                    com.post(api.information.cancelWorksheet, {
                        "worksheet.wsid": v.wsid
                    }, function(res) {

                        worksheetSeacher.doSearch();
                        com.showAlert(com.info, "操作成功");
                    });
                });
            });

            $btnHanl.click(function() {

                worksheet.wsid = v.wsid;
                worksheet.modals.handWorksheetModal.modal("show");
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
        };
    })();

    var worksheetSeacher = new Searcher();
    worksheetSeacher.init(['information-worksheet-code', 'information-worksheet-status', 'information-worksheet-creater', 'information-worksheet-handler'], "condList", api.information.pageWorksheet, function(list) {

        displayFunc.init('resultList', list);
    }, "pagenation", "worksheetSeacherPostData", null, false, null, function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('id', 'addWorksheet').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    });

    com.focusPage("#addWorksheet").click(function() {

        worksheet.modals.addWorksheetModal.modal("show");
    });

    function saveData() {

        if (com.validate('addWorksheetModal'))
            return false;

        var options = {
            "worksheet.module": worksheet.items.module.val(),
            "worksheet.content": worksheet.items.content.val()
        };

        com.post(api.information.addWorksheet, options, function(res) {

            worksheetSeacher.doSearch();
            com.showAlert(com.info, "操作成功");
        });
        worksheet.modals.addWorksheetModal.modal("hide");
    }

    function handData() {

        if (com.validate('handWorksheetModal'))
            return false;

        var options = {
            "worksheet.wsid": worksheet.wsid,
            "worksheet.result": worksheet.items.result.val()
        };

        com.post(api.information.handleWorksheet, options, function(res) {

            worksheetSeacher.doSearch();
            com.showAlert(com.info, "操作成功");
        });
        worksheet.modals.handWorksheetModal.modal("hide");
    }
});