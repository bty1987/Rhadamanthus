jQuery(function($) {

    var complaint = {

        modals: {
            addFeedbackComplaintModal: com.focusPage("#addFeedbackComplaint"),
            updateFeedbackComplaintModal: com.focusPage("#updateFeedbackComplaintModal")
        },
        btns: {
            returnBtn: com.focusPage("#returnBtn"),
            saveItemBtn: com.focusPage("#saveItemBtn"),
            saveItemBtn1: com.focusPage("#saveItemBtn1"),
        },
        items: {
            orderId: com.focusPage('#orderId'),
            source: com.focusPage("#source"),
            upgradeSource: com.focusPage("#upgradeSource"),
            phone: com.focusPage("#phone"),
            upgrade: com.focusPage("#upgrade"),
            urgency: com.focusPage("#urgency"),
            deptType: com.focusPage("#deptType"),
            results: com.focusPage("#results"),
            content: com.focusPage("#content"),
            appeal: com.focusPage("#appeal"),

            orderId1: com.focusPage('#orderId1'),
            source1: com.focusPage("#source1"),
            upgradeSource1: com.focusPage("#upgradeSource1"),
            phone1: com.focusPage("#phone1"),
            upgrade1: com.focusPage("#upgrade1"),
            urgency1: com.focusPage("#urgency1"),
            deptType1: com.focusPage("#deptType1"),
            results1: com.focusPage("#results1"),
            content1: com.focusPage("#content1"),
            appeal1: com.focusPage("#appeal1")
        },
        drawingModal: com.focusPage('#drawingModal').on("show.bs.modal", function(a) {

            com.clearValidator();
        }),

        customerInfo: com.focusPage("#customerInfo"),
        decorationInfo: com.focusPage("#decorationInfo"),
        decorationInfo1: com.focusPage("#decorationInfo1"),
        decorationInfo2: com.focusPage("#decorationInfo2"),

        vid: params.customer.vid,
        fcid: null,
        fdid: null,
        resUrl: null,

    };

    com.focusPage('#fl-statement').statement("反馈", "投诉");
    com.focusPage('#fl-statement2').statement("投诉", "添加");
    com.focusPage('#fl-statement3').statement("投诉", "记录");
    com.focusPage('#fl-statement4').statement("投诉", "列表");

    complaint.items.source.bindData(constant.customer().feedbackComplaint.source.datas, "key", "value");
    complaint.items.upgradeSource.bindData(constant.customer().feedbackGuarantee.upgradeSource.datas, "key", "value");
    complaint.items.upgrade.bindData(constant.customer().feedbackComplaint.upgrade.datas, "key", "value");
    complaint.items.urgency.bindData(constant.customer().feedbackComplaint.urgency.datas, "key", "value");
    complaint.items.results.bindData(constant.customer().feedbackComplaint.results.datas, "key", "value");

    complaint.items.source1.bindData(constant.customer().feedbackComplaint.source.datas, "key", "value");
    complaint.items.upgradeSource1.bindData(constant.customer().feedbackGuarantee.upgradeSource.datas, "key", "value");
    complaint.items.upgrade1.bindData(constant.customer().feedbackComplaint.upgrade.datas, "key", "value");
    complaint.items.urgency1.bindData(constant.customer().feedbackComplaint.urgency.datas, "key", "value");
    complaint.items.results1.bindData(constant.customer().feedbackComplaint.results.datas, "key", "value");

    complaint.items.upgradeSource.val(0);

    $.each(constant.customer().feedbackComplaint.deptType.datas, function(i, v) {

        var label = $('<label style="margin-right: 10px;"></label>').appendTo(com.focusPage("#‌choiceDeptType"));
        var inputs = $('<input type="checkbox" class="ace" id="' + v.key + '"  name="complaintDeptType" value="' + v.value + '"><span class="lbl blue">' + v.value + '</span>').appendTo(label);

    });

    $.each(constant.customer().feedbackComplaint.deptType.datas, function(i, v) {

        var label = $('<label style="margin-right: 10px;"></label>').appendTo(com.focusPage("#‌choiceDeptType1"));
        var inputs = $('<input type="checkbox" class="ace" id="' + v.key + '"  name="complaintDeptType" value="' + v.value + '"><span class="lbl blue">' + v.value + '</span>').appendTo(label);

    });

    com.post(api.decoration.queryDecorationByOrderId, {
        "decorationOrderId": params.decoration.orderId
    }, function(res) {

        var decoration = res.decoration;
        customerItems(decoration);
    });

    // 信息来源
    com.focusPage('#source').change(function() {

        var selectedValue = $(this).val();

        if (selectedValue == 0 || selectedValue == 9) {
            com.focusPage('#upgradeSourceGroup').show("");
        } else {
            complaint.items.upgradeSource.val(0);
            com.focusPage('#upgradeSourceGroup').hide("");
        }
    });

    // 信息来源
    com.focusPage('#source1').change(function() {

        var selectedValue = $(this).val();

        if (selectedValue == 0 || selectedValue == 9) {
            com.focusPage('#upgradeSource1Group').show("");
        } else {
            com.focusPage('#upgradeSource1Group').hide("");
        }
    });

    function customerItems(decoration) {

        var $widget = $('<div></div>').addClass("").prependTo(complaint.customerInfo);
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

        var $widget2 = $('<div></div>').addClass("").prependTo(complaint.decorationInfo2);
        var $box2 = $('<div></div>').addClass("widget-box").appendTo($widget2);
        var $header2 = $('<div></div>').addClass("widget-header header-color-orange").appendTo($box2);

        var name2 = $('<h4></h4>').attr('id', 'h4name_').text("装修单").appendTo($header2);

        var $body2 = $('<div></div>').addClass("widget-body").appendTo($box2);
        var $main2 = $('<div></div>').addClass("widget-main").appendTo($body2);
        var $info2 = $('<div></div>').css("padding", "5px").appendTo($main2);

        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('预签时间: ' + decoration.precontractTime)).appendTo($info2);
        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('签单时间: ' + decoration.contractTime)).appendTo($info2);
        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('工程状态: ' + constant.decoration().decoration.projectStatus.keys[decoration.projectStatus])).appendTo($info2);
        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('保修状态: ' + constant.decoration().decoration.repairStatus.keys[decoration.repairStatus])).appendTo($info2);

        var $widget2 = $('<div></div>').addClass("").prependTo(complaint.decorationInfo1);
        var $box2 = $('<div></div>').addClass("widget-box").appendTo($widget2);
        var $header2 = $('<div></div>').addClass("widget-header header-color-orange").appendTo($box2);

        var name2 = $('<h4></h4>').attr('id', 'h4name_').text("装修单").appendTo($header2);

        var $body2 = $('<div></div>').addClass("widget-body").appendTo($box2);
        var $main2 = $('<div></div>').addClass("widget-main").appendTo($body2);
        var $info2 = $('<div></div>').css("padding", "5px").appendTo($main2);

        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('设计师: ' + decoration.designer.currentName)).appendTo($info2);
        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('业务员: ' + decoration.salesman.currentName)).appendTo($info2);
        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('设计部: ' + decoration.designer.dept.name)).appendTo($info2);
        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('设计分区: ' + decoration.designer.dept.fatherDept.name)).appendTo($info2);
        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('监理: ' + decoration.supervisor.currentName)).appendTo($info2);

        var $widget2 = $('<div></div>').addClass("").prependTo(complaint.decorationInfo);
        var $box2 = $('<div></div>').addClass("widget-box").appendTo($widget2);
        var $header2 = $('<div></div>').addClass("widget-header header-color-orange").appendTo($box2);

        var name2 = $('<h4></h4>').attr('id', 'h4name_').text("装修单").appendTo($header2);

        var $body2 = $('<div></div>').addClass("widget-body").appendTo($box2);
        var $main2 = $('<div></div>').addClass("widget-main").appendTo($body2);
        var $info2 = $('<div></div>').css("padding", "5px").appendTo($main2);

        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('装修单号: ' + decoration.orderId)).appendTo($info2);
        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('楼盘地址: ' + (decoration.house.village.cityProper.city.name == null ? " " : decoration.house.village.cityProper.city.name) + " " + (decoration.house.village.cityProper == null ? " " : decoration.house.village.cityProper.name) + " " + decoration.house.village.name + " " + decoration.house.houseNumber)).appendTo($info2);
        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('报价版本: ' + decoration.version.name)).appendTo($info2);
        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('订单类型: ' + constant.decoration().decoration.type.keys[decoration.type])).appendTo($info2);
        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('订单状态: ' + constant.decoration().decoration.status.keys[decoration.status])).appendTo($info2);

    }

    function managedrawing(v) {

        com.focusPage('#feedbackDrawing').html("");

        com.post(api.customer.queryFeedbackDrawingBySid, {
            "feedbackDrawing.sid": v.fcid,
            "feedbackDrawing.type": 2
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

        complaint.drawingModal.modal("show");
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

    function finishFeedback(fcid) {

        var options = {
            "feedbackComplaint.fcid": fcid
        };
        com.post(api.customer.finishFeedbackComplaint, options, function() {

            com.showAlert(com.info, "完成成功");
        });

    }

    complaint.btns.returnBtn.click(function() {

        com.switchPage(params.historyPage);
    });

    // 获取页面控制参数(按公司差异化配置)
    var pageConfig = customerPage.getConfig("feedbackComplaint");

    // pageBtn 配置为空时, 所有按钮按原逻辑显示; 否则需在 pageBtn 中存在
    function btnVisible(key) {

        return pageConfig.pageBtn.length == 0 || pageConfig.pageBtn.contains(key);
    }

    var recordPropertyMap = {
        "orderId": {
            fieId: "feedback.orderId",
            name: "装修单号",
            prop: "feedback.orderId",
            clazz: "grey"
        },
        "handler": {
            fieId: "handler.userName",
            name: "处理人",
            prop: "handler.userName",
            clazz: "grey"
        },
        "status": {
            fieId: "status",
            name: "状态",
            prop: function(v) {
                return v.feedback.status = "2" ? "处理" : v.feedback.status = "3" ? "完成" : v.feedback.status = "1" ? "接收" : "初始";
            },
            clazz: "grey"
        },
        "operateTime": {
            fieId: "operateTime",
            name: "处理时间",
            prop: "operateTime",
            clazz: "grey"
        },
        "comment": {
            fieId: "comment",
            name: "备注",
            prop: "comment",
            clazz: "grey"
        }
    };

    var lineprops = (function () {

        if (pageConfig.propertyArr.length == 0) {

            var all = [];
            $.each(recordPropertyMap, function (key, prop) { all.push(prop); });
            return all;
        }

        var props = [];
        $.each(pageConfig.propertyArr, function (i, key) {

            if (recordPropertyMap[key]) props.push(recordPropertyMap[key]);
        });
        return props;
    })();

    var searcher1 = new Searcher();

    searcher1.set("condListas1", "pagenationFeedbackComplaint1", "resultListas1", pageConfig.apiPage || api.customer.queryFeedbackRecord, {
        "feedbackRecord.feedback.fid": complaint.vid
    }, pageConfig.condArr, "vrecordPostData", "feedbackRecords", true, null);
    searcher1.line("feedback.orderId", lineprops, {}).render();

    var searcher = new Searcher();

    var linebtns = [{
        name: "编辑",
        clazz: "btn-yellow",
        handle: function(v) {

            var checkArray = v.deptType.split(",");

            $('#‌choiceDeptType1 input[type="checkbox"]').each(function() {

                var checkboxValue = $(this).val();

                if ($.inArray(checkboxValue, checkArray) !== -1) {
                    $(this).prop('checked', true);
                }
            });

            if (v.source == 0 || v.source == 9) {
                com.focusPage('#upgradeSource1Group').show("");
            }

            complaint.fcid = v.fcid;

            complaint.items.orderId1.val(v.orderId);
            complaint.items.source1.val(v.source);
            complaint.items.upgradeSource1.val(v.upgrade);
            complaint.items.phone1.val(v.phone);
            complaint.items.upgrade1.val(v.upgrade);
            complaint.items.urgency1.val(v.urgency);
            complaint.items.deptType1.val(v.deptType);
            complaint.items.content1.val(v.content);
            complaint.items.appeal1.val(v.appeal);
            complaint.items.results1.val(v.results);

            complaint.modals.updateFeedbackComplaintModal.modal("show");
            return false;
        },
        show: function() { return btnVisible("edit"); }
    }, {
        name: "投诉部门",
        clazz: "btn-danger",
        handle: function(v) {

            complaint.fcid = v.fcid;
            params.customer.fcid = v.fcid;
            params.customer.deptType = v.deptType;

            com.popup4page("#feedbackComplaintPopUp", "/views/customer/feedbackComplaintDept.html", "投诉部门");
        },
        show: function() { return btnVisible("complaintDept"); }
    }, {
        name: "完成",
        clazz: "btn-success",
        handle: function(v) {

            complaint.fcid = v.fcid;
            finishFeedback(v.fcid);
            return false;
        },
        show: function() { return btnVisible("finish"); }
    }, {
        name: "图片",
        clazz: "btn-warning",
        handle: function(v) {

            complaint.fcid = v.fcid;
            managedrawing(v);
            uploadDrawing(v);
            return false;
        },
        show: function() { return btnVisible("drawing"); }
    }];

    searcher.set("condListas", "pagenationFeedbackComplaint", "resultListas", pageConfig.apiPage || api.customer.queryFeedbackComplaint, {
        "feedbackComplaint.fid": complaint.vid
    }, null, null, "feedbackComplaints", true);

    var mainPropertyMap = {
        "orderId": {
            fieId: "orderId",
            name: "装修单号",
            prop: "orderId",
            clazz: "blue"
        },
        "source": {
            fieId: "source",
            name: "渠道",
            prop: "source",
            clazz: "grey",
            dataset: constant.customer().feedbackComplaint.source.keys
        },
        "upgradeSource": {
            fieId: "upgradeSource",
            name: "升级渠道",
            prop: "upgradeSource",
            clazz: "blue",
            dataset: constant.customer().feedbackGuarantee.upgradeSource.keys
        },
        "phone": {
            fieId: "phone",
            name: "电话",
            prop: "phone",
            clazz: "grey"
        },
        "upgrade": {
            fieId: "upgrade",
            name: "是否升级",
            prop: "upgrade",
            clazz: "red",
            dataset: constant.customer().feedbackComplaint.upgrade.keys
        },
        "urgency": {
            fieId: "urgency",
            name: "紧急程度",
            prop: "urgency",
            clazz: "green",
            dataset: constant.customer().feedbackComplaint.urgency.keys
        },
        "deptType": {
            fieId: "deptType",
            name: "部门类型",
            prop: "deptType",
            clazz: "red"
        },
        "content": {
            fieId: "content",
            name: "问题总述",
            prop: "content",
            clazz: "green",
        },
        "appeal": {
            fieId: "appeal",
            name: "客户诉求",
            prop: "appeal",
            clazz: "red",
        },
        "results": {
            fieId: "results",
            name: "处理结果",
            prop: "results",
            clazz: "red",
            dataset: constant.customer().feedbackComplaint.results.keys
        }
    };

    var lineprops = (function () {

        if (pageConfig.propertyArr.length == 0) {

            var all = [];
            $.each(mainPropertyMap, function (key, prop) { all.push(prop); });
            return all;
        }

        var props = [];
        $.each(pageConfig.propertyArr, function (i, key) {

            if (mainPropertyMap[key]) props.push(mainPropertyMap[key]);
        });
        return props;
    })();

    searcher.line("appeal", lineprops, linebtns).render();

    com.uploadify("#path", "图片", api.common.uploadOther, 'btn btn-success blue ', '*.jpg;*.jpeg;*.gif;*.png', {
        'uploadType': 0
    }, 1, function(data) {

        complaint.resUrl = data.resUrl;
        com.focusPage("#path").val(data.resUrl);
        com.focusPage("#infoPicture").attr("href", com.showImg(com.focusPage("#showImg"), data.resUrl, 150, 150, ''));

        searcher.doSearch();
    });

    function uploadDrawing(v) {

        com.uploadify("#feedbackDrawingUpload", "上传图片", api.common.uploadOther, 'btn btn-success blue ', '*.jpg;*.jpeg;*.gif;*.png', {
            'uploadType': 0
        }, 1, function(data) {

            var options1 = {};
            options1["feedbackDrawing.fid"] = complaint.vid
            options1["feedbackDrawing.sid"] = complaint.fcid
            options1["feedbackDrawing.path"] = data.resUrl
            options1["feedbackDrawing.type"] = 2;

            com.post(api.customer.addFeedbackDrawing, options1, function(res) {

                var feedbackDrawing = res.feedbackDrawing;
                complaint.fdid = res.feedbackDrawing.fdid;

                appendGalleryElement("feedbackDrawing", feedbackDrawing);

                com.popup4photos("#feedbackDrawing");

            });

            searcher.doSearch();
        });
    }

    complaint.btns.saveItemBtn.click(function() {

        if (com.validate('addFeedbackComplaintModal')) {
            return false;
        }

        var selectedValues = $('input[name="complaintDeptType"]:checked').map(function() {

            return $(this).val();
        }).get();

        var url = api.customer.addFeedbackComplaint;

        var option = {
            "feedbackComplaint.fid": complaint.vid,
            "feedbackComplaint.orderId": complaint.items.orderId.val(),
            "feedbackComplaint.source": complaint.items.source.val(),
            "feedbackComplaint.upgradeSource": complaint.items.upgradeSource.val(),
            "feedbackComplaint.phone": complaint.items.phone.val(),
            "feedbackComplaint.upgrade": complaint.items.upgrade.val(),
            "feedbackComplaint.urgency": complaint.items.urgency.val(),
            "feedbackComplaint.deptType": selectedValues.join(','),
            "feedbackComplaint.content": complaint.items.content.val(),
            "feedbackComplaint.appeal": complaint.items.appeal.val(),
            "feedbackComplaint.results": complaint.items.results.val()
        };

        com.post(url, option, function(res) {

            complaint.fcid = res.feedbackComplaint.fcid

            var options1 = {};
            options1["feedbackDrawing.fid"] = complaint.vid
            options1["feedbackDrawing.sid"] = complaint.fcid
            options1["feedbackDrawing.path"] = complaint.resUrl
            options1["feedbackDrawing.type"] = 2;

            if (complaint.fcid != null) {
                com.post(api.customer.addFeedbackDrawing, options1, function(res) {

                    var feedbackDrawing = res.feedbackDrawing;
                    complaint.fdid = res.feedbackDrawing.fdid;

                    appendGalleryElement("feedbackDrawing", feedbackDrawing);

                    com.popup4photos("#feedbackDrawing");

                });
            }
            com.showAlert(com.info, "操作成功");
            searcher.doSearch();

            complaint.modals.addFeedbackComplaintModal.modal("hide");
        });
    });

    complaint.btns.saveItemBtn1.click(function() {

        if (com.validate('updateFeedbackComplaintModal')) {
            return false;
        }

        var url = api.customer.updateFeedbackComplaint;

        var selectedValues1 = $('input[name="complaintDeptType"]:checked').map(function() {

            return $(this).val();
        }).get();

        var option = {
            "feedbackComplaint.fcid": complaint.fcid,
            "feedbackComplaint.orderId": complaint.items.orderId1.val(),
            "feedbackComplaint.source": complaint.items.source1.val(),
            "feedbackComplaint.upgradeSource": complaint.items.upgradeSource1.val(),
            "feedbackComplaint.phone": complaint.items.phone1.val(),
            "feedbackComplaint.upgrade": complaint.items.upgrade1.val(),
            "feedbackComplaint.urgency": complaint.items.urgency1.val(),
            "feedbackComplaint.deptType": selectedValues1.join(','),
            "feedbackComplaint.content": complaint.items.content1.val(),
            "feedbackComplaint.appeal": complaint.items.appeal1.val(),
            "feedbackComplaint.results": complaint.items.results1.val()
        };

        com.post(url, option, function(e) {

            com.showAlert(com.info, "操作成功");
            searcher.doSearch();

            complaint.modals.updateFeedbackComplaintModal.modal("hide");
        });
    });
});
