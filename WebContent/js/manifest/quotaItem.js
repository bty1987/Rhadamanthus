$(function() {

    var normood = {
        orderId: params["accessories.orderId"],
        normoods: com.focusPage('#normoods'),
        printBtn: com.focusPage('#printBtn'),

        items: {

        },

        btns: {
            printBtn: com.focusPage('#printBtn'),
            printNormoodBtn: com.focusPage('#printNormoodBtn'),
        },

        modals: {
            printNormoodModal: com.focusPage("#printNormoodModal"),
        }
    };

    normood.btns.printBtn.click(function() {

        normood.modals.printNormoodModal.modal("show");
    });

    normood.btns.printNormoodBtn.click(printNormood);

    var paint = {

        createHead: function(contain) {

            var $quoteItemLi = $('<li></li>').addClass('fl-quo-item').css({
                'border': 'none',
                'border-bottom': '1px solid #dce8f1'
            });

            var propertyArr = [["商品", "cell col-md-2"], ["领取数量", "cell col-md-1"], ["辅材单位", "cell col-md-1"], ["总额", "cell col-md-1"], ];

            $.each(propertyArr, function(i, v) {

                var $cell = $('<div></div>').addClass('cell ' + v[1]).css('border', 'none');
                var $cellWrap = $('<div></div>').addClass('cell-wrap').html(v[0]);
                $cell.append($cellWrap).appendTo($quoteItemLi);
            });

            var propertyArr = [["商品", "cell col-md-2"], ["定额数量", "cell col-md-1"], ["定额单位", "cell col-md-1"], ["库房数量", "cell col-md-1"], ["库房单位", "cell col-md-1"], ["定额总额", "cell col-md-1"], ];

            $.each(propertyArr, function(i, v) {

                var $cell = $('<div></div>').addClass('cell ' + v[1]).css('border', 'none');
                var $cellWrap = $('<div></div>').addClass('cell-wrap').html(v[0]);
                $cell.append($cellWrap).appendTo($quoteItemLi);
            });

            $quoteItemLi.appendTo(contain);
        },

        createItem: function(v, d, contain) {

            var gid = v ? v.goods.gid : (d ? d.goods.gid : 0);

            var onum = v ? v.num : 0;
            var ototal = v ? parseFloat(v.goods.selling) * parseFloat(v.num) : '';

            var tnnum = d ? d.normnum : 0;
            var tsnum = d ? d.storenum : 0;
            var tntotal = d ? parseFloat(d.goods.selling) * parseFloat(d.normnum) : 0;

            var $quoteItemLi = $('<li></li>').addClass('fl-quo-item').css({
                'border': 'none',
                'border-bottom': '1px solid #dce8f1'
            }).attr({
                "id": "gid" + gid,
                "data-onum": onum,
                "data-ototal": ototal,
                "data-tnnum": tnnum,
                "data-tsnum": tsnum,
                "data-tntotal": tntotal,
            });

            var propertyArr = [[v ? v.goods.name : '', 'grey col-md-2', "oname"], [v ? v.num : '', 'blue col-md-1', 'onum'], [v ? v.goods.measurementUnit : '', 'blue col-md-1', "ounit"], [ototal, 'blue col-md-1', "ototal"], ];

            $.each(propertyArr, function(i, v) {

                var $cell = $('<div></div>').addClass('cell ' + v[1]).css('border', 'none');
                var $cellWrap = $('<div></div>').addClass('cell-wrap ' + v[2] ? v[2] : '').html(v[0]);
                $cell.append($cellWrap).appendTo($quoteItemLi);
            });

            var propertyArr = [[d ? d.goods.name : '', 'green col-md-2', "tname"], [d ? d.normnum : '', 'blue col-md-1', 'tnnum'], [d ? d.normunit : '', 'blue col-md-1', "tnunit"], [d ? d.storenum : '', 'blue col-md-1', 'tsnum'], [d ? d.storeunit : '', 'blue col-md-1', "tsunit"], [d ? tntotal : '', 'blue col-md-1', "tntotal"], ];

            $.each(propertyArr, function(i, v) {

                var $cell = $('<div></div>').addClass('cell ' + v[1]).css('border', 'none');
                var $cellWrap = $('<div></div>').addClass('cell-wrap ' + v[2] ? v[2] : '').html(v[0]);
                $cell.append($cellWrap).appendTo($quoteItemLi);
            });

            contain.append($quoteItemLi);
        },

        createFooter: function(leftTotal, rightTotal, contain) {

            var $itemLi = $('<li></li>');

            var litemh4 = $("<h4></h4>").addClass("col-md-5").appendTo($itemLi);
            var litemtotal = $("<strong></strong>").addClass("pull-right").css("color", "rgb(226, 115, 125)").text("总额: " + leftTotal).appendTo(litemh4);

            var ritemh4 = $("<h4></h4>").addClass("col-md-7").appendTo($itemLi);
            var ritemtotal = $("<strong></strong>").addClass("pull-right").css("color", "rgb(226, 115, 125)").text("总额: " + rightTotal).appendTo(ritemh4);

            contain.append($itemLi);
        }
    };

    var $ulData = $('<ul></ul>').addClass('flex-table');

    var $div = $('<div></div>').addClass('col-md-12');

    paint.createHead($div);

    $ulData.append($div).appendTo(normood.normoods);

    var quotation = null;
    var options = {};
    var index = 0;

    var leftTotal = 0.0;
    var rightTotal = 0.0;

    com.post(api.inventory.queryAccessoriesByOrderId, {
        "accessories.orderId": normood.orderId
    }, function(res) {

        $.each(res.accessoriess, function(i, v) {

            if (v.status != 2)
                return true;
            options["aids[" + index++ + "]"] = v.aid;
        });
    }, null, false);

    if (!$.isEmptyObject(options)) {
        com.post(api.inventory.queryAccessoriesItemByAids, options, function(res) {

            leftTotal = utils.accAdd(leftTotal, handleLeft(res.accessoriesItems));
        }, null, false);
    }

    options = {
        "quotation.orderId": normood.orderId,
        "quotation.type": 1
    };

    com.post(api.quotation.queryQuotationForDefaultByOrderId, options, function(res) {

        quotation = res.quotation;
    }, null, false);

    if (quotation && quotation.qid != null) {

        com.post(api.quotation.amountQuotationNormood, {
            "quotation.qid": quotation.qid
        }, function(res) {

            rightTotal = utils.accAdd(rightTotal, handleRight(res.normoods));
        }, null, false);

        com.post(api.quotation.amountExtensionNormood, {
            "extension.orderId": quotation.orderId
        }, function(res) {

            rightTotal = utils.accAdd(rightTotal, handleRight(res.normoods));
        }, null, false);

        com.post(api.quotation.amountAddReduceNormood, {
            "addReduce.orderId": quotation.orderId
        }, function(res) {

            rightTotal = utils.accAdd(rightTotal, handleRight(res.normoods));
        }, null, false);

        com.post(api.quotation.queryQuotationNormoodItem, {
            "quotationNormoodItem.qid": quotation.qid
        }, function(res) {

            rightTotal = utils.accAdd(rightTotal, handleRight(res.quotationNormoodItems));
        }, null, false);
    }

    paint.createFooter(leftTotal, rightTotal, $div);

    function handleLeft(data) {

        var total = 0.0;

        $.each(data, function(i, v) {

            var gid = v.goods.gid;
            var itemli = com.focusPage("#gid" + gid);

            if (itemli && itemli.length != 0) {

                var num = utils.accAdd(parseFloat(itemli.attr("data-onum")), parseFloat(v.num));
                var ototal = utils.accAdd(parseFloat(itemli.attr("data-ototal")), utils.accMul(parseFloat(v.goods.selling), parseFloat(v.num)));

                itemli.attr("data-onum", num);
                itemli.attr("data-ototal", ototal);

                itemli.find(".onum").text(num);
                itemli.find(".ototal").text(ototal);
            } else {
                paint.createItem(v, null, $div);
            }

            total = utils.accAdd(total, utils.accMul(parseFloat(v.goods.selling), parseFloat(v.num)));
        });

        return total;
    }

    function handleRight(data) {

        var total = 0.0;

        $.each(data, function(i, v) {

            var gid = v.goods.gid;
            var itemli = com.focusPage("#gid" + gid);

            if (itemli && itemli.length != 0) {

                var normnum = utils.accAdd(parseFloat(itemli.attr("data-tnnum")), parseFloat(v.normnum));
                var storenum = utils.accAdd(parseFloat(itemli.attr("data-tsnum")), parseFloat(v.storenum));

                var tntotal = utils.accAdd(parseFloat(itemli.attr("data-tntotal")), utils.accMul(parseFloat(v.goods.selling), parseFloat(v.normnum)));

                itemli.attr("data-tnnum", normnum);
                itemli.attr("data-tsnum", storenum);
                itemli.attr("data-tntotal", tntotal);

                itemli.find(".tnnum").text(normnum);
                itemli.find(".tsnum").text(storenum);
                itemli.find(".tntotal").text(tntotal);

            } else {
                paint.createItem(null, v, $div);
            }

            total = utils.accAdd(total, utils.accMul(parseFloat(v.goods.selling), parseFloat(v.normnum)));
        });

        return total;
    }

    function printNormood() {

        params.quotationId = quotation.qid;
        params['decorationOrderId'] = normood.orderId;
        params.subtype = 0;

        var $subtypes = com.focusPage('input[name="type"]:checked', '#printNormoodModal #subtype');

        $.each($subtypes, function(i, v) {

            params.subtype = parseInt(params.subtype) + parseInt($(v).attr('value'));
        });

        com.popup("打印定额", "/views/quotation/normoodOutput.html", null, null, true);

        normood.modals.printNormoodModal.modal("hide");
    }

});