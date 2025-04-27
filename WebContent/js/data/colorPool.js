jQuery(function($) {

    var colorPool = {

        gpid: params.data.goodsPool.gpid,

        btns: {
            saveColorPool: com.focusPage("#saveColorPool", "#colorPool").on("click", saveData)
        },
        modals: {
            colorPoolModal: com.focusPage("#colorPoolModal", "#colorPool")
        },
        items: {
            name: com.focusPage("#name", "#colorPoolModal")
        }
    };

    colorPool.modals.colorPoolModal.on('hide.bs.modal', function(e) {

        com.cleanItems(colorPool.items);
        com.closeTip();
    });

    var searcher = new Searcher();

    searcher.base("colorPoolCondList", "colorPoolPagenation", "colorPoolResultlist", api.communion.queryColorPoolByGpid);
    searcher.result("colorPools").isPage(true);
    searcher.param({
        "colorPool.goodsPool.gpid": colorPool.gpid
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
        dataset: constant.data().color.status.keys
    }];

    var linebtns = [{
        name: "状态",
        type: "switch",
        clazz: "status-lbl",
        handle: function(v, check) {

            com.post(api.communion.updateColorPoolForStatus, {
                "colorPool.cpid": v.cpid,
                "colorPool.status": v.status == 0 ? 1 : 0
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

    com.focusPage("#addColorPoolBtn").click(function() {

        colorPool.modals.colorPoolModal.modal("show");
    });

    function saveData() {

        if (com.validate('colorPoolModal'))
            return false;

        var url = api.communion.addColorPool;

        var options = {
            "colorPool.goodsPool.gpid": colorPool.gpid,
            "colorPool.name": colorPool.items.name.val()
        };

        com.post(url, options, function(res) {

            com.showAlert(com.info, "操作成功");

            searcher.doSearch();

            colorPool.modals.colorPoolModal.modal("hide");
        });
    }

});
