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
        items: {
            goodsName : com.focusPage('#goodsName'),
            goodsNo : com.focusPage('#goodsNo'),
            category : com.focusPage('#category'),
            brand : com.focusPage('#brand'),
            measurementUnit : com.focusPage('#measurementUnit'),

            purchase : com.focusPage('#purchase'),//售价
            discount : com.focusPage('#discount'),//折扣
            disPrice : com.focusPage('#disPrice'),//折扣价
            postDis : com.focusPage('#postDis'),//折让
            selling : com.focusPage('#selling'),//折让价
            num : com.focusPage('#num'),//数量
            total : com.focusPage('#total'),//总价
            totals : com.focusPage('#totals'),//总额

            color : com.focusPage('#color'),//颜色
            format : com.focusPage('#format'),//规格
            remark : com.focusPage('#remark'),

            left : com.focusPage('#left'),

            orderId : com.focusPage('#orderId'),//订单号
            customerName : com.focusPage("#customerName"),//客户姓名
            salesmanName : com.focusPage("#salesmanName"),//渠道
            orderAddr : com.focusPage("#orderAddr"),//楼盘地址
            couponInfo : com.focusPage("#couponInfo"),//券信息
            coupon : com.focusPage('#coupon'),//券值
            comment : com.focusPage('#comment'),//备注
            maling : com.focusPage('#maling')//抹零

        },
        btns:{
            submit : com.focusPage('#submit'),//提交
            refresh : com.focusPage('#refresh')//重置
        },
        leftInput:{
            left : com.focusPage('#left').find('input')
        },

        gids: null,
        gtype: null,
        colorids: null,
        formatids: null,
        cid: null,
        salesmanid: null,
        flag: false,
        salePostData: {},
        brandData:{}
    };

    com.initTypeahead('goodsName', api.inventory.queryGoodsByName, "goods.name", {}, 'goodes', 'gid', 'name',function (list, k, v) {
        com.cleanItems(sales.leftInput);
        sales.items.left.find('select').empty();
        //查询商品信息
        sales.gids = k;

        $.each(list, function (index, val) {
            if (val.gid == k) {
                sales.gtype = val.type;
                sales.items.goodsName.attr('data-name', val.name);
                sales.items.goodsNo.attr('data-no',val.no).val(val.no);
                sales.items.category.attr('data-category', val.category).val(val.category);
                sales.items.brand.attr('data-brand', val.brand).val(val.brand);
                sales.items.measurementUnit.attr('data-measurementUnit', val.measurementUnit).val(val.measurementUnit);
            }
        });
        //赋值售价信息
        com.post(api.inventory.queryPriceByGid, {"price.gid": k}, function (priceData) {
            if (priceData.prices.length != 0) {

                sales.items.purchase.bindData(priceData.prices, "pid", "content",false,null,"selling");
                var pid = sales.items.purchase.val();
                com.post(api.inventory.queryPriceByPid, {"price.pid": pid}, function (data) {
                    com.focusPage('#bid').attr({'data-ctype': data.price.ctype, "data-cvalue": data.price.cvalue, "data-priceType": data.price.type}).val(data.price.purchase);
                });
                sales.items.discount.val(1);
                sales.items.disPrice.val(utils.accMul(parseFloat(sales.items.purchase.find('option:selected').attr('other')), parseFloat(sales.items.discount.val())));
                sales.items.postDis.val(1);
                sales.items.selling.val(utils.accMul(parseFloat(sales.items.disPrice.val()), parseFloat(sales.items.postDis.val())));
                sales.items.num.val(1);
                sales.items.total.val(utils.accMul(parseFloat(sales.items.selling.val()), parseFloat(sales.items.num.val())));
                sales.flag = true;
            } else {
                sales.flag = false;
                com.showAlert(com.warning, "该商品暂无价格信息,请录入");
            }
        }, function () {
            com.showAlert(com.error, "获取售价信息失败");
        });
        //赋值颜色信息
        com.post(api.inventory.queryColorForEnableByGid, {"color.gid": k}, function (colorData) {
            if (colorData.colors.length != 0) {
                sales.items.color.bindData(colorData.colors, "cid", "name");
                sales.colorids = sales.items.color.find('option:selected').val();
                sales.flag = true;
            } else {
                sales.flag = false;
                com.showAlert(com.warning, "该商品暂无颜色信息,请录入");
            }
        }, function () {
            com.showAlert(com.error, "获取颜色信息失败");
        });
        //赋值规格信息
        com.post(api.inventory.queryFormatForEnableByGid, {"format.gid": k}, function (formatData) {
            if (formatData.formats.length != 0) {
                sales.items.format.bindData(formatData.formats, "fid", "info");
                sales.formatids = sales.items.format.find('option:selected').val();
                sales.flag = true;
            } else {
                sales.flag = false;
                com.showAlert(com.warning, "该商品暂无规格信息,请录入");
            }
        }, function () {
            com.showAlert(com.error, "获取规格信息失败");
        });
        return v;
});
    com.initTypeahead('salesmanName', api.personel.queryUserByPinyin, "pinyinName", {"user.status":0,"departmentType.name":""}, 'autoFillKeyValue', 'key', 'value',null);
    com.initTypeahead('instorer', api.personel.queryUserByPinyin, "pinyinName", {"user.status":0,"departmentType.name":""}, 'autoFillKeyValue', 'key', 'value',null);
    com.initTypeahead('guider', api.personel.queryUserByPinyin, "pinyinName", {"user.status":0,"departmentType.name":""}, 'autoFillKeyValue', 'key', 'value',null);
    com.initTypeahead('brands', api.data.queryBrandForPinYinNameAname, "pinyinName", {}, 'brands', 'no', 'alias',function (list, k, v) {
        $.each(list, function (index, val){
            keyVal = val["no"];
            valVal= [val["alias"]];
            valVal.push(val["bid"]);
            sales.brandData[keyVal] = valVal
        });
        return v
    });

    //颜色和规格改变取ID
    sales.items.color.on("change", function () {
        sales.colorids = sales.items.color.find('option:selected').val();
    });
    sales.items.format.on("change", function () {
        sales.formatids = sales.items.format.find('option:selected').val();
    });
    sales.items.purchase.on("change", function () {
        com.post(api.inventory.queryPriceByPid, {
            "price.pid": sales.items.purchase.val()
        }, function (data) {
            com.focusPage('#bid').attr({'data-ctype': data.price.ctype, "data-cvalue": data.price.cvalue, "data-priceType": data.price.type}).val(data.price.purchase);
        });
    });

    //绑定券信息
    com.post(api.ds.payment, {}, function (res) {
        sales.items.couponInfo.bindData(res.materialCouponTypes, 'key', 'value', false);
    }, null, false);
    
    //点击添加按钮
    com.focusPage("#add").click(function () {
        /*
         表单校验
         */
        if (com.validate('left', 'bottom') == false && sales.flag == true) {
            //折让价
            var $selling = parseFloat(sales.items.selling.val());
            //折扣价
            var $disPrice = parseFloat(sales.items.disPrice.val());
            //售价
            var $purchase = parseFloat(com.focusPage('#purchase option:selected').attr("other"));
            //折扣
            var $discount = parseFloat(sales.items.discount.val());

            var $otherStatus = 0;

            if ($selling != $disPrice) {
                $otherStatus = 1;
            }

            var $liList = $('<li></li>').addClass('list-group-item').attr({
                'data-discount': $discount,
                'data-selling': $selling,
                'data-purchase': $purchase,
                'data-disPrice': $disPrice,
                'data-postDis': sales.items.postDis.val(),
                'data-otherStatus': $otherStatus
            });

            var $h4 = $('<h4></h4>').html(sales.items.goodsName.attr('data-name') + ' ' + sales.items.goodsNo.attr('data-no')).attr('addData', sales.gids);

            var $delete = $('<div></div>').addClass('pull-right action-button').append($('<a></a>').addClass('btn btn-danger btn-minier').html('删除'));
            var $edit = $('<div></div>').css('margin-right', '5px').addClass('pull-right action-button').append($('<a></a>').addClass('btn btn-primary btn-minier').html('查看')).click(function () {
                //查看套餐弹窗
                com.focusPage('#viewPopUp').attr({'data-gid': $h4.attr('addData')});
                com.popup4page("#viewPopUp", "views/sales/salesItem4package.html", "查看套餐", "", function () {
                    com.focusPage('#viewPopUp').attr('data-gid', null);
                });
            });

            $h4.append($delete).appendTo($liList);
            
            if (sales.gtype == 1) {
                $h4.append($edit);
            }

            var currentPriceType = com.focusPage('#bid').attr('data-priceType');

            var propertyArr = [
                ['品类：', 's_category', sales.items.category.val(), " ", 'b_category', null],
                ['品牌：', 's_brand', sales.items.brand.val(), " ", 'b_brand', null],
                ['单位：', 's_unit', sales.items.measurementUnit.val(), " ", 'b_unit', null],
                ['颜色：', 's_color', sales.items.color.find("option:selected").text(), " ", 'b_color', sales.colorids],
                ['规格：', 's_format', sales.items.format.find("option:selected").text(), " ", 'b_format', sales.formatids],
                ['售价：', 's_selling', sales.items.purchase.find("option:selected").attr("other"), 'blue', 'b_selling', null],
                ['折扣价：', 's_countSelling', sales.items.disPrice.val(), 'blue', 'b_countSelling', null],
                ['折让价：', 's_price', sales.items.selling.val(), 'blue', 'b_price', null],
                ['数量：', 's_number', sales.items.num.val(), 'red', 'b_number'],
                ['总价：', 's_total', sales.items.total.val(), 'blue', 'b_total', null],
                ['备注：', 's_remark', sales.items.remark.val(), " ", 'b_remark', null]
            ];
            $.each(propertyArr, function (index, value) {

                var $span = $('<span></span>').addClass(value[1]);
                var $b = $('<b></b>');
                if (value[0] != null) {
                    $span.html(value[0]);
                }
                if (value[2] != null) {
                    $b.html(value[2]);
                }
                if (value[3] != null) {
                    $b.addClass(value[3] + " " + value[4]).attr('addData', value[5]);
                }
                $span.append($b);
                $liList.append($span);
            });
            $liList.append($('<span></span>').css('display', 'none').text(com.focusPage('#bid').val()).attr("id", "invisiblePurchase"))
                .append($('<span></span>').css('display', 'none').text(com.focusPage('#bid').attr('data-ctype')).attr("id", "invisibleCtype"))
                .append($('<span></span>').css('display', 'none').text(com.focusPage('#bid').attr('data-cvalue')).attr("id", "invisibleCvalue"))
                .append($('<span></span>').css('display', 'none').text(currentPriceType).attr("id", "invisiblePriceType"));
            com.focusPage('#salesItemList').append($liList);

            //清空左侧
            com.cleanItems(sales.leftInput);
            sales.items.left.find('select').empty();
            sales.items.goodsName.removeAttr('data-name');
            sales.items.category.removeAttr('data-category');
            sales.items.brand.removeAttr('data-brand');
            sales.items.measurementUnit.removeAttr('data-measurementUnit');
            /*
             点击删除移除数据
             */
            $delete.click(function () {
                var $this = $(this);
                var $totals = sales.items.totals;
                //li标签
                var $liParent = $this.parents('.list-group-item');
                //取到当前Li的总价
                var deleteNum = $liParent.find('.b_total').text();
                var totalNum = parseFloat(utils.accSub($totals.val(), deleteNum));
                $totals.val(totalNum);
                $liParent.remove();
                com.focusPage('.list-group-item:last').css("border-bottom", "solid 1px");
            });

            sales.items.totals.val(cycTotal());

        } else if (sales.flag == false) {
            com.showAlert(com.warning, "商品信息不完善,请先完善商品信息");
        }
    });

    sales.items.purchase.on("change", function () {
        count(true, true);
    });
    sales.items.disPrice.on("change", function () {
        count(true, false);
    });
    sales.items.postDis.on("change", function () {
        count(true, false);
    });
    sales.items.num.on("change", function () {
        count(false, true);
    });
    sales.items.selling.on("change", function () {
        count(false, true);
    });

    function count(flag, boolean) {
        if (flag == true && boolean == true) {
            sales.items.disPrice.val(utils.changeThrDecimal(utils.accMul(parseFloat(sales.items.purchase.find('option:selected').attr("other")), parseFloat(sales.items.discount.val()))));
            sales.items.selling.val(utils.changeThrDecimal(utils.accMul(parseFloat(sales.items.disPrice.val()), parseFloat(sales.items.postDis.val()))));
            sales.items.total.val(utils.changeThrDecimal(utils.accMul(parseFloat(sales.items.selling.val()), parseFloat(sales.items.num.val()))));
        } else if (flag == true && boolean == false) {
            sales.items.selling.val(utils.changeThrDecimal(utils.accMul(parseFloat(sales.items.disPrice.val()), parseFloat(sales.items.postDis.val()))));
            sales.items.total.val(utils.changeThrDecimal(utils.accMul(parseFloat(sales.items.selling.val()), parseFloat(sales.items.num.val()))));
        } else if (flag == false && boolean == true) {
            sales.items.total.val(utils.changeThrDecimal(utils.accMul(parseFloat(sales.items.selling.val()), parseFloat(sales.items.num.val()))));
            sales.items.postDis.val(utils.changeThrDecimal((utils.accDiv(parseFloat(sales.items.selling.val()), parseFloat(sales.items.disPrice.val()))).toFixed(2)));
        }
    }

    function cycTotal() {

        var _total = 0;

        var $li = com.focusPage('.list-group-item');

        $li.length && $li.each(function (i, v) {
            var $this = $(v);
            _total = utils.accAdd(_total, parseFloat($this.find('.b_total').text()));
        });

        return _total;
    }
    
    sales.items.orderId.on("change", function () {

        var option = {
            "decoration.orderId" : sales.items.orderId.val()
        };

        com.post(sales.queryDecorationByOrderIdUrl, option, function (data) {
            sales.items.customerName.val(data.decoration.customer.name);
            sales.items.salesmanName.removeAttr('data-typeahead-key').val(data.decoration.designer.currentName);
            sales.items.orderAddr.val(data.decoration.house.village.name + " " + data.decoration.house.houseNumber);

            if (sales.items.customerName.val() != "") {
                sales.items.customerName.next().remove();
            }
            if (sales.items.salesmanName.val() != "") {
                sales.items.salesmanName.next().remove();
            }
            if (sales.items.orderAddr.val() != "") {
                sales.items.orderAddr.next().remove();
            }
            
            sales.cid = data.decoration.customer.cid;
            sales.salesmanid = data.decoration.designer.userId;
            sales.salePostData["sales.house.hid"] = data.decoration.house.hid;
            sales.salePostData["sales.dompanys"] = data.decoration.dompany;

        }, function (e) {
            com.showAlert(com.warning, "未查询到此订单!");
            sales.items.customerName.val(null);
            sales.items.salesmanName.val(null);
            sales.items.orderAddr.val(null);
        });
    });

    //重置按钮
    sales.btns.refresh.click(function () {
        com.cleanItems(sales.leftInput);
        sales.items.left.find('select').empty();
    });

    // 销售单区 提交
    sales.btns.submit.click(function () {

        var _option = {};

        if (com.validate('searchInfo', 'bottom') == false) {

            if (submitCheck() == false) {
                return;
            }

            _option = {
                "sales.orderId": sales.items.orderId.val(),
                "sales.customer.cid": sales.cid,
                "sales.guider.userId": com.typeahead("guider"),
                "sales.instorer.userId": com.typeahead("instorer"),
                "sales.bid": sales.brandData[com.typeahead("brands")][1],
                "sales.coupon": sales.items.coupon.val() != "" ? parseFloat(sales.items.coupon.val()) : 0,
                "sales.comment": sales.items.comment.val(),
                "sales.maling": sales.items.maling.val() != "" ? parseFloat(sales.items.maling.val()) : 0,
                "sales.total": isNaN(parseFloat(sales.items.totals.val())) ? 0 : parseFloat(sales.items.totals.val()),
                "sales.house.hid": sales.salePostData["sales.house.hid"],
                "sales.dompanys": sales.salePostData["sales.dompanys"]
            };

            //客户id
            if (com.typeahead("salesmanName")) {
                _option["sales.salesman.userId"] = com.typeahead("salesmanName");
            } else {
                _option["sales.salesman.userId"] = sales.salesmanid;
            }

            if (sales.items.coupon.val() == "" || sales.items.coupon.val() == 0) {
                _option["sales.couponInfo"] = " ";
            } else {
                _option["sales.couponInfo"] = '#' + sales.items.couponInfo.val() + ':' + sales.items.coupon.val() + '#';
            }

            //折让审批
            var $lis = com.focusPage('.list-group-item');
            var $otherStatus = 0;
            $lis && $lis.length && $.each($lis, function (i, v) {
                var $v = $(v);
                var $status = $v.attr('data-otherStatus');
                if ($status == 1) {
                    $otherStatus = 1;
                }
            });

            _option["sales.otherStatus"] = $otherStatus;

            $lis && $lis.length && $.each($lis, function (i, v) {

                var $v = $(v);

                _option["salesItems[" + i + "].goods.gid"] = $v.find('h4').attr('adddata');
                _option["salesItems[" + i + "].color.cid"] = $v.find('.b_color').attr('adddata');
                _option["salesItems[" + i + "].format.fid"] = $v.find('.b_format').attr('adddata');
                _option["salesItems[" + i + "].purchase"] = parseFloat($v.find("#invisiblePurchase").text());
                _option["salesItems[" + i + "].selling"] = parseFloat($v.find('.b_selling').text());
                _option["salesItems[" + i + "].discount"] = parseFloat($v.attr('data-discount'));
                _option["salesItems[" + i + "].disPrice"] = parseFloat($v.find('.b_countSelling').text());
                _option["salesItems[" + i + "].postDis"] = parseFloat($v.attr('data-postDis'));
                _option["salesItems[" + i + "].price"] = parseFloat($v.find('.b_price').text());
                _option["salesItems[" + i + "].num"] = parseFloat($v.find('.b_number').text());
                _option["salesItems[" + i + "].total"] = parseFloat($v.find('.b_total').text());
                _option["salesItems[" + i + "].comment"] = $v.find('.b_remark').text();
                _option["salesItems[" + i + "].rawCtype"] = $v.find("#invisibleCtype").text();
                _option["salesItems[" + i + "].rawCvalue"] = $v.find("#invisibleCvalue").text();
                _option["salesItems[" + i + "].ctype"] = $v.find("#invisibleCtype").text();
                _option["salesItems[" + i + "].cvalue"] = $v.find("#invisibleCvalue").text();
                _option["salesItems[" + i + "].priceType"] = $v.find("#invisiblePriceType").text();
            });

            com.post(api.inventory.addSales, _option, function (data) {
                com.showAlert(com.info, "添加成功");
                com.focusPage('#salesItemList').empty();
                com.focusPage('.order_inputinfo').val(null);
                com.cleanTypeahead('salesmanName');
                com.cleanTypeahead('instorer');
                com.cleanTypeahead('guider');
                com.cleanTypeahead('brands');
            }, function (e) {
                com.showAlert(com.error, "添加失败");
            });
        }
    });

    function submitCheck() {

        var flag = true;
        var _brand = "";

        if (com.typeahead("brands")) {
            _brand = sales.brandData[com.typeahead("brands")][0].split('-')[0];
            _brand = _brand.trim();
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

    cancelProp();

    function cancelProp() {

        var $inputs = com.focusPage('input', '#left');
        var $inputss = com.focusPage('input', '#searchInfo').focus(function cls() {
            com.focusPage('input', '#searchInfo').text("");
        });
        $.each($inputs, function (i, v) {
            $(this).focus(function () {
                var $div = $(this).parent().find('.popover');
                if ($div) {
                    $div.remove();
                }
            });
        });
        $.each($inputss, function (i, v) {
            $(this).focus(function () {
                var $div = $(this).parent().find('.popover');
                if ($div) {
                    $div.remove();
                }
            });
        });
    }
});