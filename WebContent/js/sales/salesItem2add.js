jQuery(function () {

    var sales = {
        sid: params.sid,
        queryDecorationByOrderIdUrl: api.decoration.queryDecorationForCommonByOrderId,
        typeahead: {
            goodes: "goodes",
            goods: "goods",
            gid: "goods.gid",
            pricegid: "price.gid",
            colorgid: "color.gid",
            formatgid: "format.gid"
        },
        items:{

            salesItemList : com.focusPage('#salesItemList'),
            viewPopUp : com.focusPage('#viewPopUp')

        },
        leftitems:{

            goods : com.focusPage('#goods'),
            goodsNo : com.focusPage('#goodsNo'),
            category : com.focusPage('#category'),
            brand : com.focusPage('#brand'),
            measurementUnit : com.focusPage('#measurementUnit'),
            discount : com.focusPage('#discount'),
            disPrice : com.focusPage('#disPrice'),
            postDis : com.focusPage('#postDis'),
            selling : com.focusPage('#selling'),
            num : com.focusPage('#num'),
            addSalesItemsTotal : com.focusPage('#addSalesItemsTotal'),
            purchase : com.focusPage('#purchase'),
            color : com.focusPage('#color'),
            format : com.focusPage('#format')

        },
        rightitems:{

            orderNo : com.focusPage('#orderNo'),
            customerName : com.focusPage('#customerName'),
            salesmanName : com.focusPage('#salesmanName'),
            instorer : com.focusPage('#instorer'),
            guider : com.focusPage('#guider'),
            brands : com.focusPage('#brands'),
            addSalesItemscoupon : com.focusPage('#addSalesItemscoupon'),
            addSalesItemsCouponInfo : com.focusPage('#addSalesItemsCouponInfo'),
            pretotals : com.focusPage('#pretotals'),
            totals : com.focusPage('#totals'),
            comment : com.focusPage('#comment'),
            orderAdd : com.focusPage('#orderAdd')

        },
        btns:{
            add : com.focusPage("#add"),
            submit : com.focusPage('#submit')
        },
        goods : null,
        flag: false,
        otherStatus:null,
        $liList:null
    };

    com.post(api.inventory.querySalesBySid, {
        "sales.sid": sales.sid
    }, function (res) {
        
        var $sales = res.sales;
        
        sales.rightitems.orderNo.val(res.sales.orderId);
        sales.rightitems.customerName.val(res.sales.customer.name);
        sales.rightitems.salesmanName.val(res.sales.salesman.currentName);
        sales.rightitems.instorer.val(res.sales.instorer.currentName);
        sales.rightitems.guider.val(res.sales.guider.currentName);
        sales.rightitems.brands.val(res.sales.brand+'-'+res.sales.category);
        sales.rightitems.addSalesItemscoupon.val(res.sales.coupon);
        sales.rightitems.addSalesItemsCouponInfo.val(res.sales.couponInfo);
        sales.rightitems.pretotals.val(res.sales.total);
        sales.rightitems.comment.val(res.sales.comment);
        sales.rightitems.orderAdd.val(res.sales.house.village.name + " " + res.sales.house.houseNumber);
        sales.otherStatus = res.sales.otherStatus;
        
        sales.brand = $sales.brand;

    }, null, false);

    com.initTypeahead('goods', api.inventory.queryGoodsByName, "goods.name", {}, 'goodes', 'gid', 'name', function (list, k, v) {
        
        var $content = com.focusPage('#left');
        
        //赋值商品信息
        $.each(list, function (index, val) {
            if (val.gid == k) {
                sales.goods = val;
                sales.leftitems.goodsNo.val(val.no);
                sales.leftitems.category.val(val.category);
                sales.leftitems.brand.val(val.brand);
                sales.leftitems.measurementUnit.attr('data-measurementUnit', val.measurementUnit).val(val.measurementUnit);

                //赋值售价信息
                com.post(api.inventory.queryPriceByGid, {"price.gid": k}, function (priceData) {
                    if (priceData.prices.length != 0) {

                        sales.leftitems.purchase.bindData(priceData.prices, "pid", "content",false,null,"selling");

                        var price = priceData.prices[0];
                        sales.leftitems.discount.val(1);
                        sales.leftitems.disPrice.val(price.selling);
                        sales.leftitems.postDis.val(1);
                        sales.leftitems.selling.val(price.selling);
                        sales.leftitems.num.val(1);
                        sales.leftitems.addSalesItemsTotal.val(price.selling);
                        sales.flag = true;
                    } else {
                        com.showAlert(com.warning, "该商品暂无价格信息,请录入");
                        sales.flag = false;
                    }
                });
                //赋值颜色信息
                com.post(api.inventory.queryColorForEnableByGid, {"color.gid": k}, function (colorData) {
                    com.cleanTypeahead('color');
                    if (colorData.colors.length != 0) {
                        var color = sales.leftitems.color;
                        $content.find('#color').bindData(colorData.colors, "cid", "name");
                        sales.flag = true;
                    } else {
                        com.showAlert(com.warning, "该商品暂无颜色信息,请录入");
                        sales.flag = false;
                    }
                });
                //赋值规格信息
                com.post(api.inventory.queryFormatForEnableByGid, {"format.gid": k}, function (formatData) {
                    com.cleanTypeahead('format');
                    if (formatData.formats.length != 0) {
                        $content.find('#format').bindData(formatData.formats, "fid", "info");
                        sales.flag = true;
                    } else {
                        com.showAlert(com.warning, "该商品暂无规格信息,请录入");
                        sales.flag = false;
                    }
                });
            }
        });

        return v;
    });

    com.post(api.inventory.querySalesItemBySid, {"sales.sid": sales.sid}, function (data) {

        $.each(data.salesItems, function (i, v) {
            initList(v);
        });
    }, null, false);
    
    function initList(v) {

        sales.$liList = $('<li></li>').addClass('list-group-item item-orange').attr({
            'data-selling': parseFloat(v.price),
            'data-disPrice': parseFloat(v.disPrice),
            'data-purchase': parseFloat(v.purchase),
            'data-discount': parseFloat(v.discount),
            'data-otherStatus': parseFloat(v.price) != parseFloat(v.disPrice) ? 1 :0,
            'data-postDis': v.postDis,
            'data-currentPriceType': v.priceType,
            'data-category': v.goods.category,
            'data-brand': v.goods.brand,
            'data-measurementUnit': v.goods.measurementUnit,
            'data-color': v.color.name,
            'data-format': v.format.info,
            'data-num': v.num,
            'data-addSalesItemsTotal': v.total,
            'data-remark': v.comment,
            'data-goodsNameAndNo' : v.goods.name+ ' '+ v.goods.no,
            'data-gid' : v.goods.gid,
            'data-siid' : v.siid
        });

        var $h4 = $('<h4></h4>').html(v.goods.name+ ' '+ v.goods.no).attr('addGid', v.goods.gid).attr('siid', v.siid);

        var $btnEdit = $('<div></div>').css('margin-right', '5px').addClass('pull-right action-button').append($('<a></a>').addClass('btn btn-minier btn-yellow').html('编辑'));
        var $delete = $('<div></div>').addClass('pull-right action-button').append($('<a></a>').addClass('btn btn-minier btn-success').html('删除'));
        var $input = $('<div></div>').css('margin-right', '5px').addClass('pull-right action button hide').append($('<input>').css("width" ,"100px", "height", "26px",'margin-right', '5px').addClass('v_required v_float_3'));
        var $btnCheck = $('<div></div>').css('margin-right', '5px').addClass('pull-right action-button hide').append($('<a></a>').addClass('btn btn-minier btn-info').html('确定'));
        var $btnQCheck = $('<div></div>').addClass('pull-right action-button hide').append($('<a></a>').addClass('btn btn-minier').html('取消'));

        $h4.append($delete).append($btnEdit).append($btnQCheck).append($btnCheck).append($input).appendTo(sales.$liList);

        var propertyArr = [
            ['品类: ', v.goods.category],
            ['品牌: ', v.goods.brand],
            ['单位: ', v.goods.measurementUnit],
            ['颜色: ', v.color.name],
            ['规格: ', v.format.info],
            ['售价: ', v.purchase, 'blue'],
            ['折扣价: ', v.disPrice, 'blue'],
            ['折让价: ', v.price, 'blue'],
            ['数量: ', v.num, 'red'],
            ['总价: ', v.total, 'blue'],
            ['备注: ', v.comment]
        ];
        $.each(propertyArr, function (index, value) {
            var $span = $('<span></span>').addClass(value[1]);
            var $b = $('<b></b>');
            if (value[0] != null) $span.html(value[0]);
            if (value[1] != null) $b.html(value[1]);
            if (value[2] != null) $b.addClass(value[2]);
            $span.append($b);
            sales.$liList.append($span);
        });

        sales.items.salesItemList.append(sales.$liList);

        $btnEdit.click(function () {
            $input.removeClass('hide');
            $btnCheck.removeClass('hide');
            $btnQCheck.removeClass('hide');
            $btnEdit.addClass('hide');
            $delete.addClass('hide');
        });

        //确定
        $btnCheck.click(function () {
            if (com.validate('salesItemList','bottom') == false) {
                var $this = $(this);
                var $liParent = $this.parents('.list-group-item');
                var $lis = com.focusPage('.list-group-item');
                var priceTotalEdit = 0;
                var currentPriceTotal = utils.changeThrDecimal(parseFloat($liParent.data().addsalesitemstotal));
                $lis && $lis.length && $.each($lis, function (i, v) {
                    var $v = $(v);
                    priceTotalEdit += parseFloat($v.data().addsalesitemstotal)
                });

                var laterPriceTotal = utils.changeThrDecimal(utils.accMul($liParent.data().selling, $input.find("input").val()));
                var voTopoPriceTotal= utils.changeThrDecimal(utils.accSub(utils.accAdd(priceTotalEdit, laterPriceTotal), currentPriceTotal));
                
                var editArr = {
                    "salesItem.siid": $liParent.find('h4').attr('siid'),
                    "salesItem.num": $input.find("input").val(),
                    "salesItem.total": laterPriceTotal,
                    "salesItem.comment": $liParent.data().remark,
                    "sales.total": voTopoPriceTotal
                };
                
                com.post(api.inventory.updateSalesItem, editArr, function () {
                    com.showAlert(com.info, "编辑成功");
                    $input.addClass('hide');
                    $btnCheck.addClass('hide');
                    $btnQCheck.addClass('hide');
                    $btnEdit.removeClass('hide');
                    $delete.removeClass('hide');
                    $input.find("input").val("");
                    sales.rightitems.totals.val(voTopoPriceTotal);
                }, null, false);

                com.post(api.inventory.querySalesItemBySid, {"sales.sid": sales.sid}, function (data) {
                    sales.items.salesItemList.empty();
                    $.each(data.salesItems, function (i, v) {
                        initList(v);
                    });
                }, null, false);
                
            }
        });

        //取消
        $btnQCheck.click(function () {
            $input.addClass('hide');
            $btnCheck.addClass('hide');
            $btnQCheck.addClass('hide');
            $btnEdit.removeClass('hide');
            $delete.removeClass('hide');
            $input.find("input").val("")
        });

        $delete.click(function () {
            var $this = $(this);
            var $liParent = $this.parents('.list-group-item');
            var $lis = com.focusPage('.list-group-item');
            var priceTotal = 0;
            $lis && $lis.length && $.each($lis, function (i, v) {
                var $v = $(v);
                priceTotal += utils.changeThrDecimal(parseFloat($v.data().addsalesitemstotal));
            });

            priceTotal = utils.changeThrDecimal(utils.accSub(priceTotal,parseFloat($liParent.data().addsalesitemstotal)));

            var ops = {
                "salesItem.siid": $liParent.find('h4').attr('siid'),
                "sales.total": priceTotal
            };

            com.showConfirm('确定要删除吗?', function (indexo, layero) {
                com.post(api.inventory.deleteSalesItem, ops, function () {
                    sales.rightitems.totals.val(priceTotal);
                    $liParent.remove();
                    com.showAlert(com.info, "删除成功");
                }, null, false);
            });
        });
    }
    
    //点击添加按钮
    sales.btns.add.click(function () {

        if (com.validate('left', 'bottom')) return false;
        
        if (sales.brand != sales.leftitems.brand.val()){
            com.showAlert(com.warning, "销售项品牌与主材品牌不符,请检查");
            return false;
        } 
        
        var price = {};
        com.post(api.inventory.queryPriceByPid, {"price.pid": sales.leftitems.purchase.val()}, function (data) {
            price = data.price;
        },null, false);

        //折让价
        var $selling = parseFloat(sales.leftitems.selling.val());
        //折扣价
        var $disPrice = parseFloat(sales.leftitems.disPrice.val());
        //售价
        var $purchase = price.selling;
        //折扣
        var $discount = parseFloat(sales.leftitems.discount.val());

        var $postDis = sales.leftitems.postDis.val();
        var currentPriceType = price.type;
        var $category = sales.leftitems.category.val();
        var $brand = sales.leftitems.brand.val();
        var $measurementUnit = sales.leftitems.measurementUnit.val();
        var $color = sales.leftitems.color.find("option:selected").text();
        var $format = sales.leftitems.format.find("option:selected").text();
        var $num = sales.leftitems.num.val();
        var $addSalesItemsTotal = sales.leftitems.addSalesItemsTotal.val();
        var $remark = com.focusPage('#remark').val();
        var $gid = sales.goods.gid;

        var options = {};
        var $otherStatus = sales.otherStatus;
        var $lis = com.focusPage('.list-group-item');
        var priceTotal = 0;

        $lis && $lis.length && $.each($lis, function (i, v) {
            var $v = $(v);
            var $data = $v.data();
            var $status = parseFloat($data.otherstatus);
            $otherStatus = $status == 1 ? 1 : $otherStatus;
            priceTotal += parseFloat($data.addsalesitemstotal);
        });

        priceTotal = utils.changeThrDecimal(utils.accAdd(priceTotal, utils.accMul($selling, $num)));

        options["sales.sid"] = sales.sid;
        options["sales.total"] = priceTotal;
        options["sales.otherStatus"] = $otherStatus;

        options["salesItem.goods.gid"] = sales.leftitems.goods.attr('data-typeahead-key');
        options["salesItem.color.cid"] = sales.leftitems.color.find('option:selected').val();
        options["salesItem.format.fid"] = sales.leftitems.format.find('option:selected').val();
        options["salesItem.purchase"] = parseFloat(price.purchase);
        options["salesItem.selling"] = parseFloat($purchase);
        options["salesItem.discount"] = parseFloat($discount);
        options["salesItem.disPrice"] = parseFloat($disPrice);
        options["salesItem.postDis"] = parseFloat($postDis);
        options["salesItem.price"] = parseFloat($selling);
        options["salesItem.num"] = parseFloat($num);
        options["salesItem.total"] = parseFloat($addSalesItemsTotal);
        options["salesItem.comment"] = $remark;
        options["salesItem.rawCtype"] = price.ctype;
        options["salesItem.rawCvalue"] = price.cvalue;
        options["salesItem.ctype"] = price.ctype;
        options["salesItem.cvalue"] = price.cvalue;
        options["salesItem.priceType"] = price.type;

        com.post(api.inventory.addSalesItem, options, function (data) {
            com.showAlert(com.info, "添加成功");
            var v = {"price": $selling, "disPrice":$disPrice , "purchase":$purchase,"discount":$discount, "postDis":$postDis,"priceType":currentPriceType,"goods":{"category":$category, "brand": $brand, "measurementUnit":$measurementUnit, "name": sales.leftitems.goods.attr('data-name') , "no": sales.leftitems.goodsNo.attr('data-no'), "gid":$gid}, "color":{"name":$color},"format":{"info":$format},
                "num":$num, "total":$addSalesItemsTotal,"comment":$remark, "siid":data.salesItem.siid};
            initList(v);
        },null,false);

        sales.rightitems.totals.val(priceTotal);
        com.cleanTypeahead("goods");
        com.focusPage('#left').find('input').val("");
        com.focusPage('#left').find('select').empty();
        sales.leftitems.goods.removeAttr('data-name');
        sales.leftitems.category.removeAttr('data-category');
        sales.leftitems.brand.removeAttr('data-brand');
        sales.leftitems.measurementUnit.removeAttr('data-measurementUnit');

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

    function count(flag, boolean) {
        if (flag == true && boolean == true) {
            sales.leftitems.disPrice.val(utils.changeThrDecimal(utils.accMul(parseFloat(sales.leftitems.purchase.find('option:selected').attr("other")), parseFloat(sales.leftitems.discount.val()))));
            sales.leftitems.selling.val(utils.changeThrDecimal(utils.accMul(parseFloat(sales.leftitems.disPrice.val()), parseFloat(sales.leftitems.postDis.val()))));
            sales.leftitems.addSalesItemsTotal.val(utils.changeThrDecimal(utils.accMul(parseFloat(sales.leftitems.selling.val()), parseFloat(sales.leftitems.num.val()))));
        } else if (flag == true && boolean == false) {
            sales.leftitems.selling.val(utils.changeThrDecimal(utils.accMul(parseFloat(sales.leftitems.disPrice.val()), parseFloat(sales.leftitems.postDis.val()))));
            sales.leftitems.addSalesItemsTotal.val(utils.changeThrDecimal(utils.accMul(parseFloat(sales.leftitems.selling.val()), parseFloat(sales.leftitems.num.val()))));
        } else if (flag == false && boolean == true) {
            sales.leftitems.addSalesItemsTotal.val(utils.changeThrDecimal(utils.accMul(parseFloat(sales.leftitems.selling.val()), parseFloat(sales.leftitems.num.val()))));
            sales.leftitems.postDis.val(utils.changeThrDecimal((utils.accDiv(parseFloat(sales.leftitems.selling.val()), parseFloat(sales.leftitems.disPrice.val()))).toFixed(2)));
        }
    }

});