$(function () {

    var normood = {
        orderId: params["accessories.orderId"],
        normoods: com.focusPage('#normoods'),
        printBtn:com.focusPage('#printBtn'),
        
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
    
    normood.btns.printBtn.click(function(){
        normood.modals.printNormoodModal.modal("show");
    });
    
    normood.btns.printNormoodBtn.click(printNormood);

    var paint = {

        createHead: function (contain) {

            var $quoteItemLi = $('<li></li>').addClass('fl-quo-item').css({
                'border': 'none',
                'border-bottom': '1px solid #dce8f1'
            });

            $.each('商品,领取数量,辅材单位'.split(','), function (i, v) {
                var $cell = $('<div></div>').addClass('cell col-md-2').css('border', 'none');
                var $cellWrap = $('<div></div>').addClass('cell-wrap').html(v);
                $cell.append($cellWrap).appendTo($quoteItemLi);
            });

            $.each('商品,定额上限,定额单位'.split(','), function (i, v) {
                var $cell = $('<div></div>').addClass('cell col-md-2').css('border', 'none');
                var $cellWrap = $('<div></div>').addClass('cell-wrap').html(v);
                $cell.append($cellWrap).appendTo($quoteItemLi);
            });

            $quoteItemLi.appendTo(contain);
        },

        createItem: function (v, d, contain) {

            var gid = v ? v.goods.gid : (d ? d.goods.gid : 0);
            var onum = v ? v.num : 0;
            var tnum = d ? d.num : 0;

            var $quoteItemLi = $('<li></li>').addClass('fl-quo-item').css({
                'border': 'none',
                'border-bottom': '1px solid #dce8f1'
            }).attr({
                "id": "gid" + gid,
                "data-onum": onum,
                "data-tnum": tnum,
            });

            var propertyArr = [
                [v ? v.goods.name : '', 'grey', "oname"],
                [v ? v.num : '', 'blue', 'onum'],
                [v ? v.goods.measurementUnit : '', 'blue', "ounit"],
            ];

            $.each(propertyArr, function (i, v) {
                var $cell = $('<div></div>').addClass('cell col-md-2 ' + v[1]).css('border', 'none');
                var $cellWrap = $('<div></div>').addClass('cell-wrap ' + v[2] ? v[2] : '').html(v[0]);
                $cell.append($cellWrap).appendTo($quoteItemLi);
            });

            var propertyArr = [
                [d ? d.goods.name : '', 'green', "tname"],
                [d ? d.num : '', 'blue', 'tnum'],
                [d ? d.unit : '', 'blue', "tunit"],
            ];

            $.each(propertyArr, function (i, v) {
                var $cell = $('<div></div>').addClass('cell col-md-2 ' + v[1]).css('border', 'none');
                var $cellWrap = $('<div></div>').addClass('cell-wrap ' + v[2] ? v[2] : '').html(v[0]);
                $cell.append($cellWrap).appendTo($quoteItemLi);
            });

            contain.append($quoteItemLi);
        },
    };

    var $ulData = $('<ul></ul>').addClass('flex-table');

    var $div = $('<div></div>').addClass('col-md-12');

    paint.createHead($div);

    $ulData.append($div).appendTo(normood.normoods);

    var quotation = null;
    var options = {};
    var index = 0;

    com.post(api.inventory.queryAccessoriesByOrderId, {"accessories.orderId": normood.orderId}, function (res) {
        $.each(res.accessoriess, function (i, v) {
            if (v.status != 2) return true;
            options["aids[" + index++ + "]"] = v.aid;
        });
    }, null, false);
    
    if (!$.isEmptyObject(options)) {
        com.post(api.inventory.queryAccessoriesItemByAids, options, function (res) {
            handleLeft(res.accessoriesItems);
        }, null, false);
    }

    options = {
        "quotation.orderId": normood.orderId,
        "quotation.type": 1
    };

    com.post(api.quotation.queryQuotationForDefaultByOrderId, options, function (res) {
        quotation = res.quotation;
    }, null, false);
    
    if(quotation && quotation.qid != null){
        
        com.post(api.quotation.amountQuotationNormood, {"quotation.qid": quotation.qid}, function (res) {
            handleRight(res.normoods);
        }, null, false);
        
        com.post(api.quotation.amountExtensionNormood, {"extension.orderId": quotation.orderId}, function (res) {
            handleRight(res.normoods);
        }, null, false);
        
        com.post(api.quotation.amountAddReduceNormood, {"addReduce.orderId": quotation.orderId}, function (res) {
            handleRight(res.normoods);
        }, null, false);
    }
    
    function handleLeft(data) {

        $.each(data, function (i, v) {

            var gid = v.goods.gid;
            var itemli = com.focusPage("#gid" + gid);

            if (itemli && itemli.length != 0) {
                var num = parseFloat(itemli.attr("data-onum")) + parseFloat(v.num);
                itemli.attr("data-onum", num);
                itemli.find(".onum").text(num);
            } else {
                paint.createItem(v, null, $div);
            }
        });
    }

    function handleRight(data) {

        $.each(data, function (i, v) {

            var gid = v.goods.gid;
            var itemli = com.focusPage("#gid" + gid);

            if (itemli && itemli.length != 0) {
                var num = parseFloat(itemli.attr("data-tnum")) + parseFloat(v.num);

                itemli.attr("data-tnum", num);

                itemli.find(".tname").text(v.goods.name);
                itemli.find(".tnum").text(num);
                itemli.find(".tunit").text(v.unit);
            } else {
                paint.createItem(null, v, $div);
            }
        });
    }
    
    function printNormood() {
        
        params.quotationId = quotation.qid;
        params['decorationOrderId'] = normood.orderId;
        params.subtype = 0;
        
        var $subtypes = com.focusPage('input[name="type"]:checked', '#printNormoodModal #subtype');

        $.each($subtypes, function (i, v){
            console.log($(v));
            params.subtype = parseInt(params.subtype) + parseInt($(v).attr('value'));
        });

        com.popup("打印定额", "/views/quotation/normoodOutput.html", null, null, true);
        
        normood.modals.printNormoodModal.modal("hide");
    }

});