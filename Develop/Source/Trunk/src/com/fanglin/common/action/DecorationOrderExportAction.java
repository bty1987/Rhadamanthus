/**
 * @File Name		: DecorationOrderExportAction.java
 * @Package   	: com.fanglin.decoration.action
 * @Version		: 1.0
 * @Date			: 2015-5-30
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.common.action;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.util.Arrays;
import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.common.vo.ExcelWorkSheet;
import com.fanglin.core.action.BaseExportAction;
import com.fanglin.decoration.service.DecorationOrderService;
import com.fanglin.decoration.vo.DecorationOrderExportVO;
import com.fanglin.utils.PoiExcelUtil;

@ParentPackage("base")
@Namespace("/")
@Controller
public class DecorationOrderExportAction extends BaseExportAction{

	private static final long serialVersionUID = 1175808206393666579L;
	
	@Autowired
	private DecorationOrderService decorationOrderService;
	
	@Action(value = "exportDecorationorderByContractTime", results = { @Result(name = "success", type = "stream", params = { "contentType", "text/html", "contentDisposition", "attachment;fileName=${fileName}", "inputName", "downloadFileInputStream", "encode", "true"}) })
	public String exportDecorationorderByContractTime(){
		
		setFileName("订单签单信息.xls");
		
		List<DecorationOrderExportVO> decorationOrderExportVOs = decorationOrderService.queryDecorationOrderForComplete(getFilters());
		
		ExcelWorkSheet<DecorationOrderExportVO> sheet = new ExcelWorkSheet<DecorationOrderExportVO>();
		sheet.setData(decorationOrderExportVOs);
		
		sheet.setColumns(Arrays.asList("编号", "楼盘地址", "签单时间", "是否合尺", "是否退单", "活动", "非业务提成", "非业务提点", "签单额", "操作人编号", "操作人编号", "操作人", "操作类型", "部门编号", "部门", "分区编号", "分区", "比例", "折扣", "乳胶漆提成", "管理费", "管理费提点", "运输费", "设计费", "设计费状态", "首付款", "收款时间", "首付二期款", "收款时间", "二期款", "收款时间", "尾款", "尾款时间", "违约金", "预付款余额", "净业绩", "未付款金额", "业务类型", "面积", "监理"));
		sheet.setPropertyNames(Arrays.asList("orderId", "orderAddr", "contractTime", "merge", "giveup", "activity", "notSalesmanCut", "notSalesmanRate", "contractPrice", "userId", "operateUserId", "operateUserName", "operateType", "departmentId", "department", "regionId", "region", "rate", "discount", "latexCut", "managePrice", "manageRate", "trafficPrice", "designPayment", "designPaymentStatus", "firstPayment", "firstCollectTime", "firstSecondPayment", "firstSecondCollectTime", "secondPayment", "secondCollectTime", "thirdPayment", "thirdCollectTime", "penalty", "advancePayment", "achievement", "unpayPayment", "salesmanType", "houseArea", "supervisor"));
		
		ByteArrayOutputStream os = new ByteArrayOutputStream();
		PoiExcelUtil.exportExcel(sheet, os);
		
		byte[] b = os.toByteArray();
		  
		ByteArrayInputStream in = new ByteArrayInputStream(b);

		setDownloadFileInputStream(in);
		
		return SUCCESS;
	}

}
