$(function($) {

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
        cleanItemsitems: {},
        types: constant.data().receiptType.type.keys,
        funds: constant.data().receiptType.fund.keys,
        currentRtid: null,
        currentNo: null,
        paymentTypes: constant.data().paymentType.type.keys,
        paytypes: constant.data().paymentType.paytype.keys,

        pageType: params.urlLoadParams.type
    };

    receiptType.items.grade.bindData(constant.data().receiptType.grade.datas, "key", "value");
    receiptType.items.fund.bindData(constant.data().receiptType.fund.datas, "key", "value");
    receiptType.receiptTypeItems.itemtype.bindData(constant.data().paymentType.type.datas, "key", "value");
    receiptType.receiptTypeItems.paytype.bindData(constant.data().paymentType.paytype.datas, "key", "value");

    receiptType.modal.receiptTypeModal.on('hide.bs.modal', function(e) {

        com.clearValidator();
        com.cleanItems(receiptType.items);
        com.focusPage("#banknoDiv").css("display", "none");
    });

    receiptType.modal.receiptTypeItemModal.on('hide.bs.modal', function(e) {

        com.clearValidator();
        com.cleanItems(receiptType.receiptTypeItems);
        receiptType.currentRtid = null;
        receiptType.currentNo = null;
    });

    receiptType.items.type.on("change", function() {

        var typeVal = receiptType.items.type.val();

        (['2', '3'].contains(typeVal)) ? com.focusPage("#banknoDiv").css("display", "block") : com.focusPage("#banknoDiv").css("display", "none");
    });

    var lineprops = (function() {

        var lineprops = [{
            field: "no",
            name: "键值",
            prop: "no",
            clazz: "grey"
        }, {
            field: "type",
            name: "类型",
            prop: function(v) { return receiptType.types[v.type]; },
            clazz: "red"
        }, {
            field: "fund",
            name: "资金类型",
            prop: function(v) { return receiptType.funds[v.fund]; },
            clazz: "red"
        }, {
            field: "status",
            name: "状态",
            prop: function(v) { return v.status == 1 ? "启用" : "禁用"; },
            clazz: "red"
        }, {
            field: "grade",
            name: "等级",
            prop: function(v) { return com.checkNull(v.grade, "无"); },
            clazz: "red"
        }, {
            field: "kino",
            name: "金蝶编号",
            prop: function(v) { return com.checkNull(v.kino, "无"); },
            clazz: "grey"
        }, {
            field: "kiname",
            name: "金蝶名称",
            prop: function(v) { return com.checkNull(v.kiname, "无"); },
            clazz: "grey"
        }, {
            field: "kibalance",
            name: "结算方式",
            prop: function(v) { return com.checkNull(v.kibalance, "无"); },
            clazz: "grey"
        }, {
            field: "bankno",
            name: "银行账号",
            prop: function(v) { return com.checkNull(v.bankno, "无"); },
            clazz: "blue"
        }, {
            field: "assistant",
            name: "辅核项",
            prop: function(v) { return com.checkNull(v.assistant, "无"); },
            clazz: "grey"
        }, {
            field: "value",
            name: "POS值",
            prop: function(v) { return com.checkNull(v.value, "无"); },
            clazz: "grey"
        }];

        // 动态 receiptTypeItems,按行渲染为独立 lineprop(用 custom + render)
        lineprops.push({
            field: "receiptTypeItems",
            name: "收款项",
            type: "custom",
            prop: function(v) {

                if (!v.receiptTypeItems || v.receiptTypeItems.length == 0) return "";
                return $.map(v.receiptTypeItems, function(item) {
                    return receiptType.paymentTypes[item.type] + receiptType.paytypes[item.paytype] + ": " + item.name;
                }).join("  ");
            },
            render: function($liLine, v, $ulProperty) {

                if (!v.receiptTypeItems || v.receiptTypeItems.length == 0) return;

                $.each(v.receiptTypeItems, function(i, item) {

                    var $liProperty = $('<li></li>').appendTo($ulProperty);
                    $('<strong></strong>').html(receiptType.paymentTypes[item.type] + receiptType.paytypes[item.paytype] + ":").appendTo($liProperty);
                    $('<b></b>').html(item.name).addClass("grey").appendTo($liProperty);
                });
            }
        });

        return lineprops;
    })();

    var linebtns = (function() {

        var btns = {
            status: {
                type: "switch",
                clazz: "status-lbl",
                init: function(v) { return v.status == 1; },
                handle: function(v, checked) { updateStatus(v.rtId, checked ? 1 : 0, null); }
            },
            update: {
                name: "修改",
                clazz: "btn-yellow",
                handle: function(v) {
                    receiptType.items.rtId.val(v.rtId);
                    receiptType.items.name.val(v.name);
                    receiptType.items.type.val(v.type);
                    receiptType.items.fund.val(v.fund);
                    receiptType.items.grade.val(v.grade);
                    receiptType.items.kino.val(v.kino);
                    receiptType.items.kiname.val(v.kiname);
                    receiptType.items.kibalance.val(v.kibalance);
                    receiptType.items.bankno.val(v.bankno);
                    receiptType.items.assistant.val(v.assistant);
                    receiptType.items.value.val(v.value);
                    editFlg = false;

                    if (['2', '3'].contains(receiptType.items.type.val())) {
                        com.focusPage("#banknoDiv").css("display", "block");
                    }

                    receiptType.modal.receiptTypeModal.modal("show");
                }
            },
            add: {
                name: "单据",
                clazz: "btn-success",
                handle: function(v) {
                    receiptType.currentRtid = v.rtId;
                    receiptType.currentNo = v.no;
                    receiptType.modal.receiptTypeItemModal.modal("show");
                }
            }
        };

        return btns;
    })();

    var buttons = (function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-success').attr('name', 'add').css("margin", "0px 3px");
        $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        $('<span></span>').text('添加').appendTo($adda);

        $adda.click(function() {
            editFlg = true;
            receiptType.modal.receiptTypeModal.modal("show");
        });

        if (receiptType.pageType == "common") {
            return [$adda];
        }
        return [];
    })();

    var searcher = new Searcher();
    var _condArr = ["data-receiptType-name", "data-receiptType-type", "data-receiptType-status", "data-receiptType-fund", "data-receiptType-grade", "data-receiptType-kino", "data-receiptType-kiname", "data-receiptType-kibalance", "data-receiptType-bankno", "data-receiptType-assistant", "data-receiptType-value"];

    searcher.set("condList", "pagenation", "resultList", api.data.pageReceiptType, null, _condArr, "ReceiptTypePostData", null, false, buttons);
    searcher.line("name", lineprops, linebtns).render();

    function saveData() {

        var options = {
            "receiptType.name": receiptType.items.name.val(),
            "receiptType.type": receiptType.items.type.val(),
            "receiptType.fund": receiptType.items.fund.val(),
            "receiptType.grade": receiptType.items.grade.val(),
            "receiptType.kino": receiptType.items.kino.val(),
            "receiptType.kiname": receiptType.items.kiname.val(),
            "receiptType.kibalance": receiptType.items.kibalance.val(),
            "receiptType.bankno": receiptType.items.bankno.val(),
            "receiptType.assistant": receiptType.items.assistant.val(),
            "receiptType.value": receiptType.items.value.val()
        };

        if (com.validate("form1")) {
            return;
        }
        if (editFlg) {
            com.post(api.data.addReceiptType, options, function() {

                searcher.doSearch();
                com.showAlert(com.info, "添加成功");
                receiptType.modal.receiptTypeModal.modal("hide")
            })
        } else {
            options["receiptType.rtId"] = receiptType.items.rtId.val();
            com.post(api.data.updateReceiptType, options, function() {

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
        }, function() {

            searcher.doSearch();
        }, function() {

            failcallBack && failcallBack();
        });
    }

    function saveReceiptTypeItem() {

        if (com.validate("receiptTypeItemModal"))
            return;

        var options = {
            "receiptTypeItem.rtid": receiptType.currentRtid,
            "receiptTypeItem.no": receiptType.currentNo,
            "receiptTypeItem.name": receiptType.receiptTypeItems.itemName.val().replace(/\s+/g, ""),
            "receiptTypeItem.type": receiptType.receiptTypeItems.itemtype.val(),
            "receiptTypeItem.paytype": receiptType.receiptTypeItems.paytype.val()
        };

        com.post(api.data.addReceiptTypeItem, options, function(res) {

            if (res.errorMsg != null) {
                com.showAlert(com.warning, res.errorMsg);
                return;
            }
            searcher.doSearch();
            receiptType.modal.receiptTypeItemModal.modal("hide");
        })
    }

});