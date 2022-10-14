package com.fanglin.payment.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.payment.service.PaytranService;
import com.fanglin.payment.vo.PaytranVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class PaytranAction extends BaseListAction {

	private static final long serialVersionUID = 2664725104672617015L;

	@Autowired
	private PaytranService paytranService;

	private List<PaytranVO> paytrans;

	private PaytranVO paytran;

	@Action(value = "pagePaytran", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pagePaytran() throws FLException {

		paytranService.pagePaytran(getPaging(), getFilters());

		return SUCCESS;
	}

	@Action(value = "queryPaytran", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryPaytran() throws FLException {

		paytrans = paytranService.queryPaytran(paytran);

		return SUCCESS;
	}

	@Action(value = "addPaytran", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addPaytran() throws FLException {

		paytranService.addPaytran(paytran, queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "checkPaytran", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String checkPaytran() throws FLException {

		paytranService.checkPaytran(paytran, queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "cancelPaytran", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String cancelPaytran() throws FLException {

		paytranService.cancelPaytran(paytran, queryCompany());

		return SUCCESS;
	}

	@Action(value = "sendPaytran", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String sendPaytran() throws FLException {

		paytranService.sendPaytran(paytran);

		return SUCCESS;
	}

	@Action(value = "posPay", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String posPay() throws FLException {

		paytranService.posPay(paytran, queryCompany());

		return SUCCESS;
	}

	public List<PaytranVO> getPaytrans() {
		return paytrans;
	}

	public void setPaytrans(List<PaytranVO> paytrans) {
		this.paytrans = paytrans;
	}

	public PaytranVO getPaytran() {
		return paytran;
	}

	public void setPaytran(PaytranVO paytran) {
		this.paytran = paytran;
	}

}
