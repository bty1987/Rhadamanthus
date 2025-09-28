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
            constructionNode: com.focusPage('#constructionNode'),
            num: com.focusPage('#num')
        },

        rightitems: {
            orderId: com.focusPage('#orderId'),
            supervisorName: com.focusPage('#supervisorName'),
            orderAddr: com.focusPage('#orderAddr'),
            schedule: com.focusPage('#schedule'),
            fetchTime: com.focusPage('#fetchTime'),
            type: com.focusPage('#type'),
            comment: com.focusPage('#comment')
        },

        constructionNode: {}
    };

    com.datetime(accessories.rightitems.fetchTime, "date", false);

    accessories.rightitems.type.bindData(constant.inventory().accessories.type.datas, 'key', 'value');

    accessories.leftitems.goodsName.on("focus", function() {

        if (accessories.postData.orderId == null) {
            return false;
        }

        com.initTypeahead("goodsName", api.data.queryAoodsByName, "aoods.goods.name", {}, "aoodes", "gid", "name", function(list, k, v) {

            $.each(list, function(index, val) {

                if (val.goods.gid == k) {

                    accessories.leftitems.goodsHidden.attr('data-gid', val.goods.gid).attr('data-type', val.goods.type).attr('data-selling', val.goods.selling).attr('data-caid', val.aid).attr('data-nid', val.noods.nid).attr('data-normnum', val.normnum).attr('data-normunit', val.normunit).attr('data-storenum', val.storenum).attr('data-storeunit', val.storeunit);

                    accessories.leftitems.goodsNo.attr('data-no', val.goods.no).val(val.goods.no);
                    accessories.leftitems.category.attr('data-category', val.goods.category).val(val.goods.category);
                    accessories.leftitems.brand.attr('data-brand', val.goods.brand).val(val.goods.brand);
                    accessories.leftitems.measurementUnit.attr('data-measurementUnit', val.goods.measurementUnit).val(val.goods.measurementUnit);

                    if (val.constructionNode)
                        accessories.leftitems.constructionNode.attr('data-constructionNode', val.constructionNode.cnid).attr('data-schedule', val.constructionNode.sort).val(val.constructionNode.name);
                }
            });

            return v;
        });
    });

    com.focusPage("#add").click(function() {

        if (com.validate("left", "left")) {
            return false;
        }

        var caid = accessories.leftitems.goodsHidden.attr('data-caid');
        var gid = accessories.leftitems.goodsHidden.attr('data-gid');
        var type = accessories.leftitems.goodsHidden.attr('data-type');
        var selling = accessories.leftitems.goodsHidden.attr('data-selling');
        var nid = accessories.leftitems.goodsHidden.attr("data-nid");

        var name = accessories.leftitems.goodsName.val();
        var no = accessories.leftitems.goodsNo.val();
        var category = accessories.leftitems.category.val();
        var brand = accessories.leftitems.brand.val();
        var measurementUnit = accessories.leftitems.measurementUnit.val();
        var schedule = accessories.leftitems.constructionNode.attr("data-schedule");
        var num = accessories.leftitems.num.val();

        if (schedule && schedule != accessories.rightitems.schedule.val()) {
            com.showAlert(com.warning, "施工环节不匹配");
            return false;
        }

        var $liList = $('<li></li>').addClass('list-group-item').attr("data-gid", gid).attr("data-num", num).attr("data-selling", selling).attr('data-caid', caid);
        var $h4 = $('<h4></h4>').html(name + ' ' + no).attr('gid', gid);

        if (schedule) {
            $liList.attr("data-schedule", schedule);
        }

        if (nid) {
            $liList.attr("data-nid", nid);

            var itemcheck = false;

            com.post(api.inventory.checkAccessoriesItem, {
                "accessories.orderId": accessories.rightitems.orderId.val(),
                "accessoriesItem.nid": nid,
                "accessoriesItem.num": num
            }, function(res) {

                itemcheck = true;
            }, null, false);

            if (!itemcheck) {
                return false;
            }
        }

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
            com.showAlert(com.warning, "请添加辅料项");
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
            "accessories.type": accessories.rightitems.type.val(),
            "accessories.total": total
        };

        $list && $list.length && $.each($list, function(i, v) {

            var $v = $(v);

            options["accessoriesItems[" + i + "].goods.gid"] = $v.attr('data-gid');
            options["accessoriesItems[" + i + "].num"] = $v.attr('data-num');
            options["accessoriesItems[" + i + "].selling"] = $v.attr('data-selling');
            options["accessoriesItems[" + i + "].caid"] = $v.attr('data-caid');
            
            options["accessoriesItems[" + i + "].normnum"] = $v.attr('data-normnum');
            options["accessoriesItems[" + i + "].normunit"] = $v.attr('data-normunit');
            options["accessoriesItems[" + i + "].storenum"] = $v.attr('data-storenum');
            options["accessoriesItems[" + i + "].storeunit"] = $v.attr('data-storeunit');

            if ($v.attr('data-nid'))
                options["accessoriesItems[" + i + "].nid"] = $v.attr('data-nid');

            if ($v.attr('data-schedule'))
                options["accessoriesItems[" + i + "].schedule"] = $v.attr('data-schedule');

            options["accessoriesItems[" + i + "].total"] = utils.accMul($v.attr('data-num'), $v.attr('data-selling'));
        });

        com.post(api.inventory.addAccessories, options, function(data) {

            com.showAlert(com.info, "操作成功");

            com.cleanItems(accessories.rightitems);
            accessories.itemlist.html("");
        });
    });

});