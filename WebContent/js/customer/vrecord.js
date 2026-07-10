jQuery(function($) {

    var vrecord = {
        modals: {
            vrecordModal: com.focusPage("#vrecordModal")
        },
        items: {
            comment: com.focusPage("#comment")
        },
        vid: params.customer.vid
    };

    vrecord.modals.vrecordModal.on("hide.bs.modal", function() {

        com.cleanItems(vrecord.items);
        com.clearValidator();
    });

    // 获取页面控制参数(按公司差异化配置)
    var pageConfig = customerOriginPage.getConfig("vrecord");

    var lineprops = (function() {

        var propertyMap = {
            "creater": {
                field: "creater.userName",
                name: "操作人",
                prop: "creater.userName",
                clazz: "grey"
            },
            "createTime": {
                field: "createTime",
                name: "创建时间",
                prop: "createTime",
                clazz: "grey"
            }
        };

        if (pageConfig.propertyArr.length == 0) {

            var all = [];
            $.each(propertyMap, function (key, prop) { all.push(prop); });
            return all;
        }

        var props = [];
        $.each(pageConfig.propertyArr, function (i, key) {

            if (propertyMap[key]) props.push(propertyMap[key]);
        });
        return props;
    })();

    var searcher = new Searcher();

    searcher.set("condListas", "pagenationas", "resultListas", pageConfig.apiPage || api.customer.queryVrecordByVid, {
        "vrecord.vid": vrecord.vid
    }, pageConfig.condArr, "vrecordPostData", "vrecords", true, null);
    searcher.line("comment", lineprops, {}).render();

    //添加
    com.focusPage("#add").click(function() {

        vrecord.modals.vrecordModal.modal("show");
    });

    //保存
    com.focusPage("#saveBtn").click(function() {

        if (com.validate("form")) {
            return false;
        }

        var options = {
            "vrecord.vid": vrecord.vid,
            "vrecord.comment": vrecord.items.comment.val()
        };

        com.post(api.customer.addVrecord, options, function(res) {

            searcher.doSearch();
            com.showAlert(com.info, "保存成功");
        });

        vrecord.modals.vrecordModal.modal("hide");
    });
});
