$(function() {

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

    // 查询仓库名称
    com.post(api.inventory.queryStorehouseForSelf, {}, function(res) {

        var storehousesStatus = [];

        $.each(res.storehouses, function(i, v) {

            if (v.status == constant.sales().sales.STATUS_INIT_INT) {
                storehousesStatus.push(v);
            }
        });
        manifest.storehouses = storehousesStatus;
    }, null, false);

    function manifestSales(v) {

        manifest.salesXG_params["sids[0]"] = v.sid;

        if (v.fullpayStatus != constant.sales().sales.FULLPAYSTATUS_CONFIRM_SHORT) {
            com.showAlert(com.warning, "此销售单补款未确认,无法转出库单");
            return false;
        }

        com.focusPage('#layerAdd').attr({
            'data-sid': v.sid
        });
        com.popup4model('#layerAdd', "转出库单", "", function() {

            com.clearValidator();
            com.focusPage('#resultListItem').empty();
            com.focusPage('input[name="manifestTime"]').val("");
        }, function() {

            viewSalesItems(v.sid);
        });
    }

    function buildManifestLineprops() {

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

                    return constant.sales().sales.status.keys[v.status];
                },
                clazz: "red"
            },
            balanceStatus: {
                field: "balanceStatus",
                name: "结算状态",
                prop: function(v) {

                    return constant.sales().sales.balanceStatus.keys[v.balanceStatus];
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
    }

    function buildManifestLinebtns() {

        var buttonMap = {
            delivery: {
                name: "出库",
                clazz: "btn-yellow",
                handle: manifestSales
            }
        };

        var btns = {};

        $.each(pageConfig.pageBtn, function(i, key) {

            buttonMap[key] && (btns[key] = buttonMap[key]);
        });

        return btns;
    }

    function buildManifestButtons() {

        var $adda = $('<a></a>').addClass('btn btn-minier pull-left btn-info').attr('name', 'collects').css("margin", "0px 3px");
        $('<i></i>').addClass('icon-money bigger-110').appendTo($adda);
        $('<span></span>').text('批量出库').appendTo($adda);

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
                        manifest.salesXG_params["sids[" + i + "]"] = $sids[i];
                    } else {
                        manifest.salesXG_params = {};
                        fullPayStatusFlag = false;
                        flag = false;
                    }
                });

                if (fullPayStatusFlag && flag) {
                    com.popup4model("#layerAdd", "批量转出库单", "", function() {

                        com.clearValidator();
                        com.focusPage('#resultListItem').empty();
                        com.focusPage('input[name="manifestTime"]').val("");
                    }, function() {

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
    }

    var salesSwitchManifestForXGSearcher = new Searcher();

    var salesSwitchManifestForXGSearcher = new Searcher();

    salesSwitchManifestForXGSearcher.set('condList', 'pagenation', 'resultList', pageConfig.apiPage, null, pageConfig.condArr, 'salesSwitchManifestForXGPostData', null, false, buildManifestButtons);
    salesSwitchManifestForXGSearcher.line('no', buildManifestLineprops(), buildManifestLinebtns()).render(function() {

        com.focusPage('input[name="fullpayTime"]').parent('.inline').addClass('m-wrap m-ctrl-medium date-picker');
        com.focusPage('input[name="fullpayTime"]').attr('readonly', true);
        com.focusPage('input[name="fullpayTime"]').removeAttr('placeholder');
    });

    manifest.btns.xgSaveBtn.on('click', function() {

        savePurchase(manifest.salesXG_params);
    });

    var emptyData = function() {

        var $zone = $('<div></div>').addClass('dropzone dz-clickable').css('margin', '20px').css('border', '0px').appendTo($resultList);
        var $mesg = $('<div></div>').addClass('dz-default dz-message').appendTo($zone);
        var $span = $('<span></span>').text('无可用数据提供').appendTo($mesg);
    };

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

        if (com.validate('layerAdd', 'top'))
            return false;

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

        for ( var i = 0; i < checkList.length; i++) {

            var checke = $(checkList[i]);

            var siid = checke.attr('data-siid');

            var num = parseFloat(com.focusPage("#num" + siid).val());
            var outnum = parseFloat(checke.parents('li').find('b.xg').text());

            if (num > outnum) {
                com.showAlert(com.warning, "转出库数量大于剩余数量");
                return false;
            }

            options["manifestItems[" + i + "].siid"] = siid;
            options["manifestItems[" + i + "].goods.gid"] = com.typeahead("salesBalanceGoodsName" + siid); // – 商品编号
            options["manifestItems[" + i + "].color.cid"] = com.focusPage("#color" + siid).val(); // – 颜色
            options["manifestItems[" + i + "].format.fid"] = com.focusPage("#format" + siid).val(); // – 规格
            options["manifestItems[" + i + "].outstorehouse.shid"] = com.focusPage("#oshid" + siid).val();// – 仓库
            options["manifestItems[" + i + "].outprice"] = parseFloat(com.focusPage("#unitPrice" + siid).val()); // 单价
            options["manifestItems[" + i + "].num"] = parseFloat(com.focusPage("#num" + siid).val()); // – 数量

        }

        com.post(api.inventory.addManifestForXG, options, function() {

            com.closePopup();
            com.showAlert(com.info, "添加成功");
            com.focusPage('#resultListItem').empty();
            com.focusPage('input[name="manifestTime"]').val("");
            com.focusPage('input[name="comment"]').val("");
        });
    }

});
