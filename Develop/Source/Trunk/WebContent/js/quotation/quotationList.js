var decorationOrderDetail = {
	decorationOrderId:null,
	
	customer:{},
	village:{},
	quotationItemListGrid: null,
	quotationItemGridPager: null,
	materialItemListGrid: null,
	materialItemGridPager: null,
	
	mediaServer:null,
	
	quotationDetail:null,
	decorationOrder:null,
	decorationOrderQuotationItemData:[]
};

params.hostServer = window.hostServer;

function printHeader(headStr){
	
	var headHtml = "";
	
	headHtml+='<table style="FONT-SIZE: 14px" width="100%" bgcolor="#000000" border="0" cellpadding="1" cellspacing="0">  ';
	headHtml+='                                                                                                           ';
	headHtml+=' <tbody><tr bgcolor="#FFFFFF">                                                                             ';
	headHtml+='<td colspan="8" style="FONT-SIZE: 20px" align="center"> <b>'+headStr+'</b></td>                   ';
	headHtml+='  </tr>                                                                                                    ';
	headHtml+='  <tr bgcolor="#FFFFFF">                                                                                   ';
	headHtml+='    <td colspan="8" height="10"></td>                                                                      ';
	headHtml+='  </tr>                                                                                                    ';
	headHtml+='  <tr bgcolor="#FFFFFF">                                                                                   ';
	headHtml+='    <td colspan="3" width="40%">客户姓名：'+decorationOrderDetail.quotationDetail.customer.customerName+'</td>                                                              ';
	headHtml+='	<td colspan="3" width="40%">订单编号：'+decorationOrderDetail.quotationDetail.orderId+'</td>               ';
	headHtml+='	<td colspan="2" width="20%">设 计 师：'+decorationOrderDetail.decorationOrder.designer+'</td>   			  ';
	headHtml+=' </tr>                                                                                                     ';
	headHtml+=' <tr bgcolor="#FFFFFF">                                                                                    ';
	headHtml+='    <td colspan="3" width="40%">签约店面：'+decorationOrderDetail.decorationOrder.designDepartment+'</td>                                                              ';
	headHtml+='	<td colspan="3" width="40%">工程地址：'+decorationOrderDetail.decorationOrder.village.villageName+' '+decorationOrderDetail.decorationOrder.houseNumber+'</td>                                                      ';
	headHtml+='	<td colspan="2" width="20%">房屋面积：'+decorationOrderDetail.decorationOrder.houseArea+'</td>             ';
	headHtml+='</tr>                                                                                                      ';
	headHtml+='   <tr bgcolor="#FFFFFF">                                                                                  ';
	headHtml+='    <td colspan="8" height="10"></td>                                                                      ';
	headHtml+='  </tr>                                                                                                    ';
	headHtml+='</tbody></table>      ';
	
	return headHtml;
}

