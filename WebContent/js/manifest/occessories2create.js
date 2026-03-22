jQuery(function() {

    var occessories = {
        cid: null,
        currentItemIndex: null, // 当前编辑费用的外辅项索引
        chargesCache: {}, // 费用缓存 {itemIndex: [{name, price, num}]}
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
        balance: null,
    };

    com.initTypeahead("goodsName", api.data.queryAoodsByName, "aoods.goods.name", {}, 'aoodes', 'gid', 'name', function(list, k, v) {


        $.each(list, function(index, val) {
            if (val.gid == k) {
                occessories.leftitems.goodsHidden.attr('data-gid', val.gid).attr('data-aid', val.aid).attr('data-type', val.goods.type).attr('data-selling', val.goods.selling).attr('data-balance', val.balance);

                occessories.leftitems.goodsNo.attr('data-no', val.no).val(val.goods.no);
                occessories.leftitems.category.attr('data-category', val.category).val(val.goods.category);
                occessories.leftitems.brand.attr('data-brand', val.brand).val(val.goods.brand);
                occessories.leftitems.measurementUnit.attr('data-measurementUnit', val.measurementUnit).val(val.goods.measurementUnit);
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
        var aid = occessories.leftitems.goodsHidden.attr('data-aid');
        var type = occessories.leftitems.goodsHidden.attr('data-type');
        var selling = occessories.leftitems.goodsHidden.attr('data-selling');
        var balance = occessories.leftitems.goodsHidden.attr('data-balance');

        var name = occessories.leftitems.goodsName.val();
        var no = occessories.leftitems.goodsNo.val();
        var category = occessories.leftitems.category.val();
        var brand = occessories.leftitems.brand.val();
        var measurementUnit = occessories.leftitems.measurementUnit.val();
        var num = occessories.leftitems.num.val();

        // 获取当前外辅项索引
        var itemIndex = com.focusPage('.list-group-item').length;

        var $liList = $('<li></li>').addClass('list-group-item')
            .attr("data-gid", gid)
            .attr("data-aid", aid)
            .attr("data-num", num)
            .attr("data-selling", selling)
            .attr("data-balance", balance)
            .attr("data-index", itemIndex); // 添加索引

        var $h4 = $('<h4></h4>').html(name + ' ' + no).attr('gid', gid);

        var $delete = $('<div></div>').addClass('pull-right action-button').append($('<a></a>').addClass('btn btn-danger btn-minier').html('删除'));

        // 添加费用按钮
        var $charge = $('<div></div>').css('margin-right', '5px').addClass('pull-right action-button')
            .append($('<a></a>').addClass('btn btn-info btn-minier').html('费用'))
            .click(function() {
                openChargeModal(itemIndex);
            });

        var $query = $('<div></div>').css('margin-right', '5px').addClass('pull-right action-button')
            .append($('<a></a>').addClass('btn btn-primary btn-minier').html('查看'))
            .click(function() {
                com.focusPage('#viewPopUp').attr({
                    'data-gid': gid
                });
                com.popup4page('#viewPopUp', "views/sales/salesItem4package.html", "查看套餐")
            });

        $h4.append($delete).appendTo($liList);

        if (type == 1) {
            $h4.append($query);
        }

        // 添加费用按钮
        $h4.append($charge);

        $liList.append(addSpan('品类 : ', 's_category', category, " ", 'b_category', null))
            .append(addSpan('品牌 : ', 's_brand', brand, " ", 'b_brand', null))
            .append(addSpan('单位 : ', 's_unit', measurementUnit, " ", 'b_unit', null))
            .append(addSpan('数量 : ', 's_number', num, 'red', 'b_number'));

        occessories.itemlist.append($liList);

        com.cleanItems(occessories.leftitems);

        $delete.click(function() {
            var index = $(this).parents('.list-group-item').attr('data-index');
            // 删除费用缓存
            delete occessories.chargesCache[index];
            // 重新索引
            reindexItems();
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
            "occessories.comment": com.focusPage('#comment').val(),
        };

        $list && $list.length && $.each($list, function(i, v) {

            var $v = $(v);
            var itemIndex = $v.attr('data-index');

            options["occessoriesItems[" + i + "].goods.gid"] = $v.attr('data-gid');
            options["occessoriesItems[" + i + "].aoods.aid"] = $v.attr('data-aid');
            options["occessoriesItems[" + i + "].num"] = $v.attr('data-num');
            options["occessoriesItems[" + i + "].rbalance"] = $v.attr('data-balance');

            // 添加费用数据
            if (occessories.chargesCache[itemIndex] && occessories.chargesCache[itemIndex].length > 0) {
                $.each(occessories.chargesCache[itemIndex], function(j, charge) {
                    options["occessoriesItems[" + i + "].occessoriesCharges[" + j + "].name"] = charge.name;
                    options["occessoriesItems[" + i + "].occessoriesCharges[" + j + "].price"] = charge.price;
                    options["occessoriesItems[" + i + "].occessoriesCharges[" + j + "].num"] = charge.num;
                });
            }
        });

        com.post(api.inventory.addOccessories, options, function(data) {

            com.showAlert(com.info, "操作成功");

            // 清空费用缓存
            occessories.chargesCache = {};
            com.cleanItems(occessories.rightitems);
            occessories.itemlist.html("");
        });
    });

    // ========== 费用相关函数 ==========

    /**
     * 重新索引外辅项
     */
    function reindexItems() {
        com.focusPage('.list-group-item').each(function(index) {
            $(this).attr('data-index', index);
        });
    }

    /**
     * 打开费用弹窗
     */
    function openChargeModal(itemIndex) {
        occessories.currentItemIndex = itemIndex;

        // 清空费用列表
        com.focusPage('#chargeTableBody').html('');

        // 加载已保存的费用
        if (occessories.chargesCache[itemIndex] && occessories.chargesCache[itemIndex].length > 0) {
            $.each(occessories.chargesCache[itemIndex], function(i, charge) {
                addChargeRow(charge.name, charge.price, charge.num);
            });
        } else {
            // 从 aoodsCharge 加载费用模板，获取当前项的 aid
            var $item = com.focusPage('.list-group-item').eq(itemIndex);
            var aid = $item.attr('data-aid');
            if (aid) {
                loadAoodsChargeTemplate(aid);
            }
        }

        // 显示弹窗
        com.focusPage('#chargeModal').modal('show');
    }

    /**
     * 加载辅材费用模板
     */
    function loadAoodsChargeTemplate(aid) {
        com.post(api.data.queryAoodsChargeByAid, {"aoodsCharge.aid": aid}, function(data) {
            if (data && data.aoodsCharges && data.aoodsCharges.length > 0) {
                $.each(data.aoodsCharges, function(i, charge) {
                    addChargeRow(charge.name, charge.price, charge.num || 1);
                });
            }
        });
    }

    /**
     * 添加费用行
     */
    function addChargeRow(name, price, num) {
        var $row = $('<tr></tr>');

        // 费用名称
        var $nameTd = $('<td></td>');
        var $nameInput = $('<input type="text" class="form-control input-sm" placeholder="费用名称">').val(name);
        $nameTd.append($nameInput);
        $row.append($nameTd);

        // 价格
        var $priceTd = $('<td></td>');
        var $priceInput = $('<input type="text" class="form-control input-sm v_float_3" placeholder="0.00">').val(price);
        $priceTd.append($priceInput);
        $row.append($priceTd);

        // 数量
        var $numTd = $('<td></td>');
        var $numInput = $('<input type="text" class="form-control input-sm v_int" placeholder="1">').val(num);
        $numTd.append($numInput);
        $row.append($numTd);

        // 操作
        var $actionTd = $('<td></td>');
        var $deleteBtn = $('<button type="button" class="btn btn-xs btn-danger">删除</button>');
        $deleteBtn.click(function() {
            $(this).parents('tr').remove();
        });
        $actionTd.append($deleteBtn);
        $row.append($actionTd);

        com.focusPage('#chargeTableBody').append($row);
    }

    /**
     * 添加费用按钮点击
     */
    com.focusPage('#addChargeBtn').click(function() {
        addChargeRow('', '', 1);
    });

    /**
     * 保存费用
     */
    com.focusPage('#saveChargeBtn').click(function() {
        var charges = [];
        var hasError = false;

        com.focusPage('#chargeTableBody tr').each(function() {
            var $row = $(this);
            var name = $row.find('td:eq(0) input').val().trim();
            var price = $row.find('td:eq(1) input').val();
            var num = $row.find('td:eq(2) input').val();

            if (!name) {
                com.showAlert(com.warning, '请填写费用名称');
                hasError = true;
                return false;
            }

            if (!price) {
                com.showAlert(com.warning, '请填写价格');
                hasError = true;
                return false;
            }

            charges.push({
                name: name,
                price: price,
                num: num || 1
            });
        });

        if (hasError) {
            return false;
        }

        // 保存到缓存
        occessories.chargesCache[occessories.currentItemIndex] = charges;

        // 关闭弹窗
        com.focusPage('#chargeModal').modal('hide');
    });

});