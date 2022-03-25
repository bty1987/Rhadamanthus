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

	@Action(value = "pageOales", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageOales() throws FLException {

		oalesService.pageOales(getPaging(), getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryOalesByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryOalesByOrderId() throws FLException {

		oaleses = oalesService.queryOalesByOrderId(oales);

		return SUCCESS;
	}

	@Action(value = "addOales", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addOales() throws FLException {

		oalesService.addOales(oales, queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "awardOales", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String awardOales() throws FLException {

		oalesService.awardOales(oales);

		return SUCCESS;
	}

	@Action(value = "profitOales", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String profitOales() throws FLException {

		oalesService.profitOales(oales);

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

}
