package com.fanglin.right.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.right.service.PaymentFunctionRightService;
import com.fanglin.right.vo.PaymentFunctionRightVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class PaymentFunctionRightAction extends BaseListAction {

	private static final long serialVersionUID = 3410914070623126747L;

	@Autowired
	private PaymentFunctionRightService paymentFunctionRightService;
	
	private List<PaymentFunctionRightVO> paymentFunctionRights;
	
	private PaymentFunctionRightVO paymentFunctionRight;
	
	private List<Long> pfids;
	
	@Action(value="queryPaymentFunctionRight", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryPaymentFunctionRight() throws FLException{
		
		paymentFunctionRights = paymentFunctionRightService.queryPaymentFunctionRight(paymentFunctionRight);
		
		return SUCCESS;
	}
	
	@Action(value="updatePaymentFunctionRight", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String updatePaymentFunctionRight() throws FLException{
		
		paymentFunctionRightService.updatePaymentFunctionRight(paymentFunctionRight, pfids, queryCompany());
		
		return SUCCESS;
	}

	public List<PaymentFunctionRightVO> getPaymentFunctionRights() {
		return paymentFunctionRights;
	}

	public void setPaymentFunctionRights(
			List<PaymentFunctionRightVO> paymentFunctionRights) {
		this.paymentFunctionRights = paymentFunctionRights;
	}

	public PaymentFunctionRightVO getPaymentFunctionRight() {
		return paymentFunctionRight;
	}

	public void setPaymentFunctionRight(PaymentFunctionRightVO paymentFunctionRight) {
		this.paymentFunctionRight = paymentFunctionRight;
	}

	public List<Long> getPfids() {
		return pfids;
	}

	public void setPfids(List<Long> pfids) {
		this.pfids = pfids;
	}

}
