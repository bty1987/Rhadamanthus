jQuery(function($) {

    var normpack = {

        npid: null,

        btns: {
            saveBtn: com.focusPage("#saveBtn"),
        },

        modals: {
            addModal: com.focusPage("#addModal"),
        },

        items: {
            name: com.focusPage("#name"),
        },
        status: {},
        node: {},
    };

    normpack.btns.saveBtn.bindClick(saveData);

    normpack.modals.addModal.on("hide.bs.modal", function() {
        com.cleanItems(normpack.items);
        com.clearValidator();
        com.closeTip();
    });

    com.post(api.ds.data, {}, function(res) {
        normpack.status = res.costStatus.split("key", "value");
    }, null, false);

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
            var $btnDelete = $('<a></a>').addClass('btn btn-minier btn-yellow').html('删除');
            var $btnProject = $('<a></a>').addClass('btn btn-minier btn-purple').html('项目');

            var propertyArr = [["状态: ", normpack.status[v.status], "red"], ];

            $.each(propertyArr, function(index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $invalid.append($statusSwitch).append($span);
            $liLine.append($h3).append($ulProperty);
            $btnDiv.append($invalid).append($btnDelete).append($btnProject);
            $h3.append($title).append($btnDiv);

            !v.status && $statusSwitch.prop("checked", true);

            $btnDelete.click(function() {
                com.showConfirm("是否确认删除", function() {
                    com.post(api.data.deleteNormpack, {
                        "normpack.npid": v.npid
                    }, function() {
                        searcher.doSearch();
                        com.showAlert(com.info, "操作成功");
                    });
                });
            })

            $btnProject.click(function() {
                params.data.normpack = v;
                com.popup4page("#layerPopUp", "views/data/normpackItem.html", "项目", null, function() {
                    com.closePopup();
                    searcher.doSearch();
                });
            });

            $invalid.click(function() {
                var cvalue = $statusSwitch.prop("checked") ? 0 : 1;

                var options = {
                    "normpack.npid": v.npid,
                    "normpack.status": cvalue
                }

                com.post(api.data.updateNormpackForStatus, options, function(res) {
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

    searcher.init(["data-quotation-normpack-name", "data-quotation-normpack-status"], "condList", api.data.pageNormpack, function(data) {

        displayFunc.init('resultList', data);
    }, "pagenation", "addItemPostData", null, false, null, function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('id', 'addItemBtn').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    });

    com.focusPage('#addItemBtn').click(function() {
        normpack.modals.addModal.modal("show");
    });

    function saveData() {

        if (com.validate('addModal')) { return false; };

        var options = {
            'normpack.name': normpack.items.name.val(),

        };

        com.post(api.data.addNormpack, options, function(res) {
            com.closePopup();
            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
        });

        normpack.modals.addModal.modal("hide");
    }

});