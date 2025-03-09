jQuery(function($) {

    var villageRule = {

        saveBtn: com.focusPage("#saveBtn"),
        cancelBtn: com.focusPage("#cancelBtn"),

        modals: {
            addRuleModal: com.focusPage("#addRuleModal")
        },
        items: {
            ruleSel: com.focusPage("#ruleSel")
        },

        vid: params.vid,
    };

    villageRule.saveBtn.bindClick(saveData);

    villageRule.modals.addRuleModal.on("hide.bs.modal", function() {

        com.clearValidator();
        com.cleanTypeahead('ruleSel');
        com.cleanItems(villageRule.items);

    });

    com.initTypeahead('ruleSel', api.personel.queryUserByPinyin, "pinyinName", {
        "user.status": "0",
        "departmentType.name": ""
    }, "autoFillKeyValue", "key", "value", null);

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

            var villageBase = v.village;
            var buildingnameruleBase = v.buildingNameRule;

            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(' ' + v.rule));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnDel = $('<a></a>').addClass('btn btn-minier btn-danger').html('删除');

            var propertyArr = [["楼盘名:", villageBase.name, "green"], ["建筑规则:", buildingnameruleBase.rule, "blue"], ["规则编码:", buildingnameruleBase.buildingNameRuleId, "green"], ["规则示例:", buildingnameruleBase.ruleExample, "grey"], ["规则内容:", buildingnameruleBase.ruleContent, "blue"], ["规则填充:", buildingnameruleBase.rulefill, "grey"]];

            $.each(propertyArr, function(index, value) {

                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                var $b = $('<b style="float: right"></b>').html(value[1]).addClass(value[2] ? value[2] : "").appendTo($liProperty);
                if (value[3]) {
                    $b.click(function() {

                        value[3]($b);
                    });
                }
                $liProperty.appendTo($ulProperty);
            });

            $divBtnWrap.append($btnDel).appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            $btnDel.bindClick(function() {

                deleteVillageRule(v.vrid);
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

    searcher.init([], "condListas", api.data.queryVillageRule, function(data) {

        displayFunc.init('resultListas', data);

    }, "pagenationas", "groupUserPostData", {
        "villageRule.village.vid": villageRule.vid
    }, false, null, function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('id', 'addVillageRule').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    });

    com.focusPage('#addVillageRule', '#pagenationas').click(function() {

        villageRule.modals.addRuleModal.modal("show");
    });

    function deleteVillageRule(vrid) {

        com.post(api.data.deleteVillageRule, {
            "villageRule.vrid": vrid
        }, function() {

            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
        }, null, false);
    }

    function saveData() {

        if (com.validate('form')) {
            return false;
        }

        var options = {
            "villageRule.village.vid": v.vid,
            "villageRule.rule": villageRule.items.ruleSel.val()
        };

        com.post(api.data.addVillageRule, options, function(res) {

            searcher.doSearch();
            com.showAlert(com.info, "保存成功");

        }, null, false);
        villageRule.modals.addRuleModal.modal("hide");
    }
});
