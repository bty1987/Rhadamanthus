jQuery(function ($) {

    var manifest = {
        mid: params.manifest.mid,
        manifestType: params["manifest.type"],
        items: {
            list: com.focusPage('#list'),
        },
        record: {},
        storehouses: []
    };

    com.post(api.inventory.queryStorehouseForSelf, {}, function (res) {
        manifest.storehouses = res.storehouses;
    }, null, false);

    com.post(api.inventory.queryManifestItemByMid, {"manifest.mid": manifest.mid}, function (res) {

        $.each(res.manifestItems, function (i, v) {

            var $line = addline(i).attr({
                "data-miid": v.miid,
                "data-gid": v.goods.gid,
                "id": "line" + v.goods.gid
            });

            $line.find('div.no').text(v.goods.no);
            $line.find('div.name').text(v.goods.name);
            $line.find('div.category').text(v.goods.category);
            $line.find('div.brand').text(v.goods.brand);
            $line.find('div.measurementUnit').text(v.goods.measurementUnit);

            $line.find('div.color').html(v.color.name);
            $line.find('div.format').html(v.format.info);
            $line.find('div.storehouse').html(manifest.manifestType == 1 ? v.instorehouse.name : manifest.manifestType == 3 ? v.outstorehouse.name : "");

            $line.find('div.pieceNum').text(v.goods.pieceNum);

            $line.find('div.inprice input').val(v.inprice);
            $line.find('div.outprice input').val(v.outprice);
            $line.find('div.number input').val(v.surplus);

        });
    });

    com.focusPage('#addManifestItem').click(function () {
        var num = com.focusPage('.line', '#list').length;
        addline(num + 1);
    });

    //添加一个空行
    function addline(lineindex) {

        var $line = $('<li></li>').addClass('line').appendTo(manifest.items.list);
        var $indexWrap = $('<div></div>').addClass('line-wrap order').append($('<div></div>').addClass('cell index').text(lineindex));
        var $lineInfoWrap = $('<div></div>').addClass('line-wrap content col12');
        var $optWrap = $('<div></div>').addClass('line-wrap action');

        var _lineInfoSet = [
            {cellClass: "no"},
            {cellClass: "name", hasInput: true},
            {cellClass: "category grey"},
            {cellClass: "brand grey"},
            {cellClass: "measurementUnit"},
            {cellClass: "color", hasSelectr: true},
            {cellClass: "format", hasSelect: true},
            {cellClass: "storehouse", hasSelect: true},
            {cellClass: "pieceNum"},
            {cellClass: "inprice", hasInput: true},
            {cellClass: "outprice", hasInput: true},
            {cellClass: "num", hasInput: true}
        ];

        var $btncheck = $('<a class="color-green" style="font-size: 18px"><i class="icon-ok"></i></a>');
        var $btndel = $('<a class="color-red" style="font-size: 18px"><i class=" icon-remove"></i></a>');

        $.each(_lineInfoSet, function (i, v) {

            var $cell = $('<div></div>').addClass('cell ' + v.cellClass);

            if (v.hasInput) {
                var $input = $('<input>').prop({'type': 'text', 'autocomplete': 'off'}).addClass('editable v_float_3');
                $cell.append($input);
            }

            if (v.hasSelect) {
                $cell.append($('<select class="v_required"></select>'));
            }

            $cell.appendTo($lineInfoWrap);
        });

        $optWrap.append($('<div></div>').addClass('cell option').append($btncheck).append($btndel));

        $line.append($indexWrap).append($lineInfoWrap).append($optWrap);

        com.initTypeahead(".name input", api.data.queryGoodsByName, "goods.name", {}, "goodes", "gid", "name", function (list, k, v) {
            $.each(list, function (index, val) {

                if (val.gid == k) {
                    $lineInfoWrap.find('.no').text(val.no);
                    $lineInfoWrap.find('.measurementUnit').text(val.measurementUnit);
                    $lineInfoWrap.find('.pieceNum').text(val.pieceNum);
                    $line.attr('data-gid', val.gid);
                    $line.attr('id', "line" + val.gid);

                    $line.find(".color select").bindData(manifest.storehouses, "shid", "name");

                    com.post(api.data.queryColorForEnableByGid, {
                        "color.gid": val.gid
                    }, function (res) {
                        $line.find(".color select").bindData(res.colors, "cid", "name");
                    });

                    com.post(api.data.queryFormatForEnableByGid, {
                        "format.gid": val.gid
                    }, function (res) {
                        $line.find(".format select").bindData(res.formats, "fid", "info");
                    })
                }
            });

            return v;
        });

        $btncheck.click(function (e) {

            if (com.validate($line.attr(id), "bottom")) {
                return false;
            }

            var miid = $line.attr("data-miid");

            var num = $line.find(".num input").val();
            var inprice = $line.find(".inprice input").val();
            var outprice = $line.find(".outprice input").val();

            var url = api.inventory.updateManifestItem;
            var options = {
                "manifest.mid": manifest.mid,
                "manifestItem.miid": miid
            };

            if (!miid) {
                url = api.inventory.addManifestItem;

                var storehouse = manifest.manifestType == 1 ? "instorehouse" : manifest.manifestType == 3 ? "outstorehouse" : "";

                options["manifestItem.goods.gid"] = $line.attr("data-gid");
                options["manifestItem.color.cid"] = $line.find('.color select').val();
                options["manifestItem.format.fid"] = $line.find('.format select').val();
                options["manifestItem." + storehouse + ".shid"] = $line.find('.storehouse select').val();
            }

            com.post(url, options, function (data) {

                com.showAlert(com.info, "操作成功");

                var manifestItem = data.manifestItem;

                $line.find(".name").html($line.find(".name input").val());
                $line.find(".color select").length != 0 && $line.find(".color").html($line.find(".color select").find("option:selected").text());
                $line.find(".format select").length != 0 && $line.find(".format").html($line.find(".format select").find("option:selected").text());
                $line.find(".storehouse select").length != 0 && $line.find(".storehouse").html($line.find(".storehouse select").find("option:selected").text());

                $line.attr('data-miid', manifestItem.miid);

            }, function (e) {
                btn.button('reset');
                com.showAlert(com.error, e.errorMsg);
            })
        });

        $btndel.click(function (e) {

            var miid = $line.attr("data-miid");

            if (miid) {
                com.post(api.inventory.deleteManifestItem, {
                    "manifest.mid": manifest.mid,
                    "manifestItem.miid": miid
                }, function (res) {
                    $line.remove();
                });
            } else {
                $line.remove();
            }
        });

        return $line;
    }

    function reorder() {
        var $list = com.focusPage('.line', '#list');
        $list.length && $list.each(function (i) {
            var $this = $(this);
            $this.find('.index').text(i + 1)
        });
    }

});
