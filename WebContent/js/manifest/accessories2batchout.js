jQuery(function($) {

    var accessories = {
        items: {},
        record: {},
        storehouses: []
    };

    var _params = params.mainfest.aids;

    com.post(api.inventory.queryAccessoriesItemByAids, _params, function(res) {

        accessories.storehouses = $.grep(res.storehouses || [], function(v) {
            return v.status == 0;
        });

        for ( var i = 0; i < res.accessoriesItems.length; i++) {
            autoAddline(i, res.accessoriesItems[i]);
        }
    });

    var $btnConfirm = $('<a></a>').addClass('btn btn-success btn-sm').attr({
        'name': 'subbtn',
        'href': 'javascript:void(0);'
    }).css({
        'margin-left': '50px',
        'margin-top': '12px'
    }).text('出货');

    var $btnCancel = $('<a></a>').addClass('btn btn-sm').attr({
        'name': 'cancelbtn',
        'href': 'javascript:void(0);'
    }).css({
        'margin-left': '3px',
        'margin-top': '12px'
    }).text('取消');
    var $condList1 = com.focusPage('#shipmentPopUp').parents('.layui-layer.layui-anim.layui-layer-page.layui-layer-lan');
    var $div = $('<div class="layui-layer-btn0" style="position: relative;top:-10%;left:83%;"></div>');
    $div.append($btnConfirm).append($btnCancel).appendTo($condList1);

    $btnConfirm.click(function() {
        if (com.validate('shipmentPopUp', 'bottom')) { return; }

        var options = {};

        options = $.extend(options, params.manifest.aids);

        var $list = com.focusPage('li.line', '#list');

        $list.length && $list.each(function(i) {
            var $this = $(this);
            options["accessoriesItems[" + i + "].aiid"] = $this.attr('data-aiid');// – 商品id
            options["accessoriesItems[" + i + "].goods.gid"] = $this.attr('data-gid');// – 商品id
            options["accessoriesItems[" + i + "].color.cid"] = $this.find('.color select').val();// – 商品编号
            options["accessoriesItems[" + i + "].format.fid"] = $this.find('.format select').val();// – 商品名
            options["accessoriesItems[" + i + "].storehouse.shid"] = $this.find('.storehouse select').val();// – 仓库ID
            options["accessoriesItems[" + i + "].outprice"] = $this.find('.outprice input').val();// – 仓库ID
            options["accessoriesItems[" + i + "].num"] = $this.find('.number').text();// – 数量
        });

        com.post(api.inventory.addManifestForAS, options, function(data) {
            com.showAlert(com.info, "操作成功");
            com.focusPage('#list').empty();
        }, function(e) {
            com.showAlert(com.error, e.errorMsg);
        });
    });

    $btnCancel.click(function() {
        com.closePopup();
    });

    // 添加一个空行
    function addline(lineindex) {

        var $line = $('<li></li>').addClass('line');
        var $indexWrap = $('<div></div>').addClass('line-wrap order').append($('<div></div>').addClass('cell index').text(lineindex));
        var $lineInfoWrap = $('<div></div>').addClass('line-wrap content col8');

        var _lineInfoSet = [{
            cellClass: "no blue"
        },// 编号
        {
            cellClass: "name grey"
        },// 名称
        {
            cellClass: "color",
            hasSelect: true
        },// 颜色
        {
            cellClass: "format",
            hasSelect: true
        },// 规格
        {
            cellClass: "measurementUnit grey"
        },// 单位
        {
            cellClass: "storehouse",
            hasSelect: true
        },// 仓库
        {
            cellClass: "outprice",
            hasInput: true
        }, {
            cellClass: "number blue"
        },// 数量
        ];

        $.each(_lineInfoSet, function(i, v) {

            var $input;
            var $cell = $('<div></div>').addClass('cell ' + v.cellClass);

            if (v.hasInput) {
                $input = $('<input>').prop({
                    'type': 'text',
                    'autocomplete': 'off'
                }).addClass('editable v_float_3');
                $cell.append($input);
            }

            if (v.hasSelect) {
                var $select = $('<select class="v_required"></select>');
                $cell.append($select);
            }

            $cell.appendTo($lineInfoWrap);

        });

        $line.append($indexWrap).append($lineInfoWrap);

        return $line;
    }

    function autoAddline(index, item) {

        var $line = addline(index + 1).appendTo(com.focusPage('#list'));
        var $lineInfoWrap = $line.find('div.content');

        $line.attr({
            'data-gid': item.goods.gid,
            'data-aiid': item.aiid
        });

        $lineInfoWrap.find('div.no').text(item.goods.no);
        $lineInfoWrap.find('div.name').text(item.goods.name);
        $lineInfoWrap.find('div.measurementUnit').text(item.goods.measurementUnit);
        $lineInfoWrap.find('div.outprice input').val(item.selling);
        $lineInfoWrap.find('div.number').text(item.num);

        $line.find('.storehouse select').bindData(accessories.storehouses, "shid", "name");
        $line.find('.color select').bindData(item.colors || [], "cid", "name");
        $line.find('.format select').bindData(item.formats || [], "fid", "info");

    }
});
