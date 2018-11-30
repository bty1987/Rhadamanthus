jQuery(function ($) {
    var morder = {
        saveBtn: null,
        cancelBtn: null,
        modal: null,
        items: {},
        editFlg: false
    };
    var backBtn = com.focusPage('#backBtn');
    morder.saveBtn = com.focusPage("#saveBtn").bindClick(saveData);
    morder.cancelBtn = com.focusPage("#cancelBtn");
    morder.items.no = com.focusPage("#no");
    morder.items.price = com.focusPage("#price");
    morder.items.num = com.focusPage("#num");
    morder.items.status = com.focusPage("#status");
    morder.modal = com.focusPage("#morderItemModal");
    morder.modal.on('show.bs.modal', function (e) {
        com.clearValidator();
        com.clearValidator("#no", true);
    });
    var morderOid = params["morder.oid"];
    var options = {
        "morder.oid": morderOid
    };

    com.post(api.ds.store, {}, function (res) {
        com.focusPage("#status").bindData(res.statusItem, "key", "value");
        $.each(res.statusItem, function (i, v) {
            status[v.key] = v.value;
        })
    }, null, false);

    var displayFunc  = (function(){
        var renderList = function(tableId, listData){
            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');
            if(listData && listData.length){
                $.each(listData,function(i, v){
                    var $liLine = creatLine(v);
                    $liLine.appendTo($ul);
                });
                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function(v){
            var $liLine = $('<li></li>').addClass('item-orange clearfix');

            var $urldiv = $('<div style="border: 1px solid #ccc ;float :left;"></div>').css("width", "75px").css("height","75px").css("margin-right", "10px");
            var img = $('<img />').css("margin-right", "20px").appendTo($urldiv);
            var url = com.showImg(img, v.mprice.img, 75, 75, '', null, 0);

            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.mprice.mgoods.title));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons').prop("id", "btnList");

            var propertyArr = [
                // ["编号:", v.morder.no, "grey"],
                ["颜色:", v.mprice.mcolor.color, "grey"],
                ["规格:", v.mprice.mformat.format, "grey"],
                ["数量:", v.num, "grey"],
                ["单价:", v.mprice.price, "grey"]
            ];

            $.each(propertyArr, function (index,value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $divBtnWrap.appendTo($h3);
            $liLine.append($urldiv).append($h3).append($ulProperty);

            return $liLine;
        };

        return {
            init : function(tableId,listData){
                com.focusPage('#' + tableId).html(null);
                renderList(tableId,listData);
            },
            drawLine : function(v){
                return creatLine(v);
            }
        }
    })();

    queryMorderItem();

    function queryMorderItem() {
        com.post(api.store.queryMorderItemByOid, options, function (res) {
            displayFunc.init('resultList', res.morderItems);
        }, function (res) {
            console.log("失败")
        }, false)
    }

    backBtn.click(function () {
        com.switchPage(api.index.mordersitem.url);
    });

    function saveData() {
        var options = {
            'morderItem.oiid': morder.items.oiid,
            'morderItem.status': morder.items.status.val()
        };
        com.post(api.store.updateMorderItemForStatus, options, function (res) {
            morder.modal.modal("hide");
            queryMorderItem()
        });
    }
});
