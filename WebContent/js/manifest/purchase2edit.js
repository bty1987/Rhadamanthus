jQuery(function ($) {

    var purchase = {
        pid: params["purchase.pid"],
        items: {
            list: com.focusPage('#list'),
            createTime: com.focusPage("#createTime"),
            comment: com.focusPage('#comment')
        },
        btns:{
            addPurchaseItem:com.focusPage('#addPurchaseItem'),
            cancelBtn:com.focusPage('#cancelBtn'),
            submitBtn:com.focusPage('#submitBtn')
        },
        record: {},
    };

    com.post(api.inventory.queryPurchaseByPid, {"purchase.pid": purchase.pid}, function (res) {
        purchase.items.createTime.val(res.purchase.createTime);
        purchase.items.comment.val(res.purchase.comment);
    });

    com.post(api.inventory.queryPurchaseItemByPid, {"purchase.pid": purchase.pid}, function (res) {
        $.each(res.purchaseItems, function (i, v) {

            var $line = addline(i + 1).appendTo(purchase.items.list).attr({
                "data-gid": v.goods.gid,
                "data-piid": v.piid,
                "id": "line" + v.goods.gid
            });

            $line.find('div.no').text(v.goods.no);
            $line.find('div.name').text(v.goods.name);
            $line.find('div.category').text(v.goods.category);
            $line.find('div.brand').text(v.goods.brand);
            $line.find('div.measurementUnit').text(v.goods.measurementUnit);

            $line.find('div.color').html(v.color.name);
            $line.find('div.format').html(v.format.info);

            $line.find('div.pieceNum').text(v.goods.pieceNum);

            $line.find('div.inprice input').val(v.inprice);
            $line.find('div.number input').val(v.num);
        });
    });

    //添加一条空行
    purchase.btns.addPurchaseItem.click(function () {

        if (com.validate('list', "bottom")) {
            return false;
        }

        var $lines = com.focusPage('.line', '#list');

        addline($lines.length + 1);

    });


    //关闭弹窗
    purchase.btns.cancelBtn.click(function () {
        com.closePopup();
    });

    //表单提交
    purchase.btns.submitBtn.click(function () {

        var options = {
            "purchase.pid": purchase.pid,
            "purchase.comment": purchase.items.comment.val()
        };

        com.post(api.inventory.updatePurchase, options,function (res) {
            com.closePopup();
        });
    });

    //添加一个空行
    function addline(lineindex) {

        var $line = $('<li></li>').addClass('line').appendTo(com.focusPage('#list'));
        var $indexWrap = $('<div></div>').addClass('line-wrap order').append($('<div></div>').addClass('cell index').text(lineindex));
        var $lineInfoWrap = $('<div></div>').addClass('line-wrap content col10');
        var $optWrap = $('<div></div>').addClass('line-wrap action');

        var _lineInfoSet = [
            {cellClass: "no blue"},
            {cellClass: "name grey", hasInput: true, validate: "v_required"},
            {cellClass: "category grey"},
            {cellClass: "brand grey"},
            {cellClass: "measurementUnit grey"},
            {cellClass: "color grey", hasSelect: true},
            {cellClass: "format grey", hasSelect: true},
            {cellClass: "pieceNum blue"},
            {cellClass: "inprice", hasInput: true, validate: "v_float_3"},
            {cellClass: "number", hasInput: true, validate: "v_float_3"}
        ];

        var $btncheck = $('<a id="trueBtn" class="green" style="font-size: 18px"><i class="icon-ok"></i></a>');
        var $btndel = $('<a class="red" style="font-size: 18px"><i class=" icon-remove"></i></a>');

        $.each(_lineInfoSet, function (i, v) {
            var $cell = $('<div></div>').addClass('cell ' + v.cellClass);

            if (v.hasInput) {

                var $input = $('<input>').prop({'type': 'text', 'autocomplete': 'off'}).addClass('editable');
                if (v.validate) {
                    $input.addClass(v.validate);
                }

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
                    $lineInfoWrap.find('.name input').val(val.name);
                    $lineInfoWrap.find('.category').text(val.category);
                    $lineInfoWrap.find('.brand').text(val.brand);
                    $lineInfoWrap.find('.measurementUnit').text(val.measurementUnit);
                    $lineInfoWrap.find('.pieceNum').text(val.pieceNum);


                    $line.attr('data-gid', val.gid).attr("id", "line" + val.gid);


                    com.post(api.data.queryColorForEnableByGid, {
                        "color.gid": val.gid
                    }, function (res) {
                        com.focusPage('li[data-gid="' + val.gid + '"] .color select').bindData(res.colors, "cid", "name");
                    });

                    com.post(api.data.queryFormatForEnableByGid, {
                        "format.gid": val.gid
                    }, function (res) {
                        com.focusPage('li[data-gid="' + val.gid + '"] .format select').bindData(res.formats, "fid", "info");
                    });
                }
            });

            return v;
        });

        $btncheck.click(function (e) {
            updatePurchaseItem($line);
        });

        $btndel.click(function (e) {
            deletePurchaseItem($line);
        });

        return $line;
    }

    //重排序
    function reorder() {
        var $list = com.focusPage('.line', '#list');
        $list.length && $list.each(function (i, e) {
            var $this = $(e);
            $this.find('.index').text(i + 1);
        });
    }

    function updatePurchaseItem($line, btn) {

        if (com.validate('list', 'bottom')) {
            return false;
        }

        var piid = $line.attr('data-piid');

        var url = api.inventory.updatePurchaseItem;
        var options = {
            "purchase.pid": purchase.pid,
            "purchaseItem.piid": piid,
            "purchaseItem.num": $line.find('.number input').val(),
            "purchaseItem.inprice": $line.find('.inprice input').val()
        };

        if (!piid) {
            url = api.inventory.addPurchaseItem;
            options["purchaseItem.goods.gid"] = $line.attr('data-gid');
            options["purchaseItem.color.cid"] = $line.find('.color select').val();
            options["purchaseItem.format.fid"] = $line.find('.format select').val();
        }

        com.post(url, options, function (res) {
            com.showAlert(com.info, "操作成功");

            var purchaseItem = res.purchaseItem;

            $line.find(".name").html($line.find(".name input").val());
            $line.find(".color select").length != 0 && $line.find(".color").html($line.find(".color select").find("option:selected").text());
            $line.find(".format select").length != 0 && $line.find(".format").html($line.find(".format select").find("option:selected").text());

            $line.attr('data-piid', purchaseItem.piid);
        });
    }

    function deletePurchaseItem($line) {

        var piid = $line.attr("data-piid");

        if (piid) {
            com.post(api.inventory.deletePurchaseItem, {
                "purchase.pid": purchase.pid,
                "purchaseItem.piid": piid
            }, function (res) {
                $line.remove();
            });
        } else {
            $line.remove();
        }
    }

});
