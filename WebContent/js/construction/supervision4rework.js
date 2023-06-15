jQuery(function($) {

    var rework = {
        saveBtn: com.focusPage("#SaveBtn"),
        cancellBtn: com.focusPage("#cancelBtn"),

        modals: {
            modal: com.focusPage("#reworkModal")
        },

        items: {
            createTime: com.focusPage("#createTime"),
            reworkDes: com.focusPage("#reworkDes")
        },

        editFlag: false,
        repeatFlg: false
    };

    rework.saveBtn.bindClick(saveData);

    rework.modals.modal.on("hide.bs.modal", function() {

        com.cleanItems(rework.items);
        com.closeTip();
    });

    com.focusPage('#fl-statement').statement("监理控制", "返工信息列表");

    com.datetime(rework.items.createTime);

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
            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons').css('padding-top', '2px');
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix col-xs-6').css('padding-top', '2px');

            var $btnView = $('<a></a>').addClass('btn btn-minier btn-yellow').html("图纸");
            var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-primary').html("编辑");
            var $btnDel = $('<a></a>').addClass('btn btn-minier btn-danger').html("删除");

            var propertyArr = [["创建人:", v.createrName, "grey"], ["返工时间:", v.createTime, "green "], ["返工说明:", v.reworkDes, "grey"]];

            $.each(propertyArr, function(index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2] ? value[2] : "").appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $liLine.append($ulProperty);
            $divBtnWrap.append($btnView).append($btnEdit).append($btnDel).appendTo($liLine);

            $btnView.click(function() {
                viewSupervisionReworkDrawingIndex(v.rwId);
            });

            $btnEdit.click(function() {
                rework.editFlag = true;
                rework.items.createTime.val(v.createTime);
                rework.items.reworkDes.val(v.reworkDes);

                rework["rework.rwId"] = v.rwId;

                rework.modals.modal.modal("show");
            });

            $btnDel.click(function() {
                removeRow(v.rwId);
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

    var searcher = new Searcher();
    searcher.init([], "condList", api.construction.pageReworkByOrderId, function(list) {
        displayFunc.init('resultList', list);
    }, "pagenation", "supervisionReworkPostData", {
        "rework.orderId": params.construction.orderId
    }, false, null, function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-success pull-left').attr('id', 'add').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    });

    com.focusPage('#add', '#pagenation').click(function() {
        rework.editFlag = false;

        rework.modals.modal.modal("show");
    });

    function saveData() {

        if (com.validate("reworkModal"))
            return false;

        var url;
        var options = {
            "rework.createTime": rework.items.createTime.val(),
            "rework.reworkDes": rework.items.reworkDes.val(),
            "rework.orderId": params.construction.orderId
        };

        if (rework.editFlag) {
            url = api.construction.updateRework;
            options["rework.rwId"] = rework["rework.rwId"];
        } else {
            url = api.construction.addRework;
        }

        com.post(url, options, function(res) {
            searcher.doSearch();
        });

        rework.modals.modal.modal("hide");
    }

    function removeRow(id) {
        com.showConfirm("确认删除返工信息吗?", function() {
            com.post(api.construction.deleteRework, {
                "rwIds[0]": id
            }, function(res) {
                searcher.doSearch();
            });

        });
    }

    function viewSupervisionReworkDrawingIndex(rwId) {

        params.construction.rwId = rwId;

        com.closePopup();
        com.popup4page("#stockRecordPopUp", "/views/construction/supervision4drawing.html", "返工图纸");
    }

});
