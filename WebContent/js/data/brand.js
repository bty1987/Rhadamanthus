jQuery(function($) {

    var brand = {

        brand: null,

        saveBtn: null,
        cancelBtn: null,
        modal: null,
        btns: {
            saveBtn: com.focusPage("#saveBtn").on("click", saveData),
            saveDelivery: com.focusPage("#saveDelivery").on("click", saveDelivery),
        },

        items: {
            itemlist: com.focusPage("#itemlist", "#deliveryModal"),
            name: com.focusPage("#name", "#brandModal"),
            comment: com.focusPage("#comment", "#brandModal"),
            category: com.focusPage("#category", "#brandModal"),
            atttype: com.focusPage("#atttype", "#brandModal"),
            agentName: com.focusPage("#agentName", "#brandModal"),
            agentPhone: com.focusPage("#agentPhone", "#brandModal"),
            supplier: com.focusPage("#supplier", "#brandModal"),
            kino: com.focusPage("#kino", "#brandModal"),
            kiname: com.focusPage("#kiname", "#brandModal"),

        },

        modals: {
            brandModal: com.focusPage("#brandModal"),
            deliveryModal: com.focusPage("#deliveryModal"),
        },

        validator: {
            brandId: {
                type: "v_brandId",
                regex: /^B_\d{3}$/g,
                errorMsg: "请以B_作为前缀 , 之后以三位数字组成(如B_001)."
            }
        },
        pageType: params['urlLoadParams'].type,
    };

    com.focusPage('#fl-statement').statement("主材品牌", "主材品牌信息列表");

    brand.items.atttype.bindData(constant.data.brand.atttype.datas, 'key', 'value');

    brand.modals.brandModal.on('show.bs.modal', function(e) {

        com.clearValidator();
    });

    brand.modals.deliveryModal.on('show.bs.modal', function(e) {
        com.cleanItems(brand.items);
        com.clearValidator();
    });

    brand.modals.brandModal.on('hide.bs.modal', function(e) {

        com.clearValidator();
        com.cleanTypeahead('supplier');
        com.closeTip();
    });

    brand.modals.deliveryModal.on('hide.bs.modal', function(e) {

        com.clearValidator();
        com.focusPage("input[type='checkbox']").removeAttr("checked");
        // com.focusPage(":checked").prop("checked",false);
        com.closeTip();
    });

    com.post(api.data.queryCategory, {}, function(res) {

        brand.items.category.bindData(res.categorys, "cid", "name");
    });

    com.initTypeahead(brand.items.supplier, api.personel.querySupplierByPinyin, "supplier.pinYin", {
        "user.status": 0
    }, "suppliers", "userId", "userName", null);

    var url = api.data.pageBrand;
    var conditions = ["data-brand-name", "data-brand-category", "data-brand-atttype"];

    var searcher = new Searcher();

    searcher.base("condList", "pagenation", "resultList", url);
    searcher.condition(conditions);
    searcher.history("brandPostData");

    if (brand.pageType == "default") {
        searcher.button([{
            id: "addBrand",
            name: "添加",
            clazz: "btn-yellow",
            icon: "icon-plus"
        }]);
    }
    var lineprops = [{
        field: "categoryName",
        name: "品类",
        prop: "categoryName",
        clazz: "grey"
    }, {
        fieId: "kino",
        name: "金蝶编号",
        prop: "kino",
        clazz: "grey"
    }, {
        field: "kiname",
        name: "金蝶名称",
        prop: "kiname",
        clazz: "grey"
    }, {
        field: "supplier",
        name: "厂商",
        prop: "supplier.currentName",
        clazz: "grey"
    }, {
        fieId: "atttype",
        name: "业务类型",
        prop: "atttype",
        clazz: "red",
        dataset: constant.data().brand.atttype.keys,
    }, {
        fieId: "agentName",
        name: "代理",
        prop: "agentName",
        clazz: "grey"
    }, {
        fieId: "agentPhone",
        name: "电话",
        prop: "agentPhone",
        clazz: "grey"
    }, {
        field: "comment",
        name: "说明",
        prop: "comment",
        clazz: "grey"
    }];
    var linebtns = [{
        name: "配送状态",
        clazz: "btn-success",
        handle: function(v) {

            editDelivery(v);
        },
        show: function() {

            return (brand.pageType == "default");
        }
    }, {
        name: "编辑",
        clazz: "btn-yellow",
        handle: function(v) {

            brand.brand = v;

            brand.items.name.val(v.name);
            brand.items.comment.val(v.comment);
            brand.items.category.val(v.cid);
            brand.items.kino.val(v.kino);
            brand.items.kiname.val(v.kiname);
            brand.items.atttype.val(v.atttype);
            brand.items.agentName.val(v.agentName);
            brand.items.agentPhone.val(v.agentPhone);

            com.updateTypeahead("supplier", v.supplier.userId, v.supplier.currentName);

            brand.modals.brandModal.modal("show");

            return false;
        },
        show: function() {

            return (brand.pageType == "default");
        }
    }, {
        name: "结算",
        clazz: "btn-danger",
        handle: function(v) {

            params.data.brand = v;

            com.popup4page("#brandPopUp", "/views/data/brand4balance.html", "结算");
        },
        show: function() {

            return (brand.pageType == "default");
        }
    }, {
        name: "编辑",
        clazz: "btn-yellow",
        handle: function(v) {

            brand.brand = v;
            brand.items.name.val(v.name);
            brand.items.comment.val(v.comment);
            brand.items.category.val(v.cid);
            brand.items.kino.val(v.kino);
            brand.items.kiname.val(v.kiname);
            brand.items.agentName.val(v.agentName);
            brand.items.agentPhone.val(v.agentPhone);

            com.updateTypeahead("supplier", v.supplier.userId, v.supplier.currentName);
            com.focusPage(".default").hide();
            brand.modals.brandModal.modal("show");
            return false;
        },
        show: function(v) {

            return (brand.pageType == "comment");
        }
    }, {
        name: "厂商",
        clazz: "btn-purple",
        handle: function(v) {

            supplier(v);
        },
    }, {
        name: "驻店",
        clazz: "btn-primary",
        handle: function(v) {

            instorer(v);
        },
    }];

    searcher.line(function(v) {

        return v.no + " " + v.name;
    }, lineprops, linebtns).render();

    com.focusPage('#addBrand', '#pagenation').on("click", function() {

        brand.bid = null;
        brand.modals.brandModal.modal("show");
    });

    var contentDiv = $('<div class="col-md-12 hr8"></div>').appendTo(brand.items.itemlist);

    $.each(constant.right().salesDeliveryStatusRight.status.keys, function(i, v) {

        contentDiv.prepend(line(i, v));
    });

    function line(i, v) {

        var $div = $('<div></div>').addClass('dd-handle clearfix').text(v).appendTo(contentDiv);

        var $input = $('<input name="checkbox">').attr({
            type: 'checkbox',
            name: v,
        }).addClass('ace').val(i);

        var $indexCheck = $('<div></div>').addClass('checkbox pull-right').css({
            'margin-bottom': '0',
            'margin-top': '-5px'
        });

        var $label = $('<label></label>').append($input).append('<span class="lbl"></span>');

        $indexCheck.append($label).appendTo($div);
    }

    function editDelivery(v) {

        brand.brand = v;

        com.post(api.right.querySalesDeliveryStatusRight, {
            "salesDeliveryStatusRight.bid": brand.brand.bid
        }, function(res) {

            $.each(res.salesDeliveryStatusRights, function(i, v) {

                com.focusPage("input[type='checkbox'][value='" + v.status + "']").prop({
                    "checked": "checked"
                });
            });

        });

        brand.modals.deliveryModal.modal("show");
    }

    function saveDelivery() {

        var options = {};

        com.focusPage("input[type='checkbox']:checked").each(function(i, v) {

            var that = $(this);

            options["salesDeliveryStatusRights[" + i + "].name"] = that.attr("name");
            options["salesDeliveryStatusRights[" + i + "].bid"] = brand.brand.bid;
            options["salesDeliveryStatusRights[" + i + "].status"] = that.val();
        });

        com.post(api.right.updateSalesDeliveryStatusRight, options, function(res) {

            brand.modals.deliveryModal.modal("hide");
        });
    }
    function supplier(v) {

        params.data.brand = v;

        com.popup4page("#supplierPopUp", "/views/data/brandSupplier.html", "厂商");

    }
    function instorer(v) {

        params.data.brand = v;

        com.popup4page("#instorerPopUp", "/views/data/brandInstorer.html", "厂商");

    }
    function saveData() {

        if (com.validate('brandModal'))
            return false;

        var url = api.data.addBrand;
        var options = {
            'brand.name': brand.items.name.val(),
            'brand.comment': brand.items.comment.val(),
            'brand.cid': brand.items.category.val(),
            'brand.supplier.userId': com.typeahead("supplier"),
            'brand.kino': brand.items.kino.val(),
            'brand.kiname': brand.items.kiname.val(),
            'brand.atttype': brand.items.atttype.val(),
            'brand.agentName': brand.items.agentName.val(),
            'brand.agentPhone': brand.items.agentPhone.val()
        };

        if (brand.brand) {
            options["brand.bid"] = brand.brand.bid;

            url = api.data.updateBrand;
        }

        com.post(url, options, function(res) {

            searcher.doSearch();
        });

        brand.modals.brandModal.modal("hide");
    }
});
