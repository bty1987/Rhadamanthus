jQuery(function($) {

    var accessory = {

        cid: params.construction.cid,
        orderId: params.construction.orderId,

        aid: null,
        caid: null,

        btns: {
            addConfirmBtn: com.focusPage("#addConfirmBtn"),
            updateBtn: com.focusPage("#updateBtn")
        },

        modals: {
            addModal: com.focusPage("#addModal"),
            updateModal: com.focusPage("#updateModal")
        },

        items: {
            checkup: com.focusPage("#checkup"),
            numLimit: com.focusPage("#numLimit"),
        },
        addItems: {
            goodsName: com.focusPage("#goodsName"),
            goodsNo: com.focusPage("#goodsNo"),
            category: com.focusPage('#category'),
            brand: com.focusPage('#brand'),
            measurementUnit: com.focusPage('#measurementUnit'),
            addCheckup: com.focusPage("#addCheckup"),
            addNumLimit: com.focusPage("#addNumLimit")
        },

        isCheckup: {},

    };

    accessory.btns.addConfirmBtn.bindClick(addAccessory);
    accessory.btns.updateBtn.bindClick(update);

    accessory.modals.addModal.on("hide.bs.modal", function() {
        com.cleanItems(accessory.addItems);
        com.clearValidator();
        com.closeTip();
    });

    accessory.modals.updateModal.on("hide.bs.modal", function() {
        com.clearValidator();
        com.closeTip();
    });

    accessory.items.checkup.bindData(constant.construction().accessory.isCheckup.datas,"key","value");
    accessory.addItems.addCheckup.bindData(constant.construction().accessory.isCheckup.datas,"key","value");

    com.initTypeahead("goodsName", api.data.queryAoodsByName, "aoods.goods.name", {
        "orderId": accessory.orderId
    }, "aoodes", "gid", "name", function(list, k, v) {

        $.each(list, function(index, val) {

            if (val.goods.gid == k) {

                accessory.aid = val.aid;

                accessory.checkup = val.checkup;

                accessory.addItems.goodsNo.val(val.goods.no);
                accessory.addItems.category.val(val.goods.category);
                accessory.addItems.brand.val(val.goods.brand);
                accessory.addItems.measurementUnit.val(val.goods.measurementUnit);
            }
        });

        return v;
    });

    var displayFunc = (function() {

        var renderList = function(tableId, listData) {
            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (listData && listData.length) {
                $.each(listData, function(i, v) {
                    var $liLine = creatLine(v);

                    $liLine.appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function(v) {
            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid')
            var $title = $('<small></small>').addClass('blue').html(' ' + v.aoods.goods.name);
            var $btnDiv = $('<div></div>').addClass('action-buttons pull-right');
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');

            var $btnUpdate = $("<a></a>").addClass("btn btn-minier btn-yellow").html("更新");

            var propertyArr = [["商品编号: ", v.aoods.goods.no, "grey"], ["品类: ", v.aoods.goods.category, "grey"], ["品牌: ", v.aoods.goods.brand, "grey"], ["单位: ", v.aoods.goods.measurementUnit, "red"], ["辅类名称: ", v.aoods.accessoriesType.name, "grey"], ["数量限制: ", v.numLimit, "blue"], ["数量: ", v.num, "blue"], ["总额: ", v.total, "blue"], ["验证标识: ", constant.construction().constructionAccessory.isCheckup.keys[v.checkup], "red"], ];

            $.each(propertyArr, function(index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $liLine.append($h3).append($ulProperty);
            $btnDiv.append($btnUpdate);
            $h3.append($title).append($btnDiv);

            $btnUpdate.click(function() {

                accessory.caid = v.caid;

                accessory.items.numLimit.val(v.numLimit);
                accessory.modals.updateModal.modal("show");
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

    searcher.init([], "condList", api.construction.pageConstructionAccessory, function(data) {
        displayFunc.init('resultList', data);
    }, "pagenation", "constructionAccessoryPostDate", {
        "constructionAccessory.cid": accessory.cid
    }, false, null, function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('id', 'addConstructionAccessory').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    }, 'resultList');

    com.focusPage("#addConstructionAccessory").click(function() {
        accessory.modals.addModal.modal("show");
    });

    function addAccessory() {
        if (com.validate('addModal')) { return false; };

        var options = {
            "constructionAccessory.cid": accessory.cid,
            "constructionAccessory.aoods.aid": accessory.aid,
            "constructionAccessory.checkup": accessory.addItems.addCheckup.val(),
            "constructionAccessory.numLimit": accessory.addItems.addNumLimit.val(),
        };

        com.post(api.construction.addConstructionAccessory, options, function(res) {
            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
        });
        accessory.modals.addModal.modal("hide");
    };

    function update() {
        if (com.validate('updateModal')) { return false; };

        var options = {
            "constructionAccessory.caid": accessory.caid,
            "constructionAccessory.checkup": accessory.items.checkup.val(),
            "constructionAccessory.numLimit": accessory.items.numLimit.val()
        };

        com.post(api.construction.updateConstructionAccessory, options, function(res) {
            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
        });
        accessory.modals.updateModal.modal("hide");
    };

})