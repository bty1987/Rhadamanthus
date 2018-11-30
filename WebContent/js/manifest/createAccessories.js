jQuery(function () {

    if (jQuery().datepicker) {
        com.focusPage('.date-picker').datepicker({
            format: 'yyyy-mm-dd',//yyyy-mm-dd hh:ii,
            autoclose:true
        });
    }

    var sales = {
        queryDecorationByOrderIdUrl: api.decoration.queryDecorationForCommonByOrderId,
        typeahead: {
            goodes: "goodes",
            goods: "goods",
            gid: "goods.gid",
            pricegid: "price.gid"
        },
        gids: null,
        gtype: null,
        userId: null,
        salesmanid: null,
        flag: true,
        salePostData: {},
        fetchTime:null
    };

    //销售项区 自动赋值
    com.focusPage('#goodsName').typeahead({
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

            com.focusPage('#left').find('input').val("");
            com.focusPage('#left').find('select').empty();

            //查询商品信息
            var list = this.options.list;

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

            return v;
        }
    });


    //点击添加按钮
    com.focusPage("#add").click(function () {
        /*
         表单校验
         */
        if (com.validate('left', 'bottom') == false && sales.flag == true) {
            var $otherStatus = 0;
            var $liList = $('<li></li>').addClass('list-group-item').attr({

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
            $liList.append(addSpan('品类：', 's_category', com.focusPage('#category').val(), " ", 'b_category', null)).append(addSpan('品牌：', 's_brand', com.focusPage('#brand').val(), " ", 'b_brand', null)).append(addSpan('单位：', 's_unit', com.focusPage('#measurementUnit').val(), " ", 'b_unit', null)).
            append(addSpan('数量：', 's_number', com.focusPage('#num').val(), 'red', 'b_number'));
            com.focusPage('#salesItemList').append($liList);
            //给最后一个li标签加上底框,除了最后一个li 其他的li均无底框
            //com.focusPage('.list-group-item').css("border-bottom", "none");
            //com.focusPage('.list-group-item:last').css("border-bottom", "grey solid 1px");
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
                //li标签
                var $liParent = $this.parents('.list-group-item');
                //取到当前Li的总价
                //var deleteNum = $liParent.find('.b_total').text();
                $liParent.remove();
                com.focusPage('.list-group-item:last').css("border-bottom", "solid 1px");
            });


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
    
    //订单区
//根据订单号查询出客户姓名 业务员和楼盘地址信息
    com.focusPage('#orderId').on("change", function () {

        var option = {};
        option["decoration.orderId"] = com.focusPage('#orderId').val();
        com.post(sales.queryDecorationByOrderIdUrl, option, function (data) {

            if(data.decoration.supervisor.userId == null){
                com.focusPage("#supervisorName").val("---");
            }else{
                com.focusPage("#supervisorName").val(data.decoration.supervisor.currentName);
            }

            com.focusPage("#orderAddr").val(data.decoration.house.village.name + " " + data.decoration.house.houseNumber);

            if (com.focusPage('#searchInfo').find('#supervisorName').val() != "") {
                com.focusPage('#searchInfo').find('#supervisorName').next().remove();
            }
            //if (com.focusPage('#searchInfo').find("#salesmanName").val() != "") {
            //    com.focusPage('#searchInfo').find('#salesmanName').next().remove();
            //}
            if (com.focusPage('#searchInfo').find("#orderAddr").val() != "") {
                com.focusPage('#searchInfo').find('#orderAddr').next().remove();
            }
            //客户Id
            sales.userId = data.decoration.supervisor.userId;
            //业务员Id
            //sales.salesmanid = data.decoration.designer.userId;
            //楼盘id
            sales.salePostData["sales.house.hid"] = data.decoration.house.hid;

            sales.salePostData["sales.dompanys"] = data.decoration.dompany;

        }, function (e) {
            com.showAlert(null, "未查询到此订单!");
            com.focusPage("#supervisorName").val(null);
            //com.focusPage("#salesmanName").val(null);
            com.focusPage("#orderAddr").val(null);
        });
    });

    // 销售单区 提交
    //进行主材品类的校验不是同一品牌不能提交
    //取参数添加
    com.focusPage('#submit').click(function () {

        if(com.focusPage('.list-group-item').length == 0){
            com.showAlert(null, "请添加辅料项！");
            return;
        }

        var _option = {};

        if (com.validate('searchInfo', 'bottom') == false) {

            if(sales.userId == null){
                sales.userId = "---";
            }
            sales.fetchTime = com.focusPage('[name="date"]', '#searchInfo').val();

            _option = {
                "accessories.orderId": com.focusPage('#orderId').val(),
                "accessories.supervisor.userId": sales.userId,
                "accessories.fetchTime": sales.fetchTime
            };

            //客户id
            //业务员(有问题)
            //if (com.focusPage('#salesmanName').attr('data-typeahead-key')!=undefined) {
            //    _option["sales.salesman.userId"] = com.focusPage('#salesmanName').attr('data-typeahead-key');
            //} else {
            //    _option["sales.salesman.userId"] = sales.salesmanid;
            //}

            //折让审批
            var $lis = com.focusPage('.list-group-item');

            $lis && $lis.length && $.each($lis, function (i, v) {
                var $v = $(v);
                _option["accessoriesItems[" + i + "].goods.gid"] = $v.find('h4').attr('adddata');
                _option["accessoriesItems[" + i + "].num"] = parseFloat($v.find('.b_number').text());
            });

            com.post(api.inventory.addAccessories, _option, function (data) {
                com.showAlert(null, "添加成功");

                //清空销售项
                com.focusPage('#salesItemList').empty();
                //清空类为order_inputinfo的input
                com.focusPage('.order_inputinfo').val(null);
                com.focusPage('[name="date"]', '#searchInfo').val(null);

                //删除data-typeahead-key属性
                //com.focusPage('#salesmanName').removeAttr('data-typeahead-key');

            }, function (e) {
                com.showAlert(com.error, "添加失败");
            });
        }
    });

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