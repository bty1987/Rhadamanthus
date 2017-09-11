package com.fanglin.data.common.action;

import java.util.List;
import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.common.service.PaymentScaleService;
import com.fanglin.data.common.vo.PaymentScaleVO;

@Controller
@ParentPackage("base")
@Namespace("/")
public class PaymentScaleAction extends BaseListAction{

	private static final long serialVersionUID = 664666491070669653L;
	
	@Autowired PaymentScaleService  PaymentScaleservice ;
	
	private PaymentScaleVO paymentScale;
	
	private List<PaymentScaleVO> paymentScales ;
	
	@Action(value="queryPaymentScaleByCid", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryPaymentScaleByCid() throws FLException{
		
		paymentScales = PaymentScaleservice.queryPaymentScaleByCid(paymentScale);
		
		return SUCCESS;
	}
	
	@Action(value="addPaymentScale", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String addPaymentScale() throws FLException{
		
		PaymentScaleservice.addPaymentScale(paymentScale);
		
		return SUCCESS;
	}
	
	@Action(value="deletePaymentScale", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String deletePaymentScale() throws FLException{
		
		PaymentScaleservice.deletePaymentScale(paymentScale);
		
		return SUCCESS;
	}

	public PaymentScaleVO getPaymentScale() {
		return paymentScale;
	}

	public void setPaymentScale(PaymentScaleVO paymentScale) {
		this.paymentScale = paymentScale;
	}

	public List<PaymentScaleVO> getPaymentScales() {
		return paymentScales;
	}

	public void setPaymentScales(List<PaymentScaleVO> paymentScales) {
		this.paymentScales = paymentScales;
	}
	
}
