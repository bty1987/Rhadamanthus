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

    function buildFeedbackRecordLineprops() {

        return [{
            field: "feedback.orderId",
            name: "装修单号",
            prop: "feedback.orderId",
            clazz: "grey"
        }, {
            field: "handler.userName",
            name: "处理人",
            prop: "handler.userName",
            clazz: "grey"
        }, {
            field: "status",
            name: "状态",
            prop: function(v) {
                return v.feedback.status = "2" ? "处理" : v.feedback.status = "3" ? "完成" : v.feedback.status = "1" ? "接收" : "初始";
            },
            clazz: "grey"
        }, {
            field: "operateTime",
            name: "处理时间",
            prop: "operateTime",
            clazz: "grey"
        }, {
            field: "comment",
            name: "备注",
            prop: "comment",
            clazz: "grey"
        }];
    }

    var searcher = new Searcher();

    searcher.set("condListas", "pagenationas", "resultListas", api.customer.queryFeedbackRecord, {
        "feedbackRecord.feedback.fid": vrecord.vid
    }, [], "vrecordPostData", "feedbackRecords", true, null);
    searcher.line("feedback.orderId", buildFeedbackRecordLineprops(), {}).render();

    // 添加
    com.focusPage("#add").click(function() {

        vrecord.modals.vrecordModal.modal("show");
    });

    // 保存
    com.focusPage("#saveBtn", "#vrecordModal").click(function() {

        if (com.validate("form")) {
            return false;
        }

        var options = {
            "feedbackRecord.feedback.fid": vrecord.vid,
            "feedbackRecord.comment": vrecord.items.comment.val()
        };

        com.post(api.customer.addFeedbackRecord, options, function(res) {

            searcher.doSearch();
            com.showAlert(com.info, "保存成功");
        });

        vrecord.modals.vrecordModal.modal("hide");
    });
});
