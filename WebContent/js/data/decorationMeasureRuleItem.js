jQuery(function($) {

    var decorationMeasureRuleItem = {

        dmrid: params.data.decorationMeasureRule.dmrid,

        modals: {
            addItemModal: com.focusPage("#addItemModal")
        },

        items: {
            company: com.focusPage("#company", "#addItemModal")
        },

        companyMap: {}
    };

    com.post(api.system.queryCompany, {}, function(res) {

        decorationMeasureRuleItem.items.company.bindData(res.companys, "cid", "name");

        $.each(res.companys, function(i, v) {
            decorationMeasureRuleItem.companyMap[v.cid] = v.name;
        });
    });

    var initList = function(listData) {

        var $tableWrap = com.focusPage('#list').empty();
        var $ul = $('<ul></ul>').addClass('item-list ui-sortable fl-table-list');

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
                var $title = $('<small></small>').addClass('blue').html(' ' + (decorationMeasureRuleItem.companyMap[v.company] || v.company));
                var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');

                var $btnDel = $('<a></a>').addClass('btn btn-minier btn-danger pull-right action-buttons').html('删除');

                var propertyArr = [["分公司: ", decorationMeasureRuleItem.companyMap[v.company] || v.company, "grey"]];

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

                    deleteDecorationMeasureRuleItem(v.dmriid);
                });
            });

            $ul.appendTo($tableWrap);
        }
    };

    queryDecorationMeasureRuleItem(decorationMeasureRuleItem.dmrid);

    function queryDecorationMeasureRuleItem(dmrid) {

        com.post(api.data.queryDecorationMeasureRuleItem, {
            "decorationMeasureRuleItem.dmrid": dmrid
        }, function(data) {

            initList(data.decorationMeasureRuleItems);
        }, null, false);
    }

    com.focusPage('#addBtn').click(function() {

        decorationMeasureRuleItem.modals.addItemModal.modal("show");
    });

    decorationMeasureRuleItem.modals.addItemModal.on("hide.bs.modal", function() {

        com.clearValidator();
        com.cleanItems(decorationMeasureRuleItem.items);
    });

    function deleteDecorationMeasureRuleItem(dmriid) {

        com.post(api.data.deleteDecorationMeasureRuleItem, {
            "decorationMeasureRuleItem.dmriid": dmriid
        }, function() {

            com.showAlert(com.info, "操作成功");
            queryDecorationMeasureRuleItem(decorationMeasureRuleItem.dmrid);
        }, null, false);
    }

    com.focusPage("#saveBtn").bindClick(function() {

        if (com.validate("addItemModal")) {
            return false;
        }

        var options = {
            "decorationMeasureRuleItem.dmrid": decorationMeasureRuleItem.dmrid,
            "decorationMeasureRuleItem.company": decorationMeasureRuleItem.items.company.val()
        };

        com.post(api.data.addDecorationMeasureRuleItem, options, function() {

            com.showAlert(com.info, "操作成功");
            queryDecorationMeasureRuleItem(decorationMeasureRuleItem.dmrid);
            decorationMeasureRuleItem.modals.addItemModal.modal("hide");
        }, null, false);
    });

});
