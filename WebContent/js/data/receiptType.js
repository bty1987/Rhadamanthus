$(function ($) {

    var receiptType = {

        saveBtn: null,
        cancelBtn: null,
        modal: null,
        items: {},
        editFlg: false,
        cleanItemsitems:{},
        typeArray: ["现金", "刷卡", "银行", "对公账户", "券"]
    };

    $.extend(com.validate(),receiptType.validator);

    receiptType.modal = com.focusPage("#receiptTypeModal");
    receiptType.saveBtn = com.focusPage("#saveBtn").on("click", saveData);
    receiptType.items.rtId = com.focusPage("#rtId");
    receiptType.items.name = com.focusPage("#name");
    receiptType.items.type = com.focusPage("#type");
    receiptType.items.grade = com.focusPage("#grade");
    receiptType.items.kino = com.focusPage("#kino");
    receiptType.items.kiname = com.focusPage("#kiname");
    receiptType.items.assistant = com.focusPage("#assistant");
    receiptType.items.value = com.focusPage("#value");

    com.post(api.ds.data, {}, function(res){
        receiptType.items.grade.bindData(res.grade, "key", "value");
    }, null, false);

    var displayFunc = (function () {
        var renderList = function (tableId, listData) {
            var $tableWrap = com.focusPage('#' + tableId);
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
            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.name));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');
            var $btnuptl = $('<a></a>').addClass('btn btn-minier btn-yellow').html('修改');

            switch (v.type){
                case 1: v.type = "现金"; break;
                case 2: v.type = "刷卡";break;
                case 3: v.type = "银行"; break;
                case 4: v.type = "对公账户";break;
                case 5: v.type = "券";break;
            }
            var propertyArr = [
                ["键值:", v.no, "grey"],
                ["类型:", v.type, "red"],
                ["状态:", v.status == 1 ? "启用" : "禁用", "red"],
                ["等级:", com.checkNull(v.grade, "无"), "red"],
                ["金蝶编号:", com.checkNull(v.kino, "无"), "grey"],
                ["金蝶名称:", com.checkNull(v.kiname, "无"), "grey"],
                ["辅核项:", com.checkNull(v.assistant, "无"), "grey"],
                ["POS值:", com.checkNull(v.value, "无"), "grey"]
            ];

            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            var $btnStatus = $('<div></div>').addClass('pull-right');
            var $statusSwitch = $('<input/>').addClass('ace ace-switch ace-switch-5').prop({"type" : "checkbox"});
            var $span = $('<span></span>').addClass('lbl');

            $btnStatus.append($statusSwitch).append($span);

            $divBtnWrap.append($btnuptl).append($btnStatus).appendTo($h3);
            $liLine.append($h3).append($ulProperty);


            v.status == 1 && $statusSwitch.prop("checked", true);
            $statusSwitch.switchBtn("status-lbl").on("click",function() {
                $statusSwitch.prop("checked") ? (updateStatus(v.rtId, 1, function(){$statusSwitch.removeAttr("checked")})) : (updateStatus(v.rtId, 0,function(){$statusSwitch.prop("checked")}));
            });

            $btnuptl.click(function () {
                receiptType.items.rtId.val(v.rtId);
                receiptType.items.name.val(v.name);
                receiptType.items.type.val(utils.accAdd($.inArray(v.type, receiptType.typeArray), 1));
                receiptType.items.grade.val(v.grade);
                receiptType.items.kino.val(v.kino);
                receiptType.items.kiname.val(v.kiname);
                receiptType.items.assistant.val(v.assistant);
                receiptType.items.value.val(v.value);
                editFlg = false;
                receiptType.modal.modal("show")
            });

            return $liLine;
        };

        return {
            init: function (tableId, listData) {
                com.focusPage('#' + tableId).html(null);
                renderList(tableId, listData);
            },
            drawLine: function (v) {
                return creatLine(v);
            }
        }
    })();

    var searcher = new Searcher();
    var _condArr = ["receiptTypeName","receiptType","receiptTypeStatus"];

    searcher.init(_condArr, "condList", api.common.pageReceiptType, function (data) {
        displayFunc.init('resultList', data);
    }, "pagenation", "ReceiptTypePostData", null, false, null, function () {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-success').attr('name', 'add').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        $adda.click(function () {
            com.cleanItems(receiptType.items);
            editFlg = true;
            receiptType.modal.modal("show")
        });
        return [$adda];
    });

    function saveData() {
        var options = {
            "receiptType.name" : receiptType.items.name.val(),
            "receiptType.type" : receiptType.items.type.val(),
            "receiptType.grade" : receiptType.items.grade.val(),
            "receiptType.kino" : receiptType.items.kino.val(),
            "receiptType.kiname" : receiptType.items.kiname.val(),
            "receiptType.assistant" : receiptType.items.assistant.val(),
            "receiptType.value" : receiptType.items.value.val()
        };

        if(com.validate("form1")){
            return;
        }
        if(editFlg){
            com.post(api.common.addReceiptType,options,function () {
                searcher.doSearch();
                com.showAlert(com.info, "添加成功");
                receiptType.modal.modal("hide")
            })
        }else{
            options["receiptType.rtId"]=receiptType.items.rtId.val();
            com.post(api.common.updateReceiptType,options,function () {
                searcher.doSearch();
                com.showAlert(com.info, "修改成功");
                receiptType.modal.modal("hide")
            })
        }
    }

    function updateStatus(id, status, failcallBack) {
        com.post(api.common.updateReceiptTypeForStatus, {
            "receiptType.rtId": id,
            "receiptType.status": status
        }, function () {
            searcher.doSearch();
        }, function () {
            failcallBack && failcallBack();
        });
    }

});
