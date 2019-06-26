
jQuery(function ($) {

    var purchase = {
        items: {
        	list: com.focusPage('#list'),
        },
        record: {},
        storehouses: [],
        wareinBtn:com.focusPage('#wareinBtn'),
        cancelBtn:com.focusPage('#cancelBtn'),
    };
    
    //获得仓库
    com.post(api.inventory.queryStorehouseForSelf, {}, function (res) {
        purchase.storehouses = res.storehouses;
    }, null, false);
    
    com.post(api.inventory.queryPurchaseItemByPids, {"pids": params["purchase.pids"]}, function (res) {
    	
    	$.each(res.purchaseItems.lenght, function(i, v){
    		var $line = addline(1 + index).appendTo(purchase.items.list).attr({
    			"data-pid": v.pid,
    			"data-gid": v.goods.gid,
    			"data-piid": v.piid,
    			"id": "line" + v.piid,
    		});
    		
    		$line.find('div.no').text(v.goods.no);
    		$line.find('div.name').text(v.goods.name);
    		$line.find('div.category').text(v.goods.category);
    		$line.find('div.brand').text(v.goods.brand);
    		$line.find('div.measurementUnit').text(v.goods.measurementUnit);
    		$line.find('div.inprice').text(v.inprice);
    		$line.find('div.color').text(v.color.name);
    		$line.find('div.format').text(v.format.info);
    		$line.find('div.number').text(v.num);
    		$line.find('div.surplus').text(v.surplus);
    	});
    });

    purchase.wareinBtn.click(function () {
    	
    	var $checks = com.focusPage('input[type="checkbox"]:checked', "#list");
    	
    	if($checks.length == 0){
    		com.showAlert(com.warning, "请选择入库商品");
    		return false;
    	}
    	
    	var options = {};
    	
    	for(var i=0;i<$checks.length;i++){
    		
    		var $check = $($checks[i]);
    		var $line = $check.parents('li.line');
    		
    		if(com.validate($line.attr("id"), "bottom")){
    			return false;
    		}
    		
    		var rnumInput = $line.find(".rnum input");
    		
    		var piid = $line.attr("data-piid");
    		var surplus = $line.find(".surplus input").val();
    		var rnum = rnumInput.val();
    		var ishid = $line.find(".storehouse select").val();
    		
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
    });

    purchase.cancelBtn.click(function () {
        com.closePopup();
    });

    function addline(lineindex) {

        var $line = $('<li></li>').addClass('line');
        var _label = $('<label></label>');

        var $input = $('<input>').attr({ "type": "checkbox"}).addClass('ace ace-checkbox-2 hide');
        var _span = $('<span></span>').addClass('lbl grey bigger-150').css('font-weight', 'bold');

        _label.append($input).append(_span);

        var $indexWrap = $('<div></div>').addClass('line-wrap order').append($('<div></div>').addClass('cell index').html(_label));
        var $lineInfoWrap = $('<div></div>').addClass('line-wrap content col12');
        
        var _lineInfoSet = [
            {cellClass: "no blue"},
            {cellClass: "name grey"},
            {cellClass: "category grey"},
            {cellClass: "brand grey"},
            {cellClass: "measurementUnit grey"},
            {cellClass: "color grey"},
            {cellClass: "format grey"},
            {cellClass: "inprice blue"},
            {cellClass: "number blue"},
            {cellClass: "surplus blue"},
            {cellClass: "storehouse", hasSelect: true},
            {cellClass: "rnum", hasInput: true}
        ];

        $.each(_lineInfoSet, function (i, v) {
            var $input;
            var $cell = $('<div></div>').addClass('cell ' + v.cellClass);
            
            if (v.hasInput) {
                $input = $('<input>').prop({'type': 'text', 'autocomplete': 'off'}).addClass("v_float_3").addClass('editable');
                $cell.append($input);
            }

            if (v.hasSelect) {
                $select = $('<select></select>');
                $select.bindData(purchase.storehouses, "shid", "name");
                $cell.append($select);
            }

            $cell.appendTo($lineInfoWrap);
        });

        $line.append($indexWrap).append($lineInfoWrap);

        return $line;
    }

});
