$(function(){

    var productionPlanItem = {

        saveBtn: com.focusPage("#saveBtn"),
        cancelBtn : com.focusPage("#cancelBtn"),

        modals: {
            productionPlanItemModal: com.focusPage("#productionPlanItemModal")
        },

        items: {
            name: com.focusPage("#itemName"),
            height: com.focusPage("#height"),
            width: com.focusPage("#width"),
            thick: com.focusPage("#thick"),
            num: com.focusPage("#num"),
            color: com.focusPage("#color"),
            comment: com.focusPage("#comment"),
            measurementUnit: com.focusPage("#measurementUnit"),
            typeno: com.focusPage("#typeno"),
        },

        params: {
            ppid: params["productionPlan.ppid"],
            productionStatus: params["production"],
            productionPlanStatus: params["productionPlan.status"]
        }
    };

    productionPlanItem.saveBtn.bindClick(saveData);

    productionPlanItem.modals.productionPlanItemModal.on("hide.bs.modal", function(){
        com.cleanItems(productionPlanItem.items);
        com.closeTip();
    });

    var query = productionPlanItem.items.name.val();

    com.initTypeahead("#itemName",api.production.queryQuoteItemByPinyin, "quoteItem.pinyin", {
        "quoteItem.name": query, "quoteItem.pinyin": query
    }, "quoteItems", "qiid", "name", function(list, k, v){

        $.each(list, function (index, val) {

            if (val.qiid == k) {
                productionPlanItem.items.measurementUnit.val(val.measurementunit);
                productionPlanItem.items.typeno.val(val.format);
            }
        });
        return v;
    });

    var displayFunc = (function(){

        var renderList = function(tableId,listData){
            var $tableWrap = com.focusPage('#' + tableId).empty();
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
            var $h3 = $('<h3></h3>').addClass('oid');
            var $title = $('<small></small>').addClass('blue').html(' ' + v.name);
            var $btnDiv = $('<div></div>').addClass('action-buttons pull-right');
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');

            var $btnDel = $('<a></a>').addClass(' btn btn-minier btn-danger').html('删除');

            var propertyArr = [
                ["类型编号:", v.typeno, "blue"],
                ["高:",v.height,"blue"],
                ["宽:",v.width,"blue"],
                ["厚:",v.thick,"blue"],
                ["颜色:",v.color,"grey"],
                ["数量:",v.num,"blue"],
                ["说明:",v.comment,"grey"],
            ];

            $.each(propertyArr, function (index,value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $btnDiv.append($btnDel);
            $h3.append($title).append($btnDiv);
            $liLine.append($h3).append($ulProperty);

            hidBtn($btnDel,productionPlanItem.params.productionPlanStatus);

            $btnDel.click(function(){
                com.showConfirm("确定删除吗?", function() {
                    com.post(api.production.deleteProductionPlanItem, {"productionPlanItem.ppiid": v.ppiid}, function(){
                        searcher.doSearch();
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

    var searcher  = new Searcher();

    searcher.init([],'condList',api.production.pageProductionPlanItemByPpid,function (data) {
        displayFunc.init('resultList', data);
    },"pagenation","productionPlanItemPostData",{"productionPlanItem.productionPlan.ppid" :productionPlanItem.params.ppid},false,null,function () {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('id', 'addProductionPlanItem').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        var $back = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('id', 'back').css("margin", "0px 3px");
        var $backi = $('<i></i>').addClass('icon-mail-forward bigger-110').appendTo($back);
        var $backspan = $('<span></span>').text('返回').appendTo($back);

        return [$adda,$back];
    });

    com.focusPage("#addProductionPlanItem").click(function() {
        productionPlanItem.modals.productionPlanItemModal.modal("show");
    });

    com.focusPage("#back").click(function () {
        com.switchPage(api.index.productionPlanIndex.url);
    });

    function saveData() {

        if (com.validate('productionPlanItemModal')) {
            return false;
        }

        var option = {
            "productionPlanItem.productionPlan.ppid": productionPlanItem.params.ppid,
            "productionPlanItem.typeno": productionPlanItem.items.typeno.val(),
            "productionPlanItem.name": productionPlanItem.items.name.val(),
            "productionPlanItem.height": productionPlanItem.items.height.val(),
            "productionPlanItem.width": productionPlanItem.items.width.val(),
            "productionPlanItem.thick": productionPlanItem.items.thick.val(),
            "productionPlanItem.color": productionPlanItem.items.color.val(),
            "productionPlanItem.unitprice": 0,
            "productionPlanItem.num": productionPlanItem.items.num.val(),
            "productionPlanItem.total": 0,
            "productionPlanItem.comment": productionPlanItem.items.comment.val()
        }

        com.post(api.production.addProductionPlanItem,option,function () {
            searcher.doSearch();
            com.showAlert(com.info, "操作成功");
        });

        productionPlanItem.modals.productionPlanItemModal.modal("hide");
    }

    var status = productionPlanItem.params.productionStatus;

    function hidBtn(btnId,otherStatus){
        btnId.removeClass('hide');
        if (status == 5 || status == 4 || status == 3) {
            btnId.addClass('hide');
        }else if(otherStatus != 0 ){
            btnId.addClass('hide');
        }

    }
});