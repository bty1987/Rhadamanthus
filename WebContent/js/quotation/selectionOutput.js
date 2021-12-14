var printselectionDetail = (function() {

    api = parent.api;
    config = parent.config ;
    server = parent.server;
    utils = parent.utils;
    com = parent.com;
    params = parent.params;

    var selectionDetail = {
        decoration: {},
        selectionItem: {},
        orderId: null,
        
        types: {},
    };

    var printer = {

        printHead : function(orderId, decoration) {

            var headHtml = "";

            var supervisorName = decoration.supervisor.currentName ? decoration.supervisor.currentName : " ";
            var supervisorPhone = decoration.supervisor.phone ? decoration.supervisor.phone : " ";
            var quoterName = decoration.quoter.currentName ? decoration.quoter.currentName : " ";
            var escorterName = decoration.escorter.currentName ? decoration.escorter.currentName : " ";
            var escorterPhone = decoration.escorter.phone ? decoration.escorter.phone : " ";

            headHtml += '<table style="font-size: 14px" width="100%" bgcolor="#000000" border="0" cellpadding="1" cellspacing="0">';
            headHtml += '<tbody><tr bgcolor="#FFFFFF">';
            headHtml += '<td colspan="8" style="font-size: 20px" align="center"> <b>' + "选材订购单" + '</b></td>';
            headHtml += '</tr>';
            headHtml += '<tr bgcolor="#FFFFFF">';
            headHtml += '<td colspan="8" height="10"></td>';
            headHtml += '</tr>';
            headHtml += '<tr bgcolor="#FFFFFF">';
            headHtml += '<td colspan="1" width="10%">装修单号: ' + orderId + '</td>';
            headHtml += '<td colspan="1" width="10%">楼盘地址: ' + decoration.house.village.name + " " + decoration.house.houseNumber + '</td>';
            headHtml += '<td colspan="1" width="10%">面积: ' + decoration.house.buildArea + '</td>';
            headHtml += '<td colspan="1" width="10%">客户姓名: ' + decoration.customer.name + '</td>';
            headHtml += '<td colspan="1" width="10%">设计师: ' + decoration.designer.currentName + '</td>';
            headHtml += '</tr>';
            headHtml += '<tr bgcolor="#FFFFFF">';
            headHtml += '<td colspan="1" width="10%">监理: ' + supervisorName + '</td>';
            headHtml += '<td colspan="1" width="10%">监理电话: ' + supervisorPhone + '</td>';
            headHtml += '<td colspan="1" width="10%">预算员: ' + quoterName + '</td>';
            headHtml += '<td colspan="1" width="10%">主材员: ' + escorterName + '</td>';
            headHtml += '<td colspan="1" width="10%">主材员电话: ' + escorterPhone + '</td>';
            headHtml += '</tr>';
            headHtml += '<tr bgcolor="#FFFFFF">';
            headHtml += '<td colspan="8" height="10"></td>';
            headHtml += '</tr>';
            headHtml += '</tbody></table>';

            return headHtml;
        },

        printBody: function(selectionItems, quotationFunctionAreaItems, extensionItems, addReduceItems) {
            
            var index = 1;
            var contentHtml = '';
			var selections= {};
			
            contentHtml += '<table style="font-size: 12px" width="100%" bgcolor="#000000" border="1" cellpadding="1" cellspacing="0">';
            contentHtml += '<tbody><tr bgcolor="#FFFFFF">';
            contentHtml += '<td width="4%" align="center">序号</td>';
            contentHtml += '<td width="7%" align="center">报价项</td>';
            contentHtml += '<td width="4%" align="center">品牌</td>';
            contentHtml += '<td width="4%" align="center">类型</td>';
            contentHtml += '<td width="10%" align="center">型号</td>';
            contentHtml += '<td width="4%" align="center">单位</td>';
            contentHtml += '<td width="4%" align="center">数量</td>';
            contentHtml += '<td width="15%" align="center">备注</td>';
            contentHtml += '</tr>';
            contentHtml += '</tbody></table>';

            contentHtml += '<table style="font-size: 12px" width="100%" bgcolor="#000000" border="1" cellpadding="1" cellspacing="0">';
            contentHtml += '<tbody>';
			
            $.each(selectionItems, function (i, selectionItem){
                
				if(selections[selectionItem.areaName]){
					selections[selectionItem.areaName].push(selectionItem);
				}else{
					selections[selectionItem.areaName] = [selectionItem];
				}
            });
            
			$.each(selections, function(i, items){
			    
				contentHtml += '<tr bgcolor="#CCCCCC">';
				contentHtml += '<td colspan="1">';
				contentHtml += '<div align="center">' + utils.getBigNumber(index++) + '</div></td>';
				contentHtml += '<td colspan="10">';
				contentHtml += '<div align="left">' + i + '';
				contentHtml += '</div>';
				contentHtml += '</td>';
				contentHtml += '</tr>';
				
				$.each(items, function(j, v){
				    
					if (params.supplierPage == true && params.userInfo.user.uid != v.suid) return true;
						
					var num = [2, 4].indexOf(v.type) != -1 ? -v.num : v.num;
					
					var item = {"name": ""};
					
					if([0].indexOf(v.type) != -1 && quotationFunctionAreaItems[v.quoteId]) item = {"name": quotationFunctionAreaItems[v.quoteId].itemName}
					if([1, 2].indexOf(v.type) != -1 && extensionItems[v.quoteId]) item = {"name": extensionItems[v.quoteId].itemName}
					if([3, 4].indexOf(v.type) != -1 && addReduceItems[v.quoteId]) item = {"name": addReduceItems[v.quoteId].itemName}
					
					contentHtml += '<tr bgcolor="#FFFFFF">';
					contentHtml += '<td width="4%" align="center">' + (j + 1) + '</td>';
					contentHtml += '<td width="7%" align="center">' + item.name + '</td>';
					contentHtml += '<td width="4%" align="center">' + v.goods.brand + '</td>';
					contentHtml += '<td width="4%" align="center">' + selectionDetail.types[v.type] + '</td>';
					contentHtml += '<td width="10%" align="center">' + v.goods.name + '</td>';
					contentHtml += '<td width="4%" align="center">' + v.goods.measurementUnit + '</td>';
					contentHtml += '<td width="4%" align="center">' + num + '</td>';
					contentHtml += '<td width="15%" align="center">' + (v.comment ? v.comment : "") + '</td>';
					contentHtml += '</tr>';
				});
			});
			
            contentHtml += '</tbody>';
            contentHtml += '</table>';

            return contentHtml;
        },
        
        printFooter: function(){
            
            var contentHtml = "";
            
            contentHtml += '<table style="font-size: 15px" width="100%;" border="0" cellpadding="1" cellspacing="0">';
            contentHtml += '<tbody>';
            contentHtml += '<tr>';
            contentHtml += '<td height="10"></td>';
            contentHtml += '</tr>';
            contentHtml += '<tr>';
            contentHtml += '<td width="10%"><b>客户签字:______________</b></td>';
            contentHtml += '<td width="10%"><b>时间:______________</b></td>';
            contentHtml += '<td width="10%"><b>设计师签字:______________</b></td>';
            contentHtml += '<td width="10%"><b>时间:______________</b></td>';
            contentHtml += '<td width="10%"><b>预算员签字:______________</b></td>';
            contentHtml += '<td width="10%"><b>时间:______________</b></td>';
            contentHtml += '<td width="10%"><b>主材管家签字:______________</b></td>';
            contentHtml += '<td width="10%"><b>时间:______________</b></td>';
            contentHtml += '</tr>';
            contentHtml += '<tr>';
            contentHtml += '<td height="10"></td>';
            contentHtml += '</tr>';
            contentHtml += '<td colspan="8" width="100%" style="font-size: 15px"><b>注: 选材单一经确认签字, 开工前可对所选产品进行一次变更, 且最多变更两个品类. </b></td>';
            contentHtml += '</tr>';
            contentHtml += '<tr></tr></tbody></table>';
            
            return contentHtml;
        }
    };

    return {
        init: function () {

            selectionDetail.orderId = params.selectionOrderId;
            
            com.post(api.ds.quotation, {}, function(res){
                selectionDetail.types = res.selectionItemType.split("key", "value");
            }, null, false);

            com.post(api.decoration.queryDecorationForCommonByOrderId,  {"decoration.orderId": selectionDetail.orderId},  function(res){
                selectionDetail.decoration = res.decoration;
            }, null, false);
            
            var selectionItems = [];
            
            com.post(api.quotation.querySelectionItemByOrderId, {"selectionItem.decoration.orderId": selectionDetail.orderId}, function(res){
                selectionItems = res.selectionItems;
            }, null, false);
            
            var quotation = {};
            
            com.post(api.quotation.queryQuotationForDefaultByOrderId, {"quotation.orderId": selectionDetail.orderId}, function(res){
                quotation = res.quotation;
            }, null, false);
            
            var quotationFunctionAreaItems = {};
            
            com.post(api.quotation.queryQuotationFunctionAreaByQuotationId, {"quotation.qid": quotation.qid}, function(res){
                
                $.each(res.quotationFunctionAreas, function(i, v){
                    
                    $.each(v.quotationFunctionAreaItems, function(vi, vv){
                        quotationFunctionAreaItems[vv.qfaiId] = vv;
                    });
                });
            }, null, false);
            
            var extensionItems = {};
            
            com.post(api.quotation.queryExtensionByOrderId, {"extension.orderId": selectionDetail.orderId}, function(res){
                
                $.each(res.extensions, function(i, v){
                    
                    $.each(v.extensionItems, function(vi, vv){
                        extensionItems[vv.eiid] = vv;
                    });
                });
                
            }, null, false);
            
            var addReduceItems = {};
            
            com.post(api.addReduce.queryAddReduceByOrderId, {"addReduce.orderId": selectionDetail.orderId}, function(res){
                
                $.each(res.addReduces, function(i, v){
                    
                    $.each(v.addReduceItems, function(vi, vv){
                        addReduceItems[vv.ariId] = vv;
                    });
                });
                
            }, null, false);

            var html = "";

            html += printer.printHead(selectionDetail.orderId, selectionDetail.decoration);
            html += printer.printBody(selectionItems, quotationFunctionAreaItems, extensionItems, addReduceItems);
            html += printer.printFooter();
            
            $('#selectionList').html(html);
        }
    }
})();

jQuery(function($) {
    printselectionDetail.init();
});

