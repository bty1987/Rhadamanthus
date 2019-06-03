jQuery(function ($) {

    var purchase = {

        saveBtn: com.focusPage("#saveBtn"),
        cancellBtn: com.focusPage("#cancelBtn"),

        purchaseItems: {
            pid: com.focusPage("#pId")
        },

        validator: {
            float3: {
                type: "v_float_3",
                regex: /^(\d+|\d+\.[0-9]{1,3})$/,
                errorMsg: "单价输入内容格式错误"
            }
        },

        items: {
            createTime: com.focusPage("#createTime"),
            deliveryTime: com.focusPage("#deliveryTime"),
            comment: com.focusPage("#comment"),
            totalSpan: com.focusPage("#totalSpan")
        },

        record: {}
    };

    $.extend(com.validator, purchase.validator);

    com.focusPage('.date-picker').datepicker(com.datepickerdefault);

    //添加一条空行
    addline(1).addClass('current');

    com.focusPage('#addPurchase').click(function () {

        if (com.validate('list', 'bottom')) {
            return;
        }

        var num = com.focusPage('.line', '#list').length;

        cyclTotal();

        addline(num + 1);

    });

    //保存添加采购单
    com.focusPage('#submitPurchase').click(function () {

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

        var options = {};

        cyclTotal();

        var purchaseTime = purchase.items.createTime.val();
        var deliveryTime = purchase.items.deliveryTime.val(); // 交付时间
        var comment = purchase.items.comment.val(); // 备注

        options = {
            "purchase.comment": comment,
            "purchase.deliveryTime": deliveryTime
        };

        var $list = com.focusPage('li.line', '#list');

        $list.length && $list.each(function (i) {

            var $this = $(this);

            options["purchaseItems[" + i + "].goods.gid"] = $this.attr('data-pgid');            //– 商品编号
            options["purchaseItems[" + i + "].color.cid"] = $this.find('.color select').val();  //– 颜色
            options["purchaseItems[" + i + "].format.fid"] = $this.find('.format select').val();//– 规格
            options["purchaseItems[" + i + "].num"] = $this.find('.number input').val();           //– 数量
            options["purchaseItems[" + i + "].inprice"] = $this.find('.inprice input').val();  //- 单价
        });

        com.post(api.inventory.addPurchase, options, function (data) {

            com.showAlert(com.info, "操作成功");

            com.focusPage('#list').empty();

            purchase.items.createTime.val(null);
            purchase.items.deliveryTime.val(null);
            purchase.items.comment.val(null);
            purchase.items.totalSpan.text(0);

            //添加一条空行
            addline(1).addClass('current');

        }, null, false);
    });


    //添加一个空行
    function addline(lineindex) {

        var $line = $('<li></li>').addClass('line').appendTo(com.focusPage('#list'));
        var $indexWrap = $('<div></div>').addClass('line-wrap order').append($('<div></div>').addClass('cell index').text(lineindex));
        var $lineInfoWrap = $('<div></div>').addClass('line-wrap content col9');
        var $optWrap = $('<div></div>').addClass('line-wrap action');

        var _lineInfoSet = [
            {cellClass: "no"},         //商品编号
            {cellClass: "name", hasInput: true},        //商品名称
            {cellClass: "category"},   //品类
            {cellClass: "brand"},       //品牌
            {cellClass: "color", hasSelect: true},   //颜色
            {cellClass: "format", hasSelect: true}, //规格
            {cellClass: "number", hasInput: true},         //数量
            {cellClass: "pieceNum"},                   //件数
            {cellClass: "inprice", hasInput: true}   //单价
        ];

        var $btncheck = $('<a class="green" style="font-size: 18px"><i class="icon-ok"></i></a>');
        var $btndel = $('<a class="red" style="font-size: 18px"><i class=" icon-remove"></i></a>');

        $.each(_lineInfoSet, function (i, v) {

            var $input;
            var $cell = $('<div></div>').addClass('cell ' + v.cellClass);

            if (v.hasInput) {
                $input = $('<input>').prop({'type': 'text', 'autocomplete': 'off'}).addClass('editable');

                if (v.cellClass == "name") {
                    $input.addClass('v_required');
                }

                if (v.cellClass == "number" || v.cellClass == "inprice") {
                    $input.addClass('v_float_3');
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

        com.initTypeahead(".name input", api.inventory.queryGoodsByName, "goods.name", {}, "goodes", "gid", "name", function (list, k, v) {
            $.each(list, function (index, val) {

                if (val.gid == k) {

                    $lineInfoWrap.find('.no').text(val.no);
                    $lineInfoWrap.find('.category').text(val.category);
                    $lineInfoWrap.find('.brand').text(val.brand);
                    $lineInfoWrap.find('.pieceNum').text(val.pieceNum);
                    $line.attr('data-pgid', val.gid);
                    $line.attr('data-gid', val.gid + "_" + lineindex);

                    com.post(api.inventory.queryColorForEnableByGid, {
                        "color.gid": val.gid
                    }, function (res) {
                        com.focusPage('li[data-gid="' + val.gid + '_' + lineindex + '"] .color select').bindData(res.colors, "cid", "name");
                    });

                    com.post(api.inventory.queryFormatForEnableByGid, {
                        "format.gid": val.gid
                    }, function (res) {
                        com.focusPage('li[data-gid="' + val.gid + '_' + lineindex + '"] .format select').bindData(res.formats, "fid", "info");
                    });

                }
            });

            return v;
        });

        $btncheck.click(function (e) {

            if (com.validate('list', 'bottom')) {
                return false;
            }

            cyclTotal();
        });

        $btndel.click(function (e) {

            $line.remove();

            cyclTotal();

            reorder();
        });

        return $line;
    }

    //重排序
    function reorder() {
        var $list = com.focusPage('.line', '#list');

        $list.length && $list.each(function (i, e) {
            $(e).find('.index').text(i + 1);
        });
    }

    //计算总价
    function cyclTotal() {

        var _total = 0;

        var $list = com.focusPage('.line', '#list');

        $list.length && $list.each(function () {

            var $this = $(this);

            if ($this.find('.inprice input').val()) {

                var inprice = parseFloat($this.find('.inprice input').val());
                var num = parseFloat($this.find('.number input').val());
                var $sum = utils.accMul(inprice, num);//单个商品的总价

                _total = utils.accAdd($sum, _total);//采购单总价
            }
        });

        com.focusPage("#totalSpan").text(utils.changeThrDecimal(_total));
    }

});
