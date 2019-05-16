$(function () {
    var backBtn = com.focusPage('#backBtn');
    var qid =params["qid"] ;
    var status =params["status"];
    var use = params["use"];
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
                if(status != 3 && status != 4 && status != 5 && use != 1){
                    $btnDiv.append($btnDelete);
                }

                $h3.append($title).append($btnDiv);
                
                $btnDelete.click(function (e) {
                    e.stopPropagation();
                    layer.confirm('确定要删除吗?', {
                        btn: ['确定', '取消'] //按钮
                    }, function (indexo, layero) {
                    	 com.post(api.production.deletePuotationItem, {"puotationItem.qiid": v.qiid}, function () {
                             com.focusPage('#list ul.item-list').remove();
                          queryPuotationItemByQid(v.qid);
                        }, function (e) {
                            com.showAlert(com.error, e.errorMsg);
                        });
                        layer.close(indexo);
                    }, function () {

                    });

                });
                
            });

            $ul.appendTo($tableWrap);
        }
    };
    queryPuotationItemByQid(qid);

    function queryPuotationItemByQid(qid) {
        com.post(api.production.queryPuotationItemByQid, {"puotation.qid": qid}, function (data) {
            initList(data.puotationItems);
        }, function (e) {
            com.showAlert(com.error, e.errorMsg);
        }, false);
    }
    backBtn.click(function () {
        com.switchPage(api.index.puotationIndex.url);
    });

});