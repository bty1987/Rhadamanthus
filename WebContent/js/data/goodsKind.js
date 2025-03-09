jQuery(function($) {

    var goodsKind = {
        btns: {
            saveBtn: com.focusPage("#saveBtn", "#goodsKindModal").on("click", saveData)
        },

        items: {
            no: com.focusPage("#no", "#goodsKindModal"),
            name: com.focusPage("#name", "#goodsKindModal"),
            level: com.focusPage("#level", "#goodsKindModal")
        },

        modals: {
            goodsKindModal: com.focusPage("#goodsKindModal")
        },
        editFlag: false,
        currentGkid: null
    };

    goodsKind.items.level.bindData(constant.data().goodsKind.level.datas, 'key', 'value');

    goodsKind.modals.goodsKindModal.on('hide.bs.modal', function(e) {
        com.clearValidator();
        com.cleanItems(goodsKind.items);
        goodsKind.currentGkid = null;
    });

    var searcher = new Searcher();

    searcher.base("condList", "pagenation", "resultList", api.data.pageGoodsKind);
    searcher.condition(["data-goodsKind-no", "data-goodsKind-name", "data-goodsKind-status"]);
    searcher.history("goodsKindPostData");

    searcher.button([{
        id: "addGoodsKind",
        name: "添加",
        clazz: "btn-yellow",
        icon: "icon-plus"
    }]);

    var lineprops = [{
        fieId: "no",
        name: "编号",
        prop: "no",
        clazz: "blue"
    }, {
        fieId: "level",
        name: "等级",
        prop: "level",
        clazz: "red",
        dataset: constant.data().goodsKind.level.keys
    }, {
        fieId: "status",
        name: "状态",
        prop: "status",
        clazz: "red",
        dataset: constant.data().goodsKind.status.keys
    }];

    var linebtns = [{
        name: "编辑",
        clazz: "btn-yellow",
        handle: function(v) {
            goodsKind.editFlag = true;

            goodsKind.currentGkid = v.gkid;

            goodsKind.items.no.val(v.no);
            goodsKind.items.name.val(v.name);
            goodsKind.items.level.val(v.level);

            goodsKind.modals.goodsKindModal.modal("show");
            return false;
        }
    }, {
        name: "状态",
        type: "switch",
        clazz: "status-lbl",
        handle: function(v, check) {

            com.post(api.data.updateGoodsKindForStatus, {
                "goodsKind.gkid": v.gkid,
                "goodsKind.status": check ? 0 : 1
            });
            return false;
        },
        init: function(v) {

            return !v.status;
        }
    }];

    searcher.line(function(v) {return v.name;}, lineprops, linebtns).render();

    com.focusPage('#addGoodsKind', '#pagenation').on("click", function() {

        goodsKind.editFlag = false;

        goodsKind.modals.goodsKindModal.modal("show");

    });

    function saveData() {

        if (com.validate('goodsKindModal')) return false;

        var url = api.data.addGoodsKind;

        var options = {
            'goodsKind.no': goodsKind.items.no.val(),
            'goodsKind.name': goodsKind.items.name.val(),
            'goodsKind.level': goodsKind.items.level.val()
        };

        if (goodsKind.editFlag) {
            options["goodsKind.gkid"] = goodsKind.currentGkid;
            url = api.data.updateGoodsKind;
        }

        com.post(url, options, function(res) {
            searcher.doSearch();
            goodsKind.modals.goodsKindModal.modal("hide");
        });
    }
});
