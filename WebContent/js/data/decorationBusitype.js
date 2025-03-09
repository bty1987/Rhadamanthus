jQuery(function($) {

    var decorationBusitype = {

        dbid: null,

        btns: {
            addDecorationBusitypeBtn: com.focusPage("#addDecorationBusitypeBtn").on("click", saveData)
        },

        modals: {
            DecorationBusitypeModal: com.focusPage("#DecorationBusitypeModal")
        },

        items: {
            name: com.focusPage("#decorationBusitypeName"),
            outside: com.focusPage("#outside")
        },

        status: ["启用", "禁用"],
        outsides: constant.data().decorationBusitype.outside.keys
    };

    decorationBusitype.items.outside.bindData(constant.data().decorationBusitype.outside.datas, "key", "value");

    var seacher = new Searcher();

    seacher.base("condList", "pagenation", "resultList", api.data.pageDecorationBusitype);
    seacher.condition(["data-decoration-busitype-name", "data-decoration-busitype-status"]);
    seacher.button([{
        id: "addDecorationBusitype",
        name: "添加",
        clazz: "btn-yellow hide",
        icon: "icon-plus"
    }]);

    seacher.history("decorationBusitypePostData");

    var lineprops = [{
        field: "outside",
        name: "三方标识",
        prop: "outside",
        clazz: "grey",
        dataset: constant.data().decorationBusitype.outside.keys
    },{
        field: "status",
        name: "状态",
        prop: "status",
        clazz: "red",
        dataset: decorationBusitype.status
    }];

    var linebtus = [{
        name: "编辑",
        clazz: "btn-yellow",
        handle: function(v) {

            decorationBusitype.editFlg = false;
            decorationBusitype.dbid = v.dbid;

            decorationBusitype.items.name.val(v.name);
            decorationBusitype.items.outside.val(v.outside);

            decorationBusitype.modals.DecorationBusitypeModal.modal("show");
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

        decorationBusitype.editFlg = true;
        decorationBusitype.dbid = null;

        decorationBusitype.items.name.val(null);
        decorationBusitype.modals.DecorationBusitypeModal.modal("show");
    });

    function saveData() {

        if (com.validate('DecorationBusitypeModal'))
            return false;

        var url = api.data.addDecorationBusitype;
        var options = {
            "decorationBusitype.name": decorationBusitype.items.name.val(),
            "decorationBusitype.outside": decorationBusitype.items.outside.val()
        };

        if (!decorationBusitype.editFlg) {
            url = api.data.updateDecorationBusitype;
            options["decorationBusitype.dbid"] = decorationBusitype.dbid;
        }

        com.post(url, options, function() {

            com.showAlert(com.info, "操作成功");
            seacher.doSearch();
        });
        decorationBusitype.modals.DecorationBusitypeModal.modal("hide")
    }

});
