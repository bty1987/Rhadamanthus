$(function() {

    var normood = {
        orderId: params.quotation.orderId,

        normoods: com.focusPage('#normoods'),
        printBtn: com.focusPage('#printBtn'),
        accessories: com.focusPage('#accessories'),

        btns: {
            printBtn: com.focusPage('#printBtn'),
            printNormoodBtn: com.focusPage('#printNormoodBtn'),
        },

        modals: {
            printNormoodModal: com.focusPage("#printNormoodModal"),
        },

        aids: [],
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

            var propertyArr = [["商品", "cell col-md-1"], ["定额数量", "cell col-md-1"], ["定额单位", "cell col-md-1"], ["库房单位", "cell col-md-1"], ["领取数量", "cell col-md-1"], ["总额", "cell col-md-1"]];

            $.each(propertyArr, function(i, v) {

                var $cell = $('<div></div>').addClass('cell ' + v[1]).css({
                    'border': 'none',
                });
                var $cellWrap = $('<div></div>').addClass('cell-wrap').html(v[0]);
                $cell.append($cellWrap).appendTo($quoteItemLi);
            });

            var propertyArr = [["名称", "cell col-md-1"], ["定额数量", "cell col-md-1"], ["定额单位", "cell col-md-1"], ["库房数量", "cell col-md-1"], ["库房单位", "cell col-md-1"], ["定额总额", "cell col-md-1"]];

            $.each(propertyArr, function(i, v) {

                var $cell = $('<div></div>').addClass('cell ' + v[1]).css({
                    'border': 'none',
                });
                var $cellWrap = $('<div></div>').addClass('cell-wrap').html(v[0]);
                $cell.append($cellWrap).appendTo($quoteItemLi);
            });

            $quoteItemLi.appendTo(contain);
        },

        createItem: function(v, d, contain) {

            var id = v ? v.nid : (d ? d.noods.nid : 0);

            var onum = v ? v.num : 0;
            var onnum = v ? v.normnum : 0;
            var osnum = v ? v.storenum : 0;
            var ototal = v ? utils.changeThrDecimal(utils.accMul(parseFloat(onnum), parseFloat(v.num))) : 0;

            var tnnum = d ? d.normnum : 0;
            var tsnum = d ? d.storenum : 0;
            var tntotal = d ? utils.changeThrDecimal(utils.accMul(parseFloat(d.price), parseFloat(d.normnum))) : 0;

            var $quoteItemLi = $('<li></li>').addClass('fl-quo-item').css({
                'border': 'none',
                'border-bottom': '1px solid #dce8f1'
            }).attr({
                "id": ("nid") + id,
                "data-onum": onum,
                "data-ototal": ototal,
                "data-tnnum": tnnum,
                "data-tsnum": tsnum,
                "data-tntotal": tntotal,
            });

            var propertyArr = [[v ? v.goods.name : '', 'grey col-md-1', "oname"], [v ? v.normnum : '', 'blue col-md-1', ''], [v ? v.normunit : '', 'blue col-md-1', "tnunit"], [v ? v.storeunit : '', 'blue col-md-1', "tsunit"], [v ? v.num : '', 'blue col-md-1', 'onum'], [v ? ototal : '', 'blue col-md-1', "ototal"]];

            $.each(propertyArr, function(i, v) {

                var $cell = $('<div></div>').addClass('cell ' + v[1]).css({
                    'border': 'none',
                });
                var $cellWrap = $('<div></div>').addClass('cell-wrap ' + v[2] ? v[2] : '').html(v[0]);
                $cell.append($cellWrap).appendTo($quoteItemLi);
            });

            var propertyArr = [[d ? d.noods.name : '', 'green col-md-1', "tname"], [d ? d.normnum : '', 'blue col-md-1', 'tnnum'], [d ? d.normunit : '', 'blue col-md-1', "tnunit"], [d ? d.storenum : '', 'blue col-md-1', 'tsnum'], [d ? d.storeunit : '', 'blue col-md-1', "tsunit"], [d ? tntotal : '', 'blue col-md-1', "tntotal"]];

            $.each(propertyArr, function(i, v) {

                var $cell = $('<div></div>').addClass('cell ' + v[1]).css({
                    'border': 'none',
                });
                var $cellWrap = $('<div></div>').addClass('cell-wrap ' + v[2] ? v[2] : '').html(v[0]);
                $cell.append($cellWrap).appendTo($quoteItemLi);
            });

            if (d)
                contain.append($quoteItemLi.css("border-top", "1px solid #6fb3e0"));

            if (v)
                contain.after($quoteItemLi);
        },

        createFooter: function(leftTotal, rightTotal, contain) {

            var $itemLi = $('<li></li>');

            var litemh4 = $("<h4></h4>").addClass("col-md-5").appendTo($itemLi);
            var litemtotal = $("<strong></strong>").addClass("pull-right").css("color", "rgb(226, 115, 125)").text("总额: " + utils.changeThrDecimal(leftTotal)).appendTo(litemh4);

            var ritemh4 = $("<h4></h4>").addClass("col-md-7").appendTo($itemLi);
            var ritemtotal = $("<strong></strong>").addClass("pull-right").css("color", "rgb(226, 115, 125)").text("总额: " + utils.changeThrDecimal(rightTotal)).appendTo(ritemh4);

            contain.append($itemLi);
        },

        createLow: function(contain) {

            var $li = $('<li></li>').addClass('fl-quo-item').css({
                'border': 'none',
                'border-bottom': '1px solid #dce8f1',
                'border-top': '1px solid #dce8f1'
            });

            var propertyArr = [["名称", "cell col-md-3"], ["辅料总额", "cell col-md-3"]];

            $.each(propertyArr, function(i, v) {

                var $cell = $('<div></div>').addClass('cell ' + v[1]).css('border', 'none');
                var $cellWrap = $('<div></div>').addClass('cell-wrap').html(v[0]);
                $cell.append($cellWrap).appendTo($li);
            });

            var propertyArr = [["名称", "cell col-md-3"], ["材料费总额", "cell col-md-3"]];

            $.each(propertyArr, function(i, v) {

                var $cell = $('<div></div>').addClass('cell ' + v[1]).css('border', 'none');
                var $cellWrap = $('<div></div>').addClass('cell-wrap').html(v[0]);
                $cell.append($cellWrap).appendTo($li);
            });

            $li.appendTo(contain);
        },

        createBelowItem: function(v, a, contain) {

            var cnid = v ? v.cnid : (a ? a.constructionNode.cnid : 0);

            var stotal = a ? utils.changeThrDecimal(utils.accMul(a.stuff, a.num)) : 0;

            var $li = $('<li></li>').addClass('fl-quo-item').css({
                'border': 'none',
                'border-bottom': '1px solid #dce8f1'
            }).attr({
                "id": "cnid" + cnid,
                "data-total": v ? (v.total == null ? 0 : v.total) : 0,
                "data-stotal": stotal,
                "data-cnid": v ? v.cnid : 0
            });

            var propertyArr = [['', 'blue col-md-3', "aname"], [v ? (v.total == null ? 0 : v.total) : '', 'blue col-md-3', "total"]];

            $.each(propertyArr, function(i, v) {

                var $cell = $('<div></div>').addClass('cell ' + v[1]).css('border', 'none');
                var $cellWrap = $('<div></div>').addClass('cell-wrap ' + v[2] ? v[2] : '').html(v[0]);
                $cell.append($cellWrap).appendTo($li);
            });

            var propertyArr = [[a ? a.constructionNode.name : '', 'blue col-md-3', "name"], [a ? stotal : '', 'blue col-md-3', "stotal"]];

            $.each(propertyArr, function(i, v) {

                var $cell = $('<div></div>').addClass('cell ' + v[1]).css('border', 'none');
                var $cellWrap = $('<div></div>').addClass('cell-wrap ' + v[2] ? v[2] : '').html(v[0]);
                $cell.append($cellWrap).appendTo($li);
            });

            contain.append($li);
        },
    };

    var $ulData = $('<ul></ul>').addClass('flex-table');

    var $div = $('<div></div>').addClass('col-md-12');
    var $lowDiv = $('<div></div>').addClass('col-md-12');

    paint.createHead($div);
    paint.createLow($lowDiv);

    $ulData.append($div).appendTo(normood.normoods);
    $ulData.append($lowDiv).appendTo(normood.accessories);

    var quotation = null;
    var options = {};
    var index = 0;

    var leftTotal = 0.0;
    var rightTotal = 0.0;

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

        com.post(api.quotation.amountQuotationNormrice, {
            "quotation.qid": quotation.qid
        }, function(res) {

            lowRight(res.normrices);
        }, null, false);

        com.post(api.quotation.amountExtensionNormrice, {
            "extension.orderId": quotation.orderId
        }, function(res) {

            lowRight(res.normrices);
        }, null, false);

        com.post(api.quotation.amountAddReduceNormrice, {
            "addReduce.orderId": quotation.orderId
        }, function(res) {

            lowRight(res.normrices);
        }, null, false);
    }

    com.post(api.inventory.queryAccessoriesByOrderId, {
        "accessories.orderId": normood.orderId
    }, function(res) {

        $.each(res.accessoriess, function(i, v) {

            if ([0, 1, 2, 6, 7].indexOf(v.status) == -1)
                return true;

            normood.aids.push(v.aid);

            lowLeft(v);
        });
    }, null, false);

    if (!$.isEmptyObject(options)) {
        com.post(api.inventory.queryAccessoriesItemByOrderId, {
            "accessories.orderId": normood.orderId
        }, function(res) {

            leftTotal = utils.accAdd(leftTotal, handleLeft(res.accessoriesItems));
        }, null, false);
    }

    com.post(api.data.queryConstructionNode, {}, function(res) {

        $.each(res.constructionNodes, function(i, v) {

            var cli = com.focusPage("#cnid" + v.cnid);

            var cnid = cli.attr("data-cnid");

            if (v.cnid == cnid) {
                cli.find(".aname").text(v.name);
            }
        });

    }, null, false);

    paint.createFooter(leftTotal, rightTotal, $div);

    function handleLeft(data) {

        var total = 0.0;

        $.each(data, function(i, v) {

            if (normood.aids.indexOf(v.aid) == -1)
                return true;

            var nid = v.nid;
            var itemli = com.focusPage("#nid" + nid);

            if (itemli && itemli.length != 0) {

                // itemli.find(".oname").text(v.goods.name);
                // itemli.find(".ounit").text(v.goods.measurementUnit);

                var num = utils.accAdd(parseFloat(itemli.attr("data-onum")), parseFloat(v.num));
                var ototal = utils.accAdd(parseFloat(itemli.attr("data-ototal")), utils.accMul(parseFloat(v.normnum), parseFloat(v.num)));

                itemli.attr("data-onum", num);
                itemli.attr("data-ototal", ototal);

                itemli.find(".onum").text(num);
                itemli.find(".ototal").text(ototal);
            } else {

            }

            paint.createItem(v, null, itemli);

            total = utils.accAdd(total, utils.accMul(parseFloat(v.normnum), parseFloat(v.num)));
        });

        return total;
    }

    function handleRight(data) {

        var total = 0.0;

        $.each(data, function(i, v) {

            var nid = v.noods.nid;
            var itemli = com.focusPage("#nid" + nid);

            if (itemli && itemli.length != 0) {

                var normnum = utils.accAdd(parseFloat(itemli.attr("data-tnnum")), parseFloat(v.normnum));
                var storenum = utils.accAdd(parseFloat(itemli.attr("data-tsnum")), parseFloat(v.storenum));

                var tntotal = utils.accAdd(parseFloat(itemli.attr("data-tntotal")), utils.accMul(parseFloat(v.price), parseFloat(v.normnum)));

                itemli.attr("data-tnnum", normnum);
                itemli.attr("data-tsnum", storenum);
                itemli.attr("data-tntotal", tntotal);

                itemli.find(".tnnum").text(normnum);
                itemli.find(".tsnum").text(storenum);
                itemli.find(".tntotal").text(tntotal);

            } else {
                paint.createItem(null, v, $div);
            }

            total = utils.accAdd(total, utils.accMul(parseFloat(v.price), parseFloat(v.normnum)));
        });

        return total;
    }

    function lowLeft(v) {

        var cli = com.focusPage("#cnid" + v.cnid);

        if (cli && cli.length != 0) {

            var total = utils.changeThrDecimal(utils.accAdd(parseFloat(cli.attr("data-total")), v.total == null ? 0 : v.total));

            cli.attr("data-total", total);

            cli.find(".total").text(total);

            cli.attr("data-cnid", v.cnid);

        } else {
            paint.createBelowItem(v, null, $lowDiv);
        }

    }

    function lowRight(data) {

        $.each(data, function(i, v) {

            var cli = com.focusPage("#cnid" + v.constructionNode.cnid);

            if (cli && cli.length != 0) {

                var stotal = utils.changeThrDecimal(utils.accAdd(parseFloat(cli.attr("data-stotal")), utils.accMul(v.stuff, v.num)));

                cli.attr("data-stotal", stotal);

                cli.find(".stotal").text(stotal);

            } else {
                paint.createBelowItem(null, v, $lowDiv);
            }
        });
    }

    function printNormood() {

        params.quotation.quotationId = quotation.qid;
        params.quotation.orderId = normood.orderId;
        params.quotation.subtype = 0;

        var $subtypes = com.focusPage('input[name="type"]:checked', '#printNormoodModal #subtype');

        $.each($subtypes, function(i, v) {

            params.quotation.subtype = parseInt(params.quotation.subtype) + parseInt($(v).attr('value'));
        });

        com.popup("打印定额", "/views/quotation/normoodOutput.html", null, null, true);

        normood.modals.printNormoodModal.modal("hide");
    }

});