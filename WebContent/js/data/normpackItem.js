jQuery(function($) {

    var normpackItem = {
        npid: params.data.normpack.npid,
        npiid: null,
        modals: {
            addNormpackItemModal: com.focusPage("#addNormpackItemModal")
        },
        items: {
            name: com.focusPage('#name', "#addNormpackItemModal"),
            normunit: com.focusPage('#normunit', "#addNormpackItemModal"),
            normnum: com.focusPage('#normnum', "#addNormpackItemModal"),
            storeunit: com.focusPage('#storeunit', "#addNormpackItemModal"),
            storenum: com.focusPage('#storenum', "#addNormpackItemModal"),
            price: com.focusPage('#price', "#addNormpackItemModal")
        },
        flag: true
    };

    com.post(api.common.queryMeasurementUnit, {}, function(res) {

        normpackItem.items.normunit.bindData(res.measurementUnits, "name", "name");
    });

    com.post(api.common.queryMeasurementUnit, {}, function(res) {

        normpackItem.items.storeunit.bindData(res.measurementUnits, "name", "name");
    });

    var initList = function(listData) {

        var $tableWrap = com.focusPage('#list').empty();
        var $ul = $('<ul></ul>').addClass('item-list ui-sortable  fl-table-list');

        if (!listData.length) {

            var $resultList = com.focusPage("#list").addClass('dz-default dz-message').html('');
            var $zone = $('<div></div>').addClass('dropzone dz-clickable').css('margin', '20px').css('border', '0px').appendTo($resultList);
            var $mesg = $('<div></div>').addClass('dz-default dz-message').appendTo($zone);
            var $span = $('<span></span>').text('无可用数据提供').appendTo($mesg);
            return $resultList;

        } else if (listData && listData.length) {

            $.each(listData, function(i, v) {

                var $liLine = $('<li></li>').addClass('item-orange clearfix');
                var $h3 = $('<h3></h3>').addClass('oid');
                var $title = $('<small></small>').addClass('blue').html(' ' + v.npiid);
                var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');

                var $btnDel = $('<a></a>').addClass('btn btn-minier btn-danger pull-right action-buttons').html('删除');

                var propertyArr = [["名称:", v.name, "grey"], ["定额单位: ", v.normunit, "gray"], ["定额数量: ", v.normnum, "blue"], ["库房单位: ", v.storeunit, "gray"], ["库房数量: ", v.storenum, "blue"], ["价格: ", v.price, "blue"]];

                $.each(propertyArr, function(index, value) {

                    var $liProperty = $('<li></li>');
                    $('<strong></strong>').html(value[0]).appendTo($liProperty);
                    $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                    $liProperty.appendTo($ulProperty);
                });

                $liLine.appendTo($ul);
                $liLine.append($h3).append($ulProperty);
                $h3.append($title).append($btnDel);

                $btnDel.bindClick(function() {

                    deleteNormpackItem(v.npiid);
                });

            });
            $ul.appendTo($tableWrap);
        }
    };

    queryNormpackItem(normpackItem.npid);

    function queryNormpackItem(npid) {

        com.post(api.data.queryNormpackItem, {
            "normpackItem.npid": npid
        }, function(data) {

            initList(data.normpackItems);
        }, null, false);
    }
    ;

    com.focusPage('#addBtn').click(function() {

        normpackItem.flag = true;
        normpackItem.modals.addNormpackItemModal.modal("show");
    });

    normpackItem.modals.addNormpackItemModal.on("hide.bs.modal", function() {

        com.clearValidator();
        com.cleanItems(normpackItem.items);
    });

    com.initTypeahead(normpackItem.items.name, api.data.queryNoodsByName, "noods.name", {}, "noodes", "nid", "name", null);

    function deleteNormpackItem(npiid) {

        com.post(api.data.deleteNormpackItem, {
            "normpackItem.npiid": npiid
        }, function() {

            com.showAlert(com.info, "操作成功");

            queryNormpackItem(normpackItem.npid);

        }, null, false);
    }

    com.focusPage("#saveBtn").bindClick(function() {

        if (com.validate("addNormpackItemModal")) {
            return false;
        }

        var options = {
            "normpackItem.npid": normpackItem.npid,
            "normpackItem.noods.nid": com.typeahead(normpackItem.items.name),
            "normpackItem.normunit": normpackItem.items.normunit.val(),
            "normpackItem.normnum": normpackItem.items.normnum.val(),
            "normpackItem.storeunit": normpackItem.items.storeunit.val(),
            "normpackItem.storenum": normpackItem.items.storenum.val(),
            "normpackItem.name": normpackItem.items.name.val(),
            "normpackItem.price": normpackItem.items.price.val()
        };

        com.post(api.data.addNormpackItem, options, function(res) {

            com.showAlert(com.info, "操作成功");
            queryNormpackItem(normpackItem.npid);

            normpackItem.modals.addNormpackItemModal.modal("hide");
        }, null, false);
    });

});
