jQuery(function ($) {

    var goodsKind = {
        btns: {
            saveBtn: com.focusPage("#saveBtn", "#goodsKindModal").on("click", saveData)
        },

        items: {
            no: com.focusPage("#no", "#goodsKindModal"),
            name: com.focusPage("#name", "#goodsKindModal"),
            level: com.focusPage("#level", "#goodsKindModal"),
            fgkid: com.focusPage("#fgkid", "#goodsKindModal"),
            onekind: com.focusPage("#onekind", "#goodsKindModal"),
            twokind: com.focusPage("#twokind", "#goodsKindModal")
        },

        modals: {
            goodsKindModal: com.focusPage("#goodsKindModal")
        },
        editFlag: false,
        currentGkid: null
    };

    goodsKind.items.level.bindData(constant.data().goodsKind.level.datas, 'key', 'value');

    goodsKind.modals.goodsKindModal.on('hide.bs.modal', function (e) {
        com.clearValidator();
        com.cleanItems(goodsKind.items);
        goodsKind.currentGkid = null;
    });

    com.post(api.data.queryGoodsKind, {}, function (res) {

        var oneKinds = [];
        var twoKinds = [];


        $.each(res.goodsKinds, function (i, v) {

            if (v.status != 0)
                return true;

            switch (v.level) {
                case 1:
                    oneKinds.push({
                        "key": v.gkid,
                        "value": v.name
                    });
                    break;

            }
        });

        goodsKind.items.onekind.bindData(oneKinds, 'key', 'value', '无');
        goodsKind.items.twokind.bindData(twoKinds, 'key', 'value', '无');

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
    }, {
        fieId: "parent.name",
        name: "父类型",
        prop: "parent.name",
        clazz: "red"
    }];

    var linebtns = [{
        name: "编辑",
        clazz: "btn-yellow",
        handle: function (v) {

            com.cleanItems(goodsKind.items);

            goodsKind.editFlag = true;

            goodsKind.currentGkid = v.gkid;

            goodsKind.items.no.val(v.no);
            goodsKind.items.name.val(v.name);
            goodsKind.items.level.val(v.level);
            com.cleanTypeahead('twokind');

            if (v.level == 3) {
                var twoKinds = [];
                twoKinds.push({
                    "key": v.parent.gkid,
                    "value": v.parent.name
                });
                goodsKind.items.twokind.bindData(twoKinds, 'key', 'value', '');

                com.post(api.data.queryGoodsKindByGkid, { "goodsKind.gkid": v.parent.gkid }, function (res) {
                    goodsKind.items.onekind.val(res.goodsKind.parent.gkid);
                });

            }

            if (v.level == 2) {
                goodsKind.items.onekind.val(v.parent.gkid);
            }

            goodsKind.modals.goodsKindModal.modal("show");
            return false;
        }
    }, {
        name: "状态",
        type: "switch",
        clazz: "status-lbl",
        handle: function (v, check) {

            com.post(api.data.updateGoodsKindForStatus, {
                "goodsKind.gkid": v.gkid,
                "goodsKind.status": check ? 0 : 1
            });
            return false;
        },
        init: function (v) {

            return !v.status;
        }
    }];

    searcher.line(function (v) { return v.name; }, lineprops, linebtns).render();

    com.focusPage('#addGoodsKind', '#pagenation').on("click", function () {

        goodsKind.editFlag = false;

        goodsKind.modals.goodsKindModal.modal("show");

    });

    com.focusPage('#onekind').on("change", function () {

        com.post(api.data.queryGoodsKindByFgkid, { "goodsKind.parent.gkid": goodsKind.items.onekind.val() }, function (res) {

            var twoKinds = [];

            $.each(res.goodsKinds, function (i, v) {

                if (v.status != 0)
                    return true;

                twoKinds.push({
                    "key": v.gkid,
                    "value": v.name
                });
            });

            goodsKind.items.twokind.bindData(twoKinds, 'key', 'value', '无');

        });

    });

    function saveData() {

        if (com.validate('goodsKindModal')) return false;

        var url = api.data.addGoodsKind;

        var fgkid = null;

        if (goodsKind.items.onekind.val() != '') {
            fgkid = goodsKind.items.onekind.val();
        }

        if (goodsKind.items.twokind.val() != '') {
            fgkid = goodsKind.items.twokind.val();
        }

        if (fgkid == null && goodsKind.items.level.val() > 1) {
            com.showAlert(com.warning, "等级大于1的，请选择一级或二级类别");
            return false;
        }

        var options = {
            'goodsKind.no': goodsKind.items.no.val(),
            'goodsKind.name': goodsKind.items.name.val(),
            'goodsKind.level': goodsKind.items.level.val(),
            'goodsKind.parent.gkid': fgkid
        };

        if (goodsKind.editFlag) {
            options["goodsKind.gkid"] = goodsKind.currentGkid;
            url = api.data.updateGoodsKind;
        }

        com.post(url, options, function (res) {
            searcher.doSearch();
            goodsKind.modals.goodsKindModal.modal("hide");
        });
    }
});