function printProjectTable(){
	
	var contentHtml = '';
	contentHtml+='<table style="FONT-SIZE: 12px" width="100%" bgcolor="#000000" border="1" cellpadding="1" cellspacing="0">';
	contentHtml+='  <tbody><tr bgcolor="#FFFFFF">                                                                          ';
	contentHtml+='    <td width="4%" align="center">序号</td>                                                                ';
	contentHtml+='    <td width="18%" align="center">项目名称</td>                                                             ';
	contentHtml+='    <td width="5%" align="center">单位</td>                                                                ';
	contentHtml+='    <td width="5%" align="center">数量</td>                                                                ';
	contentHtml+='	<td width="5%" align="center">单价</td>                                                                ';
	contentHtml+='	<td width="5%" align="center">合价</td>                                                                ';
	contentHtml+='                                                                                                         ';
	contentHtml+='    <td width="52%" align="center">工艺做法及材料说明</td>                                                        ';
	contentHtml+='  </tr>                                                                                                  ';
	contentHtml+='</tbody></table>                                                                                      ';
	
	var functionAreas = decorationOrderDetail.quotationDetail.functionAreas;
	
	contentHtml+='<table style="FONT-SIZE: 12px" width="100%" bgcolor="#000000" border="1" cellpadding="1" cellspacing="0">                                         ';
	contentHtml+='	<tbody>                                                                                                                                         ';
	
	for(var i=0;i<functionAreas.length;++i){
		var functionArea = functionAreas[i];
		contentHtml+='		  <tr bgcolor="#CCCCCC">                                                                                                                    ';
		contentHtml+='		  	<td colspan="1">                                                                                                                        ';
		contentHtml+='			  <div align="center">'+utils.getBigNumber(i)+'</div></td>           ';
		contentHtml+='			<td colspan="8">                                                                                                                        ';
		contentHtml+='			  <div align="left"> '+functionArea.functionAreaName+'';
		contentHtml+='				</div>                                                                                                                              ';
		contentHtml+='			</td>                                                                                                                                   ';
		contentHtml+='			                                                                                                                                        ';
		contentHtml+='		  </tr>                                                                                                                                     ';
		contentHtml+='		                                                                                                                                            ';
		for(var j=0;j<functionArea.items.length;++j){
			var item = functionArea.items[j];
			
			contentHtml+='		  <tr bgcolor="#FFFFFF">                                                                                                                    ';
			contentHtml+='			<td width="4%" align="center">'+j+'</td>                                                                                                    ';
			contentHtml+='		                                                                                                                                            ';
			contentHtml+='			<td width="18%" align="left">'+item.itemName+'</td>                                                                                              ';
			contentHtml+='			<td width="5%" align="center">'+item.measurementUnit+'</td>                                                                                                    ';
			contentHtml+='			<td width="5%" align="center">'+Math.round(item.num*1000)/1000+'</td>                                                                                                   ';
			contentHtml+='			                                                                                                                                        ';
			contentHtml+='			<td width="5%" align="center">'+Math.round(item.discountUnitPrice*1000)/1000+'</td>                                                                                           ';
			contentHtml+='		                                                                                                                                            ';
			contentHtml+='			<td width="5%" align="center"> '+Math.round(item.sum*1000)/1000+'</td>  ';
			contentHtml+='			<td width="52%" align="left">'+item.quotationItemDes+'</td>                                            ';
			contentHtml+='		  </tr>   ';
			
		}
	}
	
	contentHtml+='<tr bgcolor="#FFFFFF">                                     ';
	contentHtml+='<td colspan="11" align="left">工程总价：'+Math.round(decorationOrderDetail.quotationDetail.totalPrice*1000)/1000+'元</td>          ';
	contentHtml+='</tr>                                                      ';
	
	contentHtml+='	</tbody>                                                                                                                                        ';
	contentHtml+='</table>                                                                                                                                          ';
	
	contentHtml+='<table style="FONT-SIZE: 12px" width="100%" border="0" cellpadding="1" cellspacing="0">          ';
	contentHtml+='<tbody><tr>                                                                                      ';
	contentHtml+='<td height="10"></td>                                                                            ';
	contentHtml+='</tr>                                                                                            ';
	contentHtml+='<tr>                                                                                             ';
	contentHtml+='                                                                                                 ';
	contentHtml+='   <td><b>&nbsp;客户签字：</b></td>                                                                   ';
	contentHtml+='   <td><b>设计师签字：</b></td>                                                                        ';
	contentHtml+='    <td><b>项目经理签字：</b></td>                                                                      ';
	contentHtml+=' </tr><tr>                                                                                       ';
	contentHtml+='</tr></tbody></table>                                                                            ';
	
	return contentHtml;
				                                                                                                                                                    
}

