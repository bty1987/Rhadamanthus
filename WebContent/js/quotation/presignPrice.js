jQuery(function($) {

    var presignPrice = {

        presignProduce: params.data.presignProduce,

        btns: {
            createPresignPriceBtn: com.focusPage("#savePresignPriceBtn").on("click", saveData),
        },

        modals: {
            createPresignPriceModal: com.focusPage("#createPresignPriceModal"),
        },

        items: {
            name: com.focusPage("#name", "#createPresignPriceModal"),
            upperArea: com.focusPage("#upperArea", "#createPresignPriceModal"),
            lowerArea: com.focusPage("#lowerArea", "#createPresignPriceModal"),
            price: com.focusPage("#price", "#createPresignPriceModal"),
        },

        status: {},
        type: {}
    };

    presignPrice.modals.createPresignPriceModal.on('hide.bs.modal', function() {

        com.clearValidator();
        com.cleanItems(presignPrice.items);
    });

    var searcher = new Searcher();

    searcher.base("condList2", "pagenation2", "resultList2", api.quotation.pagePresignPrice);

    searcher.condition(["quotation-presignPrice-name", "quotation-presignPrice-status"]);

    searcher.button([{
        id: "createPresignPrice",
        name: "创建",
        clazz: "btn-yellow",
        icon: "icon-plus"
    }]);

    searcher.param({
        "presignPrice.ppid": presignPrice.presignProduce.ppid
    });

    searcher.history("presignPricePostData");

    var lineprops = [{
        fieId: "name",
        name: "名称",
        prop: "name",
        clazz: "grey"
    }, {
        fieId: "upperArea",
        name: "起始面积",
        prop: "upperArea",
        clazz: "blue"
    }, {
        fieId: "lowerArea",
        name: "终止面积",
        prop: "lowerArea",
        clazz: "blue"
    }, {
        fieId: "price",
        name: "价格",
        prop: "price",
        clazz: "blue"
    }];

    var linebtns = [{
        name: "编辑",
        clazz: "btn-yellow",
        handle: function(v) {

            presignPrice.pspid = v.pspid;

            presignPrice.items.name.val(v.name);
            presignPrice.items.upperArea.val(v.upperArea);
            presignPrice.items.lowerArea.val(v.lowerArea);
            presignPrice.items.price.val(v.price);

            presignPrice.modals.createPresignPriceModal.modal("show");

            return false;
        }
    }, {
        name: "删除",
        clazz: "btn-danger",
        handle: function(v) {

            com.post(api.quotation.deletePresignPrice, {
                "presignPrice.pspid": v.pspid
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

            com.post(api.quotation.updatePresignPriceForStatus, {
                "presignPrice.pspid": v.pspid,
                "presignPrice.status": check ? 0 : 1
            });

            return false;
        },
        init: function(v) {

            return !v.status;
        }
    }, ];

    searcher.line("name", lineprops, linebtns).render();

    com.focusPage('#createPresignPrice', '#pagenation2').on("click", function() {

        presignPrice.pspid = null;
        presignPrice.modals.createPresignPriceModal.modal("show");
    });

    function saveData() {

        if (com.validate('createPresignPriceModal'))
            return false;

        var url = api.quotation.addPresignPrice;

        var options = {
            "presignPrice.ppid": presignPrice.presignProduce.ppid,
            "presignPrice.name": presignPrice.items.name.val(),
            "presignPrice.upperArea": presignPrice.items.upperArea.val(),
            "presignPrice.lowerArea": presignPrice.items.lowerArea.val(),
            "presignPrice.price": presignPrice.items.price.val(),
        };

        if (presignPrice.pspid) {
            url = api.quotation.updatePresignPrice;
            options["presignPrice.pspid"] = presignPrice.pspid;
        }

        com.post(url, options, function() {

            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
        });

        presignPrice.modals.createPresignPriceModal.modal("hide");
    }

});
