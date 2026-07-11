$(function() {

    var editFeedbackGuarantee = {

        btns: {
            saveBtn: com.focusPage("#editSaveBtn"),
        },
        modals: {

        },
        items: {
            orderId: com.focusPage("#e_orderId"),
            phone: com.focusPage("#e_phone"),
            source: com.focusPage("#e_source"),
            content: com.focusPage("#e_content"),
            cutomerType: com.focusPage("#e_cutomerType"),
            workType: com.focusPage("#e_workType"),
            brandName: com.focusPage("#e_brandName"),
            reportedDate: com.focusPage("#e_reportedDate"),
            renovationYear: com.focusPage("#e_renovationYear"),
            svuid: com.focusPage("#e_svuid"),
            svUserStatus: com.focusPage("#e_svUserStatus"),
            repairResult: com.focusPage("#e_repairResult"),
            plumber: com.focusPage("#eplumber"),
            electrician: com.focusPage("#e_electrician"),
            tiler: com.focusPage("#etilerType"),
            carpenter: com.focusPage("#ecarpenterType"),
            painter: com.focusPage("#epainterType"),
            upgradeSource: com.focusPage("#e_upgradeSource"),

        },
        decorationStatus: {},// 订单状态
        typeness: {},// 订单类型

        cid: null,
        bid: null,
        sid: null,
        fgid: null,
        vid: params.customer.vid,
        resUrl: null,
        status: {},
        pids: [],
    };

    editFeedbackGuarantee.decorationStatus = constant.decoration().decoration.status.keys;
    editFeedbackGuarantee.typeness = constant.decoration().decoration.typeness.keys;

    com.datetime(editFeedbackGuarantee.items.reportedDate);

    editFeedbackGuarantee.items.source.bindData(constant.customer().feedbackGuarantee.source.datas, "key", "value");
    editFeedbackGuarantee.items.cutomerType.bindData(constant.customer().feedbackGuarantee.cutomerType.datas, "key", "value");
    editFeedbackGuarantee.items.workType.bindData(constant.customer().feedbackGuarantee.workType.datas, "key", "value");
    editFeedbackGuarantee.items.svUserStatus.bindData(constant.customer().feedbackGuarantee.svUserStatus.datas, "key", "value");
    editFeedbackGuarantee.items.repairResult.bindData(constant.customer().feedbackGuarantee.repairResult.datas, "key", "value");
    editFeedbackGuarantee.items.upgradeSource.bindData(constant.customer().feedbackGuarantee.upgradeSource.datas, "key", "value");

    $.each(constant.customer().feedbackGuarantee.deptType.datas, function(i, v) {

        var label = $('<label style="margin-right: 10px;"></label>').appendTo(com.focusPage("#e_choiceDeptType"));
        var inputs = $('<input type="checkbox" class="ace" id="' + v.key + '"  name="deptType" value="' + v.value + '"><span class="lbl blue">' + v.value + '</span>').appendTo(label);
    });

    $.each(constant.customer().feedbackGuarantee.plumberType.datas, function(i, v) {

        var label = $('<label style="margin-right: 10px;"></label>').appendTo(com.focusPage("#eplumber"));
        var inputs = $('<input type="checkbox" class="ace" id="' + v.key + '"  name="workType" value="' + v.value + '"><span class="lbl blue">' + v.value + '</span>').appendTo(label);
    });

    $.each(constant.customer().feedbackGuarantee.electricianType.datas, function(i, v) {

        var label = $('<label style="margin-right: 10px;"></label>').appendTo(com.focusPage("#e_electrician"));
        var inputs = $('<input type="checkbox" class="ace" id="' + v.key + '"  name="workType" value="' + v.value + '"><span class="lbl blue">' + v.value + '</span>').appendTo(label);
    });

    $.each(constant.customer().feedbackGuarantee.tilerType.datas, function(i, v) {

        var label = $('<label style="margin-right: 10px;"></label>').appendTo(com.focusPage("#etilerType"));
        var inputs = $('<input type="checkbox" class="ace" id="' + v.key + '"  name="workType" value="' + v.value + '"><span class="lbl blue">' + v.value + '</span>').appendTo(label);
    });

    $.each(constant.customer().feedbackGuarantee.carpenterType.datas, function(i, v) {

        var label = $('<label style="margin-right: 10px;"></label>').appendTo(com.focusPage("#ecarpenterType"));
        var inputs = $('<input type="checkbox" class="ace" id="' + v.key + '"  name="workType" value="' + v.value + '"><span class="lbl blue">' + v.value + '</span>').appendTo(label);
    });

    $.each(constant.customer().feedbackGuarantee.painterType.datas, function(i, v) {

        var label = $('<label style="margin-right: 10px;"></label>').appendTo(com.focusPage("#epainterType"));
        var inputs = $('<input type="checkbox" class="ace" id="' + v.key + '"  name="workType" value="' + v.value + '"><span class="lbl blue">' + v.value + '</span>').appendTo(label);
    });

    com.initTypeahead('e_brandName', api.data.queryBrandByPinyin, "brand.pinyin", {
        "brand.atttype": 0
    }, 'brands', 'bid', 'name', function(list, k, v) {

        $.each(list, function(index, val) {

            if (val.bid == k) {
                editFeedbackGuarantee.bid = val.bid;
                editFeedbackGuarantee.items.brandName.val(val.name);
            }
        });

        return v
    });

    com.initTypeahead('e_svuid', api.personel.queryUserByPinyin, "pinyinName", {
        "user.status": 0,
        "departmentType.name": ""
    }, "autoFillKeyValue", "key", "value");

    com.uploadify("#e_path", "图片", api.common.uploadOther, 'btn btn-success blue ', '*.jpg;*.jpeg;*.gif;*.png', {
        'uploadType': 0
    }, 1, function(data) {

        editFeedbackGuarantee.resUrl = data.resUrl;
        com.focusPage("#e_path").val(data.resUrl);
        com.focusPage("#e_infoPicture").attr("href", com.showImg(com.focusPage("#showImg"), data.resUrl, 150, 150, ''));

    });

    // 多选设置
    com.focusPage('input[name="echange_workType"]').click(function() {

        if ($(this).prop("checked")) {

            if (this.value == 1) {
                editFeedbackGuarantee.items.plumber.show("slow");
            }
            if (this.value == 2) {
                editFeedbackGuarantee.items.electrician.show("slow");
            }
            if (this.value == 3) {
                editFeedbackGuarantee.items.tiler.show("slow");
            }
            if (this.value == 4) {
                editFeedbackGuarantee.items.carpenter.show("slow");
            }
            if (this.value == 5) {
                editFeedbackGuarantee.items.painter.show("slow");
            }

        }
        if (!$(this).prop("checked")) {

            if (this.value == 1) {
                editFeedbackGuarantee.items.plumber.hide();
            }
            if (this.value == 2) {
                editFeedbackGuarantee.items.electrician.hide();
            }
            if (this.value == 3) {
                editFeedbackGuarantee.items.tiler.hide();
            }
            if (this.value == 4) {
                editFeedbackGuarantee.items.carpenter.hide();
            }
            if (this.value == 5) {
                editFeedbackGuarantee.items.painter.hide();
            }

        }
    });

    com.post(api.customer.queryFeedbackGuaranteeByFgid, {
        "feedbackGuarantee.fgid": params.fgid
    }, function(res) {

        var $feedbackGuarantee = res.feedbackGuarantee;
        editFeedbackGuarantee.items.orderId.val($feedbackGuarantee.orderId);
        editFeedbackGuarantee.items.phone.val($feedbackGuarantee.phone);
        editFeedbackGuarantee.items.source.val($feedbackGuarantee.source);
        editFeedbackGuarantee.items.content.val($feedbackGuarantee.content);

        editFeedbackGuarantee.items.cutomerType.val($feedbackGuarantee.cutomerType);
        editFeedbackGuarantee.items.workType.val($feedbackGuarantee.workType);
        editFeedbackGuarantee.items.brandName.val($feedbackGuarantee.brands);
        editFeedbackGuarantee.items.reportedDate.val($feedbackGuarantee.reportedDate);
        editFeedbackGuarantee.bid = $feedbackGuarantee.bids
        editFeedbackGuarantee.items.renovationYear.val($feedbackGuarantee.renovationYear);
        editFeedbackGuarantee.items.repairResult.val($feedbackGuarantee.repairResult);
        editFeedbackGuarantee.items.upgradeSource.val($feedbackGuarantee.upgradeSource);

        if ($feedbackGuarantee.source == 11 || $feedbackGuarantee.source == 12) {
            com.focusPage('#es_upgradeSource').show("");
        }

        var checkArray = $feedbackGuarantee.deptType.split(",");

        $('#e_choiceDeptType input[type="checkbox"]').each(function() {

            var checkboxValue = $(this).val();
            if ($.inArray(checkboxValue, checkArray) !== -1) {
                $(this).prop('checked', true);
            }
        });

        var workTypeArray = $feedbackGuarantee.workType.split(",");

        $('#checkboxs input[type="checkbox"]').each(function() {

            var checkboxValue = $(this).val();
            if ($.inArray(checkboxValue, workTypeArray) !== -1) {
                $(this).prop('checked', true);
            }
        });
    });

    // 信息来源
    com.focusPage('#e_source').change(function() {

        var selectedValue = $(this).val();
        if (selectedValue == 11 || selectedValue == 12) {
            com.focusPage('#es_upgradeSource').show("");
        } else {
            // editFeedbackGuarantee.items.upgradeSource.val(0);
            com.focusPage('#es_upgradeSource').hide("");
        }

    });

    com.focusPage('#editSaveBtn').on("click", function() {

        var selectedValues = $('input[name="deptType"]:checked').map(function() {

            return $(this).val();
        }).get();

        var selectedWorkTypeValues = $('input[name="workType"]:checked').map(function() {

            return $(this).val();
        }).get();

        var options = {
            "feedbackGuarantee.fid": params.fid,
            "feedbackGuarantee.fgid": params.fgid,
            "feedbackGuarantee.orderId": editFeedbackGuarantee.items.orderId.val(),
            "feedbackGuarantee.source": editFeedbackGuarantee.items.source.val(),
            "feedbackGuarantee.phone": editFeedbackGuarantee.items.phone.val(),
            "feedbackGuarantee.cutomerType": editFeedbackGuarantee.items.cutomerType.val(),
            "feedbackGuarantee.deptType": selectedValues.join(','),
            "feedbackGuarantee.workType": selectedWorkTypeValues.join(','),
            "feedbackGuarantee.content": editFeedbackGuarantee.items.content.val(),
            "feedbackGuarantee.bids": editFeedbackGuarantee.bid,
            "feedbackGuarantee.brands": editFeedbackGuarantee.items.brandName.val(),
            "feedbackGuarantee.reportedDate": editFeedbackGuarantee.items.reportedDate.val(),
            "feedbackGuarantee.renovationYear": editFeedbackGuarantee.items.renovationYear.val(),
            "feedbackGuarantee.repairResult": editFeedbackGuarantee.items.repairResult.val(),
            "feedbackGuarantee.upgradeSource": editFeedbackGuarantee.items.upgradeSource.val(),
        };

        com.post(api.customer.updateFeedbackGuarantee, options, function(res) {

            if (editFeedbackGuarantee.resUrl && editFeedbackGuarantee.resUrl.length > 0) {

                var options1 = {};
                options1["feedbackDrawing.fid"] = params.fid
                options1["feedbackDrawing.sid"] = params.fgid
                options1["feedbackDrawing.path"] = editFeedbackGuarantee.resUrl
                options1["feedbackDrawing.type"] = 1;

                com.post(api.customer.addFeedbackDrawing, options1, function(res) {

                    var feedbackDrawing = res.feedbackDrawing;

                });
            }
            window.refreshItemList();
            com.closePopup();
        });

    });

});