function printFinanceTable(){
	var contentHtml = '';
	contentHtml+='<table style="FONT-SIZE: 12px" width="100%" bgcolor="#000000" border="1" cellpadding="1" cellspacing="0">                                      ';
	contentHtml+='  <tbody>                                                                                                                                      ';
	contentHtml+='	  <tr align="center" bgcolor="#FFFFFF">                                                                                                     ';
	contentHtml+='	    <td width="4%"><strong>序号</strong></td>                                                                                                 ';
	contentHtml+='	    <td width="27%"><strong>项目名称</strong></td>                                                                                              ';
	contentHtml+='	    <td width="12%"><strong>项目分类</strong></td>                                                                                              ';
	contentHtml+='	    <td width="8%"><strong>单位</strong></td>                                                                                                 ';
	contentHtml+='	    <td width="7%"><strong>数量</strong></td>                                                                                                 ';
	contentHtml+='		<td width="8%"><strong>折前单价</strong></td>                                                                                               ';
	contentHtml+='	    <td width="10%"><strong>折前金额（元）</strong></td>                                                                                           ';
	contentHtml+='		<td width="6%"><strong>折扣</strong></td>                                                                                                 ';
	contentHtml+='		<td width="8%"><strong>折后单价</strong></td>                                                                                               ';
	contentHtml+='	     <td width="10%"><strong>折后金额（元）</strong></td>                                                                                          ';
	contentHtml+='	  </tr>                                                                                                                                     ';
	contentHtml+='                                                                                                                                               ';
	var functionAreas = decorationOrderDetail.quotationDetail.functionAreas;
	for(var i=0;i<functionAreas.length;++i){
		var functionArea = functionAreas[i];
		contentHtml+='		  <tr bgcolor="#CCCCCC">                                                                                                                    ';
		contentHtml+='		  	<td colspan="1">                                                                                                                        ';
		contentHtml+='			  <div align="center">'+utils.getBigNumber(i)+'</div></td>           ';
		contentHtml+='			<td colspan="9">                                                                                                                        ';
		contentHtml+='			  <div align="left"> '+functionArea.functionAreaName+'';
		contentHtml+='				</div>                                                                                                                              ';
		contentHtml+='			</td>                                                                                                                                   ';
		contentHtml+='			                                                                                                                                        ';
		contentHtml+='		  </tr>                                                                                                                                     ';
		for(var j=0;j<functionArea.items.length;++j){
			var item = functionArea.items[j];
			contentHtml+='	  <tr align="center" bgcolor="#FFFFFF">                                                                                                     ';
			contentHtml+='		<td>'+j+'</td>                                                                                                                              ';
			contentHtml+='		<td>'+item.itemName+'</td>                                                                                                                       ';
			contentHtml+='		<td>'+item.quotationClassification+'</td>                                                                                                                           ';
			contentHtml+='		<td>'+item.measurementUnit+'</td>                                                                                                                              ';
			contentHtml+='		<td>'+Math.round(item.num*1000)/1000+'</td>                                                                                                                             ';
			console.log(item);
			contentHtml+='		<td>'+Math.round(item.unitPrice*1000)/1000+'</td>                                                                                                                            ';
			contentHtml+='		<td>'+Math.round(item.preSum*1000)/1000+'</td>                                                                                                                          ';
			if(item.quotationClassificationId == '3' || item.quotationClassificationId == '4' || item.quotationClassificationId == '5'){
				contentHtml+='		<td>10</td>                                                                                                                            ';
			}else{
				contentHtml+='		<td>'+decorationOrderDetail.quotationDetail.discount+'</td>                                                                                                                            ';
			}
			contentHtml+='		<td>'+Math.round(item.discountUnitPrice*1000)/1000+'</td>                                                                                                                            ';
			contentHtml+='		<td>'+Math.round(item.sum*1000)/1000+'</td>                                                                                                                          ';
			contentHtml+='	  </tr>                                                                                                                                     ';
			
			console.log(item.discountUnitPrice);
		}
		contentHtml+='	  <tr align="center" bgcolor="#FFFFFF">                                                                                                     ';
		contentHtml+='		<td colspan="3"><span class="STYLE1">&lt;'+functionArea.functionAreaName+'&gt;小计</span></td>                                                                           ';
		contentHtml+='		<td>&nbsp;</td>                                                                                                                         ';
		contentHtml+='		<td>&nbsp;</td>                                                                                                                         ';
		contentHtml+='		<td>&nbsp;</td>                                                                                                                         ';
		contentHtml+='		<td><span class="STYLE2"><strong>'+Math.round(functionArea.preSum*1000)/1000+'</strong></span></td>                                                                            ';
		contentHtml+='		<td>&nbsp;</td>                                                                                                                         ';
		contentHtml+='		<td>&nbsp;</td>                                                                                                                         ';
		contentHtml+='		<td><span class="STYLE2"><strong>'+Math.round(functionArea.sum*1000)/1000+'</strong></span></td>                                                                           ';
		contentHtml+='	  </tr>                                                                                                                                     ';
		contentHtml+='	                                                                                                                                            ';
	}
	
	var discountMoney  = Math.round(parseFloat(decorationOrderDetail.quotationDetail.discountPrice)/(decorationOrderDetail.quotationDetail.discount)*(10-decorationOrderDetail.quotationDetail.discount)*100)/100;
	
	contentHtml+='	<tr bgcolor="#FFFFFF">                                                                                                                      ';
	contentHtml+='		<td colspan="10" align="left"><strong>总 计&nbsp;&nbsp;&nbsp;&nbsp;折前：'+Math.round((decorationOrderDetail.quotationDetail.totalPrice + discountMoney)*100)/100+'&nbsp;&nbsp;&nbsp;&nbsp;折后：'+Math.round(decorationOrderDetail.quotationDetail.totalPrice*100)/100+'</strong></td>            ';
	contentHtml+='  	</tr>                                                                                                                                       ';
	contentHtml+='	                                                                                                                                            ';
	contentHtml+='	                                                                                                                                            ';
		                                                                                                                                                        
	contentHtml+='	</tbody>                                                                                                                                        ';
	contentHtml+='</table>                                                                                                                                          ';
	
	return contentHtml;
}

