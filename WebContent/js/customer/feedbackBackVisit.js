jQuery(function($) {

    var backVisit = {

        modals: {
            customerContent: com.focusPage("#customerContent")
        },
        btns: {
            returnBtn: com.focusPage("#returnBtn"),
            saveItemBtn: com.focusPage("#saveItemBtn"),
        },
        items: {
            pleased: com.focusPage('#pleased', "#addFeedbackBackVisitModal"),
            praiser: com.focusPage("#praiser", "#addFeedbackBackVisitModal"),
            praiseTime: com.focusPage("#praiseTime", "#addFeedbackBackVisitModal"),
            complaint: com.focusPage("#complaint", "#addFeedbackBackVisitModal"),
            praise: com.focusPage("#praise", "#addFeedbackBackVisitModal"),
            openWords: com.focusPage("#openWords", "#addFeedbackBackVisitModal"),
            contactSoonFlag: com.focusPage("#contactSoonFlag", "#addFeedbackBackVisitModal"),
            refuseComment: com.focusPage("#refuseComment", "#addFeedbackBackVisitModal"),
            result: com.focusPage("#result", "#addFeedbackBackVisitModal"),
            praiseType: com.focusPage("#praiseType", "#addFeedbackBackVisitModal"),
            finishTime: com.focusPage("#finishTime", "#addFeedbackBackVisitModal"),
            workDays: com.focusPage("#workDays", "#addFeedbackBackVisitModal"),
            perforFlag: com.focusPage("#perforFlag", "#addFeedbackBackVisitModal"),
            resultFlag: com.focusPage("#resultFlag", "#addFeedbackBackVisitModal"),
            resultComment: com.focusPage("#resultComment", "#addFeedbackBackVisitModal"),
            contactFlag: com.focusPage("#contactFlag", "#addFeedbackBackVisitModal")
        },
        drawingModal: com.focusPage('#drawingModal').on("show.bs.modal", function(a) {

            com.clearValidator();
        }),
        decorationInfo: com.focusPage("#decorationInfo"),
        customerInfo: com.focusPage("#customerInfo"),

        vid: params.fid,
        fbid: null,
        resUrl: null,
        decorationStatus: {},// 订单状态
        typeness: {},// 订单类型
    };

    com.focusPage('#fl-statement').statement("反馈", "回访");
    com.focusPage('#fl-statement2').statement("回访", "添加");
    com.focusPage('#fl-statement3').statement("回访", "列表");
    com.focusPage('#fl-statement4').statement("反馈", "记录");

    backVisit.decorationStatus = constant.decoration().decoration.status.keys;
    backVisit.typeness = constant.decoration().decoration.typeness.keys;

    com.post(api.decoration.queryDecorationByOrderId, {
        "decorationOrderId": params.decoration.orderId
    }, function(res) {

        var decoration = res.decoration;

        customerItems(decoration);
    });

    function customerItems(decoration) {

        var $widget = $('<div></div>').addClass("").prependTo(backVisit.customerInfo);
        var $box = $('<div></div>').addClass("widget-box").appendTo($widget);
        var $header = $('<div></div>').addClass("widget-header header-color-green").appendTo($box);

        var name = $('<h4></h4>').attr('id', 'h4name_').text("客户").appendTo($header);
        var $body = $('<div></div>').addClass("widget-body").appendTo($box);
        var $main = $('<div></div>').addClass("widget-main").appendTo($body);
        var $info = $('<div></div>').css("padding", "5px").appendTo($main);

        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('姓名: ' + decoration.customer.name)).appendTo($info);
        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('电话: ' + decoration.customer.phone)).appendTo($info);
        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('地址: ' + (decoration.customer.address == "" ? "暂无" : decoration.customer.address))).appendTo($info);
        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('客户关系: ' + decoration.customer.relationshipType)).appendTo($info);
        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('身份证: ' + (decoration.customer.identity == "" || decoration.customer.identity == null ? "暂无" : decoration.customer.identity.replace(/(.{6}).*(.{4})/, '$1********$2')))).appendTo($info);

        var $widget2 = $('<div></div>').addClass("").prependTo(backVisit.decorationInfo);
        var $box2 = $('<div></div>').addClass("widget-box").appendTo($widget2);
        var $header2 = $('<div></div>').addClass("widget-header header-color-orange").appendTo($box2);

        var name2 = $('<h4></h4>').attr('id', 'h4name_').text("装修单").appendTo($header2);

        var $body2 = $('<div></div>').addClass("widget-body").appendTo($box2);
        var $main2 = $('<div></div>').addClass("widget-main").appendTo($body2);
        var $info2 = $('<div></div>').css("padding", "5px").appendTo($main2);

        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('装修单号: ' + decoration.orderId)).appendTo($info2);
        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('楼盘地址: ' + decoration.house.village.name + " " + decoration.house.houseNumber)).appendTo($info2);
        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('报价版本: ' + decoration.version.name)).appendTo($info2);
        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('设计师: ' + decoration.designer.currentName)).appendTo($info2);
        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('业务员: ' + decoration.salesman.currentName)).appendTo($info2);
        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('订单状态: ' + backVisit.decorationStatus[decoration.status])).appendTo($info2);
        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('订单类型: ' + backVisit.typeness[decoration.typeness])).appendTo($info2);
    }

    com.initTypeahead(backVisit.items.praiser, api.personel.queryUserByPinyin, "pinyinName", {
        "user.status": 0,
        "departmentType.name": ""
    }, "autoFillKeyValue", "key", "value");

    com.datetime(backVisit.items.praiseTime);
    com.datetime(backVisit.items.finishTime);

    backVisit.items.praiseType.bindData(constant.customer().feedbackBackVisit.praiseType.datas, "key", "value");

    var radio = [{
        "constant": constant.customer().feedbackBackVisit.pleased.datas,
        "items": backVisit.items.pleased,
        "name": "pleased"
    }, {
        "constant": constant.customer().feedbackBackVisit.openWords.datas,
        "items": backVisit.items.openWords,
        "name": "openWords"
    }, {
        "constant": constant.customer().feedbackBackVisit.contactSoonFlag.datas,
        "items": backVisit.items.contactSoonFlag,
        "name": "contactSoonFlag"
    }, {
        "constant": constant.customer().feedbackBackVisit.result.datas,
        "items": backVisit.items.result,
        "name": "result"
    }, {
        "constant": constant.customer().feedbackBackVisit.perforFlag.datas,
        "items": backVisit.items.perforFlag,
        "name": "perforFlag"
    }, {
        "constant": constant.customer().feedbackBackVisit.resultFlag.datas,
        "items": backVisit.items.resultFlag,
        "name": "resultFlag"
    }, {
        "constant": constant.customer().feedbackBackVisit.contactFlag.datas,
        "items": backVisit.items.contactFlag,
        "name": "contactFlag"
    }];

    $.each(radio, function(index, v) {

        $.each(v.constant, function(i, dv) {

            var label = $('<label style="margin-right: 10px;"></label>').appendTo(v.items);

            var input = $('<input type="radio" class="ace" name="' + v.name + '" value="' + dv.key + '"><span class="lbl blue">' + dv.value + '</span>');

            if (i == 0) {
                input.attr("checked", "checked");
            }

            input.appendTo(label);
        });
    });

    backVisit.btns.returnBtn.click(function() {

        com.switchPage(params.historyPage);
    });

    com.uploadify("#path", "图片", api.common.uploadOther, 'btn btn-success blue ', '*.jpg;*.jpeg;*.gif;*.png', {
        'uploadType': 0
    }, 1, function(data) {

        backVisit.resUrl = data.resUrl;
        com.focusPage("#path").val(data.resUrl);
        com.focusPage("#infoPicture").attr("href", com.showImg(com.focusPage("#showImg"), data.resUrl, 150, 150, ''));

        searcher.doSearch();
    });

    function managedrawing(v) {

        com.focusPage('#feedbackDrawing').html("");

        com.post(api.customer.queryFeedbackDrawingBySid, {
            "feedbackDrawing.sid": v.fbid,
            "feedbackDrawing.type": 3
        }, function(data) {

            var feedbackDrawings = data.feedbackDrawings;
            if (feedbackDrawings && feedbackDrawings.length) {
                $.each(feedbackDrawings, function(i, value) {

                    if (value.status == constant.sales().salesPicture.STATUS_YES_SHORT) {
                        appendGalleryElement("feedbackDrawing", value);
                    }

                });
                com.popup4photos(com.focusPage("#feedbackDrawing"));
            }
        }, null, false);

        backVisit.drawingModal.modal("show");
    }

    function appendGalleryElement(galleryId, value) {

        var gallery = com.focusPage("#" + galleryId);
        var imgLi = $("<li></li>").attr("id", "gallery_li" + value.fdid).addClass("text-center col-sm-4").css("border", "0px").css("border-color", "white").css("padding", "0px").css("height", "150px").css("width", "150px").appendTo(gallery);
        var img = $('<img/>');
        var $imgA = $('<a></a>').attr('data-rel', 'colorbox').addClass('cboxElement').attr('href', com.showImg(img, value.path, 200, 200, '200x200')).attr('target', '_blank').append(img).appendTo(imgLi);
        var imgA = $("<a></a>").addClass('cboxElement').attr("target", "_blank").css("height", "150px").append(img).appendTo(imgLi);
        com.showImg(img, value.path, 150, 150, null, 0);
        var toolsDiv = $("<div></div>").addClass("tools tools-bottom").appendTo(imgLi);
        var toolsA = $("<a></a>").attr("href", "#").on("click", function() {

            com.post(api.customer.deleteFeedbackDrawing, {
                "feedbackDrawing.fdid": value.fdid
            }, function(res) {

                com.focusPage("#gallery_li" + value.fdid).remove();
            });
        }).appendTo(toolsDiv);
        $("<i></i>").addClass("icon-remove red").appendTo(toolsA);

    }

    function uploadDrawing(v) {

        com.uploadify("#feedbackDrawingUpload", "上传图片", api.common.uploadOther, 'btn btn-success blue ', '*.jpg;*.jpeg;*.gif;*.png', {
            'uploadType': 0
        }, 1, function(data) {

            var options1 = {};
            options1["feedbackDrawing.fid"] = backVisit.vid
            options1["feedbackDrawing.sid"] = backVisit.fbid
            options1["feedbackDrawing.path"] = data.resUrl
            options1["feedbackDrawing.type"] = 3;

            com.post(api.customer.addFeedbackDrawing, options1, function(res) {

                var feedbackDrawing = res.feedbackDrawing;
                backVisit.fdid = res.feedbackDrawing.fdid;

                appendGalleryElement("feedbackDrawing", feedbackDrawing);

                com.popup4photos("#feedbackDrawing");

            });

            searcher.doSearch();
        });
    }
    var searcher = new Searcher();

    // 获取页面控制参数(按公司差异化配置)
    var pageConfig = customerOriginPage.getConfig("feedbackBackVisit");

    // pageBtn 配置为空时, 所有按钮按原逻辑显示; 否则需在 pageBtn 中存在
    function btnVisible(key) {

        return pageConfig.pageBtn.length == 0 || pageConfig.pageBtn.contains(key);
    }

    var linebtns = [{
        name: "图片",
        handle: function(v) {

            backVisit.fbid = v.fbid;
            managedrawing(v);
            uploadDrawing(v);
            return false;
        },
        show: function() { return btnVisible("drawing"); }
    }];

    searcher.set("condListas", "pagenationFeedbackBackVisit", "resultListas", pageConfig.apiPage || api.customer.queryFeedbackBackVisit, {
        "feedbackBackVisit.fid": params.fid
    }, null, null, "feedbackBackVisits", true);

    var propertyMap = {
        "fid": {
            fieId: "fid",
            name: "反馈ID",
            prop: "fid",
            clazz: "red"
        },
        "pleased": {
            fieId: "pleased",
            name: "维修满意度",
            prop: "pleased",
            clazz: "red",
            dataset: constant.customer().feedbackBackVisit.pleased.keys
        },
        "result": {
            fieId: "result",
            name: "维修结果",
            prop: "result",
            clazz: "red",
            dataset: constant.customer().feedbackBackVisit.result.keys
        },
        "praiser": {
            fieId: "praiser.userName",
            name: "受表扬工人",
            prop: "praiser.userName",
            clazz: "grey"
        },
        "praiseType": {
            fieId: "praiseType",
            name: "表扬形式",
            prop: "praiseType",
            clazz: "red",
            dataset: constant.customer().feedbackBackVisit.praiseType.keys
        },
        "praiseTime": {
            fieId: "praiseTime",
            name: "表扬日期",
            prop: "praiseTime",
            clazz: "green"
        },
        "finishTime": {
            fieId: "finishTime",
            name: "整体完工日期",
            prop: "finishTime",
            clazz: "green"
        },
        "workDays": {
            fieId: "workDays",
            name: "维修周期",
            prop: "workDays",
            clazz: "blue"
        },
        "complaint": {
            fieId: "complaint",
            name: "回访内容",
            prop: "complaint",
            clazz: "grey"
        },
        "praise": {
            fieId: "praise",
            name: "表扬内容",
            prop: "praise",
            clazz: "grey"
        },
        "openWords": {
            fieId: "openWords",
            name: "开头语",
            prop: "openWords",
            clazz: "red",
            dataset: constant.customer().feedbackBackVisit.openWords.keys
        },
        "contactSoonFlag": {
            fieId: "contactSoonFlag",
            name: "24h内有无人员联系您",
            prop: "contactSoonFlag",
            clazz: "red",
            dataset: constant.customer().feedbackBackVisit.contactSoonFlag.keys
        },
        "refuseComment": {
            fieId: "refuseComment",
            name: "拒绝评价原因",
            prop: "refuseComment",
            clazz: "grey"
        },
        "perforFlag": {
            fieId: "perforFlag",
            name: "师傅是否按时上的门",
            prop: "perforFlag",
            clazz: "red",
            dataset: constant.customer().feedbackBackVisit.perforFlag.keys
        },
        "resultFlag": {
            fieId: "resultFlag",
            name: "报修是否解决",
            prop: "resultFlag",
            clazz: "red",
            dataset: constant.customer().feedbackBackVisit.resultFlag.keys
        },
        "resultComment": {
            fieId: "resultComment",
            name: "未解决问题的记录",
            prop: "resultComment",
            clazz: "grey"
        },
        "contactFlag": {
            fieId: "contactFlag",
            name: "事后有无人员联系您",
            prop: "contactFlag",
            clazz: "red",
            dataset: constant.customer().feedbackBackVisit.contactFlag.keys
        }
    };

    var lineprops = (function () {

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

    searcher.line("", lineprops, linebtns).render();

    // 记录列表

    var recordSearcher = new Searcher();

    recordSearcher.base("recordCondList", "recordResultList", "recordPagenation", api.customer.queryFeedbackRecord);
    recordSearcher.param({
        "feedbackRecord.feedback.fid": backVisit.vid
    });
    recordSearcher.result("feedbackRecords").isPage(true);

    var recordLineprops = [{
        fieId: "feedback.orderId",
        name: "装修单号",
        prop: "feedback.orderId",
        clazz: "blue"
    }, {
        fieId: "handler.userName",
        name: "处理人",
        prop: "handler.userName",
        clazz: "grey"
    }, {
        fieId: "feedback.status",
        name: "状态",
        prop: "feedback.status",
        clazz: "blue",
        dataset: constant.customer().feedback.feedbackStatus.keys
    }, {
        fieId: "operateTime",
        name: "处理时间",
        prop: "operateTime",
        clazz: "blue"
    }, {
        fieId: "comment",
        name: "备注",
        prop: "comment",
        clazz: "red"
    }];

    var linebtns = [{

    }];

    recordSearcher.line("", recordLineprops, "").render();

    backVisit.btns.saveItemBtn.click(function() {

        if (com.validate('addFeedbackBackVisitModal')) {
            return false;
        }

        var option = {
            "feedbackBackVisit.fid": params.fid,
            "feedbackBackVisit.praiser.userId": com.typeahead(backVisit.items.praiser),
            "feedbackBackVisit.result": backVisit.items.result.find('input[name="result"]:checked').val(),
            "feedbackBackVisit.pleased": backVisit.items.pleased.find('input[name="pleased"]:checked').val(),
            "feedbackBackVisit.praiseType": backVisit.items.praiseType.val(),
            "feedbackBackVisit.openWords": backVisit.items.openWords.find('input[name="openWords"]:checked').val(),
            "feedbackBackVisit.contactSoonFlag": backVisit.items.contactSoonFlag.find('input[name="contactSoonFlag"]:checked').val(),
            "feedbackBackVisit.perforFlag": backVisit.items.perforFlag.find('input[name="perforFlag"]:checked').val(),
            "feedbackBackVisit.resultFlag": backVisit.items.resultFlag.find('input[name="resultFlag"]:checked').val(),
            "feedbackBackVisit.contactFlag": backVisit.items.contactFlag.find('input[name="contactFlag"]:checked').val(),
            "feedbackBackVisit.workDays": backVisit.items.workDays.val(),
            "feedbackBackVisit.praiseTime": backVisit.items.praiseTime.val(),
            "feedbackBackVisit.finishTime": backVisit.items.finishTime.val(),
            "feedbackBackVisit.complaint": backVisit.items.complaint.val(),
            "feedbackBackVisit.praise": backVisit.items.praise.val(),
            "feedbackBackVisit.refuseComment": backVisit.items.refuseComment.val(),
            "feedbackBackVisit.resultComment": backVisit.items.resultComment.val()
        };

        com.post(api.customer.addFeedbackBackVisit, option, function(res) {

            backVisit.fbid = res.feedbackBackVisit.fbid
            
            var options1 = {};
            
            options1["feedbackDrawing.fid"] = backVisit.vid
            options1["feedbackDrawing.sid"] = backVisit.fbid
            options1["feedbackDrawing.path"] = backVisit.resUrl
            options1["feedbackDrawing.type"] = 3;

            if (backVisit.fbid != null) {
                com.post(api.customer.addFeedbackDrawing, options1, function(res) {

                    var feedbackDrawing = res.feedbackDrawing;
                    backVisit.fdid = res.feedbackDrawing.fdid;

                    appendGalleryElement("feedbackDrawing", feedbackDrawing);

                    com.popup4photos("#feedbackDrawing");

                });
            }
            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
        });
    });
});
