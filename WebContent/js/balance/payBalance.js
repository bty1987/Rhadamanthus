jQuery(function($) {

    var payBalance = {

        btns: {
            refundBtn: com.focusPage("#refundBtn"),
            cancellBtn: com.focusPage("#cancelBtn"),
        },

        items: {
            list: com.focusPage('#list'),
        },
    };

    function queryAccountes() {

        com.post(api.balance.queryAccountForTeller, {}, function (res) {
            $.each(res.accountes, function(i, v) {
                resultList(i, v);
            });
        }, null, false);
    }

    queryAccountes();

    payBalance.btns.refundBtn.click(function() {

        if (com.validate('list', 'bottom')) {
            return false;
        }
        var $checks = com.focusPage('input[type="checkbox"]:checked', '#list');

        if ($checks.length == 0) {
            com.showAlert(com.warning, "请选择账户");
            return false;
        }

        var options = {
            "balance.bid": params.balance.bid,
        };

        for (var i = 0; i < $checks.length; i++) {
            var $check = $($checks[i]);
            var $line = $check.parents('li.line');
            var crnumInput = $line.find(".money input").addClass('v_float_3');
//            if (com.validate($line.attr("id"), "left")) {
//                return false;
//            }

            var crnum = crnumInput.val();

            if (!crnum) {
                com.showAlert(com.warning, "请输入操作额");
                crnumInput.select();
                return false;
            }
            if (crnum < 0) {
                com.showAlert(com.warning, "操作额不能为负数");
                crnumInput.select();
                return false;
            }

            if (params.balance.surplus < crnum) {
                com.showAlert(com.warning, "余额不足");
                crnumInput.select();
                return false;
            }

            options["accountes[" + i + "].money"] = crnum;
            options["accountes[" + i + "].aid"] = $line.attr("data-miid");

        }

        com.post(api.balance.payBalance, options ,function() {
            com.focusPage('#list').empty();
            queryAccountes();
            com.showAlert(com.info, "操作成功");
        });

    });

    payBalance.btns.cancellBtn.click(function() {
        com.closePopup();
    });

    function resultList(i, v) {
        var $line = addline(i + 1).appendTo(payBalance.items.list).attr({
            "data-miid": v.aid,
        });
        $line.find('div.name').text(v.name);
        $line.find('div.belonger').text(v.belonger.currentName);
        $line.find('div.creater').text(v.creater.currentName);
        $line.find('div.createTime').text(v.createTime);
        $line.find('div.referMoney').text(v.referMoney);
        $line.find('div.realMoney').text(v.realMoney);
        $line.find('div.surplus').text(v.surplus);

    }

    // 添加一个空行
    function addline(lineindex) {

        var $line = $('<li></li>').addClass('line');
        var _label = $('<label></label>');
        var $input = $('<input>').attr({"type": "checkbox"}).addClass('ace ace-checkbox-2 hide');
        var _span = $('<span></span>').addClass('lbl grey bigger-150').css('font-weight', 'bold');

        _label.append($input).append(_span);

        var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index').html(_label));
        var $lineInfoWrap = $('<div></div>').addClass('line-wrap content col8');

        var _lineInfoSet = [
            {cellClass: "name grey"},
            {cellClass: "belonger grey"},
            {cellClass: "creater grey"},
            {cellClass: "createTime grey"},
            {cellClass: "referMoney blue"},
            {cellClass: "realMoney blue"},
            {cellClass: "surplus blue"},
            {cellClass: "money ", hasInput: true},
        ];

        $.each(_lineInfoSet, function(i, v) {
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