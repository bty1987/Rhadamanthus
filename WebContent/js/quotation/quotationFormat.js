jQuery(function($) {

    var quotationFormat = {
        qcid: params.data.quotationCtem.qcid,
        qfid: null,
        quotationTypes: {},
        items: {
            name: com.focusPage('#name', "#addQuotationFormatModal"),
            format: com.focusPage('#format', "#addQuotationFormatModal"),
            alias: com.focusPage('#alias', "#addQuotationFormatModal"),
            quotationType: com.focusPage('#quotationType', "#addQuotationFormatModal"),
            workType: com.focusPage('#workType', "#addQuotationFormatModal"),
            measurementUnit: com.focusPage('#measurementUnit', "#addQuotationFormatModal"),
            price: com.focusPage('#price', "#addQuotationFormatModal"),
            addPrice: com.focusPage('#addPrice', "#addQuotationFormatModal"),
            subPrice: com.focusPage('#subPrice', "#addQuotationFormatModal"),
            achePrice: com.focusPage('#achePrice', "#addQuotationFormatModal"),
            comment: com.focusPage('#comment', "#addQuotationFormatModal"),
        },
        modals: {
            addQuotationFormatModal: com.focusPage('#addQuotationFormatModal'),
            quotationCormriceModal: com.focusPage('#quotationCormriceModal'),
            quotationCormtimeModal: com.focusPage('#quotationCormtimeModal'),
            quotationCormoodModal: com.focusPage('#quotationCormoodModal'),
        },
        btns: {
            addQuotationFormatBtn: com.focusPage('#addQuotationFormatBtn'),
            quotationFormatBackBtn: com.focusPage('#quotationFormatBackBtn'),
            quotationFormatBtn: com.focusPage('#quotationFormatBtn'),
        },

    };

    var searcher = new Searcher();

    var linebtns = [{
        name: "编辑",
        clazz: "btn-yellow",
        handle: function(v) {

            quotationFormat.qfid = v.qfid;
            quotationFormat.items.name.val(v.name).attr("disabled", "disabled");
            quotationFormat.items.format.val(v.format);
            quotationFormat.items.alias.val(v.alias);
            quotationFormat.items.quotationType.val(v.type);
            quotationFormat.items.workType.val(v.workType != null ? v.workType.id : "");
            quotationFormat.items.measurementUnit.val(v.unit != null ? v.unit.id : "");
            quotationFormat.items.price.val(v.price);
            quotationFormat.items.addPrice.val(v.addPrice);
            quotationFormat.items.subPrice.val(v.subPrice);
            quotationFormat.items.achePrice.val(v.achePrice);
            quotationFormat.items.comment.val(v.comment);

            quotationFormat.modals.addQuotationFormatModal.modal("show");
        }
    }, {
        name: "定额工费",
        clazz: "btn-inverse",
        handle: function(v) {

            initCormrice(v.qfid);

            quotationFormat.modals.quotationCormriceModal.modal("show");

            return false;
        }
    }, {
        name: "定额工时",
        clazz: "btn-inverse",
        handle: function(v) {

            initCormtime(v.qfid);

            quotationFormat.modals.quotationCormtimeModal.modal("show");

            return false;
        }
    }, {
        name: "定额材料",
        clazz: "btn-inverse",
        handle: function(v) {

            initCormood(v.qfid);

            quotationFormat.modals.quotationCormoodModal.modal("show");

            return false;
        }
    }, {
        name: "删除",
        clazz: "btn-danger",
        handle: function(v) {

            com.post(api.quotation.deleteQuotationFormat, {
                "quotationFormat.qfid": v.qfid
            }, function(e) {

                com.showAlert(com.info, "操作成功");
                searcher.doSearch();
            });
        }
    }, {
        name: "状态",
        type: "switch",
        clazz: "status-lbl",
        handle: function(v, check) {

            com.post(api.quotation.updateQuotationFormatForStatus, {
                "quotationFormat.qfid": v.qfid,
                "quotationFormat.status": check ? 0 : 1
            });

            return false;
        },
        init: function(v) {

            return !v.status;
        }
    }];

    searcher.set("quotationFormatCondList", "quotationFormatPagenation", "quotationFormatResultList", api.quotation.queryQuotationFormatByQcid, {
        "quotationFormat.quotationCtem.qcid": quotationFormat.qcid
    }, ["data-quotation-format-name", "data-quotation-format-format", "data-quotation-format-workType", "data-quotation-format-type", "data-quotation-format-status"], null, "quotationFormats", true);

    var lineprops = [{
        field: "format",
        name: "规格",
        prop: "format",
        clazz: "grey"
    }, {
        field: "name",
        name: "名称",
        prop: "name",
        clazz: "grey"
    }, {
        field: "alias",
        name: "别名",
        prop: "alias",
        clazz: "grey"
    }, {
        field: "type",
        name: "类型",
        prop: "type",
        dataset: quotationFormat.quotationTypes,
        clazz: "grey"
    }, {
        field: "workType",
        name: "工种",
        prop: "workType.name",
        clazz: "grey"
    }, {
        field: "unit",
        name: "单位",
        prop: "unit.name",
        clazz: "grey"
    }, {
        field: "price",
        name: "单价",
        prop: "price",
        clazz: "blue"
    }, {
        field: "addPrice",
        name: "增补价",
        prop: "addPrice",
        clazz: "blue"
    }, {
        field: "subPrice",
        name: "退减价",
        prop: "subPrice",
        clazz: "blue"
    }, {
        field: "achePrice",
        name: "业绩额",
        prop: "achePrice",
        clazz: "blue"
    }, {
        field: "comment",
        name: "信息",
        prop: "comment",
        clazz: "grey"
    }];

    searcher.line("format", lineprops, linebtns).render();

    quotationFormat.btns.quotationFormatBackBtn.click(function() {

        com.closePopup();
    });

    quotationFormat.btns.addQuotationFormatBtn.click(function() {

        quotationFormat.qfid = null;
        quotationFormat.items.name.val("").removeAttr("disabled");
        quotationFormat.items.format.val("");
        quotationFormat.items.alias.val("");
        quotationFormat.items.quotationType.val("");
        quotationFormat.items.workType.val("");
        quotationFormat.items.measurementUnit.val("");
        quotationFormat.items.price.val("");
        quotationFormat.items.addPrice.val("");
        quotationFormat.items.subPrice.val("");
        quotationFormat.items.achePrice.val("");
        quotationFormat.items.comment.val("");

        quotationFormat.modals.addQuotationFormatModal.modal("show");
    });

    quotationFormat.btns.quotationFormatBtn.click(function() {

        if (com.validate('addQuotationFormatModal')) {
            return false;
        }

        var url = api.quotation.addQuotationFormat;

        var option = {
            "quotationFormat.quotationCtem.qcid": quotationFormat.qcid,
            "quotationFormat.name": quotationFormat.items.name.val(),
            "quotationFormat.format": quotationFormat.items.format.val(),
            "quotationFormat.alias": quotationFormat.items.alias.val(),
            "quotationFormat.type": quotationFormat.items.quotationType.val(),
            "quotationFormat.workType.id": quotationFormat.items.workType.val(),
            "quotationFormat.unit.id": quotationFormat.items.measurementUnit.val(),
            "quotationFormat.price": quotationFormat.items.price.val(),
            "quotationFormat.addPrice": quotationFormat.items.addPrice.val(),
            "quotationFormat.subPrice": quotationFormat.items.subPrice.val(),
            "quotationFormat.achePrice": quotationFormat.items.achePrice.val(),
            "quotationFormat.comment": quotationFormat.items.comment.val(),
        };

        if (quotationFormat.qfid != null) {
            url = api.quotation.updateQuotationFormat;
            option["quotationFormat.qfid"] = quotationFormat.qfid;
        }

        com.post(url, option, function(e) {

            com.showAlert(com.info, "操作成功");
            searcher.doSearch();

            quotationFormat.modals.addQuotationFormatModal.modal("hide");
        });
    });

    quotationFormat.modals.addQuotationFormatModal.on("hide.bs.modal", function(e) {

        com.clearValidator();
        com.cleanItems(quotationFormat.items);
    });

    // ---------- 基础数据 ----------

    com.post(api.quotation.queryQuotationType, {}, function(res) {

        quotationFormat.items.quotationType.bindData(res.quotationTypes, "id", "name");

        $.each(res.quotationTypes, function(i, v) {

            quotationFormat.quotationTypes[v.id] = v.name;
        });
    }, null, false);

    com.post(api.common.queryWorkType, {}, function(res) {

        quotationFormat.items.workType.bindData(res.workTypes, "id", "name");
    });

    com.post(api.common.queryMeasurementUnit, {}, function(res) {

        quotationFormat.items.measurementUnit.bindData(res.measurementUnits, "id", "name");
    });

    com.post(api.data.queryMeasurementUnit, {}, function(res) {

        cormrice.items.unit.bindData(res.measurementUnits, "name", "name");
        cormtime.items.unit.bindData(res.measurementUnits, "name", "name");
        cormood.items.normunit.bindData(res.measurementUnits, "name", "name");
        cormood.items.storeunit.bindData(res.measurementUnits, "name", "name");
    });

    com.post(api.data.queryConstructionNode, {}, function(res) {

        cormrice.items.node.bindData(res.constructionNodes, "cnid", "name");
        cormtime.items.node.bindData(res.constructionNodes, "cnid", "name");
    });

    // ---------- 定额行渲染(工费/工时/材料共用) ----------

    function drawNormLine($ul, title, propertyArr, delApi, delOption) {

        var $liLine = $('<li></li>').addClass('item-orange clearfix');
        var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(title));
        var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
        var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');
        var $btnDel = $('<a></a>').addClass('btn btn-minier btn-danger').html('删除');

        $.each(propertyArr, function(index, value) {

            var $liProperty = $('<li></li>');
            $('<strong></strong>').html(value[0]).appendTo($liProperty);
            $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
            $liProperty.appendTo($ulProperty);
        });

        $divBtnWrap.append($btnDel).appendTo($h3);

        $liLine.append($h3).append($ulProperty).appendTo($ul);

        $btnDel.click(function() {

            com.post(delApi, delOption, function(e) {

                com.showAlert(com.info, "操作成功");
                $liLine.remove();
            });
        });
    }

    // ---------- 定额工费 ----------

    var cormrice = {
        qfid: null,
        items: {
            node: com.focusPage('#crNode', "#quotationCormriceModal"),
            unit: com.focusPage('#crUnit', "#quotationCormriceModal"),
            trannum: com.focusPage('#crTrannum', "#quotationCormriceModal"),
            salary: com.focusPage('#crSalary', "#quotationCormriceModal")
        },
        btns: {
            saveBtn: com.focusPage('#quotationCormriceSaveBtn', "#quotationCormriceModal")
        }
    };

    function initCormrice(qfid) {

        cormrice.qfid = qfid;

        com.post(api.data.queryCormriceByQfid, {
            "cormrice.qfid": qfid
        }, function(res) {

            var $ul = com.focusPage('#quotationCormriceList').html(null);

            $.each(res.cormrices, function(i, v) {

                drawNormLine($ul, v.constructionNode.name, [["定额单位: ", v.unit, "gray"], ["转换量: ", v.trannum, "blue"], ["工费: ", v.salary, "blue"]], api.data.deleteCormrice, {
                    "cormrice.cpid": v.cpid
                });
            });
        });
    }

    function saveCormrice() {

        if (com.validate('quotationCormriceModal')) {
            return false;
        }

        com.post(api.data.addCormrice, {
            "cormrice.constructionNode.cnid": cormrice.items.node.val(),
            "cormrice.unit": cormrice.items.unit.val(),
            "cormrice.trannum": cormrice.items.trannum.val(),
            "cormrice.salary": cormrice.items.salary.val(),
            "cormrice.qfid": cormrice.qfid
        }, function(e) {

            com.showAlert(com.info, "操作成功");
            initCormrice(cormrice.qfid);
        });
    }

    cormrice.btns.saveBtn.bindClick(saveCormrice);

    quotationFormat.modals.quotationCormriceModal.on("hide.bs.modal", function(e) {

        com.clearValidator();
        com.cleanItems(cormrice.items);
    });

    // ---------- 定额工时 ----------

    var cormtime = {
        qfid: null,
        items: {
            node: com.focusPage('#ctNode', "#quotationCormtimeModal"),
            unit: com.focusPage('#ctUnit', "#quotationCormtimeModal"),
            trannum: com.focusPage('#ctTrannum', "#quotationCormtimeModal"),
            workdays: com.focusPage('#ctWorkdays', "#quotationCormtimeModal")
        },
        btns: {
            saveBtn: com.focusPage('#quotationCormtimeSaveBtn', "#quotationCormtimeModal")
        }
    };

    function initCormtime(qfid) {

        cormtime.qfid = qfid;

        com.post(api.data.queryCormtimeByQfid, {
            "cormtime.qfid": qfid
        }, function(res) {

            var $ul = com.focusPage('#quotationCormtimeList').html(null);

            $.each(res.cormtimes, function(i, v) {

                drawNormLine($ul, v.constructionNode.name, [["定额单位: ", v.unit, "gray"], ["转换量: ", v.trannum, "blue"], ["工时(天): ", v.workdays, "blue"]], api.data.deleteCormtime, {
                    "cormtime.ctid": v.ctid
                });
            });
        });
    }

    function saveCormtime() {

        if (com.validate('quotationCormtimeModal')) {
            return false;
        }

        com.post(api.data.addCormtime, {
            "cormtime.constructionNode.cnid": cormtime.items.node.val(),
            "cormtime.unit": cormtime.items.unit.val(),
            "cormtime.trannum": cormtime.items.trannum.val(),
            "cormtime.workdays": cormtime.items.workdays.val(),
            "cormtime.qfid": cormtime.qfid
        }, function(e) {

            com.showAlert(com.info, "操作成功");
            initCormtime(cormtime.qfid);
        });
    }

    cormtime.btns.saveBtn.bindClick(saveCormtime);

    quotationFormat.modals.quotationCormtimeModal.on("hide.bs.modal", function(e) {

        com.clearValidator();
        com.cleanItems(cormtime.items);
    });

    // ---------- 定额材料 ----------

    var cormood = {
        qfid: null,
        items: {
            noodsName: com.focusPage('#cmNoodsName', "#quotationCormoodModal"),
            normunit: com.focusPage('#cmNormunit', "#quotationCormoodModal"),
            normnum: com.focusPage('#cmNormnum', "#quotationCormoodModal"),
            storeunit: com.focusPage('#cmStoreunit', "#quotationCormoodModal"),
            storenum: com.focusPage('#cmStorenum', "#quotationCormoodModal"),
            price: com.focusPage('#cmPrice', "#quotationCormoodModal")
        },
        btns: {
            saveBtn: com.focusPage('#quotationCormoodSaveBtn', "#quotationCormoodModal")
        }
    };

    com.initTypeahead(cormood.items.noodsName, api.data.queryNoodsByName, "noods.name", {}, "noodes", "nid", "name", null);

    function initCormood(qfid) {

        cormood.qfid = qfid;

        com.post(api.data.queryCormoodByQfid, {
            "cormood.qfid": qfid
        }, function(res) {

            var $ul = com.focusPage('#quotationCormoodList').html(null);

            $.each(res.cormoods, function(i, v) {

                drawNormLine($ul, v.name, [["定额单位: ", v.normunit, "gray"], ["定额数量: ", v.normnum, "blue"], ["库房单位: ", v.storeunit, "gray"], ["库房数量: ", v.storenum, "blue"], ["价格: ", v.price, "blue"]], api.data.deleteCormood, {
                    "cormood.cgid": v.cgid
                });
            });
        });
    }

    function saveCormood() {

        if (com.validate('quotationCormoodModal')) {
            return false;
        }

        com.post(api.data.addCormood, {
            "cormood.noods.nid": com.typeahead(cormood.items.noodsName),
            "cormood.name": cormood.items.noodsName.val(),
            "cormood.normunit": cormood.items.normunit.val(),
            "cormood.normnum": cormood.items.normnum.val(),
            "cormood.storeunit": cormood.items.storeunit.val(),
            "cormood.storenum": cormood.items.storenum.val(),
            "cormood.price": cormood.items.price.val(),
            "cormood.qfid": cormood.qfid
        }, function(e) {

            com.showAlert(com.info, "操作成功");
            initCormood(cormood.qfid);
        });
    }

    cormood.btns.saveBtn.bindClick(saveCormood);

    quotationFormat.modals.quotationCormoodModal.on("hide.bs.modal", function(e) {

        com.clearValidator();
        com.cleanTypeahead("cmNoodsName");
        com.cleanItems(cormood.items);
    });

});