function printCustomerTable(){
	var contentHtml = '';
	contentHtml+='<table style="FONT-SIZE: 12px" width="100%" bgcolor="#000000" border="1" cellpadding="0" cellspacing="0">                                        ';
	contentHtml+='	<tbody>                                                                                                                                        ';
	contentHtml+='		<tr align="center" bgcolor="#FFFFFF">                                                                                                      ';
	contentHtml+='			<td width="4%"><strong>序号</strong></td>                                                                                                ';
	contentHtml+='			<td width="18%"><strong>项目名称</strong></td>                                                                                             ';
	contentHtml+='			<td width="4%"><strong>计量单位</strong></td>                                                                                              ';
	contentHtml+='			<td width="3%"><strong>数量</strong></td>                                                                                                ';
	contentHtml+='			<td width="72%"><strong>工艺做法及材料说明</strong></td>                                                                                        ';
	contentHtml+='		</tr>                                                                                                                                      ';
	var functionAreas = decorationOrderDetail.quotationDetail.functionAreas;
	for(var i=0;i<functionAreas.length;++i){
		var functionArea = functionAreas[i];
		contentHtml+='		  <tr bgcolor="#CCCCCC">                                                                                                                    ';
		contentHtml+='		  	<td colspan="1">                                                                                                                        ';
		contentHtml+='			  <div align="center">'+utils.getBigNumber(i)+'</div></td>           ';
		contentHtml+='			<td colspan="8">                                                                                                                        ';
		contentHtml+='			  <div align="left"> '+functionArea.functionAreaName+'';
		contentHtml+='				</div>                                                                                                                              ';
		contentHtml+='			</td>                                                                                                                                   ';
		contentHtml+='			                                                                                                                                        ';
		contentHtml+='		  </tr>                                                                                                                                     ';
		contentHtml+='		                                                                                                                                            ';
		for(var j=0;j<functionArea.items.length;++j){
			var item = functionArea.items[j];
			
			contentHtml+='		                                                                                                                                           ';
			contentHtml+='		<tr align="center" bgcolor="#FFFFFF">                                                                                                      ';
			contentHtml+='			<td>'+j+'</td>                                                                                                                             ';
			contentHtml+='			<td align="left">'+item.itemName+'</td>                                                                                                         ';
			contentHtml+='			<td>项</td>                                                                                                                             ';
			contentHtml+='			<td>1</td>                                                                                                                             ';
			contentHtml+='			<td align="left">'+item.quotationItemDes+'</td>                                                       ';
			contentHtml+='		</tr>                                                                                                                                      ';
			contentHtml+='			                                                                                                                                       ';
		}
	}
	contentHtml+='	</tbody>                                                                                                                                        ';
	contentHtml+='</table>                                                                                                                                          ';
	
	contentHtml+='<table style="FONT-SIZE: 12px" width="100%" bgcolor="#000000" border="1" cellpadding="1" cellspacing="0">                                                                                                                                              ';
	contentHtml+='  <tbody><tr bgcolor="#FFFFFF">                                                                                                                                                                                                                        ';
	contentHtml+='  <td height="42"><p>备注</p>                                                                                                                                                                                                                            ';
	contentHtml+='    <p>说明</p></td>                                                                                                                                                                                                                                     ';
	contentHtml+='  <td colspan="6" height="42">                                                                                                                                                                                                                         ';
	contentHtml+='  <table style="FONT-SIZE: 12px" width="100%">                                                                                                                                                                                                         ';
	contentHtml+='  <tbody><tr><td width="100%">1、为了维护您的权益，请您不要接受任何口头承诺，任何口头承诺均属无效。</td>                                                                                                                                                                                 ';
	contentHtml+='  </tr>                                                                                                                                                                                                                                                ';
	contentHtml+='   <tr><td>2、装修许可证及抵押金、施工人员入园证及押金等相关费用、事宜由甲方负责。</td></tr><tr>                                                                                                                                                                                          ';
	contentHtml+='   </tr><tr><td>3、施工项目以此工程明细表为准，未包含项目均由甲方提供或甲方委托乙方代购，效果图为辅助参考。</td></tr><tr>                                                                                                                                                                           ';
	contentHtml+='  </tr><tr><td>4、全市唯一1：1模拟专业放线系统需甲乙双方到场确认施工标准，乙方日后所有施工以放线为准，因甲方原因造成施工二次改动，所发生费用由甲方承担。</td></tr><tr>                                                                                                                                                    ';
	contentHtml+='   </tr><tr><td>5、此施工项目内不含网络宽带进户、可视对讲移位（由小区物业负责）、煤气主管线改造（由煤气公司负责）、水钻打孔。</td>                                                                                                                                                                           ';
	contentHtml+='    </tr><tr>                                                                                                                                                                                                                                          ';
	contentHtml+='      <td>6、鉴于客户安全和国家施工规范要求，乙方不负责承重墙拆改\配电箱\水表\上下水主管道\烟道及排风道改造。如甲方强制要求乙方拆改，需签定相关协议，乙方只负责施工不承     &nbsp;&nbsp;&nbsp;担任何相关责任及处罚。如需复原甲方自行承担费用。</td>                                                                                                        ';
	contentHtml+='   </tr><tr>                                                                                                                                                                                                                                           ';
	contentHtml+='      </tr><tr>                                                                                                                                                                                                                                        ';
	contentHtml+='        <td>7、如园区有包园现象或住宅电梯不可用，项目中(沙子、水泥、红砖，夹心板、石膏粉、腻子粉等材料搬运上楼，残土搬运下楼）产生                                                                                                                                                                               ';
	contentHtml+='的搬运费，吊装费全部由甲方负责。如园区                                                                                                                                                                                                                                    ';
	contentHtml+='&nbsp;&nbsp;&nbsp;有包园，乙方力工砸墙费用已收情况下，按实际收取费用全额退还甲方，力工砸墙由甲方负责。</td>                                                                                                                                                                                      ';
	contentHtml+='	   </tr><tr>                                                                                                                                                                                                                                         ';
	contentHtml+='      <td>8、园区进不去车情况下，发生二次搬运时会产生园区搬运费。乙方负责将垃圾运至小区指定地点，如需运出小区，所发生费用由甲方承担。</td>                                                                                                                                                                    ';
	contentHtml+='   </tr><tr>                                                                                                                                                                                                                                           ';
	contentHtml+='   </tr><tr>                                                                                                                                                                                                                                           ';
	contentHtml+='      <td>9、原建筑没有电线情况下，需要公司提供施工、重新布线，需要在收取正常电路改造费用基础上，另按30元每平米加收费用。</td>                                                                                                                                                                               ';
	contentHtml+='   </tr><tr>                                                                                                                                                                                                                                           ';
	contentHtml+=' </tr><tr>                                                                                                                                                                                                                                             ';
	contentHtml+='      <td>10、如甲方要求乙方铺设波化砖上墙及仿古砖，需要瓷砖粘贴剂及厂家加工费用时，其由甲方负责。如甲方购砖不确定产品尺寸规格，应按实际购砖规格补齐预算差额后,乙方再进  &nbsp;&nbsp;&nbsp;行施工（详见瓷砖铺设工艺做法及材料说明）。</td>                                                                                                               ';
	contentHtml+='   </tr><tr>                                                                                                                                                                                                                                           ';
	contentHtml+='      <td>11、施工中室内铺设地板位置如改铺地砖或发现原始地面不符合地板铺设条件需要地面找平时，其费用另计由甲方先行支付再行施工。</td>                                                                                                                                                                            ';
	contentHtml+='   </tr><tr>                                                                                                                                                                                                                                           ';
	contentHtml+='   </tr><tr>                                                                                                                                                                                                                                           ';
	contentHtml+='      <td>12、施工中甲方定制成品门情况下，如需要门口夹心板木基层处理，其费用另计，由甲方先行支付再行施工。</td>                                                                                                                                                                                       ';
	contentHtml+='   </tr><tr>                                                                                                                                                                                                                                           ';
	contentHtml+='    </tr><tr>                                                                                                                                                                                                                                          ';
	contentHtml+='      <td>13、施工中如发生增项，需甲方与乙方签定施工增减项变更单，交付增项款后，再行施工。如发生减项，减项额度不能超出总工程款5%。如超出甲方需交付乙方该减项款的30%违约 &nbsp;&nbsp;&nbsp;金，再行施工。</td>                                                                                                                            ';
	contentHtml+='   </tr><tr>                                                                                                                                                                                                                                           ';
	contentHtml+='     </tr><tr>                                                                                                                                                                                                                                         ';
	contentHtml+='      <td>14、甲方按合同内工程进度付款，若甲方延期付款，乙方有权停止施工,乙方不承担因此所引起的工期延误及各种责任和损失。甲方须将全部工程款项结清后，可享受乙方提供保洁 &nbsp;&nbsp;&nbsp;一次及保修，否则乙方有权不予保洁及保修。</td>                                                                                                                 ';
	contentHtml+='   </tr><tr>                                                                                                                                                                                                                                           ';
	contentHtml+='   </tr><tr>                                                                                                                                                                                                                                           ';
	contentHtml+='      <td>15、工程施工工期完工以油工施工完毕，撤离施工现场为标准。后期安装、保洁时间不在正式施工工期范围内。                                                                                                                                                                                           ';
	contentHtml+='</td>                                                                                                                                                                                                                                                  ';
	contentHtml+='   </tr><tr>                                                                                                                                                                                                                                           ';
	contentHtml+='</tr><tr>                                                                                                                                                                                                                                              ';
	contentHtml+='      <td>16、甲方交付工程款及相关款项需要有乙方正式收据做为凭证，否则视为无效。</td>                                                                                                                                                                                                    ';
	contentHtml+='   </tr><tr>                                                                                                                                                                                                                                           ';
	contentHtml+='   </tr><tr>                                                                                                                                                                                                                                           ';
	contentHtml+='      <td>17、甲方签署后，表示对此工程明细表的价格、工艺及各条款认可，并自愿承担相关法律责任。</td>                                                                                                                                                                                             ';
	contentHtml+='   </tr><tr>                                                                                                                                                                                                                                           ';
	contentHtml+='   </tr><tr>                                                                                                                                                                                                                                           ';
	contentHtml+='      <td>18、所有工程项目施工结束，甲乙双方清算增减项目交尾款后，甲方到乙方处开发票并补交8%税金。最终解释权归辽宁方林装饰有限公司所有。</td>                                                                                                                                                                       ';
	contentHtml+='   </tr><tr>                                                                                                                                                                                                                                           ';
	contentHtml+='  </tr></tbody></table>                                                                                                                                                                                                                                ';
	contentHtml+='  </td>                                                                                                                                                                                                                                                ';
	contentHtml+='  </tr>                                                                                                                                                                                                                                                ';
	contentHtml+='</tbody></table>                                                                                                                                                                                                                                       ';
	
	contentHtml+='<table style="FONT-SIZE: 12px" width="100%" border="0" cellpadding="1" cellspacing="0">    ';
	contentHtml+='<tbody><tr>                                                                                ';
	contentHtml+='<td height="10"></td>                                                                      ';
	contentHtml+='</tr>                                                                                      ';
	contentHtml+='<tr>                                                                                       ';
	contentHtml+='                                                                                           ';
	contentHtml+='   <td><b>&nbsp;客户签字：</b></td>                                                             ';
	contentHtml+='   <td><b>设计师签字：</b></td>                                                                  ';
	contentHtml+='    <td>&nbsp;</td>                                                                        ';
	contentHtml+=' </tr><tr>                                                                                 ';
	contentHtml+='</tr></tbody></table>                                                                      ';
	
	return contentHtml;
}

