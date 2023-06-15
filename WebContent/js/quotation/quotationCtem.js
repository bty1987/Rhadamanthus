$(function() {

    var quotationCtem = {
        qcid: null,

        btns: {
            saveBtn: com.focusPage("#saveQuotationCtemBtn").on("click", saveData)

        },
        modals: {
            updateQuotationCtemModal: com.focusPage("#updateQuotationCtemModal")
        },
        items: {
            name: com.focusPage("#name", "#updateQuotationCtemModal"),
            type: com.focusPage("#type", "#updateQuotationCtemModal"),
            quotationType: com.focusPage("#quotationType", "#updateQuotationCtemModal"),
            quotationClassification: com.focusPage("#quotationClassification", "#updateQuotationCtemModal"),
            quotationBigCategory: com.focusPage("#quotationBigCategory", "#updateQuotationCtemModal"),
            quotationSmallCategory: com.focusPage("#quotationSmallCategory", "#updateQuotationCtemModal"),
            measurementUnit: com.focusPage("#measurementUnit", "#updateQuotationCtemModal"),
            workType: com.focusPage("#workType", "#updateQuotationCtemModal"),
        },

        status: {},
        types: []
    };
    com.post(api.ds.quotation, {}, function(a) {

        quotationCtem.items.type.bindData(a.quotationItemType.slice(0, 4), "key", "value");
        quotationCtem.types = a.quotationItemType.split("key", "value");
    }, null, false);

    com.post(api.quotation.queryQuotationType, {}, function(a) {

        quotationCtem.items.quotationType.bindData(a.quotationTypes, "id", "name");
        quotationCtem.items.quotationType.prepend("<option value='0' selected='selected'>请选择</option>");
    }, null, false);

    com.post(api.quotation.queryQuotationClassification, {}, function(a) {

        quotationCtem.items.quotationClassification.bindData(a.quotationClassifications, "id", "name");
    });

    com.post(api.common.queryMeasurementUnit, {}, function(a) {

        quotationCtem.items.measurementUnit.bindData(a.measurementUnits, "id", "name");
    });

    com.post(api.common.queryWorkType, {}, function(a) {

        quotationCtem.items.workType.bindData(a.workTypes, "id", "name");
    });

    quotationCtem.items.quotationType.change(function() {

        var quotationType = $(this).val();

        if (quotationType == false) {
            openModal();
            return false;
        } else {
            queryQuotationBigCategory(quotationType);
            queryQuotationSmallCategory(quotationType);
        }

    });

    quotationCtem.modals.updateQuotationCtemModal.on('hide.bs.modal', function() {

        com.cleanItems(quotationCtem.items);
    });

    var searcher = new Searcher();

    com.focusPage("#quotationCtemPageContent").removeClass("page-content");

    searcher.base("condList", "pagenation", "resultList", api.quotation.pageQuotationCtem);
    searcher.condition(["data-quotation-ctem-name"]);

    searcher.button([{
        id: "addQuotationCtem",
        name: "添加",
        clazz: "btn-yellow",
        icon: "icon-plus"
    }]);

    searcher.history("quotationCtemPostData");

    var ctemprops = [{
        field: "name",
        name: "名称",
        prop: "name",
        clazz: "grey"
    }, {
        field: "type",
        name: "业务",
        prop: "type",
        dataset: quotationCtem.types,
        clazz: "red"
    }, {
        field: "category.name",
        name: "类型",
        prop: "category.name",
        clazz: "red"
    }, {
        field: "classification.name",
        name: "分类",
        prop: "classification.name",
        clazz: "red"
    }, {
        field: "bigCategory.name",
        name: "大类",
        prop: "bigCategory.name",
        clazz: "red"
    }, {
        field: "smallCategory.name",
        name: "小类",
        prop: "smallCategory.name",
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
    }];

    var linebtns = [{
        name: "规格",
        clazz: "btn-warning",
        handle: function(v) {

            params.data.quotationCtem = v;

            com.popup4page("#quotationCtemPopUp", "/views/quotation/quotationFormat.html", "规格");

            return false;
        }
    }, {
        name: "工费",
        clazz: "btn-inverse",
        handle: function(v) {

            params.data.quotationCtem = v;

            com.popup4page("#quotationCtemPopUp", "/views/data/cormrice.html", "工费");

            return false;
        }
    }, {
        name: "编辑",
        clazz: "btn-yellow",
        handle: function(v) {

            queryQuotationBigCategory(v.qtid);
            queryQuotationSmallCategory(v.qtid);

            quotationCtem.qcid = v.qcid;

            quotationCtem.items.name.val(v.name);
            quotationCtem.items.type.val(v.type);
            quotationCtem.items.quotationType.val(v.category.id);
            quotationCtem.items.quotationClassification.val(v.classification.id);
            quotationCtem.items.quotationBigCategory.val(v.bigCategory.id);
            quotationCtem.items.quotationSmallCategory.val(v.smallCategory.id);
            quotationCtem.items.workType.val(v.workType.id);
            quotationCtem.items.measurementUnit.val(v.unit.id);

            quotationCtem.modals.updateQuotationCtemModal.modal("show");

            return false;
        }
    }, {
        name: "状态",
        type: "switch",
        clazz: "status-lbl",
        handle: function(v, check) {

            com.post(api.quotation.updateQuotationCtemForStatus, {
                "quotationCtem.qcid": v.qcid,
                "quotationCtem.status": check ? 0 : 1
            });

            return false;
        },
        init: function(v) {

            return !v.status;
        }
    }];

    searcher.line("name", ctemprops, linebtns).render();

    com.focusPage('#addQuotationCtem', '#pagenation').on("click", function() {

        quotationCtem.qcid = null;

        quotationCtem.modals.updateQuotationCtemModal.modal("show");
    });

    function saveData() {

        if (com.validate('updateQuotationCtemModal'))
            return false;

        var _quotationType = quotationCtem.items.quotationType.val() == false;
        var _quotationBigCategory = quotationCtem.items.quotationBigCategory.val() == false;
        var _quotationSmallCategory = quotationCtem.items.quotationSmallCategory.val() == false;
        if (_quotationType || _quotationBigCategory || _quotationSmallCategory) {
            com.showAlert(com.warning, "请选择类型以及大类小类");
            return;
        }

        var url = api.quotation.addQuotationCtem;

        var options = {
            "quotationCtem.name": quotationCtem.items.name.val(),
            "quotationCtem.type": quotationCtem.items.type.val(),

            "quotationCtem.category.id": quotationCtem.items.quotationType.val(),
            "quotationCtem.classification.id": quotationCtem.items.quotationClassification.val(),
            "quotationCtem.bigCategory.id": quotationCtem.items.quotationBigCategory.val(),
            "quotationCtem.smallCategory.id": quotationCtem.items.quotationSmallCategory.val(),
            "quotationCtem.unit.id": quotationCtem.items.measurementUnit.val(),
            "quotationCtem.workType.id": quotationCtem.items.workType.val(),
        };

        if (quotationCtem.qcid) {
            url = api.quotation.updateQuotationCtem;
            options['quotationCtem.qcid'] = quotationCtem.qcid;
        }

        com.post(url, options, function(res) {

            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
        });

        quotationCtem.modals.updateQuotationCtemModal.modal("hide");
    }

    function queryQuotationBigCategory(quotationType) {

        com.post(api.quotation.queryQuotationBigCategory, {
            "quotationBigCategory.qtid": quotationType
        }, function(a) {

            quotationCtem.items.quotationBigCategory.bindData(a.quotationBigCategorys, "id", "name");
            quotationCtem.items.quotationBigCategory.prepend("<option value='0' selected='selected'>请选择类型</option>");
        }, null, false);
    }
    ;

    function queryQuotationSmallCategory(quotationType) {

        com.post(api.quotation.queryQuotationSmallCategory, {
            "quotationSmallCategory.qtid": quotationType
        }, function(a) {

            quotationCtem.items.quotationSmallCategory.bindData(a.quotationSmallCategorys, "id", "name");
            quotationCtem.items.quotationSmallCategory.prepend("<option value='0' selected='selected'>请选择类型</option>");
        }, null, false);
    }
    ;

    function openModal() {

        quotationItem.items.quotationBigCategory.html('');
        quotationItem.items.quotationSmallCategory.html('');
        quotationItem.items.quotationBigCategory.prepend("<option value='0' selected='selected'>请选择类型</option>");
        quotationItem.items.quotationSmallCategory.prepend("<option value='0' selected='selected'>请选择类型</option>");
    }
    ;

});