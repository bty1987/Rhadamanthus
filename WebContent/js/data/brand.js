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
            category: com.focusPage("#category", "#brandModal"),
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
    };

    com.focusPage('#fl-statement').statement("主材品牌", "主材品牌信息列表");

    brand.modals.brandModal.on('show.bs.modal', function(e) {

        com.clearValidator();
    });

    brand.modals.deliveryModal.on('show.bs.modal', function(e) {

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

    var displayFunc = (function() {

        var renderList = function(tableId, listData) {

            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (listData && listData.length) {
                $.each(listData, function(i, v) {

                    creatLine(v).appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function(v) {

            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.no + ' ' + v.name));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnDelivery = $('<a></a>').addClass('btn btn-minier btn-yellow').html('配送状态');
            var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-yellow').html('编辑');
            var $btnBalance = $('<a></a>').addClass('btn btn-minier btn-danger').html('结算');

            var propertyArr = [];

            propertyArr.push(["品类: ", v.categoryName, "grey"]);
            propertyArr.push(["金蝶编号: ", com.checkNull(v.kino, "无"), "grey"]);
            propertyArr.push(["金蝶名称: ", com.checkNull(v.kiname, "无"), "grey"]);
            propertyArr.push(["厂商: ", v.supplier.userName, "grey"]);

            $.each(propertyArr, function(index, value) {

                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $divBtnWrap.append($btnDelivery).append($btnEdit).append($btnBalance).appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            $btnEdit.click(function() {

                editBrand(v);
            });

            $btnDelivery.click(function() {

                editDelivery(v);
            });

            $btnBalance.click(function() {

                params.data.brand = v;

                com.popup4page("#brandPopUp", "/views/data/brandBalance.html", "结算");
            });

            return $liLine;
        };

        return {
            init: function(tableId, listData) {

                com.focusPage('#' + tableId).html(null);
                renderList(tableId, listData);
            },
            drawLine: function(v) {

                return creatLine(v);
            }
        }
    })();

    var searcher = new Searcher();

    searcher.init(["data-brand-category", "data-brand-name"], "condList", api.data.pageBrand, function(data) {

        displayFunc.init('resultList', data);
    }, "pagenation", "brandPostData", null, false, null, function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'add').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    });

    com.focusPage('a[name="add"]', '#pagenation').click(function() {

        brand.brand = null;

        com.cleanItems(brand.items);

        brand.modals.brandModal.modal("show");
    });

    function editBrand(v) {

        brand.brand = v;

        brand.items.name.val(v.name);
        brand.items.category.val(v.cid);
        brand.items.kino.val(v.kino);
        brand.items.kiname.val(v.kiname);

        com.updateTypeahead("supplier", v.supplier.userId, v.supplier.currentName);

        brand.modals.brandModal.modal("show");
    }

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

    function saveData() {

        if (com.validate('brandModal'))
            return false;

        var url = api.data.addBrand;
        var options = {
            'brand.name': brand.items.name.val(),
            'brand.cid': brand.items.category.val(),
            'brand.supplier.userId': com.typeahead("supplier"),
            'brand.kino': brand.items.kino.val(),
            'brand.kiname': brand.items.kiname.val()
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

