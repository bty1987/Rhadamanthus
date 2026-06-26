$(function() {

    var feedback = {

        saveBtn: com.focusPage("#saveBtn"),

        modals: {
            feedbackDrawingModal: com.focusPage("#feedbackDrawingModal"),
            creatFeedbackModal: com.focusPage("#creatFeedback")
        },
        items: {
            orderId: com.focusPage("#orderId"),
            phone: com.focusPage("#phone"),
            feedbackType: com.focusPage("#feedbackType"),
            content: com.focusPage("#content"),
        },

    };

    feedback.items.feedbackType.bindData(constant.customer().feedback.status.datas, "key", "value");

    com.popup4photos("#resultList");

    feedback.saveBtn.bindClick(saveData);

    feedback.modals.creatFeedbackModal.on("hide.bs.modal", function() {

        com.clearValidator();
        com.cleanTypeahead('orderId');
        com.cleanItems(feedback.items);

    });

    function buildFeedbackLineprops() {

        return [{
            type: "img",
            prop: "picture"
        }, {
            field: "orderId",
            name: "装修单号",
            prop: "orderId",
            clazz: "blue",
            click: function(v, $b) {

                tools.decoration.info($b, v.orderId);
            }
        }, {
            field: "createTime",
            name: "创建时间",
            prop: "createTime",
            clazz: "green"
        }, {
            field: "phone",
            name: "电话",
            prop: "phone",
            clazz: "grey"
        }, {
            field: "type",
            name: "类型",
            prop: function(v) { return constant.customer().feedback.status.keys[v.type]; },
            clazz: "red"
        }, {
            field: "company",
            name: "公司",
            prop: "company",
            clazz: "grey"
        }, {
            field: "content",
            name: "说明",
            prop: "content",
            clazz: "grey"
        }, {
            field: "receiver.userName",
            name: "接收人",
            prop: "receiver.userName",
            clazz: "grey"
        }, {
            field: "receiveTime",
            name: "接收时间",
            prop: "receiveTime",
            clazz: "grey"
        }, {
            field: "handler.userName",
            name: "处理人",
            prop: "handler.userName",
            clazz: "grey"
        }, {
            field: "handleTime",
            name: "处理时间",
            prop: "handleTime",
            clazz: "grey"
        }, {
            field: "finisher.userName",
            name: "完成人",
            prop: "finisher.userName",
            clazz: "grey"
        }, {
            field: "finishTime",
            name: "完成时间",
            prop: "finishTime",
            clazz: "grey"
        }, {
            field: "status",
            name: "状态",
            prop: function(v) { return constant.customer().feedback.feedbackStatus.keys[v.status]; },
            clazz: "grey"
        }];
    }

    function buildFeedbackLinebtns() {

        return {
            drawing: {
                name: "图片",
                clazz: "btn-warning",
                handle: function(v) {

                    manageDrawing(v.fid);
                }
            },
            record: {
                name: "记录",
                clazz: "btn-yellow",
                handle: function(v) {

                    params.customer.vid = v.fid;

                    com.popup4page("#feedBackRecordPopUp", api.index.feedRecord.url, "记录");
                }
            },
            receive: {
                name: "接收",
                clazz: "btn-success",
                handle: function(v) {

                    balanceOrder(v.fid);
                }
            },
            done: {
                name: "完成",
                clazz: "btn-success",
                handle: function(v) {

                    finishFeedback(v.fid);
                }
            },
            complaint: {
                name: "投诉",
                clazz: "btn-danger",
                handle: function(v) {

                    params.customer.vid = v.fid;
                    params.decoration.orderId = v.orderId;
                    params.historyPage = "/views/customer/feedback.html";

                    com.switchPage(api.index.feedComplaint.url);
                }
            },
            guarantee: {
                name: "维修",
                clazz: "btn-danger",
                handle: function(v) {

                    params.fid = v.fid;
                    params.decoration.orderId = v.orderId;
                    params.customer.vid = v.fid;
                    params.historyPage = "/views/customer/feedback.html";

                    com.switchPage(api.index.feedbackGuarantee.url);
                }
            },
            backVisit: {
                name: "回访",
                clazz: "btn-danger",
                handle: function(v) {

                    params.fid = v.fid;
                    params.decoration.orderId = v.orderId;

                    params.historyPage = "/views/customer/feedback.html";

                    com.switchPage("/views/customer/feedbackBackVisit.html");
                }
            }
        };
    }

    function buildFeedbackButtons() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('id', 'addFeedback').css("margin", "0px 3px");
        $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    }

    var searcher = new Searcher();

    searcher.set("condList", "pagenation", "resultList", api.customer.pageFeedback, null, ['customer-feedback-orderId', 'customer-feedback-phone', 'customer-feedback-createTime', 'customer-feedback-type', 'customer-feedback-company', 'customer-feedback-status', 'customer-feedback-handler', 'customer-feedback-receiver', 'customer-feedback-handleTime', 'customer-feedback-receiveTime'], "groupUserPostData", null, false, buildFeedbackButtons);
    searcher.line(function(v) { return v.type == constant.customer.feedback.STATUS_FEEDBACK_INT ? "反馈" : v.type == constant.customer.feedback.STATUS_COMPLAINT_INT ? "投诉" : "维修"; }, buildFeedbackLineprops(), buildFeedbackLinebtns()).render();

    com.focusPage('#addFeedback', '#pagenation').click(function() {

        feedback.modals.creatFeedbackModal.modal("show");
    });

    function manageDrawing(fid) {

        feedback.modals.feedbackDrawingModal.modal("show");

        com.focusPage('#feedbackDrawing').html("");

        com.post(api.customer.queryFeedbackDrawing, {
            "feedback.fid": fid
        }, function(data) {

            var drawings = data.feedbackDrawings;

            for ( var i = 0; i < drawings.length; i++) {
                var drawing = drawings[i];
                addPicture(com.focusPage("#feedbackDrawing"), drawing);
            }

            com.popup4photos("#feedbackDrawing");
        }, null, false);
    }

    function balanceOrder(fid) {

        com.showConfirm("确认要接收吗?", function() {

            var options = {
                "feedback.fid": fid
            };
            com.post(api.customer.receiveFeedback, options, function() {

                com.showAlert(com.info, "接收成功");
            });
        });
    }

    function finishFeedback(fid) {

        com.showConfirm("确认要完成吗?", function() {

            var options = {
                "feedback.fid": fid
            };
            com.post(api.customer.finishFeedback, options, function() {

                com.showAlert(com.info, "完成成功");
            });
        });
    }

    function addPicture(i, v) {

        var $li = $('<li></li>').attr("id", "imgLi_" + v.ddid).appendTo(i);
        var $img = $('<img/>').attr('width', 200).attr('height', 200);
        var $imgA = $('<a></a>').addClass('cboxElement').attr('target', '_blank').append($img).appendTo($li);

        com.showImg($img, v.path, 200, 200, "", null);

        var $tags = $('<div></div>').addClass('tags').appendTo($li);
        var $nameHolder = $('<span></span>').addClass('label-holder').appendTo($tags);
        var $nameInfo = $('<span></span>').addClass('label label-info arrowed').text(v.name).appendTo($nameHolder);
        var $timeHolder = $('<span></span>').addClass('label-holder').appendTo($tags);
        var $timeInfo = $('<span></span>').addClass('label label-danger arrowed').text(v.createTime).appendTo($timeHolder);

    }

    function saveData() {

        if (com.validate('creatFeedback')) {
            return false;
        }

        var options = {
            "feedback.orderId": feedback.items.orderId.val(),
            "feedback.phone": feedback.items.phone.val(),
            "feedback.feedbackType": feedback.items.feedbackType.val(),
            "feedback.content": feedback.items.content.val()
        };

        com.post(api.customer.addFeedback, options, function(res) {

            searcher.doSearch();
            com.showAlert(com.info, "保存成功");

        }, null, false);

        feedback.modals.creatFeedbackModal.modal("hide");
    }
});