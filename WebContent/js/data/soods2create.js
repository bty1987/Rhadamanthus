$(function(){

    var soods = {
        btns: {
            addSoodsBtn: com.focusPage('#addSoodsBtn'),
            addSoodsItemBtn: com.focusPage('#addSoodsItemBtn'),
            updateSoodsItemBtn: com.focusPage("#updateSoodsItemBtn")
        },
        modals: {
            addSoodsItemModal: com.focusPage("#addSoodsItemModal"),
            updateSoodsModal: com.focusPage("#updateSoodsModal")
        },
        items: {
            goods: com.focusPage("#soodsItemName"),
            selling: com.focusPage("#selling")
        },
        uitems: {
            uSelling: com.focusPage("#uSelling")
        },
        sid: null,
        gid: null,
        quotationItem: params["quotationItem"],
        quoteId: params["qiid"]
    };

    soods.btns.addSoodsItemBtn.bindClick(saveData);
    soods.btns.updateSoodsItemBtn.bindClick(updateData);
    soods.modals.addSoodsItemModal.on("hide.bs.modal", function(e) {
        com.clearValidator();
        com.cleanTypeahead("soodsItemName");
        com.cleanItems(soods.items);
    });
    soods.modals.updateSoodsModal.on("hide.bs.modal", function(e) {
        com.clearValidator();
        com.cleanItems(soods.uitems);
    });
    com.initTypeahead('soodsItemName', api.data.querySoodsByName, "soods.goods.name", {}, "soodes", "sid", function (res) {
        soods.gid=res.goods.gid;
        return res["goods"]["name"];
    });

    var displayFunc = (function () {
        var renderList = function (tableId, listData) {
            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (listData && listData.length) {
                $.each(listData, function (i, v) {
                    creatLine(v).appendTo($ul);
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

            ];
            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $divBtnWrap.append($btnDel).appendTo($h3);

            $liLine.append($h3).append($ulProperty);
            $btnCompile.click(function() {
                soods.sid = v.sid;
                soods.modals.updateSoodsModal.modal("show");
            });

            $btnDel.click(function() {
                
                var options = {
                    "soodsItem.siid": v.siid
                };
                
                com.post(api.data.deleteSoodsItem,options, function(e) {
                    com.showAlert(com.info, "操作成功");
                    $liLine.remove();
                });
            });


            return $liLine;
        };
        return {
            init: function () {
                com.post(api.data.querySoodsItemByQiid, {"soodsItem.quotationItem.qiid": soods.quoteId}, function(res){

                    com.focusPage('#soodsResultList').html(null);

                    renderList('soodsResultList', res.soodsItems);
                });
            },
            drawLine: function (v) {
                return creatLine(v);
            }
        };

        return {
            init: function () {
                com.post(api.data.querySoodsByName, {"soods.sid": soods.sid}, function(res){
                    com.focusPage('#soodsResultList').html(null);
                    renderList('soodsResultList', res.soodes);
                });
            },
            drawLine: function (v) {
                return creatLine(v);
            }
        }

    })();

    soods.btns.addSoodsBtn.click(function(e){
        params["qiid"] = soods.quotationItem.qiid;
        soods.modals.addSoodsItemModal.modal("show");
    });

    displayFunc.init();

    var searcher = new Searcher();

    searcher.param({"soods.quotationItem.qiid": params.quotationItem.qiid});

    function saveData() {

        if (com.validate('addSoodsItemModal')) {
            return false;
        }

        var sid = com.typeahead("soodsItemName");

        var option = {
            "soodsItem.sid" : sid,
            "soodsItem.quotationItem.qiid" : params.quotationItem.qiid,
            "soodsItem.quotationItem.unitPrice" : soods.quotationItem.unitPrice,
            "soodsItem.goods.gid" :soods.gid,
        };
        com.post(api.data.addSoodsItem,option, function(e){
            displayFunc.init();
            com.showAlert(com.info, "操作成功");

            soods.modals.addSoodsItemModal.modal("hide");
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

});