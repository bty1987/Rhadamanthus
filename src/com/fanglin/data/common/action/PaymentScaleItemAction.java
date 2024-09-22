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
import com.fanglin.data.common.vo.PaymentScaleVO;

@Controller
@ParentPackage("base")
@Namespace("/")
public class PaymentScaleItemAction extends BaseListAction {

	private static final long serialVersionUID = 4931624886904941777L;

	@Autowired
	private PaymentScaleItemService paymentScaleItemService;

	private List<PaymentScaleItemVO> paymentScaleItems;

	private PaymentScaleItemVO paymentScaleItem;

	private PaymentScaleVO paymentScale;

	@Action(value = "queryPaymentScaleItemByPsid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryPaymentScaleItemByPsid() {

		paymentScaleItems = paymentScaleItemService.queryPaymentScaleItemByPsid(paymentScaleItem);

		return SUCCESS;
	}

	@Action(value = "fetchPaymentScaleItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String fetchPaymentScaleItem() {

		paymentScaleItems = paymentScaleItemService.fetchPaymentScaleItem(paymentScale, paymentScaleItem);

		return SUCCESS;
	}

	@Action(value = "queryPaymentScaleItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryPaymentScaleItem() {

		paymentScaleItem = paymentScaleItemService.queryPaymentScaleItem(paymentScale, paymentScaleItem);

		return SUCCESS;
	}

	@Action(value = "addPaymentScaleItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addPaymentScaleItem() {

		paymentScaleItemService.addPaymentScaleItem(paymentScaleItem);

		return SUCCESS;
	}

	@Action(value = "deletePaymentScaleItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deletePaymentScaleItem() {

		paymentScaleItemService.deletePaymentScaleItem(paymentScaleItem);

		return SUCCESS;
	}

	public PaymentScaleItemVO getPaymentScaleItem() {
		return paymentScaleItem;
	}

	public void setPaymentScaleItem(PaymentScaleItemVO paymentScaleItem) {
		this.paymentScaleItem = paymentScaleItem;
	}

	public List<PaymentScaleItemVO> getPaymentScaleItems() {
		return paymentScaleItems;
	}

	public void setPaymentScaleItems(List<PaymentScaleItemVO> paymentScaleItems) {
		this.paymentScaleItems = paymentScaleItems;
	}

	public PaymentScaleVO getPaymentScale() {
		return paymentScale;
	}

	public void setPaymentScale(PaymentScaleVO paymentScale) {
		this.paymentScale = paymentScale;
	}

}
