var addOrReduceDetail = {
	addOrReduceDetails:null,
	decorationOrder:null,
	decorationOrderQuotationItemData:[]
};

function printHeader(headStr){
	
	return headHtml;
}

params.hostServer = window.hostServer;

jQuery(function($) {
	var p = window.location.search.substr(1);
	
	var url = api.decoration.queryAddOrReduceDetailByIds;
	url.url = url.url + "?" + p;

	com.post(url, {}, function(res){
		
		addOrReduceDetail.addOrReduceDetails = res.addOrReduceDetails;
		
		com.post(api.decoration.queryDecorationOrderForDesignerByOrderId, {'decorationOrder.orderId':addOrReduceDetail.addOrReduceDetails[0].orderId}, function(res){
			
			addOrReduceDetail.decorationOrder = res.decorationOrder;
			
			calAddOrReduceSum(); // 计算总值
			generatePrintPage();
		});
	});
});

function calAddOrReduceSum(){
	var temAddOrReduceDetails = addOrReduceDetail.addOrReduceDetails;
	
	var loop = 0;
	var sumAdd = 0;
	var sumReduce = 0;
	for(loop =0; loop < temAddOrReduceDetails.length; ++loop){
		var temAddOrReduceDetail = temAddOrReduceDetails[loop];
		var addOrReduceItems = temAddOrReduceDetail.addOrReduceItems;
		
		var totalPrice = 0;//总价
		var discountPrice = 0;//打折
		var noDiscountTotalPrice = 0;//不打折
		
		var i = 0;
		for(i=0;i<addOrReduceItems.length;++i){
	
			//0 增项 1 减项 2 漏项 
			//0 报价项 1、自定义报价项目 2、新增自定义报价项目 3、系统定义报价项目
			if(temAddOrReduceDetail.addReduceType=='0' 
				 ){//增项不打折
				
				var tem = Math.round((parseFloat(addOrReduceItems[i].unitPrice)*parseFloat(addOrReduceItems[i].num))*100)/100;
				noDiscountTotalPrice += tem;
				addOrReduceItems[i].sum = tem;
				
				totalPrice+=tem;
				sumAdd+=tem;
			}else if(temAddOrReduceDetail.addReduceType=='2'){//漏项
				
			}else {//减项
				//0 报价项 1、自定义报价项目 2、新增自定义报价项目 3、系统定义报价项目
				if(addOrReduceItems[i].itemType == '3' || (addOrReduceItems[i].itemType == '0' && (addOrReduceItems[i].quotationClassificationId == '3' || addOrReduceItems[i].quotationClassificationId == '4' || addOrReduceItems[i].quotationClassificationId == '5'))){
					//系统定义报价项目不打折--减项的一次性包死 综合项目 管理费 不打折
					var tem = Math.round((parseFloat(addOrReduceItems[i].unitPrice)*parseFloat(addOrReduceItems[i].num))*100)/100;
					addOrReduceItems[i].sum = tem;
					noDiscountTotalPrice +=tem;
					totalPrice+=tem;
					
					sumReduce+=tem;
				}else{
					var tem = Math.round(parseFloat(addOrReduceItems[i].unitPrice)*temAddOrReduceDetail.quotationDiscount*parseFloat(addOrReduceItems[i].num)/10*100)/100;
					addOrReduceItems[i].sum = tem;
					
					discountPrice +=tem;
					totalPrice+=tem;
					
					sumReduce+=tem;
				}
			}
		}
		
		temAddOrReduceDetail.totalPrice = Math.round(totalPrice*100)/100;//总价
		temAddOrReduceDetail.discountPrice =  Math.round(discountPrice*100)/100;//打折
		temAddOrReduceDetail.noDiscountTotalPrice =  Math.round(noDiscountTotalPrice*100)/100;//不打折
	}
	
	addOrReduceDetail.addOrReduceDetails.sumAdd = sumAdd;
	addOrReduceDetail.addOrReduceDetails.sumReduce = sumReduce;
	console.log("cal total:",addOrReduceDetail.addOrReduceDetails);
}

