$(function() {

    var selectionItem = {

        modals: {
            updateSelectionItemModal: com.focusPage('#updateSelectionItemModal'),
            refundSelectionItemModal: com.focusPage('#refundSelectionItemModal'),
        },
        btns: {
            updateBtn: com.focusPage('#updateBtn'),
            refundBtn: com.focusPage('#refundBtn'),
        },
        items: {
            num: com.focusPage("#num"),
            comment: com.focusPage('#comment'),
            refnum: com.focusPage('#refnum'),
            utilitynum: com.focusPage('#utilitynum')
        },
        title: com.focusPage("#myModalLabel"),
        dcomment: com.focusPage("#dcomment"),
        parameters: {
            siid: 0,
            sid: 0,
            status: 0,
            num: 0
        },
        typeList: [],
        statusList: [],
        postData: '',
        editFlg: true,

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

        selectionItem.status["selectionItem.status"] = constant.quotation().selectionItem.STATUS_INIT_INT;
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
    }

    com.post(api.ds.quotation, {}, function(res) {

        selectionItem.statusList = res.selectionItemStatus.split("key", "value");
        selectionItem.typeList = res.selectionItemType.split("key", "value");
    }, null, false);

    selectionItem.modals.updateSelectionItemModal.on("hide.bs.modal", function() {

        com.clearValidator();
        com.cleanItems(selectionItem.items);
    });

    selectionItem.modals.refundSelectionItemModal.on("hide.bs.modal", function() {

        com.clearValidator();
        com.cleanItems(selectionItem.items);
    });

    selectionItem.btns.updateBtn.bindClick(updateData);
    selectionItem.btns.refundBtn.bindClick(refundSelectionItem);

    selectionItem.pageConfig = getConfig(params['urlLoadParams'].type, 8);

    var displayFunc = (function() {

        $('input[type=checkbox][name=selectionItem]').prop('checked', false);

        var renderList = function(tableId, listData) {

            var $tableWrap = com.focusPage('#' + tableId).empty();
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (listData && listData.length) {
                $.each(listData, function(i, v) {

                    creatLine(v).appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function(v) {

            var $liLine = $('<li></li>').addClass('item-blue clearfix');
            var $h3 = $('<h3></h3>').addClass('oid');
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $_ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnCompile = $('<a></a>').addClass('btn btn-minier btn-yellow').html('编辑');
            var $btnRefnum = $('<a></a>').addClass('btn btn-minier btn-primary').html('退数量');
            var $btnRran = $('<a></a>').addClass('btn btn-minier btn-success').html('配送');
            var $btnCheck = $('<a></a>').addClass('btn btn-minier btn-warning').html('审核');
            var $btnConfirm = $('<a></a>').addClass('btn btn-minier btn-inverse').html('确认');
            var $btnFinish = $('<a></a>').addClass('btn btn-minier btn-danger').html('完结');
            var $btnReview = $('<a></a>').addClass('btn btn-minier btn-pink').html('核对');
            var $btnBalance = $('<a></a>').addClass('btn btn-minier btn-info').html('结算');
            var $btnDel = $('<a></a>').addClass('btn btn-minier btn-pink').html('删除');
            var $btnPrint = $('<a></a>').addClass('btn btn-minier btn-purple').html('打印');

            var $span = $('<span></span>').addClass('lbl blue bigger-150').text(v.goods.name);
            var $label = $('<label></label>');
            var $input = $('<input></input>').attr({
                'class': 'ace ace-checkbox-2',
                'name': 'selectionItem',
                'type': 'checkbox',
                'data-status': v.status,
                'data-num': v.num,
                'id': v.siid,
            }).val(v.siid);

            $input.click(function() {

                var $that = $(this);
                var siid = $that.attr("id");

                if (selectionItem.selectList.length > 30) {
                    com.showAlert(com.warning, "选材项已达数量上限");
                    return false;
                }

                var checked = $that.prop("checked");

                if (checked)
                    !selectionItem.selectList.contains(siid) && selectionItem.selectList.push(siid);
                else
                    selectionItem.selectList.contains(siid) && selectionItem.selectList.splice(selectionItem.selectList.indexOf(siid), 1);
            });

            if (selectionItem.selectList.contains(String(v.siid)))
                $input.prop('checked', true).attr("checked", true);

            $h3.append($label.append($input).append($span));

            var propertyArr = getPropertyArr(v);
            var propertyArrDecoration = getPropertyArrDecoration(v);

            $.each(propertyArr, function(index, value) {

                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $.each(propertyArrDecoration, function(index, value) {

                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($_ulProperty);
            });

            if (selectionItem.pageConfig.pageBtn.contains("compile"))
                $divBtnWrap.append($btnCompile);

            if (selectionItem.pageConfig.pageBtn.contains("refnumBtn"))
                $divBtnWrap.append($btnRefnum);

            if (selectionItem.pageConfig.pageBtn.contains("rran"))
                $divBtnWrap.append($btnRran);

            if (selectionItem.pageConfig.pageBtn.contains("check"))
                $divBtnWrap.append($btnCheck);

            if (selectionItem.pageConfig.pageBtn.contains("confirm"))
                $divBtnWrap.append($btnConfirm);

            if (selectionItem.pageConfig.pageBtn.contains("finish"))
                $divBtnWrap.append($btnFinish);

            if (selectionItem.pageConfig.pageBtn.contains("review"))
                $divBtnWrap.append($btnReview);

            if (selectionItem.pageConfig.pageBtn.contains("balance"))
                $divBtnWrap.append($btnBalance);

            if (selectionItem.pageConfig.pageBtn.contains("delete"))
                $divBtnWrap.append($btnDel);

            if (selectionItem.pageConfig.pageBtn.contains("print"))
                $divBtnWrap.append($btnPrint);

            v.status == constant.quotation().selectionItem.STATUS_INIT_INT || v.status == constant.quotation().selectionItem.STATUS_TRAN_INT ? $btnCompile.show() : $btnCompile.hide();
            v.status == constant.quotation().selectionItem.STATUS_INIT_INT ? $btnRran.show() : $btnRran.hide();
            v.status == constant.quotation().selectionItem.STATUS_TRAN_INT ? $btnCheck.show() : $btnCheck.hide();
            v.status == constant.quotation().selectionItem.STATUS_CHECK_INT ? $btnConfirm.show() : $btnConfirm.hide();
            v.status == constant.quotation().selectionItem.STATUS_CONFIRM_INT ? $btnFinish.show() : $btnFinish.hide();
            v.status == constant.quotation().selectionItem.STATUS_FINISH_INT ? $btnReview.show() : $btnReview.hide();
            v.status == constant.quotation().selectionItem.STATUS_REVIEW_INT ? $btnBalance.show() : $btnBalance.hide();
            v.status != constant.quotation().selectionItem.STATUS_BALANCE_INT ? $btnDel.show() : $btnDel.hide();

            $divBtnWrap.appendTo($h3);

            $liLine.append($h3).append($ulProperty).append($_ulProperty);

            $btnCompile.click(function(e) {

                selectionItem.editFlg = true;
                selectionItem.parameters.siid = v.siid;

                selectionItem.title.text("编辑数量");
                selectionItem.dcomment.show();
                selectionItem.modals.updateSelectionItemModal.modal("show");
            });

            $btnRefnum.click(function(e) {

                selectionItem.parameters.status = v.status;
                selectionItem.parameters.siid = v.siid;
                selectionItem.parameters.num = v.num;

                selectionItem.modals.refundSelectionItemModal.modal('show');
            })

            $btnRran.click(function(e) {

                selectionItem.editFlg = false;
                selectionItem.parameters.siid = v.siid;
                selectionItem.items.num.val(v.num);

                selectionItem.title.text("配送");
                selectionItem.dcomment.hide();
                selectionItem.modals.updateSelectionItemModal.modal("show");
            });

            $btnCheck.click(function(e) {

                var option = {
                    "selectionItems[0].siid": v.siid,
                    "selectionItems[0].checker": null,
                };

                if (selectionItem.escorter) {
                    option["selectionItem.checker.uid"] = v.decoration.escorter.uid;
                }

                com.post(api.quotation.checkSelectionItem, option, function(e) {

                    searcher.doSearch();
                    com.showAlert(com.info, "操作成功");
                });
            });

            $btnConfirm.click(function(e) {

                com.post(api.quotation.confirmSelectionItem, {
                    "selectionItems[0].siid": v.siid
                }, function(e) {

                    searcher.doSearch();
                    com.showAlert(com.info, "操作成功");
                });
            });

            $btnFinish.click(function(e) {

                com.post(api.quotation.finishSelectionItem, {
                    "selectionItems[0].siid": v.siid
                }, function(e) {

                    searcher.doSearch();
                    com.showAlert(com.info, "操作成功");
                });
            });

            $btnReview.click(function(e) {

                com.post(api.quotation.reviewSelectionItem, {
                    "selectionItems[0].siid": v.siid
                }, function(e) {

                    searcher.doSearch();
                    com.showAlert(com.info, "操作成功");
                });
            });

            $btnBalance.click(function(e) {

                com.post(api.quotation.balanceSelectionItem, {
                    "selectionItems[0].siid": v.siid
                }, function(e) {

                    searcher.doSearch();
                    com.showAlert(com.info, "操作成功");
                });
            });

            $btnDel.click(function(e) {

                com.post(api.quotation.cutoffSelectionItem, {
                    "selectionItem.siid": v.siid
                }, function(e) {

                    searcher.doSearch();
                    com.showAlert(com.info, "操作成功");
                })
            })

            $btnPrint.click(function(e) {

                com.post(api.quotation.querySelectionByOrderId, {
                    "selection.orderId": v.decoration.orderId
                }, function(res) {

                    params.quotation.supplierPage = selectionItem.pageType == "supplier" ? true : false;
                    params.quotation.orderId = res.selection.orderId;

                    com.popup("打印选材", api.index.selectionOutputIndex.url, null, null, true);
                }, null, false);
            });

            return $liLine;
        };

        return {
            init: function(tableId, listData) {

                com.focusPage('#' + tableId).html(null);
                renderList(tableId, listData);
            },
            drawLine: function(v) {

                return creatLine(v);
            }
        };
    })();

    var searcher = new Searcher();

    searcher.init(selectionItem.pageConfig.condArr, "condList", selectionItem.pageConfig.apiPage, function(data) {

        displayFunc.init('resultList', data);
    }, "pagenation", selectionItem.postData, selectionItem.status, false, null, function() {

        var btns = [];

        var $checka = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('id', 'checks').css("margin", "0px 3px");
        var $checki = $('<i></i>').addClass('icon-check bigger-110').appendTo($checka);
        var $checkspan = $('<span></span>').text('全选').appendTo($checka);

        var $checkaExportSelects = $('<a></a>').addClass('btn btn-minier btn-info pull-left').attr('name', 'import');
        var $checkExporti = $('<i></i>').addClass('icon-download-alt bigger-110').appendTo($checkaExportSelects);
        var $checkExportspan = $('<span></span>').text('导出').appendTo($checkaExportSelects);
        // 导出单击事件
        $checkaExportSelects.click(function() {

            pageExportStoreImport();
        });

        if (selectionItem.pageConfig.pageBtn.contains("checkAll")) {
            btns.push($checka);
        }

        if (selectionItem.pageConfig.pageBtn.contains("export")) {
            btns.push($checkaExportSelects);
        }

        if (selectionItem.pageConfig.pageBtn.contains("batchDelivery")) {
            var $a = createbtn("batchDelivery", "批量配送", "btn-success");
            btns.push($a);
        }

        if (selectionItem.pageConfig.pageBtn.contains("batchBalance")) {
            var $a = createbtn("batchBalance", "批量结算", "btn-info");
            btns.push($a);
        }

        if (selectionItem.pageConfig.pageBtn.contains("batchCheck")) {
            var $a = createbtn("batchCheck", "批量审核", "btn-warning");
            btns.push($a);
        }

        if (selectionItem.pageConfig.pageBtn.contains("batchConfirm")) {
            var $a = createbtn("batchConfirm", "批量确认", "btn-inverse");
            btns.push($a);
        }

        if (selectionItem.pageConfig.pageBtn.contains("batchFinish")) {
            var $a = createbtn("batchFinish", "批量完结", "btn-danger");
            btns.push($a);
        }

        if (selectionItem.pageConfig.pageBtn.contains("batchReview")) {
            var $a = createbtn("batchReview", "批量核对", "btn-pink");
            btns.push($a);
        }

        function createbtn(id, text, color) {

            var $a = $('<a></a>').addClass('btn btn-minier pull-left ' + color).attr({
                'id': id,
                'style': 'margin: 0px 3px;'
            });
            var $i = $('<i></i>').addClass('icon-plus bigger-110').appendTo($a);
            var $span = $('<span></span>').text(text).appendTo($i);

            return $a;
        }

        return btns;
    });

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
                column: [["名称", 'goods.name'], ["品牌", 'goods.brand'], ["品类", 'goods.category'], ["商品编号", 'goods.no'], ["功能区名称", 'areaName'], ["类型", 'type'], ["状态", 'status'], ["报价项单价", 'preprice'], ["结算价", 'postprice'], ["预算金额", 'preprice'], ["数量", 'num'], ["退数量", 'refnum'], ["剩余数量", 'surplus'], ["备注", 'comment'], ["创建时间", 'createTime'], ["配送人", 'traner.currentName'], ["配送时间", 'tranTime'], ["审核人", 'checker.currentName'], ["审核时间", 'checkTime'], ["确认人", 'confirmer.currentName'], ["确认时间", 'confirmTime'], ["完结人", 'finish.currentName'], ["完结时间", 'finishTime'], ["结算人", 'balancer.currentName'], ["结算时间", 'balanceTime'], ["装修单号", 'decoration.orderId'], ["楼盘", 'decoration.house.village.name'], ["地址", 'decoration.house.houseNumber'], ["建筑面积", 'decoration.house.buildArea'], ["设计师", 'decoration.designer.currentName'], ["业务员", 'decoration.salesman.currentName'], ["监理人员姓名", 'decoration.supervisor.currentName'], ["监理人员电话", 'decoration.supervisor.phone'], ["跟单员", 'decoration.escorter.currentName'],

                ],

                list: res.paging.data
            }, function(v) {

                v.num = [2, 4].indexOf(v.type) != -1 ? -v.num : v.num;
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

    function bulkOperation(url, type) {

        var options = {};

        if (selectionItem.selectList.length == 0) {
            com.showAlert(com.warning, "请选择项目");
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

        var url = null, options = {};

        if (selectionItem.editFlg) {
            options = {
                "selectionItem.num": selectionItem.items.num.val(),
                "selectionItem.comment": selectionItem.items.comment.val(),
                "selectionItem.siid": selectionItem.parameters.siid,
            };
            url = api.quotation.updateSelectionItem;
        } else {
            options = {
                "selectionItems[0].num": selectionItem.items.num.val(),
                "selectionItems[0].siid": selectionItem.parameters.siid
            };
            url = api.quotation.tranSelectionItem;
        }

        com.post(url, options, function(res) {

            searcher.doSearch();
            com.showAlert(com.info, "操作成功");
        });

        selectionItem.modals.updateSelectionItemModal.modal("hide");
    }

    function refundSelectionItem() {

        if (com.validate('refundSelectionItemModal'))
            return false;

        if (selectionItem.items.refnum.val() == "" && selectionItem.items.utilitynum.val() == "") {
            com.showAlert(com.warning, '实用量与退数量需要填写一项');
            return false;
        }

        if (selectionItem.items.refnum.val() != "" && selectionItem.items.utilitynum.val() != "") {
            com.showAlert(com.warning, '实用量与退数量只可填写一项');
            return false;
        }

        if (selectionItem.items.refnum.val() > selectionItem.parameters.num) {
            com.showAlert(com.warning, '退数量不能大于当前数量');
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
                    propertyArr.push(["楼盘:", v.decoration.house.village.name, "grey"]);
                    break;
                case "decorationHouseHouseNumber":
                    propertyArr.push(["地址: ", v.decoration.house.houseNumber, "grey"]);
                    break;
                case "decorationCustomerName":
                    propertyArr.push(["客户名: ", v.decoration.customer.name, "grey"]);
                    break;
                case "decorationDesignerCurrentName":
                    propertyArr.push(["设计师: ", v.decoration.designer.currentName, "grey"]);
                    break;
                case "decorationSalesmanCurrentName":
                    propertyArr.push(["业务员: ", v.decoration.salesman.currentName, "grey"]);
                    break;
                case "decorationHouseBuildArea":
                    propertyArr.push(["面积: ", v.decoration.house.buildArea, "blue"]);
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
                    propertyArr.push(["监理: ", v.decoration.supervisor.currentName != null ? v.decoration.supervisor.currentName : "无", "grey"]);
                    break;
                case "decorationSupervisorPhone":
                    propertyArr.push(["监理电话: ", v.decoration.supervisor.phone != null ? v.decoration.supervisor.phone : "无", "grey"]);
                    break;
                case "decorationEscorterCurrentName":
                    propertyArr.push(["跟单员: ", v.decoration.escorter.currentName != null ? v.decoration.escorter.currentName : "无", "grey"]);
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
                    propertyArr.push(["报价项单价:", v.preprice, "blue"]);
                    break;
                case "initNum":
                    propertyArr.push(["预算量:", v.initNum, "blue"]);
                    break;
                case "refnum":
                    propertyArr.push(["退数量:", v.refnum, "blue"]);
                    break;
                case "utility":
                    propertyArr.push(["实用量:", utils.changeThrDecimal(utils.accSub(parseFloat(v.num), parseFloat(v.refnum))), "blue"]);
                    break;
                case "selectionItemCreaterCurrentName":
                    propertyArr.push(["创建人:", v.creater.currentName, "grey"]);
                    break;
                case "createTime":
                    propertyArr.push(["拆单时间:", v.createTime, "green"]);
                    break;
                case "selectionItemTranerCurrentName":
                    propertyArr.push(["配送人:", v.traner.currentName, "grey"]);
                    break;
                case "tranTime":
                    propertyArr.push(["下单时间:", v.tranTime, "green"]);
                    break;
                case "selectionItemCheckerCurrentName":
                    propertyArr.push(["审核人:", v.checker.currentName, "grey"]);
                    break;
                case "checkTime":
                    propertyArr.push(["审核时间:", v.checkTime, "green"]);
                    break;
                case "selectionItemConfirmerCurrentName":
                    propertyArr.push(["确认人:", v.confirmer.currentName, "grey"]);
                    break;
                case "confirmTime":
                    propertyArr.push(["确认时间:", v.confirmTime, "green"]);
                    break;
                case "selectionItemFinishCurrentName":
                    propertyArr.push(["完结人:", v.finish.currentName, "grey"]);
                    break;
                case "finishTime":
                    propertyArr.push(["完结时间:", v.finishTime, "green"]);
                    break;
                case "selectionItemReviewerCurrentName":
                    propertyArr.push(["核对人:", v.reviewer.currentName, "grey"]);
                    break;
                case "reviewTime":
                    propertyArr.push(["核对时间:", v.reviewTime, "green"]);
                    break;
                case "selectionItemBalancerCurrentName":
                    propertyArr.push(["结算人:", v.balancer.currentName, "grey"]);
                    break;
                case "balanceTime":
                    propertyArr.push(["结算时间:", v.balanceTime, "green"]);
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
                    propertyArr.push(["拆单员:", v.selection.splitter.currentName, "grey"]);
                    break;
                case "selectionItemSelectionTranerCurrentName":
                    propertyArr.push(["下单员:", v.selection.traner.currentName, "grey"]);
                    break;
            }
        });
        return propertyArr;
    }

});