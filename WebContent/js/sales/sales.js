$(function() {

    var sales = {

        sales: null,

        modals: {
            decorationInfo: com.focusPage("#decorationInfo"),
            ascription: com.focusPage("#ascription"),
            repositPaymentModal: com.focusPage("#repositPaymentModal"),
            salesActivitysModal: com.focusPage("#salesActivitysModal"),
            peliveryModal: com.focusPage("#peliveryModal"),
        },
        items: {
            total: com.focusPage('#total'), // 款项中的总价
            depositPayment: com.focusPage('#depositPayment'),// 款项中的定金
            realDepositPayment: com.focusPage('#realDepositPayment'),// 款项中的实收定金
            fullPayment: com.focusPage('#fullPayment'), // 款项中的补款
            realFullPayment: com.focusPage('#realFullPayment'),// //款项中的实收补款
            couponInf: com.focusPage('#couponInf'), // 款项中的券信息
            couponType: com.focusPage('#couponType'),// 款项中的券信息点击修改后的查询劵的input的ID(第一个)
            couponValue: com.focusPage('#couponValue'),// 款项中的券信息点击修改后劵数量的input的ID(第二个)
            coupon: com.focusPage('#coupon'),// 款项中的券值
            maling: com.focusPage('#maling'),// 款项中的抹零
            malingValue: com.focusPage('#malingValue'),// 款项中的抹零点击修改后的input的ID

            couponInfoDiv: com.focusPage('#couponInfo'),
            malingInfoDiv: com.focusPage('#malingInfo'),

            depositPaymentInfo: com.focusPage('#depositPaymentInfo'), // 实收金额
            fullPaymentInfo: com.focusPage('#fullPaymentInfo'),// 实收补款

            layerAdd: com.focusPage('#layerAdd'),// 款项按钮的弹窗
            fullPaymentTotal: com.focusPage('#fullPaymentTotal'),// 折让审批弹窗中的补款总额
            approver: com.focusPage('#approver'),// 折让审批弹窗中的审批人
            approvalComment: com.focusPage('#approvalComment'),// 折让审批弹窗中的备注信息
            uSalesman: com.focusPage('#uSalesman'),
            uInstorer: com.focusPage('#uInstorer'),
            uGuider: com.focusPage('#uGuider'),

            activityInfo: com.focusPage("#activityInfo"),

            peliveryTime: com.focusPage("#peliveryTime"),
        },
        btns: {
            saveBtn: com.focusPage("#saveBtn"),// 确认按钮
            fullPaymentSaveBtn: com.focusPage("#fullPaymentSaveBtn"),// 折让提交按钮
            fullPaymentCancelBtn: com.focusPage("#fullPaymentCancelBtn"),// 折让取消按钮
            fullPaymentBtn: com.focusPage('#fullPaymentBtn'), // 补款交款按钮
            fullPaymentRefundBtn: com.focusPage('#fullPaymentRefundBtn'),// 补款退款按钮
            fullCancelBtn: com.focusPage('#fullCancelBtn'), // 补款撤销按钮
            depositPaymentBtn: com.focusPage('#depositPaymentBtn'), // 定金交款按钮
            depositCancelBtn: com.focusPage('#depositCancelBtn'), // 定金撤销按钮
            depositRefundBtn: com.focusPage('#depositRefundBtn'), // 定金退款按钮
            repositPaymentBtn: com.focusPage('#repositPaymentBtn'),// 不退
            couponBtn: com.focusPage('#couponBtn'), // 劵信息修改按钮
            couponCommitBtn: com.focusPage('#couponCommitBtn'), // 劵信息提交按钮
            couponCancelBtn: com.focusPage('#couponCancelBtn'),// 劵信息取消按钮
            couponRefundBtn: com.focusPage('#couponRefundBtn'), // 劵信息退券按钮
            malingBtn: com.focusPage('#malingBtn'), // 抹零修改按钮
            malingCommitBtn: com.focusPage('#malingCommitBtn'), // 抹零提交按钮
            malingCancelBtn: com.focusPage('#malingCancelBtn'), // 抹零取消按钮
            ascriptionBtn: com.focusPage('#ascriptionBtn'),
            depositPrintBtn: com.focusPage('#depositPrintBtn'),
            repositBtns: com.focusPage('#repositBtns'),// 不退保存

            submitSalesActivityBtn: com.focusPage("#submitSalesActivityBtn"), // 保存修改活动
            peliveryBtn: com.focusPage("#peliveryBtn").click(pelivery),

        },
        drawingModal: com.focusPage('#drawingModal').on("show.bs.modal", function(a) {

            com.clearValidator();
        }),
        type: {
            depositPayment: 2, // 定金交款
            repositPayment: 8, // 不退交款
            fullPayment: 3, // 补款交款
            depositPaymentRefund: 7, // 定金退款
            fullPaymentRefund: 5, // 补款退款
        },
        sales: {},
        statues: {},
        balanceStatuses: {},
        sales: {},
        depositpayStatus: {},
        fullpayStatus: {},
        ctypes: {},
        projectStatus: {},
        typeness: {},

        postData: "salesPostData",
        pageType: params['urlLoadParams'].type,

        ascriptionBySid: null,
        name: {},
    };

    if (sales.pageType == "activity") {
        com.switchPage("views/sales/salesActivity.html");
        return false;
    }

    var pageConfig = drawNode.getConfig(params['urlLoadParams'].type);
    com.initTypeahead('uSalesman', api.personel.queryUserByPinyin, "pinyinName", {
        "user.status": 0,
        "departmentType.name": ""
    }, 'autoFillKeyValue', 'key', 'value', null);
    com.initTypeahead('uInstorer', api.personel.queryUserByPinyin, "pinyinName", {
        "user.status": 0,
        "departmentType.name": ""
    }, 'autoFillKeyValue', 'key', 'value', null);
    com.initTypeahead('uGuider', api.personel.queryUserByPinyin, "pinyinName", {
        "user.status": 0,
        "departmentType.name": ""
    }, 'autoFillKeyValue', 'key', 'value', null);
    com.initTypeahead('uSupplier', api.personel.querySupplierByPinyin, "supplier.pinYin", {
        "user.status": 0
    }, "suppliers", "userId", "userName", null);

    com.datetime(com.focusPage("#peliveryTime"));

    // 活动名
    com.post(api.information.queryActivityForValid, {
        "activity.type": 3
    }, function(res) {

        $.each(res.activitys, function(i, v) {

            sales.name[v.aid] = v.name;
        });
    }, null, false);

    sales.modals.salesActivitysModal = com.focusPage("#salesActivitysModal").on('show.bs.modal', function(e) {

        com.clearValidator();
    });

    sales.postData = sales.pageType == "sales" ? sales.postData : ("salesFor" + pageConfig.postDataName);

    sales.btns.repositBtns.bindClick(repositBtnsData);

    function ascriptionSales(v) {

        sales.ascriptionBySid = v.sid;
        com.updateTypeahead("uSalesman", v.salesman.userId, v.salesman.currentName + "-" + v.salesman.dept.name);
        com.updateTypeahead("uInstorer", v.instorer.userId, v.instorer.currentName + "-" + v.instorer.dept.name);
        com.updateTypeahead("uGuider", v.guider.userId, v.guider.currentName + "-" + v.guider.dept.name);
        com.updateTypeahead("uSupplier", v.supplier.userId, v.supplier.currentName);
        sales.modals.ascription.modal("show");
    }

    function finishSales(v) {

        com.showConfirm('确定要将单号为 ' + v.no + ' 的销售单更新为完结状态吗?', function() {

            com.post(api.sales.finishSales, {
                "sales.sid": v.sid
            }, function() {

                com.showAlert(com.info, "更新成功");
                salesSearcher.doSearch();
            });
        });
    }

    function inventorySales(v) {

        params.sales.sales = v;
        com.popup4page("#layerPopUp", "/views/sales/sales4inventory.html", "详情")
    }

    function addSales(v) {

        params.sales.sales = v;
        com.popup4page("#layerPopUp", "views/sales/sales2add.html", "添项", '', function() {

            salesSearcher.doSearch();
        })
    }

    function salesItem(v) {

        params.sales.sales = v;
        params.sales.dompany = sales.pageType;
        params.sales.type = sales.pageType;

        com.popup4page("#layerPopUp", "views/sales/salesItem.html", "项目", '', function() {

            salesSearcher.doSearch();
        })
    }

    function supplementSales(v) {

        params.sales.sales = v;
        params.sales.dompany = sales.pageType;

        com.popup4page("#layerPopUp", "views/sales/sales2supple.html", "补单", "", function() {

            salesSearcher.doSearch();
        });
    }

    function collectSales(v) {

        params.sales.sales = v;
        params.sales.type = "sales";

        com.popup4page("#layerPopUp", "views/sales/sales4payment.html", "收款");
    }

    function unpaySales(v) {

        com.post(api.sales.unpaySales, {
            "sales.sid": v.sid
        }, function() {

            com.showAlert(com.info, "更新成功");
            salesSearcher.doSearch();
        });
    }

    function balanceSales(v) {

        params.sales.sales = v;
        com.popup4page("#layerPopUp", "/views/sales/sales4balance.html", "厂结", '', function() {

            salesSearcher.doSearch();
        })
    }

    function decorationSales(v) {

        com.focusPage("text").css("line-height", "27px");
        com.post(api.decoration.queryDecorationByOrderId, {
            "decorationOrderId": v.orderId
        }, function(res) {

            var decorationInfo = res.decoration;
            com.focusPage("#orderId").html(decorationInfo.orderId);
            com.focusPage("#address").html(decorationInfo.house.village.name + '' + decorationInfo.house.houseNumber);
            com.focusPage("#designer").html(decorationInfo.designer.currentName == null ? "无" : decorationInfo.designer.currentName);
            com.focusPage("#escorter").html(decorationInfo.escorter.currentName == null ? "无" : decorationInfo.escorter.currentName);
            com.focusPage("#supervisor").html(decorationInfo.supervisor.currentName == null ? "无" : decorationInfo.supervisor.currentName);
            com.focusPage("#typeness").html(constant.decoration().decoration.typeness.keys[decorationInfo.typeness]);
            com.focusPage("#projectStatus").html(constant.decoration().decoration.projectStatus.keys[decorationInfo.projectStatus]);

            sales.modals.decorationInfo.modal("show");
        });
    }

    function moneySales(v) {

        sales.sales = v;

        if (v.fullpayStatus == constant.sales().sales.FULLPAYSTATUS_APPROVAL_INT) {
            com.showAlert(com.warning, "款项正在审批中,无法进行操作");
            return false;
        }

        sales.items.layerAdd.attr("data-sid", v.sid);
        sales.items.total.val(v.total);
        sales.items.depositPayment.val();
        sales.items.realDepositPayment.val();
        sales.items.fullPayment.val();
        sales.items.realFullPayment.val();
        sales.items.maling.val(v.maling + v.venderMaling);
        sales.items.coupon.val(v.coupon);
        sales.items.couponInf.val(v.couponInfo.substring(1, v.couponInfo.length - 1));

        com.post(api.ds.sales, {}, function(res) {

            sales.items.couponType.bindData(res.materialCouponTypes, 'key', 'value', false);
        }, null, false);

        com.popup4model('#layerAdd', '款项', function() {

            initLabel(v.depositpayStatus, v.fullpayStatus, v.total, v.depositpay, v.fullpay, '');
            sales.items.couponValue.val(0);
            sales.items.malingValue.val(0);
        }, function() {

            reductionLabel();
            salesSearcher.doSearch();
        }, function() {

            reductionLabel();
        });
    }

    function refundSales(v) {

        params.sales.sales = v;
        params.flag = "sales"

        com.popup4page("#layerPopUp", "views/sales/salesRefundsItem.html", "退货");
    }

    function actSales(v) {

        params.sales.sales = v;
        params.sales.type = sales.pageType;

        com.popup4page("#layerPopUp", "views/sales/sales4activity.html", "活动", '', function() {

            salesSearcher.doSearch();
        });
    }

    function activitySales(v) {

        activityName(v.activityId);
        sales.sales = v;

        com.post(api.information.queryActivityForValid, {
            "activity.type": 3
        }, function(res) {

            var activitys = res.activitys;
            var _activitys = [];

            for ( var i = 0; i < activitys.length; i++) {

                var _activity = activitys[i];
                _activitys.push({
                    aid: _activity.aid,
                    activityName: _activity.name,
                    money: _activitys.money
                });
            }
            sales.items.activityInfo.bindData(_activitys, "aid", "activityName", "money", false);
        });

        sales.modals.salesActivitysModal.modal("show");
    }

    function deliveSales(v) {

        com.showConfirm('确认销售单(' + v.no + ')进行配送?', function() {

            com.post(api.sales.deliveSalesDeliveryItem, {
                "salesDeliveryItem.sales.sid": v.sid
            }, function() {

                com.showAlert(com.info, "操作成功");
                salesSearcher.doSearch();
            });
        });
    }

    function peliverySales(v) {

        sales.sales = v;
        sales.modals.peliveryModal.modal("show");
    }

    function printSales(v) {

        printPayment(v.orderId, v.sid, v, "fullPay", "sales");
    }

    function sendSales(v) {

        com.post(api.sales.sendSales, {
            "sales.sid": v.sid
        }, function() {

            com.showAlert(com.info, "推送成功");
        });
    }

    function terminalSales(v) {

        com.showConfirm('确认销售单(' + v.no + ')为废单?', function() {

            com.post(api.sales.terminalSales, {
                "sales.sid": v.sid
            }, function() {

                com.showAlert(com.info, "操作成功");
                salesSearcher.doSearch();
            });
        });
    }

    function pictureSales(v) {

        managedrawing(v);
        initUploadBtn(v);
    }

    function satisfactionSales(v) {

        params.sales.orderId = v.orderId;
        params.sales.sid = v.sid;
        params.sales.type = v.type;
        com.popup4page("#layerPopUp", "views/sales/salesProfile4detail.html", "满意度")
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
                prop: "salesman.dept.name",
                clazz: "grey",
                click: function($this, v) {

                    tools.department.info($this, v.dept.did);
                }
            },
            region: {
                field: "region",
                name: "分区",
                prop: function(v) {

                    return (v.salesman.dept && v.salesman.dept.fatherDept) ? v.salesman.dept.fatherDept.name : "";
                },
                clazz: "grey",
                click: function($this, v) {

                    tools.department.info($this, v.region.did);
                }
            },
            creater: {
                field: "creater",
                name: "创建人",
                prop: "creater.currentName",
                clazz: "grey",
                click: function($this, v) {

                    tools.personel.info($this, v.creater.userId);
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
            affirmTime: {
                field: "affirmTime",
                name: "确认时间",
                prop: "affirmTime",
                clazz: "green"
            },
            isAffirm: {
                field: "isAffirm",
                name: "确认状态",
                prop: function(v) {

                    return constant.sales().sales.isAffirm.keys[v.isAffirm];
                },
                clazz: "red"
            },
            status: {
                field: "status",
                name: "状态",
                prop: function(v) {

                    return constant.sales().sales.status.keys[v.status];
                },
                clazz: "red"
            },
            finisher: {
                field: "finisher",
                name: "完结人",
                prop: "finisher.currentName",
                clazz: "red",
                click: function($this, v) {

                    tools.personel.info($this, v.finisher.userId);
                }
            },
            finishTime: {
                field: "finishTime",
                name: "完结时间",
                prop: "finishTime",
                clazz: "green"
            },
            balanceStatus: {
                field: "balanceStatus",
                name: "结算状态",
                prop: function(v) {

                    return constant.sales().sales.balanceStatus.keys[v.balanceStatus];
                },
                clazz: "red"
            },
            depositpayStatus: {
                field: "depositpayStatus",
                name: "定金状态",
                prop: function(v) {

                    return constant.sales().sales.depositpayStatus.keys[v.depositpayStatus];
                },
                clazz: "red"
            },
            fullpayStatus: {
                field: "fullpayStatus",
                name: "补款状态",
                prop: function(v) {

                    return constant.sales().sales.fullpayStatus.keys[v.fullpayStatus];
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
            amount: {
                field: "amount",
                name: "当前总额",
                prop: "amount",
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
            },
            salesType: {
                field: "salesType",
                name: "类型",
                prop: function(v) {

                    return constant.sales().sales.type.keys[v.type];
                },
                clazz: "red"
            }
        };

        var props = [];

        $.each(pageConfig.propertyArr, function(i, key) {

            propertyMap[key] && props.push(propertyMap[key]);
        });

        return props;
    })();

    var linebtns = (function() {

        var buttonMap = {
            decoration: {
                name: "装修单",
                clazz: "btn-purple",
                handle: decorationSales
            },
            ascription: {
                name: "归属",
                clazz: "btn-inverse",
                handle: ascriptionSales
            },
            inventory: {
                name: "仓储",
                clazz: "btn-blue",
                handle: inventorySales
            },
            sub: {
                name: "项目",
                clazz: "btn-success",
                handle: salesItem
            },
            collect: {
                name: "收款",
                clazz: "btn-inverse",
                show: function(v) {

                    return v.type != constant.sales().sales.TYPE_SUB_INT;
                },
                handle: collectSales
            },
            add: {
                name: "添项",
                clazz: "btn-yellow",
                show: function(v) {

                    return v.fullpayStatus == constant.sales().sales.FULLPAYSTATUS_INIT_SHORT;
                },
                handle: addSales
            },
            supplement: {
                name: "补单",
                clazz: "btn-primary",
                show: function(v) {

                    return v.fullpayStatus != constant.sales().sales.FULLPAYSTATUS_INIT_SHORT;
                },
                handle: supplementSales
            },
            refund: {
                name: "退货",
                clazz: "btn-danger",
                handle: refundSales
            },
            send: {
                name: "推送",
                clazz: "btn-danger",
                handle: sendSales
            },
            terminal: {
                name: "废单",
                clazz: "btn-danger",
                show: function(v) {

                    return v.status != constant.sales().sales.STATUS_WAST_INT;
                },
                handle: terminalSales
            },
            print: {
                name: "打印",
                clazz: "btn-pink",
                show: function(v) {

                    return v.status != constant.sales().sales.STATUS_WAST_INT;
                },
                handle: printSales
            },
            act: {
                name: "活动",
                clazz: "btn-grey",
                show: function(v) {

                    return v.status != constant.sales().sales.STATUS_WAST_INT;
                },
                handle: actSales
            },
            activity: {
                name: "活动归属",
                clazz: "btn-warning",
                show: function(v) {

                    return [0, 5].indexOf(v.status) != -1;
                },
                handle: activitySales
            },
            money: {
                name: "款项",
                clazz: "btn-warning",
                show: function(v) {

                    return v.status != constant.sales().sales.STATUS_WAST_INT && v.type != constant.sales().sales.TYPE_SUB_INT;
                },
                handle: moneySales
            },
            finish: {
                name: "完结",
                clazz: "btn-inverse",
                show: function(v) {

                    return v.status != constant.sales().sales.STATUS_WAST_INT;
                },
                handle: finishSales
            },
            saledelivery: {
                name: "配送",
                clazz: "btn-primary",
                show: function(v) {

                    return [0, 5].indexOf(v.status) != -1 && [1, 2].indexOf(v.fullpayStatus) != constant.sales().sales.FULLPAYSTATUS_INIT_SHORT;
                },
                handle: deliveSales
            },
            prodelivery: {
                name: "预配送",
                clazz: "btn-primary",
                handle: peliverySales
            },
            unpay: {
                name: "结算",
                clazz: "btn-primary",
                show: function(v) {

                    return v.type == constant.sales().sales.TYPE_SUB_INT;
                },
                handle: unpaySales
            },
            balance: {
                name: "厂结",
                clazz: "btn-info",
                show: function(v) {

                    return v.status != constant.sales().sales.STATUS_WAST_INT && v.type != constant.sales().sales.TYPE_SUB_INT;
                },
                handle: balanceSales
            },
            picture: {
                name: "图片",
                clazz: "btn-search",
                handle: pictureSales
            },
            satisfaction: {
                name: "满意度",
                clazz: "btn-purple",
                handle: satisfactionSales
            }
        };

        var btns = {};

        $.each(pageConfig.pageBtn, function(i, key) {

            buttonMap[key] && (btns[key] = buttonMap[key]);
        });

        return btns;
    })();

    var salesSearcher = new Searcher();

    salesSearcher.base("condList", "pagenation", "resultList", pageConfig.apiPage);
    salesSearcher.condition(pageConfig.condArr);
    salesSearcher.history(sales.postData);
    salesSearcher.line("no", lineprops, linebtns).render();

    // 提交归属
    sales.btns.ascriptionBtn.on('click', function() {

        if (com.validate('ascription', 'bottom'))
            return false;
        var options = {
            'sales.sid': sales.ascriptionBySid,
            "sales.salesman.userId": com.typeahead("uSalesman"),
            "sales.instorer.userId": com.typeahead("uInstorer"),
            "sales.guider.userId": com.typeahead("uGuider"),
            "sales.supplier.userId": com.typeahead("uSupplier")
        };

        com.post(api.sales.updateSalesForBelong, options, function(res) {

            com.showAlert(com.info, "修改归属成功");
            sales.modals.ascription.modal("hide");
            salesSearcher.doSearch();
        });

    });

    // 确定
    sales.btns.saveBtn.on('click', function() {

        reductionLabel();
        com.closePopup();
        salesSearcher.doSearch();
    });

    // 提交
    sales.btns.fullPaymentSaveBtn.unbind().click(function() {

        var _approval = com.focusPage('#approver', "#miniPopUp");
        var radios = _approval.find('input:checked').attr('userid');

        if (com.validate('miniPopUp', 'right')) {
            return false;
        }

        if (radios == null || radios == "") {
            com.showAlert(com.warning, "请选择审批人");
            return false;
        }

        var _options = {};

        _options['approval.receiver.userId'] = radios;
        _options['approval.comment'] = com.focusPage('#approvalComment', "#miniPopUp").val();
        _options['approvalSalesDiscount.sid'] = sales.sales.sid;
        _options['approvalSalesDiscount.referMoney'] = Math.abs(sales.items.fullPaymentTotal.val());
        _options['approvalSalesDiscount.paymentType'] = sales.items.fullPaymentTotal.val() >= 0 ? sales.type.fullPayment : sales.type.fullPaymentRefund;

        com.post(api.approval.submitApprovalForSalesDiscount, _options, function(res) {

            clearApproval();
            com.closePopup();
            com.showAlert(com.warning, "补款申请已提交");
            sales.items.approver.empty();
        });
    });

    // 取消
    sales.btns.fullPaymentCancelBtn.on('click', function() {

        com.clearValidator();
        clearApproval();
        com.closePopup(com.focusPage("#fullPaymentCancelBtn", "#miniPopUp"));
        sales.items.approver.empty();
    });

    function clearApproval() {

        com.focusPage('#approvalComment', "#miniPopUp").val("");
        com.cleanTypeahead("approver");
        salesSearcher.doSearch();
    }

    // 定金
    sales.btns.depositPaymentBtn.on('click', function() {

        if (com.validate('layerAdd', 'right'))
            return false;

        if (sales.items.depositPayment.val() <= 0) {
            com.showAlert(com.error, "定金输入不正确");
            return false;
        }

        var opt = {
            "salesPayment.sales.sid": sales.sales.sid,
            "salesPayment.sales.ctype": 2,
            "salesPayment.sales.cvalue": 0,
            "salesPayment.referMoney": sales.items.depositPayment.val(),
            "salesPayment.type": sales.type.depositPayment
        };

        com.post(api.payment.addSalesPaymentForDeposit, opt, function(res) {

            initLabel(0, -1, sales.sales.total, sales.items.depositPayment.val(), '', '');
        });

        return false;
    });

    // 定金撤销
    sales.btns.depositCancelBtn.on('click', function() {

        var opt = {
            "salesPayment.sales.sid": sales.sales.sid,
            "salesPayment.type": sales.type.depositPayment
        };

        com.post(api.payment.cancelSalesPaymentForDeposit, opt, function() {

            initLabel(-1, -1, sales.sales.total, '', '', '');
        });

        return false;
    });

    // 定金退款
    sales.btns.depositRefundBtn.on('click', function() {

        com.post(api.payment.refundSalesPaymentForDeposit, {
            "salesPayment.sales.sid": sales.sales.sid
        }, function() {

            initLabel('', '', sales.sales.total, '', '', 4);
        });

        return false;
    });

    // 定金打印
    sales.btns.depositPrintBtn.on('click', function() {

        var printSales = null;
        com.closePopup(com.focusPage("#layerAdd"));

        com.post(api.sales.querySalesBySid, {
            "sales.sid": sales.sales.sid
        }, function(res) {

            printSales = res.sales
        }, null, false);

        if (printSales.depositpayStatus == constant.sales().sales.DESPOSITPAYSTATUS_UNPAY_SHORT)
            printPayment(printSales.orderId, printSales.sid, printSales, "deposit", "sales");
        if (printSales.depositpayStatus == constant.sales().sales.DESPOSITPAYSTATUS_CONFIRM_SHORT)
            printPayment(printSales.orderId, printSales.sid, printSales, "deposit", "refund");

        return false;
    });

    // 不退
    sales.btns.repositPaymentBtn.on('click', function() {

        if (com.validate('layerAdd', 'right'))
            return false;

        if (sales.items.depositPayment.val() <= 0) {
            com.showAlert(com.error, "定金输入不正确");
            return false;
        }

        com.closePopup();

        brandBalance(sales.sales.brand.bid);
        sales.modals.repositPaymentModal.modal('show');

        return false;
    });

    // 补款
    sales.btns.fullPaymentBtn.on('click', function() {

        // 判断otherStatus状态
        com.post(api.sales.querySalesBySid, {
            'sales.sid': sales.sales.sid
        }, function(res) {

            if (res.sales.otherStatus == constant.sales().sales.OTHERSTATUS_FILLING_INT) {

                com.popup4mini("#miniPopUp", "#layerSubmit", "补款审批", "", function() {

                    com.closePopup(com.focusPage("#fullPaymentCancelBtn", "#miniPopUp"));
                    com.clearValidator();
                    clearApproval();
                    sales.items.approver.empty();
                }, function() {

                    approvalUtils.initqueryApprovalUser('approver', 12);
                });
            } else {
                var opt = {
                    "salesPayment.sales.sid": sales.sales.sid,
                    "salesPayment.referMoney": sales.items.fullPayment.val(),
                    "salesPayment.type": sales.type.fullPayment
                };
                com.post(api.payment.addSalesPaymentForFullpay, opt, function(data) {

                    initLabel(res.sales.depositpayStatus, 0, sales.sales.total, sales.sales.depositpay, sales.sales.fullpay, '');
                });
            }
        });
        return false;
    });

    // 补款撤销
    sales.btns.fullCancelBtn.on('click', function() {

        calcFullpayment(sales.sales.total);
        var flag = sales.items.fullPayment.val() >= 0;
        var opts = {
            "salesPayment.sales.sid": sales.sales.sid,
            "salesPayment.type": flag ? sales.type.fullPayment : sales.type.fullPaymentRefund
        };

        var printSales = null;
        com.post(api.sales.querySalesBySid, {
            "sales.sid": sales.sales.sid
        }, function(res) {

            printSales = res.sales
        }, null, false);

        com.post(api.payment.cancelSalesPaymentForFullpay, opts, function() {

            initLabel(printSales.depositpayStatus, -1, sales.sales.total, sales.sales.depositpay, sales.sales.fullpay, '');
        });

        return false;
    });

    // 补款退款
    sales.btns.fullPaymentRefundBtn.on('click', function() {

        com.post(api.sales.querySalesBySid, {
            'sales.sid': sales.sales.sid
        }, function(res) {

            if (res.sales.otherStatus == constant.sales().sales.OTHERSTATUS_FILLING_INT) {

                com.popup4mini("#miniPopUp", "#layerSubmit", "补款退款审批", "", function() {

                    com.closePopup(com.focusPage("#fullPaymentCancelBtn", "#miniPopUp"));
                    com.clearValidator();
                    clearApproval();
                    sales.items.approver.empty();
                }, function() {

                    approvalUtils.initqueryApprovalUser('approver', 12);
                });

            } else {

                var opt = {
                    "salesPayment.sales.sid": sales.sales.sid,
                    "salesPayment.referMoney": sales.items.fullPayment.val(),
                    "salesPayment.type": sales.type.fullPaymentRefund
                };

                com.post(api.payment.addSalesPaymentForFullpay, opt, function(res) {

                    initLabel(sales.sales.depositpayStatus, 0, sales.sales.total, sales.sales.depositpay, sales.sales.fullpay, '');
                });
            }
        });
        return false;
    });

    // 券修改
    sales.btns.couponBtn.on('click', function() {

        sales.items.couponInfoDiv.css('display', 'inline');
        sales.btns.couponBtn.addClass('hide');
        sales.btns.couponCommitBtn.removeClass('hide');
        sales.btns.couponCancelBtn.removeClass('hide');
        return false;
    });

    // 券提交
    sales.btns.couponCommitBtn.on('click', function() {

        var moneyAllOne = utils.accAdd(utils.accAdd(utils.accAdd(parseFloat(checkVal(sales.items.couponValue.val())), parseFloat(checkVal(sales.items.malingValue.val()))), parseFloat(checkVal(sales.items.realDepositPayment.val()))), parseFloat(checkVal(sales.items.maling.val())));

        if (moneyAllOne > sales.sales.total) {
            sales.btns.fullPaymentRefundBtn.removeClass('hide');
            sales.btns.fullPaymentBtn.addClass('hide');
        }
        if (moneyAllOne <= sales.sales.total) {
            sales.btns.fullPaymentBtn.removeClass('hide');
            sales.btns.fullPaymentRefundBtn.addClass('hide');
        }
        if (com.validate('layerAdd', 'right'))
            return false;

        var couponPostData = {
            "sales.sid": sales.sales.sid,
            "sales.coupon": sales.items.couponValue.val(),
            "sales.couponInfo": "#" + sales.items.couponType.val() + ":" + sales.items.couponValue.val() + "#"
        };

        com.post(api.sales.updateSalesForCoupon, couponPostData, function() {

            sales.items.couponInf.val(sales.items.couponType.val() + ":" + sales.items.couponValue.val());
            sales.items.coupon.val(sales.items.couponValue.val());
            sales.items.couponValue.val(0);
            sales.items.couponInfoDiv.css('display', 'none');
            sales.btns.couponBtn.removeClass('hide');
            calcFullpayment(sales.sales.total);

        });
        return false;
    });

    // 券取消
    sales.btns.couponCancelBtn.on('click', function() {

        sales.items.couponInfoDiv.css('display', 'none');
        sales.btns.couponBtn.removeClass('hide');
        sales.items.couponValue.val(0);
        return false;
    });

    // 抹零修改
    sales.btns.malingBtn.on('click', function() {

        sales.items.malingInfoDiv.css('display', 'inline');
        sales.btns.malingBtn.addClass('hide');
        sales.btns.malingCommitBtn.removeClass('hide');
        sales.btns.malingCancelBtn.removeClass('hide');
        return false;
    });

    // 抹零提交
    sales.btns.malingCommitBtn.on('click', function() {

        var moneyAllTwo = utils.accAdd(utils.accAdd(utils.accAdd(parseFloat(checkVal(sales.items.couponValue.val())), parseFloat(checkVal(sales.items.malingValue.val()))), parseFloat(checkVal(sales.items.realDepositPayment.val()))), parseFloat(checkVal(sales.items.coupon.val())));

        if (moneyAllTwo > sales.sales.total) {
            sales.btns.fullPaymentRefundBtn.removeClass('hide');
            sales.btns.fullPaymentBtn.addClass('hide');
        }
        if (moneyAllTwo <= sales.sales.total) {
            sales.btns.fullPaymentBtn.removeClass('hide');
            sales.btns.fullPaymentRefundBtn.addClass('hide');
        }

        if (com.validate('layerAdd', 'right'))
            return false;

        var malingPostData = {
            "sales.sid": sales.sales.sid,
            "sales.maling": 0,
            "sales.venderMaling": sales.items.malingValue.val()
        };

        com.post(api.sales.updateSalesForMaling, malingPostData, function() {

            sales.items.maling.val(sales.items.malingValue.val());
            sales.items.malingInfoDiv.css('display', 'none');
            sales.items.malingValue.val(0);
            sales.btns.malingBtn.removeClass('hide');
            calcFullpayment(sales.sales.total);
        });
        return false;
    });

    // 抹零取消
    sales.btns.malingCancelBtn.on('click', function() {

        sales.items.malingInfoDiv.css('display', 'none');
        sales.btns.malingBtn.removeClass('hide');
        sales.items.malingValue.val(0);
        return false;
    });

    // 保存活动
    sales.btns.submitSalesActivityBtn.on('click', function() {

        if (com.validate("salesActivitysModal", "")) {
            return false;
        }

        var sid = sales.sales.sid;
        var aid = sales.items.activityInfo.find("option:selected").val();

        var options = {
            "sales.sid": sid,
            "sales.activityId": aid
        };

        com.post(api.sales.updateSalesForActivity, options, function(res) {

            com.showAlert(com.info, "修改成功");
            activityName(res.sales.activityId);
        });

        sales.modals.salesActivitysModal.modal("hide");

    });

    com.focusPage("#salesActivitysModal").on('hide.bs.modal', function() {

        com.clearValidator();
    });

    function activityName(aid) {

        salesSearcher.doSearch();
        com.focusPage("#activitys_").val(sales.name[aid]);
    }

    // 还原标签样式
    function reductionLabel() {

        sales.btns.fullPaymentBtn.addClass('hide');// 补款交款按钮
        sales.btns.fullPaymentRefundBtn.addClass('hide');// 补款退款按钮
        sales.btns.fullCancelBtn.addClass('hide');// 补款撤销按钮
        sales.btns.depositPaymentBtn.addClass('hide');// 定金交款按钮
        sales.btns.depositCancelBtn.addClass('hide');// 定金撤销按钮
        sales.btns.depositPrintBtn.addClass('hide');// 定金打印按钮
        sales.btns.depositRefundBtn.addClass('hide');// 定金退款按钮
        sales.btns.repositPaymentBtn.addClass('hide');// 不退
        sales.btns.couponBtn.addClass('hide');// 劵信息修改按钮
        sales.btns.couponCommitBtn.addClass('hide');// 劵信息提交按钮
        sales.btns.couponCancelBtn.addClass('hide');// 劵信息取消按钮
        sales.btns.couponRefundBtn.addClass('hide');// 劵信息退券按钮
        sales.btns.malingBtn.addClass('hide');// 抹零修改按钮
        sales.btns.malingCommitBtn.addClass('hide');// 抹零提交按钮
        sales.btns.malingCancelBtn.addClass('hide');// 抹零取消按钮

        sales.items.depositPayment.attr("readonly", "readonly");
        sales.items.fullPayment.attr("readonly", "readonly");

        sales.items.malingInfoDiv.css('display', 'none');
        sales.items.couponInfoDiv.css('display', 'none');

        sales.items.fullPaymentInfo.html('');
        sales.items.depositPaymentInfo.html('');
    }

    // 初始化标签样式
    function initLabel(depositpayStatus, fullpayStatus, total, depositpay, fullpay, status) {

        reductionLabel();

        if (status == 4) {

            sales.items.realDepositPayment.val(0);
            sales.items.depositPayment.val(0);
            calcFullpayment(total);

            return false;
        }

        if (depositpayStatus == constant.sales().sales.DESPOSITPAYSTATUS_INIT_SHORT && fullpayStatus == constant.sales().sales.FULLPAYSTATUS_INIT_SHORT) { // 未交定金和补款

            sales.btns.couponBtn.removeClass('hide');// 劵信息修改按钮
            sales.btns.malingBtn.removeClass('hide');// 抹零修改按钮
            sales.btns.depositPaymentBtn.removeClass('hide');// 定金交款按钮
            sales.btns.repositPaymentBtn.removeClass('hide');// 不退
            sales.btns.fullPaymentBtn.removeClass('hide');// 补款交款按钮

            sales.items.depositPayment.removeAttr("readonly");// 款项中的定金输入框
            sales.items.depositPayment.val(0);
            sales.items.realDepositPayment.val('');
            sales.items.realFullPayment.val('');
            sales.items.depositPaymentInfo.html("");

            calcFullpayment(total);
        }

        if (depositpayStatus == constant.sales().sales.DESPOSITPAYSTATUS_INIT_SHORT && fullpayStatus == constant.sales().sales.FULLPAYSTATUS_UNPAY_SHORT) {

            sales.btns.fullCancelBtn.removeClass('hide');

            sales.items.fullPaymentInfo.html("提交中");
            sales.items.depositPayment.val('');
            sales.items.realDepositPayment.val('');

            calcFullpayment(total);

            sales.items.realFullPayment.val(sales.items.fullPayment.val());
        }

        if (depositpayStatus == constant.sales().sales.DESPOSITPAYSTATUS_UNPAY_SHORT && fullpayStatus == constant.sales().sales.FULLPAYSTATUS_INIT_SHORT) {

            sales.items.depositPayment.val(depositpay);
            sales.items.realDepositPayment.val(depositpay);
            sales.items.depositPaymentInfo.html("提交中");

            calcFullpayment(total);

            sales.btns.depositCancelBtn.removeClass('hide');
            sales.btns.couponBtn.removeClass('hide');
            sales.btns.malingBtn.removeClass('hide');
        }

        if (depositpayStatus == constant.sales().sales.DESPOSITPAYSTATUS_PAYED_SHORT && fullpayStatus == constant.sales().sales.FULLPAYSTATUS_INIT_SHORT) {

            sales.btns.depositRefundBtn.removeClass('hide');
            sales.btns.fullPaymentBtn.removeClass('hide');
            sales.btns.couponBtn.removeClass('hide');
            sales.btns.malingBtn.removeClass('hide');

            sales.items.depositPaymentInfo.html("已收款");
            sales.items.realFullPayment.val('');
            sales.items.depositPayment.val(depositpay);
            sales.items.realDepositPayment.val(depositpay);

            calcFullpayment(total);
        }

        if (depositpayStatus == constant.sales().sales.DESPOSITPAYSTATUS_CONFIRM_SHORT && fullpayStatus == constant.sales().sales.FULLPAYSTATUS_INIT_SHORT) {

            sales.btns.couponBtn.removeClass('hide');
            sales.btns.malingBtn.removeClass('hide');
            sales.btns.depositRefundBtn.removeClass('hide');
            sales.btns.fullPaymentBtn.removeClass('hide');

            sales.items.depositPaymentInfo.html("已确认");
            sales.items.realFullPayment.val('');
            sales.items.depositPayment.val(depositpay);
            sales.items.realDepositPayment.val(depositpay);

            calcFullpayment(total);
        }

        if (fullpayStatus == constant.sales().sales.FULLPAYSTATUS_INIT_SHORT && depositpayStatus == constant.sales().sales.DESPOSITPAYSTATUS_PAYED_SHORT) {

            sales.btns.fullCancelBtn.addClass('hide');
            sales.btns.fullPaymentBtn.removeClass('hide');
            sales.btns.couponBtn.removeClass('hide');
            sales.btns.malingBtn.removeClass('hide');
            sales.btns.depositRefundBtn.removeClass('hide');

            sales.items.couponInfoDiv.css('display', 'none');
            sales.items.malingInfoDiv.css('display', 'none');
            sales.items.depositPayment.val(depositpay);
            sales.items.realDepositPayment.val(depositpay);
            sales.items.realFullPayment.val('');
            sales.items.fullPaymentInfo.html("");

            calcFullpayment(total);
        }

        if (fullpayStatus == constant.sales().sales.FULLPAYSTATUS_UNPAY_SHORT && depositpayStatus == constant.sales().sales.DESPOSITPAYSTATUS_PAYED_SHORT) {

            sales.items.depositPayment.val(depositpay);
            sales.items.realDepositPayment.val(depositpay);

            calcFullpayment(total);

            sales.items.realFullPayment.val(sales.items.fullPayment.val());

            sales.btns.depositRefundBtn.addClass('hide');
            sales.btns.fullPaymentBtn.addClass('hide');
            sales.btns.couponBtn.addClass('hide');
            sales.btns.malingBtn.addClass('hide');

            sales.btns.fullCancelBtn.removeClass('hide');

            sales.items.depositPaymentInfo.html("已收款");
            sales.items.fullPaymentInfo.html("提交中");
        }

        if (fullpayStatus == constant.sales().sales.FULLPAYSTATUS_UNPAY_SHORT && depositpayStatus == constant.sales().sales.DESPOSITPAYSTATUS_CONFIRM_SHORT) {

            sales.items.depositPayment.val(depositpay);
            sales.items.realDepositPayment.val(depositpay);

            calcFullpayment(total);

            sales.items.realFullPayment.val(sales.items.fullPayment.val());

            sales.btns.depositRefundBtn.addClass('hide');
            sales.btns.fullPaymentBtn.addClass('hide');
            sales.btns.couponBtn.addClass('hide');
            sales.btns.malingBtn.addClass('hide');
            sales.btns.fullCancelBtn.removeClass('hide');

            sales.items.depositPaymentInfo.html("已确认");
            sales.items.fullPaymentInfo.html("提交中");
        }

        if (fullpayStatus == constant.sales().sales.FULLPAYSTATUS_PAYED_SHORT && depositpayStatus == constant.sales().sales.DESPOSITPAYSTATUS_INIT_SHORT) {

            sales.items.realDepositPayment.val('');
            sales.items.depositPayment.val('');

            calcFullpayment(total);

            sales.items.realFullPayment.val(sales.items.fullPayment.val());
            sales.items.fullPaymentInfo.html("已收款");
        }

        if (fullpayStatus == constant.sales().sales.FULLPAYSTATUS_PAYED_SHORT && depositpayStatus == constant.sales().sales.DESPOSITPAYSTATUS_PAYED_SHORT) {

            sales.items.realDepositPayment.val(depositpay);
            sales.items.depositPayment.val(depositpay);

            calcFullpayment(total);

            sales.items.realFullPayment.val(sales.items.fullPayment.val());

            sales.btns.fullPaymentBtn.addClass('hide');
            sales.btns.depositRefundBtn.addClass('hide');
            sales.btns.depositCancelBtn.addClass('hide');
            sales.btns.couponBtn.addClass('hide');
            sales.btns.malingBtn.addClass('hide');

            sales.items.depositPaymentInfo.html("已收款");
            sales.items.fullPaymentInfo.html("已收款");
        }

        if (fullpayStatus == constant.sales().sales.FULLPAYSTATUS_PAYED_SHORT && depositpayStatus == constant.sales().sales.DESPOSITPAYSTATUS_CONFIRM_SHORT) {

            sales.items.realDepositPayment.val(depositpay);
            sales.items.depositPayment.val(depositpay);

            calcFullpayment(total);

            sales.items.realFullPayment.val(sales.items.fullPayment.val());

            sales.btns.fullPaymentBtn.addClass('hide');
            sales.btns.depositRefundBtn.addClass('hide');
            sales.btns.depositCancelBtn.addClass('hide');
            sales.btns.couponBtn.addClass('hide');
            sales.btns.malingBtn.addClass('hide');

            sales.items.depositPaymentInfo.html("已确认");
            sales.items.fullPaymentInfo.html("已收款");
        }

        if (fullpayStatus == constant.sales().sales.FULLPAYSTATUS_CONFIRM_SHORT && depositpayStatus == constant.sales().sales.DESPOSITPAYSTATUS_INIT_SHORT) {

            sales.items.realDepositPayment.val('');
            sales.items.depositPayment.val('');

            calcFullpayment(total);

            sales.items.realFullPayment.val(sales.items.fullPayment.val());
            sales.items.fullPaymentInfo.html("已确认");
        }

        if (fullpayStatus == constant.sales().sales.FULLPAYSTATUS_CONFIRM_SHORT && depositpayStatus == constant.sales().sales.DESPOSITPAYSTATUS_PAYED_SHORT) {

            sales.items.realDepositPayment.val(depositpay);
            sales.items.depositPayment.val(depositpay);

            calcFullpayment(total);

            sales.items.realFullPayment.val(sales.items.fullPayment.val());

            sales.btns.fullPaymentBtn.addClass('hide');
            sales.btns.depositRefundBtn.addClass('hide');
            sales.btns.depositCancelBtn.addClass('hide');
            sales.btns.couponBtn.addClass('hide');
            sales.btns.malingBtn.addClass('hide');

            sales.items.depositPaymentInfo.html("已收款");
            sales.items.fullPaymentInfo.html("已确认");
        }

        if (fullpayStatus == constant.sales().sales.FULLPAYSTATUS_CONFIRM_SHORT && depositpayStatus == constant.sales().sales.DESPOSITPAYSTATUS_CONFIRM_SHORT) {

            sales.items.realDepositPayment.val(depositpay);
            sales.items.depositPayment.val(depositpay);

            calcFullpayment(total);

            sales.items.realFullPayment.val(sales.items.fullPayment.val());

            sales.btns.fullPaymentBtn.addClass('hide');
            sales.btns.depositRefundBtn.addClass('hide');
            sales.btns.depositCancelBtn.addClass('hide');
            sales.btns.couponBtn.addClass('hide');
            sales.btns.malingBtn.addClass('hide');

            sales.items.depositPaymentInfo.html("已确认");
            sales.items.fullPaymentInfo.html("已确认");
        }

        if (fullpayStatus == constant.sales().sales.FULLPAYSTATUS_INIT_SHORT && sales.items.fullPayment.val() < 0 && depositpayStatus != constant.sales().sales.DESPOSITPAYSTATUS_UNPAY_SHORT) {

            calcFullpayment(total);

            sales.btns.fullPaymentRefundBtn.removeClass('hide');
            sales.btns.fullPaymentBtn.addClass('hide');
        }

        if (depositpayStatus == constant.sales().sales.DESPOSITPAYSTATUS_UNPAY_SHORT || depositpayStatus == constant.sales().sales.DESPOSITPAYSTATUS_CONFIRM_SHORT) {
            sales.btns.depositPrintBtn.removeClass('hide');
        }

    }

    function calcFullpayment(total) {

        var _total = parseFloat(checkVal(total));
        var depositPaymentVal = parseFloat(checkVal(sales.items.depositPayment.val()));
        var couponVal = parseFloat(checkVal(sales.items.coupon.val()));
        var malingVal = parseFloat(checkVal(sales.items.maling.val()));
        var fullpaymentVal = utils.accSub(utils.accSub(utils.accSub(_total, depositPaymentVal), couponVal), malingVal);

        sales.items.fullPayment.val(fullpaymentVal);
        sales.items.fullPaymentTotal.val(fullpaymentVal);
    }

    function checkVal(val) {

        return val == "" || val < 0 ? 0 : val;
    }

    function printPayment(orderId, sid, v, flag, type) {

        params.sales.sales = v;
        params.sales.flag = flag;

        if (type == "sales") {
            com.popup("销售购货单: " + orderId, api.index.salesPrintIndex.url, null, null, true);
        } else if (type == "refund") {
            com.popup("销售退货单: " + orderId, api.index.salesRefundsPrintIndex.url, null, null, true);
        }

    }

    function brandBalance(bid) {

        var initList = function(listData) {

            var $tableWrap = com.focusPage('#lists').empty();
            var $ul = $('<ul></ul>').addClass('item-list ui-sortable  fl-table-list');

            if (!listData.length) {
                var $resultList = com.focusPage("#lists").addClass('dz-default dz-message').html('');
                var $zone = $('<div></div>').addClass('dropzone dz-clickable').css('margin', '20px').css('border', '0px').appendTo($resultList);
                var $mesg = $('<div></div>').addClass('dz-default dz-message').appendTo($zone);
                var $span = $('<span></span>').text('无可用数据提供').appendTo($mesg);
                return $resultList;
            } else if (listData && listData.length) {

                $.each(listData, function(i, v) {

                    var $liLine = $('<li></li>').addClass('item-orange clearfix');
                    var $h3 = $('<h3></h3>').addClass('oid');
                    var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');

                    var propertyArr = [["类型:", constant.data().brandBalance.ctype.keys[v.ctype], "red"], ["结算值:", v.cvalue, "blue"], ["说明:", v.comment, "grey"], ];

                    var $label = $('<label></label>').addClass('control-label').css({
                        'color': 'grey',
                        'font-size': '20px',
                        "font-weight": "bold"
                    });

                    var _label = $('<label></label>');

                    var $input = $('<input>').attr({
                        "type": "checkbox",
                        "name": "bids",
                        "class": "",
                        "data-ctype": v.ctype,
                        "data-cvalue": v.cvalue,
                    }).addClass('ace ace-checkbox-2');

                    var _span = $('<span></span>').addClass('lbl blue bigger-150').html(v.name);

                    _label.append($input).append(_span).appendTo($label);

                    $.each(propertyArr, function(index, value) {

                        var $liProperty = $('<li></li>');
                        $('<strong></strong>').html(value[0]).appendTo($liProperty);
                        $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                        $liProperty.appendTo($ulProperty);
                    });

                    $label.appendTo($h3);
                    $liLine.append($h3).append($ulProperty).appendTo($ul);

                });

                $ul.appendTo($tableWrap);
            }
        };
        com.post(api.data.queryBrandBalance, {
            "brandBalance.bid": bid
        }, function(res) {

            initList(res.brandBalances);
        });
    }

    function repositBtnsData() {

        var $inputs = com.focusPage('input[name="bids"]:checked', '#lists');

        var options = {
            "salesPayment.sales.sid": sales.sales.sid,
            "salesPayment.sales.ctype": $inputs.attr('data-ctype'),
            "salesPayment.sales.cvalue": $inputs.attr('data-cvalue'),
            "salesPayment.referMoney": sales.items.depositPayment.val(),
            "salesPayment.type": sales.type.repositPayment
        };

        if ($inputs.length >= 2) {
            com.showAlert(com.warning, '品牌结算数量最多一个');
            return false;
        } else if ($inputs.length == 0) {
            com.showAlert(com.warning, '请选择品牌结算');
            return false;
        }

        com.post(api.payment.addSalesPaymentForDeposit, options, function(res) {

            initLabel(0, -1, sales.sales.total, sales.items.depositPayment.val(), '', '');
        });

        reductionLabel();

        salesSearcher.doSearch();

        sales.modals.repositPaymentModal.modal('hide');

    }
    function managedrawing(v) {

        com.focusPage('#salesDrawing').html("");

        com.post(api.sales.querySalesPicture, {
            "salesPicture.siid": v.sid
        }, function(data) {

            var salesPictures = data.salesPictures;
            if (salesPictures && salesPictures.length) {
                $.each(salesPictures, function(i, value) {

                    if (value.status == constant.sales().salesPicture.STATUS_YES_SHORT) {
                        appendGalleryElement("salesDrawing", value);
                    }

                });
                com.popup4photos(com.focusPage("#salesDrawing"));
            }
        }, null, false);

        sales.drawingModal.modal("show");
    }
    function appendGalleryElement(galleryId, value) {

        var gallery = com.focusPage("#" + galleryId);
        var imgLi = $("<li></li>").attr("id", "gallery_li" + value.spid).addClass("text-center col-sm-4").css("border", "0px").css("border-color", "white").css("padding", "0px").css("height", "150px").css("width", "150px").appendTo(gallery);
        var img = $('<img/>');
        var $imgA = $('<a></a>').attr('data-rel', 'colorbox').addClass('cboxElement').attr('href', com.showImg(img, value.path, 200, 200, '200x200')).attr('target', '_blank').append(img).appendTo(imgLi);
        var imgA = $("<a></a>").addClass('cboxElement').attr("target", "_blank").css("height", "150px").append(img).appendTo(imgLi);
        com.showImg(img, value.path, 150, 150, value.name, null, 0);
        var toolsDiv = $("<div></div>").addClass("tools tools-bottom").appendTo(imgLi);
        var toolsA = $("<a></a>").attr("href", "#").on("click", function() {

            com.post(api.sales.deleteSalesPicture, {
                "salesPicture.spid": value.spid
            }, function(res) {

                com.focusPage("#gallery_li" + value.spid).remove();
            });
        }).appendTo(toolsDiv);
        $("<i></i>").addClass("icon-remove red").appendTo(toolsA);

    }
    function initUploadBtn(v) {

        com.uploadify("#salesUpload", "上传图片", api.common.uploadImg, 'btn btn-success', '*.jpg;*.jpeg;*.gif;*.png', {
            'uploadType': 0
        }, 5, function(data) {

            var options = {};
            options["salesPicture.sid"] = v.sid;
            options["salesPicture.siid"] = v.sid;
            options["salesPicture.name"] = data.strutsUploadsFileName;
            options["salesPicture.path"] = data.resUrl;
            options["salesPicture.type"] = 1;
            options["salesPicture.filesize"] = data.filesize;
            com.post(api.sales.addSalesPicture, options, function(res) {

                var salesPicture = res.salesPicture;

                appendGalleryElement("salesDrawing", salesPicture);

                com.popup4photos("#salesDrawing");

            });

            salesSearcher.doSearch();
        });
    }

    function pelivery() {

        if (com.validate("peliveryModal")) {
            return false;
        }

        com.post(api.sales.deliveSalesDelivery, {
            "salesDelivery.sales.sid": sales.sales.sid,
            "salesDelivery.peliveryTime": sales.items.peliveryTime.val() + " 00:00:00",
        }, function() {

            com.showAlert(com.info, "操作成功");

            salesSearcher.doSearch();

            sales.modals.peliveryModal.modal("hide");
        });
    }
});
