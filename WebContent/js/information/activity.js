$(function() {

    var activity = {

        saveBtn: com.focusPage("#saveBtn"),
        cancelBtn: com.focusPage("#cancelBtn"),

        modals: {
            activityModal: com.focusPage("#activityModal")
        },
        items: {
            activityName: com.focusPage("#activityName"),
            startTime: com.focusPage("#startTime"),
            endTime: com.focusPage("#endTime"),
            types: com.focusPage("#type"),
            multiple: com.focusPage("#multiple"),
            content: com.focusPage("#content")
        },

        types: {},

        editFlg: true,
        postParam: {}
    };

    activity.saveBtn.bindClick(saveData);

    activity.items.types.bindData(constant.information().activity.type.datas, "key", "value");

    activity.modals.activityModal.on("hide.bs.modal", function() {

        com.clearValidator();
        com.cleanItems(activity.items);
    });

    com.datetime(com.focusPage(".date-picker-date"));

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
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.name));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-yellow').html('编辑');
            var $default = $('<a></a>').addClass('btn btn-minier btn-warning').html('默认');
            var $btnView = $('<a></a>').addClass('btn btn-minier btn-inverse').html("活动物品");// 活动物品

            // 状态启用禁用
            var $invalid = $('<div></div>').addClass('pull-right');
            var $statusSwitch = $('<input/>').addClass('ace ace-switch ace-switch-5').prop({
                "type": "checkbox"
            });
            var $span = $('<span></span>').addClass('lbl status-lbl');

            var propertyArr = [["创建人:", v.creater.currentName, "grey"], ["开始时间:", v.startTime, "green"], ["结束时间:", v.endTime, "green"], ["状态:", v.status == constant.information().activity.STATUS_VALID_INT ? "有效" : "无效", "red"], ["类型:", constant.information().activity.type.keys[v.type], "red"], ["倍数:", v.multiple, "blue"], ["默认标识:", v.defaults == constant.information().activity.DEFAULTS_DEFAULT_INT ? "默认" : "标准", "red"], ["说明:", v.content, "grey"]];

            $.each(propertyArr, function(index, value) {

                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $invalid.append($statusSwitch).append($span);
            $divBtnWrap.append($btnEdit).append($btnView).append($invalid).append($default).appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            $btnEdit.click(function() {
                var payType = v.payType;
                activity.editFlg = false;

                activity.items.aid = v.aid;
                activity.items.status = v.status;
                activity.items.activityName.val(v.name);
                activity.items.startTime.val(v.startTime.substring(0, 10)).attr("disabled", "disabled");
                activity.items.types.val(v.type).attr("disabled", "disabled");
                activity.items.multiple.val(v.multiple).attr("disabled", "disabled");
                activity.items.endTime.val(v.endTime.substring(0, 10));
                activity.items.content.val(v.content);
                if (payType > 32){
                    com.focusPage("#check6").attr('checked', true);
                    payType = payType - 32;
                }else if (payType > 16){
                    com.focusPage("#check5").attr('checked', true);
                    payType = payType - 16;
                }else if (payType > 8){
                    com.focusPage("#check4").attr('checked', true);
                    payType = payType - 8;
                }else if (payType > 4){
                    com.focusPage("#check3").attr('checked', true);
                    payType = payType - 4;
                }else if (payType > 2){
                    com.focusPage("#check2").attr('checked', true);
                    payType = payType - 2;
                }else if (payType == 1){
                    com.focusPage("#check1").attr('checked', true);
                }
                activity.modals.activityModal.modal("show");

            });

            !v.status && $statusSwitch.prop("checked", true);

            $default.click(function() {

                if (v.defaults == constant.information().activity.DEFAULTS_DEFAULT_INT) {
                    com.showAlert(com.warning, "该活动已是默认活动");
                    return false;
                }

                com.post(api.information.updateActivityForDefault, {
                    "activity.aid": v.aid
                }, function(res) {

                    com.showAlert(com.info, "操作成功");
                    activitySeacher.doSearch();
                });
            });

            $invalid.click(function() {

                var cvalue = $statusSwitch.prop("checked") ? 0 : 1;

                updatastatus(v.aid, cvalue);
            });

            $btnView.click(function() {

                params.infomation.aid = v.aid;
                params.infomation.activityName = v.name;
                params.infomation.type = v.type;

                com.popup4page("#activityItemPopUp", api.index.activityItem.url, "活动物品");
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

    var activitySeacher = new Searcher();
    activitySeacher.init(['information-activity-name', 'information-activity-type', 'information-activity-status'], "condList", api.information.pageActivity, function(list) {

        displayFunc.init('resultList', list);
    }, "pagenation", "activitySeacherPostData", null, false, null, function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('id', 'addActivity').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    });

    com.focusPage("#addActivity").click(function() {

        activity.editFlg = true;

        activity.items.activityName.removeAttr("disabled", "disabled");
        activity.items.startTime.removeAttr("disabled", "disabled");
        activity.items.types.removeAttr("disabled", "disabled");
        activity.items.multiple.removeAttr("disabled", "disabled");
        activity.modals.activityModal.modal("show");
    });

    function saveData() {

        if (com.validate('activityModal')) {
            return false;
        }
        var payType = null;

        if($("#check1").is(":checked")){
            payType = com.focusPage("#check1").val();
        }else if ($("#check2").is(":checked")){
            payType = payType + com.focusPage("#check2").val();
        }else if ($("#check3").is(":checked")){
            payType = payType + com.focusPage("#check3").val();
        }else if ($("#check4").is(":checked")){
            payType = payType + com.focusPage("#check4").val();
        }else if ($("#check5").is(":checked")){
            payType = payType + com.focusPage("#check5").val();
        }else if ($("#check6").is(":checked")){
            payType = payType + com.focusPage("#check6").val();
        }

        if (activity.items.startTime.val() > activity.items.endTime.val()) {
            com.showAlert(com.warning, "开始时间不能大于结束时间");
            return false;
        }

        var url;
        var options = {
            "activity.name": activity.items.activityName.val(),
            "activity.startTime": activity.items.startTime.val(),
            "activity.endTime": String(activity.items.endTime.val()).substring(0, 10) + " 23:59:59",
            "activity.type": activity.items.types.val(),
            "activity.multiple": activity.items.multiple.val(),
            "activity.content": activity.items.content.val(),
            "activity.payType": payType
        };

        activity.editFlg ? url = api.information.addActivity : url = api.information.updateActivity, options["activity.aid"] = activity.items.aid;

        com.post(url, options, function(res) {

            com.showAlert(com.info, "操作成功");
            activitySeacher.doSearch();
        });
        activity.modals.activityModal.modal("hide")
    }

    function updatastatus(aid, newstatus) {

        com.post(api.information.updateActivityForStatus, {
            "activity.aid": aid,
            "activity.status": newstatus
        }, function(res) {

            newstatus == 0 ? com.showAlert(com.info, "已启用") : com.showAlert(com.info, "已禁用");

            activitySeacher.doSearch();
        })
    }
});