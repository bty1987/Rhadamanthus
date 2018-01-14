jQuery(function () {

    var sales = {
        queryDecorationOrderByOrderIdUrl: api.decoration.queryDecorationOrderForCommonByOrderId,
        typeahead: {
            goodes: "goodes",
            goods: "goods",
            gid: "goods.gid",
            pricegid: "price.gid",
            colorgid: "color.gid",
            formatgid: "format.gid",
        },
        gids: null,
        gtype: null,
        colorids: null,
        formatids: null,
        customerid: null,
        salesmanid: null,
        flag: true,
        salePostData: {},
    };

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
        },
        isResultTypeMap: true
        , flupdater: function (k, v) {

            $('#left').find('input').val("");
            $('#left').find('select').empty();

            //查询商品信息
            var list = this.options.list;

            sales.gids = k;

            $.each(list, function (index, val) {
                if (val.gid == k) {
                    sales.gtype = val.type;
                    $('#goodsName').attr('data-name', val.name);
                    $('#goodsNo').attr('data-no',val.no).val(val.no);
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
                    $('#purchase').bindData(priceData.prices, "pid", "selling");
                    purchase = parseFloat($purchase.find('option:selected').text());
                    var pid = $('#purchase').val();
                    com.post(api.inventory.queryPriceByPid, {
                        "price.pid": pid
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
                    sales.flag = false;
                    com.showAlert(com.warning, "该商品暂无价格信息,请录入");
                }
            }, function () {
                com.showAlert(com.error, "获取售价信息失败");
            });
            //赋值颜色信息
            com.post(api.inventory.queryColorForEnableByGid, {"color.gid": k}, function (colorData) {
                if (colorData.colors.length != 0) {
                    $('#color').bindData(colorData.colors, "cid", "name");
                    sales.colorids = $('#color').find('option:selected').val();
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
                    $('#format').bindData(formatData.formats, "fid", "info");
                    sales.formatids = $('#format').find('option:selected').val();
                } else {
                    sales.flag = false;
                    com.showAlert(com.warning, "该商品暂无规格信息,请录入");
                }
            }, function () {
                com.showAlert(com.error, "获取规格信息失败");
            });
            return v;
        }
    });
    //颜色和规格改变取ID
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
        /*
         表单校验
         */
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

            var $delete = $('<div></div>').addClass('pull-right action-button').append($('<a></a>').addClass('btn btn-danger btn-minier').html('删除'));
            var $edit = $('<div></div>').css('margin-right', '5px').addClass('pull-right action-button').append($('<a></a>').addClass('btn btn-primary btn-minier').html('查看')).click(function () {
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
            //$('.list-group-item').css("border-bottom", "none");
            //$('.list-group-item:last').css("border-bottom", "grey solid 1px");
            //清空左侧
            $('#left').find('input').val("");
            $('#left').find('select').empty();
            $('#goodsName').removeAttr('data-name');
            $('#category').removeAttr('data-category');
            $('#brand').removeAttr('data-brand');
            $('#measurementUnit').removeAttr('data-measurementUnit');
            /*
             点击删除移除数据
             */
            $delete.click(function () {
                var $this = $(this);
                var $totals = $('#totals');
                //li标签
                var $liParent = $this.parents('.list-group-item');
                //取到当前Li的总价
                var deleteNum = $liParent.find('.b_total').text();
                var totalNum = parseFloat(utils.accSub($totals.val(), deleteNum));
                $totals.val(totalNum);
                $liParent.remove();
                $('.list-group-item:last').css("border-bottom", "solid 1px");
            });

            $('#totals').val(cycTotal());

        } else if (sales.flag == false) {
            com.showAlert(com.warning, "商品信息不完善,请先完善商品信息");
        }
    });

    $('#refresh').click(function () {
        $('#left').find('input').popover('destroy').css('border-color', "#b5b5b5").val("");
        $('#left').find('select').empty();
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
            $('#disPrice').val(utils.accMul(parseFloat($('#purchase').find('option:selected').text()), parseFloat($('#discount').val())));
            $('#selling').val(utils.accMul(parseFloat($('#disPrice').val()), parseFloat($('#postDis').val())));
            $('#total').val(utils.accMul(parseFloat($('#selling').val()), parseFloat($('#num').val())));
        } else if (flag == true && boolean == false) {
            $('#selling').val(utils.accMul(parseFloat($('#disPrice').val()), parseFloat($('#postDis').val())));
            $('#total').val(utils.accMul(parseFloat($('#selling').val()), parseFloat($('#num').val())));
        } else if (flag == false && boolean == true) {
            $('#total').val(utils.accMul(parseFloat($('#selling').val()), parseFloat($('#num').val())));
            $('#postDis').val((utils.accDiv(parseFloat($('#selling').val()), parseFloat($('#disPrice').val()))).toFixed(2));
        }
    }

