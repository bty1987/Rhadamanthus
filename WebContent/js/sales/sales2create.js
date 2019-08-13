jQuery(function () {

    var sales = {
            
        leftitems: {
            goods: com.focusPage('#goods'),
            goodsNo: com.focusPage('#goodsNo'),
            category: com.focusPage('#category'),
            brand: com.focusPage('#brand'),
            measurementUnit: com.focusPage('#measurementUnit'),

            purchase: com.focusPage('#purchase'),//售价
            discount: com.focusPage('#discount'),//折扣
            disPrice: com.focusPage('#disPrice'),//折扣价
            postDis: com.focusPage('#postDis'),//折让
            selling: com.focusPage('#selling'),//折让价
            num: com.focusPage('#num'),//数量
            total: com.focusPage('#total'),//总价
            

            color: com.focusPage('#color'),//颜色
            format: com.focusPage('#format'),//规格
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
            totals: com.focusPage('#totals') // 总额
        },
        items: {
            left: com.focusPage('#left')
        },
        btns:{
            submit: com.focusPage('#submit'),//提交
            refresh: com.focusPage('#refresh')//重置
        },
        model:{
            packageModel: com.focusPage('#itemModel')
        },
        goods: null,
        brand: null,
        customer: null,
        salesman: null,
        house: null,
        dompany: null
    };

    com.initTypeahead('goods', api.inventory.queryGoodsByName, "goods.name", {}, 'goodes', 'gid', 'name',function (list, k, v) {
        
        com.cleanItems(sales.leftitems);
        sales.items.left.find('select').empty();

        $.each(list, function (index, val) {
            if (val.gid == k) {
                
                sales.goods = val;
                
                sales.leftitems.goodsNo.val(val.no);
                sales.leftitems.category.val(val.category);
                sales.leftitems.brand.val(val.brand);
                sales.leftitems.measurementUnit.val(val.measurementUnit);

                //赋值售价信息
                com.post(api.inventory.queryPriceByGid, {"price.gid": k}, function (res) {
                    if (res.prices.length != 0) {

                        sales.leftitems.purchase.bindData(res.prices, "pid", "content", false, null, "selling");
                        
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
                //赋值颜色信息
                com.post(api.inventory.queryColorForEnableByGid, {"color.gid": k}, function (colorData) {
                    if (colorData.colors.length != 0) {
                        sales.leftitems.color.bindData(colorData.colors, "cid", "name");
                    } else {
                        com.showAlert(com.warning, "该商品暂无颜色信息,请录入");
                    }
                });
                //赋值规格信息
                com.post(api.inventory.queryFormatForEnableByGid, {"format.gid": k}, function (formatData) {
                    if (formatData.formats.length != 0) {
                        sales.leftitems.format.bindData(formatData.formats, "fid", "info");
                    } else {
                        com.showAlert(com.warning, "该商品暂无规格信息,请录入");
                    }
                });
            }
        });
        
        return v;
    });

    com.initTypeahead('salesman', api.personel.queryUserByPinyin, "pinyinName", {"user.status":0,"departmentType.name":""}, 'autoFillKeyValue', 'key', 'value',null);
    com.initTypeahead('instorer', api.personel.queryUserByPinyin, "pinyinName", {"user.status":0,"departmentType.name":""}, 'autoFillKeyValue', 'key', 'value',null);
    com.initTypeahead('guider', api.personel.queryUserByPinyin, "pinyinName", {"user.status":0,"departmentType.name":""}, 'autoFillKeyValue', 'key', 'value',null);
    com.initTypeahead('brands', api.data.queryBrandForPinYinNameAname, "pinyinName", {}, 'brands', 'no', 'alias',function (list, k, v) {
        $.each(list, function (index, val){
            if(val['no'] == k){
                sales.brand  = val;
            }
        });
        return v
    });

    //绑定券信息
    com.post(api.ds.payment, {}, function (res) {
        sales.rightitems.couponInfo.bindData(res.materialCouponTypes, 'key', 'value', false);
    }, null, false);

    com.focusPage('#itemModel').on('hidden.bs.modal', function (e) {
        com.focusPage('#itemList').html("");
    });

    //点击添加按钮
    com.focusPage("#add").click(function () {
        
        if(com.validate('left', 'bottom')) return false;
        
        var price = {};
        
        com.post(api.inventory.queryPriceByPid, {"price.pid": sales.leftitems.purchase.val()}, function (data) {
            price = data.price;
        },null, false);
        
        var goods = sales.leftitems.goods.val();
        var goodsNo = sales.leftitems.goodsNo.val();
        
        var $purchase = price.purchase;
        var $selling = sales.leftitems.selling.val(); // 折让价
        var $disPrice = sales.leftitems.disPrice.val(); // 折扣价
        var $discount = sales.leftitems.discount.val(); // 折扣
        var $num = sales.leftitems.num.val();
        var $total = sales.leftitems.total.val();
        
        var $otherStatus = $selling != $disPrice ? 1 : 0;
        
        var $liList = $('<li></li>').addClass('list-group-item').attr({
            'data-discount': $discount,
            'data-selling': $selling,
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
            'data-priceType': price.type
        });

        var $h4 = $('<h4></h4>').html(goods + ' ' + goodsNo).attr('addGid', sales.goods.gid);

        var $delete = $('<div></div>').addClass('pull-right action-button').append($('<a></a>').addClass('btn btn-danger btn-minier').html('删除')).click(function(){
            $(this).parents('.list-group-item').remove();
            cycTotal();
        });
        
        var $edit = $('<div></div>').css('margin-right', '5px').addClass('pull-right action-button').append($('<a></a>').addClass('btn btn-primary btn-minier').html('查看')).click(function () {
            salesUtils.showPackage(sales.model.packageModel, com.focusPage('#itemList'), $h4.attr('addGid'));
        });

        $h4.append($delete).appendTo($liList);
        
        if (sales.goods.type == 1) $h4.append($edit);

        var propertyArr = [
            ['品类: ', sales.leftitems.category.val()],
            ['品牌: ', sales.leftitems.brand.val()],
            ['单位: ', sales.leftitems.measurementUnit.val()],
            ['颜色: ', sales.leftitems.color.find("option:selected").text()],
            ['规格: ', sales.leftitems.format.find("option:selected").text()],
            ['售价: ', $purchase, 'blue'],
            ['折扣价: ', $disPrice],
            ['折让价: ', $selling, 'blue'],
            ['数量: ', $num, 'red'],
            ['总价: ', $total, 'blue'],
            ['备注: ', sales.leftitems.remark.val()]
        ];

        $.each(propertyArr, function (index, value) {

            var $span = $('<span></span>').addClass(value[1]);
            var $b = $('<b></b>');
            
            if (value[0] != null) $span.html(value[0]);
            if (value[1] != null) $b.html(value[1]);
            if (value[2] != null) $b.addClass(value[2]);
            
            $span.append($b);
            $liList.append($span);
        });
        
        com.focusPage('#salesItemList').append($liList);
        
        //清空左侧
        sales.items.left.find('select').empty();
        com.cleanItems(sales.leftitems);

        cycTotal();
    });

    sales.leftitems.purchase.on("change", function () {
        count(true, true);
    });
    sales.leftitems.disPrice.on("change", function () {
        count(true, false);
    });
    sales.leftitems.postDis.on("change", function () {
        count(true, false);
    });
    sales.leftitems.num.on("change", function () {
        count(false, true);
    });
    sales.leftitems.selling.on("change", function () {
        count(false, true);
    });

    sales.rightitems.orderId.on("change", function () {

        var option = {
            "decoration.orderId": sales.rightitems.orderId.val()
        };

        com.post(api.decoration.queryDecorationForCommonByOrderId, option, function (data) {

            sales.rightitems.customer.val(data.decoration.customer.name);
            sales.rightitems.orderAddr.val(data.decoration.house.village.name + " " + data.decoration.house.houseNumber);
            com.updateTypeahead("salesman", data.decoration.designer.userId, data.decoration.designer.currentName);
            sales.customer = data.decoration.customer;
            sales.salesman = data.decoration.designer;
            sales.house =  data.decoration.house;
            sales.dompany = data.decoration.dompany;

        }, function (e) {
            com.showAlert(com.warning, "未查询到此订单!");
            sales.rightitems.customer.val("");
            sales.rightitems.orderAddr.val("");
            com.cleanTypeahead("salesman");
        });
    });

    //重置按钮
    sales.btns.refresh.click(function () {
        com.cleanItems(sales.leftitems);
        sales.items.left.find('select').empty();
    });

    // 销售单区 提交
    sales.btns.submit.click(function () {

        if(com.validate('searchInfo', 'bottom')) return false;
        if (submitCheck() == false) return false;

        var options = {
            "sales.orderId": sales.rightitems.orderId.val(),
            "sales.salesman.userId": com.typeahead("salesman"),
            "sales.customer.cid": sales.customer.cid,
            "sales.guider.userId": com.typeahead("guider"),
            "sales.instorer.userId": com.typeahead("instorer"),
            "sales.bid": sales.brand.bid,
            "sales.coupon": sales.rightitems.coupon.val(),
            "sales.couponInfo": '#' + sales.rightitems.couponInfo.val() + ':' + sales.rightitems.coupon.val() + '#',
            "sales.comment": sales.rightitems.comment.val(),
            "sales.maling": sales.rightitems.maling.val(),
            "sales.total": sales.rightitems.totals.val(),
            "sales.house.hid": sales.house.hid,
            "sales.dompanys": sales.dompany,
            "sales.otherStatus":com.focusPage("[data-otherStatus=1]").length > 0 ? 1 : 0
        };

        var $lis = com.focusPage('.list-group-item');

        $lis && $lis.length && $.each($lis, function (i, v) {

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
            options["salesItems[" + i + "].price"] = data.selling;
            options["salesItems[" + i + "].num"] = data.num;
            options["salesItems[" + i + "].total"] = data.total;
            options["salesItems[" + i + "].comment"] = data.comment;
            options["salesItems[" + i + "].rawCtype"] = data.ctype;
            options["salesItems[" + i + "].rawCvalue"] = data.cvalue;
            options["salesItems[" + i + "].ctype"] = data.ctype;
            options["salesItems[" + i + "].cvalue"] = data.cvalue;
            options["salesItems[" + i + "].priceType"] = data.pricetype;
        });
        
        com.post(api.inventory.addSales, options, function () {
            com.showAlert(com.info, "添加成功");
            com.focusPage('#salesItemList').empty();
            sales.items.left.find('select').empty();
            com.cleanItems(sales.leftitems);
            com.cleanItems(sales.rightitems);
            sales.rightitems.coupon.val(0);
            sales.rightitems.maling.val(0);
            sales.rightitems.totals.val(0);
        });
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

    function cycTotal() {

        var _total = 0;
        var $li = com.focusPage('.list-group-item');

        $li.length && $li.each(function (i, v) {
            var $v = $(v);
            var data = $v.data();
            _total = utils.accAdd(_total, data.total);
        });
        sales.rightitems.totals.val(_total);
    }

    //判断品牌差异
    function submitCheck() {
        
        var $list = com.focusPage('.list-group-item');
        
        for(var i=0;i<$list.length;i++){
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
});