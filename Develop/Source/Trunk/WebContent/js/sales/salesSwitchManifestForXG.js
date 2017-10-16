$(function () {

    if (jQuery().datepicker) {
        $('#layerAdd input[name="manifestTime"]').datepicker({
            autoclose:true,
            format: 'yyyy-mm-dd',//yyyy-mm-dd hh:ii,
        });
    }

    var $siids = [];

    var manifest = {
        total: null,
    };

    com.post(api.inventory.queryStorehouseForSelf, {}, function(res){
        var storehousesStatus = [];

        $.each(res.storehouses,function(i,v){
            if(v.status==0){
                storehousesStatus.push(v);
            }
        })
        manifest.storehouses = storehousesStatus;
    }, null, false);

    var displayFunc = (function () {

        var renderList = function (tableId, listData) {

            var $tableWrap = $('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list ui-sortable  fl-table-list');

            if (listData && listData.length) {
                $.each(listData, function (i, v) {

                    var $liLine = $('<li></li>').addClass('item-blue clearfix');
                    var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                    var $h3 = $('<h3></h3>').addClass('sid');
                    var $btnDiv = $('<div></div>').addClass('action-buttons pull-right').css('margin-right', '2%');

                    var status = "";
                    var balanceStatus = "";

                    switch (v.status) {
                        case 0:
                            status = "初始";
                            break;
                        case 2:
                            status = "全退";
                            break;
                        case 3:
                            status = "倒单";
                            break;
                        case 4:
                            status = "废单";
                            break;
                        case 5:
                            status = "完结";
                            break;

                    }

                    switch (v.balanceStatus) {
                        case 0:
                            balanceStatus = "初始";
                            break;
                        case 1:
                            balanceStatus = "预结算";
                            break;
                        case 2:
                            balanceStatus = " 厂商结算";
                            break;
                        case 3:
                            balanceStatus = " 结算";
                            break;

                    }


                    var $btnSwitch = $('<a></a>').addClass('btn btn-minier').html('转出库单');

                    var propertyArr = [
                        ["订单编号:", v.orderId, "grey"],
                        ["楼盘地址:", v.village.villageName + " " + v.houseNumber, "grey"],
                        ["客户名:", v.customer.customerName, "grey"],
                        ["渠道:", v.salesman.userName, "grey"],
                        ["部门:", v.dept.deptName, "grey"],
                        ["分区:", v.region.deptName, "grey"],
                        ["导购:", v.guider.userName, "grey"],
                        ["驻店:", v.instorer.currentName, "grey"],
                        ["主材部:", v.guideDept.deptName, "grey"],
                        ["品类:", v.category, "grey"],
                        ["品牌:", v.brand, "grey"],
                        ["创建时间:", v.createTime, "grey"],
                        ["结算时间:", v.balanceTime, "grey"],
                        ["全款时间:", v.fullpayTime, "grey"],
                        ["状态:", status, "grey"],
                        ["结算状态:", balanceStatus, "grey"],
                        ["总额:", v.total, "grey"],
                        ["抹零:", v.maling, "grey"],
                        ["厂商抹零:", v.venderMaling, "grey"],
                        ["券值:", v.coupon, "grey"],
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

                    var _span = $('<span></span>').addClass('lbl grey bigger-150').css('font-weight','bold').html(v.no)

                    _label.append($input).append(_span).appendTo($label)

                    $.each(propertyArr, function (index, value) {
                        var $liProperty = $('<li></li>').css({"border-bottom": "0px"});
                        $('<strong></strong>').html(value[0]).appendTo($liProperty);
                        $('<b></b>').html(value[1]).css({color: value[2]}).appendTo($liProperty);
                        $liProperty.appendTo($ulProperty);
                    });

                    $label.appendTo($h3);

                    $btnDiv.append($btnSwitch).appendTo($h3);

                    $liLine.appendTo($ul);
                    $liLine.append($h3).append($ulProperty);

                    $btnSwitch.click(function () {
                        if (v.fullpayStatus == 2) {
                            viewSalesItems(v.sid)
                            openlayer($btnSwitch.html(), function () {
                                savePurchase();
                            })
                        } else {
                            layer.msg('此销售单补款未确认,无法转出库单', {time: 2e3})
                        }

                    })


                });

                $ul.appendTo($tableWrap);
            }
        };


        return {
            init: function (tableId, listData) {
                $('#' + tableId).html(null);
                renderList(tableId, listData);
            }
        };

    })();
    var _condArr = ['no', 'orderId', 'instorerId', 'salesmanId','salesDeptName','fullpayTime'];

    var salesSwitchManifestForXGSearcher = new Searcher();

    salesSwitchManifestForXGSearcher.init(_condArr, 'condList', api.inventory.pageSales, function (data) {
        $('input[name="fullpayTime"]').parent('.inline').addClass('m-wrap m-ctrl-medium date-picker');
        $('input[name="fullpayTime"]').attr('readonly', true);
        $('input[name="fullpayTime"]').removeAttr('placeholder');

        displayFunc.init('resultList', data)
    }, 'pagenation', 'salesSwitchManifestForXGPostData', null, false, null, function () {
        var $adda = $('<a></a>').addClass('btn btn-minier blue pull-left').attr('name', 'collects').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-money bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('批量转出库单').appendTo($adda);

        $adda.click(function () {

                var _params = {};
                var flag = true;
                var fullPayStatusFlag = true;
                var fullPayStatus = []
                var checked = $('input[name="sids"]:checked', '#resultList')
                var $sids = [];

                if (checked.length != 0) {

                    $.each(checked, function (i, v) {
                        var $this = $(v);
                        fullPayStatus.push($this.attr('data-fullPayStatus'))
                        $sids.push($this.attr('data-sid'));
                        if (fullPayStatus[i] == 2 && flag) {
                            _params["sids[" + i + "]"] = $sids[i];
                        } else {
                            _params = {};
                            fullPayStatusFlag = false;
                            flag = false;
                        }
                    })

                    if (fullPayStatusFlag && flag) {
                        viewSalessItems(_params)
                        openlayer($addspan.text(), function () {
                            savePurchase()
                        })
                    } else if (fullPayStatusFlag == false && flag == true || fullPayStatusFlag == false && flag == false) {
                        layer.msg('销售单中有补款未确认,无法转出库单', {time: 2e3})
                    }

                } else {
                    layer.msg("请选择销售单", {time: 2e3})
                }

            }
        )
        return [$adda]

    }, 'resultList')


    function viewSalesItems(sid) {
        com.post(api.inventory.querySalesItemBySid, {
            "sales.sid": sid
        }, function (res) {
            initList.init('resultListItem', res.salesItems);
        })
    }

    function viewSalessItems(options) {
        com.post(api.inventory.querySalesItemBySids, options, function (res) {

            initList.init('resultListItem', res.salesItems);
        })
    }

    function savePurchase() {

        if (!checkInfo()) return;

        cyclTotal();
        
        var options = {
            "manifest.comment": $('#layerAdd input[name="comment"]').val(),
            "manifest.manifestTime": $('#layerAdd input[name="manifestTime"]').val(),
            "manifest.total": $('#layerAdd input[name="total"]').val(),
            "manifest.attachment": "",
            "manifest.type":3,
        }
        var checkList = $('input[name="siids"]:checked', '#resultListItem')
        var $liline = checkList.parents('.siid');
        $siids = [];
        $.each(checkList, function (i, v) {
            var $this = $(v);
            $siids.push($this.attr('data-siid'));
            options["manifestItems[" + i + "].siid"] = $this.attr('data-siid');
            options["manifestItems[" + i + "].goods.gid"] = $this.attr('data-gid');            //– 商品编号
            options["manifestItems[" + i + "].color.cid"] = $this.attr('data-cid');  //– 颜色
            options["manifestItems[" + i + "].format.fid"] = $this.attr('data-fid');//– 规格
            options["manifestItems[" + i + "].outstorehouse.shId"] = $this.parents('.siid').find('select.outStroehouse').val();//– 仓库
            options["manifestItems[" + i + "].unitPrice"] = $this.parents('.siid').find('input.unitPrice').val();  //单价
            options["manifestItems[" + i + "].num"] = $this.parents('.siid').find('input.inputNumber').val();           //– 数量
        })

        if (checkList.length != 0) {
            if (checkRowValue($liline, $siids)) {
                com.post(api.inventory.addManifestForXG, options, function () {
                    layer.closeAll();
                    layer.msg('添加成功')
                    $('#resultListItem').empty()
                    $('input[name="manifestTime"]').val("")
                }, function (e) {
                    com.showAlert(com.error, e.errorMsg);
                })
            }
        } else {
            layer.msg("请选择需要转出库单的商品")
        }

    }

    var initList = (function () {

        var renderList = function (tableId, listData) {
            var $tableWrap = $('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list ui-sortable  fl-table-list');

            if (listData && listData.length) {
                $.each(listData, function (i, v) {
                    var $liLine = $('<li></li>').addClass('clearfix');
                    var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix col-xs-12').attr({'data-discount':v.discount,'data-postDis':v.postDis});
                    var $h3 = $('<h3></h3>').addClass('siid')
                    var $btnDiv = $('<div></div>').addClass('action-buttons pull-right').attr('data-num', v.num).attr('data-selling', v.price).attr('data-siid', v.siid);

                    var propertyArr = [
                        ["商品品类:", v.goods.category, "grey", "category"],
                        ["商品颜色:", v.color.name, "grey", "color"],
                        ["商品规格:", v.format.info, "grey", "format"],
                        ["售价:", v.selling, "grey", "selling"],
                        //["折扣:", v.discount, "grey", "discount"],
                        ["折扣价:", v.disPrice, "grey", "disPrice"],
                        //["折让:", v.postDis, "grey", "postDis"],
                        ["折让价:", v.price, "grey", "price"],
                        ["数量:", v.num, "grey", "num"],
                        ["总价:", v.total, "grey", "total"],
                        ["原结算方式:", v.rawCtype==0?"底价":"点位", "grey", "rawCtype"],
                        ["原结算值:", v.rawCvalue, "grey", "rawCvalue"],
                        ["结算方式:", v.ctype==0?"底价":"点位", "grey", "ctype"],
                        ["结算值:", v.cvalue, "grey", "cvalue"],
                        ["备注:", v.comment, "grey", "conment"],
                    ];

                    var $label = $('<label></label>').addClass('control-label col-xs-12').css({
                        'color': 'grey',
                        'font-size': '20px',
                        "font-weight": "bold"
                    });

                    var inputSpan = $('<label></label>').addClass('pull-right').css({
                        'font-size': '14px',
                        'font-weight': 'bold'
                    }).html('售价:');
                    var inputNum = $('<input>').addClass('unitPrice').css({
                        'margin-left': '20px',
                        'width': '40%',
                    }).appendTo(inputSpan).attr('readOnly','readOnly').val(v.price);

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
                        'margin-top':'-4px',
                    }).html('出货仓库:');

                    var inputOutStroehouse = $('<select></select>').addClass('outStroehouse').css({
                        'margin-left': '20px',
                    }).appendTo(inputSpanOutStroehouse);

                    inputOutStroehouse.bindData(manifest.storehouses,'shId','name');

                    var btnSpanSearchStroeStock = $('<label></label>').addClass('pull-right').css({
                        'font-size': '20px',
                        'font-weight': 'bold',
                        'margin-top':'-4px',
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
                        "data-num": v.num,
                    }).addClass('ace ace-checkbox-2');

                    var _span = $('<span></span>').addClass('lbl grey bigger-150').css('font-weight','bold').html(v.goods.name);

                    _label.append($input).append(_span).appendTo($label)

                    $.each(propertyArr, function (index, value) {
                        var $liProperty = $('<li></li>').css({"border-bottom": "0px"});
                        $('<strong></strong>').attr('name', value[3]).html(value[0]).appendTo($liProperty);
                        $('<b></b>').html(value[1]).css({color: value[2]}).appendTo($liProperty);
                        $liProperty.appendTo($ulProperty);
                    });

                    $label.append(btnSpanSearchStroeStock).append(inputSpanOutStroehouse).append(inputSpan).append(inputSpanNum).appendTo($h3);


                    $btnDiv.appendTo($h3);

                    $liLine.appendTo($ul);
                    $liLine.append($h3).append($ulProperty);

                    //查询库存点击事件
                    btnSearchStroeStock.click(function(){

                        var optionStroe = {
                            "goodsStorehouseStock.goods.gid":v.goods.gid,
                            "goodsStorehouseStock.color.cid": v.color.cid,
                            "goodsStorehouseStock.format.fid": v.format.fid,
                            "goodsStorehouseStock.storehouse.shId":$liLine.find('select.outStroehouse').val(),
                        };

                        com.post(api.inventory.queryGoodsStorehouseStockByShIdAGId,optionStroe,function(res){
                            if(res.goodsStorehouseStock.num == null){
                                layer.msg("该仓库没有此商品",{time:3e3});
                            }else {
                                layer.msg("该仓库商品剩余库存:"+res.goodsStorehouseStock.num,{time:3e3});
                            }
                        },function(e){
                            btn.button('reset');
                            com.showAlert(com.info, e.errorMsg);
                        });

                    })


                });

                $ul.appendTo($tableWrap);
            }
        };


        return {
            init: function (tableId, listData) {
                $('#' + tableId).html(null);
                renderList(tableId, listData);
            }
        };

    })();


    function openlayer(title, callback) {
        layer.closeAll();
        layer.open({
            type: 1,
            skin: 'layui-layer-lan',
            title: title,
            content: $('#layerAdd'),
            area: ["1200px", ( $(window).height() * 0.84 < 800 ? $(window).height() * 0.84 : 800 ) + "px"],
            maxmin: true,
            zIndex: 9000,
            btn: ['确定', '取消'],
            yes: function (index, layero) {
                callback(index, layero);
            },
            btn2: function (index, layero) {
                //按钮【按钮二】的回调
                $('#resultListItem').empty()
                $('input[name="manifestTime"]').val("")
            },
            cancel: function () {
                //右上角关闭回调
                $('#resultListItem').empty()
                $('input[name="manifestTime"]').val("")
            }
        });
    }

    function checkInfo() {

        var flag = true;

        var date = $('[name="manifestTime"]', '#layerAdd');
        if (!date.val()) {
            date.focus().select();

            date.addClass('popover-notitle').attr({
                "data-rel": "popover",
                "data-placement": "bottom",
                "data-original-title": "",
                "title": "",
                "data-content": "请选择日期"

            }).popover('show');

            flag = false;
        } else {
            date.popover('destroy');
        }

        return flag;

    }

    function checkRowValue($line, siids) {

        var flag = true;

        var _option = {};

        $.each(siids, function (i, v) {
            _option["siids[" + i + "]"] = v;
        })

        var flags = {};

        com.post(api.inventory.queryManifestItemBySiids, _option, function (res) {
            $.each(res.manifestItems,function(i,v){
                if(!flags[v.siid]){
                    flags[v.siid]=0;
                    flags[v.siid]+=v.num;
                }else{
                    flags[v.siid]+=v.num;
                }

            })
        },null,false);

        $.each($line,function(i,v){
            var num = $(v).find('input.inputNumber');
            var Tnum = $(v).next().find('[name="num"]').next().text();
            var subnum = flags[$(v).find('input[name="siids"]').attr('data-siid')];
            var numRex = /^\d+$/;
            if (!(numRex.test(num.val()) && parseFloat(num.val()) > 0 && parseFloat(Tnum)>=parseFloat(num.val()) && parseFloat(num.val())<= parseFloat(subnum==undefined?Tnum:parseFloat(Tnum-subnum)))) {
                num.focus().select();
                num.addClass('tooltip-info').attr({
                    "data-rel": "popover",
                    "data-placement": "top",
                    "data-original-title": "",
                    "title": "",
                    "data-content": "数量输入不正确!"
                }).popover('show');
                flag = false;
            } else {
                num.popover('destroy');
            }

        })


        return flag;
    }

    function cyclTotal() {

        var _total = 0;

        var $list = $('.checked', '#resultListItem');
        $list.length && $list.each(function () {
            var $this = $(this);
            if ($this.parents('.siid').find('input.unitPrice').val()) {
                _total = utils.accAdd(utils.accMul(parseFloat($this.parents('.siid').find('input.unitPrice').val() + ''), $this.parents('.siid').find('input.inputNumber').val()), _total);
            }
        });

        manifest.totalSum = _total;

        $('input[name="total"]').val(_total);
    }

})

