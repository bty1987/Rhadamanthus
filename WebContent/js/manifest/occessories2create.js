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

    com.initTypeahead("goodsName", api.data.queryAoodsByName, "aoods.goods.name", {}, 'aoodes', 'aid', 'name', function(list, k, v) {


        $.each(list, function(index, val) {
            
            if (val.aid == k) {
                
                console.log(val)
                
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
                openChargeModal(aid);
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
            var aid = $(this).parents('.list-group-item').attr('data-aid');
            // 删除费用缓存（使用 aid 作为 key）
            delete occessories.chargesCache[aid];
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
            var aid = $v.attr('data-aid');

            options["occessoriesItems[" + i + "].goods.gid"] = $v.attr('data-gid');
            options["occessoriesItems[" + i + "].aoods.aid"] = aid;
            options["occessoriesItems[" + i + "].num"] = $v.attr('data-num');
            options["occessoriesItems[" + i + "].rbalance"] = $v.attr('data-balance');

            // 添加费用数据（使用 aid 作为缓存 key）
            if (occessories.chargesCache[aid] && occessories.chargesCache[aid].length > 0) {
                $.each(occessories.chargesCache[aid], function(j, charge) {
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
    function openChargeModal(aid) {
        // 保存当前 aid
        occessories.currentItemIndex = aid;

        // 清空费用列表
        com.focusPage('#chargeTableBody').html('');

        // 加载已保存的费用（优先使用缓存）
        if (occessories.chargesCache[aid] && occessories.chargesCache[aid].length > 0) {
            // 从缓存加载（用户上次填写的数量）
            $.each(occessories.chargesCache[aid], function(i, charge) {
                addChargeRow(charge.name, charge.price, charge.num);
            });
        } else {
            // 从 aoodsCharge 加载费用模板
            if (aid) {
                loadAoodsChargeTemplate(aid);
            } else {
                // 如果没有 aid，显示提示
                com.focusPage('#chargeTableBody').html('<tr><td colspan="2" class="text-center">该外辅项未关联辅材，无法加载费用模板</td></tr>');
            }
        }

        // 显示弹窗
        com.focusPage('#chargeModal').modal('show');
    }

    /**
     * 加载辅材费用模板
     */
    function loadAoodsChargeTemplate(aid) {
        com.post(api.data.queryAoodsChargeByAid, {"aoodsCharge.aoods.aid": aid}, function(data) {
            if (data && data.aoodsCharges && data.aoodsCharges.length > 0) {
                $.each(data.aoodsCharges, function(i, charge) {
                    addChargeRow(charge.name, charge.price, charge.num || 1);
                });
            } else {
                // 如果没有费用模板，显示提示
                com.focusPage('#chargeTableBody').html('<tr><td colspan="2" class="text-center">该辅材暂无费用模板</td></tr>');
            }
        });
    }

    /**
     * 添加费用行
     */
    function addChargeRow(name, price, num) {
        var $row = $('<tr></tr>');

        // 费用名称（只读）
        var $nameTd = $('<td></td>');
        $nameTd.text(name);
        $row.append($nameTd);

        // 价格（隐藏）
        var $priceInput = $('<input type="hidden" class="charge-price">').val(price);
        $row.append($priceInput);

        // 数量（可编辑）
        var $numTd = $('<td></td>');
        var $numInput = $('<input type="text" class="form-control input-sm v_int" placeholder="1">').val(num);
        $numTd.append($numInput);
        $row.append($numTd);

        com.focusPage('#chargeTableBody').append($row);
    }

    /**
     * 保存费用
     */
    com.focusPage('#saveChargeBtn').click(function() {
        var charges = [];

        com.focusPage('#chargeTableBody tr').each(function() {
            var $row = $(this);
            var name = $row.find('td:eq(0)').text().trim();
            var price = $row.find('input.charge-price').val();
            var num = $row.find('td:eq(1) input').val();

            // 只保存有名称的行（过滤提示行）
            if (name && name !== '该外辅项未关联辅材，无法加载费用模板' && name !== '该辅材暂无费用模板') {
                charges.push({
                    name: name,
                    price: price,
                    num: num || 1
                });
            }
        });

        // 保存到缓存（使用 aid 作为 key）
        occessories.chargesCache[occessories.currentItemIndex] = charges;

        // 关闭弹窗
        com.focusPage('#chargeModal').modal('hide');
    });

});