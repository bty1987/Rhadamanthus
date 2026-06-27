$(function() {

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

    function purchaseSales(v) {

        salesPU._params["sids[0]"] = v.sid;

        if (v.fullpayStatus == constant.sales().sales.FULLPAYSTATUS_CONFIRM_SHORT) {
            com.focusPage('#layerAdd').attr({
                'data-sid': v.sid
            });
            com.popup4model('#layerAdd', "转采购单", "", function() {

                com.clearValidator();
                com.focusPage('#resultListItem').empty();
                com.focusPage('input[name="deliveryTime"]').val("");
            }, function() {

                viewSalesItems(v.sid);
            });
        } else {
            com.showAlert(com.warning, "此销售单补款未确认,无法转采购单");
        }
    }

    var lineprops = (function() {

        var propertyMap = {
            orderId: {
                field: "orderId",
                name: "装修单号",
                prop: "orderId",
                clazz: "blue",
                click: function($this, v) {

                    tools.decoration.info($this, v.orderId);
                }
            },
            address: {
                field: "address",
                name: "楼盘地址",
                prop: function(v) {

                    return v.house.village.name + " " + v.house.houseNumber;
                },
                clazz: "grey"
            },
            customer: {
                field: "customer",
                name: "客户名",
                prop: "customer.name",
                clazz: "grey",
                click: function($this, v) {

                    tools.customer.info($this, v.customer.cid);
                }
            },
            salesman: {
                field: "salesman",
                name: "渠道",
                prop: "salesman.currentName",
                clazz: "grey",
                click: function($this, v) {

                    tools.personel.info($this, v.salesman.userId);
                }
            },
            dept: {
                field: "dept",
                name: "部门",
                prop: "dept.name",
                clazz: "grey",
                click: function($this, v) {

                    tools.department.info($this, v.dept.did);
                }
            },
            region: {
                field: "region",
                name: "分区",
                prop: "region.name",
                clazz: "grey",
                click: function($this, v) {

                    tools.department.info($this, v.region.did);
                }
            },
            guider: {
                field: "guider",
                name: "导购",
                prop: "guider.currentName",
                clazz: "grey",
                click: function($this, v) {

                    tools.personel.info($this, v.guider.userId);
                }
            },
            instorer: {
                field: "instorer",
                name: "驻店",
                prop: "instorer.currentName",
                clazz: "grey",
                click: function($this, v) {

                    tools.personel.info($this, v.instorer.userId);
                }
            },
            guideDept: {
                field: "guideDept",
                name: "主材部",
                prop: "guideDept.name",
                clazz: "grey",
                click: function($this, v) {

                    tools.department.info($this, v.guideDept.did);
                }
            },
            category: {
                field: "category",
                name: "品类",
                prop: "category",
                clazz: "grey"
            },
            brand: {
                field: "brand",
                name: "品牌",
                prop: "brand.name",
                clazz: "grey",
                click: function($this, v) {

                    tools.brand.info($this, v.brand.bid);
                }
            },
            createTime: {
                field: "createTime",
                name: "创建时间",
                prop: "createTime",
                clazz: "green"
            },
            balanceTime: {
                field: "balanceTime",
                name: "结算时间",
                prop: "balanceTime",
                clazz: "green"
            },
            fullpayTime: {
                field: "fullpayTime",
                name: "全款时间",
                prop: "fullpayTime",
                clazz: "green"
            },
            status: {
                field: "status",
                name: "状态",
                prop: function(v) {

                    return salesPU.status[v.status];
                },
                clazz: "red"
            },
            balanceStatus: {
                field: "balanceStatus",
                name: "结算状态",
                prop: function(v) {

                    return salesPU.balanceStatus[v.balanceStatus];
                },
                clazz: "red"
            },
            grade: {
                field: "grade",
                name: "等级",
                prop: "grade",
                clazz: "red"
            },
            total: {
                field: "total",
                name: "总额",
                prop: "total",
                clazz: "blue"
            },
            maling: {
                field: "maling",
                name: "抹零",
                prop: "maling",
                clazz: "blue"
            },
            venderMaling: {
                field: "venderMaling",
                name: "厂商抹零",
                prop: "venderMaling",
                clazz: "blue"
            },
            coupon: {
                field: "coupon",
                name: "券值",
                prop: "coupon",
                clazz: "blue"
            },
            couponInfo: {
                field: "couponInfo",
                name: "券信息",
                prop: "couponInfo",
                clazz: "grey"
            },
            comment: {
                field: "comment",
                name: "备注",
                prop: "comment",
                clazz: "grey"
            }
        };

        var props = [{
            type: "checkbox",
            field: "data-sid",
            prop: "sid",
            name: "sids",
            value: "sid",
            attrs: function(v) {

                return {
                    "data-sid": v.sid,
                    "data-no": v.no,
                    "data-orderId": v.orderId,
                    "data-fullPayStatus": v.fullpayStatus
                };
            }
        }];

        $.each(pageConfig.propertyArr, function(i, key) {

            propertyMap[key] && props.push(propertyMap[key]);
        });

        return props;
    })();

    var linebtns = (function() {

        var buttonMap = {
            purchase: {
                name: "采购单",
                clazz: "btn-yellow",
                handle: purchaseSales
            }
        };

        var btns = {};

        $.each(pageConfig.pageBtn, function(i, key) {

            buttonMap[key] && (btns[key] = buttonMap[key]);
        });

        return btns;
    })();

    var buttons = (function() {

        var $adda = $('<a></a>').addClass('btn btn-minier pull-left btn-info').attr('name', 'collects').css("margin", "0px 3px");
        $('<i></i>').addClass('icon-money bigger-110').appendTo($adda);
        $('<span></span>').text('批量采购单').appendTo($adda);

        $adda.click(function() {

            var flag = true;
            var fullPayStatusFlag = true;
            var fullPayStatus = [];
            var checked = com.focusPage('input[name="sids"]:checked', '#resultList');
            var $sids = [];

            if (checked.length != 0) {

                $.each(checked, function(i, v) {

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
                    com.popup4model("#layerAdd", "批量转采购单", "", function() {

                        com.clearValidator();
                        com.focusPage('#resultListItem').empty();
                        com.focusPage('input[name="deliveryTime"]').val("");
                    }, function() {

                        viewSalessItems(salesPU._params);
                    });

                } else if (fullPayStatusFlag == false && flag == true || fullPayStatusFlag == false && flag == false) {
                    com.showAlert(com.warning, "销售单中有补款未确认,无法转采购单");
                }

            } else {
                com.showAlert(com.warning, "请选择销售单");
            }
        });

        return [];
    })();

    var salesSwitchPurchaseSearcher = new Searcher();

    var salesSwitchPurchaseSearcher = new Searcher();

    salesSwitchPurchaseSearcher.set('condList', 'pagenation', 'resultList', pageConfig.apiPage, null, pageConfig.condArr, 'salesSwitchPurchasePostData', null, false, buildPurchaseButtons);
    salesSwitchPurchaseSearcher.line('no', lineprops, linebtns).render(function() {

        com.focusPage('input[name="fullpayTime"]').parent('.inline').addClass('m-wrap m-ctrl-medium date-picker');
        com.focusPage('input[name="fullpayTime"]').attr('readonly', true);
        com.focusPage('input[name="fullpayTime"]').removeAttr('placeholder');
    });

    salesPU.btns.puSaveBtn.on('click', function() {

        savePurchase(salesPU._params);
    });

    function viewSalesItems(sid) {

        com.post(api.sales.querySalesItemBySid, {
            "sales.sid": sid
        }, function(res) {

            initList.init('resultListItem', res.salesItems);
        }, null, false);
    }

    function viewSalessItems(options) {

        com.post(api.sales.querySalesItemBySids, options, function(res) {

            initList.init('resultListItem', res.salesItems);
        }, null, false);
    }

    function savePurchase(sids) {

        if (com.validate('layerAdd', 'right'))
            return;

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

        for ( var i = 0; i < checkList.length; i++) {

            var checke = $(checkList[i]);
            var siid = checke.attr('data-siid');
            var num = parseFloat(com.focusPage("#num" + siid).val());
            var outnum = parseFloat(checke.parents('li').find('b.pu').text());

            if (num > outnum) {
                com.showAlert(com.warning, "转采购数量大于剩余数量");
                return false;
            }

            options["purchaseItems[" + i + "].siid"] = siid;
            options["purchaseItems[" + i + "].goods.gid"] = com.typeahead("salesBalanceGoodsName" + siid); // – 商品编号
            options["purchaseItems[" + i + "].color.cid"] = com.focusPage("#color" + siid).val(); // – 颜色
            options["purchaseItems[" + i + "].format.fid"] = com.focusPage("#format" + siid).val(); // – 规格
            options["purchaseItems[" + i + "].inprice"] = parseFloat(com.focusPage("#unitPrice" + siid).val()); // 单价
            options["purchaseItems[" + i + "].num"] = parseFloat(com.focusPage("#num" + siid).val()); // – 数量

        }

        com.post(api.inventory.addPurchase, options, function() {

            com.closePopup();
            com.showAlert(com.info, "添加成功");
            com.focusPage('#resultListItem').empty();
            com.focusPage('input[name="comment"]').val("");
            com.focusPage('input[name="deliveryTime"]').val("");
        });

    }
});
