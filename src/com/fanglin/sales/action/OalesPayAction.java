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
import com.fanglin.sales.service.OalesPayService;
import com.fanglin.sales.vo.OalesPayVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class OalesPayAction extends BaseListAction {

	private static final long serialVersionUID = -7364698689627625808L;

	@Autowired
	private OalesPayService oalesPayService;

	private OalesPayVO oalesPay;

	private List<OalesPayVO> oalesPays;

	@Action(value = "pageOalesPay", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageOalesPay() throws FLException {

		oalesPayService.pageOalesPay(getPaging(), getFilters());

		return SUCCESS;
	}

	@Action(value = "queryOalesPay", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryOalesPay() throws FLException {

		oalesPays = oalesPayService.queryOalesPay(oalesPay);

		return SUCCESS;
	}

	@Action(value = "addOalesPay", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addOalesPay() throws FLException {

		oalesPayService.addOalesPay(oalesPay, queryUserId());

		return SUCCESS;
	}

	@Action(value = "updateOalesPay", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateOalesPay() throws FLException {

		oalesPayService.updateOalesPay(oalesPay);

		return SUCCESS;
	}

	@Action(value = "updateOalesPayForAdvance", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateOalesPayForAdvance() throws FLException {

		oalesPayService.updateOalesPayForAdvance(oalesPay);

		return SUCCESS;
	}

	@Action(value = "deleteOalesPay", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteOalesPay() throws FLException {

		oalesPayService.deleteOalesPay(oalesPay);

		return SUCCESS;
	}

	public OalesPayService getOalesPayService() {
		return oalesPayService;
	}

	public void setOalesPayService(OalesPayService oalesPayService) {
		this.oalesPayService = oalesPayService;
	}

	public OalesPayVO getOalesPay() {
		return oalesPay;
	}

	public void setOalesPay(OalesPayVO oalesPay) {
		this.oalesPay = oalesPay;
	}

	public List<OalesPayVO> getOalesPays() {
		return oalesPays;
	}

	public void setOalesPays(List<OalesPayVO> oalesPays) {
		this.oalesPays = oalesPays;
	}

}
