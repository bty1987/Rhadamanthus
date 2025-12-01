$(function() {

    var noods = {
        nid: null,

        items: {
            name: com.focusPage("#name"),
            selling: com.focusPage("#selling"),
            balance: com.focusPage("#balance"),
            surplus: com.focusPage("#surplus"),
        },
        modals: {
            updateNoodsModal: com.focusPage("#updateNoodsModal"),
        },
        btns: {
            saveBtn: com.focusPage("#saveBtn"),
        },
    };

    var searcher = new Searcher();

    searcher.base("condList", "pagenation", "resultList", api.data.pageNoods);
    searcher.condition(["data-noods-name"]);
    searcher.history("noodsPostData");

    searcher.button([{
        id: "addNoods",
        name: "添加",
        clazz: "btn-yellow",
        icon: "icon-plus"
    }, {
        id: "exNoods",
        name: "导出",
        clazz: "btn-warning",
        icon: "icon-download-alt"
    }]);

    var linebtns = [{
        name: "编辑",
        clazz: "btn-yellow",
        handle: function(v) {

            noods.nid = v.nid;

            noods.items.name.val(v.name);
            noods.items.selling.val(v.selling);
            noods.items.balance.val(v.balance);
            noods.items.surplus.val(v.surplus);

            noods.modals.updateNoodsModal.modal("show");

            return false;
        }
    }, {
        name: "状态",
        type: "switch",
        clazz: "status-lbl",
        handle: function(v, check) {

            com.post(api.data.updateNoodsForStatus, {
                "noods.nid": v.nid,
                "noods.status": check ? 0 : 1
            });

            return false;
        },
        init: function(v) {

            return !v.status;
        }
    }, {
        name: "计算标识",
        type: "switch",
        clazz: "status-lbl",
        handle: function(v, check) {

            com.post(api.data.updateNoodsForCalc, {
                "noods.nid": v.nid,
                "noods.calc": check ? 0 : 1
            }, function(res) {

                searcher.doSearch();
            });

            return false;
        },
        init: function(v) {

            return !v.calc;
        }
    }];

    var noodsprops = [{
        field: "name",
        name: "名称",
        prop: "name",
        clazz: "grey"
    }, {
        field: "selling",
        name: "售价",
        prop: "selling",
        clazz: "grey"
    }, {
        field: "balance",
        name: "结算价",
        prop: "balance",
        clazz: "grey"
    }, {
        field: "surplus",
        name: "浮动量",
        prop: "surplus",
        clazz: "grey"
    }, {
        field: "calc",
        name: "计算标识",
        prop: "calc",
        clazz: "red",
        dataset: constant.data().noods.calc.keys
    }];

    searcher.line("name", noodsprops, linebtns).render();

    noods.btns.saveBtn.on("click", saveData);

    com.focusPage('#addNoods').on("click", function() {

        noods.nid = null;

        noods.modals.updateNoodsModal.modal("show");
    });

    noods.modals.updateNoodsModal.on("hide.bs.modal", function(e) {

        com.clearValidator();
        com.cleanItems(noods.items);
    });

    com.focusPage('#exNoods').on("click", function() {

        if (com.focusPage('span[name="totalRecords"]').text() == 0) {
            com.showAlert(com.warning, "请通过条件进行查询");
            return false;
        }

        if (com.focusPage('span[name="totalRecords"]').text() > 2000) {
            com.showAlert(com.warning, "查询结果大于阀值 , 不能完成导出动作");
            return false;
        }

        com.post(api.data.pageNoods, $.extend({}, params.noodsPostData, {
            "paging.noPage": 1
        }), function(res) {

            $.exceler({
                column: [['ID', 'nid'], ['名称', 'name']],
                list: res.paging.data,
            });
        });
    });

    function saveData() {

        if (com.validate('updateNoodsModal'))
            return false;

        var url = api.data.addNoods;

        var options = {
            "noods.name": noods.items.name.val(),
            "noods.selling": noods.items.selling.val(),
            "noods.balance": noods.items.balance.val(),
            "noods.surplus": noods.items.surplus.val(),
        };

        if (noods.nid != null) {
            url = api.data.updateNoods;
            options['noods.nid'] = noods.nid;
        }

        com.post(url, options, function(res) {

            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
        });

        noods.modals.updateNoodsModal.modal("hide");
    }

});