function generateAddItem(){
	html = "";
	html+='工程增项：                                                                                ';
	html+='<table width="100%" border="1" cellpadding="1" cellspacing="0" style="FONT-SIZE: 14px">   ';
	html+='<tbody><tr bgcolor="#FFFFFF" align="center">                                              ';
	html+='    <td width="10%">项目编号</td>                                                         ';
	html+='    <td width="40%">项目名称</td>                                                         ';
	html+='    <td width="10%">单位</td>                                                             ';
	html+='	  <td width="10%">数量</td>                                                                ';
	html+='    <td width="10%">单价</td>                                                             ';
	html+='    <td width="20%">金额</td>                                                             ';
	html+='  </tr>                                                                                   ';
	var temAddOrReduceDetails = addOrReduceDetail.addOrReduceDetails;
	
	var loop = 0;
	var sumAdd = 0;
	var sumReduce = 0;
	for(loop =0; loop < temAddOrReduceDetails.length; ++loop){
		var temAddOrReduceDetail = temAddOrReduceDetails[loop];
		var addOrReduceItems = temAddOrReduceDetail.addOrReduceItems;
		
		var totalPrice = 0;//总价
		var discountPrice = 0;//打折
		var noDiscountTotalPrice = 0;//不打折
		if(temAddOrReduceDetail.addReduceType=='0' 
		 ){//增项不打折
			var i = 0;
			for(i=0;i<addOrReduceItems.length;++i){
			
				html+='			<tr align="center">                                                                 ';
				html+='			  <td>'+addOrReduceItems[i].customerItemId+' </td>                                                                        ';                                                                                                                                                                                                                                                                                                                                                                                                    
				html+='			  <td>'+addOrReduceItems[i].itemName+'</td>                                               ';
				html+='			  <td>'+addOrReduceItems[i].measurementUnit+'</td>                                                                       ';
				html+='			  <td>'+addOrReduceItems[i].num+'</td>                                                                    ';
				html+='			  <td>'+addOrReduceItems[i].unitPrice+'</td>                                                                     ';
				html+='			  <td>'+addOrReduceItems[i].sum+'</td>                                                                   ';
				html+='			</tr>                                                                               ';

			}
		}
	}
	
	html+='                                                                                          ';
	html+='</tbody></table>                                                                          ';
	html+='工程增项金额：'+Math.round(addOrReduceDetail.addOrReduceDetails.sumAdd*100)/100+'元                                                                             ';
	html+='<hr><p>                                                                                     ';
	
	return html;
}

function generateReduceItem(){
	
	html = "";
	html+='工程减项：                                                                                   ';
	html+='<table width="100%" border="1" cellpadding="1" cellspacing="0" style="FONT-SIZE: 14px">      ';
	html+='<tbody><tr bgcolor="#FFFFFF" align="center">                                                 ';
	html+='    <td width="10%">项目编号</td>                                                            ';
	html+='    <td width="40%">项目名称</td>                                                            ';
	html+='    <td width="10%">单位</td>                                                                ';
	html+='		<td width="10%">数量</td>                                                                   ';
	html+='    <td width="10%">单价</td>                                                                ';
	html+='    <td width="20%">金额</td>                                                                ';
	html+='  </tr>                                                                                      ';
	var temAddOrReduceDetails = addOrReduceDetail.addOrReduceDetails;
	
	var loop = 0;
	var sumAdd = 0;
	var sumReduce = 0;
	for(loop =0; loop < temAddOrReduceDetails.length; ++loop){
		var temAddOrReduceDetail = temAddOrReduceDetails[loop];
		var addOrReduceItems = temAddOrReduceDetail.addOrReduceItems;
		
		var totalPrice = 0;//总价
		var discountPrice = 0;//打折
		var noDiscountTotalPrice = 0;//不打折
		
		var i = 0;
		if(temAddOrReduceDetail.addReduceType=='1' ){
			for(i=0;i<addOrReduceItems.length;++i){
				html+='			<tr align="center">                                                                 ';
				html+='			  <td>'+addOrReduceItems[i].customerItemId+' </td>                                                                        ';                                                                                                                                                                                                                                                                                                                                                                                                    
				html+='			  <td>'+addOrReduceItems[i].itemName+'</td>                                               ';
				html+='			  <td>'+addOrReduceItems[i].measurementUnit+'</td>                                                                       ';
				html+='			  <td>'+addOrReduceItems[i].num+'</td>                                                                    ';
				html+='			  <td>'+addOrReduceItems[i].unitPrice+'</td>                                                                     ';
				html+='			  <td>'+addOrReduceItems[i].sum+'</td>                                                                   ';
				html+='			</tr>                                                                               ';
			}
		}
	}
	
	html+='</tbody></table>                                                                             ';
	html+='工程减项金额：'+Math.round(addOrReduceDetail.addOrReduceDetails.sumReduce*100)/100+'元                                                                             ';
	html+='                                                                                             ';
	return html;
}

function generatePrintPage(){
	html = "";
	
	$("#orderId").html("订单编号："+addOrReduceDetail.decorationOrder.orderId);
	$("#labSumMoney").html("工程最终增减合计金额：" + Math.round((addOrReduceDetail.addOrReduceDetails.sumAdd-addOrReduceDetail.addOrReduceDetails.sumReduce)*100)/100+"元");
	
	if(addOrReduceDetail.addOrReduceDetails.sumAdd > 0.00001){
		html += generateAddItem();
	}
	
	if(addOrReduceDetail.addOrReduceDetails.sumReduce > 0.00001){
		html += generateReduceItem();
	}
	
	$("#content").html(html);
}
