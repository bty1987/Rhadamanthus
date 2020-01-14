jQuery(function ($) {

    var manifest = {

        saveBtn: com.focusPage("#saveBtn"),
        cancellBtn: com.focusPage("#cancelBtn"),

        items: {
            manifestType: com.focusPage("#manifestType"),
            manifestTime: com.focusPage("#manifestTime"),
            manifestTemplate: com.focusPage("#manifestTemplate"),
            comment: com.focusPage("#comment")
        },

        record: {},
        storehouses: []
    };

    com.datetime(manifest.items.manifestTime,"date",false);

    com.post(api.inventory.queryStorehouseForSelf, {}, function (res) {
        manifest.storehouses = res.storehouses;
    }, null, false);

    com.post(api.ds.manifest, {}, function (res) {
        manifest.items.manifestType.bindData(res.createManifestTypes, "key", "value");
    }, null, false);

    com.post(api.inventory.queryManifestTemplate, {}, function (res) {
        manifest.items.manifestTemplate.bindData(res.manifestTemplates, 'mtid', 'name');
    });

    //添加一条空行
    addline(1).addClass('current');

    com.focusPage('#addManifestItem').click(function () {

        if (com.validate('list', 'bottom')) {
            return;
        }

        var num = com.focusPage('.line', '#list').length;

        addline(num + 1);

    });

    com.focusPage('#submitManifest').click(function () {

        var $lines = com.focusPage('li.line', '#list');

        if (!$lines.length) {
            com.showAlert(com.warnng, "请填写商品");
            return false;
        }

        if (com.validate("timelement", "top")) {
            return false;
        }

        if (com.validate('list', 'bottom')) {
            return false;
        }

        var manifestTime = manifest.items.manifestTime.val();
        var manifestType = manifest.items.manifestType.val();
        var comment = manifest.items.comment.val();

        var url = "";
        var storehouse = "";
        var priceinfo = "";

        var options = {
            "manifest.manifestTime": manifestTime,
            "manifest.type": manifestType,
            "manifest.comment": comment,
            "manifest.attachment": ""//– 附件路径
        };

        if (manifestType == 1) {
            url = api.inventory.addManifestForCG;
            storehouse = "instorehouse";
            priceinfo = "inprice";
        } else if (manifestType == 3) {
            url = api.inventory.addManifestForXG;
            storehouse = "outstorehouse";
            priceinfo = "outprice";
        }

        var $list = com.focusPage('li.line', '#list');

        $lines.length && $lines.each(function (i, e) {

            var $this = $(e);

            options["manifestItems[" + i + "].goods.gid"] = $this.attr('data-gid');//– 商品id
            options["manifestItems[" + i + "].color.cid"] = $this.find('.color select').val();//– 商品编号
            options["manifestItems[" + i + "].format.fid"] = $this.find('.format select').val();//– 商品名
            options["manifestItems[" + i + "].num"] = $this.find('.number input').val();//– 数量
            options["manifestItems[" + i + "]." + priceinfo] = $this.find('.price input').val();//– 进货价
            options["manifestItems[" + i + "].comment"] = $this.find('.des input').val();// – 说明

            options["manifestItems[" + i + "]." + storehouse + ".shid"] = $this.find('.storehouse select').val();
        });

        com.post(url, options, function (data) {
            com.showAlert(com.info, "操作成功");

            com.focusPage('#list').empty();

            manifest.items.manifestType.val(1); // 恢复类型
            manifest.items.manifestTime.val(null);
            manifest.items.comment.val("");

            addline(1).addClass('current'); // 添加一条空行

        });
    });

    //添加一个空行
    function addline(lineindex) {

        var $line = $('<li></li>').addClass('line').appendTo(com.focusPage('#list'));
        var $indexWrap = $('<div></div>').addClass('line-wrap order').append($('<div></div>').addClass('cell index').text(lineindex));
        var $lineInfoWrap = $('<div></div>').addClass('line-wrap content col10');
        var $optWrap = $('<div></div>').addClass('line-wrap action');

        var _lineInfoSet = [
            {cellClass: "no"},//编号
            {cellClass: "name", hasInput: true, require: "v_required"},//名称
            {cellClass: "barcode"},//条形码
            {cellClass: "color", hasSelect: true},//颜色
            {cellClass: "format", hasSelect: true},//规格
            {cellClass: "measurementUnit"},//单位
            {cellClass: "storehouse", hasSelect: true},//仓库
            {cellClass: "number", hasInput: true, require: "v_float_3"},//数量
            {cellClass: "price", hasInput: true, require: "v_float_3"},//采购金额
            {cellClass: "des", hasInput: true}//备注
        ];

        var $btncheck = $('<a class="green" style="font-size: 18px"><i class="icon-ok"></i></a>');
        var $btndel = $('<a class="red" style="font-size: 18px"><i class=" icon-remove"></i></a>');

        $.each(_lineInfoSet, function (i, v) {

            var $input;
            var $cell = $('<div></div>').addClass('cell ' + v.cellClass);

            if (v.hasInput) {
                $input = $('<input>').prop({'type': 'text', 'autocomplete': 'off'}).addClass('editable');

                if (v.require) {
                    $input.addClass(v.require);
                }

                if (v.cellClass == "des") {
                    $input.attr('maxlength', '128');
                }

                $cell.append($input);
            }

            if (v.hasSelect) {
                $select = $('<select class="v_required"></select>');
                $cell.append($select);
            }

            $cell.appendTo($lineInfoWrap);
        });

        $optWrap.append($('<div></div>').addClass('cell option').append($btncheck).append($btndel));

        $line.append($indexWrap).append($lineInfoWrap).append($optWrap);

        com.initTypeahead(".name input", api.data.queryGoodsByName, "goods.name", {}, "goodes", "gid", "name", function (list, k, v) {

            $.each(list, function (index, val) {

                if (val.gid == k) {

                    $lineInfoWrap.find('.no').text(val.no);
                    $lineInfoWrap.find('.barcode').text(val.barcode);
                    $lineInfoWrap.find('.measurementUnit').text(val.measurementUnit);
                    $line.attr('data-gid', val.gid);
                    $line.attr('data-pgid', val.gid + '_' + lineindex);

                    com.focusPage('li[data-pgid="' + val.gid + '_' + lineindex + '"] .storehouse select').bindData(manifest.storehouses, "shid", "name");

                    com.post(api.data.queryColorForEnableByGid, {
                        "color.gid": val.gid
                    }, function (res) {
                        com.focusPage('li[data-pgid="' + val.gid + '_' + lineindex + '"] .color select').bindData(res.colors, "cid", "name");
                    });

                    com.post(api.data.queryFormatForEnableByGid, {
                        "format.gid": val.gid
                    }, function (res) {
                        com.focusPage('li[data-pgid="' + val.gid + '_' + lineindex + '"] .format select').bindData(res.formats, "fid", "info");
                    });
                }
            });

            return v;
        });

        $btncheck.click(function (e) {

            if (com.validate('list', 'bottom')) {
                return false;
            }

        });

        $btndel.click(function (e) {
            $line.remove();
            reorder();
        });

        return $line;
    }

    //选择模板添加
    com.focusPage("#addManifestStyle").click(function () {

        if (com.validate('list', 'bottom')) {
            return false;
        }

        var mtid = manifest.items.manifestTemplate.val();
        var index = com.focusPage('.line', '#list').length;

        com.post(api.inventory.queryManifestTemplateItemByMtid, {
            "manifestTemplate.mtid": mtid
        }, function (res) {

            for (var i = 0; i < res.manifestTemplateItems.length; i++) {

                var item = res.manifestTemplateItems[i];

                if (item.goods.status != 0) continue;

                var _index = 1 + index + i;

                addline(_index);

                com.focusPage('#list li:nth-of-type(' + _index + ')').attr('data-gid', item.goods.gid);

                var $lineInfoWrap1 = com.focusPage('#list li:nth-of-type(' + _index + ') div.content');

                $lineInfoWrap1.find('div.no').text(item.goods.no);
                $lineInfoWrap1.find('div.name input').val(item.goods.name);
                $lineInfoWrap1.find('div.barcode').text(item.goods.barcode);
                $lineInfoWrap1.find('div.measurementUnit').text(item.goods.measurementUnit);
                $lineInfoWrap1.find('div.number input').val(0);
                $lineInfoWrap1.find('div.price input').val(0);

                $lineInfoWrap1.find('div.storehouse select').bindData(manifest.storehouses, "shid", "name");

                com.post(api.data.queryColorForEnableByGid, {
                    "color.gid": item.goods.gid
                }, function (data) {
                    $lineInfoWrap1.find('.color select').bindData(data.colors, "cid", "name");
                }, null, false);

                com.post(api.data.queryFormatForEnableByGid, {
                    "format.gid": item.goods.gid
                }, function (data) {
                    $lineInfoWrap1.find('.format select').bindData(data.formats, "fid", "info");
                }, null, false);
            }
        });
    });

    //重排序
    function reorder() {

        com.focusPage('.line', '#list').each(function (i, e) {
            $(e).find('.index').text(i + 1);
        });
    }

});
