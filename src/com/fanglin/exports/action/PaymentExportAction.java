/**
 * @File Name		: DecorationPaymentAction
 * @Package   	: com.fanglin.action.quotation
 * @Version		: 1.0
 * @Date			: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.exports.action;

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
import com.fanglin.core.interceptor.FLException;
import com.fanglin.exports.service.PaymentExportService;
import com.fanglin.exports.vo.DecorationPaymentExportVO;
import com.fanglin.exports.vo.MaterialPaymentExportVO;
import com.fanglin.utils.PoiExcelUtil;

@ParentPackage("base")
@Namespace("/")
@Controller
public class PaymentExportAction extends BaseExportAction {

	private static final long serialVersionUID = -15998121113548111L;
	
	@Autowired
	private PaymentExportService paymentExportService;
	
	@Action(value = "exportDecorationPayment", results = { @Result(name = "success", type = "stream", params = { "contentType", "text/html","contentDisposition", "attachment;fileName=${fileName}", "inputName", "downloadFileInputStream", "encode", "true"}) })
	public String exportDecorationPayment() throws FLException {
		
		setFileName("装修收款信息.xls");
		
		List<DecorationPaymentExportVO> decorationPaymentExportVOs = paymentExportService.queryDecorationPaymentExport(getFilters());
		
		ExcelWorkSheet<DecorationPaymentExportVO> sheet = new ExcelWorkSheet<DecorationPaymentExportVO>();
		sheet.setData(decorationPaymentExportVOs);
		
		sheet.setColumns(Arrays.asList("订单编号", "楼盘", "楼号", "设计师", "设计部", "分区", "收款类型", "金额", "券", "券信息", "收款时间"));
		sheet.setPropertyNames(Arrays.asList("orderId", "village", "houseNumber", "designer", "designerDepartment", "paymentType", "referMoney", "coupon", "couponInfo", "collectTime"));
		
		ByteArrayOutputStream os = new ByteArrayOutputStream();
		PoiExcelUtil.exportExcel(sheet, os);
		
		byte[] b = os.toByteArray();
		  
		ByteArrayInputStream in = new ByteArrayInputStream(b);

		setDownloadFileInputStream(in);
	    
		return SUCCESS;
	}
	
	@Action(value = "exportMaterialPayment", results = { @Result(name = "success", type = "stream", params = { "contentType", "text/html", "contentDisposition", "attachment;fileName=${fileName}", "inputName", "downloadFileInputStream", "encode", "true"}) })
	public String exportMaterialPaymentByCollectTime(){
		
		setFileName("主材收款信息.xls");
		
		List<MaterialPaymentExportVO> materialPaymentExportVOs = paymentExportService.queryMaterialPaymentExport(getFilters());
		
		ExcelWorkSheet<MaterialPaymentExportVO> sheet = new ExcelWorkSheet<MaterialPaymentExportVO>();
		sheet.setData(materialPaymentExportVOs);
		
		sheet.setColumns(Arrays.asList("装修编号", "主材编号", "楼盘地址", "客户", "装修顾问", "部门", "分区", "品类", "品牌", "现金", "刷卡", "刷卡信息", "主材券值", "主材券", "收款券值", "收款券", "收款类型", "应收金额", "创建人", "收款人", "收款时间"));
		sheet.setPropertyNames(Arrays.asList("orderId", "msoNo", "orderAddr", "customerName", "salesmanName", "departmentName", "regionName", "materialType", "materialBrand", "cash", "bank", "bankInfo", "msoCoupon", "msoCouponInfo", "coupon", "couponInfo", "paymentTypeName", "referMoney", "createUserName", "collectUserName", "collectTime"));
		
		ByteArrayOutputStream os = new ByteArrayOutputStream();
		PoiExcelUtil.exportExcel(sheet, os);
		
		byte[] b = os.toByteArray();
		  
		ByteArrayInputStream in = new ByteArrayInputStream(b);

		setDownloadFileInputStream(in);
		
		return SUCCESS;
	}
	
}
