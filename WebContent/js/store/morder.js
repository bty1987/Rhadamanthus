jQuery(function ($) {
    
    var morder = {
        
        items: {
            no: com.focusPage("#no"),
            user: com.focusPage("#user"),
            address: com.focusPage("#address"),
            total: com.focusPage("#total"),
            status: com.focusPage("#status"),
        },
        
        btns: {
        },
        
        status: [],
    };

    com.post(api.ds.store, {}, function (res) {
        morder.items.status.bindData(res.status, "key", "value");
        morder.status = res.status.split("key", "value");
    }, null, false);

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
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.no));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $deliver = $('<a></a>').addClass('btn btn-minier btn-yellow').html('发货');
            var $collect = $('<a></a>').addClass('btn btn-minier btn-yellow').html('收货');
            var $morderItem = $('<a></a>').addClass('btn btn-minier btn-success').html('订单项');

            var address = JSON.parse(v.address);

            var propertyArr = [
                ["用户:", address.name, "grey"],
                ["地址:", address.province + address.city + address.proper + address.address, "grey"],
                ["总价:", v.total, "grey"],
                ["创建时间:", v.createTime, "green"],
                ["支付时间:", v.paymentTime, "green"],
                ["状态:", morder.status[v.status], "red"]
            ];

            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            if (v.status == "0") {
                $divBtnWrap.append($morderItem)
            }

            if (v.status == "1") {
                $divBtnWrap.append($deliver).append($morderItem)
            }

            if (v.status == "2") {
                $divBtnWrap.append($collect).append($morderItem)
            }

            if (v.status == "3" || v.status == "4" || v.status == "5" || v.status == "6") {
                $divBtnWrap.append($morderItem)
            }

            $divBtnWrap.appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            $deliver.click(function () {
                com.showConfirm("是否确认发货", function(){
                    updateStatus(v.oid, 2);
                });
            });

            $collect.click(function () {
                com.showConfirm("是否确认收货", function(){
                    updateStatus(v.oid, 3);
                });
            });

            $morderItem.click(function () {
                params.morder = v;
                com.popup4page('#morderPopUp', "/views/store/morderitem.html", '订单项');
            });
            
            return $liLine;
        };

        return {
            init: function (tableId, listData) {
                com.focusPage('#' + tableId).html(null);
                renderList(tableId, listData);
            },
            drawLine: function (v) {
                return creatLine(v);
            }
        };
    })();

    var searcher = new Searcher();

    searcher.init(['store-morder-no', "store-morder-status"], "condList", api.store.pageMorder, function (data) {
        displayFunc.init('resultList', data);
    }, "pagenation", "Morder", null, false, null, function () {

    });
    
    function updateStatus(oid, status){
        
        com.post(api.store.updateMorderForStatus, {"morder.oid": oid, "morder.status": status}, function (res) {
            searcher.doSearch();
        })
    }

});
