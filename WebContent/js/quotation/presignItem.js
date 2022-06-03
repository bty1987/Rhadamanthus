jQuery(function($) {

    var presignItem = {

        presignProduce: params.data.presignProduce,

        btns: {
            createPresignItemBtn: com.focusPage("#savePresignItemBtn").on("click", saveData),
        },

        modals: {
            createPresignItemModal: com.focusPage("#createPresignItemModal"),
        },

        items: {
            name: com.focusPage("#name", "#createPresignItemModal"),
            basicNum: com.focusPage("#basicNum", "#createPresignItemModal"),
            cost: com.focusPage("#cost", "#createPresignItemModal"),
            price: com.focusPage("#price", "#createPresignItemModal"),
            type: com.focusPage("#type", "#createPresignItemModal"),
            onetype: com.focusPage("#onetype", "#createPresignItemModal"),
            content: com.focusPage("#content", "#createPresignItemModal"),
        },

        status: {},
        type: {},
        onetype: {
            0: "普通",
            1: "标配"
        }
    };

    com.post(api.ds.quotation, {}, function(res) {

        presignItem.status = res.presignItemStatus.split("key", "value");
        presignItem.type = res.presignItemType.split("key", "value");

        presignItem.items.type.bindData(res.presignItemType, "key", "value");
    }, null, false);

    presignItem.modals.createPresignItemModal.on('hide.bs.modal', function() {

        com.clearValidator();
        com.cleanItems(presignItem.items);
    });

    var searcher = new Searcher();

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
        dataset: presignItem.onetype
    }, {
        fieId: "content",
        name: "说明",
        prop: "content",
        clazz: "grey"
    }, ];

    var linebtns = [{
        name: "编辑",
        clazz: "btn-yellow",
        handle: function(v) {

            presignItem.piid = v.piid;

            presignItem.items.name.val(v.name);
            presignItem.items.basicNum.val(v.basicNum);
            presignItem.items.cost.val(v.cost);
            presignItem.items.price.val(v.price);
            presignItem.items.type.val(v.type);
            presignItem.items.onetype.val(v.onetype);
            presignItem.items.content.val(v.content);

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
    }, ];

    searcher.line("name", lineprops, linebtns).render();

    com.focusPage('#createPresignItem', '#pagenation1').on("click", function() {

        presignItem.piid = null;
        presignItem.modals.createPresignItemModal.modal("show");
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
            "presignItem.type": presignItem.items.type.val(),
            "presignItem.onetype": presignItem.items.onetype.val(),
            "presignItem.content": presignItem.items.content.val(),
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
