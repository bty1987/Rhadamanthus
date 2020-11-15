jQuery(function ($) {

    var brand = {
        saveBtn: null,
        cancelBtn: null,
        modal: null,
        brandItems: {},
        data: {
            categoryData: {},
        },

        editFlg: false,
        repeatFlg: false,

        validator: {
            brandId: {
                type: "v_brandId",
                regex: /^B_\d{3}$/g,
                errorMsg: "请以B_作为前缀 , 之后以三位数字组成(如B_001)."
            }
        },
    };

    com.focusPage('#fl-statement').statement("主材品牌", "主材品牌信息列表");

    brand.saveBtn = com.focusPage("#saveBtn").on("click", saveData);
    brand.cancelBtn = com.focusPage("#cancelBtn");
    brand.modal = com.focusPage("#brandModal");

    brand.modal.on('show.bs.modal', function (e) {
        com.clearValidator();
        com.clearValidator("#brandId", true);
        com.clearValidator("#supplier", true);
    });

    brand.modal.on('hide.bs.modal', function (e) {
        com.clearValidator();
        com.clearValidator("#brandId", true);
        com.clearValidator("#supplier", true);
        com.cleanTypeahead('supplier');
        com.closeTip();
    });

    brand.brandItems.bId = com.focusPage("#bId");
    brand.brandItems.brandId = com.focusPage("#brandId");
    brand.brandItems.brandName = com.focusPage("#brandName");
    brand.brandItems.categoryId = com.focusPage("#categoryId");
    brand.brandItems.supplier = com.focusPage("#supplier");
    brand.brandItems.kino = com.focusPage("#kino");
    brand.brandItems.kiname = com.focusPage("#kiname");

    $.extend(com.validator, brand.validator);

    com.post(api.data.queryCategory, {}, function (res) {
        com.focusPage("#categoryId").bindData(res.categorys, "cid", "name");
    });

    com.initTypeahead('supplier', api.personel.querySupplierByPinyin, "supplier.pinYin", {"user.status": 0}, "suppliers", "userId", "userName", null);

    var displayFunc = (function () {

        var renderList = function (tableId, listData) {
            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (listData && listData.length) {
                $.each(listData, function (i, v) {
                    var $liLine = creatLine(v);

                    $liLine.appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function (v) {

            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.no + ' ' + v.name));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-yellow').html('编辑');
            var $btnBalance = $('<a></a>').addClass('btn btn-minier btn-danger').html('结算');

            var propertyArr = [
                ["品类: ", v.categoryName, "grey"],
                ["金蝶编号: ", com.checkNull(v.kino, "无"), "grey"],
                ["金蝶名称: ", com.checkNull(v.kiname, "无"), "grey"],
                ["厂商: ", v.supplier.currentName, "grey"],
            ];

            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $divBtnWrap.append($btnEdit).append($btnBalance).appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            $btnEdit.click(function () {
                editBrand(v);
            });

            $btnBalance.click(function(){
                params.bid = v.bid;
                com.popup4page("#brandPopUp","/views/data/brandBalance.html","结算");
            });

            return $liLine;
        };

        return {
            init: function (tableId, listData) {
                com.focusPage('#' + tableId).html(null);
                renderList(tableId, listData);
            },
            drawLine: function (v) {
                return creatLine(v);
            }
        }
    })();

    var searcher = new Searcher();

    searcher.init(["data-brand-category", "data-brand-name"], "condList", api.data.pageBrand, function (data) {
        displayFunc.init('resultList', data);
    }, "pagenation", "brandPostData", null, false, null, function () {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'add').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    });

    com.focusPage('a[name="add"]', '#pagenation').click(function () {
        editFlg = false;

        com.cleanItems(brand.brandItems);

        brand.brandItems.brandId.val("").css("disabled", false).css("display", "none");

        brand.modal.modal("show");
    });

    function editBrand(v) {
        editFlg = true;

        brand.brandItems.bId.val(v.bid);
        brand.brandItems.brandId.val(v.no).attr("disabled", "true").css("display", "block");
        brand.brandItems.brandName.val(v.name);
        brand.brandItems.categoryId.val(v.cid);
        com.updateTypeahead("supplier", v.supplier.userId, v.supplier.currentName);
        brand.brandItems.kino.val(v.kino);
        brand.brandItems.kiname.val(v.kiname);

        brand.modal.modal("show");
    }

    function saveData() {
        if (com.validate('brandModal'))
            return false;

        var url;
        var options = {
            'brand.bid': brand.brandItems.bId.val(),
            'brand.no': brand.brandItems.brandId.val(),
            'brand.name': brand.brandItems.brandName.val(),
            'brand.cid': brand.brandItems.categoryId.val(),
            'brand.supplier.userId': com.typeahead("supplier"),
            'brand.kino': brand.brandItems.kino.val(),
            'brand.kiname': brand.brandItems.kiname.val()
        };

        if (editFlg) {
            url = api.data.updateBrand;
        } else {
            url = api.data.addBrand;
        }

        com.post(url, options, function (res) {
            searcher.doSearch();
        });

        brand.modal.modal("hide");
    }

});
