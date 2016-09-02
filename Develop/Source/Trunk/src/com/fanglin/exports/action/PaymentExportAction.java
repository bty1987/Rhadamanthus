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
import com.fanglin.payment.service.DecorationPaymentService;
import com.fanglin.payment.service.MaterialPaymentService;
import com.fanglin.payment.service.PaymentService;
import com.fanglin.payment.vo.DecorationPaymentVO;
import com.fanglin.payment.vo.MaterialPaymentVO;
import com.fanglin.payment.vo.PaymentVO;
import com.fanglin.utils.PoiExcelUtil;

@ParentPackage("base")
@Namespace("/")
@Controller
public class PaymentExportAction extends BaseExportAction {

	private static final long serialVersionUID = -15998121113548111L;
	
	@Autowired
	private PaymentService paymentService;

	@Autowired
	private DecorationPaymentService decorationPaymentService;
	
	@Autowired
	private MaterialPaymentService materialPaymentService;
	
	private String decorationOrderId;
	
	@Action(value = "exportDecorationPayment", results = { @Result(name = "success", type = "stream", params = { "contentType", "text/html","contentDisposition", "attachment;fileName=${fileName}", "inputName", "downloadFileInputStream", "encode", "true"}) })
	public String exportDecorationPayment() throws FLException {
		
		if(getFilters() == null){
			throw new FLException(119000, "必须添加筛选条件,否则数据量过大");
		}
		
		setFileName("装修收款信息.xls");
		
		List<DecorationPaymentVO> decorationPaymentVOs = decorationPaymentService.queryDecorationPayments(getFilters());
		
		ExcelWorkSheet<DecorationPaymentVO> sheet = new ExcelWorkSheet<DecorationPaymentVO>();
		sheet.setData(decorationPaymentVOs);
		sheet.setColumns(Arrays.asList("订单编号", "收款类型","客户名", "设计师", "应收款", "现金", "刷卡", "刷卡信息", "券金额", "券信息", "预付款", "支票", "支票银行", "分期", "分期银行", "对公", "对公银行", "收款人", "收款时间"));
		sheet.setPropertyNames(Arrays.asList("orderId", "paymentType", "customer", "designer", "referMoney", "cash", "bank", "bankInfo", "coupon", "couponInfo", "advance", "checkv", "checkvBankName", "installment", "installmentBankName", "accounts", "accountsBankName", "collectUser", "collectTime"));
		
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
		
		List<MaterialPaymentVO> materialPaymentVOs = materialPaymentService.queryMaterialPayment(getFilters());
		
		ExcelWorkSheet<MaterialPaymentVO> sheet = new ExcelWorkSheet<MaterialPaymentVO>();
		sheet.setData(materialPaymentVOs);
		
		sheet.setColumns(Arrays.asList("装修编号", "主材编号", "楼盘地址", "客户", "装修顾问", "部门", "分区", "品类", "品牌", "现金", "刷卡", "刷卡信息", "主材券值", "主材券", "收款券值", "收款券", "收款类型", "应收金额", "创建人", "收款人", "收款时间"));
		sheet.setPropertyNames(Arrays.asList("msoNo", "orderId", "orderAddr", "customerName", "salesmanName", "departmentName", "regionName", "materialType", "materialBrand", "cash", "bank", "bankInfo", "msoCoupon", "msoCouponInfo", "coupon", "couponInfo", "paymentTypeName", "referMoney", "createUserName", "collectUserName", "collectTime"));
		
		ByteArrayOutputStream os = new ByteArrayOutputStream();
		PoiExcelUtil.exportExcel(sheet, os);
		
		byte[] b = os.toByteArray();
		  
		ByteArrayInputStream in = new ByteArrayInputStream(b);

		setDownloadFileInputStream(in);
		
		return SUCCESS;
	}
	
	@Action(value = "exportPayment", results = { @Result(name = "success", type = "stream", params = { "contentType", "text/html", "contentDisposition", "attachment;fileName=${fileName}", "inputName", "downloadFileInputStream", "encode", "true"}) })
	public String exportPayment(){
		
		setFileName("预付款收款信息.xls");
		
		List<PaymentVO> paymentVOs = paymentService.queryPayment(getFilters());
		
		ExcelWorkSheet<PaymentVO> sheet = new ExcelWorkSheet<PaymentVO>();
		sheet.setData(paymentVOs);
		
		sheet.setColumns(Arrays.asList("paymentId"));
		sheet.setPropertyNames(Arrays.asList("paymentId"));
		
		ByteArrayOutputStream os = new ByteArrayOutputStream();
		PoiExcelUtil.exportExcel(sheet, os);
		
		byte[] b = os.toByteArray();
		  
		ByteArrayInputStream in = new ByteArrayInputStream(b);

		setDownloadFileInputStream(in);
		
		return SUCCESS;
	}

	public String getDecorationOrderId(){
		return decorationOrderId;
	}

	public void setDecorationOrderId(String decorationOrderId){
		this.decorationOrderId = decorationOrderId;
	}
	
}
