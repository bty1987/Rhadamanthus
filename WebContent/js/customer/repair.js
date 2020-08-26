jQuery(function ($) {

    var repair = {
        aid: params.aid,
        resultList: com.focusPage("#resultList"),
        addRepair: com.focusPage("#addRepair"),
        submitBtn: com.focusPage("#submitBtn"),
        schedule: com.focusPage("#schedule"),
        items: {
            content: com.focusPage("#content"),
        },
        addRepairModal: com.focusPage("#addRepairModal"),
        addSaveBtn: com.focusPage("#addSaveBtn"),
        type: null
    };

    repair.addSaveBtn.bindClick(saveFunction);

    repair.addRepairModal.on('hide.bs.modal', function (e) {
        com.cleanItems(repair.items);
        com.cleanTypeahead('userNameRepair');
        com.clearValidator();
    });

    com.post(api.ds.customer, {}, function (data) {
        repair.schedule.bindData(data.repairSchedule, "key", "value", true, false);
    }, null, false);

    function renderList() {
        com.post(api.customer.queryRepair, {"repair.aid": repair.aid}, function (data) {
            displayFunc.init(repair.resultList, data.repairs);
        });
    }

    com.initTypeahead('userNameRepair', api.personel.queryUserByPinyin, "pinyinName", {"user.status": "0", "departmentType.name": ""}, "autoFillKeyValue", "key", "value", null);

    renderList();

    var displayFunc = (function () {

        var renderList = function (tableId, listData) {

            var $tableWrap = tableId.empty();
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

            var $liLine = $('<li></li>').addClass('item-blue clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.repaier.currentName));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnRepair = $('<a></a>').addClass('btn btn-minier btn-danger').html('维修');
            var $btnFinish = $('<a></a>').addClass('btn btn-minier btn-inverse').html('完工');

            var propertyArr = [
                ["创建人:", v.creater.currentName, "grey"],
                ["创建时间:", v.createTime, "green"],
                ["更新人:", v.updater.currentName, "grey"],
                ["更新时间:", v.updateTime, "green"],
                ["维修人:", v.repaier.currentName, "grey"],
                ["状态:", v.status == 0 ? "初始" : v.status == 1 ? "维修" : v.status == 2 ? "完工" : "关闭", "red"],
                ["内容:", v.content, "grey"]
            ];

            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            v.status == 0 && $divBtnWrap.append($btnRepair).appendTo($h3);
            v.status == 1 && $divBtnWrap.append($btnFinish).appendTo($h3);
            v.status == 2 && $divBtnWrap.appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            $btnRepair.click(function () {
                com.popup4mini('#layerPopUp', '#layerAdd', "维修");
                repair.rid = v.rid;
                repair.type = "keep";
            });

            $btnFinish.click(function () {
                com.popup4mini('#layerPopUp', '#layerAdd', "完工");
                repair.rid = v.rid;
                repair.type = null;
            });

            return $liLine;
        };

        return {
            init: function (tableId, listData) {
                if (!listData.length) {
                    var $resultList = repair.resultList.addClass('dz-default dz-message').html('');
                    var $zone = $('<div></div>').addClass('dropzone dz-clickable').css('margin', '20px').css('border', '0px').appendTo($resultList);
                    var $mesg = $('<div></div>').addClass('dz-default dz-message').appendTo($zone);
                    var $span = $('<span></span>').text('无可用数据提供').appendTo($mesg);
                    return $resultList;
                } else {
                    tableId.html(null);
                    renderList(tableId, listData);
                }
            },
            drawLine: function (v) {
                return creatLine(v);
            }
        };
    })();

    function repairFunction() {

        if (com.validate('layerPopUp', 'right')) {
            return false
        }

        var schedule = com.focusPage('#schedule', '#layerPopUp').val();

        var option = {
            "repair.rid": repair.rid,
            "repair.schedule": schedule
        };

        if (repair.type == "keep") {
            com.post(api.customer.keepRepair, option, function () {
                com.showAlert(com.info, '操作成功');
                com.closePopup(com.focusPage("#submitBtn", "#layerPopUp"));
                renderList();
            })
        } else {
            com.post(api.customer.finishRepair, option, function () {
                com.showAlert(com.info, '操作成功');
                com.closePopup(com.focusPage("#submitBtn", "#layerPopUp"));
                renderList();
            })
        }

    }

    repair.addRepair.click(function () {
        repair.addRepairModal.modal("show");
    });

    repair.submitBtn.click(function () {
        repairFunction();
    });

    function saveFunction() {

        if (com.validate('form', 'right')) {
            return false
        }

        var option = {
            "repair.aid": repair.aid,
            "repair.repaier.userId": com.typeahead("#userNameRepair"),
            "repair.content": repair.items.content.val()
        };

        com.post(api.customer.addRepair, option, function (res) {
            com.showAlert(com.info, '添加成功');
            repair.addRepairModal.modal("hide");
            renderList();
        })
    }


});