jQuery(function($) {

    var brand = {

        brand: null,

        btns: {
            saveBtn: com.focusPage("#saveBtn", "#brandModal").on("click", saveData),
            saveDelivery: com.focusPage("#saveDelivery", "#deliveryModal").on("click", saveDelivery),
            saveSelection: com.focusPage("#saveSelection", "#selectionModal").on("click", saveSelection)
        },

        items: {
            itemlist: com.focusPage("#itemlist", "#deliveryModal"),
            selectionlist: com.focusPage("#selectionlist", "#selectionModal"),
            name: com.focusPage("#name", "#brandModal"),
            comment: com.focusPage("#comment", "#brandModal"),
            category: com.focusPage("#category", "#brandModal"),
            atttype: com.focusPage("#atttype", "#brandModal"),
            numtype: com.focusPage("#numtype", "#brandModal"),
            agentName: com.focusPage("#agentName", "#brandModal"),
            agentPhone: com.focusPage("#agentPhone", "#brandModal"),
            supplier: com.focusPage("#supplier", "#brandModal"),
            kino: com.focusPage("#kino", "#brandModal"),
            kiname: com.focusPage("#kiname", "#brandModal")
        },

        modals: {
            brandModal: com.focusPage("#brandModal"),
            deliveryModal: com.focusPage("#deliveryModal"),
            selectionModal: com.focusPage("#selectionModal")
        },

        validator: {
            brandId: {
                type: "v_brandId",
                regex: /^B_\d{3}$/g,
                errorMsg: "请以B_作为前缀 , 之后以三位数字组成(如B_001)."
            }
        },
        pageType: params['urlLoadParams'].type
    };

    com.focusPage('#fl-statement').statement("主材品牌", "主材品牌信息列表");

    brand.items.atttype.bindData(constant.data.brand.atttype.datas, 'key', 'value');
    brand.items.numtype.bindData(constant.data.brand.numtype.datas, 'key', 'value');

    brand.modals.brandModal.on('show.bs.modal', function(e) {

        com.clearValidator();
    });

    brand.modals.deliveryModal.on('show.bs.modal', function(e) {

        com.cleanItems(brand.items);
        com.clearValidator();
    });

    brand.modals.selectionModal.on('show.bs.modal', function(e) {

        com.cleanItems(brand.items);
        com.clearValidator();
    });

    brand.modals.brandModal.on('hide.bs.modal', function(e) {

        com.clearValidator();
        com.cleanTypeahead('supplier');
        com.closeTip();
        com.cleanItems(brand.items)
    });

    brand.modals.deliveryModal.on('hide.bs.modal', function(e) {

        com.clearValidator();
        com.focusPage("input[type='checkbox']", "#deliveryModal").removeAttr("checked");
        com.closeTip();
    });

    brand.modals.selectionModal.on('hide.bs.modal', function(e) {

        com.clearValidator();
        com.closeTip();
    });

    com.post(api.data.queryCategory, {}, function(res) {

        brand.items.category.bindData(res.categorys, "cid", "name");
    });

    com.initTypeahead(brand.items.supplier, api.personel.querySupplierByPinyin, "supplier.pinYin", {
        "user.status": 0
    }, "suppliers", "userId", "userName", null);

    var searcher = new Searcher();

    searcher.base("condList", "pagenation", "resultList", api.data.pageBrand);
    searcher.condition(["data-brand-name", "data-brand-category", "data-brand-atttype"]);
    searcher.history("brandPostData");

    if (brand.pageType == "default" || brand.pageType == "finance") {
        searcher.button([{
            id: "addBrand",
            name: "添加",
            clazz: "btn-yellow",
            icon: "icon-plus"
        }]);
    }
    var lineprops = [{
        field: "bid",
        name: "ID",
        prop: "bid",
        clazz: "grey"
    }, {
        field: "categoryName",
        name: "品类",
        prop: "categoryName",
        clazz: "grey"
    }, {
        fieId: "kino",
        name: "金蝶编号",
        prop: "kino",
        clazz: "grey",
        show: function(v) {

            return brand.pageType == "finance";
        }
    }, {
        field: "kiname",
        name: "金蝶名称",
        prop: "kiname",
        clazz: "grey",
        show: function(v) {

            return brand.pageType == "finance";
        }
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
        dataset: constant.data().brand.atttype.keys
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
        fieId: "status",
        name: "状态",
        prop: "status",
        clazz: "red",
        dataset: constant.data().common.status.keys
    }, {
        fieId: "numtype",
        name: "选材量类型",
        prop: "numtype",
        clazz: "red",
        dataset: constant.data().brand.numtype.keys
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

            editDelivery(v, false);
        },
        show: function() {

            return true;
        }
    }, {
        name: "配送状态",
        clazz: "btn-success",
        handle: function(v) {

            editDelivery(v, true);
        },
        show: function() {

            return false;
        }
    }, {
        name: "选材状态 ",
        clazz: "btn-blue",
        handle: function(v) {

            editItem(v);
        },
        show: function() {

            return (brand.pageType == "default" || brand.pageType == "finance");
        }
    }, {
        name: "编辑",
        clazz: "btn-info",
        handle: function(v) {

            brand.brand = v;

            brand.items.name.val(v.name);
            brand.items.category.val(v.cid);
            brand.items.kino.val(v.kino);
            brand.items.kiname.val(v.kiname);
            brand.items.atttype.val(v.atttype);
            brand.items.numtype.val(v.numtype);
            brand.items.agentName.val(v.agentName);
            brand.items.agentPhone.val(v.agentPhone);
            brand.items.comment.val(v.comment);

            com.updateTypeahead("supplier", v.supplier.userId, v.supplier.currentName);

            if (brand.pageType == "finance") {
                com.focusPage(".finance", "#brandModal").removeClass("hide");
            }

            brand.modals.brandModal.modal("show");

            return false;
        },
        show: function() {

            return (brand.pageType == "default" || brand.pageType == "finance");
        }
    }, {
        name: "生产",
        clazz: "btn-yellow",
        handle: function(v) {

            params.data.brand = v;

            com.popup4page("#brandProductPopUp", "/views/data/brandProduct.html", "生产");
        }
    }, {
        name: "交付",
        clazz: "btn-warning",
        handle: function(v) {

            params.data.brand = v;

            com.popup4page("#brandDeliverPopUp", "/views/data/brandDeliver.html", "交付");
        }
    }, {
        name: "安装",
        clazz: "btn-inverse",
        handle: function(v) {

            params.data.brand = v;

            com.popup4page("#brandInstallPopUp", "/views/data/brandInstall.html", "安装");
        }
    }, {
        name: "服务",
        clazz: "btn-danger",
        handle: function(v) {

            params.data.brand = v;

            com.popup4page("#brandServerPopUp", "/views/data/brandServer.html", "服务");
        }
    }, {
        name: "结算",
        clazz: "btn-yellow",
        handle: function(v) {

            params.data.brand = v;

            com.popup4page("#brandPopUp", "/views/data/brand4balance.html", "结算");
        },
        show: function() {

            return (brand.pageType == "default" || brand.pageType == "finance");
        }
    }, {
        name: "编辑",
        clazz: "btn-blue",
        handle: function(v) {

            brand.brand = v;
            brand.items.name.val(v.name);
            brand.items.category.val(v.cid);
            brand.items.kino.val(v.kino);
            brand.items.kiname.val(v.kiname);
            brand.items.agentName.val(v.agentName);
            brand.items.agentPhone.val(v.agentPhone);
            brand.items.comment.val(v.comment);

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
        }
    }, {
        name: "驻店",
        clazz: "btn-primary",
        handle: function(v) {

            instorer(v);
        }
    }, {
        name: "回尺指标",
        clazz: "btn-pink",
        handle: function(v) {

            params.remeasureFormatBid = v.bid;

            com.popup4page("#remeasureformatPopUp", "/views/data/remeasureFormat.html", "回尺指标");
        }
    }, {
        name: "状态",
        type: "switch",
        clazz: "status-lbl",
        handle: function(v, check) {

            com.post(api.data.updateBrandForStatus, {
                "brand.bid": v.bid,
                "brand.status": check ? 0 : 1
            });

            return false;
        },
        init: function(v) {

            return !v.status;
        },
        show: function(v) {

            return brand.pageType == "finance";
        }
    }];

    searcher.line(function(v) {

        return v.no + " " + v.name;
    }, lineprops, linebtns).render();

    com.focusPage('#addBrand', '#pagenation').on("click", function() {

        brand.bid = null;

        if (brand.pageType == "finance") {
            com.focusPage(".finance", "#brandModal").removeClass("hide");
        }

        brand.modals.brandModal.modal("show");
    });

    var contentDiv = $('<div class="col-md-12 hr8"></div>').appendTo(brand.items.itemlist);
    var selectionDiv = $('<div class="col-md-12 hr8"></div>').appendTo(brand.items.selectionlist);

    $.each(constant.right().salesDeliveryStatusRight.status.keys, function(i, v) {

        contentDiv.prepend(line(i, v));
    });

    $.each(constant.right().selectionItemStatusRight.status.keys, function(i, v) {

        selectionDiv.prepend(line1(i, v));
    });

    function line(i, v) {

        var $div = $('<div></div>').addClass('dd-handle clearfix deviveryItem').appendTo(contentDiv);

        var $span = $('<span></span>').addClass('col-md-2').text(v);

        var $crateDiv = $('<div></div>').addClass('ace-spinner pull-right');
        var $crateInput = $('<input name="crate">').attr({
            type: 'text',
            name: i
        }).addClass('ace input-mini spinner-input form-control').val(0).appendTo($crateDiv);

        var $checkInput = $('<input name="checkbox">').attr({
            type: 'checkbox',
            name: i,
        }).css("margin-left", "0px").prop("checked", null).addClass('ace');
        var $checkDiv = $('<div></div>').addClass('col-md-1 pull-right1 deliveryStatus').append($checkInput).append($('<span class="lbl"></span>'));

        var $groupDiv = $('<div></div>').addClass('checkbox pull-right1').css({
            'margin-bottom': '0',
            'margin-top': '-5px'
        });

        $groupDiv.append($checkDiv).append($span).append($crateDiv).appendTo($div);
    }

    function line1(i, v) {

        var $div = $('<div></div>').addClass('dd-handle clearfix').text(v).appendTo(selectionDiv);

        var $input = $('<input name="checkbox">').attr({
            type: 'checkbox',
            name: v
        }).addClass('ace').val(i);

        var $indexCheck = $('<div></div>').addClass('checkbox pull-right').css({
            'margin-bottom': '0',
            'margin-top': '-5px'
        });

        var $label = $('<label></label>').append($input).append('<span class="lbl"></span>');

        $indexCheck.append($label).appendTo($div);
    }

    function editDelivery(v, flag) {

        brand.brand = v;
        
        com.focusPage("input[type='checkbox']", "#deliveryModal").prop("checked", null);
        com.focusPage("input[type='text']", "#deliveryModal").val(0);
        
        if(flag){
            com.focusPage("div.deliveryStatus", "#deliveryModal").show();
        }else{
            com.focusPage("div.deliveryStatus", "#deliveryModal").hide();
        }

        com.post(api.right.querySalesDeliveryStatusRight, {
            "salesDeliveryStatusRight.bid": brand.brand.bid
        }, function(res) {

            $.each(res.salesDeliveryStatusRights, function(i, v) {
                
                if (v.checked == 0)
                    com.focusPage("input[type='checkbox'][name='" + v.status + "']", "#deliveryModal").prop({
                        "checked": "checked"
                    });

                com.focusPage("input[type='text'][name='" + v.status + "']", "#deliveryModal").val(v.crate ? v.crate : 0);
            });
        });

        brand.modals.deliveryModal.modal("show");
    }

    function editItem(v) {

        brand.brand = v;
        
        com.focusPage("input[type='checkbox']", "#selectionModal").prop("checked", null);

        com.post(api.right.querySelectionItemStatusRight, {
            "selectionItemStatusRight.bid": brand.brand.bid
        }, function(res) {

            $.each(res.selectionItemStatusRights, function(i, v) {

                com.focusPage("input[type='checkbox'][value='" + v.status + "']", "#selectionModal").prop({
                    "checked": "checked"
                });
            });
        });

        brand.modals.selectionModal.modal("show");
    }

    function saveDelivery() {

        var options = {
            "salesDeliveryStatusRight.bid": brand.brand.bid
        };

        var items = com.focusPage(".deviveryItem", "#deliveryModal");

        items.each(function(i, e) {

            var item = $(e);

            var status = item.find("input[type='checkbox']");
            var create = item.find("input[type='text']");
            
            options["salesDeliveryStatusRights[" + i + "].name"] = item.find("span").text();
            options["salesDeliveryStatusRights[" + i + "].bid"] = brand.brand.bid;

            options["salesDeliveryStatusRights[" + i + "].status"] = status.attr("name");
            options["salesDeliveryStatusRights[" + i + "].checked"] = status.prop("checked") ? 0 : 1;
            options["salesDeliveryStatusRights[" + i + "].crate"] = create.val();
        });

        com.post(api.right.updateSalesDeliveryStatusRight, options, function(res) {

            brand.modals.deliveryModal.modal("hide");
        });
    }

    function saveSelection() {

        var options = {
            "selectionItemStatusRight.bid": brand.brand.bid
        };

        com.focusPage("input[type='checkbox']:checked", "#selectionModal").each(function(i, v) {

            var that = $(this);

            options["selectionItemStatusRights[" + i + "].name"] = that.attr("name");
            options["selectionItemStatusRights[" + i + "].bid"] = brand.brand.bid;
            options["selectionItemStatusRights[" + i + "].status"] = that.val();
        });

        com.post(api.right.updateSelectionItemStatusRight, options, function(res) {

            brand.modals.selectionModal.modal("hide");
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
            'brand.numtype': brand.items.numtype.val(),
            'brand.agentName': brand.items.agentName.val(),
            'brand.agentPhone': brand.items.agentPhone.val()
        };

        if (brand.brand) {
            options["brand.bid"] = brand.brand.bid;

            url = api.data.updateBrand;
        }

        com.post(url, options, function(res) {

            searcher.doSearch();

            var no = res.brand.no;

            if (brand.brand)
                no = brand.brand.no;

            var brandData = {
                "no": no,
                "name": brand.items.name.val(),
                "companyName": "方林集团",
                "categoryId": brand.items.category.val()
            };

            kingdeeUtils.brand(brandData);
        });

        brand.modals.brandModal.modal("hide");
    }
});
