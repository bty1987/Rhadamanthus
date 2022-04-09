jQuery(function($) {

    var oales = {

        btns: {
            saveBtn: com.focusPage("#saveBtn").on("click", saveData),
            totalBtn: com.focusPage("#totalBtn").on("click", total),
        },

        modals: {
            oalesModal: com.focusPage("#oalesModal"),
            totalModal: com.focusPage("#totalModal"),
        },

        items: {
            orderId: com.focusPage("#orderId", "#oalesModal"),
            total: com.focusPage("#total", "#oalesModal"),
            comment: com.focusPage("#comment", "#oalesModal"),
            brandName: com.focusPage('#brandName', "#oalesModal"),
            service: com.focusPage('#service', "#oalesModal"),
            atttype: com.focusPage("#atttype", "#oalesModal"),
            awardType: com.focusPage('#awardType', "#totalModal"),
            award: com.focusPage('#award', "#totalModal"),

            profit: com.focusPage('#profit', "#totalModal"),
            newTotal: com.focusPage('#newTotal', "#totalModal"),
            updateService: com.focusPage('#updateService', "#totalModal"),
            updateComment: com.focusPage('#updateComment', "#totalModal"),
        },

        oid: null,
        bid: null,
        house: null,

        status: {},
        atttypes: {},
        awardTypes: {},
    };

    oales.modals.oalesModal.on('hide.bs.modal', function(e) {

        com.cleanTypeahead("brandName");
        com.cleanItems(oales.items);
        com.closeTip();
    });

    com.initTypeahead("brandName", api.data.queryBrandByPinyin, "pinyinName", {}, 'brands', 'bid', 'alias', function(list, k, v) {

        $.each(list, function(index, val) {

            if (val.bid == k) {
                oales.bid = val.bid;
                oales.items.brandName.val(val.name);
            }
        });
        return v;
    });
    com.initTypeahead('service', api.personel.queryUserByPinyin, "pinyinName", {
        "user.status": 0,
        "departmentType.name": ""
    }, 'autoFillKeyValue', 'key', 'value', null);

    com.initTypeahead('updateService', api.personel.queryUserByPinyin, "pinyinName", {
        "user.status": 0,
        "departmentType.name": ""
    }, 'autoFillKeyValue', 'key', 'value', null);

    com.post(api.ds.sales, {}, function(res) {

        oales.status = res.oalesStatus.split("key", "value");
        oales.atttypes = res.oalesAtttype.split("key", "value");
        oales.awardTypes = res.oalesAwardType.split("key", "value");

        oales.items.awardType.bindData(res.oalesAwardType, "key", "value");
        oales.items.atttype.bindData(res.oalesAtttype, "key", "value");
    }, null, false);

    var searcher = new Searcher();

    searcher.base("condList", "pagenation", "resultList", api.sales.pageOales);
    searcher.condition(['sales-oales-orderId', "sales-oales-createTime", "sales-oales-status", "sales-oales-brand", "sales-oales-category"]);
    searcher.history("oalsePostData");

    searcher.button([{
        id: "addOales",
        name: "创建",
        clazz: "btn-yellow",
        icon: "icon-plus"
    }]);

    var lineprops = [{
        fieId: "orderId",
        name: "装修单号",
        prop: "decoration.orderId",
        clazz: "blue"
    }, {
        field: "village",
        name: "楼盘",
        prop: "decoration.house.village.name",
        clazz: "grey"
    }, {
        field: "houseNumber",
        name: "楼号",
        prop: "decoration.house.houseNumber",
        clazz: "grey"
    }, {
        field: "supplier",
        name: "厂商",
        prop: "supplier.currentName",
        clazz: "grey"
    }, {
        field: "creater",
        name: "创建人",
        prop: "creater.currentName",
        clazz: "grey"
    }, {
        field: "servicer",
        name: "服务管家",
        prop: "servicer.currentName",
        clazz: "grey"
    }, {
        field: "createTime",
        name: "创建时间",
        prop: "createTime",
        clazz: "green"
    }, {
        field: "brand",
        name: "品牌",
        prop: "brand",
        clazz: "grey"
    }, {
        field: "category",
        name: "品类",
        prop: "category",
        clazz: "grey"
    }, {
        field: "atttype",
        name: "类型",
        prop: "atttype",
        clazz: "red",
        dataset: oales.atttypes
    }, {
        field: "awardType",
        name: "奖励类型",
        prop: "awardType",
        clazz: "red",
        dataset: oales.awardTypes
    }, {
        field: "total",
        name: "总额",
        prop: "total",
        clazz: "blue"
    }, {
        field: "award",
        name: "奖励",
        prop: "award",
        clazz: "blue"
    }, {
        field: "profit",
        name: "利润",
        prop: "profit",
        clazz: "blue"
    }, {
        fieId: "status",
        name: "状态",
        prop: "status",
        clazz: "red",
        dataset: oales.status
    }, {
        field: "comment",
        name: "备注",
        prop: "comment",
        clazz: "grey"
    },];

    var linebtns = [{
        name: "编辑",
        clazz: "btn-success",
        handle: function(v) {

            oales.oid = v.oid;

            oales.modals.totalModal.modal("show");

            return false;
        },
        show: function(v) {
            return true;
        }
    },{
        name: "删除",
        clazz: "btn-warning",
        handle: function(v) {

            remove(v.oid);

        },
        show: function(v) {
            return true;
        }
    },

    ];

    searcher.line("no", lineprops, linebtns).render();

    com.focusPage('#addOales', '#pagenation').on("click", function() {

        oales.modals.oalesModal.modal("show");
    });

    function saveData() {

        if (com.validate('oalesModal'))
            return false;

        var bid = com.typeahead("awardStock");

        var url = api.sales.addOales;

        var options = {
            "oales.decoration.orderId": oales.items.orderId.val(),
            "oales.bid": oales.bid,
            "oales.total": oales.items.total.val(),
            "oales.comment": oales.items.comment.val(),
            "oales.atttype": oales.items.atttype.val(),
            "oales.servicer.userId": com.typeahead("service"),
        };
        com.post(url, options, function(res) {

            searcher.doSearch();
        });

        oales.modals.oalesModal.modal("hide");
    }

    function total() {

        if (com.validate('totalModal'))
            return false;

        var options = {
            "oales.oid": oales.oid,
            "oales.awardType": oales.items.awardType.val(),
            "oales.award": oales.items.award.val(),
            "oales.total": oales.items.newTotal.val(),
            "oales.profit": oales.items.profit.val(),
            "oales.servicer.userId": com.typeahead("updateService"),
            "oales.comment": oales.items.updateComment.val(),
        };

        com.post(api.sales.updateOales, options, function(res) {
            searcher.doSearch();
        });

        oales.modals.totalModal.modal("hide");
    }
    function remove(oid) {

        var options = {
            "oales.oid": oid,
        };
        com.post(api.sales.deleteOales, options, function(res) {
            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
        });

    }
});
