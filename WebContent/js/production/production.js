$(function() {

    var production = {
        saveBtn: com.focusPage("#saveBtn"),
        saveUpholdBtn: com.focusPage("#saveUpholdBtn"),
        updateSaveBtn: com.focusPage("#updateSaveBtn"),

        modals: {
            productionModal: com.focusPage("#productionModal"),
            upholdProductionModal: com.focusPage("#upholdProductionModal"),
            productionUpdateModal: com.focusPage("#productionUpdateModal")
        },

        items: {
            orderId: com.focusPage("#orderId"),
            orderAddr: com.focusPage("#orderAddr"),
            brand: com.focusPage("#brand"),
            category: com.focusPage("#category"),
            total: com.focusPage("#total"),
            designer: com.focusPage("#designer"),
            salesman: com.focusPage("#salesman"),
            spliter: com.focusPage("#spliter"),
            timeLimit: com.focusPage("#timeLimit")
        },

        updateItems: {
            uDesigner: com.focusPage("#uDesigner"),
            uSalesman: com.focusPage("#uSalesman"),
            uSpliter: com.focusPage("#uSpliter"),
            uTimeLimit: com.focusPage("#uTimeLimit")
        },

        upholdItems: {
            spid: com.focusPage("#spid"),
            mbrand: com.focusPage("#mbrand"),
            mcategory: com.focusPage("#mcategory"),
            upholdDesigner: com.focusPage("#upholdDesigner"),
            upholdSalesman: com.focusPage("#upholdSalesman"),
            upholdSpliter: com.focusPage("#upholdSpliter"),
            upholdTotal: com.focusPage("#upholdTotal"),
            upholdTimeLimit: com.focusPage("#upholdTimeLimit")
        },

        productionStatus: {},
        diliveryStatus: {},
        type: {},
        pid: null,
        bid: null,

        editFlg: true,
        distinguish: true,
        productionPostData: {},
    };

    var pageConfig = drawNode.getConfig(params['urlLoadParams'].depage);

    production.saveBtn.bindClick(saveData);
    production.saveUpholdBtn.bindClick(saveUpholdData);
    production.updateSaveBtn.bindClick(updateData);

    production.modals.productionModal.on("hide.bs.modal", function() {

        com.cleanItems(production.items);
        com.closeTip();
    });

    production.modals.upholdProductionModal.on("hide.bs.modal", function() {

        com.cleanItems(production.upholdItems);
        com.closeTip();
    });

    production.modals.productionUpdateModal.on("hide.bs.modal", function() {

        com.cleanItems(production.updateItems);
        com.closeTip();
    });

    var $Personnels = com.focusPage('#designer,#salesman,#uDesigner,#uSalesman,#upholdDesigner,#upholdSalesman');
    com.initTypeahead($Personnels, api.personel.queryUserByPinyin, "pinyinName", {
        "departmentType.name": "设计部",
        "user.status": 0
    }, "autoFillKeyValue", "key", "value", null);

    var $Dismantling = com.focusPage('#spliter,#uSpliter,#upholdSpliter');
    com.initTypeahead($Dismantling, api.personel.queryUserByPinyin, "pinyinName", {
        "departmentType.name": "",
        "user.status": 0
    }, "autoFillKeyValue", "key", "value", null);

    var $Brand = com.focusPage('#brand,#mbrand');
    com.initTypeahead($Brand, api.data.queryBrandByPinyin, "brand.pinyin", {}, "brands", "bid", "name", function(list, k, v) {

        var $input;
        production.editFlg ? $input = production.items.category : $input = production.upholdItems.mcategory;
        $.each(list, function(index, val) {

            if (val.bid == k) {
                production.bid = k;
                com.post(api.data.queryBrandByBid, {
                    "brand.bid": k
                }, function(res) {

                    $input.val(res.brand.categoryName);
                });
            }
        });
        return v;
    });

    com.post(api.ds.production, {}, function(res) {

        production.productionStatus = res.productionStatus.split("key", "value");
        production.diliveryStatus = res.diliveryStatus.split("key", "value");
        production.type = res.productionType.split("key", "value");
    }, null, false);

    var displayFunc = (function() {

        var renderList = function(tableId, listData) {

            var $tableWrap = com.focusPage('#' + tableId).empty();
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (listData && listData.length) {
                $.each(listData, function(i, v) {

                    creatLine(v).appendTo($ul);

                });

                $ul.appendTo($tableWrap);
            }
            ;
        };

        var creatLine = function(v) {

            var $liLine = $('<li></li>').addClass('clearfix item-orange');
            var $h3 = $('<h3></h3>').addClass('oid');
            var $title = $('<small></small>').addClass('blue').html(' ' + v.pno);
            var $btnDiv = $('<div></div>').addClass('pull-right action-buttons');
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');

            var $btnDesign = $('<a></a>').addClass(' btn btn-minier btn-yellow').html('设计');
            var $btnSplit = $('<a></a>').addClass(' btn btn-minier btn-success').html('拆单');
            var $btnInstore = $('<a></a>').addClass(' btn btn-minier btn-warning').html('入库');
            var $btnLogistics = $('<a></a>').addClass(' btn btn-minier btn-inverse').html('物流');
            var $btnMount = $('<a></a>').addClass(' btn btn-minier btn-danger').html('安装');
            var $btnFinish = $('<a></a>').addClass(' btn btn-minier btn-pink').html('完结');
            var $btnAfter = $('<a></a>').addClass(' btn btn-minier btn-purple').html('售后');
            var $btnAbandon = $('<a></a>').addClass(' btn btn-minier btn-yellow').html('废单');

            var $btnAdvancedUpdate = $('<a></a>').addClass(' btn btn-minier btn-yellow').html('高级更新');
            var $btnUpdate = $('<a></a>').addClass(' btn btn-minier btn-success').html('更新');
            var $btnBind = $('<a></a>').addClass(' btn btn-minier btn-warning').html('绑定');
            var $btnquote = $('<a></a>').addClass(' btn btn-minier btn-inverse').html('报价');
            var $btnPicture = $('<a></a>').addClass(' btn btn-minier btn-danger').html('图纸');
            var $btnOut = $('<a></a>').addClass(' btn btn-minier btn-pink').html('外协');
            var $btnHard = $('<a></a>').addClass(' btn btn-minier btn-purple').html('五金');
            var $btnPlan = $('<a></a>').addClass(' btn btn-minier btn-yellow').html('计划');
            var $btnView = $('<a></a>').addClass(' btn btn-minier btn-success').html('查看');
            var remainDate = productionUtils.dateDiffer(v.createTime, v.timeLimit);// 计算剩余工期
            var remainDay = 0; // 显示剩余工期

            if (v.status == 10 || v.status == 9) {
                remainDay = "订单已结束";
            } else if (remainDate < 0) {
                remainDay = "已超过期限" + Math.abs(remainDate) + "天";
            } else {
                remainDay = "剩余工期" + Math.abs(remainDate) + "天"
            }

            var propertyArr = [];

            $.each(pageConfig.propertyArr, function(pi, pv) {

                switch (pv) {
                    case "orderId":
                        propertyArr.push(["装修单号:", v.orderId, "blue"]);
                        break;
                    case "address":
                        propertyArr.push(["楼盘地址:", v.house.village.name + " " + v.house.houseNumber, "grey"]);
                        break;
                    case "creater":
                        propertyArr.push(["创建人:", v.creater.userName, "grey"]);
                        break;
                    case "designer":
                        propertyArr.push(["设计师:", v.designer.userName, "grey"]);
                        break;
                    case "salesman":
                        propertyArr.push(["销售员:", v.salesman.userName, "grey"]);
                        break;
                    case "spliter":
                        propertyArr.push(["拆单员: ", v.spliter.userName, "grey"]);
                        break;
                    case "type":
                        propertyArr.push(["类型:", production.type[v.type], "red"]);
                        break;
                    case "brandName":
                        propertyArr.push(["品牌:", v.brand.name, "grey"]);
                        break;
                    case "categoryName":
                        propertyArr.push(["品类:", v.category.name, "grey"]);
                        break;
                    case "status":
                        propertyArr.push(["状态:", production.productionStatus[v.status], "red"]);
                        break;
                    case "total":
                        propertyArr.push(["总额:", v.total, "blue"]);
                        break;
                    case "timeLimit":
                        propertyArr.push(["工期:", v.timeLimit, "green"]);
                        break;
                    case "spid":
                        propertyArr.push(["父级生产单号:", (v.spid == 0 ? null : v.spid), "blue"]);
                        break;
                    case "createTime":
                        propertyArr.push(["创建时间:", v.createTime, "green"]);
                        break;
                    case "designTime":
                        propertyArr.push(["设计时间:", v.designTime, "green"]);
                        break;
                    case "divideTime":
                        propertyArr.push(["生产时间:", v.divideTime, "green"]);
                        break;
                    case "storeTime":
                        propertyArr.push(["入库时间:", v.storeTime, "green"]);
                        break;
                    case "planTime":
                        propertyArr.push(["物流时间:", v.planTime, "green"]);
                        break;
                    case "tranTime":
                        propertyArr.push(["运输时间:", v.tranTime, "green"]);
                        break;
                    case "mountTime":
                        propertyArr.push(["安装时间:", v.mountTime, "green"]);
                        break;
                    case "finishTime":
                        propertyArr.push(["完结时间:", v.finishTime, "green"]);
                        break;
                    case "remainingTime":
                        propertyArr.push(["订单剩余时间:", remainDay, (remainDate < 5 ? "red" : "green")]);
                        break;
                    case "updateTime":
                        propertyArr.push(["订单更新时间:", v.updateTime, "green"]);
                        break;
                }
            });

            $.each(propertyArr, function(index, value) {

                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').addClass(value[2]).html(value[1]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $.each(pageConfig.pageBtn, function(k, b) {

                switch (b) {
                    case "btnAdvancedUpdate":// 高级更新
                        $btnDiv.append($btnAdvancedUpdate);
                        break;
                    case "btnUpdate":// 更新
                        if ([0, 1].indexOf(v.status) != -1) {
                            $btnDiv.append($btnUpdate);
                        }
                        break;
                    case "btnBind":// 绑定
                        if (v.status == 0) {
                            $btnDiv.append($btnBind);
                        }
                        break;
                    case "btnquote":// 报价
                        if (v.status >= 0) {
                            $btnDiv.append($btnquote);
                        }
                        break;
                    case "btnPicture":// 图纸
                        if (v.status >= 1) {
                            $btnDiv.append($btnPicture);
                        }
                        break;
                    case "btnOut":// 外协
                        if (v.status >= 2) {
                            $btnDiv.append($btnOut);
                        }
                        break;
                    case "btnHard":// 五金
                        if (v.status >= 2) {
                            $btnDiv.append($btnHard);
                        }
                        break;
                    case "btnPlan":// 计划
                        if (v.status >= 2) {
                            $btnDiv.append($btnPlan);
                        }
                        break;
                    case "btnDesign":// 设计
                        if (v.status == 0) {
                            $btnDiv.append($btnDesign);
                        }
                        break;
                    case "btnSplit":// 拆单
                        if (v.status == 1) {
                            $btnDiv.append($btnSplit);
                        }
                        break;
                    case "btnInstore":// 入库
                        if (v.status == 2) {
                            $btnDiv.append($btnInstore);
                        }
                        break;
                    case "btnLogistics":// 物流
                        if (v.status == 3) {
                            $btnDiv.append($btnLogistics);
                        }
                        break;
                    case "btnMount":// 安装
                        // if (v.status == 5) {
                        // $btnDiv.append($btnMount);
                        // }
                        break;
                    case "btnFinish":// 完结
                        if ([7, 8].indexOf(v.status) != -1) {
                            $btnDiv.append($btnFinish);
                        }
                        break;
                    case "btnAfter":// 售后
                        if (v.status == 7) {
                            $btnDiv.append($btnAfter);
                        }
                        break;
                    case "btnAbandon":// 废单
                        if (v.status < 3) {
                            $btnDiv.append($btnAbandon);
                        }
                        break;
                    case "btnView":// 查看
                        $btnDiv.append($btnView);
                        break;
                }
                $h3.append($title).append($btnDiv);
            });

            $liLine.append($h3).append($ulProperty);

            $btnUpdate.click(function() {

                production.distinguish = true;
                production.pid = v.pid;
                production.updateItems.uDesigner.userId = v.designer.userId;
                production.updateItems.uSalesman.userId = v.salesman.userId;
                production.updateItems.uSpliter.userId = v.spliter.userId;
                production.updateItems.uTimeLimit.val(v.timeLimit).attr("disabled", "disabled");

                var $Designer = production.updateItems.uDesigner.val(v.designer.userName);
                var $Salesman = production.updateItems.uSalesman.val(v.salesman.userName);
                var $Spliter = production.updateItems.uSpliter.val(v.spliter.userName);
                v.status == 0 ? $Designer.removeAttr("disabled", "disabled") : $Designer.attr("disabled", "disabled");
                v.status != 0 && v.status != 1 ? $Salesman.attr("disabled", "disabled") : $Salesman.removeAttr("disabled", "disabled");
                v.status != 0 && v.status != 1 ? $Spliter.attr("disabled", "disabled") : $Spliter.removeAttr("disabled", "disabled");

                production.modals.productionUpdateModal.modal("show");
            });

            $btnAdvancedUpdate.click(function() {

                if (v.status == 8 || v.status == 9) {
                    com.showAlert(com.warning, "生产单状态不能作此操作!");
                    return false;
                }

                production.distinguish = false;

                production.pid = v.pid;
                production.updateItems.uDesigner.userId = v.designer.userId;
                production.updateItems.uSalesman.userId = v.salesman.userId;
                production.updateItems.uSpliter.userId = v.spliter.userId;

                production.updateItems.uDesigner.val(v.designer.userName).removeAttr("disabled", "disabled");
                production.updateItems.uSalesman.val(v.salesman.userName).removeAttr("disabled", "disabled");
                production.updateItems.uSpliter.val(v.spliter.userName).removeAttr("disabled", "disabled");
                production.updateItems.uTimeLimit.val(v.timeLimit).removeAttr("disabled", "disabled");

                production.modals.productionUpdateModal.modal("show");
            });

            $btnAfter.click(function() {

                com.showConfirm("是否确认进入售后阶段", function() {

                    com.post(api.production.upholdProduction, {
                        "production.pid": v.pid
                    }, function() {

                        productionSearcher.doSearch();
                        com.showAlert(com.info, "操作成功");
                    });
                });
            });

            $btnBind.click(function() {

                transferData = {};
                transferData.pid = v.pid;
                transferData.status = v.status;
                transferData.orderId = v.orderId;
                params["transferData"] = transferData;

                com.switchPage(api.index.productionSalesIndex.url);

            });

            $btnDesign.click(function() {

                com.showConfirm("是否确认进入设计阶段", function() {

                    com.post(api.production.designProduction, {
                        "production.pid": v.pid
                    }, function() {

                        productionSearcher.doSearch();
                        com.showAlert(com.info, "操作成功");
                    });
                });
            });

            $btnSplit.click(function() {

                com.showConfirm("是否确认进入生产阶段", function() {

                    com.post(api.production.splitProduction, {
                        "production.pid": v.pid
                    }, function() {

                        productionSearcher.doSearch();
                        com.showAlert(com.info, "操作成功");
                    });
                });
            });

            $btnInstore.click(function() {

                com.showConfirm("是否确认进入入库阶段", function() {

                    com.post(api.production.instoreProduction, {
                        "production.pid": v.pid
                    }, function() {

                        productionSearcher.doSearch();
                        com.showAlert(com.info, "操作成功");
                    });
                });
            });

            $btnLogistics.click(function() {

                com.showConfirm("是否确认进入物流阶段", function() {

                    com.post(api.production.planProduction, {
                        "production.pid": v.pid
                    }, function() {

                        productionSearcher.doSearch();
                        com.showAlert(com.info, "操作成功");
                    });
                });
            });

            $btnMount.click(function() {

                com.showConfirm("是否确认进入安装阶段", function() {

                    com.post(api.production.mountProduction, {
                        "production.pid": v.pid
                    }, function() {

                        productionSearcher.doSearch();
                        com.showAlert(com.info, "操作成功");
                    });
                });
            });

            $btnFinish.click(function() {

                com.showConfirm("是否确认进入完结阶段", function() {

                    com.post(api.production.finishProduction, {
                        "production.pid": v.pid
                    }, function() {

                        productionSearcher.doSearch();
                        com.showAlert(com.info, "操作成功");
                    });
                });
            });

            $btnAbandon.click(function() {

                com.showConfirm("是否确认报废生产单", function() {

                    com.post(api.production.terminalProduction, {
                        "production.pid": v.pid
                    }, function() {

                        productionSearcher.doSearch();
                        com.showAlert(com.info, "操作成功");
                    });
                });
            });

            $btnView.click(function() {

                params["pid"] = v.pid;
                params["status"] = v.status;
                com.popup4page('#productionDataViewPopUp', "views/production/production4view.html", "名称 : " + v.pno);
            });

            $btnquote.click(function() {

                params["pid"] = v.pid;
                params["status"] = v.status;
                params["address"] = v.house.village.name + " " + v.house.houseNumber;

                com.switchPage(api.index.puotationIndex.url);
            });

            $btnOut.click(function() {

                params["pid"] = v.pid;
                params["status"] = v.status;

                com.switchPage(api.index.outsourceIndex.url);
            });

            $btnHard.click(function() {

                params["pid"] = v.pid;
                params["status"] = v.status;

                com.switchPage(api.index.hardwareCreateIndex.url);
            });

            $btnPlan.click(function() {

                params["pid"] = v.pid;
                params["status"] = v.status;

                com.switchPage(api.index.productionPlanCreateIndex.url);
            });

            $btnPicture.click(function() {

                params["pid"] = v.pid;
                params["status"] = v.status;

                com.popup4page("#layerPopUp", "views/production/productionPicture.html", "图纸");
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

    var productionSearcher = new Searcher();

    productionSearcher.init(pageConfig.condArr, "condList", pageConfig.apiPage, function(data) {

        displayFunc.init('resultList', data);
    }, "pagenation", pageConfig.postDataName, null, false, null, function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('id', 'addProduction').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);
        var $upholdAdda = $('<a></a>').addClass('btn btn-minier btn-warning pull-yellow').attr('id', 'createUpholdProduction').css("margin", "0px 3px");
        var $upholdAddi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($upholdAdda);
        var $upholdSpan = $('<span></span>').text('创建售后单').appendTo($upholdAdda);

        return [$adda, $upholdAdda];
    });

    com.focusPage("#addProduction").click(function() {

        production.editFlg = true;
        production.modals.productionModal.modal("show");
    });

    com.focusPage("#createUpholdProduction").click(function() {

        production.editFlg = false;
        production.items.type = 1;
        production.modals.upholdProductionModal.modal("show");
    });

    function updateData() {

        if (com.validate('productionModal')) {
            return false;
        }

        var uDesigner = com.typeahead("uDesigner") == 0 ? production.updateItems.uDesigner.userId : com.typeahead("uDesigner");
        var uSalesman = com.typeahead("uSalesman") == 0 ? production.updateItems.uSalesman.userId : com.typeahead("uSalesman");
        var uSpliter = com.typeahead("uSpliter") == 0 ? production.updateItems.uSpliter.userId : com.typeahead("uSpliter");

        var url;
        var options = {
            "production.pid": production.pid,
            "production.designer.userId": uDesigner,
            "production.salesman.userId": uSalesman,
            "production.spliter.userId": uSpliter
        };

        production.distinguish ? url = api.production.updateProduction : url = api.production.updateProductionForAdvance, options["production.timeLimit"] = production.updateItems.uTimeLimit.val();

        com.post(url, options, function(res) {

            com.showAlert(com.info, "操作成功");
            productionSearcher.doSearch();
        });

        production.modals.productionUpdateModal.modal("hide");
    }

    function saveData() {

        if (com.validate('productionModal')) {
            return false;
        }

        var options = {
            "production.type": 0,
            "production.designer.userId": com.typeahead("designer"),
            "production.salesman.userId": com.typeahead("salesman"),
            "production.spliter.userId": com.typeahead("spliter"),
            "production.brand.bid": production.bid,
            "production.total": production.items.total.val(),
            "production.timeLimit": production.items.timeLimit.val(),
            "production.orderId": production.items.orderId.val(),
            "production.house.hid": production.productionPostData["production.house.hid"]
        };

        com.post(api.production.addProduction, options, function(res) {

            com.showAlert(com.info, "操作成功");
            productionSearcher.doSearch();
        });

        production.modals.productionModal.modal("hide");
    }

    function saveUpholdData() {

        if (com.validate('upholdProductionModal')) {
            return false;
        }
        var options = {
            "production.spid": production.upholdItems.spid.val(),
            "production.brand.bid": production.bid,
            "production.designer.userId": com.typeahead("upholdDesigner"),
            "production.salesman.userId": com.typeahead("upholdSalesman"),
            "production.spliter.userId": com.typeahead("upholdSpliter"),
            "production.total": production.upholdItems.upholdTotal.val(),
            "production.timeLimit": production.upholdItems.upholdTimeLimit.val()
        };
        com.post(api.production.addProduction, options, function(res) {

            com.showAlert(com.info, "操作成功");
            productionSearcher.doSearch();
        });

        production.modals.upholdProductionModal.modal("hide");
    }

    com.focusPage("#orderId").on('change', (function() {

        var option = {
            "decoration.orderId": production.items.orderId.val()
        };

        com.post(api.decoration.queryDecorationForCommonByOrderId, option, function(data) {

            production.items.orderAddr.val(data.decoration.house.village.name + "  " + data.decoration.house.houseNumber);
            production.productionPostData["production.house.hid"] = data.decoration.house.hid;
        });
    }));

});
