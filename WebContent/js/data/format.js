jQuery(function($) {

    var format = {

        gid: params.data.goods.gid,

        btns: {
            saveFormat: com.focusPage("#saveFormat").on("click", saveData),
            addFormat: com.focusPage("#addFormat").on("click", showAdd)
        },
        modals: {
            formatModal: com.focusPage("#formatModal")
        },
        items: {
            info: com.focusPage("#info", "#formatModal"),
        },
    };

    format.modals.formatModal.on('hide.bs.modal', function(e) {

        com.cleanItems(format.items);
        com.closeTip();
    });

    var searcher = new Searcher();

    searcher.base("fcondlist", "fpagenation", "fresultlist", api.data.queryFormatByGid);
    searcher.result("formats").isPage(true);
    searcher.param({
        "format.gid": format.gid
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
        dataset: constant.data().format.status.keys,
    }];

    var linebtns = [{
        name: "状态",
        type: "switch",
        clazz: "status-lbl",
        handle: function(v, check) {

            com.post(api.data.updateFormatForStatus, {
                "format.fid": v.fid,
                "format.status": v.status == constant.data().format.status.STATUS_ENABLE_INT ? constant.data().format.status.STATUS_DISABLE_INT : constant.data().format.status.STATUS_ENABLE_INT
            }, function(res) {

                com.showAlert(com.info, "操作成功");
                searcher.doSearch();
            });

            return false;
        },
        init: function(v) {

            return !v.status;
        }
    }]
    searcher.line("info", lineprops, linebtns).render();

    function showAdd() {

        format.modals.formatModal.modal("show");
    }

    function saveData() {

        if (com.validate('formatModal'))
            return false;

        var url = api.data.addFormat;

        var options = {
            "format.gid": format.gid,
            "format.info": format.items.info.val()
        };

        com.post(url, options, function(res) {

            com.showAlert(com.info, "操作成功");

            searcher.doSearch();

            format.modals.formatModal.modal("hide");
        });
    }

});
