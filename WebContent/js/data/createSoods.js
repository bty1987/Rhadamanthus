$(function(){

    var soods = {
        btns: {
            addSoodsBtn: com.focusPage('#addSoodsBtn'),
            backQuoteItemBtn: com.focusPage('#backQuoteItemBtn'),
            addSoodsItemBtn: com.focusPage('#addSoodsItemBtn'),
            updateSoodsItemBtn: com.focusPage("#updateSoodsItemBtn")
        },
        modals: {
            addSoodsModal: com.focusPage("#addSoodsModal"),
            updateSoodsModal: com.focusPage("#updateSoodsModal")
        },
        items: {
            goods: com.focusPage("#goodsName"),
            num: com.focusPage("#num"),
            selling: com.focusPage("#selling")
        },
        uitems: {
            uSelling: com.focusPage("#uSelling")
        },
        sid: null,
        quoteId: params["qiid"]
    };

    soods.btns.addSoodsItemBtn.bindClick(saveData);
    soods.btns.updateSoodsItemBtn.bindClick(updateData);

    soods.modals.addSoodsModal.on("hide.bs.modal", function(e) {
        com.clearValidator();
        com.cleanTypeahead("goodsName");
        com.cleanItems(soods.items);
    });

    soods.modals.updateSoodsModal.on("hide.bs.modal", function(e) {
        com.clearValidator();
        com.cleanItems(soods.uitems);
    });

    com.initTypeahead('goodsName', api.data.queryGoodsByName, "goods.name", {}, "goodes", "gid", "name", null);

    soods.btns.backQuoteItemBtn.click(function () {
        com.closePopup();
    });

    var displayFunc = (function () {

        var renderList = function (tableId, listData) {
            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (listData && listData.length) {
                $.each(listData, function (i, v) {
                    var $liLine = creatLine(v);

                    $liLine.appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function (v) {

            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.goods.name));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnCompile = $('<a></a>').addClass('btn btn-minier btn-yellow').html('编辑');
            var $btnDel = $('<a></a>').addClass('btn btn-minier btn-success').html('删除');

            var propertyArr = [
                ["商品品牌: ", v.goods.brand, "blue"],
                ["商品品类: ", v.goods.category, "blue"],
                ["状态: ", v.status == 0 ? "有效":"无效", "red"],
                ["数量: ", v.num, "blue"],
                ["售价:", v.selling, "blue"],
            ];

            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $divBtnWrap.append($btnCompile).append($btnDel).appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            $btnCompile.click(function() {
                soods.sid = v.sid;
                soods.modals.updateSoodsModal.modal("show");
            });

            $btnDel.click(function() {
                com.post(api.data.deleteSoods, {"soods.sid": v.sid}, function(e) {
                    com.showAlert(com.info, "操作成功");
                    $liLine.remove();
                });
            });

            return $liLine;
        };

        return {
            init: function () {
                com.post(api.data.querySoodsByQiid, {"soods.quotationItem.qiId": soods.quoteId}, function(res){
                    com.focusPage('#soodsResultList').html(null);
                    renderList('soodsResultList', res.soodes);
                });
            },
            drawLine: function (v) {
                return creatLine(v);
            }
        }

    })();

    displayFunc.init();

    soods.btns.addSoodsBtn.click(function(e){
        soods.modals.addSoodsModal.modal("show");
    });

    function saveData() {
        if (com.validate('addSoodsModal')) {
            return false;
        }

        var gid = com.typeahead("goodsName");

        if (!gid) {
            com.showAlert(com.error, "数据绑定失败");
            soods.modals.addSoodsModal.modal("hide");
            return false;
        }

        var option = {
            "soods.goods.gid": gid,
            "soods.quotationItem.qiId": soods.quoteId,
            "soods.num": soods.items.num.val(),
            "soods.selling": soods.items.selling.val()
        };

        com.post(api.data.addSoods, option, function(e){
            displayFunc.init();
            com.showAlert(com.info, "操作成功");

            soods.modals.addSoodsModal.modal("hide");
        });
    }

    function updateData() {
        if (com.validate('updateSoodsModal')) {
            return false;
        }

        var option = {
            "soods.sid": soods.sid,
            "soods.selling": soods.uitems.uSelling.val()
        };

        com.post(api.data.updateSoods, option, function(e){
            displayFunc.init();
            com.showAlert(com.info, "操作成功");

            soods.modals.updateSoodsModal.modal("hide");
        });
    }

})();