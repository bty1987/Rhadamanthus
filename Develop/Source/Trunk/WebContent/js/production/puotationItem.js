

$(function () {
    var backBtn = $('#backBtn');
    var qid =params["qid"] ;
    var status =params["status"];
    var use = params["use"];
    var initList = function (listData) {
        var $tableWrap = $('#list');
        var $ul = $('<ul></ul>').addClass('item-list ui-sortable  fl-table-list');

        if (listData && listData.length) {
            $.each(listData, function (i, v) {

                var $liLine = $('<li></li>').addClass('clearfix item-blue');
                var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                var $h3 = $('<h3></h3>').css({color: "grey", "font-weight": "bold"}).html( v.name);
                var $btnDiv = $('<div></div>').addClass('action-buttons pull-right');

                var $btnDelete = $('<a></a>').addClass('btn btn-minier').html('删除');

                var propertyArr = [
                    ["规格:", v.format, "color-grey"],
                    ["高度:", v.height , "color-grey"],
                    ["宽度:", v.width, "color-grey"],
                    ["厚度:", v.thick, "color-grey"],
                    ["面积:", utils.accMul(v.width,v.height), "color-grey"],
                    ["数量:", v.num, "color-red"],
                    ["单位:", v.measurementUnit, "color-grey"],
                    ["单价:", v.unitPrice, "color-red"],
                    ["总价:", v.total, "color-red"],
                    ["类型:", v.quoteType, "color-red"],
                    ["备注:", v.comment, "color-red"],
                    ["特型:", v.specil, "color-red"],
                ];

                $.each(propertyArr, function (index, value) {
                    var $liProperty = $('<li></li>').css({"border-bottom": "0px"});
                    $('<strong></strong>').html(value[0]).appendTo($liProperty);
                    $('<b></b>').html(value[1]).css({color: value[2]}).appendTo($liProperty);
                    $liProperty.appendTo($ulProperty);
                });

                $liLine.appendTo($ul);
                $liLine.append($h3).append($ulProperty);
                if(status != 3 && status != 4 && status != 5 && use != 1){
                    $btnDiv.append($btnDelete);
                }
               
                $btnDiv.appendTo($h3);    
                
                $btnDelete.click(function (e) {
                    e.stopPropagation();
                    layer.confirm('确定要删除吗？', {
                        btn: ['确定', '取消'] //按钮
                    }, function (indexo, layero) {
                    	 com.post(api.production.deletePuotationItem, {"puotationItem.qiid": v.qiid}, function () {
                          $('#list ul.item-list').remove();
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
