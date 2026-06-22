$(function($) {

    var decorationMeasureRule = {

        btns: {
            saveBtn: com.focusPage("#saveBtn").on("click", saveData)
        },

        modals: {
            addModal: com.focusPage("#addModal")
        },

        items: {
            dmrid: com.focusPage("#dmrid"),
            name: com.focusPage("#name"),
            comment: com.focusPage("#comment")
        },

        editFlg: false
    };

    decorationMeasureRule.modals.addModal.on("hide.bs.modal", function() {

        com.cleanItems(decorationMeasureRule.items);
        com.clearValidator();
        decorationMeasureRule.editFlg = false;
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
            var $h3 = $('<h3></h3>').addClass('oid');
            var $title = $('<small></small>').addClass('blue').html(' ' + v.name);
            var $btnDiv = $('<div></div>').addClass('action-buttons pull-right');
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');

            var $invalid = $('<div></div>').addClass('pull-right');
            var $statusSwitch = $('<input/>').addClass('ace ace-switch ace-switch-5').prop({
                "type": "checkbox"
            });
            var $span = $('<span></span>').addClass('lbl status-lbl');
            var $btnUpdate = $('<a></a>').addClass('btn btn-minier btn-yellow').html('修改');
            var $btnItem = $('<a></a>').addClass('btn btn-minier btn-purple').html('明细');
            var $btnDelete = $('<a></a>').addClass('btn btn-minier btn-danger').html('删除');

            var propertyArr = [["说明: ", com.checkNull(v.comment, "无"), "grey"], ["状态: ", v.status == 0 ? "启用" : "禁用", "red"]];

            $.each(propertyArr, function(index, value) {

                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $invalid.append($statusSwitch).append($span);
            $liLine.append($h3).append($ulProperty);
            $btnDiv.append($invalid).append($btnUpdate).append($btnItem).append($btnDelete);
            $h3.append($title).append($btnDiv);

            v.status == 0 && $statusSwitch.prop("checked", true);

            $btnUpdate.click(function() {

                decorationMeasureRule.editFlg = false;
                decorationMeasureRule.items.dmrid.val(v.dmrid);
                decorationMeasureRule.items.name.val(v.name);
                decorationMeasureRule.items.comment.val(v.comment);
                decorationMeasureRule.modals.addModal.modal("show");
            });

            $btnItem.click(function() {

                params.data.decorationMeasureRule = v;
                com.popup4page("#layerPopUp", "views/data/decorationMeasureRuleItem.html", "装修区域分支", null, function() {

                    com.closePopup();
                    searcher.doSearch();
                });
            });

            $btnDelete.click(function() {

                com.showConfirm("是否确认删除", function() {

                    com.post(api.data.deleteDecorationMeasureRule, {
                        "decorationMeasureRule.dmrid": v.dmrid
                    }, function() {

                        searcher.doSearch();
                        com.showAlert(com.info, "操作成功");
                    });
                });
            });

            $invalid.click(function() {

                var cvalue = $statusSwitch.prop("checked") ? 1 : 0;

                com.post(api.data.updateDecorationMeasureRuleForStatus, {
                    "decorationMeasureRule.dmrid": v.dmrid,
                    "decorationMeasureRule.status": cvalue
                }, function() {

                    cvalue == 0 ? com.showAlert(com.info, "已启用") : com.showAlert(com.info, "已禁用");
                    searcher.doSearch();
                });
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

    searcher.init(["decorationMeasureRule-name", "decorationMeasureRule-status"], "condList", api.data.pageDecorationMeasureRule, function(data) {

        displayFunc.init('resultList', data);
    }, "pagenation", "decorationMeasureRulePostData", null, false, null, function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('id', 'addItemBtn').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    });

    com.focusPage('#addItemBtn').click(function() {

        decorationMeasureRule.editFlg = true;
        decorationMeasureRule.modals.addModal.modal("show");
    });

    function saveData() {

        if (com.validate('addModal')) {
            return false;
        }

        var options = {
            'decorationMeasureRule.name': decorationMeasureRule.items.name.val(),
            'decorationMeasureRule.comment': decorationMeasureRule.items.comment.val()
        };

        if (decorationMeasureRule.editFlg) {

            com.post(api.data.addDecorationMeasureRule, options, function() {

                com.showAlert(com.info, "添加成功");
                searcher.doSearch();
            });
        } else {

            options['decorationMeasureRule.dmrid'] = decorationMeasureRule.items.dmrid.val();

            com.post(api.data.updateDecorationMeasureRule, options, function() {

                com.showAlert(com.info, "修改成功");
                searcher.doSearch();
            });
        }

        decorationMeasureRule.modals.addModal.modal("hide");
    }

});
