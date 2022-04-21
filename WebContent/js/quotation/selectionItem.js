$(function() {

    var selectionItem = {

        modals: {
            updateSelectionItemModal: com.focusPage('#updateSelectionItemModal'),
            finishSelectionItemModal: com.focusPage('#finishSelectionItemModal'),
        },
        btns: {
            updateBtn: com.focusPage('#updateBtn'),
            finishBtn: com.focusPage('#finishBtn'),
        },
        items: {
            num: com.focusPage("#num"),
            comment: com.focusPage('#comment'),
            refnum: com.focusPage('#refnum'),
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

        url: api.quotation.pageSelectionItem,
        pageType: params.urlLoadParams.type,
        query: ["quotation-selection-orderId", "quotation-selection-category", "quotation-selection-brand", "quotation-selection-item-name"],

        selectList: [],
    };

    if (selectionItem.pageType == "supplier") {
        selectionItem.query = selectionItem.query.concat(["quotation-selection-item-status", "quotation-selection-item-createTime", "quotation-selection-item-tranTime", "quotation-selection-item-checkTime", "quotation-selection-item-confirmTime", "quotation-selection-item-finishTime", "quotation-selection-item-balanceTime"])
        selectionItem.url = api.quotation.pageSelectionItemForSupplier;
        selectionItem.postData = "selectionItemForSupplierPostData";
    } else if (selectionItem.pageType == "escorter") {
        selectionItem.escorter = true;
        selectionItem.url = api.quotation.pageSelectionItemForEscorter;
        selectionItem.postData = "selectionItemForEscorterPostData";
    } else if (selectionItem.pageType == "expert") {
        selectionItem.query = selectionItem.query.concat(["quotation-selection-item-status", "quotation-selection-item-createTime", "quotation-selection-item-tranTime", "quotation-selection-item-checkTime", "quotation-selection-item-confirmTime", "quotation-selection-item-finishTime", "quotation-selection-item-balanceTime"])
        selectionItem.status = {
            "selectionItem.status": null
        };
        selectionItem.postData = "selectionItemForExpertPostData";
    } else if (selectionItem.pageType == "init") {
        selectionItem.status = {
            "selectionItem.status": 0
        };
        selectionItem.postData = "selectionItemForInitPostData";
    } else if (selectionItem.pageType == "tran") {
        selectionItem.status = {
            "selectionItem.status": 1
        };
        selectionItem.postData = "selectionItemForTranPostData";
    } else if (selectionItem.pageType == "check") {
        selectionItem.status = {
            "selectionItem.status": 2
        };
        selectionItem.postData = "selectionItemForCheckPostData";
    } else if (selectionItem.pageType == "confirm") {
        selectionItem.status = {
            "selectionItem.status": 3
        };
        selectionItem.postData = "selectionItemForConfirmPostData";
    } else if (selectionItem.pageType == "finish") {
        selectionItem.status = {
            "selectionItem.status": 4
        };
        selectionItem.postData = "selectionItemForFinishPostData";
    } else if (selectionItem.pageType == "review") {
        selectionItem.status = {
            "selectionItem.status": 5
        };
        selectionItem.postData = "selectionItemForReviewPostData";
    } else if (selectionItem.pageType == "balance") {
        selectionItem.query = selectionItem.query.concat(["quotation-selection-item-balanceTime"])
        selectionItem.status = {
            "selectionItem.status": 6
        };
        selectionItem.postData = "selectionItemForBalancePostData";
    } else if (selectionItem.pageType == "material") {
        selectionItem.query = selectionItem.query.concat(["quotation-selection-item-status", "quotation-selection-item-createTime", "quotation-selection-item-tranTime", "quotation-selection-item-checkTime", "quotation-selection-item-confirmTime", "quotation-selection-item-finishTime", "quotation-selection-item-balanceTime"])
        selectionItem.status = {
            "selectionItem.status": null
        };
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

    selectionItem.modals.finishSelectionItemModal.on("hide.bs.modal", function() {
        com.clearValidator();
        com.cleanItems(selectionItem.items);
    });

    selectionItem.btns.updateBtn.bindClick(updateData);
    selectionItem.btns.finishBtn.bindClick(finishSelectionItem);

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
            var $btnRran = $('<a></a>').addClass('btn btn-minier btn-success').html('配送');
            var $btnCheck = $('<a></a>').addClass('btn btn-minier btn-warning').html('审核');
            var $btnConfirm = $('<a></a>').addClass('btn btn-minier btn-inverse').html('确认');
            var $btnFinish = $('<a></a>').addClass('btn btn-minier btn-danger').html('完结');
            var $btnReview = $('<a></a>').addClass('btn btn-minier btn-inverse').html('核对');
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

            var propertyArr = [["品牌:", v.goods.brand, "grey"], ["品类:", v.goods.category, "grey"], ["商品编号:", v.goods.no, "blue"], ["功能区:", v.areaName, "grey"], ["类型:", selectionItem.typeList[v.type], "red"], ["状态:", selectionItem.statusList[v.status], "red"], ["数量:", [2, 4].indexOf(v.type) != -1 ? -v.num : v.num, "blue"], ["创建人:", v.creater.currentName, "grey"], ["创建时间:", v.createTime, "green"], ["配送人:", v.traner.currentName, "grey"], ["配送时间:", v.tranTime, "green"], ["审核人:", v.checker.currentName, "grey"], ["审核时间:", v.checkTime, "green"], ["确认人:", v.confirmer.currentName, "grey"], ["确认时间:", v.confirmTime, "green"], ["完结人:", v.finish.currentName, "grey"], ["完结时间:", v.finishTime, "green"], ["核对人:", v.reviewer.currentName, "grey"], ["核对时间:", v.reviewTime, "green"], ["结算人:", v.balancer.currentName, "grey"], ["结算时间:", v.balanceTime, "green"], ["备注:", v.comment, "grey"], ];

            var _propertyArr = [["装修单号:", v.decoration.orderId, "blue"], ["楼盘:", v.decoration.house.village.name, "grey"], ["地址:", v.decoration.house.houseNumber, "grey"], ["建筑面积:", v.decoration.house.buildArea, "blue"], ["设计师:", v.decoration.designer.currentName, "grey"], ["业务员:", v.decoration.salesman.currentName, "grey"], ["监理:", v.decoration.supervisor.currentName != null ? v.decoration.supervisor.currentName : "无", "grey"], ["监理电话:", v.decoration.supervisor.phone != null ? v.decoration.supervisor.phone : "无", "grey"], ["跟单员:", v.decoration.escorter.currentName != null ? v.decoration.escorter.currentName : "无", "grey"], ];

            if (v.status <= 1 && selectionItem.pageType != "supplier") {// 显示工程量
                var initNumArr = ["工程量:", v.initNum, "blue"];

                propertyArr.splice(7, 0, initNumArr);
            }

            if (v.status >= 4) {
                propertyArr.splice(7, 0, ["退数量:", v.refnum, "blue"], ["剩余数量:", utils.changeThrDecimal(utils.accSub(parseFloat(v.num), parseFloat(v.refnum))), "blue"]);
            }

            if (selectionItem.pageType == "supplier" || (v.status >= 4 && selectionItem.pageType != "material")) {// 显示结算价
                var postpriceArr = ["结算价:", v.postprice, "blue"];
                var prepriceArr = ["预算金额:", v.preprice, "blue"];

                propertyArr.splice(6, 0, postpriceArr, prepriceArr);
            }

            if (selectionItem.pageType == "expert") {
                var prepriceArr = ["报价项单价:", v.preprice, "blue"];
                propertyArr.splice(6, 0, prepriceArr);
            }

            $.each(propertyArr, function(index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $.each(_propertyArr, function(index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($_ulProperty);
            });

            if (selectionItem.pageType == "supplier") {
                v.status == 2 ? $divBtnWrap.append($btnConfirm) : null;
                v.status == 4 ? $divBtnWrap.append($btnReview) : null;
            } else {
                switch (v.status) {
                    case 0:
                        $divBtnWrap.append($btnCompile).append($btnRran).append($btnDel);
                        break;
                    case 1:
                        $divBtnWrap.append($btnCompile).append($btnCheck).append($btnDel);
                        break;
                    case 2:
                        $divBtnWrap.append($btnConfirm).append($btnDel);
                        break;
                    case 3:
                        $divBtnWrap.append($btnFinish).append($btnDel);
                        break;
                    case 4:
                        $divBtnWrap.append($btnReview).append($btnDel);
                        break;
                    case 5:
                        $divBtnWrap.append($btnBalance).append($btnDel);
                        break;
                }
            }

            $divBtnWrap.append($btnPrint).appendTo($h3);
            $liLine.append($h3).append($ulProperty).append($_ulProperty);

            $btnCompile.click(function(e) {
                selectionItem.editFlg = true;
                selectionItem.parameters.siid = v.siid;

                selectionItem.title.text("编辑数量");
                selectionItem.dcomment.show();
                selectionItem.modals.updateSelectionItemModal.modal("show");
            });

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
                    "selectionItem.siid": v.siid,
                    "selectionItem.checker": null,
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
                    "selectionItem.siid": v.siid
                }, function(e) {
                    searcher.doSearch();
                    com.showAlert(com.info, "操作成功");
                });
            });

            $btnFinish.click(function(e) {

                selectionItem.parameters.siid = v.siid;
                selectionItem.parameters.num = v.num;
                selectionItem.items.refnum.val(0);

                selectionItem.modals.finishSelectionItemModal.modal('show');
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

    searcher.init(selectionItem.query, "condList", selectionItem.url, function(data) {

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

        btns.push($checka);

        if (selectionItem.pageType == "expert" || selectionItem.pageType == "supplier") {
            btns.push($checkaExportSelects);
        }

        if (selectionItem.pageType == "init" || selectionItem.pageType == "expert") {
            var $a = createbtn("batchDelivery", "批量配送", "btn-success");
            btns.push($a);
        }

        if (selectionItem.pageType == "review" || selectionItem.pageType == "expert") {
            var $a = createbtn("batchBalance", "批量结算", "btn-info");
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

        com.post(selectionItem.url, $.extend({}, params[selectionItem.postData], {
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

    function finishSelectionItem() {

        if (com.validate('finishSelectionItemModal'))
            return false;

        if (selectionItem.items.refnum.val() > selectionItem.parameters.num) {
            com.showAlert(com.warning, '退数量不能大于当前数量');
            return false;
        }

        var options = {
            "selectionItem.refnum": selectionItem.items.refnum.val(),
            "selectionItem.siid": selectionItem.parameters.siid
        };

        com.post(api.quotation.finishSelectionItem, options, function(res) {
            searcher.doSearch();
            com.showAlert(com.info, "操作成功");
        });

        selectionItem.modals.finishSelectionItemModal.modal("hide");
    }

});