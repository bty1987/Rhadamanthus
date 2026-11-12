$(function() {

    var accessories = {
        status: {},
        type: {},
        cnid: {},
        schedule: {},
        pageType: params.urlLoadParams.type,
        aid: null, // 分配厂商/结算弹窗当前操作单
        modals: {
            bindAccessoriesModal: com.focusPage("#bindAccessoriesModal"),
            balanceAccessoriesModal: com.focusPage("#balanceAccessoriesModal"),
        },
        items: {
            supplier: com.focusPage("#supplier", "#bindAccessoriesModal"),
            balanceInput: com.focusPage("#balanceInput", "#balanceAccessoriesModal"),
        },
    };
    accessories.type = constant.inventory().accessories.type.keys;
    accessories.status = constant.inventory().accessories.status.keys;
    accessories.cnid = constant.data().construction.node.keys;
    var conditions = ['inventory-accessories-orderId', 'inventory-accessories-no', 'inventory-accessories-createrName', 'inventory-accessories-approverName', 'inventory-accessories-createTime', 'inventory-accessories-approverTime', 'inventory-accessories-stauts', 'inventory-accessories-type', 'inventory-accessories-assignFlag'];

    // 厂商视角固定看自己的单(登录人=厂商), 授权按公司 pageBtn 自行开放(拍板②)
    var url = api.inventory.pageAccessories;
    if (accessories.pageType == "supplier") {
        url = api.inventory.pageAccessoriesForSupplier;
    }

    var lineprops = [{
        fieId: "no",
        name: "辅料单号",
        prop: "no",
        clazz: "blue"
    }, {
        fieId: "orderId",
        name: "装修单号",
        prop: "orderId",
        clazz: "blue"
    }, {
        field: "creater",
        name: "创建人",
        prop: "creater.currentName",
        clazz: "grey"
    }, {
        field: "createTime",
        name: "创建时间",
        prop: "createTime",
        clazz: "green"
    }, {
        field: "approverTime",
        name: "审批人",
        prop: "approver.userName",
        clazz: "grey"
    }, {
        field: "approverTime",
        name: "审批时间",
        prop: "approverTime",
        clazz: "green"
    }, {
        field: "total",
        name: "总价",
        prop: "total",
        clazz: "blue"
    }, {
        field: "supplier",
        name: "厂商",
        prop: "supplier.userName",
        clazz: "grey"
    }, {
        field: "deliveryStatus",
        name: "配送",
        prop: function (v) {
            return v.deliveryStatus == 1 ? "配送" : "自配";
        },
        clazz: "grey"
    }, {
        field: "charge",
        name: "费用额",
        prop: "charge",
        clazz: "blue"
    }, {
        field: "balance",
        name: "结算额",
        prop: "balance",
        clazz: "blue"
    }, {
        field: "cnid",
        name: "施工环节",
        prop: "cnid",
        clazz: "red",
        dataset: constant.data().construction.node.keys,
    }, {
        field: "status",
        name: "状态",
        // 配送单按配送流程显示: 需配送(0/1)→已发货(2)→已配送(9,字典), 其余走状态字典; 自配单全走字典
        prop: function (v) {
            if (v.deliveryStatus == 1) {
                if (v.status == 0 || v.status == 1) return "需配送";
                if (v.status == 2) return "已发货";
            }
            return accessories.status[v.status];
        },
        clazz: "red",
    }, {
        field: "type",
        name: "类型",
        prop: "type",
        clazz: "red",
        dataset: constant.inventory().accessories.type.keys,
    }, {
        field: "comment",
        name: "备注",
        prop: "comment",
        clazz: "grey"
    }];


    var searcher = new Searcher();
    searcher.base("condList", "pagenation", "resultList", url);
    searcher.condition(conditions);
    searcher.history("accessoriesPostData");
    var linebtns = [{
        name: "查看",
        clazz: "btn-info",
        handle: function (v) {
            if (v.status == constant.inventory().accessories.STATUS_INIT_INT) {
                com.showAlert(com.warning, "辅料单状态不可操作");
                return false;
            }
            params.manifest.aid = v.aid;

            com.popup4page('#layerPopUp', "views/manifest/accessories4view.html", "辅料单 : " + v.no);
            return false;
        },
        show: function (v) {
            return (v.status == constant.inventory().accessories.STATUS_RETURN_INT || v.status == constant.inventory().accessories.STATUS_DELIVER_INT || v.status == constant.inventory().accessories.STATUS_DELIVERED_INT || (accessories.pageType == "advance" && v.status == constant.inventory().accessories.STATUS_BATCHOUT_INT))
        }
    }, {
        name: "预出",
        clazz: "btn-info",
        handle: function (v) {
            if (v.status != 0) {
                com.showAlert(com.warning, "辅料单状态不可操作");
                return false;
            }

            com.showConfirm("是否确认预出辅料单", function() {

                com.post(api.inventory.preoutAccessories, {
                    "accessories.aid": v.aid
                }, function() {

                    com.showAlert(com.info, "操作成功");
                    searcher.doSearch();
                });
            });
            return false;
        },
        show: function (v) {
            return (accessories.pageType == "advance" && v.status == constant.inventory().accessories.STATUS_INIT_INT)
        }
    }, {
        name: "出货",
        clazz: "btn-yellow",
        handle: function (v) {
            if (v.status != constant.inventory().accessories.STATUS_INIT_INT && v.status != constant.inventory().accessories.STATUS_ADVANCE_INT) {
                com.showAlert(com.warning, "辅料单状态不可操作");
                return false;
            }

            params.manifest.aid = v.aid;
            params.manifest.orderId = v.orderId;

            com.popup4page('#layerPopUp', "views/manifest/accessories2out.html", "辅料单 : " + v.no);
            return false;
        },
        show: function (v) {
            return (accessories.pageType != "advance" && (v.status == constant.inventory().accessories.STATUS_INIT_INT || v.status == constant.inventory().accessories.STATUS_ADVANCE_INT))
        }
    }, {
        name: "修改",
        clazz: "btn-danger",
        handle: function (v) {
            if (v.status != constant.inventory().accessories.STATUS_INIT_INT) {
                com.showAlert(com.warning, "辅料单状态不可操作");
                return false;
            }

            params.manifest.aid = v.aid;
            params.manifest.type = v.type;
            params.manifest.orderId = v.orderId;

            com.popup4page('#layerPopUp', "views/manifest/accessories2edit.html", "辅料单 : " + v.no);
            return false;
        },
        show: function (v) {
            return (v.status != constant.inventory().accessories.STATUS_DELIVER_INT && v.status != constant.inventory().accessories.STATUS_DELIVERED_INT)
        }
    }, {
        name: "拒绝",
        clazz: "btn-success",
        handle: function (v) {
            if (v.status != 0) {
                com.showAlert(com.warning, "辅料单状态不可操作");
                return false;
            }

            com.showConfirm("是否确认拒绝辅料单", function() {

                com.post(api.inventory.refuseAccessories, {
                    "accessories.aid": v.aid
                }, function() {

                    com.showAlert(com.info, "操作成功");
                    searcher.doSearch();
                });
            });
            return false;
        },
        show: function (v) {
            return (v.status == constant.inventory().accessories.STATUS_INIT_INT)
        }
    }, {
        name: "退货",
        clazz: "btn-pink",
        handle: function (v) {
            params.manifest.aid = v.aid;
            params.manifest.accessories = v;

            com.popup4page('#layerPopUp', "views/manifest/accessories4refund.html", "辅料单 : " + v.no);
            return false;
        },
        show: function (v) {
            return (v.status == constant.inventory().accessories.STATUS_DELIVER_INT || v.status == constant.inventory().accessories.STATUS_DELIVERED_INT || (accessories.pageType != "advance" && v.status == constant.inventory().accessories.STATUS_DELIVER_INT))
        }
    }, {
        name: "打印",
        clazz: "btn-warning",
        handle: function (v) {
            params.manifest.accessories = v;
            printAccessoriesItem(v.aid, v.no);
            return false;
        },
        show: function (v) {
            return (v.status == constant.inventory().accessories.STATUS_ADVANCE_INT || v.status == constant.inventory().accessories.STATUS_BATCHOUT_INT || v.status == constant.inventory().accessories.STATUS_DELIVER_INT || v.status == constant.inventory().accessories.STATUS_DELIVERED_INT)
        }
    }, {
        // 配送单=确认配送(置9已配送), 自配单=到货确认(置6); 服务端deliveAccessories按deliveryStatus分支
        name: function (v) {
            return v.deliveryStatus == 1 ? "确认配送" : "到货";
        },
        clazz: "btn-pink",
        handle: function (v) {
            if (v.status != constant.inventory().accessories.STATUS_BATCHOUT_INT) {
                com.showAlert(com.warning, "辅料单状态不可操作");
                return false;
            }
            com.showConfirm(v.deliveryStatus == 1 ? "确认配送?" : "确认到货?", function() {

                com.post(api.inventory.deliveAccessories, {
                    "accessories.aid": v.aid
                }, function() {

                    com.showAlert(com.info, "操作成功");
                    searcher.doSearch();
                });
            });
            return false;
        },
        show: function (v) {
            return (accessories.pageType != "advance" && v.status == constant.inventory().accessories.STATUS_BATCHOUT_INT)
        }
    }, {
        // 需分配标记(按钮): 标记后开放分配厂商功能, 配送单标记未分配不可出库(后端闸); 已标记点击取消
        name: "需分配",
        clazz: "btn-success",
        handle: function (v) {

            com.post(api.inventory.updateAccessoriesForAssign, {
                "accessories.aid": v.aid,
                // 按钮式切换: 按当前标记取反(searcher普通按钮handle第二参为$(this)恒truthy, 不可用作状态)
                "accessories.assignFlag": v.assignFlag == 1 ? 0 : 1
            }, function() {

                com.showAlert(com.info, "操作成功");
                searcher.doSearch();
            });
            return false;
        },
        init: function (v) {
            return v.assignFlag == 1;
        },
        show: function (v) {
            // 已分配(2)不显示开关: 开关只管0/1互切, 对已分配行切换会 regress 分配态
            return (accessories.pageType != "supplier" && v.status != constant.inventory().accessories.STATUS_BALANCED_INT && v.assignFlag != 2)
        }
    }, {
        name: "分配厂商",
        clazz: "btn-info",
        handle: function (v) {
            if (v.status != 0 && v.status != 1 && v.status != 2) {
                com.showAlert(com.warning, "辅料单状态不可操作");
                return false;
            }
            accessories.aid = v.aid;
            accessories.modals.bindAccessoriesModal.modal("show");
            return false;
        },
        show: function (v) {
            // 分配闸: 标记需分配(1)或已分配(2,改派)的单开放; 后端260093兜底
            return (accessories.pageType != "supplier" && (v.assignFlag == 1 || v.assignFlag == 2) && (v.status == 0 || v.status == 1 || v.status == 2))
        }
    }, {
        // 配送/自配切换: 按钮名显示目标态; 出库后不可改(后端260024同口径守卫)
        name: function (v) {
            return v.deliveryStatus == 1 ? "改自配" : "改配送";
        },
        clazz: "btn-warning",
        handle: function (v) {

            com.post(api.inventory.updateAccessoriesForDelivery, {
                "accessories.aid": v.aid,
                "accessories.deliveryStatus": v.deliveryStatus == 1 ? 0 : 1
            }, function() {

                com.showAlert(com.info, "操作成功");
                searcher.doSearch();
            });
            return false;
        },
        show: function (v) {
            return (accessories.pageType != "supplier" && (v.status == 0 || v.status == 1))
        }
    }, {
        name: "结算",
        clazz: "btn-success",
        handle: function (v) {
            if (v.status != constant.inventory().accessories.STATUS_DELIVER_INT && v.status != constant.inventory().accessories.STATUS_DELIVERED_INT) {
                com.showAlert(com.warning, "辅料单状态不可操作");
                return false;
            }
            accessories.aid = v.aid;

            // 结算额公式预览: Σ(辅材结算价×数量), 服务端计算为准
            com.post(api.inventory.queryAccessoriesBalance, {
                "accessories.aid": accessories.aid
            }, function(res) {

                accessories.items.balanceInput.val(res.accessories.balance || 0);
                accessories.modals.balanceAccessoriesModal.modal("show");
            });
            return false;
        },
        show: function (v) {
            return (accessories.pageType != "supplier" && (v.status == constant.inventory().accessories.STATUS_DELIVER_INT || v.status == constant.inventory().accessories.STATUS_DELIVERED_INT))
        }
    }, {
        // 费用明细查看(只读): 整单费用行按项展示, 到货/结算后亦可查(照外辅费用查看形态)
        name: "费用",
        clazz: "btn-info",
        handle: function (v) {

            openChargeViewModal(v.aid);
            return false;
        },
        show: function (v) {
            return true;
        }
    }, {
        name: "审核",
        clazz: "btn-primary",
        handle: function (v) {
            com.showConfirm("是否确认审核辅料单", function() {

                com.post(api.inventory.auditAccessories, {
                    "accessories.aid": v.aid
                }, function() {

                    com.showAlert(com.info, "操作成功");
                    searcher.doSearch();
                });
            });
            return false;
        },
        show: function (v) {
            return (v.status == constant.inventory().accessories.STATUS_ADVANCE_INT && v.type == constant.inventory().accessories.TYPE_POST_INT)
        }
    }, {
        name: "出库-金蝶",
        clazz: "btn-inverse",
        handle: function (v) {
            kingdeeUtils.accessories(v.aid, 7, "SalesOutStock");
            return false;
        }
    }, {
        name: "入库-金蝶",
        clazz: "btn-purple",
        handle: function (v) {
            kingdeeUtils.accessories(v.aid, 8, "SalesReturnStock");
            return false;
        }
    }];
    searcher.line("no", lineprops, linebtns).render();

    // 厂商选人(照外辅 occcessories.js 同款)
    com.initTypeahead('supplier', api.personel.querySupplierByPinyin, "supplier.pinYin", {
        "user.status": 0
    }, "suppliers", "uid", "userName", null);

    // 分配厂商提交
    com.focusPage("#saveBindAccessoriesBtn").click(function() {

        com.post(api.inventory.bindAccessories, {
            "accessories.aid": accessories.aid,
            "accessories.supplier.uid": com.typeahead(accessories.items.supplier)
        }, function() {

            com.showAlert(com.info, "操作成功");
            accessories.modals.bindAccessoriesModal.modal("hide");
            searcher.doSearch();
        });
    });

    // 结算提交(金额元直传, api tranargs ×1000 折厘)
    com.focusPage("#saveBalanceAccessoriesBtn").click(function() {

        if (com.validate('balanceAccessoriesModal', 'right')) {
            return false;
        }

        com.post(api.inventory.balanceAccessories, {
            "accessories.aid": accessories.aid,
            "accessories.balance": accessories.items.balanceInput.val() || 0
        }, function() {

            com.showAlert(com.info, "操作成功");
            accessories.modals.balanceAccessoriesModal.modal("hide");
            searcher.doSearch();
        });
    });

    accessories.modals.bindAccessoriesModal.on("hide.bs.modal", function(e) {
        accessories.items.supplier.val('');
    });

    accessories.modals.balanceAccessoriesModal.on("hide.bs.modal", function(e) {
        com.clearValidator();
        accessories.items.balanceInput.val('');
    });

    // 打印货单项
    function printAccessoriesItem(aid, no) {

        com.popup4frame("辅料单号" + no, api.index.accessoriesPrintIndex.url, function() {

            parent.layer.getFrameIndex(window.name);
            searcher.doSearch();
        }, null, function(layero) {

            com.post(api.inventory.updateAccessoriesForPrint, {
                "accessories.aid": aid
            }, function(res) {

                layero.find("iframe").contents().find("#printNum").text("打印次数:" + res.accessories.printnum)
            }, null, false)
        });
    }

    // 费用明细查看弹窗(只读): 整单拉取按项展示, 小计=(单价+浮动)×数量与resolveItemCharge服务端口径一致
    function openChargeViewModal(aid) {

        com.focusPage('#accessoriesChargeViewBody').html('');
        com.focusPage('#accessoriesChargeTotalAmount').text('0.000');
        com.focusPage('#accessoriesChargeTotalRow').show();

        com.post(api.inventory.queryAccessoriesCharge, {
            "accessoriesCharge.accessories.aid": aid
        }, function(res) {

            if (res && res.accessoriesCharges && res.accessoriesCharges.length > 0) {

                var totalAmount = 0;

                $.each(res.accessoriesCharges, function(i, charge) {

                    // tranargs已将price/surplus折元, num为原值
                    var price = charge.price || 0;
                    var surplus = charge.surplus || 0;
                    var num = charge.num || 0;
                    var subtotal = utils.accAdd(price, surplus) * num;

                    totalAmount += subtotal;

                    var goodsName = charge.accessoriesItem && charge.accessoriesItem.goods ? (charge.accessoriesItem.goods.no + ' ' + charge.accessoriesItem.goods.name) : '未关联辅材项';

                    var $row = $('<tr></tr>');
                    $row.append($('<td></td>').text(goodsName));
                    $row.append($('<td></td>').text(charge.name));
                    $row.append($('<td></td>').text(price.toFixed(3)));
                    $row.append($('<td></td>').text(surplus.toFixed(3)));
                    $row.append($('<td></td>').text(num));
                    $row.append($('<td></td>').addClass('red').text(subtotal.toFixed(3)));

                    com.focusPage('#accessoriesChargeViewBody').append($row);
                });

                com.focusPage('#accessoriesChargeTotalAmount').text(totalAmount.toFixed(3));
            } else {
                var $emptyRow = $('<tr></tr>');
                $emptyRow.append($('<td></td>').attr('colspan', 6).addClass('text-center').text('暂无费用数据'));
                com.focusPage('#accessoriesChargeViewBody').append($emptyRow);
                com.focusPage('#accessoriesChargeTotalRow').hide();
            }

            com.focusPage('#accessoriesChargeViewModal').modal('show');
        });
    }
});
