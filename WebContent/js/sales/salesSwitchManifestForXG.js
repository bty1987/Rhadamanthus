$(function () {

    com.focusPage('#layerAdd input[name="manifestTime"]').datepicker(com.datepickerdefault);
    
    var manifest = {
        total: null
    };

    var status = {
        "0": "初始",
        "2": "全退",
        "3": "倒单",
        "4": "废单",
        "5": "完结"
    };

    var balanceStatus = {
        "0": "初始",
        "1": "预结算",
        "2": "厂商结算",
        "3": "结算"
    };

    //查询仓库名称
    com.post(api.inventory.queryStorehouseForSelf, {}, function (res) {
        var storehousesStatus = [];

        $.each(res.storehouses, function (i, v) {
            if (v.status == 0) {
                storehousesStatus.push(v);
            }
        });
        manifest.storehouses = storehousesStatus;
    }, null, false);

    var displayFunc = (function () {

        var renderList = function (tableId, listData) {

            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list ui-sortable  fl-table-list');

            if (listData && listData.length) {
                $.each(listData, function (i, v) {

                    var $liLine = $('<li></li>').addClass('item-orange clearfix');
                    var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                    var $h3 = $('<h3></h3>').addClass('oid');
                    var $btnDiv = $('<div></div>').addClass('action-buttons pull-right');

                    var $btnSwitch = $('<a></a>').addClass('btn btn-minier btn-yellow').html('转出库单');

                    var propertyArr = [
                        ["装修单号:", v.orderId, "blue"],
                        ["楼盘地址:", v.house.village.name + " " + v.house.houseNumber, "grey"],
                        ["客户名:", v.customer.customerName, "grey"],
                        ["渠道:", v.salesman.currentName, "grey"],
                        ["部门:", v.dept.name, "grey"],
                        ["分区:", v.region.name, "grey"],
                        ["导购:", v.guider.currentName, "grey"],
                        ["驻店:", v.instorer.currentName, "grey"],
                        ["主材部:", v.guideDept.name, "grey"],
                        ["品类:", v.category, "grey"],
                        ["品牌:", v.brand, "grey"],
                        ["创建时间:", v.createTime, "green"],
                        ["结算时间:", v.balanceTime, "green"],
                        ["全款时间:", v.fullpayTime, "green"],
                        ["状态:", status[v.status], "red"],
                        ["结算状态:", balanceStatus[v.balanceStatus], "red"],
                        ["总额:", v.total, "blue"],
                        ["抹零:", v.maling, "blue"],
                        ["厂商抹零:", v.venderMaling, "blue"],
                        ["券值:", v.coupon, "blue"],
                        ["券信息:", v.couponInfo, "grey"],
                        ["备注:", v.comment, "grey"]
                    ];

                    var $label = $('<label></label>').addClass('control-label').css({
                        'color': 'grey',
                        'font-size': '20px',
                        "font-weight": "bold"
                    });

                    var _label = $('<label></label>');

                    var $input = $('<input>').attr({
                        "type": "checkbox",
                        "name": "sids",
                        "class": "",
                        "data-sid": v.sid,
                        "data-no": v.no,
                        "data-orderId": v.orderId,
                        "data-fullPayStatus": v.fullpayStatus
                    }).addClass('ace ace-checkbox-2');

                    var _span = $('<span></span>').addClass('lbl blue bigger-150').html(v.no);

                    _label.append($input).append(_span).appendTo($label);

                    $.each(propertyArr, function (index, value) {
                        var $liProperty = $('<li></li>');
                        $('<strong></strong>').html(value[0]).appendTo($liProperty);
                        $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                        $liProperty.appendTo($ulProperty);
                    });

                    $label.appendTo($h3);

                    $btnDiv.append($btnSwitch).appendTo($h3);

                    $liLine.appendTo($ul);
                    $liLine.append($h3).append($ulProperty);

                    $btnSwitch.click(function () {

                        var _params = {};

                        _params["sids[0]"] = v.sid;

                        if (v.fullpayStatus == 2) {
                            viewSalesItems(v.sid);
                            openlayer($btnSwitch.html(), function () {
                                savePurchase(_params);
                            }, v.sid);
                        } else {
                            com.showAlert(com.warning, "此销售单补款未确认,无法转出库单");
                        }

                    });

                });

                $ul.appendTo($tableWrap);
            }
        };


        return {
            init: function (tableId, listData) {
                com.focusPage('#' + tableId).html(null);
                renderList(tableId, listData);
            }
        };

    })();
    var _condArr = ['sales_no', 'sales_orderId', 'sales_instorer', 'sales_salesman', 'sales_deptName', 'sales_fullpayTime'];

    var salesSwitchManifestForXGSearcher = new Searcher();

    salesSwitchManifestForXGSearcher.init(_condArr, 'condList', api.inventory.pageSalesForAdvance, function (data) {
        com.focusPage('input[name="fullpayTime"]').parent('.inline').addClass('m-wrap m-ctrl-medium date-picker');
        com.focusPage('input[name="fullpayTime"]').attr('readonly', true);
        com.focusPage('input[name="fullpayTime"]').removeAttr('placeholder');

        displayFunc.init('resultList', data);
    }, 'pagenation', 'salesSwitchManifestForXGPostData', null, false, null, function () {
        var $adda = $('<a></a>').addClass('btn btn-minier pull-left btn-info').attr('name', 'collects').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-money bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('批量转出库单').appendTo($adda);

        $adda.click(function () {

                var _params = {};
                var flag = true;
                var fullPayStatusFlag = true;
                var fullPayStatus = [];
                var checked = com.focusPage('input[name="sids"]:checked', '#resultList');
                var $sids = [];

                if (checked.length != 0) {

                    $.each(checked, function (i, v) {
                        var $this = $(v);
                        fullPayStatus.push($this.attr('data-fullPayStatus'));
                        $sids.push($this.attr('data-sid'));
                        if (fullPayStatus[i] == 2 && flag) {
                            _params["sids[" + i + "]"] = $sids[i];
                        } else {
                            _params = {};
                            fullPayStatusFlag = false;
                            flag = false;
                        }
                    });

                    if (fullPayStatusFlag && flag) {
                        viewSalessItems(_params);
                        openlayer($addspan.text(), function () {
                            savePurchase(_params);
                        });
                    } else if (fullPayStatusFlag == false && flag == true || fullPayStatusFlag == false && flag == false) {
                        com.showAlert(com.warning, "销售单中有补款未确认,无法转出库单");
                    }

                } else {
                    com.showAlert(com.warning, "请选择销售单");
                }

            }
        );
        return [$adda];

    }, 'resultList');


    function viewSalesItems(sid) {
        com.post(api.inventory.querySalesItemBySid, {
            "sales.sid": sid
        }, function (res) {
            initList.init('resultListItem', res.salesItems);
        });
    }

    function viewSalessItems(options) {
        com.post(api.inventory.querySalesItemBySids, options, function (res) {

            initList.init('resultListItem', res.salesItems);
        });
    }

    function savePurchase(sids) {

        if (com.validate('layerAdd', 'right')) return;

        cyclTotal();

        var options = {
            "manifest.comment": com.focusPage('#layerAdd input[name="comment"]').val(),
            "manifest.manifestTime": com.focusPage('#layerAdd input[name="manifestTime"]').val(),
            "manifest.total": com.focusPage('#layerAdd input[name="total"]').val(),
            "manifest.attachment": "",
            "manifest.type": 3
        };

        $.extend(options, sids);

        var checkList = com.focusPage('input[name="siids"]:checked', '#resultListItem');
        
        var $liline = checkList.parents('.oid');
        $.each(checkList, function (i, v) {
            var $this = $(v);
           
            options["manifestItems[" + i + "].siid"] = $this.attr('data-siid');
            options["manifestItems[" + i + "].goods.gid"] = $this.attr('data-gid');            //– 商品编号
            options["manifestItems[" + i + "].color.cid"] = $this.attr('data-cid');  //– 颜色
            options["manifestItems[" + i + "].format.fid"] = $this.attr('data-fid');//– 规格
            options["manifestItems[" + i + "].outstorehouse.shid"] = $this.parents('.oid').find('select.outStroehouse').val();//– 仓库
            options["manifestItems[" + i + "].outprice"] = $this.parents('.oid').find('input.unitPrice').val();  //单价
            options["manifestItems[" + i + "].num"] = $this.parents('.oid').find('input.inputNumber').val();           //– 数量
        });

        if (checkList.length != 0) {
            if (checkRowValue($liline)) {
                com.post(api.inventory.addManifestForXG, options, function () {
                    layer.closeAll();
                    com.showAlert(com.info, "添加成功");
                    com.focusPage('#resultListItem').empty();
                    com.focusPage('input[name="manifestTime"]').val("");
                    com.focusPage('input[name="comment"]').val("");
                }, function (e) {
                    com.showAlert(com.error, e.errorMsg);
                });
            }
        } else {
            com.showAlert(com.warning, "请选择需要转出库单的商品");
        }

    }

    var initList = (function () {

        var renderList = function (tableId, listData) {
            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list ui-sortable  fl-table-list');

            if (listData && listData.length) {
                $.each(listData, function (i, v) {
                    var $liLine = $('<li></li>').addClass('item-orange clearfix');
                    var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix').attr({
                        'data-discount': v.discount,
                        'data-postDis': v.postDis
                    });
                    var $h3 = $('<h3></h3>').addClass('oid');
                    var $btnDiv = $('<div></div>').addClass('action-buttons pull-right').attr('data-num', v.num).attr('data-selling', v.price).attr('data-siid', v.siid);
                    
                    var propertyArr = [
                        ["商品品类:", v.goods.category, "grey", "category"],
                        ["商品颜色:", v.color.name, "grey", "color"],
                        ["商品规格:", v.format.info, "grey", "format"],
                        ["售价:", v.selling, "blue", "selling"],
                        ["折扣价:", v.disPrice, "blue", "disPrice"],
                        ["折让价:", v.price, "blue", "price"],
                        ["数量:", v.num, "blue", "num"],
                        ["总价:", v.total, "blue", "total"],
                        ["原结算方式:", v.rawCtype == 0 ? "底价" : "点位", "red", "rawCtype"],
                        ["原结算值:", v.rawCvalue, "blue", "rawCvalue"],
                        ["结算方式:", v.ctype == 0 ? "底价" : "点位", "red", "ctype"],
                        ["结算值:", v.cvalue, "blue", "cvalue"],
                        ["备注:", v.comment, "grey", "comment"]
                    ];

                    var $label = $('<label></label>').addClass('control-label').css({
                        'color': 'grey',
                        'font-size': '20px',
                        "font-weight": "bold",
                        "width": "100%"
                    });

                    var inputSpan = $('<label></label>').addClass('pull-right').css({
                        'font-size': '14px',
                        'font-weight': 'bold'
                    }).html('售价:');
                    var inputNum = $('<input>').addClass('unitPrice').css({
                        'margin-left': '20px',
                        'width': '40%'
                    }).appendTo(inputSpan).attr('readOnly', 'readOnly').val(v.price);

                    var inputSpanNum = $('<label></label>').addClass('pull-right').css({
                        'font-size': '14px',
                        'font-weight': 'bold'
                    }).html('数量:');

                    var inputNumber = $('<input>').addClass('inputNumber').css({
                        'margin-left': '20px',
                        'width': '40%'
                    }).appendTo(inputSpanNum);

                    var inputSpanOutStroehouse = $('<label></label>').addClass('pull-right').css({
                        'font-size': '14px',
                        'font-weight': 'bold',
                        'margin-top': '-4px'
                    }).html('出货仓库:');

                    var inputOutStroehouse = $('<select></select>').addClass('outStroehouse').css({
                        'margin-left': '20px'
                    }).appendTo(inputSpanOutStroehouse);

                    inputOutStroehouse.bindData(manifest.storehouses, 'shid', 'name');

                    var btnSpanSearchStroeStock = $('<label></label>').addClass('pull-right').css({
                        'font-size': '20px',
                        'font-weight': 'bold',
                        'margin-top': '-4px'
                    });
                    var btnSearchStroeStock = $('<button></button>').addClass('btn btn-xs btn-info btn-search').attr('name', 'search').css("margin", "0px 3px").html('库存').appendTo(btnSpanSearchStroeStock);

                    var _label = $('<label></label>');

                    var $input = $('<input>').attr({
                        "type": "checkbox",
                        "name": "siids",
                        "class": "",
                        "data-sid": v.sid,
                        "data-siid": v.siid,
                        "data-cid": v.color.cid,
                        "data-fid": v.format.fid,
                        "data-gid": v.goods.gid,
                        "data-num": v.num
                    }).addClass('ace ace-checkbox-2');

                    var _span = $('<span></span>').addClass('lbl blue bigger-150').css('font-weight', 'bold').html(v.goods.name + ' ' + v.goods.no);

                    _label.append($input).append(_span).appendTo($label);

                    $.each(propertyArr, function (index, value) {
                        var $liProperty = $('<li></li>').css({"border-bottom": "0px"});
                        $('<strong></strong>').attr('name', value[3]).html(value[0]).appendTo($liProperty);
                        $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                        $liProperty.appendTo($ulProperty);
                    });

                    $label.append(btnSpanSearchStroeStock).append(inputSpanOutStroehouse).append(inputSpan).append(inputSpanNum).appendTo($h3);


                    $btnDiv.appendTo($h3);

                    $liLine.appendTo($ul);
                    $liLine.append($h3).append($ulProperty);

                    //查询库存点击事件
                    btnSearchStroeStock.click(function () {

                        var optionStroe = {
                            "goodsStorehouseStock.goods.gid": v.goods.gid,
                            "goodsStorehouseStock.color.cid": v.color.cid,
                            "goodsStorehouseStock.format.fid": v.format.fid,
                            "goodsStorehouseStock.storehouse.shid": $liLine.find('select.outStroehouse').val()
                        };

                        com.post(api.inventory.queryGoodsStorehouseStockByShidAGid, optionStroe, function (res) {
                            if (res.goodsStorehouseStock.num == null) {
                                com.showAlert(com.warning, "该仓库没有此商品");
                            } else {
                                com.showAlert(com.warning, "该仓库商品剩余库存:" + res.goodsStorehouseStock.num);
                            }
                        }, function (e) {
                            btn.button('reset');
                            com.showAlert(com.info, e.errorMsg);
                        });

                    });

                });

                $ul.appendTo($tableWrap);
            }
        };

        return {
            init: function (tableId, listData) {
                com.focusPage('#' + tableId).html(null);
                renderList(tableId, listData);
            }
        };

    })();


    function openlayer(title, callback, sid) {
        com.focusPage('#layerAdd').attr({'data-sid': sid});
        layer.closeAll();
        layer.open({
            type: 1,
            skin: 'layui-layer-lan',
            title: title,
            content: com.focusPage('#layerAdd'),
            area: ["1200px", ($(window).height() * 0.84 < 800 ? $(window).height() * 0.84 : 800) + "px"],
            //maxmin: true,
            zIndex: 9000,
            btn: ['确定', '取消'],
            yes: function (index, layero) {
                callback(index, layero);
            },
            btn2: function (index, layero) {
                //按钮【按钮二】的回调
                com.clearValidator();
                com.focusPage('#resultListItem').empty();
                com.focusPage('input[name="manifestTime"]').val("");
            },
            cancel: function () {
                //右上角关闭回调
                com.clearValidator();
                com.focusPage('#resultListItem').empty();
                com.focusPage('input[name="manifestTime"]').val("");
            }
        });
    }

    //检查输入数量是否正确
    function checkRowValue($line) {

        var flag = true;
        var priceRex = /^\d{1,8}(\.\d{1,3})?$/;
        $.each($line, function (i, v) {
            var num = $(v).find('input.inputNumber');

            if (!(priceRex.test(num.val()) && parseFloat(num.val()) > 0)) {
                num.focus().select();
                num.addClass('tooltip-info').attr({
                    "data-rel": "popover",
                    "data-placement": "top",
                    "data-original-title": "",
                    "title": "",
                    "data-content": "出库数量需大于0!"
                }).popover('show');
                flag = false;
            } else {
                num.popover('destroy');
            }

        });

        return flag;
    }

    //计算总价
    function cyclTotal() {

        var _total = 0;

        var $list = com.focusPage('.checked', '#resultListItem');
        $list.length && $list.each(function () {
            var $this = $(this);
            if ($this.parents('.oid').find('input.unitPrice').val()) {
                _total = utils.accAdd(utils.accMul(parseFloat($this.parents('.oid').find('input.unitPrice').val() + ''), $this.parents('.oid').find('input.inputNumber').val()), _total);
            }
        });

        manifest.totalSum = _total;

        com.focusPage('input[name="total"]').val(_total);
    }

});