//先判断是否为NaN 不是的话不允许计算

    function cycTotal() {

        var _total = 0;

        var $li = $('.list-group-item');

        $li.length && $li.each(function (i, v) {
            var $this = $(v);
            _total = utils.accAdd(_total, parseFloat($this.find('.b_total').text()));
        });

        return _total;
    }

    //订单区
//根据订单号查询出客户姓名 业务员和楼盘地址信息
    $('#orderId').on("change", function () {

        var option = {};
        option["decorationOrder.orderId"] = $('#orderId').val();
        com.post(sales.queryDecorationOrderByOrderIdUrl, option, function (data) {
            $("#customerName").val(data.decorationOrder.customer.customerName);
            $("#salesmanName").removeAttr('data-typeahead-key').val(data.decorationOrder.designer);
            $("#orderAddr").val(data.decorationOrder.village.villageName + " " + data.decorationOrder.houseNumber);

            if ($('#searchInfo').find('#customerName').val() != "") {
                $('#searchInfo').find('#customerName').next().remove();
            }
            if ($('#searchInfo').find("#salesmanName").val() != "") {
                $('#searchInfo').find('#salesmanName').next().remove();
            }
            if ($('#searchInfo').find("#orderAddr").val() != "") {
                $('#searchInfo').find('#orderAddr').next().remove();
            }
            //客户Id
            sales.customerid = data.decorationOrder.customer.customerId;
            //业务员Id
            sales.salesmanid = data.decorationOrder.designerId;
            //楼盘id
            sales.salePostData["sales.village.villageId"] = data.decorationOrder.village.villageId;
            //楼盘编号
            if (data.decorationOrder.houseNumber == null) {
                sales.salePostData["sales.houseNumber"] = "";
            } else {
                sales.salePostData["sales.houseNumber"] = data.decorationOrder.houseNumber;
            }
            sales.salePostData["sales.dompanys"] = data.decorationOrder.dompany;

        }, function (e) {
            com.showAlert(null, "未查询到此订单!");
            $("#customerName").val(null);
            $("#salesmanName").val(null);
            $("#orderAddr").val(null);
        });
    });

    //业务员发生改变
    $('#salesmanName').typeahead({
        url: api.personel.queryUserForNameByDuty,//获取下拉列表的接口
        list: [],
        postData: {},//获取下拉列表的参数
        source: function (query, process) {
            var options = $.extend({pinyinName: query, duty: ""}, this.options.postData);
            com.post(this.options.url, options, $.proxy(this.options.callback, this));
        }, matcher: function (item) {
            return true;
        }, callback: function (data) {
            this.options.list = data["autoFillKeyValue"];
            this.flprocess(this.options.list, ["key"], ["value"]);
        },
        isResultTypeMap: true //必填值为true,获取key,value的标识,
        , flupdater: function (k, v) {//下拉列表选中时的一些处理,必填对选中项的key和value做处理
            return v;
        }
    });
    //主材驻店
    $('#instorer').typeahead({
        url: api.personel.queryUserForNameByDuty,//获取下拉列表的接口
        list: [],
        postData: {},//获取下拉列表的参数
        source: function (query, process) {
            var options = $.extend({pinyinName: query, duty: ""}, this.options.postData);
            com.post(this.options.url, options, $.proxy(this.options.callback, this));
        }, matcher: function (item) {
            return true;
        }, callback: function (data) {
            this.options.list = data["autoFillKeyValue"];
            this.flprocess(this.options.list, ["key"], ["value"]);
        },
        isResultTypeMap: true //必填值为true,获取key,value的标识,
        , flupdater: function (k, v) {//下拉列表选中时的一些处理,必填对选中项的key和value做处理
            return v;
        }
    });
    //主材导购
    $('#guider').typeahead({
        url: api.personel.queryUserForNameByDuty,
        list: [],
        postData: {},//获取下拉列表的参数
        source: function (query, process) {
            var options = $.extend({pinyinName: query, duty: ""}, this.options.postData);
            com.post(this.options.url, options, $.proxy(this.options.callback, this));
        }, matcher: function (item) {
            return true;
        }, callback: function (data) {
            this.options.list = data["autoFillKeyValue"];
            this.flprocess(this.options.list, ["key"], ["value"]);
        },
        isResultTypeMap: true //必填值为true,获取key,value的标识,
        , flupdater: function (k, v) {//下拉列表选中时的一些处理,必填对选中项的key和value做处理
            return v;
        }
    });
    //主材品牌
    $('#brands').typeahead({
        url: api.data.queryBrandForPinYinNameACategoryName,
        list: [],
        postData: {},//获取下拉列表的参数
        source: function (query, process) {
            var options = $.extend({pinyinName: query}, this.options.postData);
            com.post(this.options.url, options, $.proxy(this.options.callback, this));
        }, matcher: function (item) {
            return true;
        }, callback: function (data) {
            this.options.list = data["autoFillKeyValue"];
            this.flprocess(this.options.list, ["key"], ["value"]);
        },
        isResultTypeMap: true //必填值为true,获取key,value的标识,
        , flupdater: function (k, v) {//下拉列表选中时的一些处理,必填对选中项的key和value做处理
            $('#brands').attr('data-brand', v);
            return v;
        }
    });
    //绑定券信息
    com.post(api.ds.payment, {}, function (res) {
        $("#couponInfo").bindData(res.materialCouponTypes, 'key', 'value', false);
    }, null, false);

    // 销售单区 提交
    //进行主材品类的校验不是同一品牌不能提交
    //取参数添加
    $('#submit').click(function () {

        var _option = {};

        if (com.validate('searchInfo', 'bottom') == false) {

            if (submitCheck() == false) {
                return
            }

            _option = {
                "sales.orderId": $('#orderId').val(),
                "sales.customer.customerId": sales.customerid,
                "sales.guider.userId": $('#guider').attr('data-typeahead-key'),
                "sales.instorer.userId": $('#instorer').attr('data-typeahead-key'),
                "sales.category": $('#brands').attr('data-brand').split('-')[1],
                "sales.brand": $('#brands').attr('data-brand').split('-')[0],
                "sales.coupon": $('#coupon').val() != "" ? parseFloat($('#coupon').val()) : 0,
                "sales.comment": $('#comment').val(),
                "sales.maling": $('#maling').val() != "" ? parseFloat($('#maling').val()) : 0,
                "sales.total": isNaN(parseFloat($('#totals').val())) ? 0 : parseFloat($('#totals').val()),
                "sales.fullpayStatus": -1,
                "sales.depositpayStatus": -1,
                "sales.village.villageId": sales.salePostData["sales.village.villageId"],
                "sales.houseNumber": sales.salePostData["sales.houseNumber"],
                "sales.dompanys": sales.salePostData["sales.dompanys"],
            }

            //客户id
            //业务员(有问题)
            if ($('#salesmanName')[0].hasAttribute('data-typeahead-key')) {
                _option["sales.salesman.userId"] = $('#salesmanName').attr('data-typeahead-key');
            } else {
                _option["sales.salesman.userId"] = sales.salesmanid;
            }

            if ($('#coupon').val() == "" || $('#coupon').val() == 0) {
                _option["sales.couponInfo"] = " ";
            } else {
                _option["sales.couponInfo"] = '#' + $('#couponInfo').val() + ':' + $('#coupon').val() + '#';
            }

            //折让审批
            var $lis = $('.list-group-item');
            var $otherStatus = 0;
            $lis && $lis.length && $.each($lis, function (i, v) {
                var $v = $(v);
                var $status = $v.attr('data-otherStatus');
                if ($status == 1) {
                    $otherStatus = 1;
                }
            })
            //折让审批状态 0不需要低折审批  1需要低折审批
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
            });

            com.post(api.inventory.addSales, _option, function (data) {
                com.showAlert(null, "添加成功");

                //清空销售项
                $('#salesItemList').empty();
                //清空类为order_inputinfo的input
                $('.order_inputinfo').val(null);

                //删除data-typeahead-key属性
                $('#salesmanName').removeAttr('data-typeahead-key');
                $('#instorer').removeAttr('data-typeahead-key');
                $('#guider').removeAttr('data-typeahead-key');
                $('#brands').removeAttr('data-brand');

            }, function (e) {
                com.showAlert(com.error, "添加失败");
            });
        }
    });

//检查主材品牌 订单号 主材导购 主材驻店
    function submitCheck() {

        var flag = true;

        var $_brand = $('#brands');
        var _brand = ""
        if ($_brand.attr('data-brand')) {
            _brand = $_brand.attr('data-brand').split('-')[0];
        }

        //判断品牌差异
        var $_lis = $('.list-group-item');
        $.each($_lis, function (i, v) {
            var $v = $(v);
            if (_brand != $v.find('.b_brand').text()) {
                $v.css("border", "solid red 2px");
                var r = i + 1;
                com.showAlert(null, "销售项第" + r + "项中品牌与主材品牌不符,请检查");
                flag = false;
            }
        });
        return flag;
    }

    //取消提示信息
    cancelProp();

    function cancelProp() {
        var $inputs = $('input', '#left');
        //获得右侧input焦点事件重置input为初始,进而取消提示
        var $inputss = $('input', '#searchInfo').focus(function cls() {
            $('input', '#searchInfo').text("");
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

    //查看套餐弹窗
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