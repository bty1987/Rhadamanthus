jQuery(function($) {

    var formatPool = {

        gpid: params.data.goodsPool.gpid,

        btns: {
            saveFormatPool: com.focusPage("#saveFormatPool", "#formatPool").on("click", saveData)
        },
        modals: {
            formatPoolModal: com.focusPage("#formatPoolModal", "#formatPool")
        },
        items: {
            info: com.focusPage("#info", "#formatPoolModal")
        }
    };

    formatPool.modals.formatPoolModal.on('hide.bs.modal', function(e) {

        com.cleanItems(formatPool.items);
        com.closeTip();
    });

    var searcher = new Searcher();

    searcher.base("formatPoolCondList", "formatPoolPagenation", "formatPoolResultlist", api.communion.queryFormatPoolByGpid);
    searcher.result("formatPools").isPage(true);
    searcher.param({
        "formatPool.goodsPool.gpid": formatPool.gpid
    });

    var lineprops = [{
        fieId: "info",
        name: "规格信息",
        prop: "info",
        clazz: "grey"
    }, {
        fieId: "status",
        name: "状态",
        prop: "status",
        clazz: "red",
        dataset: constant.data().format.status.keys
    }];

    var linebtns = [{
        name: "状态",
        type: "switch",
        clazz: "status-lbl",
        handle: function(v, check) {

            com.post(api.communion.updateFormatPoolForStatus, {
                "formatPool.fpid": v.fpid,
                "formatPool.status": v.status == 0 ? 1 : 0
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

    searcher.line("info", lineprops, linebtns).render();

    com.focusPage("#addFormatPool").click(function() {

        formatPool.modals.formatPoolModal.modal("show");
    });

    function saveData() {

        if (com.validate('formatPoolModal'))
            return false;

        var url = api.communion.addFormatPool;

        var options = {
            "formatPool.goodsPool.gpid": formatPool.gpid,
            "formatPool.info": formatPool.items.info.val()
        };

        com.post(url, options, function(res) {

            com.showAlert(com.info, "操作成功");

            searcher.doSearch();

            formatPool.modals.formatPoolModal.modal("hide");
        });
    }

});
