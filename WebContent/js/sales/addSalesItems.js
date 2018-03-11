jQuery(function () {
    var sales = {
        queryDecorationByOrderIdUrl: api.decoration.queryDecorationForCommonByOrderId,
        typeahead: {
            goodes: "goodes",
            goods: "goods",
            gid: "goods.gid",
            pricegid: "price.gid",
            colorgid: "color.gid",
            formatgid: "format.gid",
        },
        addSalesItemsPostData: {},
        gids: null,
        gtype: null,
        colorids: null,
        formatids: null,
        flag: false,
        sid: params.sid,
        otherStatus:null,
    };

    com.post(api.inventory.querySalesBySid, {
        "sales.sid": sales.sid
    }, function (res) {
        $('#orderNo').val(res.sales.orderId);
        $('#customerName').val(res.sales.customer.name);
        $('#salesmanName').val(res.sales.salesman.currentName);
        $('#instorer').val(res.sales.instorer.currentName);
        $('#guider').val(res.sales.guider.currentName);
        $('#brands').attr({'data-brand': res.sales.brand,'data-category':res.sales.category}).val(res.sales.brand+'-'+res.sales.category);
        $('#coupon').val(res.sales.coupon);
        $('#couponInfoo').val(res.sales.couponInfoo);
        $('#pretotals').val(res.sales.total);
        $('#comment').val(res.sales.comment);
        $('#orderAdd').val(res.sales.house.village.name + " " + res.sales.house.houseNumber);
        sales.otherStatus = res.sales.otherStatus;

    }, null, false);
    /**销售项区 自动赋值 (校验同品牌)
     * 带出商品信息
     */
    //销售项区 自动赋值
    $('#goodsName').typeahead({
        url: api.inventory.queryGoodsByName,
        list: [],
        postData: {},
        source: function (query, process) {
            var params = $.extend({
                "goods.name": query,
                "goods.pinyin": query,
                "goods.no": query
            }, this.options.postData);
            com.post(this.options.url, params, $.proxy(this.options.callback, this));
        }, matcher: function (item) {
            return true;
        }, callback: function (data) {
            sales.flag = true;
            this.options.list = data['goodes'];
            this.flprocess(this.options.list, 'gid', 'name');
            $('.typeahead').css("left", "33px");
        },
        isResultTypeMap: true
        , flupdater: function (k, v) {
            //k---gid  v---name
            var $content = $('#left');
            sales.gids = k;
            //赋值商品信息
            var list = this.options.list;
            $.each(list, function (index, val) {
                if (val.gid == k) {
                    sales.gtype = val.type;
                    $('#goodsName').attr('data-name', val.name);
                    $('#goodsNo').attr('data-no', val.no).val(val.no);
                    $('#category').attr('data-category', val.category).val(val.category);
                    $('#brand').attr('data-brand', val.brand).val(val.brand);
                    $('#measurementUnit').attr('data-measurementUnit', val.measurementUnit).val(val.measurementUnit);
                }
            });
            //赋值售价信息
            com.post(api.inventory.queryPriceByGid, {"price.gid": k}, function (priceData) {
                if (priceData.prices.length != 0) {
                    var purchase;
                    var $purchase = $('#purchase');
                    $purchase.bindData(priceData.prices, "pid", "selling");
                    purchase = parseFloat($purchase.find('option:selected').text());
                    com.post(api.inventory.queryPriceByPid, {
                        "price.pid": $('#purchase').val()
                    }, function (data) {
                        $('#bid').attr({
                            'data-ctype': data.price.ctype,
                            "data-cvalue": data.price.cvalue
                        }).val(data.price.purchase);

                    });
                    $('#discount').val(1);
                    $('#disPrice').val(utils.accMul(parseFloat($('#purchase').find('option:selected').text()), parseFloat($('#discount').val())));
                    $('#postDis').val(1);
                    $('#selling').val(utils.accMul(parseFloat($('#disPrice').val()), parseFloat($('#postDis').val())));
                    $('#num').val(1);
                    $('#total').val(utils.accMul(parseFloat($('#selling').val()), parseFloat($('#num').val())));
                } else {
                    com.showAlert(com.warning, "该商品暂无价格信息,请录入");
                    sales.flag = false;
                }
            }, function () {
                com.showAlert(null, "获取售价信息失败");
            });
            //赋值颜色信息
            com.post(api.inventory.queryColorForEnableByGid, {"color.gid": k}, function (colorData) {
                if (colorData.colors.length != 0) {
                    var color = $('#color');
                    $content.find('#color').bindData(colorData.colors, "cid", "name");
                    sales.colorids = color.find('option:selected').val();
                } else {
                    com.showAlert(com.warning, "该商品暂无颜色信息,请录入");
                    sales.flag = false;
                }
            }, function () {
                com.showAlert(null, "获取颜色信息失败");
            });
            //赋值规格信息
            com.post(api.inventory.queryFormatForEnableByGid, {"format.gid": k}, function (formatData) {
                if (formatData.formats.length != 0) {
                    $content.find('#format').bindData(formatData.formats, "fid", "info");
                    sales.formatids = $('#format').find('option:selected').val();
                } else {
                    com.showAlert(com.warning, "该商品暂无规格信息,请录入");
                    sales.flag = false;
                }
            }, function () {
                com.showAlert(null, "获取规格信息失败");
            });
            return v;
        }
    });

    //若 颜色和规格改变动态取ID
    $('#color').on("change", function () {
        sales.colorids = $('#color').find('option:selected').val();
    });
    $('#format').on("change", function () {
        sales.formatids = $('#format').find('option:selected').val();
    });
    $('#purchase').on("change", function () {
        com.post(api.inventory.queryPriceByPid, {
            "price.pid": $('#purchase').val()
        }, function (data) {
            $('#bid').attr({'data-ctype': data.price.ctype, "data-cvalue": data.price.cvalue}).val(data.price.purchase);
        });
    });
    //点击添加按钮
    $("#add").click(function () {

        if (com.validate('left', 'bottom') == false && sales.flag == true) {

            //折让价
            var $selling = parseFloat($('#selling').val());
            //折扣价
            var $disPrice = parseFloat($('#disPrice').val());
            //售价
            var $purchase = parseFloat($('#purchase option:selected').text());
            //折扣
            var $discount = parseFloat($('#discount').val());

            var $otherStatus = 0;

            if ($selling != $disPrice || $purchase * $discount != $disPrice) {
                $otherStatus = 1;
            }

            var $liList = $('<li></li>').addClass('list-group-item').attr({
                'data-discount': $discount,
                'data-selling': $selling,
                'data-purchase': $purchase,
                'data-disPrice': $disPrice,
                'data-postDis': $('#postDis').val(),
                'data-otherStatus': $otherStatus
            });

            var $h4 = $('<h4></h4>').html($('#goodsName').attr('data-name') + ' ' + $('#goodsNo').attr('data-no')).attr('addData', sales.gids);

            var $delete = $('<div></div>').addClass('pull-right action-button').append($('<a></a>').addClass('btn red btn-minier').html('删除'));
            var $edit = $('<div></div>').css('margin-right', '5px').addClass('pull-right action-button').append($('<a></a>').addClass('btn blue btn-minier _delete').html('查看')).click(function () {
                openPackageGoods($h4.attr('addData'));
            });


            $h4.append($delete).appendTo($liList);
            if (sales.gtype == 1) {
                $h4.append($edit);
            }
            $liList.append(addSpan('品类：', 's_category', $('#category').val(), " ", 'b_category', null)).append(addSpan('品牌：', 's_brand', $('#brand').val(), " ", 'b_brand', null)).append(addSpan('单位：', 's_unit', $('#measurementUnit').val(), " ", 'b_unit', null)).append(addSpan('颜色：', 's_color', $('#color').find("option:selected").text(), " ", 'b_color', sales.colorids)).append(addSpan('规格：', 's_format', $('#format').find("option:selected").text(), " ", 'b_format', sales.formatids)).append(addSpan('售价：', 's_selling', $('#purchase').find("option:selected").text(), 'blue', 'b_selling', null)).//append(addSpan('折扣：','s_count',$('#discount').val(),'red','b_count',null)).
            append(addSpan('折扣价：', 's_countSelling', $('#disPrice').val(), 'blue', 'b_countSelling', null)).//append(addSpan('折让：','s_zherang',$('#postDis').val(),'red','b_zherang',null)).
            append(addSpan('折让价：', 's_price', $('#selling').val(), 'blue', 'b_price', null)).append(addSpan('数量：', 's_number', $('#num').val(), 'red', 'b_number')).append(addSpan('总价：', 's_total', $('#total').val(), 'blue', 'b_total', null)).append(addSpan('备注：', 's_remark', $('#remark').val(), " ", 'b_remark', null)).append($('<span></span>').css('display', 'none').text($('#bid').val()).attr("id", "invisiblePurchase")).append($('<span></span>').css('display', 'none').text($('#bid').attr('data-ctype')).attr("id", "invisibleCtype")).append($('<span></span>').css('display', 'none').text($('#bid').attr('data-cvalue')).attr("id", "invisibleCvalue"));
            $('#salesItemList').append($liList);
            //给最后一个li标签加上底框,除了最后一个li 其他的li均无底框
            $('.list-group-item').css("border-bottom", "none");
            $('.list-group-item:last').css("border-bottom", "grey solid 1px");
            //清空左侧
            $('#left').find('input').val("");
            $('#left').find('select').empty();
            $('#goodsName').removeAttr('data-name');
            $('#category').removeAttr('data-category');
            $('#brand').removeAttr('data-brand');
            $('#measurementUnit').removeAttr('data-measurementUnit');
            /*
             点击删除移除数据 改变总价
             */
            $delete.click(function () {
                var $this = $(this);
                //li标签
                var $liParent = $this.parents('.list-group-item');
                //取到当前Li的总价
                var deleteNum = parseFloat($liParent.find('.b_total').text());
                $('#totals').val(parseFloat(utils.accSub($('#totals').val(), deleteNum)));
                $liParent.remove();
                $('.list-group-item:last').css("border-bottom", "solid 1px");
            });
        }
        $('#totals').val(cycTotal());
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

        $span.append($b)

        return $span;

    }

    /*
    折扣价 折让 折让价 数量变化
        折扣价变化 影响折让价和总价 折让变化影响折让价和总价 数量变化影响总价
     */
    $('#purchase').on("change", function () {
        count(true, true);
    });
    $('#disPrice').on("change", function () {
        count(true, false);
    });
    $('#postDis').on("change", function () {
        count(true, false);
    });
    $('#num').on("change", function () {
        count(false, true);
    });
    $('#selling').on("change", function () {
        count(false, true);
    });

    function count(flag, boolean) {
        if (flag == true && boolean == true) {
            $('#disPrice').val(utils.changeTwoDecimal(utils.accMul(parseFloat($('#purchase').find('option:selected').text()), parseFloat($('#discount').val()))));
            $('#selling').val(utils.changeTwoDecimal(utils.accMul(parseFloat($('#disPrice').val()), parseFloat($('#postDis').val()))));
            $('#total').val(utils.changeTwoDecimal(utils.accMul(parseFloat($('#selling').val()), parseFloat($('#num').val()))));
        } else if (flag == true && boolean == false) {
            $('#selling').val(utils.changeTwoDecimal(utils.accMul(parseFloat($('#disPrice').val()), parseFloat($('#postDis').val()))));
            $('#total').val(utils.changeTwoDecimal(utils.accMul(parseFloat($('#selling').val()), parseFloat($('#num').val()))));
        } else if (flag == false && boolean == true) {
            $('#total').val(utils.changeTwoDecimal(utils.accMul(parseFloat($('#selling').val()), parseFloat($('#num').val()))));
            $('#postDis').val((utils.accDiv(parseFloat($('#selling').val()), parseFloat($('#disPrice').val()))).toFixed(2));
        }
    }

    function cycTotal() {
        var _total = 0;
        var $li = $('.list-group-item');
        $li.length && $li.each(function (i, v) {
            var $this = $(v);
            _total = utils.accAdd(_total, parseFloat($this.find('.b_total').text()));
        });
        return _total;
    }

    // 销售单区 提交
    $('#submit').click(function () {
        if (submitCheck()) {
            var $preTotals = $('#pretotals');
            var $total = $('#totals');
            var options = {};
            var $lis = $('.list-group-item');

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

            });

            com.post(api.inventory.addSalesItem, options, function (data) {

                $('#salesItemList').empty();
                //更新添项中的总额和抹零信息
                $preTotals.val(utils.accAdd(parseFloat($preTotals.val()), parseFloat($total.val())));
                //更新总额
                $('#totals').val("");
                com.showAlert(null, "添加成功");
            });
        }

    });

//检查主材品牌 是否添项
    function submitCheck() {
        var flag = true;
        var $_brand = $('#brands');
        var _brand = $_brand.attr('data-brand').split('-')[0];
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
            var $_lis = $('.list-group-item');
            $.each($_lis, function (i, v) {
                var $v = $(v);
                if (_brand != $v.find('.s_brand').find('.b_brand').text()) {
                    $v.css("border", "solid red 2px");
                    var r = i + 1;
                    com.showAlert(null, "销售项第" + r + "项中品牌与主材品牌不符,请检查");
                    flag = false;
                }
            });
        }
        //判断是否添项
        var length = $('#salesItemList').find('.list-group-item').length;
        if (length == 0) {
            flag = false;
            com.showAlert(null, "请添加商品信息");
        }
        return flag;

    }

//点击返回

    $('#back').click(function () {
        com.switchPage('views/sales/sales.html');
    });

    //取消提示信息
    cancelProp();

    function cancelProp() {
        var $inputs = $('input', '#left');

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
        var $popup = $('#viewPopUp');
        $popup.attr({'data-gid': gid});
        //弹出即全屏
        var index = layer.open({
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