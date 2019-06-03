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
        com.focusPage('#orderNo').val(res.sales.orderId);
        com.focusPage('#customerName').val(res.sales.customer.name);
        com.focusPage('#salesmanName').val(res.sales.salesman.currentName);
        com.focusPage('#instorer').val(res.sales.instorer.currentName);
        com.focusPage('#guider').val(res.sales.guider.currentName);
        com.focusPage('#brands').attr({'data-brand': res.sales.brand,'data-category':res.sales.category}).val(res.sales.brand+'-'+res.sales.category);
        com.focusPage('#coupon').val(res.sales.coupon);
        com.focusPage('#couponInfoo').val(res.sales.couponInfoo);
        com.focusPage('#pretotals').val(res.sales.total);
        com.focusPage('#comment').val(res.sales.comment);
        com.focusPage('#orderAdd').val(res.sales.house.village.name + " " + res.sales.house.houseNumber);
        sales.otherStatus = res.sales.otherStatus;

    }, null, false);
    /**销售项区 自动赋值 (校验同品牌)
     * 带出商品信息
     */

    com.initTypeahead('goodsName', api.inventory.queryGoodsByName, "goods.name", {}, 'goodes', 'gid', 'name', function (list, k, v) {
        
        var $content = com.focusPage('#left');
        sales.gids = k;
        //赋值商品信息
        $.each(list, function (index, val) {
            if (val.gid == k) {
                sales.gtype = val.type;
                com.focusPage('#goodsName').attr('data-name', val.name);
                com.focusPage('#goodsNo').attr('data-no', val.no).val(val.no);
                com.focusPage('#category').attr('data-category', val.category).val(val.category);
                com.focusPage('#brand').attr('data-brand', val.brand).val(val.brand);
                com.focusPage('#measurementUnit').attr('data-measurementUnit', val.measurementUnit).val(val.measurementUnit);
            }
        });
        //赋值售价信息
        com.post(api.inventory.queryPriceByGid, {"price.gid": k}, function (priceData) {
            if (priceData.prices.length != 0) {
                var $purchase = com.focusPage('#purchase');
                $purchase.bindData(priceData.prices, "pid", "content",false,null,"selling");
                com.post(api.inventory.queryPriceByPid, {
                    "price.pid": com.focusPage('#purchase').val()
                }, function (data) {
                    com.focusPage('#bid').attr({
                        'data-ctype': data.price.ctype,
                        "data-cvalue": data.price.cvalue,
                        "data-priceType": data.price.type
                    }).val(data.price.purchase);

                });
                com.focusPage('#discount').val(1);
                com.focusPage('#disPrice').val(utils.accMul(parseFloat(com.focusPage('#purchase').find('option:selected').attr("other")), parseFloat(com.focusPage('#discount').val())));
                com.focusPage('#postDis').val(1);
                com.focusPage('#selling').val(utils.accMul(parseFloat(com.focusPage('#disPrice').val()), parseFloat(com.focusPage('#postDis').val())));
                com.focusPage('#num').val(1);
                com.focusPage('#total').val(utils.accMul(parseFloat(com.focusPage('#selling').val()), parseFloat(com.focusPage('#num').val())));
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
                var color = com.focusPage('#color');
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
                sales.formatids = com.focusPage('#format').find('option:selected').val();
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

    com.focusPage('#color').on("change", function () {
        sales.colorids = com.focusPage('#color').find('option:selected').val();
    });
    com.focusPage('#format').on("change", function () {
        sales.formatids = com.focusPage('#format').find('option:selected').val();
    });
    com.focusPage('#purchase').on("change", function () {
        com.post(api.inventory.queryPriceByPid, {
            "price.pid": com.focusPage('#purchase').val()
        }, function (data) {
            com.focusPage('#bid').attr({'data-ctype': data.price.ctype, "data-cvalue": data.price.cvalue, "data-priceType": data.price.type}).val(data.price.purchase);
        });
    });
    //点击添加按钮
    com.focusPage("#add").click(function () {

        if (com.validate('left', 'bottom') == false && sales.flag == true) {
            //折让价
            var $selling = parseFloat(com.focusPage('#selling').val());
            //折扣价
            var $disPrice = parseFloat(com.focusPage('#disPrice').val());
            //售价
            var $purchase = parseFloat(com.focusPage('#purchase option:selected').attr("other"));
            //折扣
            var $discount = parseFloat(com.focusPage('#discount').val());

            var $otherStatus = 0;

            if ($selling != $disPrice) {
                $otherStatus = 1;
            }

            var $liList = $('<li></li>').addClass('list-group-item').attr({
                'data-discount': $discount,
                'data-selling': $selling,
                'data-purchase': $purchase,
                'data-disPrice': $disPrice,
                'data-postDis': com.focusPage('#postDis').val(),
                'data-otherStatus': $otherStatus
            });

            var $h4 = $('<h4></h4>').html(com.focusPage('#goodsName').attr('data-name') + ' ' + com.focusPage('#goodsNo').attr('data-no')).attr('addData', sales.gids);

            var $delete = $('<div></div>').addClass('pull-right action-button').append($('<a></a>').addClass('btn red btn-minier').html('删除'));
            var $edit = $('<div></div>').css('margin-right', '5px').addClass('pull-right action-button').append($('<a></a>').addClass('btn blue btn-minier _delete').html('查看')).click(function () {
                openPackageGoods($h4.attr('addData'));
            });


            $h4.append($delete).appendTo($liList);
            if (sales.gtype == 1) {
                $h4.append($edit);
            }

            var currentPriceType = com.focusPage('#bid').attr('data-priceType');

            $liList.append(addSpan('品类：', 's_category', com.focusPage('#category').val(), " ", 'b_category', null))
                .append(addSpan('品牌：', 's_brand', com.focusPage('#brand').val(), " ", 'b_brand', null))
                .append(addSpan('单位：', 's_unit', com.focusPage('#measurementUnit').val(), " ", 'b_unit', null))
                .append(addSpan('颜色：', 's_color', com.focusPage('#color').find("option:selected").text(), " ", 'b_color', sales.colorids))
                .append(addSpan('规格：', 's_format', com.focusPage('#format').find("option:selected").text(), " ", 'b_format', sales.formatids))
                .append(addSpan('售价：', 's_selling', com.focusPage('#purchase').find("option:selected").attr("other"), 'blue', 'b_selling', null))
                .append(addSpan('折扣价：', 's_countSelling', com.focusPage('#disPrice').val(), 'blue', 'b_countSelling', null))
                .append(addSpan('折让价：', 's_price', com.focusPage('#selling').val(), 'blue', 'b_price', null))
                .append(addSpan('数量：', 's_number', com.focusPage('#num').val(), 'red', 'b_number'))
                .append(addSpan('总价：', 's_total', com.focusPage('#total').val(), 'blue', 'b_total', null))
                .append(addSpan('备注：', 's_remark', com.focusPage('#remark').val(), " ", 'b_remark', null))
                .append($('<span></span>').css('display', 'none').text(com.focusPage('#bid').val()).attr("id", "invisiblePurchase"))
                .append($('<span></span>').css('display', 'none').text(com.focusPage('#bid').attr('data-ctype')).attr("id", "invisibleCtype"))
                .append($('<span></span>').css('display', 'none').text(com.focusPage('#bid').attr('data-cvalue')).attr("id", "invisibleCvalue"))
                .append($('<span></span>').css('display', 'none').text(currentPriceType).attr("id", "invisiblePriceType"));
            com.focusPage('#salesItemList').append($liList);
            //给最后一个li标签加上底框,除了最后一个li 其他的li均无底框
            com.focusPage('.list-group-item').css("border-bottom", "none");
            com.focusPage('.list-group-item:last').css("border-bottom", "grey solid 1px");
            //清空左侧
            com.cleanTypeahead("goodsName");
            com.focusPage('#left').find('input').val("");
            com.focusPage('#left').find('select').empty();
            com.focusPage('#goodsName').removeAttr('data-name');
            com.focusPage('#category').removeAttr('data-category');
            com.focusPage('#brand').removeAttr('data-brand');
            com.focusPage('#measurementUnit').removeAttr('data-measurementUnit');
            /*
             点击删除移除数据 改变总价
             */
            $delete.click(function () {
                var $this = $(this);
                //li标签
                var $liParent = $this.parents('.list-group-item');
                //取到当前Li的总价
                var deleteNum = parseFloat($liParent.find('.b_total').text());
                com.focusPage('#totals').val(parseFloat(utils.accSub(com.focusPage('#totals').val(), deleteNum)));
                $liParent.remove();
                com.focusPage('.list-group-item:last').css("border-bottom", "solid 1px");
            });
        }
        com.focusPage('#totals').val(cycTotal());
    });

    /*
    添加span b
     */
    function addSpan(sValue, sclass, bValue, color, attrs, addData) {
        var $span = $('<span></span>').addClass(sclass);
        var $b = $('<b></b>');
        if (sValue != null) {
            $span.html(sValue);
        }
        if (bValue != null) {
            $b.html(bValue);
        }
        if (color != null) {
            $b.addClass(color + " " + attrs).attr('addData', addData);
        }

        $span.append($b);

        return $span;

    }

    /*
    折扣价 折让 折让价 数量变化
        折扣价变化 影响折让价和总价 折让变化影响折让价和总价 数量变化影响总价
     */
    com.focusPage('#purchase').on("change", function () {
        count(true, true);
    });
    com.focusPage('#disPrice').on("change", function () {
        count(true, false);
    });
    com.focusPage('#postDis').on("change", function () {
        count(true, false);
    });
    com.focusPage('#num').on("change", function () {
        count(false, true);
    });
    com.focusPage('#selling').on("change", function () {
        count(false, true);
    });

    function count(flag, boolean) {
        if (flag == true && boolean == true) {
            com.focusPage('#disPrice').val(utils.changeTwoDecimal(utils.accMul(parseFloat(com.focusPage('#purchase').find('option:selected').attr("other")), parseFloat(com.focusPage('#discount').val()))));
            com.focusPage('#selling').val(utils.changeTwoDecimal(utils.accMul(parseFloat(com.focusPage('#disPrice').val()), parseFloat(com.focusPage('#postDis').val()))));
            com.focusPage('#total').val(utils.changeTwoDecimal(utils.accMul(parseFloat(com.focusPage('#selling').val()), parseFloat(com.focusPage('#num').val()))));
        } else if (flag == true && boolean == false) {
            com.focusPage('#selling').val(utils.changeTwoDecimal(utils.accMul(parseFloat(com.focusPage('#disPrice').val()), parseFloat(com.focusPage('#postDis').val()))));
            com.focusPage('#total').val(utils.changeTwoDecimal(utils.accMul(parseFloat(com.focusPage('#selling').val()), parseFloat(com.focusPage('#num').val()))));
        } else if (flag == false && boolean == true) {
            com.focusPage('#total').val(utils.changeTwoDecimal(utils.accMul(parseFloat(com.focusPage('#selling').val()), parseFloat(com.focusPage('#num').val()))));
            com.focusPage('#postDis').val((utils.accDiv(parseFloat(com.focusPage('#selling').val()), parseFloat(com.focusPage('#disPrice').val()))).toFixed(2));
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

    // 销售单区 提交
    com.focusPage('#submit').click(function () {
        if (submitCheck()) {
            var $preTotals = com.focusPage('#pretotals');
            var $total = com.focusPage('#totals');
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

                com.focusPage('#salesItemList').empty();
                //更新添项中的总额和抹零信息
                $preTotals.val(utils.accAdd(parseFloat($preTotals.val()), parseFloat($total.val())));
                //更新总额
                com.focusPage('#totals').val("");
                com.showAlert(com.info, "添加成功");
            });
        }

    });

    //检查主材品牌 是否添项
    function submitCheck() {
        var flag = true;
        var $_brand = com.focusPage('#brands');
        var _brand = $_brand.attr('data-brand').split('-')[0];
        _brand = _brand.trim();
        if (_brand == "") {
            flag = false;
            $_brand.focus().select();
            $_brand.addClass('popover-notitle').attr({
                "data-rel": "popover",
                "data-placement": "bottom",
                "data-original-title": "",
                "title": "",
                "data-content": "主材品牌不能为空"
            }).popover('show');
        } else {
            $_brand.popover('destroy');
            //判断品牌差异
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
        var length = com.focusPage('#salesItemList').find('.list-group-item').length;
        if (length == 0) {
            flag = false;
            com.showAlert(com.warning, "请添加商品信息");
        }
        return flag;

    }

    //点击返回
    com.focusPage('#back').click(function () {
        com.switchPage('views/sales/sales.html');
    });

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

    function openPackageGoods(gid) {
        var $popup = com.focusPage('#viewPopUp');
        $popup.attr({'data-gid': gid});
        //弹出即全屏
        layer.open({
            type: 1,
            skin: 'layui-layer-molv',
            title: "查看套餐",
            content: $popup,
            area: ["1400px", ( $(window).height() * 0.84 < 720 ? $(window).height() * 0.84 : 720 ) + "px"],
            //maxmin: true,
            zIndex: 9000,
            btn: ['确定'],
            success: function (layer, index) {
                $popup.load("views/sales/viewSalesPackageGoods.html");
            },
            end: function () {
                $popup.attr('data-gid', null);
            }
        });
    }

});