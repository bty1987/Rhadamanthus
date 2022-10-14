$(function () {

    var manifest = {
        total: null,
        salesXG_params: {},
        status: {},
        balanceStatus: {},
        btns: {
            xgSaveBtn: com.focusPage("#xgSaveBtn")
        }
    };

    var pageConfig = drawNode.getConfig(params['urlLoadParams'].type);

    com.datetime(com.focusPage('#layerAdd input[name="manifestTime"]'));

    //查询仓库名称
    com.post(api.inventory.queryStorehouseForSelf, {}, function (res) {
        var storehousesStatus = [];

        $.each(res.storehouses, function (i, v) {
            if (v.status == constant.sales().sales.STATUS_INIT_INT) {
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

                    var $btnSwitch = $('<a></a>').addClass('btn btn-minier btn-yellow').html('出库');

                    var propertyArr = [];
                    $.each(pageConfig.propertyArr, function (pi, pv) {
                        switch (pv) {
                            case "orderId":
                                propertyArr.push(["装修单号:", v.orderId, "blue"]);
                                break;
                            case "address":
                                propertyArr.push(["楼盘地址:", (v.house.village.name + " " + v.house.houseNumber), "grey"]);
                                break;
                            case "customer":
                                propertyArr.push(["客户名:", v.customer.name, "grey"]);
                                break;
                            case "salesman":
                                propertyArr.push(["渠道:", v.salesman.currentName, "grey"]);
                                break;
                            case "dept":
                                propertyArr.push(["部门:", v.dept.name, "grey"]);
                                break;
                            case "region":
                                propertyArr.push(["分区:", v.region.name, "grey"]);
                                break;
                            case "guider":
                                propertyArr.push(["导购:", v.guider.currentName, "grey"]);
                                break;
                            case "instorer":
                                propertyArr.push(["驻店:", v.instorer.currentName, "grey"]);
                                break;
                            case "guideDept":
                                propertyArr.push(["主材部:", v.guideDept.name, "grey"]);
                                break;
                            case "category":
                                propertyArr.push(["品类:", v.category, "grey"]);
                                break;
                            case "brand":
                                propertyArr.push(["品牌:", v.brand, "grey"]);
                                break;
                            case "createTime":
                                propertyArr.push(["创建时间:", v.createTime, "green"]);
                                break;
                            case "balanceTime":
                                propertyArr.push(["结算时间:", v.balanceTime, "green"]);
                                break;
                            case "fullpayTime":
                                propertyArr.push(["全款时间:", v.fullpayTime, "green"]);
                                break;
                            case "status":
                                propertyArr.push(["状态:", constant.sales().sales.status.keys[v.status], "red"]);
                                break;
                            case "balanceStatus":
                                propertyArr.push(["结算状态:", constant.sales().sales.balanceStatus.keys[v.balanceStatus], "red"]);

                                break;
                            case "grade":
                                propertyArr.push(["等级:", v.grade, "red"]);
                                break;
                            case "total":
                                propertyArr.push(["总额:", v.total, "blue"]);
                                break;
                            case "maling":
                                propertyArr.push(["抹零:", v.maling, "blue"]);
                                break;
                            case "venderMaling":
                                propertyArr.push(["厂商抹零:", v.venderMaling, "blue"]);
                                break;
                            case "coupon":
                                propertyArr.push(["券值:", v.coupon, "blue"]);
                                break;
                            case "couponInfo":
                                propertyArr.push(["券信息:", v.couponInfo, "grey"]);
                                break;
                            case "comment":
                                propertyArr.push(["备注:", v.comment, "grey"]);
                                break;
                        }
                    });


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

                    $.each(pageConfig.pageBtn, function (k, b) {
                        switch (b) {
                            case "delivery":
                                $btnDiv.append($btnSwitch);
                                break;
                        }
                    });

                    $btnDiv.appendTo($h3);

                    $liLine.appendTo($ul);
                    $liLine.append($h3).append($ulProperty);

                    $btnSwitch.click(function () {

                        manifest.salesXG_params["sids[0]"] = v.sid;

                        if (v.fullpayStatus != constant.sales().sales.FULLPAYSTATUS_CONFIRM_SHORT) {
                            com.showAlert(com.warning, "此销售单补款未确认,无法转出库单");
                            return false;
                        }

                        com.focusPage('#layerAdd').attr({'data-sid': v.sid});
                        com.popup4model('#layerAdd', "转出库单", "", function () {

                            com.clearValidator();
                            com.focusPage('#resultListItem').empty();
                            com.focusPage('input[name="manifestTime"]').val("");
                        }, function () {
                            viewSalesItems(v.sid);
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

    var initList = (function () {

        var renderList = function (tableId, listData) {
            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list ui-sortable  fl-table-list');

            if (listData.length == 0) {

                var $resultList = com.focusPage("#resultListItem").addClass('dz-default dz-message').html('');
                var $zone = $('<div></div>').addClass('dropzone dz-clickable').css('margin', '20px').css('border', '0px').appendTo($resultList);
                var $mesg = $('<div></div>').addClass('dz-default dz-message').appendTo($zone);
                var $span = $('<span></span>').text('无可用数据提供').appendTo($mesg);
                return $resultList;

            } else if (listData && listData.length) {
                $.each(listData, function (i, v) {
                    var $liLine = $('<li></li>').addClass('item-orange clearfix');
                    var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix').attr({
                        'data-discount': v.discount,
                        'data-postDis': v.postDis
                    });
                    var $h3 = $('<h3></h3>').addClass('oid');

                    var propertyArr = [
                        ["商品品类:", v.goods.category, "grey", "category"],
                        ["商品颜色:", v.color.name, "grey", "color"],
                        ["商品规格:", v.format.info, "grey", "format"],
                        ["售价:", v.selling, "blue", "selling"],
                        ["折扣价:", v.disPrice, "blue", "disPrice"],
                        ["折让价:", v.price, "blue", "price"],
                        ["数量:", v.num, "blue", "num"],
                        ["出库余数:", v.xgnum, "blue xg", "xgnum"],
                        ["采购余数:", v.punum, "blue pu", "punum"],
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

                    var div = $('<div></div>').css("margin-top", "10px");

                    var $goods = $('<label></label>').html('商品名: ');
                    var goodsName = $('<input type="text" id = "salesBalanceGoodsName' + v.siid + '">').appendTo($goods).val(v.goods.name).attr('data-typeahead-key', v.goods.gid);

                    var $color = $('<label></label>').css({'margin-left': '10px'}).html('颜色: ');
                    var goodsColor = $('<select id="color' + v.siid + '"></select>').css({'margin-left': '10px'}).appendTo($color);

                    var $format = $('<label></label>').css({'margin-left': '10px'}).html('规格: ');
                    var goodsFormat = $('<select id="format' + v.siid + '"></select>').css({'margin-left': '10px'}).appendTo($format);

                    var inputSpan = $('<label></label>').css({'margin-left': '10px'}).html('售价: ');
                    var inputNum = $('<input type="text" id="unitPrice' + v.siid + '">').addClass('unitPrice').appendTo(inputSpan).val(v.price);

                    var inputSpanNum = $('<label></label>').css({'margin-left': '10px'}).html('数量: ');
                    var inputNumber = $('<input type="text">').attr("id", "num" + v.siid).addClass('inputNumber').appendTo(inputSpanNum);

                    var inputSpanOutStroehouse = $('<label></label>').css({'margin-left': '10px'}).html('出货仓库: ');
                    var inputOutStroehouse = $('<select></select>').attr("id", "oshid" + v.siid).addClass('outStroehouse').appendTo(inputSpanOutStroehouse);

                    inputOutStroehouse.bindData(manifest.storehouses, 'shid', 'name');

                    var btnSpanSearchStroeStock = $('<label></label>').css({'font-weight': 'bold'});
                    var btnSearchStroeStock = $('<button></button>').addClass('btn btn-xs btn-info btn-search').attr('name', 'search').css("margin", "0px 3px").html('库存').appendTo(btnSpanSearchStroeStock);

                    var _label = $('<label></label>');

                    //赋值颜色信息
                    com.post(api.data.queryColorForEnableByGid, {"color.gid": v.goods.gid}, function (colorData) {
                        if (colorData.colors.length == 0) return false;

                        goodsColor.bindData(colorData.colors, "cid", "name");
                        goodsColor.val(v.color.cid);
                    });

                    //赋值规格信息
                    com.post(api.data.queryFormatForEnableByGid, {"format.gid": v.goods.gid}, function (formatData) {
                        if (formatData.formats.length == 0) return false;

                        goodsFormat.bindData(formatData.formats, "fid", "info");
                        goodsFormat.val(v.format.fid);
                    });

                    var $input = $('<input>').attr({
                        "type": "checkbox",
                        "name": "siids",
                        "class": "",
                        "data-sid": v.sid,
                        "data-siid": v.siid,
                        "data-cid": v.color.cid,
                        "data-fid": v.format.fid,
                        "data-gid": v.goods.gid,
                        "data-num": v.num,
                        "data-price": v.price,
                        'data-i': i
                    }).addClass('ace ace-checkbox-2');

                    $input.change(function () {
                        if ($input.prop('checked')) {
                            inputNumber.addClass("v_float_3");
                            goodsName.addClass("v_required");
                            inputNum.addClass("v_float_3");
                        } else {
                            inputNumber.removeClass("v_float_3");
                            goodsName.removeClass("v_required");
                            inputNum.removeClass("v_float_3");
                        }
                    });

                    var _span = $('<span></span>').addClass('lbl blue bigger-150').css('font-weight', 'bold').html(v.goods.name + ' ' + v.goods.no);

                    _label.append($input).append(_span).appendTo($label);

                    $.each(propertyArr, function (index, value) {
                        var $liProperty = $('<li></li>').css({"border-bottom": "0px"});
                        $('<strong></strong>').attr('name', value[3]).html(value[0]).appendTo($liProperty);
                        $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                        $liProperty.appendTo($ulProperty);
                    });

                    $label.appendTo($h3);

                    div.append($goods).append($color).append($format).append(inputSpanNum).append(inputSpan).append(inputSpanOutStroehouse).append(btnSpanSearchStroeStock).appendTo($h3);

                    $liLine.append($h3).append($ulProperty).appendTo($ul);

                    //查询库存点击事件
                    btnSearchStroeStock.click(function () {

                        var options = {
                            "goodsStorehouseStock.goods.gid": com.typeahead(goodsName),
                            "goodsStorehouseStock.color.cid": goodsColor.val(),
                            "goodsStorehouseStock.format.fid": goodsFormat.val(),
                            "goodsStorehouseStock.storehouse.shid": inputOutStroehouse.val()
                        };

                        com.post(api.inventory.queryGoodsStorehouseStockByShidAGid, options, function (res) {
                            if (res.goodsStorehouseStock.num == null) {
                                com.showAlert(com.warning, "该仓库没有此商品");
                            } else {
                                com.showAlert(com.warning, "该仓库商品剩余库存:" + res.goodsStorehouseStock.num);
                            }
                        });
                    });

                    com.initTypeahead(goodsName, api.data.queryGoodsByName, "goods.name", {}, 'goodes', 'gid', 'name', function (list, k, res) {

                        goodsColor.find('select').empty();
                        goodsFormat.find('select').empty();

                        //赋值颜色信息
                        com.post(api.data.queryColorForEnableByGid, {"color.gid": k}, function (colorData) {
                            if (colorData.colors.length != 0) {
                                goodsColor.bindData(colorData.colors, "cid", "name");
                            } else {
                                com.showAlert(com.warning, "该商品暂无颜色信息,请录入");
                            }
                        });

                        //赋值规格信息
                        com.post(api.data.queryFormatForEnableByGid, {"format.gid": k}, function (formatData) {
                            if (formatData.formats.length != 0) {
                                goodsFormat.bindData(formatData.formats, "fid", "info");
                            } else {
                                com.showAlert(com.warning, "该商品暂无规格信息,请录入");
                            }
                        });

                        return res;
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

    var salesSwitchManifestForXGSearcher = new Searcher();

    salesSwitchManifestForXGSearcher.init(pageConfig.condArr, 'condList', pageConfig.apiPage, function (data) {
        com.focusPage('input[name="fullpayTime"]').parent('.inline').addClass('m-wrap m-ctrl-medium date-picker');
        com.focusPage('input[name="fullpayTime"]').attr('readonly', true);
        com.focusPage('input[name="fullpayTime"]').removeAttr('placeholder');

        displayFunc.init('resultList', data);
    }, 'pagenation', 'salesSwitchManifestForXGPostData', null, false, null, function () {
        var $adda = $('<a></a>').addClass('btn btn-minier pull-left btn-info').attr('name', 'collects').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-money bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('批量出库').appendTo($adda);

        $adda.click(function () {

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
                    if (fullPayStatus[i] == constant.sales().sales.FULLPAYSTATUS_CONFIRM_SHORT && flag) {
                        manifest.salesXG_params["sids[" + i + "]"] = $sids[i];
                    } else {
                        manifest.salesXG_params = {};
                        fullPayStatusFlag = false;
                        flag = false;
                    }
                });

                if (fullPayStatusFlag && flag) {
                    com.popup4model("#layerAdd", "批量转出库单", "", function () {
                        com.clearValidator();
                        com.focusPage('#resultListItem').empty();
                        com.focusPage('input[name="manifestTime"]').val("");
                    }, function () {
                        viewSalessItems(manifest.salesXG_params);
                    });
                } else if (fullPayStatusFlag == false && flag == true || fullPayStatusFlag == false && flag == false) {
                    com.showAlert(com.warning, "销售单中有补款未确认,无法转出库单");
                }

            } else {
                com.showAlert(com.warning, "请选择销售单");
            }
        });
        return [$adda];

    }, 'resultList');

    manifest.btns.xgSaveBtn.on('click', function () {
        savePurchase(manifest.salesXG_params);
    });

    var emptyData = function () {
        var $zone = $('<div></div>').addClass('dropzone dz-clickable').css('margin', '20px').css('border', '0px').appendTo($resultList);
        var $mesg = $('<div></div>').addClass('dz-default dz-message').appendTo($zone);
        var $span = $('<span></span>').text('无可用数据提供').appendTo($mesg);
    };

    function viewSalesItems(sid) {
        com.post(api.sales.querySalesItemBySid, {
            "sales.sid": sid
        }, function (res) {
            initList.init('resultListItem', res.salesItems);
        }, null, false);
    }

    function viewSalessItems(options) {
        com.post(api.sales.querySalesItemBySids, options, function (res) {
            initList.init('resultListItem', res.salesItems);
        }, null, false);
    }

    function savePurchase(sids) {

        if (com.validate('layerAdd', 'top')) return false;

        var options = {
            "manifest.comment": com.focusPage('#layerAdd input[name="comment"]').val(),
            "manifest.manifestTime": com.focusPage('#layerAdd input[name="manifestTime"]').val()
        };

        $.extend(options, sids);

        var checkList = com.focusPage('input[name="siids"]:checked', '#resultListItem');

        if (checkList.length === 0) {
            com.showAlert(com.warning, "请选择需要转出库单的商品");
            return false;
        }

        for (var i = 0; i < checkList.length; i++) {

            var checke = $(checkList[i]);

            var siid = checke.attr('data-siid');

            var num = parseFloat(com.focusPage("#num" + siid).val());
            var outnum = parseFloat(checke.parents('li').find('b.xg').text());

            if (num > outnum) {
                com.showAlert(com.warning, "转出库数量大于剩余数量");
                return false;
            }

            options["manifestItems[" + i + "].siid"] = siid;
            options["manifestItems[" + i + "].goods.gid"] = com.typeahead("salesBalanceGoodsName" + siid); //– 商品编号
            options["manifestItems[" + i + "].color.cid"] = com.focusPage("#color" + siid).val(); //– 颜色
            options["manifestItems[" + i + "].format.fid"] = com.focusPage("#format" + siid).val(); //– 规格
            options["manifestItems[" + i + "].outstorehouse.shid"] = com.focusPage("#oshid" + siid).val();//– 仓库
            options["manifestItems[" + i + "].outprice"] = parseFloat(com.focusPage("#unitPrice" + siid).val()); //单价
            options["manifestItems[" + i + "].num"] = parseFloat(com.focusPage("#num" + siid).val()); //– 数量

        }

        com.post(api.inventory.addManifestForXG, options, function () {
            com.closePopup();
            com.showAlert(com.info, "添加成功");
            com.focusPage('#resultListItem').empty();
            com.focusPage('input[name="manifestTime"]').val("");
            com.focusPage('input[name="comment"]').val("");
        });
    }

});

