$(function() {

    var quotationVersion = {

        modals: {
            updateQuotationVersionModal: com.focusPage("#updateQuotationVersionModal").on("show.bs.modal", function(a) {
                com.clearValidator();
            }),
        },

        items: {
            name: com.focusPage("#name", "#updateQuotationVersionModal"),
            trafficRate: com.focusPage("#trafficRate", "#updateQuotationVersionModal"),
            trafficDiscount: com.focusPage("#trafficDiscount", "#updateQuotationVersionModal").switchBtn(),
            manageRate: com.focusPage("#manageRate", "#updateQuotationVersionModal"),
            manageDiscount: com.focusPage("#manageDiscount", "#updateQuotationVersionModal").switchBtn(),
            taxRate: com.focusPage("#taxRate", "#updateQuotationVersionModal"),
            taxDiscount: com.focusPage("input[name=taxDiscount]", "#updateQuotationVersionModal"),
            manageTaxDiscount: com.focusPage("#manageTaxDiscount", "#updateQuotationVersionModal"),
            totalTaxDiscount: com.focusPage("#totalTaxDiscount", "#updateQuotationVersionModal"),

            type: com.focusPage("#type", "#updateQuotationVersionModal"),
            offset: com.focusPage("#offset", "#updateQuotationVersionModal"),
            comment: com.focusPage("#comment", "#updateQuotationVersionModal"),
        },

        btns: {
            saveBtn: com.focusPage("#saveBtn").on("click", saveData),
        },

        qvid: null,
        no: null,

        types: [],
    };

    com.post(api.ds.quotation, {}, function(res) {
        quotationVersion.types = res.quotationVersionType.split("key", "value");

        quotationVersion.items.type.bindData(res.quotationVersionType, "key", "value");
    }, null, false);

    var searcher = new Searcher();

    searcher.base("condList", "pagenation", "resultList", api.quotation.pageQuotationVersion);
    searcher.condition(['data-quotation-version-no', 'data-quotation-version-name', 'data-quotation-version-type']);
    searcher.history("quotationVersionPostData");

    searcher.button(function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('name', 'addQuotationVersion').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    });

    var lineprops = [{
        field: "no",
        name: "编号",
        prop: "no",
        clazz: "blue"
    }, {
        field: "trafficRate",
        name: "车运费比例",
        prop: "trafficRate",
        clazz: "blue"
    }, {
        field: "trafficDiscount",
        name: "车运费折扣",
        prop: function(v) {
            return v.trafficDiscount == 0 ? '不打折' : v.trafficDiscount == 1 ? '打折' : '-';
        },
        clazz: "red"
    }, {
        field: "manageRate",
        name: "管理费比例",
        prop: "manageRate",
        clazz: "blue"
    }, {
        field: "manageDiscount",
        name: "管理费折扣",
        prop: function(v) {
            return v.manageDiscount == 0 ? '不打折' : v.manageDiscount == 1 ? '打折' : '-';
        },
        clazz: "red"
    }, {
        field: "taxRate",
        name: "税金比例",
        prop: "taxRate",
        clazz: "blue"
    }, {
        field: "taxDiscount",
        name: "税金折扣",
        prop: function(v) {

            return v.taxDiscount == 0 ? '管理税金' : v.taxDiscount == 1 ? '总额税金' : '-';
        },
        clazz: "red"
    }, {
        field: "type",
        name: "类型",
        prop: "type",
        dataset: quotationVersion.types,
        clazz: "red"
    }, {
        field: "defaultFlag",
        name: "默认",
        prop: function(v) {
            return v.defaultFlag == 0 ? '否' : v.defaultFlag == 1 ? '是' : '-';
        },
        clazz: "red"
    }, {
        field: "offset",
        name: "偏移量",
        prop: "offset",
        clazz: "blue"
    }, {
        field: "comment",
        name: "备注",
        prop: "comment",
        clazz: "grey"
    }, ];

    var linebtns = [{
        name: "编辑",
        clazz: "btn-yellow",
        handle: function(v) {
            quotationVersion.qvid = v.qvId;
            quotationVersion.no = v.no;

            editLine(v);
            return false;
        }
    }, {
        name: "导出报价项",
        clazz: "btn-pink",
        handle: function(v) {

            expdebjx(v);
            return false;
        }
    }, {
        name: "导出定额材料",
        clazz: "btn-info",
        handle: function(v) {
            expdecl(v);
            return false;
        }
    }, {
        name: "导出定额工费",
        clazz: "btn-success",
        handle: function(v) {
            expdegf(v);
            return false;
        }
    }, {
        name: "默认",
        type: "switch",
        clazz: "default-lbl",
        handle: function(v, check) {

            com.post(api.quotation.updateQuotationVersionForDefault, {
                "quotationVersion.no": v.no,
                "quotationVersion.defaultFlag": check ? 1 : 0
            });

            return false;
        },
        init: function(v) {

            return v.defaultFlag;
        }
    }, ];

    searcher.line("name", lineprops, linebtns);

    searcher.render();

    $.extend(com.validator, quotationVersion.validator);

    com.focusPage('a[name="addQuotationVersion"]', '#pagenation').click(function() {

        quotationVersion.qvid = null;
        quotationVersion.no = null;
        com.cleanItems(quotationVersion.items);

        quotationVersion.modals.updateQuotationVersionModal.modal("show");
    });

    function editLine(b) {

        quotationVersion.qvid = b.qvId;

        quotationVersion.items.name.val(b.name);
        quotationVersion.items.trafficRate.val(b.trafficRate);
        quotationVersion.items.manageRate.val(b.manageRate);
        quotationVersion.items.taxRate.val(b.taxRate);
        quotationVersion.items.type.val(b.type);
        quotationVersion.items.offset.val(b.offset);

        quotationVersion.items.comment.val(b.comment);

        quotationVersion.items.trafficDiscount.prop("checked", b.trafficDiscount == 1);
        quotationVersion.items.manageDiscount.prop("checked", b.manageDiscount == 1);
        quotationVersion.items.manageTaxDiscount.prop("checked", b.taxDiscount == 0);
        quotationVersion.items.totalTaxDiscount.prop("checked", b.taxDiscount == 1);

        quotationVersion.modals.updateQuotationVersionModal.modal("show");
    }

    function saveData() {

        com.clearValidator();

        if (com.validate("updateQuotationVersionModal"))
            return false;

        var url = api.quotation.addQuotationVersion;
        var options = {
            "quotationVersion.name": quotationVersion.items.name.val(),
            "quotationVersion.trafficRate": quotationVersion.items.trafficRate.val(),
            "quotationVersion.trafficDiscount": quotationVersion.items.trafficDiscount.prop("checked") ? 1 : 0,
            "quotationVersion.manageRate": quotationVersion.items.manageRate.val(),
            "quotationVersion.manageDiscount": quotationVersion.items.manageDiscount.prop("checked") ? 1 : 0,
            "quotationVersion.taxRate": quotationVersion.items.taxRate.val(),
            "quotationVersion.taxDiscount": quotationVersion.items.taxDiscount.prop("checked") ? 0 : 1,
            "quotationVersion.type": quotationVersion.items.type.val(),
            "quotationVersion.offset": quotationVersion.items.offset.val(),
            "quotationVersion.comment": quotationVersion.items.comment.val(),
        };

        if (quotationVersion.no) {
            url = api.quotation.updateQuotationVersion;
            options["quotationVersion.no"] = quotationVersion.no;
        }

        com.post(url, options, function(res) {
            com.showAlert(com.info, "操作成功");
            searcher.doSearch();

            quotationVersion.modals.updateQuotationVersionModal.modal("hide");
        });

    }

    function expdecl(v) {

        if (com.focusPage('span[name="totalRecords"]').text() == 0) {
            com.showAlert(com.warning, "请通过条件进行查询");
            return false;
        }
        if (com.focusPage('span[name="totalRecords"]').text() > 2000) {
            com.showAlert(com.warning, "查询结果大于阀值 , 不能完成导出动作");
            return false;
        }
        var quotationVersionPostData = params.quotationVersionPostData;

        com.post(api.data.pageNormood, $.extend({}, quotationVersionPostData, {
            "paging.noPage": 1,
            "filters[0].field": "versionId",
            "filters[0].data": v.no,
            "filters[0].op": "eq"
        }), function(res) {
            $.exceler({
                column: [["材料名称", "goods.name"], ["报价项编号", "quotationItem.no"], ["报价项名称", "quotationItem.name"], ["报价项单位", "quotationItem.unit.name"], ["报价项工种", "quotationItem.workType.name"], ["报价项单价", "quotationItem.unitPrice"], ["品牌", "goods.brand"], ["品类", "goods.category"], ["商品单位", "goods.measurementUnit"], ["定额单位", "normunit"], ["定额数量", "normnum"], ["库房单位", "storeunit"], ["库房数量", "storenum"], ["状态", "status"], ],
                list: res.paging.data,
            }, function(v) {
                v.status = v.status == 0 ? '有效' : v.status == 1 ? '无效' : '---';
            });
        });
    }

    function expdegf(v) {

        if (com.focusPage('span[name="totalRecords"]').text() == 0) {
            com.showAlert(com.warning, "请通过条件进行查询");
            return false;
        }

        if (com.focusPage('span[name="totalRecords"]').text() > 2000) {
            com.showAlert(com.warning, "查询结果大于阀值 , 不能完成导出动作");
            return false;
        }

        var quotationVersionPostData = params.quotationVersionPostData;

        com.post(api.data.pageNormrice, $.extend({}, quotationVersionPostData, {
            "paging.noPage": 1,
            "filters[0].field": "versionId",
            "filters[0].data": v.no,
            "filters[0].op": "eq"
        }), function(res) {
            $.exceler({
                column: [["工费名称", "constructionNode.name"], ["报价项编号", "quotationItem.no"], ["报价项名称", "quotationItem.name"], ["报价项单位", "quotationItem.unit.name"], ["报价项工种", "quotationItem.workType.name"], ["报价项单价", "quotationItem.unitPrice"], ["定额单位", "unit"], ["转换量", "trannum"], ["工费", "salary"], ["状态", "status"], ],
                list: res.paging.data,
            }, function(v) {
                v.status = v.status == 0 ? '有效' : v.status == 1 ? '无效' : '---';
            });
        });
    }

    function expdebjx(v) {

        if (com.focusPage('span[name="totalRecords"]').text() == 0) {
            com.showAlert(com.warning, "请通过条件进行查询");
            return false;
        }
        if (com.focusPage('span[name="totalRecords"]').text() > 2000) {
            com.showAlert(com.warning, "查询结果大于阀值 , 不能完成导出动作");
            return false;
        }
        var quotationVersionPostData = params.quotationVersionPostData;

        com.post(api.quotation.pageQuotationItem, $.extend({}, quotationVersionPostData, {
            "paging.noPage": 1,
            "filters[0].field": "versionId",
            "filters[0].data": v.no,
            "filters[0].op": "eq"
        }), function(res) {

            $.exceler({
                column: [['编号', 'no'], ['名称', 'name'], ['版本', 'version.name'], ['类型', 'category.name'], ['分类', 'classification.name'], ['大类', 'bigCategory.name'], ['小类', 'smallCategory.name'], ['单位', 'unit.name'], ['工种', 'workType.name'], ['增补价', 'addPrice'], ['单价', 'unitPrice'], ['退减价', 'subPrice'], ['是否打折', 'discount'], ['状态', 'status'], ['说明', 'comment'], ],
                list: res.paging.data,
            }, function(v) {

                v.discount = v.discount == 0 ? '不打折' : '打折';
                v.status = v.status == 0 ? '启用' : '禁用';
            });
        });
    }

});
