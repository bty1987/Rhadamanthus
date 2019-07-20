jQuery(function () {
    // sales.items.viewPopUp
    // sales.btns.submit
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
        items:{
            orderNo : com.focusPage('#orderNo'),
            customerName : com.focusPage('#customerName'),
            salesmanName : com.focusPage('#salesmanName'),
            instorer : com.focusPage('#instorer'),
            guider : com.focusPage('#guider'),
            brands : com.focusPage('#brands'),
            addSalesItemscoupon : com.focusPage('#addSalesItemscoupon'),
            addSalesItemsCouponInfo : com.focusPage('#addSalesItemsCouponInfo'),
            pretotals : com.focusPage('#pretotals'),
            comment : com.focusPage('#comment'),
            orderAdd : com.focusPage('#orderAdd'),

            goodsName : com.focusPage('#goodsName'),
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
            totals : com.focusPage('#totals'),

            color : com.focusPage('#color'),
            format : com.focusPage('#format'),

            salesItemList : com.focusPage('#salesItemList'),
            viewPopUp : com.focusPage('#viewPopUp')

        },
        btns:{
            add : com.focusPage("#add"),
            submit : com.focusPage('#submit')
        },
        addSalesItemsPostData: {},
        gids: null,
        gtype: null,
        colorids: null,
        formatids: null,
        flag: false,
        sid: params.sid,
        otherStatus:null
    };

    com.post(api.inventory.querySalesBySid, {
        "sales.sid": sales.sid
    }, function (res) {
        sales.items.orderNo.val(res.sales.orderId);
        sales.items.customerName.val(res.sales.customer.name);
        sales.items.salesmanName.val(res.sales.salesman.currentName);
        sales.items.instorer.val(res.sales.instorer.currentName);
        sales.items.guider.val(res.sales.guider.currentName);
        sales.items.brands.attr({'data-brand': res.sales.brand,'data-category':res.sales.category}).val(res.sales.brand+'-'+res.sales.category);
        sales.items.addSalesItemscoupon.val(res.sales.coupon);
        sales.items.addSalesItemsCouponInfo.val(res.sales.couponInfo);
        sales.items.pretotals.val(res.sales.total);
        sales.items.comment.val(res.sales.comment);
        sales.items.orderAdd.val(res.sales.house.village.name + " " + res.sales.house.houseNumber);
        sales.otherStatus = res.sales.otherStatus;

    }, null, false);

    com.initTypeahead('goodsName', api.inventory.queryGoodsByName, "goods.name", {}, 'goodes', 'gid', 'name', function (list, k, v) {
        
        var $content = com.focusPage('#left');
        sales.gids = k;
        //赋值商品信息
        $.each(list, function (index, val) {
            if (val.gid == k) {
                sales.gtype = val.type;
                sales.items.goodsName.attr('data-name', val.name);
                sales.items.goodsNo.attr('data-no', val.no).val(val.no);
                sales.items.category.attr('data-category', val.category).val(val.category);
                sales.items.brand.attr('data-brand', val.brand).val(val.brand);
                sales.items.measurementUnit.attr('data-measurementUnit', val.measurementUnit).val(val.measurementUnit);
            }
        });
        //赋值售价信息
        com.post(api.inventory.queryPriceByGid, {"price.gid": k}, function (priceData) {
            if (priceData.prices.length != 0) {
                var $purchase = sales.items.purchase;
                $purchase.bindData(priceData.prices, "pid", "content",false,null,"selling");
                com.post(api.inventory.queryPriceByPid, {
                    "price.pid": sales.items.purchase.val()
                }, function (data) {
                    com.focusPage('#bid').attr({
                        'data-ctype': data.price.ctype,
                        "data-cvalue": data.price.cvalue,
                        "data-priceType": data.price.type
                    }).val(data.price.purchase);

                });
                sales.items.discount.val(1);
                sales.items.disPrice.val(utils.accMul(parseFloat(sales.items.purchase.find('option:selected').attr("other")), parseFloat(sales.items.discount.val())));
                sales.items.postDis.val(1);
                sales.items.selling.val(utils.accMul(parseFloat(sales.items.disPrice.val()), parseFloat(sales.items.postDis.val())));
                sales.items.num.val(1);
                sales.items.addSalesItemsTotal.val(utils.accMul(parseFloat(sales.items.selling.val()), parseFloat(sales.items.num.val())));
                sales.flag = true;
            } else {
                com.showAlert(com.warning, "该商品暂无价格信息,请录入");
                sales.flag = false;
            }
        }, function () {
            com.showAlert(com.warning, "获取售价信息失败");
        });
        //赋值颜色信息
        com.post(api.inventory.queryColorForEnableByGid, {"color.gid": k}, function (colorData) {
            if (colorData.colors.length != 0) {
                var color = sales.items.color;
                $content.find('#color').bindData(colorData.colors, "cid", "name");
                sales.colorids = color.find('option:selected').val();
                sales.flag = true;
            } else {
                com.showAlert(com.warning, "该商品暂无颜色信息,请录入");
                sales.flag = false;
            }
        }, function () {
            com.showAlert(com.warning, "获取颜色信息失败");
        });
        //赋值规格信息
        com.post(api.inventory.queryFormatForEnableByGid, {"format.gid": k}, function (formatData) {
            if (formatData.formats.length != 0) {
                $content.find('#format').bindData(formatData.formats, "fid", "info");
                sales.formatids =sales.items.format.find('option:selected').val();
                sales.flag = true;
            } else {
                com.showAlert(com.warning, "该商品暂无规格信息,请录入");
                sales.flag = false;
            }
        }, function () {
            com.showAlert(com.warning, "获取规格信息失败");
        });
        return v;
    });

    sales.items.color.on("change", function () {
        sales.colorids = sales.items.color.find('option:selected').val();
    });
    sales.items.format.on("change", function () {
        sales.formatids =sales.items.format.find('option:selected').val();
    });
    sales.items.purchase.on("change", function () {
        com.post(api.inventory.queryPriceByPid, {
            "price.pid": sales.items.purchase.val()
        }, function (data) {
            com.focusPage('#bid').attr({'data-ctype': data.price.ctype, "data-cvalue": data.price.cvalue, "data-priceType": data.price.type}).val(data.price.purchase);
        });
    });
    //点击添加按钮
    sales.btns.add.click(function () {

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

            var $delete = $('<div></div>').addClass('pull-right action-button').append($('<a></a>').addClass('btn red btn-minier').html('删除'));
            var $edit = $('<div></div>').css('margin-right', '5px').addClass('pull-right action-button').append($('<a></a>').addClass('btn blue btn-minier _delete').html('查看')).click(function () {
                sales.items.viewPopUp.attr({'data-gid': $h4.attr('addData')});
                checkSetMeal();//查看套餐
                com.popup4mini("#miniPopUp", "#viewPopUp", "查看套餐", "", function () {
                    sales.items.viewPopUp.attr('data-gid', null);
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
                ['规格：', 's_format',sales.items.format.find("option:selected").text(), " ", 'b_format', sales.formatids],
                ['售价：', 's_selling', sales.items.purchase.find("option:selected").attr("other"), 'blue', 'b_selling', null],
                ['折扣价：', 's_countSelling', sales.items.disPrice.val(), 'blue', 'b_countSelling', null],
                ['折让价：', 's_price', sales.items.selling.val(), 'blue', 'b_price', null],
                ['数量：', 's_number', sales.items.num.val(), 'red', 'b_number'],
                ['总价：', 's_total', sales.items.addSalesItemsTotal.val(), 'blue', 'b_total', null],
                ['备注：', 's_remark', com.focusPage('#remark').val(), " ", 'b_remark', null]
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
            sales.items.salesItemList.append($liList);
            //给最后一个li标签加上底框,除了最后一个li 其他的li均无底框
            com.focusPage('.list-group-item').css("border-bottom", "none");
            com.focusPage('.list-group-item:last').css("border-bottom", "grey solid 1px");
            //清空左侧
            com.cleanTypeahead("goodsName");
            com.focusPage('#left').find('input').val("");
            com.focusPage('#left').find('select').empty();
            sales.items.goodsName.removeAttr('data-name');
            sales.items.category.removeAttr('data-category');
            sales.items.brand.removeAttr('data-brand');
            sales.items.measurementUnit.removeAttr('data-measurementUnit');
            /*
             点击删除移除数据 改变总价
             */
            $delete.click(function () {
                var $this = $(this);
                //li标签
                var $liParent = $this.parents('.list-group-item');
                //取到当前Li的总价
                var deleteNum = parseFloat($liParent.find('.b_total').text());
                sales.items.totals.val(parseFloat(utils.accSub(sales.items.totals.val(), deleteNum)));
                $liParent.remove();
                com.focusPage('.list-group-item:last').css("border-bottom", "solid 1px");
            });
        }
        sales.items.totals.val(cycTotal());
    });

    // 销售单区 提交
    sales.btns.submit.click(function () {
        if (submitCheck()) {
            var $preTotals = sales.items.pretotals;
            var $total = sales.items.totals;
            var options = {};
            var $lis = com.focusPage('.list-group-item');

            //折让审批状态确定
            var $otherStatus = sales.otherStatus;
            $lis && $lis.length && $.each($lis, function (i, v) {
                var $v = $(v);
                var $status = parseFloat($v.attr('data-otherStatus'));
                if ($status == 1) {
                    $otherStatus = 1;
                }
            });

            options["sales.sid"] = sales.sid;
            options["sales.total"] = $total.val();
            options["sales.otherStatus"] = $otherStatus;

            $lis && $lis.length && $.each($lis, function (i, v) {

                var $v = $(v);

                options["salesItems[" + i + "].goods.gid"] = $v.find('h4').attr('adddata');
                options["salesItems[" + i + "].color.cid"] = $v.find('.s_color').find('.b_color').attr('adddata');
                options["salesItems[" + i + "].format.fid"] = $v.find('.s_format').find('.b_format').attr('adddata');
                options["salesItems[" + i + "].purchase"] = parseFloat($v.find("#invisiblePurchase").text());
                options["salesItems[" + i + "].selling"] = parseFloat($v.find('.s_selling').find('.b_selling').text());
                options["salesItems[" + i + "].discount"] = parseFloat($v.attr('data-discount'));
                options["salesItems[" + i + "].disPrice"] = parseFloat($v.find('.s_countSelling').find('.b_countSelling').text());
                options["salesItems[" + i + "].postDis"] = parseFloat($v.attr('data-postDis'));
                options["salesItems[" + i + "].price"] = parseFloat($v.find('.s_price').find('.b_price').text());
                options["salesItems[" + i + "].num"] = parseFloat($v.find('.s_number').find('.b_number').text());
                options["salesItems[" + i + "].total"] = parseFloat($v.find('.s_total').find('.b_total').text());
                options["salesItems[" + i + "].comment"] = $v.find('.s_remark').find('.b_remark').text();
                options["salesItems[" + i + "].rawCtype"] = $v.find("#invisibleCtype").text();
                options["salesItems[" + i + "].rawCvalue"] = $v.find("#invisibleCvalue").text();
                options["salesItems[" + i + "].ctype"] = $v.find("#invisibleCtype").text();
                options["salesItems[" + i + "].cvalue"] = $v.find("#invisibleCvalue").text();
                options["salesItems[" + i + "].priceType"] = $v.find("#invisiblePriceType").text();
            });

            com.post(api.inventory.addSalesItem, options, function (data) {

                sales.items.salesItemList.empty();
                //更新添项中的总额和抹零信息
                $preTotals.val(utils.accAdd(parseFloat($preTotals.val()), parseFloat($total.val())));
                //更新总额
                sales.items.totals.val("");
                com.showAlert(com.info, "添加成功");
            });
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
            sales.items.addSalesItemsTotal.val(utils.changeThrDecimal(utils.accMul(parseFloat(sales.items.selling.val()), parseFloat(sales.items.num.val()))));
        } else if (flag == true && boolean == false) {
            sales.items.selling.val(utils.changeThrDecimal(utils.accMul(parseFloat(sales.items.disPrice.val()), parseFloat(sales.items.postDis.val()))));
            sales.items.addSalesItemsTotal.val(utils.changeThrDecimal(utils.accMul(parseFloat(sales.items.selling.val()), parseFloat(sales.items.num.val()))));
        } else if (flag == false && boolean == true) {
            sales.items.addSalesItemsTotal.val(utils.changeThrDecimal(utils.accMul(parseFloat(sales.items.selling.val()), parseFloat(sales.items.num.val()))));
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

    function submitCheck() {
        var flag = true;
        var $_brand = sales.items.brands;
        var _brand = $_brand.attr('data-brand').split('-')[0];
        _brand = _brand.trim();
        if (_brand == "") {
            flag = false;
            $_brand.focus().select();
            com.showTip($_brand,"主材品牌不能为空!","bottom");
        } else {
            var $_lis = com.focusPage('.list-group-item');
            $.each($_lis, function (i, v) {
                var $v = $(v);
                if (_brand != $v.find('.s_brand').find('.b_brand').text().trim()) {
                    $v.css("border", "solid red 2px");
                    var r = i + 1;
                    com.showAlert(com.warning, "销售项第" + r + "项中品牌与主材品牌不符,请检查");
                    flag = false;
                }
            });
        }
        //判断是否添项
        var length = sales.items.salesItemList.find('.list-group-item').length;
        if (length == 0) {
            flag = false;
            com.showAlert(com.warning, "请添加商品信息");
        }
        return flag;

    }

    //取消提示信息
    cancelProp();

    function cancelProp() {
        var $inputs = com.focusPage('input', '#left');

        $.each($inputs, function (i, v) {
            $(this).focus(function () {
                var $div = $(this).parent().find('.popover');
                if ($div) {
                    $div.remove();
                }
            });
        });
    }
    
    function checkSetMeal() {
        var displayFunc  = (function(){
            var renderList = function(tableId,listData){
                var $tableWrap = com.focusPage('#' + tableId);

                if(listData && listData.length){

                    var $ulTitle = createTableTitle();
                    var $ulData = $('<ul></ul>').addClass('flex-table');
                    $tableWrap.append($ulTitle).append($ulData);

                    $.each(listData,function(i, v){
                        var $liLine = creatLine(i, v, i == listData.length - 1);

                        $liLine.appendTo($ulTitle);
                    });
                }
            };
            var createTableTitle = function(){

                var $ulTitle = $('<ul></ul>').addClass('flex-table');
                var $liTitle = $('<li></li>').addClass('line table-title');

                var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index'));
                var $contentWrap = $('<div></div>').addClass('line-wrap  content col7');

                var titleName = '商品编号,商品名,条形码,颜色,规格,单位,备注';

                $.each(titleName.split(','), function (i, v) {
                    var $cell = $('<div></div>').addClass('cell').html(v);
                    $cell.appendTo($contentWrap);
                });

                $liTitle.append($indexWrap).append($contentWrap).appendTo($ulTitle);
                return $ulTitle;
            };

            var creatLine = function(i, v, lastFlag){

                var $liLine = $('<li></li>').addClass('line');
                var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index').html(i + 1));
                var $contentWrap = $('<div></div>').addClass('line-wrap  content col7');
                var propertyArr = [
                    v.goods.no,
                    v.goods.name,
                    v.goods.barcode,
                    v.color.name,
                    v.format.info,
                    v.goods.measurementUnit,
                    v.comment
                ];
                $.each(propertyArr, function (i, v) {
                    var $cell = $('<div></div>').addClass('cell').html(v);
                    $cell.appendTo($contentWrap);
                });
                var $cellOption = $('<div></div>').addClass('cell option');

                var $btnGroup = $('<div></div>').addClass('btn-group');
                var $btnUl = $('<ul></ul>').addClass('dropdown-menu').addClass(lastFlag ? 'bottom-up' : '');
                $btnGroup.append($btnUl).appendTo($cellOption);
                $liLine.append($indexWrap).append($contentWrap);
                return $liLine;
            };
            return {
                init : function(tableId,listData){
                    com.focusPage('#' + tableId).html(null);
                    renderList(tableId,listData);
                },
                drawLine : function(v){
                    return creatLine(v);
                }
            };
        })();
        var $popup = sales.items.viewPopUp;
        var gid =  $popup.attr('data-gid');
        com.post(api.inventory.queryPackage,{
            "goodsPackage.pid": gid
        },function(res){
            displayFunc.init('resultList1',res.goodsPackages);
        },null,false);
    }
});