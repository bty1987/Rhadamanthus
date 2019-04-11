jQuery(function ($) {

    var purchase = {
        pid: com.focusPage('#warehousingPopUp').attr('data-pid'),
        saveBtn: com.focusPage("#saveBtn"),
        cancellBtn: com.focusPage("#cancelBtn"),
        purchaseItems: {
            pid: com.focusPage("#pId")
        },
        record: {},
        sid: com.focusPage('#warehousingPopUp').attr('data-sid')
    };

    com.post(api.inventory.queryPurchaseByPid, {"purchase.pid": purchase.pid}, function (res) {
        com.focusPage('#purchaseCreateTime').val(res.purchase.createTime);  //– 创建时间
    });

    //获取仓库列表
    com.post(api.inventory.queryStorehouseForSelf, {}, function (res) {
    	
        var storehousesStatus = [];

        $.each(res.storehouses,function(i,v){
            if(v.status == 0){
                storehousesStatus.push(v);
            }
        });
        
        purchase.storehouses = storehousesStatus;
        
    }, null, false);

    //声明piId数组，用于接收所以采购项piId
    var $piId = [];

    //获取采购单下采购项
    com.focusPage('#list').empty();
    com.post(api.inventory.queryPurchaseItemByPid, {"purchase.pid": purchase.pid}, function (res) {
        $.each(res.purchaseItems, function (i, v) {
            //添加一条空行
            addline(i + 1, getLineInfoSet(v)).addClass('current').attr({
                'data-pid': v.pid,
                'data-piid': v.piId,
                'data-gid': v.goods.gid,
                'data-cid': v.color.cid,
                'data-fid': v.format.fid,
                'data-sid': v.supplier.sid,
                'data-unitPrice': v.unitPrice
            }).appendTo(com.focusPage('#list'));
            $piId[i] = v.piId;
        });
    });

    //表单提交
    $("#warehouseBtn").click(function () {
        saveOptionChange();
    });

    //关闭弹窗
    $("#cancelBtn").click(function () {
        layer.closeAll();
    });

    //选择框操作
    function saveOptionChange() {

        var options = {};
        var $menus = com.focusPage('input[type="checkbox"]:checked', "#list");
        var flag = false;
        
        options["purchases[0].pid"] = purchase.pid;
        //options = $.extend(options,params.pids);
        
        if($menus.length == 0){
        	layer.msg('请选择入库商品!');
        	return false;
        }
        
        for(var i=0;i<$menus.length;i++){
        	
        	var checkInput = $($menus[i]);
        	var lineInfo = checkInput.parents('li.line.current')
        	
        	var rnumnInput = lineInfo.find('.rnum input');
        	
        	var priceRex = /^([0-9]+|[0-9]+\.[0-9]{1,3})$/;
            if (!(priceRex.test(rnumnInput.val()))) {
            	com.showAlert(com.warning, "入库数量不正确.");
            	rnumnInput.select();
            	return false;
            }
        	
            var surplus = parseFloat(lineInfo.find('.surplus').text());
            var rnum = parseFloat(rnumnInput.val());
            var ishid = lineInfo.find('.storehouses select').val();
            
            var priceRex = /^([0-9]+|[0-9]+\.[0-9]{1,3})$/;
            if (!(priceRex.test(rnum))) {
            	com.showAlert(com.warning, "入库数量不正确.");
            	rnumnInput.select();
            	return false;
            }
            
            if (utils.accSub(surplus, rnum) < 0){
            	com.showAlert(com.warning, "采购项剩余数量不足.");
            	return false;
            }
            
            options["purchaseItems[" + i + "].piId"] = lineInfo.attr('data-piid');
            options["purchaseItems[" + i + "].storehouse.shId"] = ishid;                                           //入库仓库
            options["purchaseItems[" + i + "].num"] = rnum;
        }
        
        com.post(api.inventory.addManifestForPU, options, function (data) {

            layer.closeAll();
            layer.msg("入库成功", {icon: 1});
            com.focusPage('#list').empty();
        }, function (e) {
            com.showAlert(com.error, e.errorMsg);
        });
    }

    //处理采购单项信息
    function getLineInfoSet(v) {

        var _lineInfoSet = [
            {cellClass: "no blue", value: v.goods.no},
            {cellClass: "name grey", value: v.goods.name},
            {cellClass: "category grey", value: v.goods.category},
            {cellClass: "brand grey", value: v.goods.brand},
            {cellClass: "measurementUnit grey", value: v.goods.measurementUnit},
            {cellClass: "color grey", value: v.color.name},
            {cellClass: "format grey", value: v.format.info},
            {cellClass: "supplier grey", value: v.supplier.name},
            {cellClass: "unitPrice blue", value: v.unitPrice},
            {cellClass: "number blue", value: v.num},
            {cellClass: "surplus blue", value: v.surplus + ""},
            {cellClass: "storehouses", hasSelect: true},
            {cellClass: "rnum", hasInput: true}
        ];

        return _lineInfoSet;
    }

    //添加一行
    function addline(lineindex, _lineInfoSet, titleFlag) {

        var $line = $('<li></li>').addClass('line');
        
        var _label = $('<label></label>');
        var $input = $('<input>').attr({"type": "checkbox"}).css('width','0px').addClass('ace ace-checkbox-2');
        var _span = $('<span></span>').addClass('lbl grey bigger-150').css('font-weight','bold');

        _label.append($input).append(_span);

        var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index').html(_label).attr({"data-pid": purchase.pid}));
        var $lineInfoWrap = $('<div></div>').addClass('line-wrap content col13');

        $.each(_lineInfoSet, function (i, v) {
        	
            var $input;
            var $cell = $('<div></div>').addClass('cell ' + v.cellClass);

            if (v.hasSelect) {
                $select = $('<select></select>');
                $select.bindData(purchase.storehouses, "shId", "name");
                $cell.append($select);
            }

            if (!v.hasInput && !v.hasSelect) {
                $cell.text(v.value ? v.value : '');
            }

            if (v.hasInput) {
                $input = $('<input>').prop({
                    'type': 'text',
                    'autocomplete': 'off'
                }).addClass('editable').val(v.value ? v.value : null);
                v.readonly && $input.attr('readonly', true);
                $cell.append($input);
            }

            $cell.appendTo($lineInfoWrap);
        });

        $line.append($indexWrap).append($lineInfoWrap);

        return $line;
    }

    function checkRowValue($line) {

        var flag = true;

        $.each($line,function(i,v){
            var num = $(v).parents('li').find('.rnum input');

            var priceRex = /^([0-9]+|[0-9]+\.[0-9]{1,2})$/;
            if (!(numRex.test(num.val()) && parseFloat(num.val()) > 0)) {
                num.focus().select();
                num.addClass('tooltip-info').attr({
                    "data-rel": "popover",
                    "data-placement": "top",
                    "data-original-title": "",
                    "title": "",
                    "data-content": "数量输入内容格式错误!"
                }).popover('show');
                flag = false;
            } else {
                num.popover('destroy');
            }

        });
        return flag;
    }
});
