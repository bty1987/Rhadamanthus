jQuery(function($) {

    var flowpath = {

        items: {
            name: com.focusPage("#name"),
            no: com.focusPage("#no"),
            keyword: com.focusPage("#keyword"),
            type: com.focusPage("#type")
        },
        fitems: {
            fpid: com.focusPage("#fpid"),
            fname: com.focusPage("#fname"),
            fno: com.focusPage("#fno"),
            fkeyword: com.focusPage("#fkeyword"),
            ftype: com.focusPage("#ftype")
        },

        btns: {
            withdrawBtn: com.focusPage("#withdrawBtn"),
            addCancelBtn: com.focusPage("#addCancelBtn"),
            updateBtn: com.focusPage("#updateBtn"),
            updateCancelBtn: com.focusPage("#updateCancelBtn")
        },

        addFlowpath: com.focusPage("#addFlowpath"),
        updateFlowpath: com.focusPage("#updateFlowpath"),
    };
    flowpath.btns.withdrawBtn.bindClick(saveData);
    flowpath.btns.updateBtn.bindClick(updateData);

    var displayFunc = (function() {

        var renderList = function(tableId, listData) {

            var $tableWrap = com.focusPage('#' + tableId);

            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (listData && listData.length) {

                $.each(listData, function(i, v) {

                    creatLine(v).appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function(v) {

            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.name));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');
            var errlog = $('<a></a>').addClass('btn btn-minier btn-danger').html('修改');
            var $btncancel = $('<a></a>').addClass('btn btn-minier btn-warning').html('删除');
            var $btnliuc = $('<a></a>').addClass('btn btn-minier btn-success').html('节点');

            var status = {
                "0": "启用",
                "1": "禁用",
            };

            var propertyArr = [["编号:", v.no, "grey"], ["关键字:", v.keyword, "grey"], ["类型:", v.type, "grey"], ["状态:", status[v.status], "red"]];

            $.each(propertyArr, function(index, value) {

                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $divBtnWrap.append(errlog).append($btnliuc).appendTo($h3);

            $liLine.append($h3).append($ulProperty);
            errlog.click(function() {

                flowpath.updateFlowpath.modal("show");
            });

            $btncancel.click(function() {

                deleteFlowpath(v);
            });
            $btnliuc.click(function() {

                node(v);
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
    searcher.init(null, "condList", api.data.pageFlowpath, function(data) {

        displayFunc.init('resultList', data);
    }, "pagenation", "flowpathPostData", null, false, null, function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addSoodsModal').css({
            'margin-left': '4px'
        });
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);
        $adda.click(function() {

            flowpath.addFlowpath.modal("show");
        });
        return [$adda];
    }, "resultList");

    function saveData() {

        var options = {
            "flowpath.name": flowpath.items.name.val(),
            "flowpath.no": flowpath.items.no.val(),
            "flowpath.keyword": flowpath.items.keyword.val(),
            "flowpath.type": flowpath.items.type.val()
        };

        com.post(api.data.addFlowpath, options, function(res) {

            com.showAlert(com.info, "创建成功!");
            flowpath.addFlowpath.modal("hide");
            searcher.doSearch();
        });
    }

    function updateData(v) {

        if (com.validate('updateFlowpath')) {
            return false;
        }

        var option = {
            "flowpath.fpid": flowpath.fitems.fpid.val(),
            "flowpath.name": flowpath.fitems.fname.val(),
            "flowpath.no": flowpath.fitems.fno.val(),
            "flowpath.keyword": flowpath.fitems.fkeyword.val(),
            "flowpath.type": flowpath.fitems.ftype.val()
        };

        com.post(api.data.updateFlowpath, option, function(e) {

            displayFunc.init();
            com.showAlert(com.info, "操作成功");
            flowpath.updateFlowpath.modal("hide");
            searcher.doSearch();
        });
    }
    function deleteFlowpath(v) {

        com.showConfirm("是否确认删除", function() {

            var options = {
                "flowpath.fpid": v.fpid
            };
            com.post(api.data.deleteFlowpath, options, function(res) {

                com.showAlert(com.info, "操作成功");
                searcher.doSearch();
            }, null, false);
        });
    }
    function node(v) {

        params.data.fpid = v.fpid;
        com.popup4frame(v.name, "/views/data/flowitem.html");
    }
});
