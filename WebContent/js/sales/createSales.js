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
        com.focusPage('#left').find('input').val("");
        com.focusPage('#left').find('select').empty();
        //查询商品信息
        sales.gids = k;

        $.each(list, function (index, val) {
            if (val.gid == k) {
                sales.gtype = val.type;
                com.focusPage('#goodsName').attr('data-name', val.name);
                com.focusPage('#goodsNo').attr('data-no',val.no).val(val.no);
                com.focusPage('#category').attr('data-category', val.category).val(val.category);
                com.focusPage('#brand').attr('data-brand', val.brand).val(val.brand);
                com.focusPage('#measurementUnit').attr('data-measurementUnit', val.measurementUnit).val(val.measurementUnit);
            }
        });
        //赋值售价信息
        com.post(api.inventory.queryPriceByGid, {"price.gid": k}, function (priceData) {
            if (priceData.prices.length != 0) {

                com.focusPage('#purchase').bindData(priceData.prices, "pid", "content",false,null,"selling");
                var pid = com.focusPage('#purchase').val();
                com.post(api.inventory.queryPriceByPid, {
                    "price.pid": pid
                }, function (data) {
                    com.focusPage('#bid').attr({
                        'data-ctype': data.price.ctype,
                        "data-cvalue": data.price.cvalue,
                        "data-priceType": data.price.type
                    }).val(data.price.purchase);
                });
                com.focusPage('#discount').val(1);
                com.focusPage('#disPrice').val(utils.accMul(parseFloat(com.focusPage('#purchase').find('option:selected').attr('other')), parseFloat(com.focusPage('#discount').val())));
                com.focusPage('#postDis').val(1);
                com.focusPage('#selling').val(utils.accMul(parseFloat(com.focusPage('#disPrice').val()), parseFloat(com.focusPage('#postDis').val())));
                com.focusPage('#num').val(1);
                com.focusPage('#total').val(utils.accMul(parseFloat(com.focusPage('#selling').val()), parseFloat(com.focusPage('#num').val())));
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
                com.focusPage('#color').bindData(colorData.colors, "cid", "name");
                sales.colorids = com.focusPage('#color').find('option:selected').val();
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
                com.focusPage('#format').bindData(formatData.formats, "fid", "info");
                sales.formatids = com.focusPage('#format').find('option:selected').val();
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

    //颜色和规格改变取ID
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
        /*
         表单校验
         */
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

            var $delete = $('<div></div>').addClass('pull-right action-button').append($('<a></a>').addClass('btn btn-danger btn-minier').html('删除'));
            var $edit = $('<div></div>').css('margin-right', '5px').addClass('pull-right action-button').append($('<a></a>').addClass('btn btn-primary btn-minier').html('查看')).click(function () {
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
            //$('.list-group-item').css("border-bottom", "none");
            //$('.list-group-item:last').css("border-bottom", "grey solid 1px");
            //清空左侧
            com.focusPage('#left').find('input').val("");
            com.focusPage('#left').find('select').empty();
            com.focusPage('#goodsName').removeAttr('data-name');
            com.focusPage('#category').removeAttr('data-category');
            com.focusPage('#brand').removeAttr('data-brand');
            com.focusPage('#measurementUnit').removeAttr('data-measurementUnit');
            /*
             点击删除移除数据
             */
            $delete.click(function () {
                var $this = $(this);
                var $totals = com.focusPage('#totals');
                //li标签
                var $liParent = $this.parents('.list-group-item');
                //取到当前Li的总价
                var deleteNum = $liParent.find('.b_total').text();
                var totalNum = parseFloat(utils.accSub($totals.val(), deleteNum));
                $totals.val(totalNum);
                $liParent.remove();
                com.focusPage('.list-group-item:last').css("border-bottom", "solid 1px");
            });

            com.focusPage('#totals').val(cycTotal());

        } else if (sales.flag == false) {
            com.showAlert(com.warning, "商品信息不完善,请先完善商品信息");
        }
    });

    com.focusPage('#refresh').click(function () {
        com.focusPage('#left').find('input').popover('destroy').css('border-color', "#b5b5b5").val("");
        com.focusPage('#left').find('select').empty();
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
            com.focusPage('#disPrice').val(utils.accMul(parseFloat(com.focusPage('#purchase').find('option:selected').attr("other")), parseFloat(com.focusPage('#discount').val())));
            com.focusPage('#selling').val(utils.accMul(parseFloat(com.focusPage('#disPrice').val()), parseFloat(com.focusPage('#postDis').val())));
            com.focusPage('#total').val(utils.accMul(parseFloat(com.focusPage('#selling').val()), parseFloat(com.focusPage('#num').val())));
        } else if (flag == true && boolean == false) {
            com.focusPage('#selling').val(utils.accMul(parseFloat(com.focusPage('#disPrice').val()), parseFloat(com.focusPage('#postDis').val())));
            com.focusPage('#total').val(utils.accMul(parseFloat(com.focusPage('#selling').val()), parseFloat(com.focusPage('#num').val())));
        } else if (flag == false && boolean == true) {
            com.focusPage('#total').val(utils.accMul(parseFloat(com.focusPage('#selling').val()), parseFloat(com.focusPage('#num').val())));
            com.focusPage('#postDis').val((utils.accDiv(parseFloat(com.focusPage('#selling').val()), parseFloat(com.focusPage('#disPrice').val()))).toFixed(2));
        }
    }

//先判断是否为NaN 不是的话不允许计算

    function cycTotal() {

        var _total = 0;

        var $li = com.focusPage('.list-group-item');

        $li.length && $li.each(function (i, v) {
            var $this = $(v);
            _total = utils.accAdd(_total, parseFloat($this.find('.b_total').text()));
        });

        return _total;
    }

    //订单区
//根据订单号查询出客户姓名 业务员和楼盘地址信息
    com.focusPage('#orderId').on("change", function () {

        var option = {};
        option["decoration.orderId"] = com.focusPage('#orderId').val();
        com.post(sales.queryDecorationByOrderIdUrl, option, function (data) {
            com.focusPage("#customerName").val(data.decoration.customer.name);
            com.focusPage("#salesmanName").removeAttr('data-typeahead-key').val(data.decoration.designer.currentName);
            com.focusPage("#orderAddr").val(data.decoration.house.village.name + " " + data.decoration.house.houseNumber);

            if (com.focusPage('#searchInfo').find('#customerName').val() != "") {
                com.focusPage('#searchInfo').find('#customerName').next().remove();
            }
            if (com.focusPage('#searchInfo').find("#salesmanName").val() != "") {
                com.focusPage('#searchInfo').find('#salesmanName').next().remove();
            }
            if (com.focusPage('#searchInfo').find("#orderAddr").val() != "") {
                com.focusPage('#searchInfo').find('#orderAddr').next().remove();
            }
            //客户Id
            sales.cid = data.decoration.customer.cid;
            //业务员Id
            sales.salesmanid = data.decoration.designer.userId;
            //楼盘id
            sales.salePostData["sales.house.hid"] = data.decoration.house.hid;

            sales.salePostData["sales.dompanys"] = data.decoration.dompany;

        }, function (e) {
            com.showAlert(com.warning, "未查询到此订单!");
            com.focusPage("#customerName").val(null);
            com.focusPage("#salesmanName").val(null);
            com.focusPage("#orderAddr").val(null);
        });
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


    //绑定券信息
    com.post(api.ds.payment, {}, function (res) {
        com.focusPage("#couponInfo").bindData(res.materialCouponTypes, 'key', 'value', false);
    }, null, false);

    // 销售单区 提交
    //进行主材品类的校验不是同一品牌不能提交
    //取参数添加
   
    com.focusPage('#submit').click(function () {

        var _option = {};

        if (com.validate('searchInfo', 'bottom') == false) {

            if (submitCheck() == false) {
                return;
            }

            _option = {
                "sales.orderId": com.focusPage('#orderId').val(),
                "sales.customer.cid": sales.cid,
                "sales.guider.userId": com.typeahead("guider"),
                "sales.instorer.userId": com.typeahead("instorer"),
                "sales.bid": sales.brandData[com.typeahead("brands")][1],
                "sales.coupon": com.focusPage('#coupon').val() != "" ? parseFloat(com.focusPage('#coupon').val()) : 0,
                "sales.comment": com.focusPage('#comment').val(),
                "sales.maling": com.focusPage('#maling').val() != "" ? parseFloat(com.focusPage('#maling').val()) : 0,
                "sales.total": isNaN(parseFloat(com.focusPage('#totals').val())) ? 0 : parseFloat(com.focusPage('#totals').val()),
                "sales.house.hid": sales.salePostData["sales.house.hid"],
                "sales.dompanys": sales.salePostData["sales.dompanys"]
            };

            //客户id
            //业务员(有问题)
            if (com.typeahead("salesmanName")) {
                _option["sales.salesman.userId"] = com.typeahead("salesmanName");
            } else {
                _option["sales.salesman.userId"] = sales.salesmanid;
            }

            if (com.focusPage('#coupon').val() == "" || com.focusPage('#coupon').val() == 0) {
                _option["sales.couponInfo"] = " ";
            } else {
                _option["sales.couponInfo"] = '#' + com.focusPage('#couponInfo').val() + ':' + com.focusPage('#coupon').val() + '#';
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
                _option["salesItems[" + i + "].priceType"] = $v.find("#invisiblePriceType").text();
            });

            com.post(api.inventory.addSales, _option, function (data) {
                com.showAlert(com.info, "添加成功");

                //清空销售项
                com.focusPage('#salesItemList').empty();
                //清空类为order_inputinfo的input
                com.focusPage('.order_inputinfo').val(null);

                //删除data-typeahead-key属性
                com.cleanTypeahead('salesmanName');
                com.cleanTypeahead('instorer');
                com.cleanTypeahead('guider');
                com.cleanTypeahead('brands');

            }, function (e) {
                com.showAlert(com.error, "添加失败");
            });
        }
    });

//检查主材品牌 订单号 主材导购 主材驻店
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

    //取消提示信息
    cancelProp();

    function cancelProp() {
        var $inputs = com.focusPage('input', '#left');
        //获得右侧input焦点事件重置input为初始,进而取消提示
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

    //查看套餐弹窗
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