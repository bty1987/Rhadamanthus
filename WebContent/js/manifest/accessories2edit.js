jQuery(function ($) {

    var accessories = {
        aid: params["accessories.aid"],
        orderId: params["accessories.orderId"],
        items: {},
        record: {},
    };

    com.post(api.inventory.queryAccessoriesItemByAid, {"accessoriesItem.aid": accessories.aid}, function (res) {

        var $list = com.focusPage('#list');
        var $lines = $list.find('.line');

        $.each(res.accessoriesItems, function (i, v) {

            var $line = addline(1 + $lines.length).attr({
                'data-gid': v.goods.gid,
                'data-aiid': v.aiid,
                'data-selling': v.selling,
                'data-caid': v.caid
            });

            $line.find('div.no').text(v.goods.no);
            $line.find('div.name').text(v.goods.name);
            $line.find('div.category').text(v.goods.category);
            $line.find('div.brand').text(v.goods.brand);
            $line.find('div.measurementUnit').text(v.goods.measurementUnit);
            $line.find('div.number input').val(v.surplus);
            $line.find('div.pieceNum').text(v.goods.pieceNum);
        });
    });

    com.focusPage('#addAccessoriesItem').click(function () {

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
            "orderId": accessories.orderId
        };

        com.initTypeahead(".name input", api.data.queryAoodsByName, "aoods.goods.name", optionss, "aoodes", "gid", "name", function (list, k, v) {
            $.each(list, function (index, val) {

                if (val.goods.gid == k) {
                    $lineInfoWrap.find('.no').text(val.goods.no);
                    $lineInfoWrap.find('.measurementUnit').text(val.goods.measurementUnit);
                    $lineInfoWrap.find('.category').text(val.goods.category);
                    $lineInfoWrap.find('.brand').text(val.goods.brand);
                    $lineInfoWrap.find('.pieceNum').text(val.goods.pieceNum);

                    $line.attr({'data-gid': val.goods.gid, 'data-selling': val.goods.selling});
                }
            });

            return v;
        });

        $btncheck.click(function (e) {

            if (com.validate('list', 'bottom')) {
                return false;
            }

            var aiid = $line.attr('data-aiid');
            var gid = $line.attr('data-gid');
            var selling = $line.attr('data-selling');
            var name = $line.find(".name input").val();
            var num = $line.find('.number input').val();

            var url = api.inventory.addAccessoriesItem;
            var options = {
                "accessories.aid": accessories.aid,
                "accessoriesItem.goods.gid": gid,
                "accessoriesItem.num": num,
                "accessoriesItem.selling": selling,
                "accessoriesItem.total" : utils.accMul(num, selling)
            };

            if (aiid) {
                url = api.inventory.updateAccessoriesItem;
                options["accessoriesItem.aiid"] = aiid;
            }

            com.post(url, options, function (data) {
                com.showAlert(com.info, "操作成功");

                $line.attr('data-aiid', data.accessoriesItem.aiid);
                $line.find('.name').html(name);
            });
        });

        $btndel.click(function (e) {

            var aiid = $(this).parents('li.line').attr('data-aiid');

            if (!aiid) {
                $line.remove();
            } else {
                com.post(api.inventory.deleteAccessoriesItem, {"accessoriesItem.aiid": aiid}, function (data) {
                    com.showAlert(com.info, "操作成功");
                    $line.remove();
                });
            }
        });

        return $line;
    }

});
