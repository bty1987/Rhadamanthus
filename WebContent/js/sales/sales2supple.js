jQuery(function () {

    var sales = {
        queryDecorationByOrderIdUrl: api.decoration.queryDecorationForCommonByOrderId,
        typeahead: {
            goodes: "goodes",
            goods: "goods",
            gid: "goods.gid",
            pricegid: "price.gid",
            colorgid: "color.gid",
            formatgid: "format.gid"
        },
        items : {
            SupplementCouponInfo : com.focusPage("#SupplementCouponInfo"),
            totals : com.focusPage("#totals"),
            salesItemList : com.focusPage('#salesItemList'),
            brands : com.focusPage('#brands'),
            SupplementOrderId : com.focusPage('#SupplementOrderId'),
            SupplementCoupon : com.focusPage('#SupplementCoupon'),
            comment : com.focusPage('#comment'),
            SupplementMaling : com.focusPage('#SupplementMaling'),
            customerName : com.focusPage('#customerName'),
            orderAddr : com.focusPage('#orderAddr')
        },
        btns : {
            submit : com.focusPage('#submit')
        },
        sid : params.sid,
        bid : params.bid,
        cid: null,
        flag: true,
        salePostData: {},
        priceArray: []
    };

    com.initTypeahead('salesmanName', api.personel.queryUserByPinyin, "pinyinName", {"user.status":0,"departmentType.name":""}, 'autoFillKeyValue', 'key', 'value', null);
    com.initTypeahead('instorer', api.personel.queryUserByPinyin, "pinyinName", {"user.status":0,"departmentType.name":""}, 'autoFillKeyValue', 'key', 'value', null);
    com.initTypeahead('guider', api.personel.queryUserByPinyin, "pinyinName", {"user.status":0,"departmentType.name":""}, 'autoFillKeyValue', 'key', 'value', null);

    //绑定券信息
    com.post(api.ds.payment, {}, function (res) {
        sales.items.SupplementCouponInfo.bindData(res.materialCouponTypes, 'key', 'value', false);
    }, null, false);

    var initList = function (listData) {
        var $tableWrap = sales.items.salesItemList;
        var $div = $('<div></div>').addClass('item-list ui-sortable  fl-table-list');

        if (listData && listData.length) {
            $.each(listData, function (i, v) {
                var $liLine = $('<li></li>').addClass('item-orange clearfix');

                $liLine.attr("data-gid", v.goods.gid);
                $liLine.attr("data-cid", v.color.cid);
                $liLine.attr("data-fid", v.format.fid);
                $liLine.attr("data-purchase", v.purchase);
                $liLine.attr("data-selling", v.selling);
                $liLine.attr("data-discount", v.discount);
                $liLine.attr("data-disPrice", v.disPrice);
                $liLine.attr("data-postDis", v.postDis);
                $liLine.attr("data-price", v.price);
                $liLine.attr("data-comment", v.comment);
                $liLine.attr("data-rawCtype", v.rawCtype);
                $liLine.attr("data-rawCvalue", v.rawCvalue);
                $liLine.attr("data-priceType", v.priceType);

                var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                var $h3 = $('<div></div>').addClass('oid');
                var $small = $('<h4></h4>').addClass('blue').html(v.goods.name + ' ' + v.goods.no);

                var $supplementDiv = $("<div></div>").addClass("pull-right col-sm-2").appendTo($h3);
                var $supplementLabel = $('<label></label>').addClass("col-sm-4").css("line-height", "28px").html("数量:").appendTo($supplementDiv);
                var $supplementInput = $('<input/>').addClass("col-sm-6 v_float").css("font-size","14px").css("margin-right","5px").css("width","100px").css("height","26px").attr("name", "inputNumber").appendTo($supplementDiv);

                $supplementInput.on("change", function () {

                    if(com.validate("salesItemList" , "bottom")) {
                        return;
                    }

                    var inputs = com.focusPage("input[name='inputNumber']");
                    var allInputVal = 0;
                    $.each(inputs, function (i, j) {
                        var $j = $(j);
                        var inputVal = $j.val();
                        if(inputVal != ""){
                            allInputVal = utils.accAdd(allInputVal, utils.accMul(inputVal, sales.priceArray[i]));
                        }
                    });
                    sales.items.totals.val(allInputVal);
                });

                var propertyArr = [
                    ["商品品类:", v.goods.category, "grey"],
                    ["商品颜色:", v.color.name, "grey"],
                    ["商品规格:", v.format.info, "grey"],
                    ["售价:", v.selling, "blue"],
                    ["折扣价:", v.disPrice, "blue"],
                    ["折让价:", v.price, "blue"],
                    ["数量:", v.num, "blue"],
                    ["总价:", v.total, "blue"],
                    ["类型:", v.priceType == "0" ? "正价" : "特价", "red"],
                    ["备注:", v.comment, "grey"]
                ];

                $.each(propertyArr, function (index, value) {
                    var $liProperty = $('<li></li>');
                    $('<strong></strong>').html(value[0]).appendTo($liProperty);
                    $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                    $liProperty.appendTo($ulProperty);
                });

                $liLine.appendTo($div);
                $liLine.append($h3).append($ulProperty);
                
                $small.appendTo($h3);

                sales.priceArray.push(v.price);
            });

            $div.appendTo($tableWrap);
        }
    };

    querySalesItemBySid(sales.sid);

    function querySalesItemBySid(sid) {
        com.post(api.inventory.querySalesItemBySid, {"sales.sid": sid}, function (data) {
            initList(data.salesItems);
        }, function (e) {
            com.showAlert(com.error, e.errorMsg);
        }, false);
    }

    sales.btns.submit.click(function () {

        var flgs = false;
        var _option = {};

        if (com.validate('searchInfo', 'bottom') == false) {

            if (submitCheck() == false) {
                return;
            }

            _option = {
                "sales.orderId": sales.items.SupplementOrderId.val(),
                "sales.customer.cid": sales.cid,
                "sales.guider.userId": com.typeahead("guider"),
                "sales.instorer.userId": com.typeahead("instorer"),
                "sales.salesman.userId": com.typeahead("salesmanName"),
                "sales.bid": sales.bid,
                "sales.coupon": sales.items.SupplementCoupon.val() != "" ? parseFloat(sales.items.SupplementCoupon.val()) : 0,
                "sales.comment": sales.items.comment.val(),
                "sales.maling": sales.items.SupplementMaling.val() != "" ? parseFloat(sales.items.SupplementMaling.val()) : 0,
                "sales.total":  isNaN(parseFloat(sales.items.totals.val())) ? 0 : parseFloat(sales.items.totals.val()),
                "sales.house.hid": sales.salePostData["sales.house.hid"],
                "sales.dompanys": sales.salePostData["sales.dompanys"]
            };

            if (sales.items.SupplementCoupon.val() == "" || sales.items.SupplementCoupon.val() == 0) {
                _option["sales.couponInfo"] = " ";
            } else {
                _option["sales.couponInfo"] = '#' + com.focusPage('#SupplementCouponInfo').val() + ':' + sales.items.SupplementCoupon.val() + '#';
            }

            var $lis = com.focusPage('.item-orange', "#salesItemList");

            var $otherStatus = 0;
            var index = 0;
            $lis && $lis.length && $.each($lis, function (i, v) {
                var $v = $(v);

                var $status = $v.attr('data-otherStatus');
                
                if ($status == 1) {
                    $otherStatus = 1;
                }
                var numberParam = $v.find("input[name='inputNumber']").val();

                if(numberParam != ""){
                    flgs = true;

                    _option["salesItems[" + index + "].goods.gid"] = $v.attr("data-gid");
                    _option["salesItems[" + index + "].color.cid"] = $v.attr("data-cid");
                    _option["salesItems[" + index + "].format.fid"] = $v.attr("data-fid");
                    _option["salesItems[" + index + "].purchase"] = $v.attr("data-purchase");
                    _option["salesItems[" + index + "].selling"] = $v.attr("data-selling");
                    _option["salesItems[" + index + "].discount"] = $v.attr("data-discount");
                    _option["salesItems[" + index + "].disPrice"] = $v.attr("data-disPrice");
                    _option["salesItems[" + index + "].postDis"] = $v.attr("data-postDis");
                    _option["salesItems[" + index + "].price"] = $v.attr("data-price");
                    _option["salesItems[" + index + "].num"] = numberParam;
                    _option["salesItems[" + index + "].total"] = utils.accMul(numberParam, sales.priceArray[i]);
                    _option["salesItems[" + index + "].comment"] = $v.attr("data-comment");
                    _option["salesItems[" + index + "].rawCtype"] = $v.attr("data-rawCtype");
                    _option["salesItems[" + index + "].rawCvalue"] = $v.attr("data-rawCvalue");
                    _option["salesItems[" + index + "].ctype"] = $v.attr("data-rawCtype");
                    _option["salesItems[" + index + "].cvalue"] = $v.attr("data-rawCvalue");
                    _option["salesItems[" + index + "].priceType"] = $v.attr("data-priceType");
                    index+=1;
                }

            });
            if(flgs){
                com.post(api.inventory.addSales, _option, function (data) {

                    com.showAlert(com.info, "补单成功");

                    com.focusPage('.order_inputinfo').val(null);
                    sales.items.salesItemList.find("input[name='inputNumber']").val("");
                    
                    com.cleanTypeahead("salesmanName");
                    com.cleanTypeahead("instorer");
                    com.cleanTypeahead("guider");

                    sales.items.brands.removeAttr('data-brand');
                });
            }else {
                com.showAlert(com.warning, "请填写正确的补单数量")
            }
        }
    });

    //检查主材品牌 订单号 主材导购 主材驻店
    function submitCheck() {

        var flag = true;

        var $_brand = sales.items.brands;

        var _brand = "";
        if ($_brand.attr('data-brand')) {
            _brand = $_brand.attr('data-brand').split('-')[0];
            _brand = _brand.trim();//金意陶
        }

        //判断品牌差异
        var $_lis = com.focusPage('.list-group-item');
        $.each($_lis, function (i, v) {
            var $v = $(v);
            if (_brand != $v.find('.b_brand').text().trim()) {
                $v.css("border", "solid red 2px");
                var r = i + 1;
                com.showAlert(com.warning, "销售项第" + r + "项中品牌与主材品牌不符,请检查");
                flag = false;
            }
        });
        return flag;
    }

    com.post(api.inventory.querySalesBySid, {
        "sales.sid": sales.sid
    }, function (res) {
        sales.items.SupplementOrderId.val(res.sales.orderId);
        sales.items.customerName.val(res.sales.customer.name);
        sales.items.brands.attr({'data-brand': res.sales.brand,'data-category':res.sales.category}).val(res.sales.brand+'-'+res.sales.category);
        sales.items.orderAddr.val(res.sales.house.village.name + " " + res.sales.house.houseNumber);
    }, null, false);

    var option = {};
    option["decoration.orderId"] = sales.items.SupplementOrderId.val();

    com.post(sales.queryDecorationByOrderIdUrl, {"decoration.orderId":sales.items.SupplementOrderId.val()}, function (data) {
        //公司
        sales.salePostData["sales.dompanys"] = data.decoration.dompany;
        //客户Id
        sales.cid = data.decoration.customer.cid;
        //楼盘id
        sales.salePostData["sales.house.hid"] = data.decoration.house.hid;
    },null, false);

});