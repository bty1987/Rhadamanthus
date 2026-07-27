jQuery(function($) {

    var decorationMatching = {

        dmid: null,

        btns: {
            addBtn: com.focusPage("#addBtn"),
            saveBtn: com.focusPage("#saveBtn")
        },

        modals: {
            decorationMatchingModal: com.focusPage("#decorationMatchingModal")
        },

        items: {
            name: com.focusPage("#name"),
            typeness: com.focusPage("#typeness"),
            base: com.focusPage("#base"),
            discount: com.focusPage("#discount"),
            material: com.focusPage("#material"),
            service: com.focusPage("#service"),
            vision: com.focusPage("#vision"),
            trafficDiscount: com.focusPage("#trafficDiscount"),
            manageDiscount: com.focusPage("#manageDiscount"),
            taxDiscount: com.focusPage("input[name=taxDiscount]"),
            noTaxDiscount: com.focusPage("#noTaxDiscount"),
            manageTaxDiscount: com.focusPage("#manageTaxDiscount"),
            totalTaxDiscount: com.focusPage("#totalTaxDiscount"),
            isShow: com.focusPage("#isShow"),
            comment: com.focusPage("#comment")
        },

        type: {},
        typeness: [],

        visionData: {},
        decorationMatchingVision: {},

        discount: ["不打折", "打折"],

    };

    decorationMatching.decorationMatchingVision = constant.data().decorationMatching.vision.keys;
    decorationMatching.visionData = constant.data().decorationMatching.vision.datas;

    com.post(api.data.queryDecorationAtttype, {}, function(res) {

        $.each(res.decorationAtttypes, function(i, v) {

            if (v.status == constant.data().common.status.STATUS_ENABLE_INT) {
                decorationMatching.type[v.key] = v.type;
                decorationMatching.typeness.push(v);
            }
        });
        decorationMatching.items.typeness.bindData(decorationMatching.typeness, 'key', 'name', "请选择");
    });

    decorationMatching.btns.saveBtn.bindClick(saveData);

    var seacher = new Searcher();

    seacher.base("condList", "pagenation", "resultList", api.data.pageDecorationMatching);
    seacher.condition(["data-decoration-matching-name", "data-decoration-matching-type", "data-decoration-matching-typeness", "data-decoration-matching-isShow"]);
    seacher.button([{
        id: "addDecorationMatchingBtn",
        name: "添加",
        clazz: "btn-yellow",
        icon: "icon-plus"
    }]);

    seacher.history("decorationMatchingPostData");

    var lineprops = [{
        field: "typeness",
        name: "类型",
        prop: "typeness",
        clazz: "red",
        dataset: constant.decoration().decoration.typeness.keys
    }, {
        field: "base",
        name: "基数",
        prop: "base",
        clazz: "blue",
    }, {
        field: "discount",
        name: "折扣",
        prop: "discount",
        clazz: "blue",
    }, {
        field: "discountType",
        name: "折扣类型",
        prop: "discountType",
        clazz: "red",
        dataset: constant.data().decorationMatching.discountType.keys
    }, {
        field: "material",
        name: "主材配比",
        prop: "material",
        clazz: "blue",
    }, {
        field: "service",
        name: "服务配比",
        prop: "service",
        clazz: "blue",
    }, {
        field: "vision",
        name: "显示位置",
        prop: function(v) {

            var vision = "";

            vision += (v.vision & 1) == 1 ? decorationMatching.decorationMatchingVision[1] + "/" : "";
            vision += (v.vision & 2) == 2 ? decorationMatching.decorationMatchingVision[2] + "/" : "";
            vision += (v.vision & 4) == 4 ? decorationMatching.decorationMatchingVision[4] + "/" : "";
            vision += (v.vision & 8) == 8 ? decorationMatching.decorationMatchingVision[8] + "/" : "";

            return vision.substring(0, vision.length - 1);
        },
        clazz: "grey",
    }, {
        field: "isShow",
        name: "默认显示",
        prop: "isShow",
        clazz: "red",
        dataset: constant.data().decorationMatching.isShow.keys
    }, {
        field: "trafficDiscount",
        name: "车运费折扣",
        prop: "trafficDiscount",
        clazz: "red",
        dataset: decorationMatching.discount
    }, {
        field: "manageDiscount",
        name: "管理费折扣",
        prop: "manageDiscount",
        clazz: "red",
        dataset: decorationMatching.discount
    }, {
        field: "taxDiscount",
        name: "税金折扣",
        prop: "taxDiscount",
        clazz: "red",
        dataset: constant.data().quotationVersion.taxDiscount.keys
    }, {
        type: "newline",
    }, {
        field: "comment",
        name: "说明",
        prop: "comment",
        clazz: "grey",
    }, ];

    var linebtus = [{
        name: "编辑",
        clazz: "btn-yellow",
        handle: function(v) {

            updateData(v);

            return false;
        }
    }, ];

    seacher.line("name", lineprops, linebtus).render();

    com.focusPage('#addDecorationMatchingBtn', '#pagenation').on("click", function() {

        com.cleanItems(decorationMatching.items);

        decorationMatching.dmid = null;
        decorationMatching.visionKey = [];

        visionData(decorationMatching.visionData, 0);

        decorationMatching.modals.decorationMatchingModal.modal("show");
    });

    function updateData(v) {

        decorationMatching.dmid = v.dmid;

        visionData(decorationMatching.visionData, v.vision);

        decorationMatching.items.isShow.prop('checked', com.isOrNotType[v.isShow == 0 ? "是" : "否"]);
        decorationMatching.items.trafficDiscount.prop('checked', com.isOrNotType[v.trafficDiscount == 0 ? "否" : "是"]);
        decorationMatching.items.manageDiscount.prop('checked', com.isOrNotType[v.manageDiscount == 0 ? "否" : "是"]);

        decorationMatching.items.noTaxDiscount.prop("checked", v.taxDiscount == constant.data().quotationVersion.TAX_NOTTAXDISCOUNT_INT);
        decorationMatching.items.manageTaxDiscount.prop("checked", v.taxDiscount == constant.data().quotationVersion.TAX_NODISCOUNT_INT);
        decorationMatching.items.totalTaxDiscount.prop("checked", v.taxDiscount == constant.data().quotationVersion.TAX_DISCOUNT_INT);

        com.focusPage('input[name="discountType"][value="' + v.discountType + '"]', '#decorationMatchingModal').prop("checked", true);

        decorationMatching.items.dmid = v.dmid;
        decorationMatching.items.name.val(v.name);
        decorationMatching.items.typeness.val(v.typeness);
        decorationMatching.items.base.val(v.base);
        decorationMatching.items.discount.val(v.discount);
        decorationMatching.items.material.val(v.material);
        decorationMatching.items.service.val(v.service);
        decorationMatching.items.comment.val(v.comment);

        decorationMatching.modals.decorationMatchingModal.modal("show");
    }

    function visionData(data, vision) {

        decorationMatching.items.vision.empty();

        $.each(data, function(i, v) {

            var $div = $('<div></div>').addClass('col-sm-6').attr("name", "function");
            var $label = $('<label></label>');
            var $input = $('<input>').attr({
                "type": "checkbox",
                "name": "visionKey",
                "class": "ace"
            }).val(v.key);
            var $span = $('<span></span>').addClass('lbl blue').text(v.value);

            $label.append($input).append($span).appendTo($div);

            $div.appendTo(decorationMatching.items.vision);

            if ((v.key & vision) == v.key) {
                $input.attr("checked", true);
            }

        });
    }

    function saveData() {

        if (com.validate("decorationMatchingForm"))
            return false;

        var $inputs = com.focusPage('input[name="visionKey"]:checked');

        var url, options;
        decorationMatching.number = 0;

        $.each($inputs, function(i, v) {

            decorationMatching.number = decorationMatching.number + parseInt($(v).val());
        });

        url = api.data.addDecorationMatching;
        options = {
            "decorationMatching.name": decorationMatching.items.name.val(),
            "decorationMatching.type": decorationMatching.type[decorationMatching.items.typeness.val()],
            "decorationMatching.typeness": decorationMatching.items.typeness.val(),
            "decorationMatching.base": decorationMatching.items.base.val(),
            "decorationMatching.discount": decorationMatching.items.discount.val(),
            "decorationMatching.discountType": com.focusPage('input[name="discountType"]:checked', '#decorationMatchingModal').val(),
            "decorationMatching.material": decorationMatching.items.material.val(),
            "decorationMatching.service": decorationMatching.items.service.val(),
            "decorationMatching.vision": decorationMatching.number,
            "decorationMatching.comment": decorationMatching.items.comment.val(),
            "decorationMatching.isShow": decorationMatching.items.isShow.prop("checked") ? 0 : 1,
            "decorationMatching.trafficDiscount": decorationMatching.items.trafficDiscount.prop("checked") ? 1 : 0,
            "decorationMatching.manageDiscount": decorationMatching.items.manageDiscount.prop("checked") ? 1 : 0,
            "decorationMatching.taxDiscount": decorationMatching.items.noTaxDiscount.prop("checked") ? constant.data().quotationVersion.TAX_NOTTAXDISCOUNT_INT : decorationMatching.items.manageTaxDiscount.prop("checked") ? constant.data().quotationVersion.TAX_NODISCOUNT_INT : constant.data().quotationVersion.TAX_DISCOUNT_INT
        };

        if (decorationMatching.dmid) {
            url = api.data.updateDecorationMatching;
            options["decorationMatching.dmid"] = decorationMatching.dmid;
        }

        com.post(url, options, function(res) {

            seacher.doSearch();

            decorationMatching.modals.decorationMatchingModal.modal("hide");
        });

    }

});