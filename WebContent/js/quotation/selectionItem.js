$(function() {

    var selectionItem = {

        modals: {
            updateSelectionItemModal: com.focusPage('#updateSelectionItemModal'),
            refundSelectionItemModal: com.focusPage('#refundSelectionItemModal'),
            addedSelectionItemModal: com.focusPage('#addedSelectionItemModal'),
            balanceSelectionItemModal: com.focusPage('#balanceSelectionItemModal'),
            pictureModal: com.focusPage('#pictureModal'),
            supplierSelectionItemModal: com.focusPage('#supplierSelectionItemModal')
        },
        btns: {
            updateBtn: com.focusPage('#updateBtn'),
            refundBtn: com.focusPage('#refundBtn'),
            addedBtn: com.focusPage('#addedBtn'),
            balanceSalesBtn: com.focusPage('#balanceSalesBtn'),
            supplierBtn: com.focusPage('#supplierBtn'),
        },
        items: {
            num: com.focusPage("#num"),
            comment: com.focusPage('#comment'),
            refnum: com.focusPage('#refnum'),
            added: com.focusPage('#added'),
            utilitynum: com.focusPage('#utilitynum'),
            balanceSales: com.focusPage('#balanceSales'),

            picture: com.focusPage('#picture', '#pictureModal'),
            supplierSelect: com.focusPage('#supplierSelect'),
            supplierBrand: com.focusPage('#supplierBrand')
        },
        title: com.focusPage("#myModalLabel"),
        dcomment: com.focusPage("#dcomment"),
        parameters: {
            siid: 0,
            sid: 0,
            status: 0,
            num: 0,
            bid: 0
        },
        typeList: [],
        statusList: [],
        accountStatusList: [],
        postData: '',

        pageType: params.urlLoadParams.type,

        selectList: [],

        status: {},

        pageConfig: null

    };

    if (selectionItem.pageType == "supplier") {
        selectionItem.postData = "selectionItemForSupplierPostData";
    } else if (selectionItem.pageType == "escorter") {
        selectionItem.escorter = true;

        selectionItem.postData = "selectionItemForEscorterPostData";
    } else if (selectionItem.pageType == "expert") {

        selectionItem.status["selectionItem.status"] = null;
        selectionItem.postData = "selectionItemForExpertPostData";
    } else if (selectionItem.pageType == "init") {

        selectionItem.status["selectionItem.status"] = null;
        selectionItem.postData = "selectionItemForInitPostData";
    } else if (selectionItem.pageType == "tran") {

        selectionItem.status["selectionItem.status"] = constant.quotation().selectionItem.STATUS_TRAN_INT;
        selectionItem.postData = "selectionItemForTranPostData";
    } else if (selectionItem.pageType == "check") {

        selectionItem.status["selectionItem.status"] = constant.quotation().selectionItem.STATUS_CHECK_INT;
        selectionItem.postData = "selectionItemForCheckPostData";
    } else if (selectionItem.pageType == "confirm") {

        selectionItem.status["selectionItem.status"] = constant.quotation().selectionItem.STATUS_CONFIRM_INT;
        selectionItem.postData = "selectionItemForConfirmPostData";
    } else if (selectionItem.pageType == "finish") {

        selectionItem.status["selectionItem.status"] = constant.quotation().selectionItem.STATUS_FINISH_INT;
        selectionItem.postData = "selectionItemForFinishPostData";
    } else if (selectionItem.pageType == "review") {

        selectionItem.status["selectionItem.status"] = constant.quotation().selectionItem.STATUS_REVIEW_INT;
        selectionItem.postData = "selectionItemForReviewPostData";
    } else if (selectionItem.pageType == "balance") {

        selectionItem.status["selectionItem.status"] = constant.quotation().selectionItem.STATUS_BALANCE_INT
        selectionItem.postData = "selectionItemForBalancePostData";
    } else if (selectionItem.pageType == "material") {

        selectionItem.status["selectionItem.status"] = null;
        selectionItem.postData = "selectionItemForMaterialPostData";
    } else if (selectionItem.pageType == "account") {

        selectionItem.status["selectionItem.status"] = null;
        selectionItem.postData = "selectionItemForAccountPostData";
    }

    selectionItem.statusList = constant.quotation().selectionItem.status.keys;
    selectionItem.typeList = constant.quotation().selectionItem.type.keys;
    selectionItem.accountStatusList = constant.quotation().selectionItem.accountStatus.keys;

    com.initTypeahead(selectionItem.items.balanceSales, api.balance.queryBalanceSelection, "balanceSelection.name", {}, "balanceSelections", "bsid", "name");

    selectionItem.modals.updateSelectionItemModal.on("hide.bs.modal", function() {

        com.clearValidator();
        com.cleanItems(selectionItem.items);
    });

    selectionItem.modals.refundSelectionItemModal.on("hide.bs.modal", function() {

        com.clearValidator();
        com.cleanItems(selectionItem.items);
    });

    selectionItem.modals.addedSelectionItemModal.on("hide.bs.modal", function() {

        com.clearValidator();
        com.cleanItems(selectionItem.items);
    });

    selectionItem.modals.balanceSelectionItemModal.on("hide.bs.modal", function() {

        com.clearValidator();
        com.cleanItems(selectionItem.items);
    });

    selectionItem.modals.supplierSelectionItemModal.on("hide.bs.modal", function() {

        com.clearValidator();
        selectionItem.items.supplierSelect.empty();
        selectionItem.items.supplierBrand.text("");
    });

    selectionItem.btns.updateBtn.bindClick(updateData);
    selectionItem.btns.refundBtn.bindClick(refundSelectionItem);
    selectionItem.btns.addedBtn.bindClick(addedSelectionItem);
    selectionItem.btns.balanceSalesBtn.bindClick(balanceSalesData);
    selectionItem.btns.supplierBtn.bindClick(updateSupplier);

    selectionItem.pageConfig = getConfig(params['urlLoadParams'].type, 8);

    var lineprops = (function() {

        return [{
            type: "checkbox",
            field: "siid",
            name: "selectionItem",
            prop: "siid",
            clazz: "ace ace-checkbox-2",
            attrs: function(v) {
                return {
                    'id': v.siid,
                    'data-status': v.status,
                    'data-num': v.num,
                    'data-refnum': v.refnum,
                    'data-postprice': v.postprice,
                    'data-brand': v.goods.bid,
                    'data-accountStatus': v.accountStatus
                };
            },
            checked: function(v) {
                return selectionItem.selectList.contains(String(v.siid));
            },
            click: function($input, v) {
                var siid = $input.attr("id");

                if (selectionItem.selectList.length > 30) {
                    com.showAlert(com.warning, "选材项已达数量上限");
                    return false;
                }

                var checked = $input.prop("checked");

                if (checked)
                    !selectionItem.selectList.contains(siid) && selectionItem.selectList.push(siid);
                else
                    selectionItem.selectList.contains(siid) && selectionItem.selectList.splice(selectionItem.selectList.indexOf(siid), 1);
            }
        }, {
            type: "custom",
            render: function($liLine, v, $ulProperty, $h3) {

                var propertyArr = getPropertyArr(v);
                var propertyArrDecoration = getPropertyArrDecoration(v);

                $.each(propertyArr, function(index, value) {

                    var $liProperty = $('<li></li>');
                    if (typeof value[0] == "string") {
                        $('<strong></strong>').html(value[0]).appendTo($liProperty);
                    } else {
                        $(value[0]).appendTo($liProperty);
                    }
                    $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);

                    if (value[3])
                        $(value[3]).appendTo($liProperty);

                    $liProperty.appendTo($ulProperty);
                });

                var $_ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix').appendTo($liLine);

                $.each(propertyArrDecoration, function(index, value) {

                    var $liProperty = $('<li></li>').appendTo($_ulProperty);
                    if (typeof value[0] == "string") {
                        $('<strong></strong>').html(value[0]).appendTo($liProperty);
                    } else {
                        $(value[0]).appendTo($liProperty);
                    }
                    $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                });
            }
        }];
    })();

    var linebtns = (function() {

        var pageBtn = selectionItem.pageConfig.pageBtn;
        var btns = {};

        var showBtn = function(v, $btn) { return true; };

        if (pageBtn.contains("compile")) {
            btns.compile = {
                name: "编辑",
                clazz: "btn-yellow",
                show: function(v) {
                    return (v.status == constant.quotation().selectionItem.STATUS_INIT_INT && v.decoration.paySacle >= 65) || v.status == constant.quotation().selectionItem.STATUS_TRAN_INT || selectionItem.pageType == "expert";
                },
                handle: function(v) {
                    selectionItem.parameters.siid = v.siid;
                    selectionItem.title.text("编辑");
                    selectionItem.dcomment.show();
                    selectionItem.items.comment.val(v.comment);
                    selectionItem.modals.updateSelectionItemModal.modal("show");
                }
            };
        }

        if (pageBtn.contains("refnumBtn")) {
            btns.refnum = {
                name: "退货",
                clazz: "btn-yellow",
                show: function(v) {
                    return [constant.quotation().selectionItem.STATUS_REVIEW_INT, constant.quotation().selectionItem.STATUS_BALANCE_INT, constant.quotation().selectionItem.STATUS_DISABLE_SHORT].indexOf(v.status) == -1;
                },
                handle: function(v) {
                    selectionItem.parameters.status = v.status;
                    selectionItem.parameters.siid = v.siid;
                    selectionItem.parameters.num = v.num;
                    selectionItem.modals.refundSelectionItemModal.modal('show');
                }
            };
        }

        if (pageBtn.contains("rran")) {
            btns.rran = {
                name: "配送",
                clazz: "btn-purple",
                show: function(v) {
                    return (v.status == constant.quotation().selectionItem.STATUS_INIT_INT && v.decoration.paySacle >= 65) || selectionItem.pageType == "expert";
                },
                handle: function(v) {
                    com.post(api.quotation.tranSelectionItem, {
                        "selectionItems[0].siid": v.siid
                    }, function(res) {
                        searcher.doSearch();
                        com.showAlert(com.info, "操作成功");
                    });
                }
            };
        }

        if (pageBtn.contains("check")) {
            btns.check = {
                name: "审核",
                clazz: "btn-purple",
                show: function(v) {
                    return v.status == constant.quotation().selectionItem.STATUS_TRAN_INT;
                },
                handle: function(v) {
                    var option = {
                        "selectionItems[0].siid": v.siid,
                        "selectionItems[0].checker": null,
                    };

                    if (selectionItem.escorter) {
                        option["selectionItem.checker.uid"] = v.decoration.materialer.uid;
                    }

                    com.post(api.quotation.checkSelectionItem, option, function(e) {
                        searcher.doSearch();
                        com.showAlert(com.info, "操作成功");
                    });
                }
            };
        }

        if (pageBtn.contains("confirm")) {
            btns.confirm = {
                name: "确认",
                clazz: "btn-purple",
                show: function(v) {
                    return v.status == constant.quotation().selectionItem.STATUS_CHECK_INT;
                },
                handle: function(v) {
                    com.post(api.quotation.confirmSelectionItem, {
                        "selectionItems[0].siid": v.siid
                    }, function(e) {
                        searcher.doSearch();
                        com.showAlert(com.info, "操作成功");
                    });
                }
            };
        }

        if (pageBtn.contains("finish")) {
            btns.finish = {
                name: "完结",
                clazz: "btn-purple",
                show: function(v) {
                    return v.status == constant.quotation().selectionItem.STATUS_CONFIRM_INT;
                },
                handle: function(v) {
                    com.post(api.quotation.finishSelectionItem, {
                        "selectionItems[0].siid": v.siid
                    }, function(e) {
                        searcher.doSearch();
                        com.showAlert(com.info, "操作成功");
                    });
                }
            };
        }

        if (pageBtn.contains("review")) {
            btns.review = {
                name: "核对",
                clazz: "btn-pink",
                show: function(v) {
                    return v.status == constant.quotation().selectionItem.STATUS_FINISH_INT;
                },
                handle: function(v) {
                    com.post(api.quotation.reviewSelectionItem, {
                        "selectionItems[0].siid": v.siid
                    }, function(e) {
                        searcher.doSearch();
                        com.showAlert(com.info, "操作成功");
                    });
                }
            };
        }

        if (pageBtn.contains("balance")) {
            btns.balance = {
                name: "申请",
                clazz: "btn-pink",
                show: function(v) {
                    return v.status == constant.quotation().selectionItem.STATUS_REVIEW_INT;
                },
                handle: function(v) {
                    com.post(api.quotation.balanceSelectionItem, {
                        "selectionItems[0].siid": v.siid
                    }, function(e) {
                        searcher.doSearch();
                        com.showAlert(com.info, "操作成功");
                    });
                }
            };
        }

        if (pageBtn.contains("reject")) {
            btns.reject = {
                name: "驳回",
                clazz: "btn-pink",
                show: function(v) {
                    return v.status == constant.quotation().selectionItem.STATUS_REVIEW_INT || v.status == constant.quotation().selectionItem.STATUS_BALANCE_INT;
                },
                handle: function(v) {
                    com.post(api.quotation.rejectSelectionItem, {
                        "selectionItem.siid": v.siid
                    }, function(e) {
                        searcher.doSearch();
                        com.showAlert(com.info, "操作成功");
                    });
                }
            };
        }

        if (pageBtn.contains("account")) {
            btns.account = {
                name: "对账",
                clazz: "btn-pink",
                handle: function(v) {
                    com.post(api.quotation.accountSelectionItem, {
                        "selectionItem.siid": v.siid
                    }, function(e) {
                        searcher.doSearch();
                        com.showAlert(com.info, "操作成功");
                    });
                }
            };
        }

        if (pageBtn.contains("select")) {
            btns.select = {
                name: "选材单",
                clazz: "btn-pink",
                handle: function(v) {
                    params.quotation.orderId = v.decoration.orderId;
                    params.historyPage = api.index.selectionItemIndex.url;
                    com.switchPage(api.index.selectionPartIndex.url);
                }
            };
        }

        if (pageBtn.contains("added")) {
            btns.added = {
                name: "补量",
                clazz: "btn-pink",
                show: function(v) {
                    return [constant.quotation().selectionItem.TYPE_ALONE_INT, constant.quotation().selectionItem.TYPE_ADDED_QUOTATION_SHORT, constant.quotation().selectionItem.TYPE_ADDED_EXTENSIONADD_INT, constant.quotation().selectionItem.TYPE_ADDED_EXTENSIONMINUS_INT, constant.quotation().selectionItem.TYPE_ADDED_ADDITEM_INT, constant.quotation().selectionItem.TYPE_ADDED_MINUSITEM_INT].indexOf(v.type) == -1;
                },
                handle: function(v) {
                    selectionItem.parameters.siid = v.siid;
                    selectionItem.parameters.num = v.num;
                    selectionItem.parameters.type = v.type;
                    selectionItem.modals.addedSelectionItemModal.modal('show');
                }
            };
        }

        if (pageBtn.contains("delete")) {
            btns.del = {
                name: "删除",
                clazz: "btn-danger",
                show: function(v) {
                    return !(v.status == constant.quotation().selectionItem.STATUS_REVIEW_INT || v.status == constant.quotation().selectionItem.STATUS_BALANCE_INT);
                },
                handle: function(v) {
                    com.post(api.quotation.deleteSelectionItem, {
                        "selection.sid": v.selection.sid,
                        "selectionItem.siid": v.siid,
                    }, function(e) {
                        searcher.doSearch();
                        com.showAlert(com.info, "操作成功");
                    });
                }
            };
        }

        if (pageBtn.contains("print")) {
            btns.print = {
                name: "打印",
                clazz: "btn-success",
                handle: function(v) {
                    com.post(api.quotation.querySelectionByOrderId, {
                        "selection.orderId": v.decoration.orderId
                    }, function(res) {
                        params.quotation.supplierPage = selectionItem.pageType == "supplier" ? true : false;
                        params.selection = res.selection;
                        com.popup("打印选材", api.index.selectionOutputIndex.url, null, null, true);
                    }, null, false);
                }
            };
        }

        if (pageBtn.contains("picture")) {
            btns.picture = {
                name: "图片",
                clazz: "btn-success",
                handle: function(v) {
                    managedrawing(v);
                    initUploadBtn(v);
                    selectionItem.modals.pictureModal.modal('show');
                }
            };
        }

        if (selectionItem.pageType == "expert") {
            btns.supplier = {
                name: "修改厂商",
                clazz: "btn-grey",
                show: function(v) {
                    return true;
                },
                handle: function(v) {
                    selectionItem.parameters.siid = v.siid;
                    selectionItem.parameters.bid = v.goods.bid;
                    selectionItem.items.supplierBrand.text(v.goods.brand);

                    com.post(api.communion.queryBrandSupplier, {
                        "brandSupplier.brand.bid": v.goods.bid
                    }, function(res) {

                        var suppliers = [];

                        $.each(res.brandSuppliers || [], function(i, brandSupplier) {
                            suppliers.push(brandSupplier.supplier);
                        });

                        selectionItem.items.supplierSelect.bindData(suppliers, "uid", "currentName");

                        if (v.supplier && v.supplier.uid != null) {
                            selectionItem.items.supplierSelect.val(v.supplier.uid);
                        }
                    });

                    selectionItem.modals.supplierSelectionItemModal.modal("show");
                }
            };
        }

        return btns;
    })();

    var buttons = (function() {

        var btns = [];

        if (selectionItem.pageConfig.pageBtn.contains("checkAll")) {
            var $checka = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('id', 'checks').css("margin", "0px 3px");
            var $checki = $('<i></i>').addClass('icon-check bigger-110').appendTo($checka);
            var $checkspan = $('<span></span>').text('全选').appendTo($checka);
            btns.push($checka);
        }

        if (selectionItem.pageConfig.pageBtn.contains("export")) {
            var $checkaExportSelects = $('<a></a>').addClass('btn btn-minier btn-info pull-left').attr('name', 'import');
            var $checkExporti = $('<i></i>').addClass('icon-download-alt bigger-110').appendTo($checkaExportSelects);
            var $checkExportspan = $('<span></span>').text('导出').appendTo($checkaExportSelects);
            $checkaExportSelects.click(function() {
                pageExportStoreImport();
            });
            btns.push($checkaExportSelects);
        }

        var createbtn = function(id, text, color) {
            var $a = $('<a></a>').addClass('btn btn-minier pull-left ' + color).attr({ 'id': id, 'style': 'margin: 0px 3px;' });
            var $i = $('<i></i>').addClass('icon-plus bigger-110').appendTo($a);
            var $span = $('<span></span>').text(text).appendTo($i);
            return $a;
        };

        if (selectionItem.pageConfig.pageBtn.contains("batchDelivery")) btns.push(createbtn("batchDelivery", "批量配送", "btn-success"));
        if (selectionItem.pageConfig.pageBtn.contains("batchBalance")) btns.push(createbtn("batchBalance", "批量申请", "btn-info"));
        if (selectionItem.pageConfig.pageBtn.contains("batchCheck")) btns.push(createbtn("batchCheck", "批量审核", "btn-warning"));
        if (selectionItem.pageConfig.pageBtn.contains("batchConfirm")) btns.push(createbtn("batchConfirm", "批量确认", "btn-inverse"));
        if (selectionItem.pageConfig.pageBtn.contains("batchFinish")) btns.push(createbtn("batchFinish", "批量完结", "btn-danger"));
        if (selectionItem.pageConfig.pageBtn.contains("batchReview")) btns.push(createbtn("batchReview", "批量核对", "btn-pink"));
        if (selectionItem.pageConfig.pageBtn.contains("batchCrn")) btns.push(createbtn("batchCrn", "对账", "btn-pink"));
        if (selectionItem.pageConfig.pageBtn.contains("batchSelc")) btns.push(createbtn("batchSelc", "厂商对账", "btn-pink"));

        return btns;
    })();

    var searcher = new Searcher();

    searcher.set("condList", "pagenation", "resultList", selectionItem.pageConfig.apiPage, selectionItem.status, selectionItem.pageConfig.condArr, selectionItem.postData, null, false, buttons);
    searcher.line("goods.name", lineprops, linebtns).render();

    function pageExportStoreImport() {

        if (com.focusPage('span[name="totalRecords"]').text() == 0) {
            com.showAlert(com.warning, "请通过条件进行查询");
            return false;
        }

        if (com.focusPage('span[name="totalRecords"]').text() > 1000) {
            com.showAlert(com.warning, "查询结果大于阀值 , 导出失败");
            return false;
        }

        com.post(selectionItem.pageConfig.apiPage, $.extend({}, params[selectionItem.postData], {
            "paging.noPage": 1
        }), function(res) {

            $.exceler({
                column: [["名称", 'goods.name'], ["品牌", 'goods.brand'], ["品类", 'goods.category'], ["商品编号", 'goods.no'], ["功能区名称", 'areaName'], ["类型", 'type'], ["状态", 'status'], ["报价项单价", 'preprice'], ["结算价", 'postprice'], ["预算金额", 'preprice'], ["预算量", 'initNum'], ["数量", 'num'], ["退货", 'refnum'], ["剩余数量", 'surplus'], ["备注", 'comment'], ["创建时间", 'createTime'], ["配送人", 'traner.currentName'], ["配送时间", 'tranTime'], ["审核人", 'checker.currentName'], ["审核时间", 'checkTime'], ["确认人", 'confirmer.currentName'], ["确认时间", 'confirmTime'], ["完结人", 'finish.currentName'], ["完结时间", 'finishTime'], ["申请人", 'balancer.currentName'], ["申请时间", 'balanceTime'], ["装修单号", 'decoration.orderId'], ["楼盘", 'decoration.house.village.name'], ["地址", 'decoration.house.houseNumber'], ["建筑面积", 'decoration.house.buildArea'], ["计价面积", 'decoration.house.innerArea'], ["设计师", 'decoration.designer.currentName'], ["业务员", 'decoration.salesman.currentName'], ["监理", 'decoration.supervisor.currentName'], ["监理电话", 'decoration.supervisor.phone'],
                    ["跟单员", 'decoration.materialer.currentName'], ],

                list: res.paging.data
            }, function(v) {

                v.num = ([2, 4].indexOf(v.type % 10) != -1 && v.num > 0) ? -v.num : v.num;
                v.status = selectionItem.statusList[v.status];
                v.type = selectionItem.typeList[v.type];
                v.surplus = utils.changeThrDecimal(utils.accSub(parseFloat(v.num), parseFloat(v.refnum)));
            });
        });
    }

    com.focusPage('#checks').click(function() {

        checkAll();
    });

    com.focusPage('#batchDelivery').click(function() {

        bulkOperation(api.quotation.tranSelectionItem, 'delivery');
    });
    com.focusPage('#batchBalance').click(function() {

        bulkOperation(api.quotation.balanceSelectionItem, 'balance');
    });
    com.focusPage('#batchCheck').click(function() {

        bulkOperation(api.quotation.checkSelectionItem, 'check');
    });
    com.focusPage('#batchConfirm').click(function() {

        bulkOperation(api.quotation.confirmSelectionItem, 'confirm');
    });
    com.focusPage('#batchFinish').click(function() {

        bulkOperation(api.quotation.finishSelectionItem, 'finish');
    });
    com.focusPage('#batchReview').click(function() {

        bulkOperation(api.quotation.reviewSelectionItem, 'review');
    });
    com.focusPage('#batchCrn').click(function() {

        if (selectionItem.selectList.length == 0) {
            com.showAlert(com.warning, "请选择选材项");
            return false;
        }

        selectionItem.modals.balanceSelectionItemModal.modal('show');
    });
    com.focusPage('#batchSelc').click(function() {

        if (selectionItem.selectList.length == 0) {
            com.showAlert(com.warning, "请选择选材项");
            return false;
        }

        var options = {};

        var postTotal = 0;
        var inputs = com.focusPage('input[name="selectionItem"]:checked', '#resultList');

        var brand = null;

        $.each(selectionItem.selectList, function(i, v) {

            var input = $(inputs[i]);
            var num = input.attr("data-num");
            var postprice = input.attr("data-postprice");
            var refnum = input.attr("data-refnum");
            var bid = input.attr("data-brand");

            var status = input.attr("data-status");
            var accountStatus = input.attr("data-accountStatus");

            if ([constant.quotation().selectionItem.STATUS_INIT_INT, constant.quotation().selectionItem.STATUS_TRAN_INT, constant.quotation().selectionItem.STATUS_CHECK_INT, constant.quotation().selectionItem.STATUS_CONFIRM_INT, constant.quotation().selectionItem.STATUS_FINISH_INT].indexOf(status) != -1)
                return true;

            if (accountStatus != 0)
                return true;

            if (brand == null)
                brand = bid;

            if (brand != bid) {

                brand = -1;

                return false;
            }

            postTotal = utils.accAdd(postTotal, utils.accMul(utils.accSub(num, refnum), postprice));

            options["balanceSelectionItems[" + i + "].selectionItem.siid"] = v;
        });

        if (brand == -1 || brand == null) {
            com.showAlert(com.warning, "选材项品牌不一致");
            return false;
        }

        options["balanceSelection.brand.bid"] = brand;
        options["balanceSelection.income"] = 0;
        options["balanceSelection.cost"] = 0;
        options["balanceSelection.payment"] = 0;
        options["balanceSelection.profit"] = 0;

        com.post(api.balance.batchBalanceSelection, options, function(res) {

            searcher.doSearch();
            com.showAlert(com.info, "操作成功");
            selectionItem.selectList = [];
        });

    });

    function bulkOperation(url, type) {

        var options = {};

        if (selectionItem.selectList.length == 0) {
            com.showAlert(com.warning, "请选择选材项");
            return false;
        }

        $.each(selectionItem.selectList, function(i, v) {

            options["selectionItems[" + i + "].siid"] = v;
        });

        com.post(url, options, function(res) {

            searcher.doSearch();
            com.showAlert(com.info, "操作成功");
            selectionItem.selectList = [];
        });
    }

    function checkAll() {

        if (com.focusPage('input[type="checkbox"]').prop('checked')) {
            com.focusPage('input[type="checkbox"]').removeAttr('checked');
            com.focusPage('input[type="checkbox"]').prop('checked', false);
        } else {

            var length = $('input[type=checkbox]').length;

            if ((selectionItem.selectList.length + length) > 30) {
                com.showAlert(com.warning, "选材项已达数量上限");
                return false;
            }

            com.focusPage('input[type="checkbox"]').attr('checked', true);
            com.focusPage('input[type="checkbox"]').prop('checked', true);
        }

        $.each(com.focusPage('input[type="checkbox"]'), function(i, e) {

            var $that = $(e);
            var siid = $that.attr("id");

            var checked = $that.prop("checked");

            if (checked)
                !selectionItem.selectList.contains(siid) && selectionItem.selectList.push(siid);
            else
                selectionItem.selectList.contains(siid) && selectionItem.selectList.splice(selectionItem.selectList.indexOf(siid), 1);
        });
    }

    function updateData() {

        if (com.validate('updateSelectionItemModal'))
            return false;

        var option = {
            "selectionItem.num": selectionItem.items.num.val(),
            "selectionItem.comment": selectionItem.items.comment.val(),
            "selectionItem.siid": selectionItem.parameters.siid,
        };

        com.post(api.quotation.updateSelectionItem, option, function(res) {

            searcher.doSearch();
            com.showAlert(com.info, "操作成功");
        });

        selectionItem.modals.updateSelectionItemModal.modal("hide");
    }

    function updateSupplier() {

        if (selectionItem.items.supplierSelect.val() == null || selectionItem.items.supplierSelect.val() == "") {
            com.showAlert(com.warning, "请选择厂商");
            return false;
        }

        var option = {
            "selectionItem.siid": selectionItem.parameters.siid,
            "selectionItem.supplier.uid": selectionItem.items.supplierSelect.val()
        };

        com.post(api.quotation.updateSelectionItemForSupplier, option, function(res) {

            searcher.doSearch();
            com.showAlert(com.info, "操作成功");
        });

        selectionItem.modals.supplierSelectionItemModal.modal("hide");
    }

    function refundSelectionItem() {

        if (com.validate('refundSelectionItemModal'))
            return false;

        if (selectionItem.items.refnum.val() == "" && selectionItem.items.utilitynum.val() == "") {
            com.showAlert(com.warning, '实用量与退货需要填写一项');
            return false;
        }

        if (selectionItem.items.refnum.val() != "" && selectionItem.items.utilitynum.val() != "") {
            com.showAlert(com.warning, '实用量与退货只可填写一项');
            return false;
        }

        if (selectionItem.items.refnum.val() > selectionItem.parameters.num) {
            com.showAlert(com.warning, '退货不能大于当前数量');
            return false;
        }

        var options = {
            "selectionItem.refnum": selectionItem.items.refnum.val() != "" ? selectionItem.items.refnum.val() : utils.changeThrDecimal(utils.accSub(selectionItem.parameters.num, selectionItem.items.utilitynum.val())),
            "selectionItem.siid": selectionItem.parameters.siid
        };

        com.post(api.quotation.refundSelectionItem, options, function(res) {

            searcher.doSearch();
            com.showAlert(com.info, "操作成功");
        });

        selectionItem.modals.refundSelectionItemModal.modal("hide");
    }

    function addedSelectionItem() {

        if (com.validate('addedSelectionItemModal'))
            return false;

        if (selectionItem.items.added.val() == "" || selectionItem.items.added.val() == 0) {
            com.showAlert(com.warning, '请输入补量');
            return false;
        }

        var type = selectionItem.parameters.type;

        if (type == constant.quotation().selectionItem.TYPE_QUOTATION_INT) {
            type = constant.quotation().selectionItem.TYPE_ADDED_QUOTATION_SHORT;
        } else if (type == constant.quotation().selectionItem.TYPE_EXTENSIONADD_INT) {
            type = constant.quotation().selectionItem.TYPE_ADDED_EXTENSIONADD_INT;
        } else if (type == constant.quotation().selectionItem.TYPE_EXTENSIONMINUS_INT) {
            type = constant.quotation().selectionItem.TYPE_ADDED_EXTENSIONMINUS_INT;
        } else if (type == constant.quotation().selectionItem.TYPE_ADDITEM_INT || type == constant.quotation().selectionItem.TYPE_ADDITEM_COM_INT) {
            type = constant.quotation().selectionItem.TYPE_ADDED_ADDITEM_INT;
        } else if (type == constant.quotation().selectionItem.TYPE_MINUSITEM_INT || type == constant.quotation().selectionItem.TYPE_MINUSITEM_NORETURN_INT) {
            type = constant.quotation().selectionItem.TYPE_ADDED_MINUSITEM_INT;
        }

        com.post(api.quotation.addedSelectionItem, {
            "selectionItem.siid": selectionItem.parameters.siid,
            "selectionItem.num": selectionItem.items.added.val(),
            "selectionItem.type": type
        }, function(res) {

            searcher.doSearch();
            com.showAlert(com.info, "操作成功");
        });

        selectionItem.modals.addedSelectionItemModal.modal("hide");
    }

    function balanceSalesData() {

        if (com.validate('balanceSelectionItemModal'))
            return false;

        var balanceSelection = null;
        var bsidCount = null;
        var options = {};
        var postTotal = 0;
        var inputs = com.focusPage('input[name="selectionItem"]:checked', '#resultList');
        var bsid = com.typeahead(selectionItem.items.balanceSales);

        com.post(api.balance.countBalanceSelectionItem, {
            "balanceSelection.bsid": bsid
        }, function(res) {

            bsidCount = res.count;
        }, null, false);

        if (bsidCount + inputs.length > 500) {
            com.showAlert(com.warning, "数据量过大");
            return false;
        }

        com.post(api.balance.queryBalanceSelectionByBsid, {
            "balanceSelection.bsid": bsid
        }, function(res) {

            balanceSelection = res.balanceSelection;

        }, null, false);

        $.each(selectionItem.selectList, function(i, v) {

            var input = $(inputs[i]);
            var num = input.attr("data-num");
            var postprice = input.attr("data-postprice");
            var refnum = input.attr("data-refnum");

            postTotal = utils.accAdd(postTotal, utils.accMul(utils.accSub(num, refnum), postprice));

            options["balanceSelectionItems[" + i + "].selectionItem.siid"] = v;
        });

        options["balanceSelection.bsid"] = bsid;
        options["balanceSelection.income"] = 0;
        options["balanceSelection.cost"] = utils.accAdd(balanceSelection.cost, postTotal);
        options["balanceSelection.payment"] = utils.accAdd(balanceSelection.payment, postTotal);
        options["balanceSelection.profit"] = 0;

        com.post(api.balance.submitBalanceSelection, options, function(res) {

            searcher.doSearch();
            com.showAlert(com.info, "操作成功");
            selectionItem.selectList = [];
            selectionItem.modals.balanceSelectionItemModal.modal("hide");
        });
    }

    function managedrawing(v) {

        selectionItem.items.picture.html("");

        com.post(api.quotation.queryQuotationPicture, {
            "quotationPicture.qid": v.siid,
            "quotationPicture.atttype": constant.quotation().quotationPicture.TYPE_SELECT_INT
        }, function(data) {

            var quotationPictures = data.quotationPictures;

            if (quotationPictures && quotationPictures.length) {

                $.each(quotationPictures, function(i, res) {

                    appendGalleryElement(res);

                });

                com.popup4photos(selectionItem.items.picture);
            }
        }, null, false);
    }

    function appendGalleryElement(v) {

        var imgLi = $("<li></li>").attr("id", "gallery_li" + v.qpid).addClass("text-center col-sm-4").css("border", "0px").css("border-color", "white").css("padding", "0px").css("height", "150px").css("width", "150px");
        var img = $('<img/>');
        var imgHref = $('<a></a>').attr('data-rel', 'colorbox').addClass('cboxElement').attr('href', com.showImg(img, v.path, 200, 200, '200x200')).attr('target', '_blank');
        var imgA = $("<a></a>").addClass('cboxElement').attr("target", "_blank").css("height", "150px");

        selectionItem.items.picture.append(imgLi);
        imgHref.append(img).appendTo(imgLi);
        imgA.append(img).appendTo(imgLi);

        com.showImg(img, v.path, 150, 150, v.name, null, 0);

        var toolsDiv = $("<div></div>").addClass("tools tools-bottom").appendTo(imgLi);
        var toolsA = $("<a></a>").attr("href", "#").appendTo(toolsDiv);
        var toolsI = $("<i></i>").addClass("icon-remove red").appendTo(toolsA);

        toolsA.click(function() {

            com.post(api.quotation.deleteQuotationPicture, {
                "quotationPicture.qpid": v.qpid
            }, function(res) {

                com.focusPage("#gallery_li" + v.qpid).remove();
            });
        });
    }

    function initUploadBtn(v) {

        com.uploadify("#savePicture", "上传图片", api.common.uploadImg, 'btn btn-success', '*.jpg;*.jpeg;*.gif;*.png', {
            'uploadType': 0
        }, 5, function(data) {

            var options = {
                "quotationPicture[0].orderId": v.decoration.orderId,
                "quotationPicture[0].qid": v.siid,
                "quotationPicture[0].areaId": v.areaId,
                "quotationPicture[0].areaName": v.areaName,
                "quotationPicture[0].qiid": v.qiid,
                "quotationPicture[0].name": data.strutsUploadsFileName,
                "quotationPicture[0].path": data.resUrl,
                "quotationPicture[0].filesize": data.filesize,
                "quotationPicture[0].atttype": constant.quotation().quotationPicture.TYPE_SELECT_INT
            };

            com.post(api.quotation.addQuotationPicture, options, function(res) {

                appendGalleryElement(res.quotationPicture);
                com.popup4photos(selectionItem.items.picture);

                searcher.doSearch();
            });
        });
    }

    function getConfig(page, type) {

        var pageConfig = {
            "apiPage": null,
            "pageBtn": [],
            "postDataName": page + "PostData",
            "condArr": [],
            "extraParam": [],
            "propertyArr": []
        };

        function packageConfig(o, props, value, subtype) {

            var prop = props.shift();
            if (props.length != 0) {
                if (!o[prop])
                    o[prop] = {};
                packageConfig(o[prop], props, value, subtype);
                return;
            }

            if (subtype == 0) {
                o[prop] = value;
            } else if (subtype == 1 && !o[prop]) {
                o[prop] = [value];
            } else if (subtype == 1 && o[prop]) {
                o[prop].push(value);
            }
        }

        function getApi(o, props) {

            var prop = props.shift();

            if (props.length == 0) {
                return o[prop];
            } else if (o[prop]) {
                return getApi(o[prop], props);
            }
            return "";
        }

        com.post(api.right.queryQuotationFunctionRight, {
            "quotationFunctionRight.name": page,
            "quotationFunctionRight.type": type
        }, function(res) {

            var rights = res.quotationFunctionRights.sort(function(a, b) {

                return a.quotationFunction.sort - b.quotationFunction.sort;
            });

            $.each(rights, function(i, v) {

                var data = v.quotationFunction;

                if (data.type == 1)
                    data.value = getApi({
                        "api": api
                    }, data.value.split("."));

                packageConfig(pageConfig, data.key.split("."), data.value, data.subtype);
            });
        }, null, false);

        return pageConfig;
    }

    function getPropertyArrDecoration(v) {

        var propertyArr = [];
        $.each(selectionItem.pageConfig.propertyArr, function(pi, pv) {

            switch (pv) {
                case "decorationOrderId":
                    propertyArr.push(["装修单号:", v.decoration.orderId, "blue"]);
                    break;
                case "decorationHouseVillageName":
                    var _text = $("<text>楼盘: </text>").click(function() {

                        tools.village.info($(this), v.decoration.house.village.no);
                    });
                    propertyArr.push([_text, v.decoration.house.village.name, "grey"]);
                    break;
                case "decorationHouseHouseNumber":
                    var _text = $("<text>地址: </text>").click(function() {

                        tools.house.info($(this), v.decoration.house.hid);
                    });
                    propertyArr.push([_text, v.decoration.house.houseNumber, "grey"]);
                    break;
                case "decorationCustomerName":
                    var _text = $("<text>客户名:</text>").click(function() {

                        tools.customer.info($(this), v.decoration.customer.cid);
                    });
                    propertyArr.push([_text, v.decoration.customer.name, "grey"]);
                    break;
                case "decorationDesignerCurrentName":
                    var _text = $("<text>设计师:</text>").click(function() {

                        tools.personel.info($(this), v.decoration.designer.userId);
                    });
                    propertyArr.push([_text, v.decoration.designer.currentName, "grey"]);
                    break;
                case "decorationSalesmanCurrentName":
                    var _text = $("<text>业务员:</text>").click(function() {

                        tools.personel.info($(this), v.decoration.salesman.userId);
                    });
                    propertyArr.push([_text, v.decoration.salesman.currentName, "grey"]);
                    break;
                case "decorationHouseBuildArea":
                    propertyArr.push(["面积: ", v.decoration.house.buildArea, "blue"]);
                    break;
                case "decorationHouseInnerArea":
                    propertyArr.push(["面积: ", v.decoration.house.innerArea, "blue"]);
                    break;
                case "decorationStatus":
                    propertyArr.push(["订单状态: ", constant.decoration().decoration.status.keys[v.decoration.status], "red"]);
                    break;
                case "decorationCreateTime":
                    propertyArr.push(["创建时间: ", v.decoration.createTime, "green"]);
                    break;
                case "decorationHouseClass":
                    propertyArr.push(["房屋类型: ", v.decoration.houseClass, "grey"]);
                    break;
                case "decorationSupervisorCurrentName":
                    propertyArr.push(["监理: ", v.decoration.supervisor != null ? v.decoration.supervisor.currentName : "无", "grey"]);
                    break;
                case "decorationSupervisorPhone":
                    propertyArr.push(["监理电话: ", v.decoration.supervisor != null ? v.decoration.supervisor.phone : "无", "grey"]);
                    break;
                case "decorationEscorterCurrentName":
                    var _text = $("<text>跟单员:</text>").click(function() {

                        tools.personel.info($(this), v.decoration.materialer.userId);
                    });
                    propertyArr.push([_text, v.decoration.materialer != null ? v.decoration.materialer.currentName : "无", "grey"]);
                    break;
                case "decorationProcontracttime":
                    propertyArr.push(["预签时间:", v.decoration.procontracttime || "无", "green"]);
                    break;
            }
        });
        return propertyArr;
    }

    function getPropertyArr(v) {

        var propertyArr = [];
        $.each(selectionItem.pageConfig.propertyArr, function(pi, pv) {

            switch (pv) {
                case "selectionItemGoodsBrand":
                    propertyArr.push(["品牌:", v.goods.brand, "grey"]);
                    break;
                case "selectionItemGoodsCategory":
                    propertyArr.push(["品类:", v.goods.category, "grey"]);
                    break;
                case "selectionItemGoodsNo":
                    propertyArr.push(["商品编号:", v.goods.no, "blue"]);
                    break;
                case "areaName":
                    propertyArr.push(["功能区:", v.areaName, "grey"]);
                    break;
                case "type":
                    propertyArr.push(["类型:", selectionItem.typeList[v.type], "red"]);
                    break;
                case "status":
                    propertyArr.push(["状态:", selectionItem.statusList[v.status], "red"]);
                    break
                case "accountStatus":
                    // 创建对账状态标签,包含信息图标
                    var $accountStatusLabel = $("<span>对账状态: </span>");
                    var $infoIcon = $("<i></i>").addClass("icon-info-sign blue").css({
                        "cursor": "pointer",
                        "margin-left": "5px"
                    }).attr("title", "点击查看结算选材单信息");

                    // 绑定点击事件
                    $infoIcon.click(function(e) {

                        e.stopPropagation(); // 防止事件冒泡

                        // 查询结算选材单信息
                        com.post(api.balance.fetchBalanceSelectionItem, {
                            "balanceSelectionItem.selectionItem.siid": v.siid
                        }, function(res) {

                            var balanceSelection = res.balanceSelectionItem.balanceSelection || {};

                            var tipHtml = '<div style="text-align:left;">';
                            tipHtml += '<strong>结算选材单信息</strong><br/>';
                            tipHtml += '<hr style="margin:5px 0;"/>';
                            tipHtml += '名称: ' + (balanceSelection.name || '无') + '<br/>';
                            tipHtml += '状态: ' + constant.balance().balanceSelection.status.keys[balanceSelection.status] + '<br/>';
                            tipHtml += '创建时间: ' + balanceSelection.createTime || "";
                            tipHtml += '</div>';

                            com.showTip($infoIcon, tipHtml, "top");

                        });
                    });

                    propertyArr.push([$accountStatusLabel, selectionItem.accountStatusList[v.accountStatus], "red", $infoIcon]);
                    break;
                case "num":
                    propertyArr.push(["拆单量:", [2, 4].indexOf(v.type) != -1 ? -v.num : v.num, "blue"]);
                    break;
                case "postprice":
                    propertyArr.push(["结算价:", v.postprice, "blue"]);
                    break;
                case "preprice":
                    propertyArr.push(["预算金额:", v.preprice, "blue"]);
                    break;
                case "selectionItemDecorationVersionName":
                    propertyArr.push(["报价版本:", v.decoration.version.name, "blue"]);
                    break;
                case "quotationItemPrice":
                    propertyArr.push(["单价:", v.preprice, "blue"]);
                    break;
                case "initNum":
                    propertyArr.push(["预算量:", v.initNum, "blue"]);
                    break;
                case "refnum":
                    propertyArr.push(["退货:", v.refnum, "blue"]);
                    break;
                case "utility":
                    propertyArr.push(["实用量:", utils.changeThrDecimal(utils.accSub(parseFloat(v.num), parseFloat(v.refnum))), "blue"]);
                    break;
                case "selectionItemCreaterCurrentName":
                    var _text = $("<text>创建人:</text>").click(function() {

                        tools.personel.info($(this), v.creater.userId);
                    });
                    propertyArr.push([_text, v.creater.currentName, "grey"]);
                    break;
                case "createTime":
                    propertyArr.push(["拆单时间:", v.createTime, "green"]);
                    break;
                case "selectionItemTranerCurrentName":
                    var _text = $("<text>配送人:</text>").click(function() {

                        tools.personel.info($(this), v.traner.userId);
                    });
                    propertyArr.push([_text, v.traner.currentName, "grey"]);
                    break;
                case "tranTime":
                    propertyArr.push(["下单时间:", v.tranTime, "green"]);
                    break;
                case "selectionItemCheckerCurrentName":
                    var _text = $("<text>审核人:</text>").click(function() {

                        tools.personel.info($(this), v.checker.userId);
                    });
                    propertyArr.push([_text, v.checker.currentName, "grey"]);
                    break;
                case "checkTime":
                    propertyArr.push(["审核时间:", v.checkTime, "green"]);
                    break;
                case "selectionItemConfirmerCurrentName":
                    var _text = $("<text>确认人:</text>").click(function() {

                        tools.personel.info($(this), v.confirmer.userId);
                    });
                    propertyArr.push([_text, v.confirmer.currentName, "grey"]);
                    break;
                case "confirmTime":
                    propertyArr.push(["确认时间:", v.confirmTime, "green"]);
                    break;
                case "selectionItemFinishCurrentName":
                    var _text = $("<text>完结人:</text>").click(function() {

                        tools.personel.info($(this), v.finish.userId);
                    });
                    propertyArr.push([_text, v.finish.currentName, "grey"]);
                    break;
                case "finishTime":
                    propertyArr.push(["完结时间:", v.finishTime, "green"]);
                    break;
                case "selectionItemReviewerCurrentName":
                    var _text = $("<text>核对人:</text>").click(function() {

                        tools.personel.info($(this), v.reviewer.userId);
                    });
                    propertyArr.push([_text, v.reviewer.currentName, "grey"]);
                    break;
                case "reviewTime":
                    propertyArr.push(["核对时间:", v.reviewTime, "green"]);
                    break;
                case "selectionItemBalancerCurrentName":
                    var _text = $("<text>申请人:</text>").click(function() {

                        tools.personel.info($(this), v.balancer.userId);
                    });
                    propertyArr.push([_text, v.balancer.currentName, "grey"]);
                    break;
                case "balanceTime":
                    propertyArr.push(["申请时间:", v.balanceTime, "green"]);
                    break;
                case "comment":
                    propertyArr.push(["备注:", v.comment, "grey"]);
                    break;
                case "selectionItemSupplierUserName":
                    propertyArr.push(["厂商:", v.supplier.userName, "grey"]);
                    break;
                case "selectionItemSupplierPhone":
                    propertyArr.push(["电话:", v.supplier.phone, "grey"]);
                    break;
                case "selectionItemSelectionSplitterCurrentName":
                    var _text = $("<text>拆单员:</text>").click(function() {

                        tools.personel.info($(this), v.selection.splitter.userId);
                    });
                    propertyArr.push([_text, v.selection.splitter.currentName, "grey"]);
                    break;
                case "selectionItemSelectionTranerCurrentName":
                    var _text = $("<text>下单员:</text>").click(function() {

                        tools.personel.info($(this), v.selection.traner.userId);
                    });
                    propertyArr.push([_text, v.selection.traner.currentName, "grey"]);
                    break;
            }
        });
        return propertyArr;
    }

});