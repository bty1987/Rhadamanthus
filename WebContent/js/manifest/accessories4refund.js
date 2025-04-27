jQuery(function ($) {

    var accessories = {
        aid: params.manifest.aid,

        refundBtn: com.focusPage("#refundBtn"),
        cancellBtn: com.focusPage("#cancelBtn"),

        items: {
            list: com.focusPage('#list')
        }
    };

    accessories.refundBtn.click(function () {

        if (com.validate('list', 'bottom')) {
            return false;
        }

        var $checks = com.focusPage('input[type="checkbox"]:checked', '#list');
        if ($checks.length == 0) {
            com.showAlert(com.warning, "请选择商品");
            return false;
        }

        var options = {
            "accessories[0].aid": accessories.aid
        };

        for (var i = 0; i < $checks.length; i++) {

            var $check = $($checks[i]);
            var $line = $check.parents('li.line');
            var crnumInput = $line.find(".num input").addClass('v_float_3');
            if (com.validate($line.attr("id"), "left")) {
                return false;
            }

            var num = $line.find(".surplus").text();
            var crnum = crnumInput.val();
            if (utils.accSub(num, crnum) < 0) {
                com.showAlert(com.warning, "辅料项退货数不足");
                crnumInput.select();
                return false;
            }
            options["accessoriesItems[" + i + "].miid"] = $line.attr("data-miid");
            options["accessoriesItems[" + i + "].aiid"] = $line.attr("data-aiid");
            options["accessoriesItems[" + i + "].goods.gid"] = $line.attr("data-gid");
            options["accessoriesItems[" + i + "].color.cid"] = $line.attr("data-cid");
            options["accessoriesItems[" + i + "].format.fid"] = $line.attr("data-fid");
            options["accessoriesItems[" + i + "].storehouse.shid"] = $line.attr("data-shid");
            options["accessoriesItems[" + i + "].outprice"] = $line.find(".outprice").text();
            options["accessoriesItems[" + i + "].num"] = crnum;

        }

        com.post(api.inventory.addManifestForAR, options, function (res) {

            kingdeeUtils.accessories(accessories.aid, 8, "SalesReturnStock");
        });

    });

    accessories.cancellBtn.click(function () {
        com.closePopup();
    });

    function resultList(list) {
        $.each(list, function (i, v) {
            var $line = addline(i + 1).appendTo(accessories.items.list).attr({
                "data-gid": v.goods.gid,
                "data-miid": v.miid,
                "data-aiid": v.aiid,
                "data-cid": v.color.cid,
                "data-fid": v.format.fid,
                "data-shid": v.outstorehouse.shid,
                "id": "line" + v.goods.gid
            });
            $line.find('div.no').text(v.goods.no);
            $line.find('div.name').text(v.goods.name);
            $line.find('div.category').text(v.goods.category);
            $line.find('div.brand').text(v.goods.brand);
            $line.find('div.color').text(v.color.name);
            $line.find('div.format').text(v.format.info);
            $line.find('div.measurementUnit').text(v.goods.measurementUnit);
            $line.find('div.storehouse').text(v.outstorehouse.name);
            $line.find('div.outprice').text(v.outprice);
            $line.find('div.surplus').text(v.surplus);
        });
    }

    //添加一个空行
    function addline(lineindex) {

        var $line = $('<li></li>').addClass('line');
        var _label = $('<label></label>');
        var $input = $('<input>').attr({"type": "checkbox"}).addClass('ace ace-checkbox-2 hide');
        var _span = $('<span></span>').addClass('lbl grey bigger-150').css('font-weight', 'bold');

        _label.append($input).append(_span);

        var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index').html(_label));
        var $lineInfoWrap = $('<div></div>').addClass('line-wrap content col11');

        var _lineInfoSet = [
            {cellClass: "no blue"},//编号
            {cellClass: "name grey"},//名称
            {cellClass: "category grey"},//品类
            {cellClass: "brand grey"},//品牌
            {cellClass: "color grey"},//颜色
            {cellClass: "format grey"},//规格
            {cellClass: "measurementUnit grey"},//单位
            {cellClass: "storehouse grey"},//出货仓库
            {cellClass: "outprice blue"},//出库价
            {cellClass: "surplus blue"},//数量
            {cellClass: "num", hasInput: true}//退货数量
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

    function accessoriesAdd() {

        var options = {
            "accessoriesManifest.accessories.aid": params.manifest.accessories.aid,
            "accessoriesManifest.manifest.type": 7
        };

        com.post(api.inventory.queryManifestByAid, options, function (res) {
            $.each(res.manifests, function (i, v) {
                com.post(api.inventory.queryManifestItemByMid, {"manifest.mid": v.mid}, function (res) {
                    resultList(res.manifestItems);
                });
            })
        }, null, false);

    }

    accessoriesAdd();

});