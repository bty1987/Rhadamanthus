jQuery(function() {

    var sales = {

        leftitems: {
            goods: com.focusPage('#goods'),
            goodsNo: com.focusPage('#goodsNo'),
            category: com.focusPage('#category'),
            brand: com.focusPage('#brand'),
            measurementUnit: com.focusPage('#measurementUnit'),

            purchase: com.focusPage('#purchase'),// 售价
            discount: com.focusPage('#discount'),// 折扣
            disPrice: com.focusPage('#disPrice'),// 折扣价
            postDis: com.focusPage('#postDis'),// 折让
            selling: com.focusPage('#selling'),// 折让价
            num: com.focusPage('#num'),// 数量
            total: com.focusPage('#total'),// 总价

            color: com.focusPage('#color'),// 颜色
            format: com.focusPage('#format'),// 规格
            remark: com.focusPage('#remark')
        },
        rightitems: {
            orderId: com.focusPage('#orderId'), // 订单号
            customer: com.focusPage("#customer"), // 客户姓名
            salesman: com.focusPage("#salesman"), // 渠道
            instorer: com.focusPage("#instorer"),
            guider: com.focusPage("#guider"),
            brands: com.focusPage("#brands"),
            orderAddr: com.focusPage("#orderAddr"), // 楼盘地址
            couponInfo: com.focusPage("#couponInfo"), // 券信息
            coupon: com.focusPage('#coupon'), // 券值
            comment: com.focusPage('#comment'), // 备注
            maling: com.focusPage('#maling'), // 抹零
            totals: com.focusPage('#totals'), // 总额
            bComment: com.focusPage('#bComment'), // 品牌备注
            supplier: com.focusPage('#supplier'), // 厂商
            type: com.focusPage('#type'), // 类型
        },
        items: {
            left: com.focusPage('#left')
        },
        btns: {
            submit: com.focusPage('#submit'), // 提交
            refresh: com.focusPage('#refresh'), // 重置

        },
        model: {
            packageModel: com.focusPage('#itemModel')
        },
        goods: null,
        brand: null,
        customer: null,
        salesman: null,
        house: null,
        dompany: null,
        bid: null,
        suppliers: [],

        pageType: params['urlLoadParams'].type,
    };

    com.initTypeahead('goods', api.data.queryGoodsByName, "goods.name", {}, 'goodes', 'gid', 'name', function(list, k, v) {

        com.cleanItems(sales.leftitems);
        sales.items.left.find('select').empty();

        $.each(list, function(index, val) {

            if (val.gid == k) {

                fillLeftItem(val);
            }
        });

        return v;
    });

    if (sales.pageType == "profit")
        com.focusPage("#typeGroup").addClass("hide");

    sales.rightitems.type.bindData(constant.sales().sales.type.datas, "key", "value");

    com.initTypeahead('salesman', api.personel.queryUserByPinyin, "pinyinName", {
        "user.status": 0,
        "departmentType.name": ""
    }, 'autoFillKeyValue', 'key', 'value', null);
    com.initTypeahead('instorer', api.personel.queryUserByPinyin, "pinyinName", {
        "user.status": 0,
        "departmentType.name": ""
    }, 'autoFillKeyValue', 'key', 'value', null);
    com.initTypeahead('guider', api.personel.queryUserByPinyin, "pinyinName", {
        "user.status": 0,
        "departmentType.name": ""
    }, 'autoFillKeyValue', 'key', 'value', null);
    com.initTypeahead('brands', api.data.queryBrandByPinyin, "brand.pinyin", {
        "brand.atttype": 0
    }, 'brands', 'no', 'name', function(list, k, v) {

        $.each(list, function(index, val) {

            if (val['no'] == k) {

                sales.brand = val;

                sales.rightitems.bComment.val(val.comment);
                supplier(val)

            }
        });
        return v
    });

    com.post(api.ds.sales, {
        "category.isCoupon": 0
    }, function(res) {

        sales.rightitems.couponInfo.bindData(res.coupons, 'key', 'value', false);
    });

    com.focusPage('#itemModel').on('hidden.bs.modal', function(e) {

        com.focusPage('#itemList').html("");
    });

    // 点击添加按钮
    com.focusPage("#add").click(function() {

        if (com.validate('left', 'bottom'))
            return false;

        var price = {};

        com.post(api.data.queryPriceByPid, {
            "price.pid": sales.leftitems.purchase.val()
        }, function(data) {

            price = data.price;
        }, null, false);

        var goods = sales.leftitems.goods.val();
        var goodsNo = sales.leftitems.goodsNo.val();

        var $confine = price.confine;

        var $selling = sales.leftitems.selling.val(); // 折让价
        var $disPrice = sales.leftitems.disPrice.val(); // 折扣价
        var $purchase = getControlPrice(price);
        var $discount = sales.leftitems.discount.val(); // 折扣
        var $num = sales.leftitems.num.val();
        var $total = sales.leftitems.total.val();

        var $otherStatus = $selling != $disPrice ? 1 : 0;

        if (price.ctype == 0 && parseFloat($disPrice) < parseFloat($purchase)) {
            com.showAlert(com.warning, "折扣价低于控价");
            return false;
        }

        if (price.ctype == 1 && price.confine != 0 && $disPrice > price.confine) {
            com.showAlert(com.warning, "折扣价高于限价");
            return false;
        }

        var $liList = $('<li></li>').addClass('list-group-item').attr({
            'data-discount': $discount,
            'data-selling': price.selling,// 售价
            'data-purchase': $purchase,
            'data-disPrice': $disPrice,
            'data-postDis': sales.leftitems.postDis.val(),
            'data-total': $total,
            'data-otherStatus': $otherStatus,
            'data-category': sales.leftitems.category.val(),
            'data-brand': sales.leftitems.brand.val(),
            'data-measurementUnit': sales.leftitems.measurementUnit.val(),
            'data-goods': com.typeahead("goods"),
            'data-color': sales.leftitems.color.val(),
            'data-format': sales.leftitems.format.val(),
            'data-num': sales.leftitems.num.val(),
            'data-comment': sales.leftitems.remark.val(),
            'data-ctype': price.ctype,
            'data-cvalue': price.cvalue,
            'data-priceType': price.type,
            'data-price': $selling
        });

        var $h4 = $('<h4></h4>').html(goods + ' ' + goodsNo).attr('addGid', sales.goods.gid);

        var $delete = $('<div></div>').addClass('pull-right action-button').append($('<a></a>').addClass('btn btn-danger btn-minier').html('删除')).click(function() {

            $(this).parents('.list-group-item').remove();
            cycTotal();
        });

        var $edit = $('<div></div>').css('margin-right', '5px').addClass('pull-right action-button').append($('<a></a>').addClass('btn btn-primary btn-minier').html('套餐')).click(function() {

            salesUtils.showPackage(sales.model.packageModel, com.focusPage('#itemList'), $h4.attr('addGid'));
        });

        $h4.append($delete).appendTo($liList);

        if (sales.goods.type == 1)
            $h4.append($edit);

        // 判断商品类型
        var goodsType = sales.goods.type == 1 ? '套餐' : '普通商品';

        var propertyArr = [['品类: ', sales.leftitems.category.val()], ['品牌: ', sales.leftitems.brand.val()], ['单位: ', sales.leftitems.measurementUnit.val()], ['颜色: ', sales.leftitems.color.find("option:selected").text()], ['规格: ', sales.leftitems.format.find("option:selected").text()], ['类型: ', goodsType, 'orange'], ['售价: ', price.selling, 'blue'], ['折扣价: ', $disPrice], ['折让价: ', $selling, 'blue'], ['数量: ', $num, 'red'], ['总价: ', $total, 'blue'], ['备注: ', sales.leftitems.remark.val()]];

        $.each(propertyArr, function(index, value) {

            var $span = $('<span></span>').addClass(value[1]);
            var $b = $('<b></b>');

            if (value[0] != null)
                $span.html(value[0]);
            if (value[1] != null)
                $b.html(value[1]);
            if (value[2] != null)
                $b.addClass(value[2]);

            $span.append($b);
            $liList.append($span);
        });

        com.focusPage('#salesItemList').append($liList);

        // 清空左侧
        sales.items.left.find('select').empty();
        com.cleanItems(sales.leftitems);

        cycTotal();
    });

    sales.leftitems.purchase.on("change", function() {

        count(true, true);
    });
    sales.leftitems.disPrice.on("change", function() {

        count(true, false);
    });
    sales.leftitems.postDis.on("change", function() {

        count(true, false);
    });
    sales.leftitems.num.on("change", function() {

        count(false, true);
    });
    sales.leftitems.selling.on("change", function() {

        count(false, true);
    });

    sales.rightitems.orderId.on("change", function() {

        var option = {
            "decoration.orderId": sales.rightitems.orderId.val()
        };

        com.post(api.decoration.queryDecorationForCommonByOrderId, option, function(data) {

            sales.rightitems.customer.val(data.decoration.customer.name);
            sales.rightitems.orderAddr.val(data.decoration.house.village.name + " " + data.decoration.house.houseNumber);
            com.updateTypeahead("salesman", data.decoration.designer.userId, data.decoration.designer.currentName);
            sales.customer = data.decoration.customer;
            sales.salesman = data.decoration.designer;
            sales.house = data.decoration.house;
            sales.dompany = data.decoration.dompany;

        }, function(e) {

            com.showAlert(com.warning, "未查询到此订单!");
            sales.rightitems.customer.val("");
            sales.rightitems.orderAddr.val("");
            com.cleanTypeahead("salesman");
        });
    });

    // 重置按钮
    sales.btns.refresh.click(function() {

        com.cleanItems(sales.leftitems);
        sales.items.left.find('select').empty();
    });

    // 销售单区 提交
    sales.btns.submit.click(function() {

        if (com.validate('searchInfo', 'bottom'))
            return false;

        if (checkBrand() == false)
            return false;

        var popup = com.focusPage("#sales2create");
        var mask = com.mask(popup, popup);

        var options = {
            "sales.orderId": sales.rightitems.orderId.val(),
            "sales.salesman.userId": com.typeahead("salesman"),
            "sales.customer.cid": sales.customer.cid,
            "sales.guider.userId": com.typeahead("guider"),
            "sales.instorer.userId": com.typeahead("instorer"),
            "sales.brand.bid": sales.brand.bid,
            "sales.coupon": sales.rightitems.coupon.val(),
            "sales.couponInfo": '#' + sales.rightitems.couponInfo.val() + ':' + sales.rightitems.coupon.val() + '#',
            "sales.comment": sales.rightitems.comment.val(),
            "sales.maling": sales.rightitems.maling.val(),
            "sales.total": sales.rightitems.totals.val(),
            "sales.house.hid": sales.house.hid,
            "sales.dompanys": sales.dompany,
            "sales.otherStatus": com.focusPage("[data-otherStatus=1]").length > 0 ? 1 : 0,
            "sales.supplier.userId": sales.rightitems.supplier.val(),
        };

        if (sales.pageType == "profit") {
            options["sales.grade"] = "A";
        } else {
            options["sales.grade"] = "B";
            options["sales.type"] = sales.rightitems.type.val();
        }

        var $lis = com.focusPage('.list-group-item');

        var total = 0;

        $lis && $lis.length && $.each($lis, function(i, v) {

            var $v = $(v);
            var data = $v.data();

            options["salesItems[" + i + "].goods.gid"] = data.goods;
            options["salesItems[" + i + "].color.cid"] = data.color;
            options["salesItems[" + i + "].format.fid"] = data.format;
            options["salesItems[" + i + "].purchase"] = data.purchase;
            options["salesItems[" + i + "].selling"] = data.selling;
            options["salesItems[" + i + "].discount"] = data.discount;
            options["salesItems[" + i + "].disPrice"] = data.disprice;
            options["salesItems[" + i + "].postDis"] = data.postdis;
            options["salesItems[" + i + "].price"] = data.price;// 折让价
            options["salesItems[" + i + "].num"] = data.num;
            options["salesItems[" + i + "].total"] = data.total;
            options["salesItems[" + i + "].comment"] = data.comment;
            options["salesItems[" + i + "].rawCtype"] = data.ctype;
            options["salesItems[" + i + "].rawCvalue"] = data.cvalue;
            options["salesItems[" + i + "].ctype"] = data.ctype;
            options["salesItems[" + i + "].cvalue"] = data.cvalue;
            options["salesItems[" + i + "].priceType"] = data.pricetype;

            total = utils.changeThrDecimal(utils.accAdd(total, data.total));
        });

        if (total != sales.rightitems.totals.val()) {
            com.showAlert(com.error, "销售单总额不匹配");

            return false;
        }
        com.post(api.sales.addSales, options, function() {

            com.showAlert(com.info, "添加成功");

            com.focusPage('#salesItemList').empty();
            sales.items.left.find('select').empty();

            com.cleanItems(sales.leftitems);
            com.cleanItems(sales.rightitems);
            sales.rightitems.coupon.val(0);
            sales.rightitems.maling.val(0);
            sales.rightitems.totals.val(0);
        });

        setTimeout(function() {

            com.closeMask(mask, popup);
        }, 800);
    });

    function count(flag, boolean) {

        if (flag == true && boolean == true) {
            sales.leftitems.disPrice.val(utils.changeThrDecimal(utils.accMul(parseFloat(sales.leftitems.purchase.find('option:selected').attr("other")), parseFloat(sales.leftitems.discount.val()))));
            sales.leftitems.selling.val(utils.changeThrDecimal(utils.accMul(parseFloat(sales.leftitems.disPrice.val()), parseFloat(sales.leftitems.postDis.val()))));
            sales.leftitems.total.val(utils.changeThrDecimal(utils.accMul(parseFloat(sales.leftitems.selling.val()), parseFloat(sales.leftitems.num.val()))));
        } else if (flag == true && boolean == false) {
            sales.leftitems.selling.val(utils.changeThrDecimal(utils.accMul(parseFloat(sales.leftitems.disPrice.val()), parseFloat(sales.leftitems.postDis.val()))));
            sales.leftitems.total.val(utils.changeThrDecimal(utils.accMul(parseFloat(sales.leftitems.selling.val()), parseFloat(sales.leftitems.num.val()))));
        } else if (flag == false && boolean == true) {
            sales.leftitems.total.val(utils.changeThrDecimal(utils.accMul(parseFloat(sales.leftitems.selling.val()), parseFloat(sales.leftitems.num.val()))));
            sales.leftitems.postDis.val(utils.changeThrDecimal((utils.accDiv(parseFloat(sales.leftitems.selling.val()), parseFloat(sales.leftitems.disPrice.val()))).toFixed(2)));
        }
    }

    function getControlPrice(price) {

        var purchase = parseFloat(price.purchase);

        if (purchase > 0 && purchase < 1) {
            return utils.changeThrDecimal(utils.accMul(parseFloat(price.selling), utils.accAdd(1, purchase)));
        }

        return price.purchase;
    }

    function cycTotal() {

        var _total = 0;
        var $li = com.focusPage('.list-group-item');

        $li.length && $li.each(function(i, v) {

            var $v = $(v);
            var data = $v.data();
            _total = utils.changeThrDecimal(utils.accAdd(_total, data.total));
        });
        sales.rightitems.totals.val(_total);
    }

    // 判断品牌差异
    function checkBrand() {

        var $list = com.focusPage('.list-group-item');

        for ( var i = 0; i < $list.length; i++) {
            var $v = $($list[i]);

            var data = $v.data();
            var brand = data.brand;

            if (sales.brand.name != brand) {
                com.showAlert(com.warning, "销售项第" + (i + 1) + "项中品牌与主材品牌不符,请检查");
                return false;
            }
        }
        return true;
    }

    function fillLeftItem(v) {

        if (!v)
            return false;

        sales.goods = v;
        sales.bid = v.bid;
        sales.leftitems.goodsNo.val(v.no);
        sales.leftitems.category.val(v.category);
        sales.leftitems.brand.val(v.brand);
        sales.leftitems.measurementUnit.val(v.measurementUnit);

        // 赋值售价信息
        com.post(api.data.queryPriceByGid, {
            "price.gid": v.gid
        }, function(res) {

            if (res.prices.length != 0) {

                $.each(res.prices, function(key, value) {

                    value.name = value.selling + " " + value.name;
                });

                sales.leftitems.purchase.bindData(res.prices, "pid", "name", false, null, "selling");

                var price = res.prices[0];
                sales.leftitems.discount.val(1);
                sales.leftitems.disPrice.val(price.selling);
                sales.leftitems.postDis.val(1);
                sales.leftitems.selling.val(price.selling);
                sales.leftitems.num.val(1);
                sales.leftitems.total.val(price.selling);
            } else {
                com.showAlert(com.warning, "该商品暂无价格信息,请录入");
            }
        });

        // 赋值颜色信息
        com.post(api.data.queryColorForEnableByGid, {
            "color.gid": v.gid
        }, function(colorData) {

            if (colorData.colors.length != 0) {
                sales.leftitems.color.bindData(colorData.colors, "cid", "name");
            } else {
                com.showAlert(com.warning, "该商品暂无颜色信息,请录入");
            }
        });

        // 赋值规格信息
        com.post(api.data.queryFormatForEnableByGid, {
            "format.gid": v.gid
        }, function(formatData) {

            if (formatData.formats.length != 0) {
                sales.leftitems.format.bindData(formatData.formats, "fid", "info");
            } else {
                com.showAlert(com.warning, "该商品暂无规格信息,请录入");
            }
        });
    }

    function supplier(v) {

        com.post(api.communion.queryBrandSupplier, {
            "brandSupplier.brand.bid": v.bid

        }, function(res) {

            var suppliers = res.brandSuppliers;
            if (suppliers.length == 0) {
                return false;
            }

            $.each(suppliers, function(i, v) {

                sales.suppliers[i] = v.supplier
            });
        }, null, false);
        com.post(api.data.queryBrandByBid, {
            "brand.bid": v.bid
        }, function(res) {

            if (res.brand.supplier != null || res.brand.supplier != "") {
                $('<option selected="selected"></option>').attr("value", res.brand.supplier.userId).html(res.brand.supplier.currentName).appendTo(com.focusPage("#supplier"));

            }
        })
        sales.rightitems.supplier.bindData(sales.suppliers, "userId", "currentName");
    }

    com.focusPage('.select').dblclick(function(res) {

        com.popup4page("#layerPopUp", api.index.goods4condition.url, "商品", null, function() {

            if (!params.data.goods)
                return false;

            com.updateTypeahead('goods', params.data.goods.gid, params.data.goods.name);

            fillLeftItem(params.data.goods);
        });
    });

});
