jQuery(function() {

    var occessories = {
        cid: null,
        occessoriesPath: [{
            key: "0",
            value: "是"
        }, {
            key: "1",
            value: "否"
        }],
        postData: {
            orderId: null,
            supervisor: null,
            house: null,
            fetchTime: null,
        },
        itemlist: com.focusPage('#accessoriesItemList'),
        leftitems: {
            goodsHidden: com.focusPage('#goodsHidden'),
            goodsName: com.focusPage('#goodsName'),
            goodsNo: com.focusPage('#goodsNo'),
            category: com.focusPage('#category'),
            brand: com.focusPage('#brand'),
            measurementUnit: com.focusPage('#measurementUnit'),
            num: com.focusPage('#num'),
        },
        rightitems: {
            orderId: com.focusPage('#orderId'),
            supervisorName: com.focusPage('#supervisorName'),
            orderAddr: com.focusPage('#orderAddr'),
            isEnter: com.focusPage('#isEnter'),
            isLift: com.focusPage('#isLift'),
            isExceed: com.focusPage('#isExceed'),
            isAttic: com.focusPage('#isAttic'),
        },
    };

    com.initTypeahead("goodsName", api.data.queryGoodsByName, "goods.name", {}, 'goodes', 'gid', 'name', function(list, k, v) {

        $.each(list, function(index, val) {

            if (val.gid == k) {

                occessories.leftitems.goodsHidden.attr('data-gid', val.gid).attr('data-type', val.type).attr('data-selling', val.selling);

                occessories.leftitems.goodsNo.attr('data-no', val.no).val(val.no);
                occessories.leftitems.category.attr('data-category', val.category).val(val.category);
                occessories.leftitems.brand.attr('data-brand', val.brand).val(val.brand);
                occessories.leftitems.measurementUnit.attr('data-measurementUnit', val.measurementUnit).val(val.measurementUnit);
            }
        });

        return v;
    });

    com.focusPage('select[name="isEnter"]').bindData(occessories.occessoriesPath, "key", "value", false);

    com.focusPage('select[name="isLift"]').bindData(occessories.occessoriesPath, "key", "value", false);

    com.focusPage('select[name="isExceed"]').bindData(occessories.occessoriesPath, "key", "value", false);

    com.focusPage('select[name="isAttic"]').bindData(occessories.occessoriesPath, "key", "value", false);

    com.focusPage("#add").click(function() {

        if (com.validate("left", "left")) { return false; }
        var gid = occessories.leftitems.goodsHidden.attr('data-gid');
        var type = occessories.leftitems.goodsHidden.attr('data-type');
        var selling = occessories.leftitems.goodsHidden.attr('data-selling');

        var name = occessories.leftitems.goodsName.val();
        var no = occessories.leftitems.goodsNo.val();
        var category = occessories.leftitems.category.val();
        var brand = occessories.leftitems.brand.val();
        var measurementUnit = occessories.leftitems.measurementUnit.val();
        var num = occessories.leftitems.num.val();
        var $liList = $('<li></li>').addClass('list-group-item').attr("data-gid", gid).attr("data-num", num).attr("data-selling", selling);
        var $h4 = $('<h4></h4>').html(name + ' ' + no).attr('gid', gid);

        var $delete = $('<div></div>').addClass('pull-right action-button').append($('<a></a>').addClass('btn btn-danger btn-minier').html('删除'));
        var $query = $('<div></div>').css('margin-right', '5px').addClass('pull-right action-button').append($('<a></a>').addClass('btn btn-primary btn-minier').html('查看')).click(function() {

            com.focusPage('#viewPopUp').attr({
                'data-gid': gid
            });
            com.popup4page('#viewPopUp', "views/sales/salesItem4package.html", "查看套餐")
        });

        $h4.append($delete).appendTo($liList);

        if (type == 1) {
            $h4.append($query);
        }

        $liList.append(addSpan('品类 : ', 's_category', category, " ", 'b_category', null)).append(addSpan('品牌 : ', 's_brand', brand, " ", 'b_brand', null)).append(addSpan('单位 : ', 's_unit', measurementUnit, " ", 'b_unit', null)).append(addSpan('数量 : ', 's_number', num, 'red', 'b_number'));

        occessories.itemlist.append($liList);

        com.cleanItems(occessories.leftitems);

        $delete.click(function() {

            $(this).parents('.list-group-item').remove();
            com.focusPage('.list-group-item:last').css("border-bottom", "solid 1px");
        });
    });

    com.focusPage('#refresh').click(function() {

        com.cleanItems(occessories.leftitems);
    });

    function addSpan(sValue, sclass, bValue, color, attrs, addData) {

        var $span = $('<span></span>').addClass(sclass);
        var $b = $('<b></b>');

        if (sValue != null) {
            $span.html(sValue);
        }

        if (bValue != null) {
            $b.html(bValue);
        }

        if (color != null) {
            $b.addClass(color + " " + attrs).attr('addData', addData);
        }

        $span.append($b);

        return $span;
    }

    occessories.rightitems.orderId.on("change", function() {

        var orderId = occessories.rightitems.orderId.val();

        var option = {
            "decoration.orderId": orderId
        };

        com.post(api.decoration.queryDecorationForCommonByOrderId, option, function(data) {

            occessories.rightitems.supervisorName.val(data.decoration.supervisor.userId != null ? data.decoration.supervisor.currentName : "---");
            occessories.rightitems.orderAddr.val(data.decoration.house.village.name + " " + data.decoration.house.houseNumber);

            occessories.postData.orderId = data.decoration.orderId;
            occessories.postData.company = data.decoration.company;
            occessories.postData.supervisor = data.decoration.supervisor.userId;
            occessories.postData.house = data.decoration.house.hid;

        }, function(e) {

            com.showAlert(com.warning, "装修单不存在");
            com.cleanItems(occessories.rightitems)
        });
    });

    com.focusPage('#submit').click(function() {

        var $list = com.focusPage('.list-group-item');

        if ($list.length == 0) {
            com.showAlert(com.warning, "请添加外辅项!");
            return false;
        }

        if (com.validate('searchInfo', 'left')) { return false; }

        var options = {
            "occessories.decoration.orderId": occessories.postData.orderId,
            "occessories.supervisor.userId": occessories.postData.supervisor,
            "occessories.isEnter": com.focusPage('#isEnter').val(),
            "occessories.isLift": com.focusPage('#isLift').val(),
            "occessories.isExceed": com.focusPage('#isExceed').val(),
            "occessories.isAttic": com.focusPage('#isAttic').val(),
        };

        $list && $list.length && $.each($list, function(i, v) {

            var $v = $(v);

            options["occessoriesItems[" + i + "].goods.gid"] = $v.attr('data-gid');
            options["occessoriesItems[" + i + "].num"] = $v.attr('data-num');
        });

        com.post(api.inventory.addOccessories, options, function(data) {

            com.showAlert(com.info, "操作成功");

            com.cleanItems(occessories.rightitems);
            occessories.itemlist.html("");
        });
    });

});