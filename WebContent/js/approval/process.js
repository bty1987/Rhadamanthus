jQuery(function($) {

    // 隐藏触发
    com.focusPage("#processInfo").on('hide.bs.modal', function() {

        com.focusPage("#processfield").empty();
        com.focusPage("#processitem").empty();
        com.focusPage("#processcomment").empty();
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
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.name));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-yellow').html('编辑');
            var $btnStatus = $('<div></div>').addClass('pull-right');
            var $statusSwitch = $('<input/>').addClass('ace ace-switch ace-switch-5').prop({
                "type": "checkbox"
            });
            var $span = $('<span></span>').addClass('lbl status-lbl');
            var $btnDel = $('<a></a>').addClass('btn btn-minier btn-danger').html('删除');

            var propertyArr = [["名称:", v.name, "grey"], ["编号:", v.no, "blue"], ["code:", v.code, "grey"], ["状态:", v.status == 0 ? "启用" : "禁用", "red"]];

            $.each(propertyArr, function(index, value) {

                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2] ? value[2] : "").appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $btnStatus.append($statusSwitch).append($span);
            $divBtnWrap.append($btnEdit).append($btnDel).append($btnStatus).appendTo($h3);
            $liLine.append($h3).append($ulProperty);

            // 编辑
            $btnEdit.click(function() {

                // 显示表单
                params.approval.process = v;
                com.popup4page("#layerPopUp", api.index.createProcessIndex.url, "审批");
            });

            // 启禁用
            !v.status && $statusSwitch.prop("checked", true);
            $statusSwitch.click(function() {

                var options = {};

                options["process.pid"] = v.pid;
                options["process.status"] = v.status == 0 ? 1 : 0;

                com.post(api.approval.updateProcessForStatus, options, function(res) {

                    searcher.doSearch();
                });
            });

            // 删除
            $btnDel.click(function() {

                com.showConfirm("确认要删除当前表单吗?", function(res) {

                    com.post(api.approval.deleteProcess, {
                        "process.pid": v.pid
                    }, function(res) {

                        com.showAlert(com.info, "删除成功");
                        searcher.doSearch();
                    });
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
        };
    })();

    var searcher = new Searcher();

    searcher.init(["approval-process-no", "approval-process-name", "approval-process-status"], "condList", api.approval.pageProcess, function(data) {

        displayFunc.init('resultList', data);
    }, "pagenation", "processPostData", null, false, null, function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('id', 'addProcess').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    });

    com.focusPage("#addProcess").click(function() {

        params.approval.process = null;

        com.popup4page("#layerPopUp", api.index.createProcessIndex.url, "审批", null, function() {

            searcher.doSearch();
        });
    });

});
