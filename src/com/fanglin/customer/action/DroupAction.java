package com.fanglin.customer.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.customer.service.DroupService;
import com.fanglin.customer.vo.DroupVO;

@ParentPackage("common")
@Namespace("/")
@Controller
public class DroupAction extends BaseListAction {

	private static final long serialVersionUID = 5036078699510882224L;

	@Autowired
	private DroupService droupService;

	private DroupVO droup;

	private List<DroupVO> droups;

	@Action(value = "pageDroup", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageDroup() throws FLException {

		droupService.pageDroup(getPaging(), getFilters());

		return SUCCESS;
	}

	@Action(value = "queryDroup", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDroup() throws FLException {

		droup = droupService.queryDroup(droup);

		return SUCCESS;
	}

	@Action(value = "bindDroup", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String bindDroup() throws FLException {

		droupService.bindDroup(droup, queryUserId());

		return SUCCESS;
	}

	@Action(value = "updateDroup", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateDroup() throws FLException {

		droupService.updateDroup(droup);

		return SUCCESS;
	}

	@Action(value = "deleteDroup", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteDroup() throws FLException {

		droupService.deleteDroup(droup);

		return SUCCESS;
	}

	public DroupVO getDroup() {
		return droup;
	}

	public void setDroup(DroupVO droup) {
		this.droup = droup;
	}

	public List<DroupVO> getDroups() {
		return droups;
	}

	public void setDroups(List<DroupVO> droups) {
		this.droups = droups;
	}

}
