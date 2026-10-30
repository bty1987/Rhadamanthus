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

        constructionNode: {},

        chargesCache: {}, // 费用行缓存(键=行data-charge-idx), 照外辅 occcessories2create 同款
        chargeIdx: 0, // 行费用唯一键计数
        currentChargeIdx: null // 当前费用弹窗编辑的行键
    };

    com.datetime(accessories.rightitems.fetchTime, "date", false);

    accessories.rightitems.type.bindData(constant.inventory().accessories.type.datas, 'key', 'value');

    accessories.leftitems.goodsName.on("focus", function() {

        if (accessories.postData.orderId == null) {
            return false;
        }

        com.initTypeahead("goodsName", api.data.queryAoodsByName, "aoods.goods.name", {}, "aoodes", "aid", "name", function(list, k, v) {

            $.each(list, function(index, val) {

                if (val.aid == k) {
                    
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
        
        var normnum = accessories.leftitems.goodsHidden.attr('data-normnum');
        var normunit = accessories.leftitems.goodsHidden.attr('data-normunit');
        var storenum = accessories.leftitems.goodsHidden.attr('data-storenum');
        var storeunit = accessories.leftitems.goodsHidden.attr("data-storeunit");

        var name = accessories.leftitems.goodsName.val();
        var no = accessories.leftitems.goodsNo.val();
        var category = accessories.leftitems.category.val();
        var brand = accessories.leftitems.brand.val();
        var measurementUnit = accessories.leftitems.measurementUnit.val();
        var schedule = accessories.leftitems.constructionNode.attr("data-schedule");
        var constructionNode = accessories.leftitems.constructionNode.attr("data-constructionNode");
        var num = accessories.leftitems.num.val();

        // 下拉框value为cnid,须与节点cnid比对;data-schedule存sort仅作提交值(后端按schedule.sort对比)
        if (schedule && constructionNode != accessories.rightitems.schedule.val()) {
            com.showAlert(com.warning, "施工环节不匹配");
            return false;
        }

        var $liList = $('<li></li>').addClass('list-group-item').attr("data-gid", gid).attr("data-num", num).attr("data-selling", selling).attr('data-caid', caid).attr('data-normnum', normnum).attr('data-normunit', normunit).attr('data-storenum', storenum).attr('data-storeunit', storeunit);

        // 行费用键: 费用弹窗缓存与提交收集的关联键
        var chargeIdx = ++accessories.chargeIdx;
        $liList.attr('data-charge-idx', chargeIdx);

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
                "accessoriesItem.num": num,
                "accessoriesItem.normnum": normnum,
                "accessoriesItem.storenum": storenum,
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

        // 费用按钮: 弹窗编辑该行费用(模板预填+可编辑数量), 缓存于 chargesCache
        var $chargeBtn = $('<div></div>').css('margin-right', '5px').addClass('pull-right action-button').append($('<a></a>').addClass('btn btn-warning btn-minier').html('费用')).click(function() {

            openChargeModal(chargeIdx, caid);
        });
        $h4.append($chargeBtn);

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

    // 打开行费用弹窗(照外辅 openChargeModal 同款): 缓存优先, 无缓存按辅材费用模板预填
    function openChargeModal(chargeIdx, caid) {

        accessories.currentChargeIdx = chargeIdx;

        com.focusPage('#chargeTableBody').html('');

        if (accessories.chargesCache[chargeIdx] && accessories.chargesCache[chargeIdx].length > 0) {

            $.each(accessories.chargesCache[chargeIdx], function(i, charge) {
                addChargeRow(charge.name, charge.price, charge.surplus, charge.num);
            });
        } else if (caid) {
            loadAoodsChargeTemplate(caid);
        } else {
            com.focusPage('#chargeTableBody').html('<tr><td colspan="2" class="text-center">该辅料项未关联辅材, 无法加载费用模板</td></tr>');
        }

        com.focusPage('#chargeModal').modal('show');
    }

    // 加载辅材费用模板(data.aoodscharge, 响应经api tranargs已折元)
    function loadAoodsChargeTemplate(caid) {

        com.post(api.data.queryAoodsChargeByAid, {
            "aoodsCharge.aoods.aid": caid
        }, function(data) {

            if (data && data.aoodsCharges && data.aoodsCharges.length > 0) {
                $.each(data.aoodsCharges, function(i, charge) {
                    addChargeRow(charge.name, charge.price, charge.surplus, charge.num);
                });
            } else {
                com.focusPage('#chargeTableBody').html('<tr><td colspan="2" class="text-center">该辅材暂无费用模板</td></tr>');
            }
        });
    }

    // 添加费用行: 名称/单价/浮动额只读(模板口径), 数量可编辑
    function addChargeRow(name, price, surplus, num) {

        var $row = $('<tr></tr>');

        var $nameTd = $('<td></td>');
        $nameTd.text(name);
        $row.append($nameTd);

        var $priceInput = $('<input type="hidden" class="charge-price">').val(price);
        $row.append($priceInput);

        var $surplusInput = $('<input type="hidden" class="charge-surplus">').val(surplus || 0);
        $row.append($surplusInput);

        var $numTd = $('<td></td>');
        var displayNum = (num !== undefined && num !== null && num !== '') ? num : 0;
        var $numInput = $('<input type="text" class="form-control input-sm v_int" placeholder="0">').val(displayNum);
        $numTd.append($numInput);
        $row.append($numTd);

        com.focusPage('#chargeTableBody').append($row);
    }

    // 保存行费用到缓存(提交时随accessoriesItems嵌套上送)
    com.focusPage('#saveChargeBtn').click(function() {

        var charges = [];

        com.focusPage('#chargeTableBody tr').each(function() {

            var $row = $(this);
            var name = $row.find('td:eq(0)').text().trim();
            var price = $row.find('input.charge-price').val();
            var surplus = $row.find('input.charge-surplus').val();
            var num = $row.find('td:eq(1) input').val();

            if (name && name !== '该辅料项未关联辅材, 无法加载费用模板' && name !== '该辅材暂无费用模板') {
                charges.push({
                    name: name,
                    price: price,
                    surplus: surplus || 0,
                    num: num || 1
                });
            }
        });

        accessories.chargesCache[accessories.currentChargeIdx] = charges;

        com.focusPage('#chargeModal').modal('hide');
    });

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

            // 行费用嵌套上送(价格元经api tranargs ×1000折厘), 未编辑行不上送, 后端回退模板现算
            var charges = accessories.chargesCache[$v.attr('data-charge-idx')] || [];

            $.each(charges, function(j, c) {

                options["accessoriesItems[" + i + "].accessoriesCharges[" + j + "].name"] = c.name;
                options["accessoriesItems[" + i + "].accessoriesCharges[" + j + "].price"] = c.price;
                options["accessoriesItems[" + i + "].accessoriesCharges[" + j + "].surplus"] = c.surplus || 0;
                options["accessoriesItems[" + i + "].accessoriesCharges[" + j + "].num"] = c.num || 1;
            });
        });

        com.post(api.inventory.addAccessories, options, function(data) {

            com.showAlert(com.info, "操作成功");

            com.cleanItems(accessories.rightitems);
            accessories.itemlist.html("");
        });
    });

});