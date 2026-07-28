$(function(){

    var productionPlan = {

        finishSaveBtn: com.focusPage("#finishSaveBtn"),

        modals: {
            productionPlanFinishModal: com.focusPage("#productionPlanFinishModal"),
            layerImport: com.focusPage("#layerImport"),
        },

        items: {
            num: com.focusPage("#num"),
        },

        ppid: null,
        differentiate: true,
    }

    var pageConfig = drawNode.getConfig(params['urlLoadParams'].depage);

    productionPlan.finishSaveBtn.bindClick(finishDate);

    productionPlan.modals.productionPlanFinishModal.on("hide.bs.modal", function () {
        com.cleanItems(productionPlan.items);
        com.closeTip();
    });



    var lineprops = (function() {

        var props = [];

        $.each(pageConfig.propertyArr, function(pi, pv) {
            switch (pv) {
                case "productionNo":
                    props.push({ field: "production.pno", name: "生产单号", prop: "production.pno", clazz: "blue" });
                    break;
                case "orderId":
                    props.push({ field: "production.orderId", name: "装修单号", prop: "production.orderId", clazz: "blue" });
                    break;
                case "address":
                    props.push({
                        field: "production.house",
                        name: "楼盘地址",
                        prop: function(v) { return v.production.house.village.name + " " + v.production.house.houseNumber; },
                        clazz: "grey"
                    });
                    break;
                case "creater":
                    props.push({ field: "creater.userName", name: "创建人", prop: "creater.userName", clazz: "grey" });
                    break;
                case "createTime":
                    props.push({ field: "createTime", name: "创建时间", prop: "createTime", clazz: "green" });
                    break;
                case "finishTime":
                    props.push({ field: "finishTime", name: "完结时间", prop: "finishTime", clazz: "green" });
                    break;
                case "status":
                    props.push({
                        field: "status",
                        name: "状态",
                        prop: function(v) { return constant.production().productionPlan.status.keys[v.status]; },
                        clazz: "red"
                    });
                    break;
                case "timeLimit":
                    props.push({ field: "timeLimit", name: "工期", prop: "timeLimit", clazz: "green" });
                    break;
                case "remainingTime":
                    props.push({
                        field: "remainingTime",
                        name: "订单剩余时间",
                        prop: function(v) {
                            var remainDate = productionUtils.dateDiffer(v.createTime, v.timeLimit);
                            if (v.status == constant.production().productionPlan.STATUS_FINISH_INT) {
                                return "订单已结束";
                            } else if (remainDate < 0) {
                                return "已超过期限" + Math.abs(remainDate) + "天";
                            } else {
                                return "剩余工期" + Math.abs(remainDate) + "天";
                            }
                        },
                        clazz: function(v) {
                            var remainDate = productionUtils.dateDiffer(v.createTime, v.timeLimit);
                            return remainDate < 5 ? "red" : "green";
                        }
                    });
                    break;
            }
        });

        return props;
    })();

    var linebtns = (function() {

        var btns = {};

        $.each(pageConfig.pageBtn, function(k, b) {
            switch (b) {
                case "btnPlanItem":
                    btns.sub = {
                        name: "计划项",
                        clazz: "btn-yellow",
                        handle: function(v) {
                            params["productionPlan.ppid"] = v.ppid;
                            params["productionPlan.status"] = v.status;
                            com.popup4page("#productionPlanPopUp", "views/production/productionPlanItem.html", "计划子项");
                        }
                    };
                    break;
                case "btnProgetass":
                    btns.prograss = {
                        name: "生产进度",
                        clazz: "btn-success",
                        handle: function(v) {
                            params.differentiate = productionPlan.differentiate;
                            params["productionPlan.ppid"] = v.ppid;
                            params["productionPlan.status"] = v.status;
                            com.switchPage(api.index.productionPlanDetailIndex.url);
                        }
                    };
                    break;
                case "btnUpload":
                    btns.upload = {
                        name: "上传",
                        clazz: "btn-warning",
                        handle: function(v) {
                            productionPlan.modals.layerImport.modal("show").find('.infobox').remove();
                            var $line = com.focusPage('#download');

                            if (v.path) {
                                productionUtils.createLine(v.path, v.no, $line);
                            }

                            com.focusPage('#importProductionPlanExcel').removeClass('hide');

                            if (v.status == 1 || v.status == 2) {
                                com.focusPage("#importProductionPlanExcel").addClass('hide');
                            }

                            com.uploadify("#importProductionPlanExcel", "上传文件", api.common.uploadOther, 'btn btn-success blue ', "*.xlsx", { 'uploadType': 2 }, 1, function(data) {

                                var option = {
                                    "productionPlan.ppid": v.ppid,
                                    "productionPlan.path": data.resUrl,
                                    "productionPlan.filesize": data.filesize
                                };

                                com.post(api.production.updateProductionPlan, option, function(res) {
                                    com.showAlert(com.info, "操作成功");
                                    $line.find(".infobox").remove();
                                    productionUtils.createLine(v.path, v.no, $line);
                                    searcher.doSearch();
                                });
                            });
                        }
                    };
                    break;
                case "btnFinish":
                    btns.finish = {
                        name: "完结",
                        clazz: "btn-inverse",
                        show: function(v) { return v.status == constant.production().productionPlan.STATUS_CREATE_INT; },
                        handle: function(v) {
                            productionPlan.ppid = v.ppid;
                            productionPlan.modals.productionPlanFinishModal.modal("show");
                        }
                    };
                    break;
            }
        });

        return btns;
    })();

    var searcher = new Searcher();

    searcher.set('_condList', '_pagenation', '_resultList', pageConfig.apiPage, null, pageConfig.condArr, pageConfig.postDataName, null, false, null);
    searcher.line("no", lineprops, linebtns).render();

    com.focusPage("#confirmBtn").click(function(){
        productionPlan.modals.layerImport.modal("hide");
    });

    function finishDate() {
        if (com.validate('productionPlanFinishModal')) {
            return false;
        }

        var options = {
            "productionPlan.ppid": productionPlan.ppid,
            "productionPlan.num": productionPlan.items.num.val(),
        }

        com.post(api.production.finishProductionPlan, options, function(){
            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
        });

        productionPlan.modals.productionPlanFinishModal.modal("hide");
    }

});