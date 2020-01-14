
jQuery(function ($) {

    var accessories = {
        items: {},
        record: {}
    };
    
    com.post(api.inventory.queryStorehouseForSelf, {}, function (res) {

        var storehousesStatus = [];

        $.each(res.storehouses, function (i, v) {
            if (v.status == 0) {
                storehousesStatus.push(v);
            }
        });

        accessories.storehouses = storehousesStatus;
    }, null, false);
    
    var _params = params.aids;
    
    com.post(api.inventory.queryAccessoriesItemByAids, _params, function (res) {
        for (var i = 0; i < res.accessoriesItems.length; i++) {
            autoAddline(i, res.accessoriesItems[i]);
        }
    });

    var $btnConfirm = $('<a></a>').addClass('btn btn-success btn-sm').attr({
        'name': 'subbtn',
        'href': 'javascript:void(0);'
    }).css({'margin-left': '50px', 'margin-top': '12px'}).text('出货');

    var $btnCancel = $('<a></a>').addClass('btn btn-sm').attr({'name': 'cancelbtn', 'href': 'javascript:void(0);'}).css({'margin-left': '3px', 'margin-top': '12px'}).text('取消');
    var $condList1 = com.focusPage('#shipmentPopUp').parents('.layui-layer.layui-anim.layui-layer-page.layui-layer-lan');
    var $div = $('<div class="layui-layer-btn0" style="position: relative;top:-10%;left:83%;"></div>');
    $div.append($btnConfirm).append($btnCancel).appendTo($condList1);

    $btnConfirm.click(function () {
        if(com.validate('shipmentPopUp', 'bottom')){
            return;
        }

        var options = {};

        options = $.extend(options, params["accessories.aids"]);

        var $list = com.focusPage('li.line', '#list');
        
        $list.length && $list.each(function (i) {
            var $this = $(this);
            options["accessoriesItems[" + i + "].aiid"] = $this.attr('data-aiid');//– 商品id
            options["accessoriesItems[" + i + "].goods.gid"] = $this.attr('data-gid');//– 商品id
            options["accessoriesItems[" + i + "].color.cid"] = $this.find('.color select').val();//– 商品编号
            options["accessoriesItems[" + i + "].format.fid"] = $this.find('.format select').val();//– 商品名
            options["accessoriesItems[" + i + "].storehouse.shid"] = $this.find('.storehouse select').val();//– 仓库ID
            options["accessoriesItems[" + i + "].outprice"] = $this.find('.outprice input').val();//– 仓库ID
            options["accessoriesItems[" + i + "].num"] = $this.find('.number').text();//– 数量
        });


        com.post(api.inventory.addManifestForAS, options, function (data) {
            com.showAlert(com.info, "操作成功");
            com.focusPage('#list').empty();
        }, function (e) {
            com.showAlert(com.error, e.errorMsg);
        });
    });

    $btnCancel.click(function () {
        com.closePopup();
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
            {cellClass: "storehouse", hasSelect: true},//仓库
            {cellClass: "outprice", hasInput: true},
            {cellClass: "number blue"},//数量
        ];

        $.each(_lineInfoSet, function (i, v) {
        	
            var $input;
            var $cell = $('<div></div>').addClass('cell ' + v.cellClass);
            
            if (v.hasInput) {
                $input = $('<input>').prop({'type': 'text', 'autocomplete': 'off'}).addClass('editable');
                $cell.append($input);
            }

            if (v.hasSelect) {
                var $select = $('<select class="v_required"></select>');
                $cell.append($select);
            }

            if (v.hasInput) {
                var $input = $('<input>').prop({'type': 'text', 'autocomplete': 'off'}).addClass('editable v_float_3');
                $cell.append($input);
            }

            $cell.appendTo($lineInfoWrap);

        });

        $line.append($indexWrap).append($lineInfoWrap);

        return $line;
    }

    function autoAddline(index, item) {
    	
        addline(1 + i).appendTo(com.focusPage('#list'));
        
        var $lineInfoWrap1 = com.focusPage('#list li:nth-of-type(' + (index + 1) + ') div.content');
        
        com.focusPage('#list li:nth-of-type(' + (index + 1) + ')').attr({'data-gid': item.goods.gid, 'data-aiid': item.aiid});
        
        $lineInfoWrap1.find('div.no').text(res.accessoriesItems[i].goods.no);
        $lineInfoWrap1.find('div.name').text(res.accessoriesItems[i].goods.name);
        $lineInfoWrap1.find('div.measurementUnit').text(res.accessoriesItems[i].goods.measurementUnit);
        $lineInfoWrap1.find('div.number').text(res.accessoriesItems[i].num);
        
        $line.find('.storehouse select').bindData(accessories.storehouses, "shid", "name");

        com.post(api.data.queryColorForEnableByGid, {
            "color.gid": res.accessoriesItems[i].goods.gid
        }, function (data) {
            $lineInfoWrap1.find('.color select').bindData(data.colors, "cid", "name");
        });
        
        com.post(api.data.queryFormatForEnableByGid, {
            "format.gid": res.accessoriesItems[i].goods.gid
        }, function (data) {
            $lineInfoWrap1.find('.format select').bindData(data.formats, "fid", "info");
        })

    }
});
