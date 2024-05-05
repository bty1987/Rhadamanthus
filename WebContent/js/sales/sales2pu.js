$(function () {

    var salesPU = {
        _params: {},
        status: constant.sales().sales.status.keys,
        balanceStatus: constant.sales().sales.balanceStatus.keys,
        btns: {
            puSaveBtn: com.focusPage("#puSaveBtn")
        }
    };

    var pageConfig = drawNode.getConfig(params['urlLoadParams'].type);

    com.datetime(com.focusPage('#layerAdd input[name="deliveryTime"]'));

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

                    var $btnSwitch = $('<a></a>').addClass('btn btn-minier btn-yellow').html('采购单');

                    var propertyArr = [];
                    $.each(pageConfig.propertyArr, function (pi, pv) {
                        switch (pv) {
                            case "orderId":
                                propertyArr.push(["装修单号:", v.orderId, "blue", tools.decoration.info, v.orderId]);
                                break;
                            case "address":
                                propertyArr.push(["楼盘地址:", (v.house.village.name + " " + v.house.houseNumber), "grey"]);
                                break;
                            case "customer":
                                propertyArr.push(["客户名:", v.customer.name, "grey", tools.customer.info, v.customer.cid]);
                                break;
                            case "salesman":
                                propertyArr.push(["渠道:", v.salesman.currentName, "grey", tools.personel.info, v.salesman.userId]);
                                break;
                            case "dept":
                                propertyArr.push(["部门:", v.dept.name, "grey", tools.department.info, v.dept.did]);
                                break;
                            case "region":
                                propertyArr.push(["分区:", v.region.name, "grey", tools.department.info, v.region.did]);
                                break;
                            case "guider":
                                propertyArr.push(["导购:", v.guider.currentName, "grey", tools.personel.info, v.guider.userId]);
                                break;
                            case "instorer":
                                propertyArr.push(["驻店:", v.instorer.currentName, "grey", tools.personel.info, v.instorer.userId]);
                                break;
                            case "guideDept":
                                propertyArr.push(["主材部:", v.guideDept.name, "grey", tools.department.info, v.guideDept.did]);
                                break;
                            case "category":
                                propertyArr.push(["品类:", v.category, "grey"]);
                                break;
                            case "brand":
                                propertyArr.push(["品牌:", v.brand, "grey", tools.brand.info, v.bid]);
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
                                propertyArr.push(["状态:", salesPU.status[v.status], "red"]);
                                break;
                            case "balanceStatus":
                                propertyArr.push(["结算状态:", salesPU.balanceStatus[v.balanceStatus], "red"]);
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

                    $.each(propertyArr, function(index, value) {

                        var $liProperty = $('<li></li>').appendTo($ulProperty);

                        $('<strong></strong>').html(value[0]).appendTo($liProperty);
                        $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);

                        if (value.length == 5) {
                            $liProperty.click(function() {

                                value[3]($liProperty, value[4]);

                            }).css("cursor", "pointer");
                        }
                    });

                    $label.appendTo($h3);

                    $.each(pageConfig.pageBtn, function (k, b) {
                        switch (b) {
                            case "purchase":
                                $btnDiv.append($btnSwitch);
                                break;
                        }
                    });

                    $btnDiv.appendTo($h3);

                    $liLine.appendTo($ul);
                    $liLine.append($h3).append($ulProperty);

                    $btnSwitch.click(function () {

                        salesPU._params["sids[0]"] = v.sid;

                        if (v.fullpayStatus == constant.sales().sales.FULLPAYSTATUS_CONFIRM_SHORT) {
                            com.focusPage('#layerAdd').attr({'data-sid': v.sid});
                            com.popup4model('#layerAdd', "转采购单", "", function () {
                                com.clearValidator();
                                com.focusPage('#resultListItem').empty();
                                com.focusPage('input[name="deliveryTime"]').val("");
                            }, function () {
                                viewSalesItems(v.sid);
                            });
                        } else {
                            com.showAlert(com.warning, "此销售单补款未确认,无法转采购单");
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

                    var $goods = $('<label></label>').css({'font-size': '14px','font-weight': 'bold', "margin-top":"6px"}).html('商品名:');
                    var goodsName = $('<input id = "salesBalanceGoodsName' + v.siid + '">').css({'margin-left': '10px'}).appendTo($goods).val(v.goods.name).attr('data-typeahead-key',v.goods.gid);

                    var $color = $('<label></label>').css({'font-size': '14px','font-weight': 'bold', "margin-left": "20px"}).html('颜色:');
                    var goodsColor = $('<select id="color' + v.siid + '"></select>').css({'margin-left': '10px'}).appendTo($color);

                    var $format = $('<label></label>').css({'font-size': '14px','font-weight': 'bold', "margin-left": "20px"}).html('规格:');
                    var goodsFormat = $('<select id="format' + v.siid + '"></select>').css({'margin-left': '10px'}).appendTo($format);

                    var inputSpan = $('<label></label>').css({'font-size': '14px','font-weight': 'bold', "margin-left": "20px"}).html('单价:');
                    var inputNum = $('<input id="unitPrice' + v.siid + '">').addClass('unitPrice').css({'margin-left': '20px', 'width': '40%'}).appendTo(inputSpan);
                    
                    var inputSpanNum = $('<label></label>').css({'font-size': '14px', 'font-weight': 'bold',"margin-left": "-50px",'margin-top': '-4px'}).html('数量:');
                    var inputNumber = $('<input>').attr("id", "num" + v.siid).addClass('inputNumber').css({'margin-left': '20px', 'width': '40%'}).appendTo(inputSpanNum);
                    
                    var btnSpanSearchStroeStock = $('<label></label>').css({'font-size': '20px', 'font-weight': 'bold', 'height': '26px', 'margin-top': '-4px', "margin-left": "-40px"});
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
                        "data-num": v.num,
                        "data-price": v.price,
                        "data-i": i
                    }).addClass('ace ace-checkbox-2');

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

                    $input.change(function () {
                        if ($input.prop('checked')) {
                            inputNumber.addClass("v_float_3");
                            inputNum.addClass("v_float_3");
                            goodsName.addClass("v_required");
                        } else {
                            inputNumber.removeClass("v_float_3");
                            inputNum.removeClass("v_float_3");
                            goodsName.removeClass("v_required");
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
                    div.append($goods).append($color).append($format).append(inputSpan).append(inputSpanNum).append(btnSpanSearchStroeStock).appendTo($h3);
                    $liLine.appendTo($ul);
                    $liLine.append($h3).append($ulProperty);

                    btnSearchStroeStock.bindClick(function () {

                        var _option = {
                            "goodsStorehouseStock.goods.gid": com.typeahead(goodsName),
                            "goodsStorehouseStock.color.cid": goodsColor.val(),
                            "goodsStorehouseStock.format.fid": goodsFormat.val()
                        };

                        com.post(api.inventory.queryGoodsStorehouseStockByGid, _option, function (res) {
                            if (res.nums == null) {
                                com.showAlert(com.warning, "该商品没有库存");
                            } else {
                                com.showAlert(com.warning, '该商品剩余库存:' + res.nums);
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

    var salesSwitchPurchaseSearcher = new Searcher();

    salesSwitchPurchaseSearcher.init(pageConfig.condArr, 'condList', pageConfig.apiPage, function (data) {
        com.focusPage('input[name="fullpayTime"]').parent('.inline').addClass('m-wrap m-ctrl-medium date-picker');
        com.focusPage('input[name="fullpayTime"]').attr('readonly', true);
        com.focusPage('input[name="fullpayTime"]').removeAttr('placeholder');

        displayFunc.init('resultList', data);
    }, 'pagenation', 'salesSwitchPurchasePostData', null, false, null, function () {
        var $adda = $('<a></a>').addClass('btn btn-minier pull-left btn-info').attr('name', 'collects').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-money bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('批量采购单').appendTo($adda);

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
                            salesPU._params["sids[" + i + "]"] = $sids[i];
                        } else {
                            salesPU._params = {};
                            fullPayStatusFlag = false;
                            flag = false;
                        }
                    });

                    if (fullPayStatusFlag && flag) {
                        com.popup4model("#layerAdd", "批量转采购单", "", function () {
                            com.clearValidator();
                            com.focusPage('#resultListItem').empty();
                            com.focusPage('input[name="deliveryTime"]').val("");
                        }, function () {
                            viewSalessItems(salesPU._params);
                        });

                    } else if (fullPayStatusFlag == false && flag == true || fullPayStatusFlag == false && flag == false) {
                        com.showAlert(com.warning, "销售单中有补款未确认,无法转采购单");
                    }

                } else {
                    com.showAlert(com.warning, "请选择销售单");
                }
            }
        );
        return [];

    }, 'resultList');

    salesPU.btns.puSaveBtn.on('click', function () {
        savePurchase(salesPU._params);
    });

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

        if (com.validate('layerAdd', 'right')) return;

        var options = {
            "purchase.comment": com.focusPage('#layerAdd input[name="comment"]').val(),
            "purchase.deliveryTime": com.focusPage('#layerAdd input[name="deliveryTime"]').val()
        };

        $.extend(options, sids);

        var checkList = com.focusPage('input[name="siids"]:checked', '#resultListItem');

        if (checkList.length === 0) {
            com.showAlert(com.warning, "请选择需要转采购单的商品");
            return false;
        }

        for (var i = 0; i < checkList.length; i++) {

            var checke = $(checkList[i]);
            var siid = checke.attr('data-siid');
            var num = parseFloat(com.focusPage("#num" + siid).val());
            var outnum = parseFloat(checke.parents('li').find('b.pu').text());

            if (num > outnum) {
                com.showAlert(com.warning, "转采购数量大于剩余数量");
                return false;
            }

            options["purchaseItems[" + i + "].siid"] = siid;
            options["purchaseItems[" + i + "].goods.gid"] = com.typeahead("salesBalanceGoodsName" + siid);  //– 商品编号
            options["purchaseItems[" + i + "].color.cid"] = com.focusPage("#color" + siid).val();  //– 颜色
            options["purchaseItems[" + i + "].format.fid"] = com.focusPage("#format" + siid).val(); //– 规格
            options["purchaseItems[" + i + "].inprice"] = parseFloat(com.focusPage("#unitPrice" + siid).val());  //单价
            options["purchaseItems[" + i + "].num"] = parseFloat(com.focusPage("#num" + siid).val());    //– 数量

        }

        com.post(api.inventory.addPurchase, options, function () {
            com.closePopup();
            com.showAlert(com.info, "添加成功");
            com.focusPage('#resultListItem').empty();
            com.focusPage('input[name="comment"]').val("");
            com.focusPage('input[name="deliveryTime"]').val("");
        });

    }
});
