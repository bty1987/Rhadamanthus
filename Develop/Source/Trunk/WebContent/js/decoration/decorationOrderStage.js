var decorationOrderPostData = {};

$(function(){
    var displayFunc  = (function(){

        var renderList = function(tableId,listData){
            var $tableWrap = $('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list ui-sortable  fl-table-list');

            if(listData && listData.length){ 
                $.each(listData,function(i, v){
                    
	                var $liLine = $('<li></li>').addClass('item-blue clearfix');
                    var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                    var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(' ' + v.orderId));
                    var $btnDiv = $('<div></div>').addClass('action-buttons pull-right');
                    
                    var $btnWatch = $('<a></a>').addClass('btn btn-minier btn-yellow').html('查看');
                    
                    var propertyArr = [
                        ["楼盘地址:", v.village.villageName + " " + v.houseNumber, "grey"],
                        ["客户名:", v.customer.customerName, "grey"],
                        ["余额:", v.customer.balance, "blue"],
                        ["设计部:", v.designDepartment, "grey"],
                        ["设计师:", v.designer, "grey"],
                        ["业务部:", v.businessDepartment, "grey"],
                        ["业务员:", v.salesman, "grey"],
                        ["面积:", v.houseArea, "blue"],
                        ["合同报价:", v.orderTotalPrice, "blue"],
                        ["折扣:", v.discount, "blue"],
                        ["量房时间:", v.createTime, "grey"],
                        ["签单时间:", v.contractTime, "grey"],
                        ["类型:", v.type == 0 ? '半包' : '全包', "red"],
                        ["状态:", v.status, "red"]
                    ];

                    $.each(propertyArr, function (index,value) {
                        var $liProperty = $('<li></li>');
                        $('<strong></strong>').html(value[0]).appendTo($liProperty);
                        $('<b></b>').html(value[1]).css(value[2]).appendTo($liProperty);
                        $liProperty.appendTo($ulProperty);
                    });

                    $liLine.appendTo($ul);
                    $liLine.append($h3).append($ulProperty);
                    
                    $btnDiv.append($btnWatch).appendTo($h3);
                    
                    $btnWatch.click(function(){
                        decorationOrderPostData.decorationOrderId = v.orderId;
                    	com.switchPage(api.index.decorationOrderStageDetailIndex.url);
                    });
                });

                $ul.appendTo($tableWrap);
            }
        };

      
        return {
            init : function(tableId,listData){
                $('#' + tableId).html(null);
                renderList(tableId,listData);
            }
        };
     })();
    var _condArr = ['orderId','village','houseNumber','houseArea','customerPhone','designer','salesman','designerRegionId','designerDepartmentId','salesmanRegionId','salesmanDepartmentId', 'createTimeDateRange','signTimeDateRange','houseClass','status'];

    var searcher = new Searcher();
	searcher.init(_condArr, "searchList", api.decoration.pageDecorationOrderForCommon, function(data){
        displayFunc.init('resultList', data);
    }, "pagenation", "decorationOrderAdvancePostData", null, false, null, null);
	


});

