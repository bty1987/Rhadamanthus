jQuery(function () {

    var sales = {
        sid: params.sid,
        
        items:{
            salesItemList: com.focusPage('#salesItemList'),
            viewPopUp: com.focusPage('#viewPopUp')
        },
        leftitems:{

            goods: com.focusPage('#goods'),
            goodsNo: com.focusPage('#goodsNo'),
            category: com.focusPage('#category'),
            brand: com.focusPage('#brand'),
            measurementUnit: com.focusPage('#measurementUnit'),
            discount: com.focusPage('#discount'),
            disPrice: com.focusPage('#disPrice'),
            postDis: com.focusPage('#postDis'),
            selling: com.focusPage('#selling'),
            num: com.focusPage('#num'),
            total: com.focusPage('#total', '#addSalesItem'),
            purchase: com.focusPage('#purchase'),
            color: com.focusPage('#color'),
            format: com.focusPage('#format'),
            remark: com.focusPage('#remark')
        },
        rightitems:{
            orderId: com.focusPage('#orderId', '#addSalesItem'),
            customer: com.focusPage('#customer'),
            salesman: com.focusPage('#salesman'),
            instorer: com.focusPage('#instorer'),
            guider: com.focusPage('#guider'),
            brands: com.focusPage('#brands'),
            coupon: com.focusPage('#coupon', '#addSalesItem'),
            couponInfo: com.focusPage('#couponInfo', '#addSalesItem'),
            pretotals: com.focusPage('#pretotals'),
            totals: com.focusPage('#totals'),
            comment: com.focusPage('#comment'),
            orderAdd: com.focusPage('#orderAdd')
        },
        btns:{
            add: com.focusPage("#add"),
            submit: com.focusPage('#submit')
        },
        model: {
            packageModel: com.focusPage('#itemModel')
        },
        goods: null,
        brand: null
    };

    com.post(api.inventory.querySalesBySid, {"sales.sid": sales.sid}, function (res) {
        
        var data = res.sales;
        
        sales.rightitems.orderId.val(data.orderId);
        sales.rightitems.customer.val(data.customer.name);
        sales.rightitems.salesman.val(data.salesman.currentName);
        sales.rightitems.instorer.val(data.instorer.currentName);
        sales.rightitems.guider.val(data.guider.currentName);
        sales.rightitems.brands.val(data.brand + '-' + data.category);
        sales.rightitems.coupon.val(data.coupon);
        sales.rightitems.couponInfo.val(data.couponInfo);
        sales.rightitems.totals.val(data.total);
        sales.rightitems.pretotals.val(data.total);
        sales.rightitems.comment.val(data.comment);
        sales.rightitems.orderAdd.val(data.house.village.name + " " + data.house.houseNumber);

        sales.brand = data.brand;
    });

    com.initTypeahead('goods', api.inventory.queryGoodsByName, "goods.name", {}, 'goodes', 'gid', 'name', function (list, k, v) {
        
        var $content = com.focusPage('#left');
        
        //赋值商品信息
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

                        sales.leftitems.purchase.bindData(res.prices, "pid", "content",false,null,"selling");

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
                com.post(api.inventory.queryColorForEnableByGid, {"color.gid": k}, function (res) {
                    if (res.colors.length != 0) {
                        sales.leftitems.color.bindData(res.colors, "cid", "name");
                    } else {
                        com.showAlert(com.warning, "该商品暂无颜色信息,请录入");
                    }
                });
                //赋值规格信息
                com.post(api.inventory.queryFormatForEnableByGid, {"format.gid": k}, function (res) {
                    if (res.formats.length != 0) {
                        sales.leftitems.format.bindData(res.formats, "fid", "info");
                    } else {
                        com.showAlert(com.warning, "该商品暂无规格信息,请录入");
                    }
                });
            }
        });
        return v;
    });

    com.focusPage('#itemModel').on('hidden.bs.modal', function (e) {
        com.focusPage('#itemList').html("");
    });

    com.post(api.inventory.querySalesItemBySid, {"sales.sid": sales.sid}, function (res) {
        $.each(res.salesItems, function (i, v) {
            initList(v);
        });
    });

    function initList(v) {

        sales.$liList = $('<li></li>').addClass('list-group-item item-orange').attr({
            'data-selling': v.price,
            'data-disPrice': v.disPrice,
            'data-purchase': v.purchase,
            'data-discount': v.discount,
            'data-otherStatus': v.price != v.disPrice ? 1 :0,
            'data-postDis': v.postDis,
            'data-priceType': v.priceType,
            'data-category': v.goods.category,
            'data-brand': v.goods.brand,
            'data-measurementUnit': v.goods.measurementUnit,
            'data-color': v.color.name,
            'data-format': v.format.info,
            'data-num': v.num,
            'data-total': v.total,
            'data-remark': v.comment,
            'data-gid': v.goods.gid,
            'data-siid': v.siid
        });

        var $h4 = $('<h4></h4>').html(v.goods.name+ ' '+ v.goods.no).attr('addGid', v.goods.gid).attr('siid', v.siid);

        var $btnEdit = $('<div></div>').css('margin-right', '5px').addClass('pull-right action-button').append($('<a></a>').addClass('btn btn-minier btn-yellow').html('编辑'));
        var $delete = $('<div></div>').addClass('pull-right action-button').append($('<a></a>').addClass('btn btn-minier btn-success').html('删除'));
        var $input = $('<div></div>').css('margin-right', '5px').addClass('pull-right action button hide').append($('<input>').attr("type", "text").css("width" ,"100px", "height", "26px",'margin-right', '5px').addClass('v_required v_float_3'));
        var $btnCheck = $('<div></div>').css('margin-right', '5px').addClass('pull-right action-button hide').append($('<a></a>').addClass('btn btn-minier btn-info').html('确定'));
        var $btnQCheck = $('<div></div>').addClass('pull-right action-button hide').append($('<a></a>').addClass('btn btn-minier').html('取消'));
        
        var $views = $('<div></div>').css('margin-right', '5px').addClass('pull-right action-button').append($('<a></a>').addClass('btn blue btn-minier _delete').html('查看')).click(function () {
            salesUtils.showPackage(sales.model.packageModel, com.focusPage('#itemList'), v.goods.gid);
        });

        $h4.append($delete).append($btnEdit).append($btnQCheck).append($btnCheck).append($input).appendTo(sales.$liList);
        
        if(v.goods.type == 1) $h4.append($views);

        var propertyArr = [
            ['品类: ', v.goods.category],
            ['品牌: ', v.goods.brand],
            ['单位: ', v.goods.measurementUnit],
            ['颜色: ', v.color.name],
            ['规格: ', v.format.info],
            ['售价: ', v.purchase, 'blue'],
            ['折扣价: ', v.disPrice, 'blue'],
            ['折让价: ', v.price, 'blue'],
            ['数量: ', v.num, 'red num'],
            ['总价: ', v.total, 'blue total'],
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
            $views.addClass('hide');
        });

        //确定
        $btnCheck.click(function () {
            
            if (com.validate('salesItemList','bottom')) return false;

            var $this = $(this);

            var $item = $this.parents('.list-group-item');
            var $info = $item.data();
            
            var $siid = $info.siid;
            var $num = $item.find("input").val();
            var $price = $info.selling;
            
            var $itemTotal = utils.changeThrDecimal(utils.accMul($price, $num));
            var $total = sales.rightitems.totals.val();
            
            var options = {
                "salesItem.siid": $siid,
                "salesItem.num": $num,
                "salesItem.total": $itemTotal,
                "sales.total": utils.changeThrDecimal(utils.accSub(utils.accAdd($total, $itemTotal), $info.total))
            };
            
            com.post(api.inventory.updateSalesItem, options, function (res) {
                
                com.showAlert(com.info, "操作成功");
                
                $input.addClass('hide');
                $btnCheck.addClass('hide');
                $btnQCheck.addClass('hide');
                $btnEdit.removeClass('hide');
                $delete.removeClass('hide');
                $views.removeClass('hide');
                $input.find("input").val("");

                var salesItem = res.salesItem;
                
                $item.data({"num": salesItem.num, "total": salesItem.total});
                
                $item.find("b.num").text(salesItem.num);
                $item.find("b.total").text(salesItem.total);
                
                cycTotal();
                
            });
        });

        //取消
        $btnQCheck.click(function () {
            $input.addClass('hide');
            $btnCheck.addClass('hide');
            $btnQCheck.addClass('hide');
            $btnEdit.removeClass('hide');
            $delete.removeClass('hide');
            $views.removeClass('hide');
            $input.find("input").val("")
        });

        $delete.click(function () {

            var $this = $(this);
            
            var $item = $this.parents('.list-group-item');
            var $info = $item.data();
            
            var $siid = $info.siid;
            
            var $itemTotal = $info.total;
            var $total = sales.rightitems.totals.val();

            var options = {
                "salesItem.siid": $siid,
                "sales.total": utils.changeThrDecimal(utils.accSub($total, $itemTotal))
            };

            com.post(api.inventory.deleteSalesItem, options, function () {
                
                com.showAlert(com.info, "操作成功");
                
                $item.remove();
                
                cycTotal();
            });
        });
    }
    
    //点击添加按钮
    sales.btns.add.click(function () {

        if (com.validate('left', 'bottom')) return false;
        
        if(sales.leftitems.brand.val() != sales.brand) {
            com.showAlert(com.warning, "销售项品牌与主材品牌不符,请检查");
            return false;
        }

        var price = {};
        com.post(api.inventory.queryPriceByPid, {"price.pid": sales.leftitems.purchase.val()}, function (data) {
            price = data.price;
        },null, false);

        var $selling = sales.leftitems.selling.val(); // 折让价
        var $disPrice = sales.leftitems.disPrice.val(); // 折扣价
        var $purchase = price.selling; // 售价
        var $discount = sales.leftitems.discount.val(); // 折扣

        var $postDis = sales.leftitems.postDis.val();
        var $num = sales.leftitems.num.val();
        var $itemTotal = sales.leftitems.total.val();
        var $remark = sales.leftitems.remark.val();
        
        var $otherStatus = ($selling != $disPrice || com.focusPage("[data-otherStatus=1]").length > 0) ? 1 : 0;

        var options = {};
        
        var $total = utils.changeThrDecimal(utils.accAdd(sales.rightitems.totals.val(), $itemTotal));

        options["sales.sid"] = sales.sid;
        options["sales.total"] = $total;
        options["sales.otherStatus"] = $otherStatus;

        options["salesItem.goods.gid"] = com.typeahead("goods");
        options["salesItem.color.cid"] = sales.leftitems.color.val();
        options["salesItem.format.fid"] = sales.leftitems.format.val();
        options["salesItem.purchase"] = price.purchase;
        options["salesItem.selling"] = $purchase;
        options["salesItem.discount"] = $discount;
        options["salesItem.disPrice"] = $disPrice;
        options["salesItem.postDis"] = $postDis;
        options["salesItem.price"] = $selling;
        options["salesItem.num"] = $num;
        options["salesItem.total"] = $itemTotal;
        options["salesItem.comment"] = $remark;
        options["salesItem.rawCtype"] = price.ctype;
        options["salesItem.rawCvalue"] = price.cvalue;
        options["salesItem.ctype"] = price.ctype;
        options["salesItem.cvalue"] = price.cvalue;
        options["salesItem.priceType"] = price.type;
        
        options["salesItem.goods.name"] = sales.goods.name;
        options["salesItem.goods.no"] = sales.goods.no;
        options["salesItem.goods.category"] = sales.goods.category;
        options["salesItem.goods.brand"] = sales.goods.brand;
        options["salesItem.goods.measurementUnit"] = sales.goods.measurementUnit;
        options["salesItem.goods.type"] = sales.goods.type;

        options["salesItem.color.name"] = sales.leftitems.color.find("option:selected").text();
        options["salesItem.format.info"] = sales.leftitems.format.find("option:selected").text();

        com.post(api.inventory.addSalesItem, options, function (data) {
            
            com.showAlert(com.info, "操作成功");

            initList(data.salesItem);
            cycTotal();
            
            com.cleanTypeahead("goods");
            com.focusPage('#left').find('input').val("");
            com.focusPage('#left').find('select').empty();
        });
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
        var $lis = com.focusPage('.list-group-item');
        
        $lis && $lis.length && $.each($lis, function (i, v) {
            
            var $v = $(v);
            var $data = $v.data();
            
            _total = utils.changeThrDecimal(utils.accAdd(_total, $data.total))
        });
        
        sales.rightitems.totals.val(_total);
    }
});