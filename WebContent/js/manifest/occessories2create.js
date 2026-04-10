jQuery(function() {

    var occessories = {
        cid: null,
        currentItemIndex: null, // 当前编辑费用的外辅项索引
        chargesCache: {}, // 费用缓存 {orderId_aid_uniqueId: [{name, price, num}]}
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
            normoodAmount: com.focusPage('#normoodAmount'),
            occessoriesAmount: com.focusPage('#occessoriesAmount'),
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

                // 验证 orderId 是否已填写
                var orderId = occessories.rightitems.orderId.val();
                if (!orderId || orderId.trim() === '') {
                    com.showAlert(com.warning, "请先填写装修单号！");
                    occessories.leftitems.goodsName.val('');
                    occessories.leftitems.goodsHidden.removeAttr('data-gid data-aid data-type data-selling data-balance data-nid');
                    occessories.leftitems.goodsNo.val('');
                    occessories.leftitems.category.val('');
                    occessories.leftitems.brand.val('');
                    occessories.leftitems.measurementUnit.val('');
                    occessories.leftitems.normoodAmount.val('0');
                    occessories.leftitems.occessoriesAmount.val('0');
                    return false;
                }

                // 保存辅材信息
                occessories.leftitems.goodsHidden.attr('data-gid', val.gid).attr('data-aid', val.aid).attr('data-type', val.goods.type).attr('data-selling', val.goods.selling).attr('data-balance', val.balance).attr('data-nid', val.noods && val.noods.nid || '');

                occessories.leftitems.goodsNo.attr('data-no', val.no).val(val.goods.no);
                occessories.leftitems.category.attr('data-category', val.category).val(val.goods.category);
                occessories.leftitems.brand.attr('data-brand', val.brand).val(val.goods.brand);
                occessories.leftitems.measurementUnit.attr('data-measurementUnit', val.measurementUnit).val(val.goods.measurementUnit);

                // 如果有 nid，查询定额和外辅数量
                if (val.noods && val.noods.nid) {
                    queryAmounts(orderId, val.noods.nid);
                } else {
                    occessories.leftitems.normoodAmount.val('0');
                    occessories.leftitems.occessoriesAmount.val('0');
                }
            }
        });

        return v;
    });

    // 使用反序数据，使"否"成为默认选项
    var occessoriesPathReverse = occessories.occessoriesPath.slice().reverse();
    com.focusPage('select[name="isEnter"]').bindData(occessories.occessoriesPath, "key", "value", false);
    com.focusPage('select[name="isLift"]').bindData(occessories.occessoriesPath, "key", "value", false);
    com.focusPage('select[name="isExceed"]').bindData(occessoriesPathReverse, "key", "value", false);
    com.focusPage('select[name="isAttic"]').bindData(occessoriesPathReverse, "key", "value", false);

    com.focusPage("#add").click(function() {

        if (com.validate("left", "left")) {
            return false;
        }
        var gid = occessories.leftitems.goodsHidden.attr('data-gid');
        var aid = occessories.leftitems.goodsHidden.attr('data-aid');
        var nid = occessories.leftitems.goodsHidden.attr('data-nid');
        var type = occessories.leftitems.goodsHidden.attr('data-type');
        var selling = occessories.leftitems.goodsHidden.attr('data-selling');
        var balance = occessories.leftitems.goodsHidden.attr('data-balance');

        var name = occessories.leftitems.goodsName.val();
        var no = occessories.leftitems.goodsNo.val();
        var category = occessories.leftitems.category.val();
        var brand = occessories.leftitems.brand.val();
        var measurementUnit = occessories.leftitems.measurementUnit.val();
        var num = occessories.leftitems.num.val();

        // 生成唯一ID（时间戳 + 随机数）
        var uniqueId = Date.now() + '_' + Math.floor(Math.random() * 10000);

        var $liList = $('<li></li>').addClass('list-group-item').attr("data-gid", gid).attr("data-aid", aid).attr("data-nid", nid || '').attr("data-num", num).attr("data-selling", selling).attr("data-balance", balance).attr("data-unique-id", uniqueId); // 添加唯一ID

        var $h4 = $('<h4></h4>').html(name + ' ' + no).attr('gid', gid);

        var $delete = $('<div></div>').addClass('pull-right action-button').append($('<a></a>').addClass('btn btn-danger btn-minier').html('删除'));

        // 添加费用按钮
        var $charge = $('<div></div>').css('margin-right', '5px').addClass('pull-right action-button').append($('<a></a>').addClass('btn btn-info btn-minier').html('费用')).click(function() {

            openChargeModal(aid, uniqueId);
        });

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

        // 添加费用按钮
        $h4.append($charge);

        $liList.append(addSpan('品类 : ', 's_category', category, " ", 'b_category', null)).append(addSpan('品牌 : ', 's_brand', brand, " ", 'b_brand', null)).append(addSpan('单位 : ', 's_unit', measurementUnit, " ", 'b_unit', null)).append(addSpan('数量 : ', 's_number', num, 'red', 'b_number'));

        occessories.itemlist.append($liList);

        com.cleanItems(occessories.leftitems);

        $delete.click(function() {

            var aid = $(this).parents('.list-group-item').attr('data-aid');
            var uniqueId = $(this).parents('.list-group-item').attr('data-unique-id');
            var orderId = occessories.postData.orderId; // 获取当前 orderId
            var cacheKey = orderId + '_' + aid + '_' + uniqueId; // 组合 key
            // 删除费用缓存（使用 orderId_aid_uniqueId 作为 key）
            delete occessories.chargesCache[cacheKey];
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

        if (com.validate('searchInfo', 'left')) {
            return false;
        }

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
            var nid = $v.attr('data-nid');
            var uniqueId = $v.attr('data-unique-id');
            var cacheKey = occessories.postData.orderId + '_' + aid + '_' + uniqueId; // 组合 key

            options["occessoriesItems[" + i + "].goods.gid"] = $v.attr('data-gid');
            options["occessoriesItems[" + i + "].aoods.aid"] = aid;
            options["occessoriesItems[" + i + "].nid"] = nid || '';
            options["occessoriesItems[" + i + "].num"] = $v.attr('data-num');

            // item 保持单价逻辑，后台会根据 num * rbalance 计算总额
            options["occessoriesItems[" + i + "].rbalance"] = $v.attr('data-balance');

            // 添加费用数据（使用 orderId_aid_uniqueId 作为缓存 key）
            if (occessories.chargesCache[cacheKey] && occessories.chargesCache[cacheKey].length > 0) {
                $.each(occessories.chargesCache[cacheKey], function(j, charge) {

                    options["occessoriesItems[" + i + "].occessoriesCharges[" + j + "].name"] = charge.name;
                    options["occessoriesItems[" + i + "].occessoriesCharges[" + j + "].price"] = charge.price;
                    options["occessoriesItems[" + i + "].occessoriesCharges[" + j + "].surplus"] = charge.surplus;
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
     * 查询定额和外辅数量
     */
    function queryAmounts(orderId, nid) {

        // 先重置数量显示
        occessories.leftitems.normoodAmount.val('0');
        occessories.leftitems.occessoriesAmount.val('0');
        occessories.leftitems.num.val('');

        // 1. 查询报价单获取 qid
        com.post(api.quotation.queryQuotationForDefaultByOrderId, {
            "quotation.orderId": orderId
        }, function(data) {

            if (data && data.quotation && data.quotation.qid) {
                var qid = data.quotation.qid;
                var normAmount = 0;
                var accAmount = 0;
                var queryCount = 0;

                // 2. 查询定额材料数量
                com.post(api.quotation.amountNormoodItem, {
                    "normoodItem.qid": qid,
                    "normoodItem.noods.nid": nid
                }, function(result) {

                    console.log('定额数量查询结果:', result);

                    occessories.leftitems.normoodAmount.val(parseInt(result.normoodItem.amount) || 0);
                });

                // 3. 查询外辅材料数量
                com.post(api.inventory.amountOccessoriesItem, {
                    "occessories.decoration.orderId": orderId,
                    "occessoriesItem.nid": nid
                }, function(result) {

                    console.log('外辅数量查询结果:', result);
                    occessories.leftitems.occessoriesAmount.val(parseInt(result.occessories.amount) || 0);
                });

            } else {
                // 没有找到报价单，数量都为 0
                occessories.leftitems.normoodAmount.val('0');
                occessories.leftitems.occessoriesAmount.val('0');
            }
        }, function() {

            // 查询报价单失败，数量都为 0
            occessories.leftitems.normoodAmount.val('0');
            occessories.leftitems.occessoriesAmount.val('0');
        });
    }

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
    function openChargeModal(aid, uniqueId) {

        var orderId = occessories.postData.orderId; // 获取当前 orderId
        var cacheKey = orderId + '_' + aid + '_' + uniqueId; // 组合 key

        // 保存当前组合 key
        occessories.currentItemIndex = cacheKey;

        // 清空费用列表
        com.focusPage('#chargeTableBody').html('');

        // 加载已保存的费用（优先使用缓存）
        if (occessories.chargesCache[cacheKey] && occessories.chargesCache[cacheKey].length > 0) {
            // 从缓存加载（用户上次填写的数量）
            $.each(occessories.chargesCache[cacheKey], function(i, charge) {

                addChargeRow(charge.name, charge.price, charge.surplus, charge.num);
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

        com.post(api.data.queryAoodsChargeByAid, {
            "aoodsCharge.aoods.aid": aid
        }, function(data) {

            if (data && data.aoodsCharges && data.aoodsCharges.length > 0) {
                $.each(data.aoodsCharges, function(i, charge) {

                    console.log(charge)
                    // 不再使用 || 1 设置默认值，让 addChargeRow 函数自己处理默认值 0
                    addChargeRow(charge.name, charge.price, charge.surplus, charge.num);
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
    function addChargeRow(name, price, surplus, num) {

        var $row = $('<tr></tr>');

        // 费用名称（只读）
        var $nameTd = $('<td></td>');
        $nameTd.text(name);
        $row.append($nameTd);

        // 价格（隐藏）
        var $priceInput = $('<input type="hidden" class="charge-price">').val(price);
        $row.append($priceInput);

        // 浮动额（隐藏）
        var $surplusInput = $('<input type="hidden" class="charge-surplus">').val(surplus || 0);
        $row.append($surplusInput);

        // 数量（可编辑）
        var $numTd = $('<td></td>');
        // 如果传入了 num 值（缓存有值），使用该值；否则默认为 0
        var displayNum = (num !== undefined && num !== null && num !== '') ? num : 0;
        var $numInput = $('<input type="text" class="form-control input-sm v_int" placeholder="0">').val(displayNum);
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
            var surplus = $row.find('input.charge-surplus').val();
            var num = $row.find('td:eq(1) input').val();

            // 只保存有名称的行（过滤提示行）
            if (name && name !== '该外辅项未关联辅材，无法加载费用模板' && name !== '该辅材暂无费用模板') {
                charges.push({
                    name: name,
                    price: price,
                    surplus: surplus || 0,
                    num: num || 1
                });
            }
        });

        // 保存到缓存（使用 orderId_aid 组合 key，已在 openChargeModal 中设置）
        occessories.chargesCache[occessories.currentItemIndex] = charges;

        // 关闭弹窗
        com.focusPage('#chargeModal').modal('hide');
    });

});