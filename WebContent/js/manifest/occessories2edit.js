jQuery(function ($) {

    var occessories = {
        oid: params.manifest.oid,
        orderId: params.manifest.orderId,
        items: {},
        record: {},
    };

    com.post(api.inventory.queryOccessoriesItemByAid, {"occessoriesItem.oid": occessories.oid}, function (res) {

        var $list = com.focusPage('#list');
        var $lines = $list.find('.line');

        $.each(res.occessoriesItems, function (i, v) {
            var $line = addline(1 + $lines.length).attr({
                'data-gid': v.goods.gid,
                'data-oiid': v.oiid,
                'data-selling': v.selling,
            });

            $line.find('div.no').text(v.goods.no);
            $line.find('div.name').text(v.goods.name);
            $line.find('div.category').text(v.goods.category);
            $line.find('div.brand').text(v.goods.brand);
            $line.find('div.measurementUnit').text(v.goods.measurementUnit);
            $line.find('div.number input').val(v.num);
            $line.find('div.pieceNum').text(v.goods.pieceNum);
        });
    });

    com.focusPage('#addOccessoriesItem').click(function () {

        var $list = com.focusPage('#list');
        var $lines = $list.find('.line');

        addline($lines.length + 1);
    });

    function addline(lineindex) {

        var $line = $('<li></li>').addClass('line').appendTo(com.focusPage('#list'));
        var $indexWrap = $('<div></div>').addClass('line-wrap order').append($('<div></div>').addClass('cell index').text(lineindex));
        var $lineInfoWrap = $('<div></div>').addClass('line-wrap content col7');
        var $optWrap = $('<div></div>').addClass('line-wrap action');

        var _lineInfoSet = [
            {cellClass: "no blue"}, // 编号
            {cellClass: "name grey", hasInput: true, validate: "v_required"}, // 名称
            {cellClass: "category grey"}, // 品类
            {cellClass: "brand grey"}, // 品牌
            {cellClass: "measurementUnit grey"}, // 单位
            {cellClass: "number", hasInput: true, validate: "v_float_3"}, // 数量
            {cellClass: "pieceNum blue"} // 件数
        ];

        var $btncheck = $('<a class="green" style="font-size: 18px"><i class="icon-ok"></i></a>');
        var $btndel = $('<a class="red" style="font-size: 18px"><i class=" icon-remove"></i></a>');

        $.each(_lineInfoSet, function (i, v) {

            var $cell = $('<div></div>').addClass('cell ' + v.cellClass);

            if (v.hasInput) {
                $('<input>').prop({
                    'type': 'text',
                    'autocomplete': 'off'
                }).addClass('editable').addClass(v.validate ? v.validate : '').appendTo($cell)
            }

            $cell.appendTo($lineInfoWrap);
        });

        $optWrap.append($('<div></div>').addClass('cell option').append($btncheck).append($btndel));

        $line.append($indexWrap).append($lineInfoWrap).append($optWrap);

        var optionss = {
            "orderId": occessories.orderId
        };

        com.initTypeahead(".name input", api.data.queryGoodsByName, "goods.name", {}, 'goodes', 'gid', 'name', function (list, k, v) {

            $.each(list, function (index, val) {

                if (val.gid == k) {
                    $lineInfoWrap.find('.no').text(val.no);
                    $lineInfoWrap.find('.measurementUnit').text(val.measurementUnit);
                    $lineInfoWrap.find('.category').text(val.category);
                    $lineInfoWrap.find('.brand').text(val.brand);
                    $lineInfoWrap.find('.pieceNum').text(val.pieceNum);

                    $line.attr({'data-gid': val.gid, 'data-selling': val.selling});
                }
            });

            return v;
        });

        $btncheck.click(function (e) {

            if (com.validate('list', 'bottom')) {
                return false;
            }

            var oiid = $line.attr('data-oiid');
            var gid = $line.attr('data-gid');
            var name = $line.find(".name input").val();
            var num = $line.find('.number input').val();

            var url = api.inventory.addOccessoriesItem;
            var options = {
                "occessoriesItem.num": num,
            };

            if (oiid) {
                url = api.inventory.updateOccessoriesItem;
                options["occessoriesItem.oiid"] = oiid;
            }else {
                options["occessories.oid"] = occessories.oid;
                options["occessoriesItem.goods.gid"] = gid;
            }

            com.post(url, options, function (data) {
                com.showAlert(com.info, "操作成功");

                $line.attr('data-oiid', data.occessoriesItems.oiid);
                $line.find('.name').html(name);
            });
        });

        $btndel.click(function (e) {

            var oiid = $(this).parents('li.line').attr('data-oiid');

            if (!oiid) {
                $line.remove();
            } else {
                com.post(api.inventory.deleteOccessoriesItem, {"occessoriesItem.oiid": oiid}, function (data) {
                    com.showAlert(com.info, "操作成功");
                    $line.remove();
                });
            }
        });

        return $line;
    }

});
