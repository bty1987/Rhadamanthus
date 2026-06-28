jQuery(function($) {

    var decorationBusitype = {

        dbid: null,

        btns: {
            addDecorationBusitypeBtn: com.focusPage("#addDecorationBusitypeBtn").on("click", saveData)
        },

        modals: {
            decorationBusitypeModal: com.focusPage("#decorationBusitypeModal")
        },

        items: {
            name: com.focusPage("#name", "#decorationBusitypeModal"),
            alias: com.focusPage("#alias", "#decorationBusitypeModal"),
            outside: com.focusPage("#outside", "#decorationBusitypeModal"),
            isRefer: com.focusPage("#isRefer", "#decorationBusitypeModal"),
            isAward: com.focusPage("#isAward", "#decorationBusitypeModal"),
            type: com.focusPage("#type", "#decorationBusitypeModal"),
            notSalesmanRate: com.focusPage("#notSalesmanRate", "#decorationBusitypeModal"),
        },

    };

    decorationBusitype.items.outside.bindData(constant.data().decorationBusitype.outside.datas, "key", "value");
    decorationBusitype.items.isRefer.bindData(constant.data().decorationBusitype.isRefer.datas, "key", "value");
    decorationBusitype.items.isAward.bindData(constant.data().decorationBusitype.isAward.datas, "key", "value");
    decorationBusitype.items.type.bindData(constant.data().decorationBusitype.type.datas, "key", "value");

    var seacher = new Searcher();

    seacher.base("condList", "pagenation", "resultList", api.data.pageDecorationBusitype);
    seacher.condition(["data-decoration-busitype-name", "data-decoration-busitype-alias", "data-decoration-busitype-status", "data-decoration-busitype-outside", "data-decoration-busitype-isRefer", "data-decoration-busitype-isAward", "data-decoration-busitype-type"]);
    seacher.button([{
        id: "addDecorationBusitype",
        name: "添加",
        clazz: "btn-yellow hide",
        icon: "icon-plus"
    }]);

    seacher.history("decorationBusitypePostData");

    var lineprops = [{
        field: "alias",
        name: "上级",
        prop: "alias",
        clazz: "grey"
    }, {
        field: "outside",
        name: "三方标识",
        prop: "outside",
        clazz: "grey",
        dataset: constant.data().decorationBusitype.outside.keys
    }, {
        field: "isRefer",
        name: "推荐标识",
        prop: "isRefer",
        clazz: "red",
        dataset: constant.data().decorationBusitype.isRefer.keys
    }, {
        field: "isAward",
        name: "奖励标识",
        prop: "isAward",
        clazz: "red",
        dataset: constant.data().decorationBusitype.isAward.keys
    }, {
        field: "type",
        name: "类型",
        prop: "type",
        clazz: "red",
        dataset: constant.data().decorationBusitype.type.keys
    }, {
        field: "status",
        name: "状态",
        prop: "status",
        clazz: "red",
        dataset: constant.data().decorationBusitype.status.keys
    }, {
        field: "notSalesmanRate",
        name: "非提比例",
        prop: "notSalesmanRate",
        clazz: "red"
    }, ];

    var linebtus = [{
        name: "编辑",
        clazz: "btn-yellow",
        handle: function(v) {

            decorationBusitype.dbid = v.dbid;

            decorationBusitype.items.name.val(v.name);
            decorationBusitype.items.alias.val(v.alias);
            decorationBusitype.items.outside.val(v.outside);
            decorationBusitype.items.isRefer.val(v.isRefer);
            decorationBusitype.items.isAward.val(v.isAward);
            decorationBusitype.items.type.val(v.type);
            decorationBusitype.items.notSalesmanRate.val(v.notSalesmanRate);

            decorationBusitype.modals.decorationBusitypeModal.modal("show");

            return false;
        }
    }, {
        name: "状态",
        type: "switch",
        clazz: "status-lbl",
        handle: function(v, check) {

            com.post(api.data.updateDecorationBusitypeForStatus, {
                "decorationBusitype.dbid": v.dbid,
                "decorationBusitype.status": check ? 0 : 1
            });

            seacher.doSearch();

            return false;
        },
        init: function(v) {

            return !v.status;
        }
    }];

    seacher.line("name", lineprops, linebtus).render();

    com.focusPage('#addDecorationBusitype', '#pagenation').on("click", function() {

        decorationBusitype.dbid = null;

        decorationBusitype.items.name.val(null);
        decorationBusitype.modals.decorationBusitypeModal.modal("show");
    });

    function saveData() {

        if (com.validate('decorationBusitypeModal'))
            return false;

        var url = api.data.addDecorationBusitype;
        var options = {
            "decorationBusitype.name": decorationBusitype.items.name.val(),
            "decorationBusitype.alias": decorationBusitype.items.alias.val(),
            "decorationBusitype.outside": decorationBusitype.items.outside.val(),
            "decorationBusitype.isRefer": decorationBusitype.items.isRefer.val(),
            "decorationBusitype.isAward": decorationBusitype.items.isAward.val(),
            "decorationBusitype.type": decorationBusitype.items.type.val(),
            "decorationBusitype.notSalesmanRate": decorationBusitype.items.notSalesmanRate.val(),
        };

        if (decorationBusitype.dbid) {
            url = api.data.updateDecorationBusitype;
            options["decorationBusitype.dbid"] = decorationBusitype.dbid;
        }

        com.post(url, options, function() {

            com.showAlert(com.info, "操作成功");
            seacher.doSearch();
        });

        decorationBusitype.modals.decorationBusitypeModal.modal("hide")
    }

});
