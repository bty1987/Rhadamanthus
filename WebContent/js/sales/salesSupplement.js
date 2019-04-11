/**
 * Created by Administrator on 2019/3/25.
 */
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
        cid: null,
        salesmanid: null,
        flag: true,
        salePostData: {},
        priceArray: []
    };

    var sid = params.sid;
    var bid = params.bid;

    var backBtn = com.focusPage('#backBtn');

    //渠道
    com.focusPage('#salesmanName').typeahead({
        url: api.personel.queryUserByPinyin,//获取下拉列表的接口
        list: [],
        postData: {},//获取下拉列表的参数
        source: function (query, process) {
            var options = $.extend({pinyinName: query,"user.status":0,"departmentType.name":""}, this.options.postData);
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
    com.focusPage('#instorer').typeahead({
        url: api.personel.queryUserByPinyin,//获取下拉列表的接口
        list: [],
        postData: {},//获取下拉列表的参数
        source: function (query, process) {
            var options = $.extend({pinyinName: query,"user.status":0,"departmentType.name":""}, this.options.postData);
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
    com.focusPage('#guider').typeahead({
        url: api.personel.queryUserByPinyin,
        list: [],
        postData: {},//获取下拉列表的参数
        source: function (query, process) {
            var options = $.extend({pinyinName: query,"user.status":0,"departmentType.name":""}, this.options.postData);
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

    //绑定券信息
    com.post(api.ds.payment, {}, function (res) {
        com.focusPage("#couponInfo").bindData(res.materialCouponTypes, 'key', 'value', false);
    }, null, false);

    var initList = function (listData) {
        var $tableWrap = com.focusPage('#salesItemList');
        var $div = $('<div></div>').addClass('item-list ui-sortable  fl-table-list');

        if (listData && listData.length) {
            $.each(listData, function (i, v) {
                var $liLine = $('<li></li>').addClass('item-orange clearfix');

                $liLine.attr("data-gid", v.goods.gid);
                $liLine.attr("data-cid", v.color.cid);
                $liLine.attr("data-fid", v.format.fid);
                $liLine.attr("data-purchase", v.purchase);
                $liLine.attr("data-selling", v.selling);
                $liLine.attr("data-discount", v.discount);
                $liLine.attr("data-disPrice", v.disPrice);
                $liLine.attr("data-postDis", v.postDis);
                $liLine.attr("data-price", v.price);
                $liLine.attr("data-comment", v.comment);
                $liLine.attr("data-rawCtype", v.rawCtype);
                $liLine.attr("data-rawCvalue", v.rawCvalue);
                $liLine.attr("data-priceType", v.priceType);

                var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                var $h3 = $('<div></div>').addClass('oid');
                var $small = $('<h4></h4>').addClass('blue').html(v.goods.name + ' ' + v.goods.no);

                var $supplementDiv = $("<div></div>").addClass("pull-right col-sm-2").appendTo($h3);
                var $supplementLabel = $('<label></label>').addClass("col-sm-4").css("line-height", "28px").html("数量:").appendTo($supplementDiv);
                var $supplementInput = $('<input/>').addClass("col-sm-6 v_number").css("font-size","14px").css("margin-right","5px").css("width","100px").css("height","26px").attr("name", "inputNumber").appendTo($supplementDiv);

                $supplementInput.on("change", function () {

                    if(com.validate("salesItemList" , "bottom")) {
                        return;
                    }

                    var inputs = com.focusPage("input[name='inputNumber']");
                    var allInputVal = 0;
                    $.each(inputs, function (i, j) {
                        var $j = $(j);
                        var inputVal = $j.val();
                        if(inputVal != ""){
                            allInputVal = utils.accAdd(allInputVal, utils.accMul(inputVal, sales.priceArray[i]));
                        }
                    });
                    com.focusPage("#totals").val(allInputVal);
                });

                var propertyArr = [
                    ["商品品类:", v.goods.category, "grey"],
                    ["商品颜色:", v.color.name, "grey"],
                    ["商品规格:", v.format.info, "grey"],
                    ["售价:", v.selling, "blue"],
                    ["折扣价:", v.disPrice, "blue"],
                    ["折让价:", v.price, "blue"],
                    ["数量:", v.num, "blue"],
                    ["总价:", v.total, "blue"],
                    ["类型:", v.priceType == "0" ? "正价" : "特价", "red"],
                    ["备注:", v.comment, "grey"]
                ];

                $.each(propertyArr, function (index, value) {
                    var $liProperty = $('<li></li>');
                    $('<strong></strong>').html(value[0]).appendTo($liProperty);
                    $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                    $liProperty.appendTo($ulProperty);
                });

                $liLine.appendTo($div);
                $liLine.append($h3).append($ulProperty);
                
                $small.appendTo($h3);

                sales.priceArray.push(v.price);
            });

            $div.appendTo($tableWrap);
        }
    };

    querySalesItemBySid(sid);

    function querySalesItemBySid(sid) {
        com.post(api.inventory.querySalesItemBySid, {"sales.sid": sid}, function (data) {
            initList(data.salesItems);
        }, function (e) {
            com.showAlert(com.error, e.errorMsg);
        }, false);
    }


    //检查主材品牌 订单号 主材导购 主材驻店
    function submitCheck() {

        var flag = true;

        var $_brand = com.focusPage('#brands');

        var _brand = "";
        if ($_brand.attr('data-brand')) {
            _brand = $_brand.attr('data-brand').split('-')[0];
            _brand = _brand.trim();//金意陶
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

    com.focusPage('#submit').click(function () {

        var _option = {};

        if (com.validate('searchInfo', 'bottom') == false) {

            if (submitCheck() == false) {
                return;
            }

            _option = {
                "sales.orderId": com.focusPage('#orderId').val(),
                "sales.customer.cid": sales.cid,
                "sales.guider.userId": com.focusPage('#guider').attr('data-typeahead-key'),
                "sales.instorer.userId": com.focusPage('#instorer').attr('data-typeahead-key'),
                "sales.bid": bid,
                "sales.coupon": com.focusPage('#coupon').val() != "" ? parseFloat(com.focusPage('#coupon').val()) : 0,
                "sales.comment": com.focusPage('#comment').val(),
                "sales.maling": com.focusPage('#maling').val() != "" ? parseFloat(com.focusPage('#maling').val()) : 0,
                "sales.total":  isNaN(parseFloat(com.focusPage('#totals').val())) ? 0 : parseFloat(com.focusPage('#totals').val()),
                "sales.house.hid": sales.salePostData["sales.house.hid"],
                "sales.dompanys": sales.salePostData["sales.dompanys"]
            };

            _option["sales.salesman.userId"] = sales.salesmanid;

            if (com.focusPage('#coupon').val() == "" || com.focusPage('#coupon').val() == 0) {
                _option["sales.couponInfo"] = " ";
            } else {
                _option["sales.couponInfo"] = '#' + com.focusPage('#couponInfo').val() + ':' + com.focusPage('#coupon').val() + '#';
            }

            var $lis = com.focusPage('.item-orange');

            var $otherStatus = 0;

            $lis && $lis.length && $.each($lis, function (i, v) {

                var $v = $(v);

                var $status = $v.attr('data-otherStatus');
                
                if ($status == 1) {
                    $otherStatus = 1;
                }

                var numberParam = $v.find("input[name='inputNumber']").val();

                if(numberParam != ""){
                    _option["salesItems[" + i + "].goods.gid"] = $v.attr("data-gid");
                    _option["salesItems[" + i + "].color.cid"] = $v.attr("data-cid");
                    _option["salesItems[" + i + "].format.fid"] = $v.attr("data-fid");
                    _option["salesItems[" + i + "].purchase"] = $v.attr("data-purchase");
                    _option["salesItems[" + i + "].selling"] = $v.attr("data-selling");
                    _option["salesItems[" + i + "].discount"] = $v.attr("data-discount");
                    _option["salesItems[" + i + "].disPrice"] = $v.attr("data-disPrice");
                    _option["salesItems[" + i + "].postDis"] = $v.attr("data-postDis");
                    _option["salesItems[" + i + "].price"] = $v.attr("data-price");
                    _option["salesItems[" + i + "].num"] = numberParam;
                    _option["salesItems[" + i + "].total"] = utils.accMul(numberParam, sales.priceArray[i]);
                    _option["salesItems[" + i + "].comment"] = $v.attr("data-comment");
                    _option["salesItems[" + i + "].rawCtype"] = $v.attr("data-rawCtype");
                    _option["salesItems[" + i + "].rawCvalue"] = $v.attr("data-rawCvalue");
                    _option["salesItems[" + i + "].ctype"] = $v.attr("data-rawCtype");
                    _option["salesItems[" + i + "].cvalue"] = $v.attr("data-rawCvalue");
                    _option["salesItems[" + i + "].priceType"] = $v.attr("data-priceType");
                }
            });

            com.post(api.inventory.addSales, _option, function (data) {

                com.showAlert(com.info, "补单成功");

                //清空类为order_inputinfo的input
                com.focusPage('.order_inputinfo').val(null);
                com.focusPage('#salesItemList').find("input[name='inputNumber']").val("");
                //删除data-typeahead-key属性
                com.focusPage('#salesmanName').removeAttr('data-typeahead-key');
                com.focusPage('#instorer').removeAttr('data-typeahead-key');
                com.focusPage('#guider').removeAttr('data-typeahead-key');
                com.focusPage('#brands').removeAttr('data-brand');

            }, function (e) {
                com.showAlert(com.error, "补单失败");
            });

        }
    });

    com.post(api.inventory.querySalesBySid, {
        "sales.sid": sid
    }, function (res) {
        com.focusPage('#orderId').val(res.sales.orderId);
        com.focusPage('#customerName').val(res.sales.customer.name);
        // com.focusPage('#salesmanName').val(res.sales.salesman.currentName);
        com.focusPage('#brands').attr({'data-brand': res.sales.brand,'data-category':res.sales.category}).val(res.sales.brand+'-'+res.sales.category);
        com.post(api.inventory.queryb);
        com.focusPage('#orderAddr').val(res.sales.house.village.name + " " + res.sales.house.houseNumber);
    }, null, false);

    var option = {};
    option["decoration.orderId"] = com.focusPage('#orderId').val();

    com.post(sales.queryDecorationByOrderIdUrl, {"decoration.orderId":com.focusPage('#orderId').val()}, function (data) {
        //公司
        sales.salePostData["sales.dompanys"] = data.decoration.dompany;
        //客户Id
        sales.cid = data.decoration.customer.cid;
        //业务员Id
        sales.salesmanid = data.decoration.designer.userId;
        //楼盘id
        sales.salePostData["sales.house.hid"] = data.decoration.house.hid;
    },null, false);

    backBtn.click(function () {
        com.switchPage(api.index.querySalesIndex.url);
    });

});