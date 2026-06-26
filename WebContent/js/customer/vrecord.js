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

    function buildVrecordLineprops() {

        return [{
            field: "creater.userName",
            name: "操作人",
            prop: "creater.userName",
            clazz: "grey"
        }, {
            field: "createTime",
            name: "创建时间",
            prop: "createTime",
            clazz: "grey"
        }];
    }

    var searcher = new Searcher();

    searcher.set("condListas", "pagenationas", "resultListas", api.customer.queryVrecordByVid, {
        "vrecord.vid": vrecord.vid
    }, [], "vrecordPostData", "vrecords", true, null);
    searcher.line("comment", buildVrecordLineprops(), {}).render();

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
