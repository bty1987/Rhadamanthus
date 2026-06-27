$(function() {

    var salesPre = {
        salesPre_data: {},
        url: api.sales.pageSalesForBalance,
        postData: "salesPreBalancePostData",
        pageType: params['urlLoadParams'].type,
        btns: {
            preSaveBtn: com.focusPage("#preSaveBtn")
        }
    };

    var pageConfig = drawNode.getConfig(params['urlLoadParams'].type);

    if (salesPre.pageType == "predompany") {
        salesPre.postData = "salesPreBalanceForDompanyPostData";
    } else if (salesPre.pageType == "prepompany") {
        salesPre.postData = "salesPreBalanceForPompanyPostData";
    }

    function detailSales(v) {

        var flag = true;

        if (salesPre.pageType == "predompany") {
            flag = false;
        }

        com.focusPage('#viewPopUp').attr({
            'data-sid': v.sid,
            'data-dompany': flag
        });
        com.popup4page("#viewPopUp", "views/sales/salesBalance4detail.html", "预结销售单号" + v.no, "", function() {

            salesPreBalance.doSearch();
        });
    }

    function wipezeroSales(v) {

        com.focusPage('#maling').val(utils.accAdd(v.maling, v.venderMaling));
        com.focusPage('#originalMaling').val(v.maling);
        com.focusPage('#venderMaling').val(v.venderMaling);
        com.focusPage('#editVenderMaling').val(0);

        com.popup4model("#editLayer", "修改抹零", function() {

            salesPre.salesPre_data = v;
        }, function() {

            com.clearValidator();
        }, "");
    }

    function preSales(v) {

        var _option = {};
        _option["sid[0]"] = v.sid;

        com.showConfirm('确定要将单号为 ' + v.no + ' 的销售单进行预结吗?', function() {

            com.post(api.sales.preSalesBalance, _option, function() {

                com.showAlert(com.info, "预结成功");
                salesPreBalance.doSearch();
            });

        }, function() {

            salesPreBalance.doSearch();
        });
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
            brand: {
                field: "brand",
                name: "品牌",
                prop: "brand.name",
                clazz: "grey",
                click: function($this, v) {

                    tools.brand.info($this, v.brand.bid);
                }
            },
            depositpay: {
                field: "depositpay",
                name: "定金",
                prop: "depositpay",
                clazz: "blue"
            },
            fullpay: {
                field: "fullpay",
                name: "补款",
                prop: "fullpay",
                clazz: "blue"
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
                name: "补款时间",
                prop: "fullpayTime",
                clazz: "green"
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
            details: {
                name: "查看",
                clazz: "btn-yellow",
                handle: detailSales
            },
            wipezero: {
                name: "抹零",
                clazz: "btn-warning",
                handle: wipezeroSales
            },
            pre: {
                name: "预结",
                clazz: "btn-success",
                handle: preSales
            }
        };

        var btns = {};

        $.each(pageConfig.pageBtn, function(i, key) {

            buttonMap[key] && (btns[key] = buttonMap[key]);
        });

        return btns;
    })();

    var buttons = (function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-info pull-left').attr('name', 'collects').css("margin", "0px 3px");
        $('<i></i>').addClass('icon-ok bigger-110').appendTo($adda);
        $('<span></span>').text('批量预结').appendTo($adda);

        var $addaEnd = $('<a></a>').addClass('btn btn-minier btn-danger pull-left').attr('name', 'collects').css("margin", "0px 3px");
        $('<i></i>').addClass('icon-ok bigger-110').appendTo($addaEnd);
        $('<span></span>').text('完结').appendTo($addaEnd);

        $adda.click(function(e) {

            e.stopPropagation();

            var _option = {};
            var $inputs = com.focusPage('input[name="sids"]:checked', '#resultList');

            if (!$inputs.length) {
                com.showAlert(com.warning, "请选择需要进行预结的销售单");
                return;
            }

            $.each($inputs, function(i, v) {

                _option["sid[" + i + "]"] = $(v).attr('data-sid');
            });

            com.showConfirm('确定要将选中的销售单进行预结吗?', function() {

                com.post(api.sales.preSalesBalance, _option, function() {

                    com.showAlert(com.info, "操作成功");
                    salesPreBalance.doSearch();
                });
            }, function() {

                salesPreBalance.doSearch();
            });
        });

        $addaEnd.click(function(e) {

            e.stopPropagation();

            var _option = {};
            var $inputs = com.focusPage('input[name="sids"]:checked', '#resultList');

            if (!$inputs.length) {
                com.showAlert(com.warning, "请选择需要进行完结的销售单");
                return;
            }

            $.each($inputs, function(i, v) {

                _option["sid[" + i + "]"] = $(v).attr('data-sid');
            });

            com.showConfirm('确定要将选中的销售单进行完结吗?', function() {

                com.post(api.sales.passSalesBalance, _option, function() {

                    com.showAlert(com.info, "操作成功");
                    salesPreBalance.doSearch();
                });
            }, function() {

                salesPreBalance.doSearch();
            });
        });

        return salesPre.pageType == "predompany" ? [] : [$adda, $addaEnd];
    })();

    var salesPreBalance = new Searcher();

    salesPreBalance.set('condList', 'pagenation', 'resultList', pageConfig.apiPage, null, pageConfig.condArr, salesPre.postData, null, false, buildSalesPreButtons);
    salesPreBalance.line('no', lineprops, linebtns).render();

    salesPre.btns.preSaveBtn.on('click', function() {

        if (!checkRowValue()) {
            return;
        }

        com.post(api.sales.updateSalesForMaling, {
            "sales.sid": salesPre.salesPre_data.sid,
            "sales.maling": utils.accSub(com.focusPage('#maling').val(), com.focusPage('#editVenderMaling').val()),
            "sales.venderMaling": com.focusPage('#editVenderMaling').val()
        }, function() {

            salesPreBalance.doSearch();
            com.closePopup();
        });
    });

    function checkRowValue() {

        var flag = true;

        if (parseFloat(com.focusPage('#editVenderMaling').val()) > parseFloat(com.focusPage('#maling').val())) {

            com.focusPage('#editVenderMaling').focus().select();
            com.showTip(com.focusPage('#editVenderMaling'), "修改厂商抹零数据不能超过抹零总数!", "right");
            flag = false;
        }
        return flag;
    }
});
