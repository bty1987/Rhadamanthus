jQuery(function() {

    var accessories = {
        cid: null,
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
            num: com.focusPage('#num')
        },
        rightitems: {
            orderId: com.focusPage('#orderId'),
            supervisorName: com.focusPage('#supervisorName'),
            orderAddr: com.focusPage('#orderAddr'),
            schedule: com.focusPage('#schedule'),
            fetchTime: com.focusPage('#fetchTime'),
            comment: com.focusPage('#comment')
        },
        constructionNode: {}
    };

    com.datetime(accessories.rightitems.fetchTime, "date", false);

    accessories.leftitems.goodsName.on("focus", function() {

        if (accessories.postData.orderId == null) {
            return false;
        }

        com.initTypeahead("goodsName", api.data.queryAoodsByName, "aoods.goods.name", {}, "aoodes", "gid", "name", function(list, k, v) {

            $.each(list, function(index, val) {

                if (val.goods.gid == k) {

                    accessories.leftitems.goodsHidden.attr('data-gid', val.goods.gid).attr('data-type', val.goods.type).attr('data-selling', val.goods.selling).attr('data-caid', val.caid);

                    accessories.leftitems.goodsNo.attr('data-no', val.goods.no).val(val.goods.no);
                    accessories.leftitems.category.attr('data-category', val.goods.category).val(val.goods.category);
                    accessories.leftitems.brand.attr('data-brand', val.goods.brand).val(val.goods.brand);
                    accessories.leftitems.measurementUnit.attr('data-measurementUnit', val.goods.measurementUnit).val(val.goods.measurementUnit);
                }
            });

            return v;
        });
    });

    com.focusPage("#add").click(function() {

        if (com.validate("left", "left")) {
            return false;
        }

        var gid = accessories.leftitems.goodsHidden.attr('data-gid');
        var type = accessories.leftitems.goodsHidden.attr('data-type');
        var selling = accessories.leftitems.goodsHidden.attr('data-selling');

        var name = accessories.leftitems.goodsName.val();
        var no = accessories.leftitems.goodsNo.val();
        var category = accessories.leftitems.category.val();
        var brand = accessories.leftitems.brand.val();
        var measurementUnit = accessories.leftitems.measurementUnit.val();
        var num = accessories.leftitems.num.val();

        var $liList = $('<li></li>').addClass('list-group-item').attr("data-gid", gid).attr("data-num", num).attr("data-selling", selling);
        var $h4 = $('<h4></h4>').html(name + ' ' + no).attr('gid', gid);

        var $delete = $('<div></div>').addClass('pull-right action-button').append($('<a></a>').addClass('btn btn-danger btn-minier').html('删除'));
        var $query = $('<div></div>').css('margin-right', '5px').addClass('pull-right action-button').append($('<a></a>').addClass('btn btn-primary btn-minier').html('查看')).click(function() {

            com.focusPage('#viewPopUp').attr({
                'data-gid': gid
            });
            com.popup4page('#viewPopUp', "views/sales/salesItem4package.html", "查看套餐");
        });

        $h4.append($delete).appendTo($liList);

        if (type == 1) {
            $h4.append($query);
        }

        $liList.append(addSpan('品类 : ', 's_category', category, " ", 'b_category', null)).append(addSpan('品牌 : ', 's_brand', brand, " ", 'b_brand', null)).append(addSpan('单位 : ', 's_unit', measurementUnit, " ", 'b_unit', null)).append(addSpan('数量 : ', 's_number', num, 'red', 'b_number'));

        accessories.itemlist.append($liList);

        com.cleanItems(accessories.leftitems);

        $delete.click(function() {

            $(this).parents('.list-group-item').remove();
            com.focusPage('.list-group-item:last').css("border-bottom", "solid 1px");
        });
    });

    com.focusPage('#refresh').click(function() {

        com.cleanItems(accessories.leftitems);
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

    accessories.rightitems.orderId.on("change", function() {

        var orderId = accessories.rightitems.orderId.val();

        var option = {
            "decoration.orderId": orderId
        };

        com.post(api.decoration.queryDecorationForCommonByOrderId, option, function(data) {

            accessories.rightitems.supervisorName.val(data.decoration.supervisor.userId != null ? data.decoration.supervisor.currentName : "---");
            accessories.rightitems.orderAddr.val(data.decoration.house.village.name + " " + data.decoration.house.houseNumber);

            accessories.postData.orderId = data.decoration.orderId;
            accessories.postData.company = data.decoration.company;
            accessories.postData.supervisor = data.decoration.supervisor.userId;
            accessories.postData.house = data.decoration.house.hid;

        }, function(e) {

            com.showAlert(com.warning, "装修单不存在");
            com.cleanItems(accessories.rightitems);
        });

        com.post(api.construction.queryConstructionScheduleByOrderId, {
            "constructionSchedule.orderId": orderId
        }, function(res) {

            var schedules = res.constructionSchedules;

            $.each(schedules, function(i, v) {

                accessories.cid = v.cid;
                v.name = constant.data.construction.node.keys[v.cnid];
            });

            accessories.rightitems.schedule.bindData(res.constructionSchedules, "cnid", "name");
        });
    });

    com.focusPage('#submit').click(function() {

        var $list = com.focusPage('.list-group-item');

        if ($list.length == 0) {
            com.showAlert(com.warning, "请添加辅料项!");
            return false;
        }

        if (com.validate('searchInfo', 'left')) {
            return false;
        }

        var total = 0;
        $list && $list.length && $.each($list, function(i, v) {

            var $v = $(v);
            total += utils.accMul($v.attr('data-num'), $v.attr('data-selling'));
        });

        var options = {
            "accessories.orderId": accessories.postData.orderId,
            "accessories.supervisor.userId": accessories.postData.supervisor,
            "accessories.fetchTime": accessories.rightitems.fetchTime.val() + " 00:00:00",
            "accessories.cnid": accessories.rightitems.schedule.val(),
            "accessories.schedule": accessories.rightitems.schedule.val(),
            "accessories.comment": accessories.rightitems.comment.val(),
            "accessories.total": total
        };

        $list && $list.length && $.each($list, function(i, v) {

            var $v = $(v);

            options["accessoriesItems[" + i + "].goods.gid"] = $v.attr('data-gid');
            options["accessoriesItems[" + i + "].num"] = $v.attr('data-num');
            options["accessoriesItems[" + i + "].selling"] = $v.attr('data-selling');

            options["accessoriesItems[" + i + "].total"] = utils.accMul($v.attr('data-num'), $v.attr('data-selling'));
        });

        com.post(api.inventory.addAccessories, options, function(data) {

            com.showAlert(com.info, "操作成功");

            com.cleanItems(accessories.rightitems);
            accessories.itemlist.html("");
        });
    });

});