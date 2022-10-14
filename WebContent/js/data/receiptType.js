$(function ($) {

    var receiptType = {
        modal: {
            receiptTypeModal: com.focusPage("#receiptTypeModal"),
            receiptTypeItemModal: com.focusPage("#receiptTypeItemModal")
        },
        items: {
            rtId: com.focusPage("#rtId"),
            name: com.focusPage("#name"),
            type: com.focusPage("#type"),
            fund: com.focusPage("#fund"),
            grade: com.focusPage("#grade"),
            kino: com.focusPage("#kino"),
            kiname: com.focusPage("#kiname"),
            kibalance: com.focusPage("#kibalance"),
            bankno: com.focusPage("#bankno"),
            assistant: com.focusPage("#assistant"),
            value: com.focusPage("#value")
        },
        receiptTypeItems: {
            itemtype: com.focusPage("#itemtype", "#receiptTypeItemModal"),
            paytype: com.focusPage("#paytype", "#receiptTypeItemModal"),
            itemName: com.focusPage("#itemName", "#receiptTypeItemModal")
        },
        btns: {
            saveBtn: com.focusPage("#saveBtn").on("click", saveData),
            save: com.focusPage("#save").on("click", saveReceiptTypeItem)
        },
        editFlg: false,
        cleanItemsitems:{},
        typeArray: ["现金", "刷卡", "银行", "对公账户", "券"],
        funds: {},
        currentRtid: null,
        currentNo: null,
        paymentTypes: {},
        paytypes: {}
    };

    com.post(api.ds.data, {}, function(res){
        receiptType.items.grade.bindData(res.grade, "key", "value");
        receiptType.items.fund.bindData(res.receiptTypeFund, "key", "value");
        receiptType.receiptTypeItems.itemtype.bindData(res.paymentType, "key", "value");
        receiptType.receiptTypeItems.paytype.bindData(res.paytype, "key", "value");

        receiptType.funds = res.receiptTypeFund.split('key', 'value');
        receiptType.paymentTypes = res.paymentType.split('key', 'value');
        receiptType.paytypes = res.paytype.split('key', 'value');
    }, null, false);

    receiptType.modal.receiptTypeModal.on('hide.bs.modal', function (e) {
        com.clearValidator();
        com.cleanItems(receiptType.items);
        com.focusPage("#banknoDiv").css("display", "none");
    });

    receiptType.modal.receiptTypeItemModal.on('hide.bs.modal', function (e) {
        com.clearValidator();
        com.cleanItems(receiptType.receiptTypeItems);
        receiptType.currentRtid = null;
        receiptType.currentNo = null;
    });

    receiptType.items.type.on("change", function(){
        var typeVal =  receiptType.items.type.val();

        (['2', '3'].contains(typeVal)) ? com.focusPage("#banknoDiv").css("display", "block") : com.focusPage("#banknoDiv").css("display", "none");
    });

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
            var $btnAdd = $('<a></a>').addClass('btn btn-minier btn-success').html('单据');

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
                ["资金类型:", receiptType.funds[v.fund], "red"],
                ["状态:", v.status == 1 ? "启用" : "禁用", "red"],
                ["等级:", com.checkNull(v.grade, "无"), "red"],
                ["金蝶编号:", com.checkNull(v.kino, "无"), "grey"],
                ["金蝶名称:", com.checkNull(v.kiname, "无"), "grey"],
                ["结算方式:", com.checkNull(v.kibalance, "无"), "grey"],
                ["银行账号:", com.checkNull(v.bankno, "无"), "blue"],
                ["辅核项:", com.checkNull(v.assistant, "无"), "grey"],
                ["POS值:", com.checkNull(v.value, "无"), "grey"]
            ];

            if (v.receiptTypeItems != null && v.receiptTypeItems.length > 0) {
                $.each(v.receiptTypeItems, function (i, v) {
                    propertyArr.push([receiptType.paymentTypes[v.type] + receiptType.paytypes[v.paytype] + ":", v.name, "grey"])
                });
            }

            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            var $btnStatus = $('<div></div>').addClass('pull-right');
            var $statusSwitch = $('<input/>').addClass('ace ace-switch ace-switch-5').prop({"type" : "checkbox"});
            var $span = $('<span></span>').addClass('lbl status-lbl');

            $btnStatus.append($statusSwitch).append($span);

            $divBtnWrap.append($btnuptl).append($btnAdd).append($btnStatus).appendTo($h3);
            $liLine.append($h3).append($ulProperty);


            v.status == 1 && $statusSwitch.prop("checked", true);
            $statusSwitch.switchBtn("status-lbl").on("click",function() {
                $statusSwitch.prop("checked") ? (updateStatus(v.rtId, 1, function(){$statusSwitch.removeAttr("checked")})) : (updateStatus(v.rtId, 0,function(){$statusSwitch.prop("checked")}));
            });

            $btnuptl.click(function () {
                receiptType.items.rtId.val(v.rtId);
                receiptType.items.name.val(v.name);
                receiptType.items.type.val(utils.accAdd($.inArray(v.type, receiptType.typeArray), 1));
                receiptType.items.fund.val(v.fund);
                receiptType.items.grade.val(v.grade);
                receiptType.items.kino.val(v.kino);
                receiptType.items.kiname.val(v.kiname);
                receiptType.items.kibalance.val(v.kibalance);
                receiptType.items.bankno.val(v.bankno);
                receiptType.items.assistant.val(v.assistant);
                receiptType.items.value.val(v.value);
                editFlg = false;

                if(['2', '3'].contains(receiptType.items.type.val())){
                    com.focusPage("#banknoDiv").css("display", "block");
                }

                receiptType.modal.receiptTypeModal.modal("show");
            });

            $btnAdd.click(function () {
                receiptType.currentRtid = v.rtId;
                receiptType.currentNo = v.no;
                receiptType.modal.receiptTypeItemModal.modal("show");
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
    var _condArr = ["data-receiptType-name","data-receiptType-type","data-receiptType-status","data-receiptType-fund"];

    searcher.init(_condArr, "condList", api.data.pageReceiptType, function (data) {
        displayFunc.init('resultList', data);
    }, "pagenation", "ReceiptTypePostData", null, false, null, function () {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-success').attr('name', 'add').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        $adda.click(function () {
            editFlg = true;
            receiptType.modal.receiptTypeModal.modal("show")
        });
        return [$adda];
    });

    function saveData() {
        var options = {
            "receiptType.name" : receiptType.items.name.val(),
            "receiptType.type" : receiptType.items.type.val(),
            "receiptType.fund" : receiptType.items.fund.val(),
            "receiptType.grade" : receiptType.items.grade.val(),
            "receiptType.kino" : receiptType.items.kino.val(),
            "receiptType.kiname" : receiptType.items.kiname.val(),
            "receiptType.kibalance" : receiptType.items.kibalance.val(),
            "receiptType.bankno" : receiptType.items.bankno.val(),
            "receiptType.assistant" : receiptType.items.assistant.val(),
            "receiptType.value" : receiptType.items.value.val()
        };

        if(com.validate("form1")){
            return;
        }
        if(editFlg){
            com.post(api.data.addReceiptType, options, function () {
                searcher.doSearch();
                com.showAlert(com.info, "添加成功");
                receiptType.modal.receiptTypeModal.modal("hide")
            })
        }else{
            options["receiptType.rtId"] = receiptType.items.rtId.val();
            com.post(api.data.updateReceiptType, options, function () {
                searcher.doSearch();
                com.showAlert(com.info, "修改成功");
                receiptType.modal.receiptTypeModal.modal("hide")
            })
        }
    }

    function updateStatus(id, status, failcallBack) {
        com.post(api.data.updateReceiptTypeForStatus, {
            "receiptType.rtId": id,
            "receiptType.status": status
        }, function () {
            searcher.doSearch();
        }, function () {
            failcallBack && failcallBack();
        });
    }

    function saveReceiptTypeItem () {
        if(com.validate("receiptTypeItemModal")) return;

        var options = {
            "receiptTypeItem.rtid": receiptType.currentRtid,
            "receiptTypeItem.no": receiptType.currentNo,
            "receiptTypeItem.name": receiptType.receiptTypeItems.itemName.val().replace(/\s+/g, ""),
            "receiptTypeItem.type": receiptType.receiptTypeItems.itemtype.val(),
            "receiptTypeItem.paytype": receiptType.receiptTypeItems.paytype.val()
        };

        com.post(api.data.addReceiptTypeItem, options, function(res){
            if (res.errorMsg != null) {
                com.showAlert(com.warning, res.errorMsg);
                return;
            }
            searcher.doSearch();
            receiptType.modal.receiptTypeItemModal.modal("hide");
        })
    }

});