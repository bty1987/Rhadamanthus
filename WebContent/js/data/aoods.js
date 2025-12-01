$(function() {

    var aoods = {

        aid: null,
        gid: null,

        items: {
            aoodName: com.focusPage("#aoodName", "#addLayer"),
            goodsName: com.focusPage("#goodsName", "#addLayer"),
            nood: com.focusPage("#nood", "#addLayer"),
            accessoriesType: com.focusPage("#accessoriesType", "#addLayer"),
            sortType: com.focusPage("#sortType", "#addLayer"),
            bcompany: com.focusPage("#bcompany", "#addLayer"),
            atttype: com.focusPage("#atttype", "#addLayer"),
            balance: com.focusPage("#balance", "#addLayer"),
            selling: com.focusPage("#selling", "#addLayer"),
            constructionNode: com.focusPage("#constructionNode", "#addLayer"),

            normunit: com.focusPage('#normunit', "#addLayer"),
            normnum: com.focusPage('#normnum', "#addLayer"),
            storeunit: com.focusPage('#storeunit', "#addLayer"),
            storenum: com.focusPage('#storenum', "#addLayer"),

            editName: com.focusPage("#editName", "#editLayer"),
            editAccessoriesType: com.focusPage("#editAccessoriesType", "#editLayer"),
            editSortType: com.focusPage("#editSortType", "#editLayer"),
            editNood: com.focusPage("#editNood", "#editLayer"),
            editBcompany: com.focusPage("#editBcompany", "#editLayer"),
            old: com.focusPage("#old", "#editLayer"),
            editAtttype: com.focusPage("#editAtttype", "#editLayer"),
            editBalance: com.focusPage("#editBalance", "#editLayer"),
            editSelling: com.focusPage("#editSelling", "#editLayer"),
            editConstructionNode: com.focusPage("#editConstructionNode", "#editLayer"),

            editNormunit: com.focusPage('#normunit', "#editLayer"),
            editNormnum: com.focusPage('#normnum', "#editLayer"),
            editStoreunit: com.focusPage('#storeunit', "#editLayer"),
            editStorenum: com.focusPage('#storenum', "#editLayer"),

            ccompany: com.focusPage("#ccompany", "#copyLayer"),
            quotationVersion: com.focusPage("#quotationVersion", "#quotationVersionModal")
        },

        btns: {
            submitBtn: com.focusPage("#submitBtn", "#addLayer"),
            editBtn: com.focusPage("#editBtn", "#editLayer"),
            copyBtn: com.focusPage("#copyBtn", "#copyLayer"),
            confirmItemBtn: com.focusPage("#confirmItemBtn", "#quotationVersionModal")
        },

        modals: {
            addLayer: com.focusPage("#addLayer"),
            editLayer: com.focusPage("#editLayer"),
            quotationVersionModal: com.focusPage("#quotationVersionModal"),
            addQuotaionItemModal: com.focusPage("#addQuotaionItemModal"),
            normoodsModal: com.focusPage("#normoodsModal")
        },

        status: ["启用", "禁用"],
        atttype: ["标准", "外辅"],

        pageType: params.urlLoadParams.type
    };

    com.post(api.data.queryAccessoriesType, {}, function(res) {

        aoods.items.accessoriesType.bindData(res.accessoriesTypes, 'atid', 'name', true);
        aoods.items.sortType.bindData(res.accessoriesTypes, 'atid', 'name', true);
        aoods.items.editAccessoriesType.bindData(res.accessoriesTypes, 'atid', 'name', true);
        aoods.items.editSortType.bindData(res.accessoriesTypes, 'atid', 'name', true);
    });

    com.initTypeahead('nood', api.data.queryNoodsByName, "noods.name", {}, "noodes", "nid", "name", null);
    com.initTypeahead('editNood', api.data.queryNoodsByName, "noods.name", {}, "noodes", "nid", "name", null);

    com.post(api.quotation.queryQuotationVersion, {}, function(res) {

        aoods.items.quotationVersion.bindData(res.quotationVersions, 'no', 'name');
    });

    com.post(api.system.queryCompany, {}, function(res) {

        aoods.items.bcompany.bindData(res.companys, 'cid', 'name', true);
        aoods.items.ccompany.bindData(res.companys, 'cid', 'name', true);

        aoods.items.editBcompany.bindData(res.companys, 'cid', 'name', true);
    });

    com.post(api.data.queryConstructionNode, {}, function(res) {

        aoods.items.editConstructionNode.bindData(res.constructionNodes, "cnid", "name", true);
        aoods.items.constructionNode.bindData(res.constructionNodes, "cnid", "name", true);
    });

    com.post(api.ds.data, {}, function(res) {

        aoods.items.atttype.bindData(res.aoodsAtttype, "key", "value", false);
        aoods.items.editAtttype.bindData(res.aoodsAtttype, "key", "value", false);
    });
    
    com.post(api.common.queryMeasurementUnit, {}, function(res) {

        aoods.items.normunit.bindData(res.measurementUnits, "name", "name");
        aoods.items.storeunit.bindData(res.measurementUnits, "name", "name");
        
        aoods.items.editNormunit.bindData(res.measurementUnits, "name", "name");
        aoods.items.editStoreunit.bindData(res.measurementUnits, "name", "name");
    });

    aoods.btns.submitBtn.click(function() {

        saveData();
    });

    aoods.btns.editBtn.click(function() {

        editAoods();
    });

    aoods.btns.copyBtn.click(function() {

        copyAoods();
    });

    com.initTypeahead(aoods.items.goodsName, api.data.queryGoodsByName, "goods.name", {}, "goodes", "gid", "name");

    var searcher = new Searcher();

    searcher.base("condList", "pagenation", "resultList", api.data.pageAoods);
    searcher.condition(["data-aoods-name", "data-aoods-type", "data-aoods-type-sort", "data-aoods-status", "data-aoods-bompany", "data-aoods-atttype"]);
    searcher.history("aoodsHistoryData");

    if (aoods.pageType == "bompany") {
        searcher.condition(["data-aoods-name", "data-aoods-type", "data-aoods-type-sort", "data-aoods-status", "data-aoods-atttype"]);
    }

    searcher.param({
        "companyType": aoods.pageType
    });

    searcher.button([{
        id: "add",
        name: "添加",
        clazz: "btn-yellow",
        icon: "icon-plus"
    }]);

    if (aoods.pageType == "company") {
        searcher.button([{
            id: "copy",
            name: "复制",
            clazz: "btn-success",
            icon: "icon-download-alt"
        }]);
    }

    var lineprops = [{
        field: "name",
        name: "名称",
        prop: "name",
        clazz: "grey"
    }, {
        field: "goods.brand",
        name: "品牌",
        prop: "goods.brand",
        clazz: "grey"
    }, {
        field: "goods.category",
        name: "品类",
        prop: "goods.category",
        clazz: "grey"
    }, {
        field: "goods.measurementUnit",
        name: "单位",
        prop: "goods.measurementUnit",
        clazz: "red"
    }, {
        field: "selling",
        name: "售价",
        prop: "selling",
        clazz: "blue"
    }, {
        field: "balance",
        name: "结算价",
        prop: "balance",
        clazz: "blue"
    }, {
        field: "accessoriesType.name",
        name: "分类辅类",
        prop: "accessoriesType.name",
        clazz: "red"
    }, {
        field: "sortType.name",
        name: "排序辅类",
        prop: function (v) {

            return v.sortType.name == null ? v.sortType.name = "暂无" : v.sortType.name;
        },
        clazz: "red"
    }, {
        field: "status",
        name: "状态 ",
        prop: "status",
        clazz: "red",
        dataset: aoods.status
    }, {
        field: "bompany",
        name: "归属公司",
        prop: "bompany",
        clazz: "grey"
    }, {
        field: "atttype",
        name: "业务类型 ",
        prop: "atttype",
        clazz: "red",
        dataset: aoods.atttype
    }, {
        field: "noods.name",
        name: "定材 ",
        prop: "noods.name",
        clazz: "grey"
    }, {
        field: "constructionNode.name",
        name: "施工节点 ",
        prop: "constructionNode.name",
        clazz: "grey"
    }, {
        fieId: "normunit",
        name: "定额单位",
        prop: "normunit",
        clazz: "grey"
    }, {
        fieId: "quotationUnit",
        name: "报价单位",
        prop: "quotationItem.unit.name",
        clazz: "grey"
    }, {
        fieId: "normnum",
        name: "定额数量",
        prop: "normnum",
        clazz: "blue"
    }, {
        fieId: "storeunit",
        name: "库房单位",
        prop: "storeunit",
        clazz: "grey"
    }, {
        fieId: "storenum",
        name: "库房数量",
        prop: "storenum",
        clazz: "blue"
    }];

    var linebtns = [{
        name: "定材",
        clazz: "btn-warning",
        handle: function(v) {

            aoods.aid = v.aid;
            aoods.modals.quotationVersionModal.modal("show");
        }
    }, {
        name: "编辑",
        clazz: "btn-yellow",
        handle: function(v) {

            com.cleanItems(aoods.items);

            aoods.aid = v.aid;
            aoods.gid = v.goods.gid;

            com.updateTypeahead(aoods.items.editNood, v.noods.nid, v.noods.name);

            aoods.items.old.val(v.bompany);

            aoods.items.editName.val(v.name);
            aoods.items.editNood.val(v.noods.name);
            aoods.items.editBalance.val(v.balance);
            aoods.items.editSelling.val(v.selling);
            aoods.items.editAccessoriesType.val(v.accessoriesType.atid);
            aoods.items.editSortType.val(v.sortType.atid);
            aoods.items.editAtttype.val(v.atttype);
            aoods.items.editConstructionNode.val(v.constructionNode.cnid);

            com.popup4model("#editLayer", "编辑");
        }
    }, {
        name: "成本",
        clazz: "btn-pink",
        handle: function(v) {

            params.data.aoods = v;
            com.popup4page("#optPopUp", "views/data/aoodsCost.html", "辅材成本");
        }
    }, {
        name: "状态",
        type: "switch",
        clazz: "status-lbl",
        handle: function(v, check) {

            com.post(api.data.updateAoodsForStatus, {
                "aoods.aid": v.aid,
                "aoods.status": check ? 0 : 1
            });

            return false;
        },
        init: function(v) {

            return !v.status;
        }
    }];

    searcher.line("goods.name", lineprops, linebtns);

    searcher.render();

    com.focusPage('#add', '#pagenation').on("click", function() {

        com.cleanItems(aoods.items);
        com.popup4model("#addLayer", "添加");
    });

    com.focusPage('#copy', '#pagenation').on("click", function() {

        com.cleanItems(aoods.items);
        com.popup4model("#copyLayer", "复制");
    });

    function saveData() {

        if (com.validate("formAoods", "right")) {
            return false;
        }

        var options = {
            "aoods.name": aoods.items.aoodName.val(),
            "aoods.goods.gid": com.typeahead(aoods.items.goodsName),
            "aoods.noods.nid": com.typeahead(aoods.items.nood),
            "aoods.accessoriesType.atid": aoods.items.accessoriesType.val(),
            "aoods.sortType.atid": aoods.items.sortType.val(),
            "aoods.bompany": aoods.items.bcompany.val(),
            "aoods.atttype": aoods.items.atttype.val(),
            "aoods.balance": aoods.items.balance.val(),
            "aoods.selling": aoods.items.selling.val(),
            "aoods.constructionNode.cnid": aoods.items.constructionNode.val(),

            "aoods.normunit": aoods.items.normunit.val(),
            "aoods.normnum": aoods.items.normnum.val(),
            "aoods.storeunit": aoods.items.storeunit.val(),
            "aoods.storenum": aoods.items.storenum.val(),
        };

        com.post(api.data.addAoods, options, function(res) {

            com.closePopup();

            searcher.doSearch();
        });
    }

    function editAoods() {

        if (com.validate("editAoods", "right")) {
            return false;
        }

        var options = {
            "aoods.aid": aoods.aid,
            "aoods.name": aoods.items.editName.val(),
            "aoods.goods.gid": aoods.gid,
            "aoods.noods.nid": com.typeahead(aoods.items.editNood),
            "aoods.accessoriesType.atid": aoods.items.editAccessoriesType.val(),
            "aoods.sortType.atid": aoods.items.editSortType.val(),
            "aoods.bompany": aoods.items.editBcompany.val(),
            "aoods.atttype": aoods.items.editAtttype.val(),
            "aoods.balance": aoods.items.editBalance.val(),
            "aoods.selling": aoods.items.editSelling.val(),
            "aoods.constructionNode.cnid": aoods.items.editConstructionNode.val(),

            "aoods.normunit": aoods.items.editNormunit.val(),
            "aoods.normnum": aoods.items.editNormnum.val(),
            "aoods.storeunit": aoods.items.editStoreunit.val(),
            "aoods.storenum": aoods.items.editStorenum.val()
        };

        com.post(api.data.updateAoods, options, function(res) {

            com.closePopup();
            searcher.doSearch();
        });
    }

    function copyAoods() {

        if (com.validate("copyAoods", "right")) {
            return false;
        }

        com.post(api.data.copyAoods, {
            "aoods.bompany": aoods.items.ccompany.val(),
        }, function(res) {

            com.closePopup();

            searcher.doSearch();
        });
    }

    var painter = {
        /**
         * 创建添加数据中报价项弹窗中的报价项
         * 
         * @param v
         * @param id
         * @param name
         * @returns
         */
        createDataItemModal: function(v, id, name) {

            var $liLine = $('<li></li>').addClass('item-blue clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').css({
                "margin-bottom": 0
            });

            var $label = $('<label></label>');
            var $span = $('<span></span>').addClass('lbl blue bigger-150').text(v.name);
            var $btnDiv = $('<div></div>').addClass('pull-right action-buttons').appendTo($h3);

            var $btnSelect = $('<a></a>').addClass(' btn btn-minier btn-yellow').html('选择').appendTo($btnDiv);
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');

            var propertyArr = [];
            propertyArr.push(["类型: ", v.category.name, "red"]);
            propertyArr.push(["分类: ", v.classification.name, "red"]);
            propertyArr.push(["大类: ", v.bigCategory.name, "red"]);
            propertyArr.push(["小类: ", v.smallCategory.name, "red"]);
            propertyArr.push(["单位: ", v.unit.name, "red"]);
            propertyArr.push(["工种: ", v.workType.name, "red"]);
            propertyArr.push(["单价: ", v.unitPrice, "blue"]);
            propertyArr.push(["版本: ", v.version.name, "grey"]);
            propertyArr.push(["说明: ", v.comment, "grey"]);

            $.each(propertyArr, function(index, value) {

                var $liProperty = $('<li></li>');

                if (value[1]) {
                    $('<strong></strong>').html(value[0]).appendTo($liProperty);
                    $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);

                    $liProperty.appendTo($ulProperty);
                }

                if (value[3]) {
                    $liProperty.addClass(value[3]);
                }
            });

            $label.append($span).appendTo($h3);
            $liLine.append($h3).append($ulProperty);

            $btnSelect.click(function() {

                if (com.validate("addQuotaionItemModal"))
                    return false;

                var _params = {
                    "normood.quotationItem.qiid": v.qiid
                };
                com.post(api.data.queryNormoodByQiid, _params, function(res) {

                    var $tableWrap = com.focusPage('#normoodList', aoods.modals.normoodsModal).empty();
                    var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');
                    if (res.normoods && res.normoods.length) {
                        $.each(res.normoods, function(i, v) {

                            painter.createNormoodsModal(v).appendTo($ul);
                        });
                        $ul.appendTo($tableWrap);
                    }
                }, null, false);

                aoods.modals.addQuotaionItemModal.modal("hide");
                aoods.modals.normoodsModal.modal("show");
            });

            return $liLine;
        },
        /**
         * 创建添加报价中定额材料
         * 
         * @param v
         * @param id
         * @param name
         * @returns
         */
        createNormoodsModal: function(v) {

            var $liLine = $('<li></li>').addClass('item-blue clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').css({
                "margin-bottom": 0
            });

            var $label = $('<label></label>');
            var $span = $('<span></span>').addClass('lbl blue bigger-150').text(v.name);
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $btnDiv = $('<div></div>').addClass('pull-right action-buttons').appendTo($h3);
            var $btnSelect1 = $('<a></a>').addClass(' btn btn-minier btn-yellow').html('选择').appendTo($btnDiv);

            var propertyArr = [];
            propertyArr.push(["定额单位: ", v.normunit, "gray"]);
            propertyArr.push(["定额数量: ", v.normnum, "blue"]);
            propertyArr.push(["库房单位: ", v.storeunit, "gray"]);
            propertyArr.push(["库房数量: ", v.storenum, "blue"]);
            propertyArr.push(["状态: ", constant.data().normood.status.keys[v.status], "red"]);

            $.each(propertyArr, function(index, value) {

                var $liProperty = $('<li></li>');

                if (value[1]) {
                    $('<strong></strong>').html(value[0]).appendTo($liProperty);
                    $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);

                    $liProperty.appendTo($ulProperty);
                }

                if (value[3]) {
                    $liProperty.addClass(value[3]);
                }
            });

            $label.append($span).appendTo($h3);
            $liLine.append($h3).append($ulProperty);

            $btnSelect1.click(function() {

                var options = {
                    "aoods.aid": aoods.aid,
                    "aoods.noods.nid": v.noods.nid,
                };

                com.post(api.data.updateAoodsForNorm, options, function(res) {

                    aoods.modals.normoodsModal.modal("hide");
                    searcher.doSearch();
                }, null, false);

            });

            return $liLine;
        },
    };

    com.focusPage('#confirmItemBtn').off().on('click', function() {

        if (com.validate("quotationVersionModal"))
            return false;

        var versionId = com.focusPage('#quotationVersion').val();

        var extraParams = {
            "quotationItem.version.no": versionId
        };

        var _condArrn = ['data-quotation-item-name', 'data-quotation-item-bigcategory', 'data-quotation-item-smallcategory', 'quotation-worktype'];
        var quotationSeacher = new Searcher();
        quotationSeacher.init(_condArrn, "condListn1", api.quotation.pageQuotationItemByVersionId, function(data) {

            var $tableWrap = com.focusPage('#resultListn1').empty();
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (data && data.length) {
                $.each(data, function(i, v) {

                    v.measurementUnit = v.unit.name;
                    v.workType = v.workType.name;
                    v.quotationItemDes = v.comment;
                    painter.createDataItemModal(v, "qiid", "name").appendTo($ul);
                });
                $ul.appendTo($tableWrap);
            }
        }, "pagenationn1", "addQuotaionItemModalPostDatan", extraParams);

        aoods.modals.quotationVersionModal.modal("hide");
        aoods.modals.addQuotaionItemModal.modal("show");

    });

});