$(function() {

    var feedbackGuarantee = {

        btns: {
            saveBtn: com.focusPage("#saveBtn"),
            backBtn: com.focusPage("#backBtn"), // 返回
        },
        modals: {
            creatFeedbackModal: com.focusPage("#creatFeedbackGuarantee"),
            editGuaranteeModal: com.focusPage("#editGuaranteeModal"),
        },
        items: {
            orderId: com.focusPage("#orderId"),
            phone: com.focusPage("#phone"),
            source: com.focusPage("#source"),
            content: com.focusPage("#content"),
            cutomerType: com.focusPage("#cutomerType"),
            // workType: com.focusPage("#workType"),
            brandName: com.focusPage("#brandName"),
            reportedDate: com.focusPage("#reportedDate"),
            renovationYear: com.focusPage("#renovationYear"),
            svuid: com.focusPage("#svuid"),
            svUserStatus: com.focusPage("#svUserStatus"),
            repairResult: com.focusPage("#repairResult"),
            plumber: com.focusPage("#plumber"),
            electrician: com.focusPage("#electrician"),
            tiler: com.focusPage("#tiler"),
            carpenter: com.focusPage("#carpenter"),
            painter: com.focusPage("#painter"),
            upgradeSource: com.focusPage("#upgradeSource"),

        },
        drawingModal: com.focusPage('#drawingModal').on("show.bs.modal", function(a) {

            com.clearValidator();
        }),

        customerInfo: com.focusPage("#customerInfo"),
        decorationInfo: com.focusPage("#decorationInfo"),
        decorationInfo1: com.focusPage("#decorationInfo1"),
        decorationInfo2: com.focusPage("#decorationInfo2"),

        cid: null,
        bid: null,
        sid: null,
        fgid: null,
        vid: params.customer.vid,
        resUrl: null,

    };

    com.focusPage('#fl-statement').statement("反馈", "维修");
    com.focusPage('#fl-statement2').statement("维修", "添加");
    com.focusPage('#fl-statement3').statement("维修", "列表");
    com.focusPage('#fl-statement4').statement("反馈", "记录");

    feedbackGuarantee.items.orderId.val(params.decoration.orderId);

    com.datetime(feedbackGuarantee.items.reportedDate);

    com.post(api.decoration.queryDecorationByOrderId, {
        "decorationOrderId": params.decoration.orderId
    }, function(res) {

        customerItems(res.decoration);
    }, null, false);

    feedbackGuarantee.items.source.bindData(constant.customer().feedbackGuarantee.source.datas, "key", "value");
    feedbackGuarantee.items.cutomerType.bindData(constant.customer().feedbackGuarantee.cutomerType.datas, "key", "value");
    feedbackGuarantee.items.svUserStatus.bindData(constant.customer().feedbackGuarantee.svUserStatus.datas, "key", "value");
    feedbackGuarantee.items.repairResult.bindData(constant.customer().feedbackGuarantee.repairResult.datas, "key", "value");
    feedbackGuarantee.items.upgradeSource.bindData(constant.customer().feedbackGuarantee.upgradeSource.datas, "key", "value");

    feedbackGuarantee.items.upgradeSource.val(0);
    feedbackGuarantee.items.repairResult.val(3);

    com.post(api.ds.customer, {}, function(res) {

        $.each(res.deptType, function(i, v) {

            var label = $('<label style="margin-right: 10px;"></label>').appendTo(com.focusPage("#‌choiceDeptType"));
            var inputs = $('<input type="checkbox" class="ace" id="' + v.key + '"  name="deptType" value="' + v.value + '"><span class="lbl blue">' + v.value + '</span>').appendTo(label);
        });

        $.each(res.plumberType, function(i, v) {

            var label = $('<label style="margin-right: 10px;"></label>').appendTo(com.focusPage("#plumber"));
            var inputs = $('<input type="checkbox" class="ace" id="' + v.key + '"  name="workType" value="' + v.value + '"><span class="lbl blue">' + v.value + '</span>').appendTo(label);
        });

        $.each(res.electricianType, function(i, v) {

            var label = $('<label style="margin-right: 10px;"></label>').appendTo(com.focusPage("#electrician"));
            var inputs = $('<input type="checkbox" class="ace" id="' + v.key + '"  name="workType" value="' + v.value + '"><span class="lbl blue">' + v.value + '</span>').appendTo(label);
        });

        $.each(res.tilerType, function(i, v) {

            var label = $('<label style="margin-right: 10px;"></label>').appendTo(com.focusPage("#tiler"));
            var inputs = $('<input type="checkbox" class="ace" id="' + v.key + '"  name="workType" value="' + v.value + '"><span class="lbl blue">' + v.value + '</span>').appendTo(label);
        });

        $.each(res.carpenterType, function(i, v) {

            var label = $('<label style="margin-right: 10px;"></label>').appendTo(com.focusPage("#carpenter"));
            var inputs = $('<input type="checkbox" class="ace" id="' + v.key + '"  name="workType" value="' + v.value + '"><span class="lbl blue">' + v.value + '</span>').appendTo(label);
        });

        $.each(res.painterType, function(i, v) {

            var label = $('<label style="margin-right: 10px;"></label>').appendTo(com.focusPage("#painter"));
            var inputs = $('<input type="checkbox" class="ace" id="' + v.key + '"  name="workType" value="' + v.value + '"><span class="lbl blue">' + v.value + '</span>').appendTo(label);
        });

    });

    feedbackGuarantee.btns.backBtn.on("click", function() {

        com.switchPage(params.historyPage);
    });

    com.initTypeahead('brandName', api.data.queryBrandByPinyin, "brand.pinyin", {
        "brand.atttype": 0
    }, 'brands', 'bid', 'name', function(list, k, v) {

        $.each(list, function(index, val) {

            if (val.bid == k) {
                feedbackGuarantee.bid = val.bid;
                feedbackGuarantee.items.brandName.val(val.name);
            }
        });

        return v
    });

    com.initTypeahead('svuid', api.personel.queryUserByPinyin, "pinyinName", {
        "user.status": 0,
        "departmentType.name": ""
    }, "autoFillKeyValue", "key", "value");

    com.focusPage('#source').change(function() {

        var selectedValue = $(this).val();

        if (selectedValue == 11 || selectedValue == 12) {
            com.focusPage('#upgradeSourceGroup').show("");
        } else {
            feedbackGuarantee.items.upgradeSource.val(0);
            com.focusPage('#upgradeSourceGroup').hide("");
        }
    });

    com.focusPage('#saveBtn').on("click", function() {

        com.post(api.customer.queryFeedbackGuarantee, {
            "feedbackGuarantee.fid": params.fid
        }, function(res) {

            var feedbackGuarantees = res.feedbackGuarantees;

            if (feedbackGuarantees.length > 0) {
                com.showAlert(com.error, "已存在维修记录不能再次添加");
                return false;
            }
        });

        if (com.validate('creatFeedbackGuarantee')) {
            return false;
        }

        var selectedDeptTypeValues = $('input[name="deptType"]:checked').map(function() {

            return $(this).val();
        }).get();

        var selectedWorkTypeValues = $('input[name="workType"]:checked').map(function() {

            return $(this).val();
        }).get();

        var options = {
            "feedbackGuarantee.fid": params.fid,
            "feedbackGuarantee.orderId": params.decoration.orderId,
            "feedbackGuarantee.source": feedbackGuarantee.items.source.val(),
            "feedbackGuarantee.phone": feedbackGuarantee.items.phone.val(),
            "feedbackGuarantee.cutomerType": feedbackGuarantee.items.cutomerType.val(),
            "feedbackGuarantee.deptType": selectedDeptTypeValues.join(','),
            "feedbackGuarantee.workType": selectedWorkTypeValues.join(','),
            "feedbackGuarantee.content": feedbackGuarantee.items.content.val(),
            "feedbackGuarantee.bids": feedbackGuarantee.bid,
            "feedbackGuarantee.brands": feedbackGuarantee.items.brandName.val(),
            "feedbackGuarantee.reportedDate": feedbackGuarantee.items.reportedDate.val(),
            "feedbackGuarantee.renovationYear": feedbackGuarantee.items.renovationYear.val(),
            "feedbackGuarantee.supervisor.userId": com.typeahead("svuid"),
            "feedbackGuarantee.svUserStatus": feedbackGuarantee.items.svUserStatus.val(),
            "feedbackGuarantee.repairResult": feedbackGuarantee.items.repairResult.val(),
            "feedbackGuarantee.upgradeSource": feedbackGuarantee.items.upgradeSource.val(),
        };

        var fgid = null;

        com.post(api.customer.addFeedbackGuarantee, options, function(res) {

            fgid = res.feedbackGuarantee.fgid;

            if (feedbackGuarantee.resUrl != null) {
                var options1 = {};
                options1["feedbackDrawing.fid"] = params.fid
                options1["feedbackDrawing.sid"] = fgid
                options1["feedbackDrawing.path"] = feedbackGuarantee.resUrl
                options1["feedbackDrawing.type"] = 1;

                com.post(api.customer.addFeedbackDrawing, options1, function(res) {

                    var feedbackDrawing = res.feedbackDrawing;

                });
            }

        });

        com.focusPage('#feedbackDrawing').html("");
        com.showAlert(com.info, "操作成功");
        searcher.doSearch();

    });
    // 多选设置
    com.focusPage('input[name="change_workType"]').click(function() {

        if ($(this).prop("checked")) {
            if (this.value == 1) {

                feedbackGuarantee.items.plumber.show("slow");
            }
            if (this.value == 2) {
                feedbackGuarantee.items.electrician.show("slow");
            }
            if (this.value == 3) {
                feedbackGuarantee.items.tiler.show("slow");
            }
            if (this.value == 4) {
                feedbackGuarantee.items.carpenter.show("slow");
            }
            if (this.value == 5) {
                feedbackGuarantee.items.painter.show("slow");
            }

        }
        if (!$(this).prop("checked")) {
            if (this.value == 1) {
                feedbackGuarantee.items.plumber.hide();
            }
            if (this.value == 2) {
                feedbackGuarantee.items.electrician.hide();
            }
            if (this.value == 3) {
                feedbackGuarantee.items.tiler.hide();
            }
            if (this.value == 4) {
                feedbackGuarantee.items.carpenter.hide();
            }
            if (this.value == 5) {
                feedbackGuarantee.items.painter.hide();
            }

        }
    });

    com.focusPage('input[name="workTypeRadio"]').change(function() {

        if ($(this).val() == 1) { // 工程

            com.focusPage('#brandGroup').hide("");
            feedbackGuarantee.items.brandName.val("");
            com.focusPage('#workTypeGroup').show("");
            com.focusPage('#renovationYearGroup').show("");
            com.focusPage('#repairResultGroup').show("");
            com.focusPage('#‌choiceDeptTypeGroup').show("");
            com.focusPage('#reportedDateGroup').show("");
        } else { // 主材

            com.focusPage('#brandGroup').show("");
            com.focusPage('#workTypeGroup').hide("");
            com.focusPage('#renovationYearGroup').hide("");
            feedbackGuarantee.items.renovationYear.val("");
            com.focusPage('#repairResultGroup').hide("");
            feedbackGuarantee.items.repairResult.val(3);
            com.focusPage('#‌choiceDeptTypeGroup').hide("");
            com.focusPage('#reportedDateGroup').hide("");
            feedbackGuarantee.items.reportedDate.val("");
        }

    });

    com.uploadify("#path", "图片", api.common.uploadOther, 'btn btn-success blue ', '*.jpg;*.jpeg;*.gif;*.png', {
        'uploadType': 0
    }, 1, function(data) {

        feedbackGuarantee.resUrl = data.resUrl;
        com.focusPage("#path").val(data.resUrl);
        com.focusPage("#infoPicture").attr("href", com.showImg(com.focusPage("#showImg"), data.resUrl, 150, 150, ''));

        searcher.doSearch();
    });
    // 维修列表
    var searcher = new Searcher();

    searcher.base("condList", "contracts", "pagenation", api.customer.queryFeedbackGuarantee);
    searcher.param({
        "feedbackGuarantee.fid": params.fid
    });
    searcher.result("feedbackGuarantees").isPage(true);
    searcher.history("addCustomerUserRuleItemPostData");

    var lineprops = [{
        fieId: "fid",
        name: "反馈ID",
        prop: "fid",
        clazz: "red"
    }, {
        fieId: "orderId",
        name: "装修单号",
        prop: "orderId",
        clazz: "grey"
    }, {
        fieId: "source",
        name: "渠道",
        prop: "source",
        clazz: "blue",
        dataset: constant.customer().feedbackGuarantee.source.keys
    }, {
        fieId: "upgradeSource",
        name: "升级渠道",
        prop: "upgradeSource",
        clazz: "blue",
        dataset: constant.customer().feedbackGuarantee.upgradeSource.keys
    }, {
        fieId: "phone",
        name: "电话",
        prop: "phone",
        clazz: "blue"
    }, {
        fieId: "cutomerType",
        name: "客户类型",
        prop: "cutomerType",
        clazz: "red",
        dataset: constant.customer().feedbackGuarantee.cutomerType.keys
    }, {
        fieId: "deptType",
        name: "部门类型",
        prop: "deptType",
        clazz: "red"
    }, {
        fieId: "workType",
        name: "工种",
        prop: "workType",
        clazz: "red"
    }, {
        fieId: "brands",
        name: "品牌",
        prop: "brands",
        clazz: "grey"
    }, {
        fieId: "reportedDate",
        name: "报修日期",
        prop: "reportedDate",
        clazz: "green"
    }, {
        fieId: "renovationYear",
        name: "装修年份",
        prop: "renovationYear",
        clazz: "grey"
    }, {
        fieId: "repairResult",
        name: "维修结果",
        prop: "repairResult",
        clazz: "grey",
        dataset: constant.customer().feedbackGuarantee.repairResult.keys
    }, {
        fieId: "content",
        name: "内容",
        prop: "content",
        clazz: "grey"
    }];

    var linebtns = [{
        name: "图片",
        clazz: "btn-yellow",

        handle: function(v) {

            managedrawing(v.fgid);
            initUploadBtn(v.fgid);
        },
    }, {
        name: "编辑",
        clazz: "btn-red",

        handle: function(v) {

            editGuarantee(v);
        },
    }];

    searcher.line("", lineprops, linebtns).render();

    com.focusPage('#addFeedbackGuarantee').on("click", function() {

        feedbackGuarantee.modals.creatFeedbackModal.modal("show");
    });

    var recordSearcher = new Searcher();

    recordSearcher.base("recordCondList", "recordResultList", "recordPagenation", api.customer.queryFeedbackRecord);
    recordSearcher.param({
        "feedbackRecord.feedback.fid": feedbackGuarantee.vid
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

    recordSearcher.line("", recordLineprops, "").render();

    function customerItems(decoration) {

        var $widget = $('<div></div>').addClass("").prependTo(feedbackGuarantee.customerInfo);
        var $box = $('<div></div>').addClass("widget-box").appendTo($widget);
        var $header = $('<div></div>').addClass("widget-header header-color-green").appendTo($box);

        var name = $('<h4></h4>').text("客户").appendTo($header);
        var $body = $('<div></div>').addClass("widget-body").appendTo($box);
        var $main = $('<div></div>').addClass("widget-main").appendTo($body);
        var $info = $('<div></div>').css("padding", "5px").appendTo($main);

        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('姓名: ' + decoration.customer.name)).appendTo($info);
        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('电话: ' + (decoration.customer.phone == "" || decoration.customer.phone == null ? "暂无" : [3, 6, 8].indexOf(decoration.status) == -1 ? decoration.customer.phone.replace(/^(\d{3})\d+(\d{4})$/, "$1****$2") : decoration.customer.phone))).appendTo($info);
        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('地址: ' + (decoration.customer.address == "" ? "暂无" : decoration.customer.address))).appendTo($info);
        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('客户关系: ' + decoration.customer.relationshipType)).appendTo($info);
        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('身份证: ' + (decoration.customer.identity == "" || decoration.customer.identity == null ? "暂无" : decoration.customer.identity.replace(/(.{6}).*(.{4})/, '$1********$2')))).appendTo($info);

        var $widget2 = $('<div></div>').addClass("").prependTo(feedbackGuarantee.decorationInfo2);
        var $box2 = $('<div></div>').addClass("widget-box").appendTo($widget2);
        var $header2 = $('<div></div>').addClass("widget-header header-color-orange").appendTo($box2);

        var name2 = $('<h4></h4>').text("装修单").appendTo($header2);

        var $body2 = $('<div></div>').addClass("widget-body").appendTo($box2);
        var $main2 = $('<div></div>').addClass("widget-main").appendTo($body2);
        var $info2 = $('<div></div>').css("padding", "5px").appendTo($main2);

        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('预签时间: ' + (decoration.precontractTime == null ? " " : decoration.precontractTime))).appendTo($info2);
        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('签单时间: ' + decoration.contractTime)).appendTo($info2);
        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('工程状态: ' + constant.decoration().decoration.projectStatus.keys[decoration.projectStatus])).appendTo($info2);
        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('保修状态: ' + constant.decoration().decoration.repairStatus.keys[decoration.repairStatus])).appendTo($info2);

        var $widget2 = $('<div></div>').addClass("").prependTo(feedbackGuarantee.decorationInfo1);
        var $box2 = $('<div></div>').addClass("widget-box").appendTo($widget2);
        var $header2 = $('<div></div>').addClass("widget-header header-color-orange").appendTo($box2);

        var name2 = $('<h4></h4>').text("装修单").appendTo($header2);

        var $body2 = $('<div></div>').addClass("widget-body").appendTo($box2);
        var $main2 = $('<div></div>').addClass("widget-main").appendTo($body2);
        var $info2 = $('<div></div>').css("padding", "5px").appendTo($main2);

        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('设计师: ' + decoration.designer.currentName)).appendTo($info2);
        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('设计部: ' + decoration.designer.dept.name)).appendTo($info2);
        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('设计分区: ' + decoration.designer.dept.fatherDept.name)).appendTo($info2);
        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('业务员: ' + decoration.salesman.currentName)).appendTo($info2);
        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('监理: ' + decoration.supervisor.currentName)).appendTo($info2);

        var $widget2 = $('<div></div>').addClass("").prependTo(feedbackGuarantee.decorationInfo);
        var $box2 = $('<div></div>').addClass("widget-box").appendTo($widget2);
        var $header2 = $('<div></div>').addClass("widget-header header-color-orange").appendTo($box2);

        var name2 = $('<h4></h4>').text("装修单").appendTo($header2);

        var $body2 = $('<div></div>').addClass("widget-body").appendTo($box2);
        var $main2 = $('<div></div>').addClass("widget-main").appendTo($body2);
        var $info2 = $('<div></div>').css("padding", "5px").appendTo($main2);

        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('装修单号: ' + decoration.orderId)).appendTo($info2);
        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('楼盘地址: ' + (decoration.house.village.cityProper.city.name == null ? " " : decoration.house.village.cityProper.city.name) + " " + (decoration.house.village.cityProper == null ? " " : decoration.house.village.cityProper.name) + " " + decoration.house.village.name + " " + decoration.house.houseNumber)).appendTo($info2);
        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('报价版本: ' + decoration.version.name)).appendTo($info2);
        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('订单状态: ' + constant.decoration().decoration.status.keys[decoration.status])).appendTo($info2);
        $('<div></div>').append($('<label></label>').attr('for', 'form-field').text('订单类型: ' + constant.decoration().decoration.typeness.keys[decoration.typeness])).appendTo($info2);

    }

    function managedrawing(fgid) {

        com.focusPage('#feedbackDrawing').html("");
        com.post(api.customer.queryFeedbackDrawingBySid, {
            "feedbackDrawing.sid": fgid,
            "feedbackDrawing.type": 1
        }, function(data) {

            var feedbackDrawings = data.feedbackDrawings;

            if (!feedbackDrawings || feedbackDrawings.length == 0)
                return false;

            $.each(feedbackDrawings, function(i, value) {

                if (value.status == constant.sales().salesPicture.STATUS_YES_SHORT) {
                    appendGalleryElement("feedbackDrawing", value);
                }
            });
            com.popup4photos(com.focusPage("#feedbackDrawing"));
        }, null, false);

        feedbackGuarantee.drawingModal.modal("show");
    }

    function appendGalleryElement(galleryId, value) {

        var gallery = com.focusPage("#" + galleryId);

        var imgLi = $("<li></li>").attr("id", "gallery_li" + value.fdid).addClass("text-center col-sm-4").css("border", "0px").css("border-color", "white").css("padding", "0px").css("height", "150px").css("width", "150px").appendTo(gallery);
        var img = $('<img/>');
        var $imgA = $('<a></a>').attr('data-rel', 'colorbox').addClass('cboxElement').attr('href', com.showImg(img, value.path, 200, 200, '200x200')).attr('target', '_blank').append(img).appendTo(imgLi);
        var imgA = $("<a></a>").addClass('cboxElement').attr("target", "_blank").css("height", "150px").append(img).appendTo(imgLi);

        com.showImg(img, value.path, 150, 150, value.name, null, 0);

        var toolsDiv = $("<div></div>").addClass("tools tools-bottom").appendTo(imgLi);
        var toolsA = $("<a></a>").attr("href", "#").on("click", function() {

            com.post(api.customer.deleteFeedbackDrawing, {
                "feedbackDrawing.fdid": value.fdid,
                "feedbackDrawing.type": 1
            }, function(res) {

                com.focusPage("#gallery_li" + value.fdid).remove();
            });
        }).appendTo(toolsDiv);

        $("<i></i>").addClass("icon-remove red").appendTo(toolsA);
    }

    function initUploadBtn(sid) {

        com.uploadify("#feedbackUpload", "上传图片", api.common.uploadImg, 'btn btn-success', '*.jpg;*.jpeg;*.gif;*.png', {
            'uploadType': 0
        }, 5, function(data) {

            var options = {};

            options["feedbackDrawing.sid"] = sid;
            options["feedbackDrawing.fid"] = params.fid;
            options["feedbackDrawing.name"] = data.strutsUploadsFileName;
            options["feedbackDrawing.path"] = data.resUrl;
            options["feedbackDrawing.type"] = 1;
            options["feedbackDrawing.filesize"] = data.filesize;

            com.post(api.customer.addFeedbackDrawing, options, function(res) {

                var feedbackDrawing = res.feedbackDrawing;

                appendGalleryElement("feedbackDrawing", feedbackDrawing);

                com.popup4photos("#feedbackDrawing");
            });

            searcher.doSearch();
        });
    }

    function editGuarantee(v) {

        params.fid = v.fid;
        params.fgid = v.fgid;

        com.popup4page("#layerPopUp", api.index.feedbackGuarantee2edit.url, "编辑维修");
    }
});