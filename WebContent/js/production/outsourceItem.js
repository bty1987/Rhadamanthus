jQuery(function ($) {

    var outsourceItem = {
        saveBtn: com.focusPage("#saveBtnOutsourceItems"),

        modals: {
            outsourceItemModal: com.focusPage("#outsourceItemModal")
        },
        items: {
            itemName: com.focusPage("#itemName"),
            height: com.focusPage("#height"),
            width: com.focusPage("#width"),
            thick: com.focusPage("#thick"),
            modeling: com.focusPage("#modeling").val(),
            measurementUnit: com.focusPage("#measurementUnit"),
            unitprice: com.focusPage("#unitprice"),
            itemNum: com.focusPage("#itemNum"),
            total: com.focusPage("#total"),
            comment: com.focusPage("#comment")
        },
        oid: params.oid,
        outsourceStatus: params.outsourceStatus,
        productionStatus: params.productionStatus
    };

    outsourceItem.saveBtn.bindClick(addItem);

    outsourceItem.modals.outsourceItemModal.on("hide.bs.modal", function(){
        com.clearValidator();
        com.cleanItems(outsourceItem.items);
        com.cleanTypeahead("modeling");
    });

    var displayFunc  = (function() {

        var renderList = function (tableId, listData) {
            var $tableWrap = com.focusPage('#' + tableId).empty();
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (listData && listData.length) {
                $.each(listData, function (i, v) {
                    var $liLine = creatLine(v);

                    $liLine.appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };

        var  creatLine = function(v) {

            var $liLine = $('<li></li>').addClass('clearfix item-orange');
            var $h3 = $('<h3></h3>').addClass('oid');
            var $title = $('<small></small>').addClass('blue').html(' ' + v.name);
            var $btnDiv = $('<div></div>').addClass('action-buttons pull-right');
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');

            var $btnDelete = $('<a></a>').addClass('btn btn-minier btn-danger').html('删除');

            var propertyArr = [
                ["高:", v.height, "blue"],
                ["宽:", v.width, "blue"],
                ["厚:", v.thick, "blue"],
                ["造型:", v.modeling, "grey"],
                ["数量:", v.num, "blue"],
                ["单价:", v.unitprice, "blue"],
                ["总价:", v.total, "red"],
                ["备注:", v.comment, "grey"]
            ];

            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $liLine.append($h3).append($ulProperty);
            $btnDiv.append($btnDelete);
            $h3.append($title).append($btnDiv);

            hidBtn($btnDelete,outsourceItem.outsourceStatus);

            $btnDelete.click(function (e) {
                com.showConfirm("是否确认删除", function(){
                    com.post(api.production.deleteOutsourceItem, {"outsourceItem.oiid": v.oiid}, function () {
                        outsourceSeacher.doSearch();
                        com.showAlert(com.info, "操作成功");
                    });
                });
            });

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
        };
    })();

    var _condArr = [];
    var outsourceSeacher = new Searcher();

    outsourceSeacher.init(_condArr, "itemCondList", api.production.pageOutsourceItemByOid, function (data) {
        displayFunc.init('itemResultList', data);
    }, "itemPagenation", "outsourceItemPostData", {"outsourceItem.oid": outsourceItem.oid}, false, null,function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('id', 'addOutsourceItem').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        hidBtn($adda,outsourceItem.outsourceStatus);

        return [$adda];
    },"itemResultList");

    com.initTypeahead('itemName', api.production.queryQuoteItemByPinyin,"quoteItem.pinyin","quoteItem.name", "quoteItems", "qiid", "name",function(list,k, v) {
        $.each(list, function (index, val) {

            if (val.qiid == k) {

                outsourceItem.items.measurementUnit.val(val.measurementunit);
                outsourceItem.items.unitprice.val(val.unitprice);
                outsourceItem.items.width.val(0);
                outsourceItem.items.height.val(0);
                outsourceItem.items.thick.val(0);
                outsourceItem.items.itemNum.val(1);
                outsourceItem.items.total.val(utils.accMul(val.unitprice, outsourceItem.items.itemNum.val()));
            }
        });
        return v;
    });

    com.focusPage("#addOutsourceItem").click(function() {
        outsourceItem.modals.outsourceItemModal.modal("show");
    });

    com.focusPage('#total,#unitprice,#itemNum').on("change",function(){
        com.clearValidator();
        if(com.validate("outsourceItemModal","right"))return false;
        outsourceItem.items.total.val(utils.accMul(outsourceItem.items.unitprice.val(),outsourceItem.items.itemNum.val()).toFixed(2));
    });

    function addItem(){

        if (com.validate('outsourceItemModal')) {
            return false;
        }

        var options = {
            "outsource.oid" : outsourceItem.oid,
            "outsourceItems[0].name" : outsourceItem.items.itemName.val(),
            "outsourceItems[0].height" : outsourceItem.items.height.val(),
            "outsourceItems[0].width" : outsourceItem.items.width.val(),
            "outsourceItems[0].thick" : outsourceItem.items.thick.val(),
            "outsourceItems[0].modelling" : outsourceItem.items.modeling ? outsourceItem.items.modeling : ' ',
            "outsourceItems[0].num" : outsourceItem.items.itemNum.val(),
            "outsourceItems[0].unitprice" : outsourceItem.items.unitprice.val(),
            "outsourceItems[0].total" : parseFloat(outsourceItem.items.total.val()),
            "outsourceItems[0].comment" : outsourceItem.items.comment.val()
        };

        com.post(api.production.addOutsourceItem,options,function(res){
            com.clearValidator();
            outsourceSeacher.doSearch();
            com.showAlert(com.info,"添加成功");
        },function(e){
            com.showAlert(com.warning,"添加失败");
        })

        outsourceItem.modals.outsourceItemModal.modal("hide");
    }

    function hidBtn(btnId,otherStatus){
        btnId.removeClass('hide');
        if (outsourceItem.productionStatus == 3 || outsourceItem.productionStatus == 4 ) {
            btnId.addClass('hide');
        }else if(otherStatus != 0 ){
            btnId.addClass('hide');
        }
    }
});