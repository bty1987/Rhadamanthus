jQuery(function () {

    var accessories = {
        
        postData: {
            orderId: null,
            supervisor: null,
            house: null,
            fetchTime:null,
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
            fetchTime: com.focusPage('#fetchTime')
        },
        constructionNode: {}
    };
    
    com.focusPage('.date-picker').datepicker(com.datepickerdefault);
    
    com.post(api.data.queryConstructionNode, {}, function(res){
        $.each(res.constructionNodes, function(i, v){
            accessories.constructionNode[v.sort] = v.name;
        });
    });
    
    com.initTypeahead("goodsName", api.inventory.queryGoodsByName, "goods.name", {}, "goodes", "gid", "name", function(list, k, v){

        $.each(list, function (index, val) {

            if (val.gid == k) {

                accessories.leftitems.goodsHidden.attr('data-gid', val.gid).attr('data-type', val.type).attr('data-selling', val.selling);

                accessories.leftitems.goodsNo.attr('data-no', val.no).val(val.no);
                accessories.leftitems.category.attr('data-category', val.category).val(val.category);
                accessories.leftitems.brand.attr('data-brand', val.brand).val(val.brand);
                accessories.leftitems.measurementUnit.attr('data-measurementUnit', val.measurementUnit).val(val.measurementUnit);
            }
        });

        return v;
    });
    
    com.focusPage("#add").click(function () {
        
        if(com.validate("left", "left")){
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
        var $query = $('<div></div>').css('margin-right', '5px').addClass('pull-right action-button').append($('<a></a>').addClass('btn btn-primary btn-minier').html('查看')).click(function () {
            openPackageGoods(gid);
        });

        $h4.append($delete).appendTo($liList);
        
        if (type == 1) {
            $h4.append($query);
        }
        
        $liList.append(addSpan('品类 : ', 's_category', category, " ", 'b_category', null)).append(addSpan('品牌 : ', 's_brand', brand, " ", 'b_brand', null)).append(addSpan('单位 : ', 's_unit', measurementUnit, " ", 'b_unit', null)).append(addSpan('数量 : ', 's_number', num, 'red', 'b_number'));
        
        accessories.itemlist.append($liList);
        
        com.cleanItems(accessories.leftitems);
        
        $delete.click(function () {
            $(this).parents('.list-group-item').remove();
            com.focusPage('.list-group-item:last').css("border-bottom", "solid 1px");
        });
    });

    com.focusPage('#refresh').click(function () {
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
    
    accessories.rightitems.orderId.on("change", function () {
        
        var orderId = accessories.rightitems.orderId.val();

        var option = {
            "decoration.orderId": orderId
        };
        
        com.post(api.decoration.queryDecorationForCommonByOrderId, option, function (data) {
            
            accessories.rightitems.supervisorName.val(data.decoration.supervisor.userId != null ? data.decoration.supervisor.currentName : "---");
            accessories.rightitems.orderAddr.val(data.decoration.house.village.name + " " + data.decoration.house.houseNumber);

            accessories.postData.orderId = data.decoration.orderId;
            accessories.postData.supervisor = data.decoration.supervisor.userId;
            accessories.postData.house = data.decoration.house.hid;
            
        }, function (e) {
            com.showAlert(com.warning, "装修单不存在");
            
            com.focusPage("#supervisorName").val("");
            com.focusPage("#orderAddr").val("");
        });
        
        com.post(api.construction.queryConstructionScheduleByOrderId, {"constructionSchedule.orderId": orderId}, function(res){
        	
        	var schedules = res.constructionSchedules;
            
            $.each(schedules, function(i, v){
                v.name = accessories.constructionNode[v.schedule];
            });
            
            console.log(schedules);
            
            accessories.rightitems.schedule.bindData(res.constructionSchedules, "schedule", "name");
        });
    });

    com.focusPage('#submit').click(function () {
        
        var $list = com.focusPage('.list-group-item');

        if($list.length == 0){
            com.showAlert(com.warning, "请添加辅料项!");
            return false;
        }
        
        if(com.validate('searchInfo', 'left')){
            return false;
        }
        
        var options = {
            "accessories.orderId": accessories.postData.orderId,
            "accessories.supervisor.userId": accessories.postData.supervisor,
            "accessories.fetchTime": accessories.rightitems.fetchTime.val() + " 00:00:00",
            "accessories.schedule": accessories.rightitems.schedule.val()
        };

        $list && $list.length && $.each($list, function (i, v) {
            var $v = $(v);
            options["accessoriesItems[" + i + "].goods.gid"] = $v.attr('data-gid');
            options["accessoriesItems[" + i + "].num"] = $v.attr('data-num');
            options["accessoriesItems[" + i + "].selling"] = $v.attr('data-selling');
        });
        
        console.log(options);

        com.post(api.inventory.addAccessories, options, function (data) {
            com.showAlert(com.info, "操作成功");

            com.cleanItems(accessories.rightitems);
            accessories.itemlist.html("");
        });
    });

    //查看套餐弹窗
    function openPackageGoods(gid) {
        var $popup = com.focusPage('#viewPopUp');
        $popup.attr({'data-gid': gid});
        //弹出即全屏
        var index = layer.open({
            type: 1,
            skin: 'layui-layer-molv',
            title: "查看套餐",
            content: $popup,
            area: ["1400px", ( $(window).height() * 0.84 < 720 ? $(window).height() * 0.84 : 720 ) + "px"],
            zIndex: 9000,
            btn: ['确定'],
            success: function (layer, index) {
                $popup.load("views/sales/viewSalesPackageGoods.html");
            },
            end: function () {
                $popup.attr('data-gid', null);
            }
        });
    }

});