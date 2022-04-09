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

	@Action(value = "updateOales", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateOales() throws FLException {

		oalesService.updateOales(oales);

		return SUCCESS;
	}

	@Action(value = "deleteOales", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteOales() throws FLException {

		oalesService.deleteOales(oales);

		return SUCCESS;
	}

	@Action(value = "confirmOales", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String confirmOales() throws FLException {

		oalesService.confirmOales(oales);

		return SUCCESS;
	}

	@Action(value = "rejectOales", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String rejectOales() throws FLException {

		oalesService.rejectOales(oales);

		return SUCCESS;
	}

	@Action(value = "checkOales", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String checkOales() throws FLException {

		oalesService.checkOales(oales);

		return SUCCESS;
	}

	@Action(value = "finishOales", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String finishOales() throws FLException {

		oalesService.finishOales(oales);

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
