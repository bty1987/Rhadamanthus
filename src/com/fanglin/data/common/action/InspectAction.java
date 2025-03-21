package com.fanglin.data.common.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.common.service.InspectService;
import com.fanglin.data.common.vo.InspectVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class InspectAction extends BaseListAction {

	private static final long serialVersionUID = -6125062063506982916L;

	@Autowired
	private InspectService inspectService;

	private InspectVO inspect;

	private List<InspectVO> inspects;

	@Action(value = "pageInspect", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageInspect() throws FLException {

		inspectService.pageInspect(getPaging(), getFilters());

		return SUCCESS;
	}

	@Action(value = "queryInspect", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryInspect() throws FLException {

		inspects = inspectService.queryInspect(inspect);

		return SUCCESS;
	}

	@Action(value = "addInspect", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addInspect() throws FLException {

		inspectService.addInspect(inspect, queryCompany());

		return SUCCESS;
	}

	@Action(value = "updateInspect", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateInspect() throws FLException {

		inspectService.updateInspect(inspect);

		return SUCCESS;
	}

	@Action(value = "updateInspectForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateInspectForStatus() throws FLException {

		inspectService.updateInspectForStatus(inspect);

		return SUCCESS;
	}

	public InspectVO getInspect() {
		return inspect;
	}

	public void setInspect(InspectVO inspect) {
		this.inspect = inspect;
	}

	public List<InspectVO> getInspects() {
		return inspects;
	}

	public void setInspects(List<InspectVO> inspects) {
		this.inspects = inspects;
	}

}
