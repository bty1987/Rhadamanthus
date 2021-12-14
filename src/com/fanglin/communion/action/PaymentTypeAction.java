package com.fanglin.communion.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.communion.service.PaymentTypeService;
import com.fanglin.communion.vo.PaymentTypeVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.utils.SystemConfig;

@ParentPackage("base")
@Namespace("/")
@Controller
public class PaymentTypeAction extends BaseListAction {

	private static final long serialVersionUID = 8102074404181756437L;

	@Autowired
	private PaymentTypeService paymentTypeService;

	private PaymentTypeVO paymentType;

	private List<PaymentTypeVO> paymentTypes;

	@Action(value = "pagePaymentType", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pagePaymentType() {

		paymentTypeService.pagePaymentType(getPaging(), getFilters());

		return SUCCESS;
	}

	@Action(value = "queryPaymentType", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryPaymentType() {

		paymentTypes = paymentTypeService.queryPaymentType(paymentType);

		return SUCCESS;
	}

	@Action(value = "queryPaymentTypeByPtid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryPaymentTypeByPtid() throws FLException {

		paymentType = paymentTypeService.queryPaymentTypeByPtid(paymentType);

		return SUCCESS;
	}

	@Action(value = "addPaymentType", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addPaymentType() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		paymentTypeService.addPaymentType(paymentType);

		return SUCCESS;
	}

	@Action(value = "updatePaymentType", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updatePaymentType() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		paymentTypeService.updatePaymentType(paymentType);

		return SUCCESS;
	}

	@Action(value = "updatePaymentTypeForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updatePaymentTypeForStatus() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		paymentTypeService.updatePaymentTypeForStatus(paymentType);

		return SUCCESS;
	}

	public PaymentTypeVO getPaymentType() {
		return paymentType;
	}

	public void setPaymentType(PaymentTypeVO paymentType) {
		this.paymentType = paymentType;
	}

	public List<PaymentTypeVO> getPaymentTypes() {
		return paymentTypes;
	}

	public void setPaymentTypes(List<PaymentTypeVO> paymentTypes) {
		this.paymentTypes = paymentTypes;
	}

}
