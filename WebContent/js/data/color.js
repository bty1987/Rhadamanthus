jQuery(function($) {

    var color = {

        gid: params.data.goods.gid,

        btns: {
            saveColor: com.focusPage("#saveColor").on("click", saveData),
            addColor: com.focusPage("#addColor").on("click", showAdd)
        },
        modals: {
            colorModal: com.focusPage("#colorModal")
        },
        items: {
            name: com.focusPage("#name", "#colorModal"),
        },
    };

    color.modals.colorModal.on('hide.bs.modal', function(e) {

        com.cleanItems(color.items);
        com.closeTip();
    });

    var searcher = new Searcher();

    searcher.base("ccondList", "cpagenation", "cresultlist", api.data.queryColorByGid);
    searcher.result("colors").isPage(true);
    searcher.param({
        "color.gid": color.gid
    });

    var lineprops = [{
        fieId: "name",
        name: "名称",
        prop: "name",
        clazz: "grey"
    }, {
        fieId: "status",
        name: "状态",
        prop: "status",
        clazz: "red",
        dataset: constant.data().color.status.keys,
    }];

    var linebtns = [{
        name: "状态",
        type: "switch",
        clazz: "status-lbl",
        handle: function(v, check) {

            com.post(api.data.updateColorForStatus, {
                "color.cid": v.cid,
                "color.status": v.status == 0 ? 1 : 0
            }, function(res) {

                com.showAlert(com.info, "操作成功");
                searcher.doSearch();
            });
            return false;
        },
        init: function(v) {

            return !v.status;
        }
    }];

    searcher.line("name", lineprops, linebtns).render();

    function showAdd() {

        color.modals.colorModal.modal("show");
    }

    function saveData() {

        if (com.validate('colorModal'))
            return false;

        var url = api.data.addColor;

        var options = {
            "color.gid": color.gid,
            "color.name": color.items.name.val()
        };

        com.post(url, options, function(res) {

            com.showAlert(com.info, "操作成功");

            searcher.doSearch();

            color.modals.colorModal.modal("hide");
        });
    }

});
