$(function() {

    // 定义全局变量 json
    var systemDefineItem = {

        btns: {
            saveBtn: com.focusPage("#saveBtn")
        },

        modals: {
            addItemModal: com.focusPage("#addItemModal")
        },

        items: {
            sdiid: com.focusPage("#sdiid"),
            no: com.focusPage("#no"),
            name: com.focusPage("#name"),
            quotationBigCategory: com.focusPage("#quotationBigCategory"),
            measurementUnit: com.focusPage("#measurementUnit"),
            workType: com.focusPage("#workType"),
            addPrice: com.focusPage("#addPrice"),
            unitPrice: com.focusPage("#unitPrice"),
            subPrice: com.focusPage("#subPrice"),

            comment: com.focusPage("#comment"),
        },

        validator: {
            systemDefineItem: {
                type: "v_systemDefaineItemId",
                regex: /^SI_\d{5}$/,
                errorMsg: "请以SI_作为前缀 , 之后以五个位数字组成(如SI_00001)."
            }
        },
    };

    $.extend(com.validator, systemDefineItem.validator); // 将多个对象合并成一个对象

    com.post(api.common.queryMeasurementUnit, {}, function(res) {

        com.focusPage("#measurementUnit").bindData(res.measurementUnits, "id", "name");
    });

    com.post(api.quotation.queryQuotationBigCategory, {}, function(res) {

        com.focusPage("#quotationBigCategory").bindData(res.quotationBigCategorys, "id", "name");
    });

    com.post(api.common.queryWorkType, {}, function(res) {

        com.focusPage("#workType").bindData(res.workTypes, "id", "name");
    });

    systemDefineItem.btns.saveBtn.on("click", saveData);

    systemDefineItem.modals.addItemModal.on('hide.bs.modal', function(e) {

        com.clearValidator();
        com.cleanItems("addItemModal");
    });

    var lineprops = (function() {

        return [{
            field: "no",
            name: "编号",
            prop: "no",
            clazz: "blue"
        }, {
            field: "bigCategory.name",
            name: "大类",
            prop: "bigCategory.name",
            clazz: "red"
        }, {
            field: "unit.name",
            name: "单位",
            prop: "unit.name",
            clazz: "red"
        }, {
            field: "workType.name",
            name: "工种",
            prop: "workType.name",
            clazz: "red"
        }, {
            field: "addPrice",
            name: "增补价",
            prop: "addPrice",
            clazz: "blue"
        }, {
            field: "unitPrice",
            name: "原单价",
            prop: "unitPrice",
            clazz: "blue"
        }, {
            field: "subPrice",
            name: "退减价",
            prop: "subPrice",
            clazz: "blue"
        }];
    })();

    var linebtns = (function() {

        return {
            edit: {
                name: "编辑",
                clazz: "btn-yellow",
                handle: function(v) {
                    edit(v);
                }
            },
            del: {
                name: "删除",
                clazz: "btn-success",
                handle: function(v) {
                    remove(v.sdiid);
                }
            },
            status: {
                name: "状态",
                type: "switch",
                clazz: "status-lbl",
                init: function(v) {
                    return v.status;
                },
                handle: function(v, check) {
                    updateStatus(v.sdiid, check ? 1 : 0, null);
                }
            },
            discount: {
                name: "打折",
                type: "switch",
                clazz: "discount-lbl",
                init: function(v) {
                    return v.discount;
                },
                handle: function(v, check) {
                    updateDiscount(v.sdiid, check ? 1 : 0, null);
                }
            }
        };
    })();

    var buttons = (function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('name', 'addSystemDefineItem').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    })();

    var searcher = new Searcher();

    searcher.set("condList", "pagenation", "resultList", api.quotation.pageSystemDefineItem, null, ['data-quotation-item-name', 'data-quotation-bigcategory', 'quotation-worktype'], "SystemDefineItemPostData", null, false, buildSystemDefineItemButtons);
    searcher.line("name", lineprops, linebtns).render();

    // 编辑
    function edit(row) {

        // 给页面标签赋值

        systemDefineItem.items.sdiid.val(row.sdiid);
        systemDefineItem.items.no.val(row.no);
        systemDefineItem.items.name.val(row.name);

        systemDefineItem.items.quotationBigCategory.val(row.bigCategory.id);
        systemDefineItem.items.workType.val(row.workType.id);
        systemDefineItem.items.measurementUnit.val(row.unit.id);

        systemDefineItem.items.addPrice.val(row.addPrice);
        systemDefineItem.items.unitPrice.val(row.unitPrice);
        systemDefineItem.items.subPrice.val(row.subPrice);

        systemDefineItem.items.comment.val(row.comment);

        systemDefineItem.items.no.prop("disabled", true);

        systemDefineItem.modals.addItemModal.modal("show"); // 弹出弹层
    }

    function saveData() {

        com.clearValidator();

        if (com.validate("addItemModal")) {
            return false;
        }

        var url = api.quotation.addSystemDefineItem;
        var options = {
            "systemDefineItem.no": systemDefineItem.items.no.val(),
            "systemDefineItem.name": systemDefineItem.items.name.val(),
            "systemDefineItem.bigCategory.id": systemDefineItem.items.quotationBigCategory.val(),
            "systemDefineItem.unit.id": systemDefineItem.items.measurementUnit.val(),
            "systemDefineItem.workType.id": systemDefineItem.items.workType.val(),
            "systemDefineItem.addPrice": systemDefineItem.items.addPrice.val(),
            "systemDefineItem.unitPrice": systemDefineItem.items.unitPrice.val(),
            "systemDefineItem.subPrice": systemDefineItem.items.subPrice.val(),
            "systemDefineItem.comment": systemDefineItem.items.comment.val(),
        };

        if (systemDefineItem.items.sdiid.val()) {
            url = api.quotation.updateSystemDefineItem;
            options["systemDefineItem.sdiid"] = systemDefineItem.items.sdiid.val();
        }

        com.post(url, options, function(res) {

            com.showAlert(com.info, "操作成功");

            searcher.doSearch();
            systemDefineItem.modals.addItemModal.modal("hide");
        });
    }

    // 添加
    com.focusPage('[name="addSystemDefineItem"]', '#pagenation').on("click", function() { // 选择器 [属性名="属性值"] 匿名函数

        systemDefineItem.items.no.prop("disabled", false);

        com.cleanItems(systemDefineItem.items);

        systemDefineItem.modals.addItemModal.modal("show");
    });

    // 删除
    function remove(sdiid) {

        com.showConfirm("是否删除所选记录", function() {

            com.post(api.quotation.deleteSystemDefineItem, {
                "systemDefineItem.sdiid": sdiid
            }, function(res) {

                searcher.doSearch();
            });
        });
    }

    // 启用禁用功能
    function updateStatus(sdiid, status, failcallBack) {

        var options = {
            "systemDefineItem.sdiid": sdiid,
            "systemDefineItem.status": status
        };

        com.post(api.quotation.updateSystemDefineItemForStatus, options);
    }

    // 是否打折设置
    function updateDiscount(sdiid, discount, failcallBack) {

        var options = {
            "systemDefineItem.sdiid": sdiid,
            "systemDefineItem.discount": discount
        };

        com.post(api.quotation.updateSystemDefineItemForDiscount, options);
    }

});
