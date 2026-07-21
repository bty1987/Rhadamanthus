jQuery(function($) {

    var normadd = {

        naid: null,

        btns: {
            saveBtn: com.focusPage("#saveBtn"),
        },

        modals: {
            addModal: com.focusPage("#addModal"),
        },

        items: {
            name: com.focusPage("#name"),
            node: com.focusPage("#node"),
            unit: com.focusPage("#unit"),
            price: com.focusPage("#price"),
        },
        status: {},
        node: {},
        unit: {},
    };

    normadd.btns.saveBtn.bindClick(saveData);

    normadd.modals.addModal.on("hide.bs.modal", function() {

        normadd.naid = null;
        normadd.items.name.prop("readonly", false);

        com.cleanTypeahead(normadd.items.name);
        com.cleanItems(normadd.items);
        com.clearValidator();
        com.closeTip();
    });

    normadd.status = constant.data().common.status.keys;

    com.post(api.common.queryMeasurementUnit, {}, function(res) {

        normadd.items.unit.bindData(res.measurementUnits, "name", "name");
    });

    com.post(api.data.queryConstructionNode, {}, function(res) {

        normadd.items.node.bindData(res.constructionNodes, "cnid", "name", false);
    }, null, false);

    com.initTypeahead(normadd.items.name, api.data.queryQuotationNamingRuleByPinyin, "pinyinName", {"quotationNamingRule.type": 3}, "autoFillKeyValue", "key", "value", null);

    var lineprops = (function() {

        return [{
            field: "constructionNode",
            name: "工程节点",
            prop: "constructionNode.name",
            clazz: "grey"
        }, {
            field: "status",
            name: "状态",
            prop: function(v) { return normadd.status[v.status]; },
            clazz: "red"
        }, {
            field: "unit",
            name: "单位",
            prop: "unit",
            clazz: "grey"
        }, {
            field: "price",
            name: "单价",
            prop: "price",
            clazz: "grey"
        }];
    })();

    var linebtns = (function() {

        return {
            status: {
                type: "switch",
                clazz: "status-lbl",
                init: function(v) { return !v.status; },
                handle: function(v, checked) {
                    var cvalue = checked ? 0 : 1;
                    com.post(api.data.updateNormaddForStatus, {
                        "normadd.naid": v.naid,
                        "normadd.status": cvalue
                    }, function(res) {
                        cvalue == 0 ? com.showAlert(com.info, "已启用") : com.showAlert(com.info, "已禁用");
                        searcher.doSearch();
                    });
                }
            },
            edit: {
                name: "编辑",
                clazz: "btn-info",
                handle: function(v) { editData(v); }
            },
            delete: {
                name: "删除",
                clazz: "btn-yellow",
                handle: function(v) {
                    com.showConfirm("是否确认删除", function() {
                        com.post(api.data.deleteNormadd, {
                            "normadd.naid": v.naid
                        }, function() {
                            searcher.doSearch();
                            com.showAlert(com.info, "操作成功");
                        });
                    });
                }
            }
        };
    })();

    var buttons = (function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('id', 'normaddBtn').css("margin", "0px 3px");
        $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    })();

    var searcher = new Searcher();

    searcher.set("condList", "pagenation", "resultList", api.data.pageNormadd, null, ["data-quotation-normadd-name", "data-quotation-normadd-status"], "normaddPostData", null, false, buttons);
    searcher.line(function(v) { return ' ' + v.name; }, lineprops, linebtns).render();

    com.focusPage('#normaddBtn').click(function() {

        normadd.naid = null;
        normadd.items.name.prop("readonly", false);
        com.focusPage("#myModalLabe2").text("添加");

        normadd.modals.addModal.modal("show");
    });

    function editData(v) {

        normadd.naid = v.naid;

        // name 只读: 回填显示值 + 标记 typeahead key + 锁定输入
        com.updateTypeahead(normadd.items.name, v.name, v.name);
        normadd.items.name.prop("readonly", true);

        normadd.items.node.val(v.constructionNode.cnid);
        normadd.items.unit.val(v.unit);
        normadd.items.price.val(v.price);

        com.focusPage("#myModalLabe2").text("编辑");

        normadd.modals.addModal.modal("show");
    }

    function saveData() {

        if (com.validate('addModal')) {
            return false;
        }
        ;

        var url = api.data.addNormadd;
        var options = {
            "normadd.constructionNode.cnid": normadd.items.node.val(),
            'normadd.unit': normadd.items.unit.val(),
            'normadd.price': normadd.items.price.val(),
        };

        if (normadd.naid) {

            url = api.data.updateNormadd;
            options["normadd.naid"] = normadd.naid;
        } else {

            var name = com.typeahead(normadd.items.name, "", true);
            if (!name) {
                com.showTips("name", "请从下拉列表中选择名称", "right");
                return false;
            }

            options['normadd.name'] = name;
        }

        com.post(url, options, function(res) {

            com.closePopup();
            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
        });

        normadd.modals.addModal.modal("hide");
    }

})