jQuery(function ($) {

    var purchase = {
        pid: params.manifest.pid,
        items: {
        	list: com.focusPage("#list"),
            createTime: com.focusPage("#createTime")
        },
        btns:{
            warehouseBtn:com.focusPage("#warehouseBtn"),
            cancelBtn:com.focusPage("#cancelBtn")
        },
        record: {},
        storehouses: []
    };
    
    com.post(api.inventory.queryPurchaseByPid, {"purchase.pid": purchase.pid}, function (res) {
        purchase.items.createTime.val(res.purchase.createTime)
    });

    com.post(api.inventory.queryStorehouseForSelf, {}, function (res) {
    	purchase.storehouses = res.storehouses;
    }, null, false);

    com.post(api.inventory.queryPurchaseItemByPid, {"purchase.pid": purchase.pid}, function (res) {
        $.each(res.purchaseItems, function (i, v) {
            addline(i + 1, v).appendTo(purchase.items.list).attr({
            	"data-piid": v.piid,
            	"id": "line" + v.piid
            });
        });
    });

    //表单提交
    purchase.btns.warehouseBtn.click(function () {
    	inware();
    });

    //关闭弹窗
    purchase.btns.cancelBtn.click(function () {
        com.closePopup();
    });

    //选择框操作
    function inware() {

        var $checks = com.focusPage('input[type="checkbox"]:checked', "#list");
        
        if($checks.length == 0){
        	com.showAlert(com.warning, "请选择入库商品");
        	return false;
        }
        
        var options = {
    		"purchases[0].pid": purchase.pid
        };
        
        for(var i=0;i<$checks.length;i++){
        	
        	var $check = $($checks[i]);
        	var $line = $check.parents('li.line');
        	
        	if(com.validate($line.attr("id"), "bottom")){
        		return false;
        	}
        	
        	var rnumInput = $line.find('.rnum input');
        	
        	var piid = $line.attr('data-piid');
            var surplus = parseFloat($line.find('.surplus').text());
            var rnum = parseFloat(rnumInput.val());
            var ishid = $line.find('.storehouses select').val();
            
            if (utils.accSub(surplus, rnum) < 0){
            	com.showAlert(com.warning, "采购项剩余数量不足");
            	rnumInput.select();
            	return false;
            }
            
            options["purchaseItems[" + i + "].piid"] = piid;
            options["purchaseItems[" + i + "].storehouse.shid"] = ishid;
            options["purchaseItems[" + i + "].num"] = rnum;
        }
        
        com.post(api.inventory.addManifestForPU, options);
    }

    function addline(lineindex, v) {

        var $line = $('<li></li>').addClass('line');
        
        var _label = $('<label></label>');
        var $input = $('<input>').attr({"type": "checkbox"}).css('width','0px').addClass('ace ace-checkbox-2');
        var _span = $('<span></span>').addClass('lbl grey bigger-150').css('font-weight','bold');

        _label.append($input).append(_span);

        var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index').html(_label).attr({"data-pid": purchase.pid}));
        var $lineInfoWrap = $('<div></div>').addClass('line-wrap content col12');
        
        var _lineInfoSet = [
            {cellClass: "no blue", value: v.goods.no},
            {cellClass: "name grey", value: v.goods.name},
            {cellClass: "category grey", value: v.goods.category},
            {cellClass: "brand grey", value: v.goods.brand},
            {cellClass: "measurementUnit grey", value: v.goods.measurementUnit},
            {cellClass: "color grey", value: v.color.name},
            {cellClass: "format grey", value: v.format.info},
            {cellClass: "inprice blue", value: v.inprice},
            {cellClass: "number blue", value: v.num},
            {cellClass: "surplus blue", value: v.surplus + ""},
            {cellClass: "storehouses", hasSelect: true},
            {cellClass: "rnum", hasInput: true}
        ];

        $.each(_lineInfoSet, function (i, v) {
        	
            var $cell = $('<div></div>').addClass('cell ' + v.cellClass);

            if (v.hasSelect) {
                $select = $('<select></select>');
                $select.bindData(purchase.storehouses, "shid", "name");
                $cell.append($select);
            }

            if (!v.hasInput && !v.hasSelect) {
                $cell.text(v.value ? v.value : '');
            }

            if (v.hasInput) {
                $('<input>').prop({
                    'type': 'text',
                    'autocomplete': 'off'
                }).addClass('editable').addClass("v_float_3").val(v.value ? v.value : null).appendTo($cell);
            }

            $cell.appendTo($lineInfoWrap);
        });

        $line.append($indexWrap).append($lineInfoWrap);

        return $line;
    }

});