jQuery(function($) {
	var p = window.location.search.substr(1);
	
	var type = p.split('type=');
	
	var url = api.quotation.queryQuotationDetailById;
	
	url.url = url.url + "?" + p;

	com.post(url, {}, function(res){
		
		decorationOrderDetail.quotationDetail = res.quotationDetail;
		
		com.post(api.decoration.queryDecorationOrderForDesignerByOrderId, {'decorationOrder.orderId':decorationOrderDetail.quotationDetail.orderId},function(res){
			
			decorationOrderDetail.decorationOrder = res.decorationOrder;
			
			calQuotationDetailSum(); // 计算总值
			generatePrintPage(type[1]);
		});
	});
});

function calQuotationDetailSum(){
	var temQuotationDetail = decorationOrderDetail.quotationDetail;
	var functionAreas = temQuotationDetail.functionAreas;
	
	var totalPrice = 0; // 总价
	var normalPrice = 0; // 正常价格
	var discountPrice = 0; // 打折
	var noDiscountTotalPrice = 0; // 不打折
	var carManagePrice = 0; // 车运费
	var managePrice = 0; // 管理费
	
	var carManageFunctionAreaIndex = -1;
	var manageFunctionAreaIndex = -1;
	var carManageItemIndex = -1;
	var manageItemIndex = -1;
	
	decorationOrderDetail.quotationDetail.manageRate =  0;
	decorationOrderDetail.quotationDetail.carManageRate = 0;
	
	var i = 0;
	for(i=0;i<functionAreas.length;++i){
		functionAreas[i].sum = 0;
		functionAreas[i].preSum = 0;
		if(functionAreas[i].functionAreaType == '普通'){//参与打折
			var sum = 0;
			var preSum = 0;
			var preDiscountSum = 0;
			
			for(var j=0;j<functionAreas[i].items.length;j++){
				functionAreas[i].items[j].discountUnitPrice = Math.round((parseFloat(functionAreas[i].items[j].unitPrice)*decorationOrderDetail.quotationDetail.discount/10)*1000)/1000;
				functionAreas[i].items[j].sum = Math.round((parseFloat(functionAreas[i].items[j].unitPrice)*decorationOrderDetail.quotationDetail.discount*parseFloat(functionAreas[i].items[j].num)/10)*1000)/1000;
				functionAreas[i].items[j].preSum = Math.round((parseFloat(functionAreas[i].items[j].unitPrice)*parseFloat(functionAreas[i].items[j].num))*1000)/1000;
				sum+=functionAreas[i].items[j].sum;
				preSum += functionAreas[i].items[j].preSum;
				preDiscountSum += functionAreas[i].items[j].preSum;
			}
			
			functionAreas[i].sum = sum;
			functionAreas[i].preSum = preSum;
			normalPrice += preDiscountSum;
			discountPrice += sum;
			totalPrice+=sum;
		}else {
			var sum = 0;
			var preSum = 0;
			console.log('tesu--',functionAreas[i].items);
			
			for(var j=0;j<functionAreas[i].items.length;j++){
				
				if(/*functionAreas[i].items[j].customFlag == 1 
						||*/((functionAreas[i].items[j].itemName.search('车运费')==-1) && (functionAreas[i].items[j].itemName.search('管理费')==-1))){//不打折
					
					functionAreas[i].items[j].sum = Math.round((parseFloat(functionAreas[i].items[j].unitPrice)*parseFloat(functionAreas[i].items[j].num))*1000)/1000;
					functionAreas[i].items[j].preSum = Math.round((parseFloat(functionAreas[i].items[j].unitPrice)*parseFloat(functionAreas[i].items[j].num))*1000)/1000;
					sum+=functionAreas[i].items[j].sum;
					preSum += functionAreas[i].items[j].preSum;
				}else if((functionAreas[i].items[j].itemName.search('车运费')!=-1)){
					decorationOrderDetail.quotationDetail.carManageRate = functionAreas[i].items[j].unitPrice;
					carManageFunctionAreaIndex = i;
					carManageItemIndex = j;
				}else if((functionAreas[i].items[j].itemName.search('管理费')!=-1)){

					functionAreas[i].items[j].unitPrice = parseFloat(functionAreas[i].items[j].unitPrice)+parseFloat(decorationOrderDetail.quotationDetail.notSalesmanRate);
					decorationOrderDetail.quotationDetail.manageRate = parseFloat(functionAreas[i].items[j].unitPrice);
					manageFunctionAreaIndex = i;
					manageItemIndex = j;
				}
				functionAreas[i].items[j].discountUnitPrice =  Math.round(parseFloat(functionAreas[i].items[j].unitPrice)*1000)/1000;
			}
			functionAreas[i].sum = sum;
			functionAreas[i].preSum = preSum;
			noDiscountTotalPrice += sum;
			totalPrice+=sum;
		}
	}
	
	var commonPrice = discountPrice + noDiscountTotalPrice;
	var preDiscountCommonPrice = normalPrice + noDiscountTotalPrice;
	
	carManagePrice = Math.round(((preDiscountCommonPrice)*parseFloat(decorationOrderDetail.quotationDetail.carManageRate))*100)/100;
	
//	if( parseFloat(decorationOrderDetail.quotationDetail.limitCarManagePrice) > carManagePrice){
//		carManagePrice =  Math.round(parseFloat(decorationOrderDetail.quotationDetail.limitCarManagePrice)*100)/100;
//	}
	
	if(carManageFunctionAreaIndex!=-1){
		preDiscountCommonPrice += carManagePrice;
		functionAreas[carManageFunctionAreaIndex].sum += carManagePrice;
		functionAreas[carManageFunctionAreaIndex].preSum += carManagePrice;
		functionAreas[carManageFunctionAreaIndex].items[carManageItemIndex].sum = carManagePrice;
		functionAreas[carManageFunctionAreaIndex].items[carManageItemIndex].preSum = carManagePrice;
		totalPrice += carManagePrice;
	}
	
	managePrice = Math.round(((preDiscountCommonPrice)*parseFloat(decorationOrderDetail.quotationDetail.manageRate))*100)/100;

	if(manageFunctionAreaIndex!=-1){
		functionAreas[manageFunctionAreaIndex].sum +=managePrice;
		functionAreas[manageFunctionAreaIndex].items[manageItemIndex].sum =managePrice;
		functionAreas[manageFunctionAreaIndex].preSum +=managePrice;
		functionAreas[manageFunctionAreaIndex].items[manageItemIndex].preSum =managePrice;
		totalPrice+=managePrice;
	}
	
	temQuotationDetail.totalPrice = Math.round(totalPrice*100)/100;//总价
	temQuotationDetail.discountPrice =  Math.round(discountPrice*100)/100;//打折
	temQuotationDetail.noDiscountTotalPrice =  Math.round(noDiscountTotalPrice*100)/100;//不打折
	temQuotationDetail.carManagePrice =  Math.round(carManagePrice*100)/100;//车运费
	temQuotationDetail.managePrice =  Math.round(managePrice*100)/100;//管理费
	
	console.log("cal total:",temQuotationDetail);
}

function generatePrintPage(type){
	var html = "";

	if(type=='1'){
		html+=printHeader("辽宁方林装饰工程有限公司家装预算(工程)");
		html+=printProjectTable();
	}else if(type=='2'){
		html+=printHeader("辽宁方林装饰工程有限公司家装预算(财务)");
		html+=printFinanceTable();
	}else if(type=='3'){
		html+=printHeader("辽宁方林装饰工程有限公司家装项目单");
		html+=printCustomerTable();
	}
	                                                                                                                                                                                                       
	$("#quotationList").html(html);
}

