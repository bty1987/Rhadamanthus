$(function () {
    var puotationItem={

        btns:{
            backBtn:com.focusPage("#backBtn")
        },

        qid : params.qid,
        status :params.status,
        use :  params.use
    };

    var initList = function (listData) {
        var $tableWrap = com.focusPage('#list');
        var $ul = $('<ul></ul>').addClass('item-list ui-sortable  fl-table-list');

        if (listData && listData.length) {
            $.each(listData, function (i, v) {

                var $liLine = $('<li></li>').addClass('clearfix item-orange');
                var $h3 = $('<h3></h3>').addClass('oid');
                var $title = $('<small></small>').addClass('blue').html( v.name);
                var $btnDiv = $('<div></div>').addClass('action-buttons pull-right');
                var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');

                var $btnDelete = $('<a></a>').addClass('btn btn-minier btn-danger').html('删除');

                var propertyArr = [
                    ["规格:", v.format, "grey"],
                    ["高度:", v.height , "blue"],
                    ["宽度:", v.width, "blue"],
                    ["厚度:", v.thick, "blue"],
                    ["面积:", utils.accMul(v.width,v.height), "blue"],
                    ["数量:", v.num, "blue"],
                    ["单位:", v.measurementUnit, "grey"],
                    ["单价:", v.unitPrice, "blue"],
                    ["总价:", v.total, "blue"],
                    ["类型:", v.quoteType, "red"],
                    ["备注:", v.comment, "grey"],
                    ["特型:", v.specil, "grey"],
                ];

                $.each(propertyArr, function (index, value) {
                    var $liProperty = $('<li></li>');
                    $('<strong></strong>').html(value[0]).appendTo($liProperty);
                    $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                    $liProperty.appendTo($ulProperty);
                });

                $liLine.appendTo($ul);
                $liLine.append($h3).append($ulProperty);
                if(puotationItem.status != 3 && puotationItem.status != 4 && puotationItem.status != 5 && puotationItem.use != 1){
                    $btnDiv.append($btnDelete);
                }

                $h3.append($title).append($btnDiv);
                
                $btnDelete.click(function (e) {
                    delectpuotationItem(v.qiid);
                });
                
            });

            $ul.appendTo($tableWrap);
        }
    };
    queryPuotationItemByQid(puotationItem.qid);


    function delectpuotationItem(qiid){
        com.showConfirm("是否确认删除", function(){
            com.post(api.production.deletePuotationItem, {"puotationItem.qiid": qiid}, function () {
                com.focusPage('#list ul.item-list').remove();
                queryPuotationItemByQid(puotationItem.qid);
            });
        });
    }

    function queryPuotationItemByQid(qid) {
        com.post(api.production.queryPuotationItemByQid, {"puotation.qid": puotationItem.qid}, function (data) {
            initList(data.puotationItems);
        }, function (e) {
            com.showAlert(com.error, e.errorMsg);
        }, false);
    }

    puotationItem.btns.backBtn.click(function () {
        com.switchPage(api.index.puotationIndex.url);
    });

});