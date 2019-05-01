
jQuery(function ($) {

    var accessories = {
        orderId: params["accessories.orderId"],
        aid: params["accessories.aid"],
        items: {
            customerName: com.focusPage("#customer"),
            des: com.focusPage("#comment")
        },
        record: {},
        storehouses: [],
        decorationStatuses: {}
    };
    
    com.post(api.ds.decoration, {}, function(res){
    	$.each(res.decorationOrderStatus, function(i, e){
    		accessories.decorationStatuses[e.key] = e.value;
    	})
    }, null, false);

    com.post(api.decoration.queryDecorationForCommonByOrderId, {"decoration.orderId": accessories.orderId}, function (res) {
        orderInfo('orderInfo', res.decoration);
    }, null, false);
    
    com.post(api.inventory.queryStorehouseForSelf, {}, function (res) {
        $.each(res.storehouses, function (i, v) {
        	accessories.storehouses.push(v);
        });
    }, null, false);
    
    com.post(api.inventory.queryAccessoriesItemByAid, {"accessoriesItem.aid": accessories.aid}, function (res) {
        for (var i = 0; i < res.accessoriesItems.length; i++) {
            autoAddline(res.accessoriesItems[i]);
        }
    });

    com.focusPage("#outBtn").click(function () {
    	
        if (com.validate('list', 'bottom')) {
            return false;
        }
        
        var $lines = com.focusPage('li.line', '#list');
        
        if ($lines.length == 0) {
            com.showAlert(com.warning, "辅料项不存在");
            return false;
        }

        var options = {
        	"accessories[0].aid": accessories.aid
        };

        $lines.length && $lines.each(function (i, e) {
            var $this = $(e);

            options["accessoriesItems[" + i + "].goods.gid"] = $this.attr('data-gid');//– 商品id
            options["accessoriesItems[" + i + "].color.cid"] = $this.find('.color select').val();
            options["accessoriesItems[" + i + "].format.fid"] = $this.find('.format select').val();
            options["accessoriesItems[" + i + "].storehouse.shid"] = $this.find('.storehouse select').val();//– 仓库ID
            options["accessoriesItems[" + i + "].num"] = $this.find('.number').text();//– 数量
        });

        com.post(api.inventory.addManifestForAS, options, function (data) {
            layer.closeAll();
            layer.msg('添加成功!', {icon: 1}, function () {
                com.focusPage('#list').empty();
            });
        });
    });

    com.focusPage("#refuseBtn").click(function () {
    	
    	var options = {
			"accessories.aid": accessories.aid,
            "accessories.status": 2
    	}
    	
        com.post(api.inventory.updateAccessoriesForStatus, options, function (data) {
            layer.closeAll();
            layer.msg('拒绝成功');
        });
    });

    com.focusPage("#cancelBtn").click(function () {
        layer.closeAll();
    });

    //添加一个空行
    function addline(lineindex) {

        var $line = $('<li></li>').addClass('line');
        var $indexWrap = $('<div></div>').addClass('line-wrap order').append($('<div></div>').addClass('cell index').text(lineindex));
        var $lineInfoWrap = $('<div></div>').addClass('line-wrap content col8');
        
        var _lineInfoSet = [
            {cellClass: "no blue"},//编号
            {cellClass: "name grey"},//名称
            {cellClass: "color", hasSelect: true},//颜色
            {cellClass: "format", hasSelect: true},//规格
            {cellClass: "measurementUnit grey"},//单位
            {cellClass: "storehouse grey", hasSelect: true},//仓库
            {cellClass: "number blue"},//数量
            {cellClass: "des grey", hasInput: true}//备注
        ];

        $.each(_lineInfoSet, function (i, v) {
        	
            var $input;
            var $cell = $('<div></div>').addClass('cell ' + v.cellClass);
            
            if (v.hasSelect) {
                $cell.append($('<select class="v_required"></select>'));
            }

            $cell.appendTo($lineInfoWrap);
        });

        $line.append($indexWrap).append($lineInfoWrap);

        return $line;
    }

    function autoAddline(item) {

        var $list = com.focusPage('#list');
        var $line = addline(1 + $list.length).appendTo($list);
        
        $line.attr({"data-gid": item.goods.gid});
        
        $line.find('.no').text(item.goods.no);
        $line.find('.name').text(item.goods.name);
        $line.find('.measurementUnit').text(item.goods.measurementUnit);
        $line.find('.number').text(item.num);
        
        $line.find('.storehouse select').bindData(accessories.storehouses, "shid", "name");
        
        com.post(api.inventory.queryColorForEnableByGid, {
            "color.gid": item.goods.gid
        }, function (data) {
        	$line.find('.color select').bindData(data.colors, "cid", "name");
        });
        
        com.post(api.inventory.queryFormatForEnableByGid, {
            "format.gid": item.goods.gid
        }, function (data) {
        	$line.find('.format select').bindData(data.formats, "fid", "info");
        });
    }

    function orderInfo(tableId, v) {

        com.focusPage('#' + tableId).html(null);
        var $tableWrap = com.focusPage('#' + tableId);
        var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
        var status ={
            '0':'初始', '1':'定金' , '2' : '签约' ,'3' : '重签' , '4' : '废单','5' : '终止','6' : '决算','7' : '完结'
        };
        var propertyArr = [
            ["楼盘地址:", v.house.village.name + " " + v.house.houseNumber, "grey"],
            ["客户名:", v.customer.name, "grey"],
            ["设计部:", v.designer.dept.deptName, "grey"],
            ["设计师:", v.designer.currentName, "grey"],
            ["业务部:", v.salesman.dept.deptName, "grey"],
            ["业务员:", v.salesman.currentName, "grey"],
            ["面积:", v.house.buildArea + "m²", "blue"],
            ["合同报价:", v.orderTotalPrice, "blue"],
            ["签单时间:", v.contractTime == null || "" ? "----" : v.contractTime, "green"],
            ["量房时间:", v.measureTime == null || "" ? "----" : v.measureTime, "green"],
            ["状态:", status[v.status], "red"]
        ];
        $.each(propertyArr, function (index, value) {
            var $liProperty = $('<li></li>');
            $('<strong></strong>').html(value[0]).appendTo($liProperty);
            $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
            $liProperty.appendTo($ulProperty);
        });

        $ulProperty.appendTo($tableWrap);
    }

});
