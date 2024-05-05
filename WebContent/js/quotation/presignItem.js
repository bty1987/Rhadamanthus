jQuery(function($) {

    var presignItem = {

        presignProduce: params.data.presignProduce,

        btns: {
            createPresignItemBtn: com.focusPage("#savePresignItemBtn").on("click", saveData)
        },

        modals: {
            createPresignItemModal: com.focusPage("#createPresignItemModal")
        },

        items: {
            name: com.focusPage("#name", "#createPresignItemModal"),
            basicNum: com.focusPage("#basicNum", "#createPresignItemModal"),
            cost: com.focusPage("#cost", "#createPresignItemModal"),
            price: com.focusPage("#price", "#createPresignItemModal"),
            addPrice: com.focusPage("#addPrice", "#createPresignItemModal"),
            subPrice: com.focusPage("#subPrice", "#createPresignItemModal"),
            type: com.focusPage("#type", "#createPresignItemModal"),
            onetype: com.focusPage("#onetype", "#createPresignItemModal"),
            content: com.focusPage("#content", "#createPresignItemModal"),
            atttype: com.focusPage("#atttype", "#createPresignItemModal"),
            areaCale: com.focusPage("input[name=areaCale]", "#createPresignItemModal"),
            number: com.focusPage("#number", "#createPresignItemModal"),
            area: com.focusPage("#area", "#createPresignItemModal")
        },

        pageType: params.urlLoadParams.pageType,

        status: {},
        type: {},
        areaCale: {},
        atttype: {},
        onetype: {},
        presignProduceStatus: {}
    };

    presignItem.status = constant.data().presignItem.status.keys;
    presignItem.type = constant.data().presignItem.type.keys;
    presignItem.areaCale = constant.data().presignItem.areaCale.keys;
    presignItem.atttype = constant.data().presignItem.atttype.keys;
    presignItem.presignProduceStatus = constant.data().presignProduce.status.keys;

    presignItem.items.type.bindData(constant.data().presignItem.type.datas, "key", "value");
    presignItem.items.atttype.bindData(constant.data().presignItem.atttype.datas, "key", "value");
    presignItem.items.onetype.bindData(constant.data().presignItem.oneType.datas, "key", "value");

    presignItem.modals.createPresignItemModal.on('hide.bs.modal', function() {

        com.clearValidator();
        com.cleanItems(presignItem.items);
    });

    var searcher = new Searcher();

    var linebtns = [{
        name: "编辑",
        clazz: "btn-yellow",
        handle: function(v) {

            presignItem.piid = v.piid;

            presignItem.items.name.val(v.name);
            presignItem.items.basicNum.val(v.basicNum);
            presignItem.items.cost.val(v.cost);
            presignItem.items.price.val(v.price);
            presignItem.items.addPrice.val(v.addPrice);
            presignItem.items.subPrice.val(v.subPrice);
            presignItem.items.type.val(v.type);
            presignItem.items.onetype.val(v.onetype);
            presignItem.items.content.val(v.content);
            presignItem.items.atttype.val(v.atttype);
            presignItem.items.number.prop("checked", v.areaCale == 0);
            presignItem.items.area.prop("checked", v.areaCale == 1);

            presignItem.modals.createPresignItemModal.modal("show");

            return false;
        }
    }, {
        name: "删除",
        clazz: "btn-danger",
        handle: function(v) {

            com.post(api.quotation.deletePresignItem, {
                "presignItem.piid": v.piid
            }, function(res) {

                searcher.doSearch();
            });

            return false;
        },
        show: function(v) {

            return false;
        }
    }, {
        name: "状态",
        type: "switch",
        clazz: "status-lbl",
        handle: function(v, check) {

            com.post(api.quotation.updatePresignItemForStatus, {
                "presignItem.piid": v.piid,
                "presignItem.status": check ? 0 : 1
            });

            return false;
        },
        init: function(v) {

            return !v.status;
        }
    }];

    if (presignItem.pageType == null) {

        com.focusPage("#presignItem").addClass("page-content");

        searcher.base("condList1", "pagenation1", "resultList1", api.quotation.pagePresignItem);
        searcher.condition(["quotation-presignItem-name", "quotation-presignItem-status", "quotation-presignItem-type"]);

        searcher.button([{
            id: "createPresignItem",
            name: "创建",
            clazz: "btn-yellow",
            icon: "icon-plus"
        }]);

        searcher.param({
            "presignItem.ppid": presignItem.presignProduce.ppid
        });

        searcher.history("presignItemPostData");

        var lineprops = [{
            fieId: "name",
            name: "名称",
            prop: "name",
            clazz: "grey"
        }, {
            fieId: "status",
            name: "状态",
            prop: "status",
            clazz: "red",
            dataset: presignItem.status
        }, {
            fieId: "cost",
            name: "成本",
            prop: "cost",
            clazz: "blue"
        }, {
            fieId: "price",
            name: "价格",
            prop: "price",
            clazz: "blue"
        }, {
            fieId: "addPrice",
            name: "增补价",
            prop: "addPrice",
            clazz: "blue"
        }, {
            fieId: "subPrice",
            name: "退减价",
            prop: "subPrice",
            clazz: "blue"
        }, {
            fieId: "areaCale",
            name: "面积规则",
            prop: "areaCale",
            clazz: "red",
            dataset: presignItem.areaCale
        }, {
            fieId: "basicNum",
            name: "基础量",
            prop: "basicNum",
            clazz: "blue"
        }, {
            fieId: "type",
            name: "类型",
            prop: "type",
            clazz: "red",
            dataset: presignItem.type
        }, {
            fieId: "onetype",
            name: "一类",
            prop: "onetype",
            clazz: "red",
            dataset: constant.data().presignItem.oneType.keys
        }, {
            fieId: "atttype",
            name: "业务类型",
            prop: "atttype",
            clazz: "red",
            dataset: presignItem.atttype
        }, {
            fieId: "content",
            name: "说明",
            prop: "content",
            clazz: "grey"
        }];

        searcher.line("name", lineprops, linebtns).render();
    }

    if (presignItem.pageType == "presignItem") {

        searcher.base("condList1", "pagenation1", "resultList1", api.quotation.pagePresignItemByPpid);
        searcher.condition(["quotation-presignItem-name", "quotation-presignItem-status", "quotation-presignItem-type"]);
        searcher.history("presignItemsPostData");

        var lineprops = [{
            fieId: "presignProduce.name",
            name: "产品名称",
            prop: "presignProduce.name",
            clazz: "grey"
        }, {
            fieId: "presignProduce.quotePrice",
            name: "起报价",
            prop: "presignProduce.quotePrice",
            clazz: "blue"
        }, {
            fieId: "presignProduce.discount",
            name: "折扣",
            prop: "presignProduce.discount",
            clazz: "blue"
        }, {
            fieId: "presignProduce.manageRate",
            name: "管理费比例",
            prop: "presignProduce.manageRate",
            clazz: "blue"
        }, {
            fieId: "presignProduce.costPrice",
            name: "成本单价",
            prop: "presignProduce.costPrice",
            clazz: "blue"
        }, {
            fieId: "presignProduce.mostPrice",
            name: "主材成本",
            prop: "presignProduce.mostPrice",
            clazz: "blue"
        }, {
            fieId: "presignProduce.profitRate",
            name: "利润率",
            prop: "presignProduce.profitRate",
            clazz: "blue"
        }, {
            fieId: "presignProduce.costRate",
            name: "工程增项成本比例",
            prop: "presignProduce.costRate",
            clazz: "blue"
        }, {
            fieId: "presignProduce.mostRate",
            name: "主材增项成本比例",
            prop: "presignProduce.mostRate",
            clazz: "blue"
        }, {
            fieId: "presignProduce.status",
            name: "状态",
            prop: "presignProduce.status",
            clazz: "red",
            dataset: presignItem.presignProduceStatus
        }, {
            type: "newline"
        }, {
            fieId: "name",
            name: "名称",
            prop: "name",
            clazz: "grey"
        }, {
            fieId: "status",
            name: "状态",
            prop: "status",
            clazz: "red",
            dataset: presignItem.status
        }, {
            fieId: "cost",
            name: "成本",
            prop: "cost",
            clazz: "blue"
        }, {
            fieId: "price",
            name: "价格",
            prop: "price",
            clazz: "blue"
        }, {
            fieId: "addPrice",
            name: "增补价",
            prop: "addPrice",
            clazz: "blue"
        }, {
            fieId: "subPrice",
            name: "退减价",
            prop: "subPrice",
            clazz: "blue"
        }, {
            fieId: "areaCale",
            name: "面积规则",
            prop: "areaCale",
            clazz: "red",
            dataset: presignItem.areaCale
        }, {
            fieId: "basicNum",
            name: "基础量",
            prop: "basicNum",
            clazz: "blue"
        }, {
            fieId: "type",
            name: "类型",
            prop: "type",
            clazz: "red",
            dataset: presignItem.type
        }, {
            fieId: "onetype",
            name: "一类",
            prop: "onetype",
            clazz: "red",
            dataset: constant.data().presignItem.oneType.keys
        }, {
            fieId: "atttype",
            name: "业务类型",
            prop: "atttype",
            clazz: "red",
            dataset: presignItem.atttype
        }, {
            fieId: "content",
            name: "说明",
            prop: "content",
            clazz: "grey"
        }];

        searcher.line("name", lineprops, linebtns).render();

    }

    com.focusPage('#createPresignItem', '#pagenation1').on("click", function() {

        presignItem.piid = null;
        presignItem.modals.createPresignItemModal.modal("show");
        presignItem.items.number.prop("checked", true);
    });

    function saveData() {

        if (com.validate('createPresignItemModal'))
            return false;

        var url = api.quotation.addPresignItem;

        var options = {
            "presignItem.ppid": presignItem.presignProduce.ppid,
            "presignItem.name": presignItem.items.name.val(),
            "presignItem.basicNum": presignItem.items.basicNum.val(),
            "presignItem.cost": presignItem.items.cost.val(),
            "presignItem.price": presignItem.items.price.val(),
            "presignItem.addPrice": presignItem.items.addPrice.val(),
            "presignItem.subPrice": presignItem.items.subPrice.val(),
            "presignItem.type": presignItem.items.type.val(),
            "presignItem.onetype": presignItem.items.onetype.val(),
            "presignItem.content": presignItem.items.content.val(),
            "presignItem.atttype": presignItem.items.atttype.val(),
            "presignItem.areaCale": presignItem.items.areaCale.prop("checked") ? 0 : 1
        };

        if (presignItem.piid) {
            url = api.quotation.updatePresignItem;
            options["presignItem.piid"] = presignItem.piid;
        }

        com.post(url, options, function() {

            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
        });

        presignItem.modals.createPresignItemModal.modal("hide");
    }

});
