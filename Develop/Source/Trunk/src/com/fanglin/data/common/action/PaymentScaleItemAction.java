package com.fanglin.data.common.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.data.common.service.PaymentScaleItemService;
import com.fanglin.data.common.vo.PaymentScaleItemVO;

@Controller
@ParentPackage("base")
@Namespace("/")
public class PaymentScaleItemAction extends BaseListAction{

	private static final long serialVersionUID = 4931624886904941777L;
	
	@Autowired PaymentScaleItemService  paymentScaleItemService;
	
	private PaymentScaleItemVO paymentScaleitem;
	
	private List<PaymentScaleItemVO> paymentScaleItems;

	@Action(value="queryPaymentScaleItemByPsid", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryPaymentScaleItemByPsid (){
		
			paymentScaleItems = paymentScaleItemService.queryPaymentScaleItemByPsid(paymentScaleitem);
		
			return SUCCESS;
	}
	
	@Action(value="addPaymentScaleItem", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String addPaymentScaleItem (){
		
			paymentScaleItemService.addPaymentScaleItem(paymentScaleitem);
		
			return SUCCESS;
	}
	
	@Action(value="deletePaymentScaleItem", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String deletePaymentScaleItem (){
		
			paymentScaleItemService.deletePaymentScaleItem(paymentScaleitem);
	
			return SUCCESS;
	}

	public PaymentScaleItemVO getPaymentScaleitem() {
		return paymentScaleitem;
	}

	public void setPaymentScaleitem(PaymentScaleItemVO paymentScaleitem) {
		this.paymentScaleitem = paymentScaleitem;
	}

	public List<PaymentScaleItemVO> getPaymentScaleItems() {
		return paymentScaleItems;
	}

	public void setPaymentScaleItems(List<PaymentScaleItemVO> paymentScaleItems) {
		this.paymentScaleItems = paymentScaleItems;
	}
	
}
