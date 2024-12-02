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

    var displayFunc = (function() {

        var renderList = function(tableId, listData) {

            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (listData && listData.length) {
                $.each(listData, function(i, v) {

                    var $liLine = creatLine(v);

                    $liLine.appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function(v) {

            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.feedback.orderId));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var propertyArr = [["装修单号:", v.feedback.orderId, "grey"], ["处理人:", v.handler.userName, "grey"], ["状态:", v.feedback.status = "2" ? "处理" : v.feedback.status = "3" ? "完成" : v.feedback.status = "1" ? "接收" : "初始", "grey"], ["处理时间:", v.operateTime, "grey"], ["备注:", v.comment, "grey"]];

            $.each(propertyArr, function(index, value) {

                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2] ? value[2] : "").appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $divBtnWrap.appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            return $liLine;
        };

        return {
            init: function(tableId, listData) {

                com.focusPage('#' + tableId).html(null);
                renderList(tableId, listData);
            },
            drawLine: function(v) {

                return creatLine(v);
            }
        };
    })();

    var searcher = new Searcher();

    searcher.init([], "condListas", api.customer.queryFeedbackRecord, function(data) {

        displayFunc.init('resultListas', data);
    }, "pagenationas", "vrecordPostData", {
        "feedbackRecord.feedback.fid": vrecord.vid
    }, true, "feedbackRecords", null);

    // 添加
    com.focusPage("#add").click(function() {

        vrecord.modals.vrecordModal.modal("show");
    });

    // 保存
    com.focusPage("#saveBtn").click(function() {

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
