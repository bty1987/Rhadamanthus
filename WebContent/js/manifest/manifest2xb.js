
jQuery(function ($) {

    var manifest = {
		mid: params.manifest.mid,
        items: {
        	list: com.focusPage('#list'),
        },
        record: {},
    };

    com.post(api.inventory.queryManifestItemByMid, {"manifest.mid": manifest.mid}, function (res) {

    	$.each(res.manifestItems, function (i, v) {

    		var $line = addline(i + 1).appendTo(manifest.items.list).attr({
    			"data-gid": v.goods.gid,
    			"data-miid": v.miid,
    			"id": "line" + v.goods.gid
    		});

    		$line.find('div.no').text(v.goods.no);
            $line.find('div.name').text(v.goods.name);
            $line.find('div.category').text(v.goods.category);
            $line.find('div.brand').text(v.goods.brand);
            $line.find('div.measurementUnit').text(v.goods.measurementUnit);

            $line.find('div.color').text(v.color.name);
            $line.find('div.format').text(v.format.info);
            $line.find('div.storehouse').text(v.outstorehouse.name);

            $line.find('div.pieceNum').text(v.goods.pieceNum);
            $line.find('div.number').text(v.surplus);
        });
    });

    com.focusPage("#xbBtn").click(function () {

        manifest.items.list.find(".crnum input").removeClass('v_float_3');
    	var $checks = com.focusPage('input[type="checkbox"]:checked', '#list');
        if($checks.length == 0){
            com.showAlert(com.warning, "请选择商品");
            return false;
        }

    	var options = {
    		"manifest.mid": manifest.mid
    	};

    	for(var i=0;i<$checks.length;i++){

    		var $check = $($checks[i]);
    		var $line = $check.parents('li.line');
            var crnumInput = $line.find(".crnum input").addClass('v_float_3');
    		if(com.validate($line.attr("id"), "left")){
        		return false;
        	}

    		var num = $line.find(".number").text();
    		var crnum = crnumInput.val();
    		if (utils.accSub(num, crnum) < 0){
            	com.showAlert(com.warning, "货单项出返数不足");
            	crnumInput.select();
            	return false;
            }
    		options["manifestItems[" + i + "].miid"] = $line.attr("data-miid");
    		options["manifestItems[" + i + "].num"] = crnum;
    	}

    	com.post(api.inventory.addManifestForXB, options);

    });

    com.focusPage("#cancelBtn").click(function () {
        com.closePopup();
    });

    function addline(lineindex, data) {

    	var $line = $('<li></li>').addClass('line');

        var _label = $('<label></label>');
        var $input = $('<input>').attr({"type": "checkbox"}).addClass('ace ace-checkbox-2 hide');
        var _span = $('<span></span>').addClass('lbl grey bigger-150').css('font-weight','bold');

        _label.append($input).append(_span);

        var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index').html(_label));
        var $lineInfoWrap = $('<div></div>').addClass('line-wrap content col11');

        var _lineInfoSet = [
            {cellClass: "no blue"},
            {cellClass: "name grey"},
            {cellClass: "category grey"},
            {cellClass: "brand grey"},
            {cellClass: "measurementUnit grey"},
            {cellClass: "color grey"},
            {cellClass: "format grey"},
            {cellClass: "storehouse grey"},
            {cellClass: "pieceNum blue"},
            {cellClass: "number blue"},
            {cellClass: "crnum", hasInput: true},
        ];

        $.each(_lineInfoSet, function (i, v) {

            var $cell = $('<div></div>').addClass('cell ' + v.cellClass);

            if (v.hasInput) {
                $cell.append($('<input>').prop({'type': 'text', 'autocomplete': 'off'}).addClass('editable'));
            }

            $cell.appendTo($lineInfoWrap);
        });

        $line.append($indexWrap).append($lineInfoWrap);

        return $line;
    }

});
