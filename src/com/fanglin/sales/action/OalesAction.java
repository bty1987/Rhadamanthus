package com.fanglin.sales.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.sales.service.OalesService;
import com.fanglin.sales.vo.OalesVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class OalesAction extends BaseListAction {

	private static final long serialVersionUID = -4554612918980565342L;

	@Autowired
	private OalesService oalesService;

	private OalesVO oales;

	private List<OalesVO> oaleses;

	private List<Short> statuses;

	private Long amount;

	@Action(value = "pageOales", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageOales() throws FLException {

		oalesService.pageOales(getPaging(), getFilters(), queryCompany(), statuses);

		return SUCCESS;
	}

	@Action(value = "pageOalesForAccount", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageOalesForAccount() throws FLException {

		oalesService.pageOalesForAccount(getPaging(), getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryOalesByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryOalesByOrderId() throws FLException {

		oaleses = oalesService.queryOalesByOrderId(oales);

		return SUCCESS;
	}

	@Action(value = "amountOales", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String amountOales() throws FLException {

		amount = oalesService.amountOales(oales);

		return SUCCESS;
	}

	@Action(value = "addOales", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addOales() throws FLException {

		oalesService.addOales(oales, queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "updateOales", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateOales() throws FLException {

		oalesService.updateOales(oales);

		return SUCCESS;
	}

	@Action(value = "submitOales", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String submitOales() throws FLException {

		oalesService.submitOales(oales);

		return SUCCESS;
	}

	@Action(value = "cancelOales", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String cancelOales() throws FLException {

		oalesService.cancelOales(oales);

		return SUCCESS;
	}

	@Action(value = "confirmOales", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String confirmOales() throws FLException {

		oalesService.confirmOales(oales);

		return SUCCESS;
	}

	@Action(value = "rejectOales", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String rejectOales() throws FLException {

		oalesService.rejectOales(oales, queryUserId());

		return SUCCESS;
	}

	@Action(value = "checkOales", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String checkOales() throws FLException {

		oalesService.checkOales(oaleses);

		return SUCCESS;
	}

	@Action(value = "finishOales", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String finishOales() throws FLException {

		oalesService.finishOales(oales);

		return SUCCESS;
	}

	@Action(value = "abateOales", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String abateOales() throws FLException {

		oalesService.abateOales(oales);

		return SUCCESS;
	}

	@Action(value = "refundOales", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String refundOales() throws FLException {

		oalesService.refundOales(oales, queryUserId());

		return SUCCESS;
	}

	@Action(value = "scaleOales", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String scaleOales() throws FLException {

		oalesService.scaleOales(oales);

		return SUCCESS;
	}

	@Action(value = "deleteOales", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteOales() throws FLException {

		oalesService.deleteOales(oales);

		return SUCCESS;
	}

	@Action(value = "activityOales", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String activityOales() throws FLException {

		oalesService.activityOales(oales);

		return SUCCESS;
	}

	public OalesVO getOales() {
		return oales;
	}

	public void setOales(OalesVO oales) {
		this.oales = oales;
	}

	public List<OalesVO> getOaleses() {
		return oaleses;
	}

	public void setOaleses(List<OalesVO> oaleses) {
		this.oaleses = oaleses;
	}

	public List<Short> getStatuses() {
		return statuses;
	}

	public void setStatuses(List<Short> statuses) {
		this.statuses = statuses;
	}

	public Long getAmount() {
		return amount;
	}

	public void setAmount(Long amount) {
		this.amount = amount;
	}
}
