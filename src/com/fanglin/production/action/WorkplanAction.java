package com.fanglin.production.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.production.service.WorkplanService;
import com.fanglin.production.vo.WorkplanVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class WorkplanAction extends BaseListAction {

	private static final long serialVersionUID = 3291331090756496635L;
	@Autowired
	private WorkplanService workplanService;

	private WorkplanVO workplan;

	private List<WorkplanVO> workplans;

	@Action(value = "pageWorkplan", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageWorkplan() throws FLException {

		workplanService.pageWorkplan(getPaging(), getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryWorkplan", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryWorkplan() throws FLException {

		workplans = workplanService.queryWorkplan(queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryWorkplanByWsid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryWorkplanByWsid() throws FLException {

		workplans = workplanService.queryWorkplanByWsid(workplan, queryCompany());

		return SUCCESS;
	}

	@Action(value = "addWorkplan", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addWorkplan() throws FLException {

		workplanService.addWorkplan(workplan, queryCompany());

		return SUCCESS;
	}

	@Action(value = "updateWorkplan", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateWorkplan() throws FLException {

		workplanService.updateWorkplan(workplan);

		return SUCCESS;
	}

	@Action(value = "updateWorkplanForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateWorkplanForStatus() throws FLException {

		workplanService.updateWorkplanForStatus(workplan);

		return SUCCESS;
	}

	public WorkplanVO getWorkplan() {
		return workplan;
	}

	public void setWorkplan(WorkplanVO workplan) {
		this.workplan = workplan;
	}

	public List<WorkplanVO> getWorkplans() {
		return workplans;
	}

	public void setWorkplans(List<WorkplanVO> workplans) {
		this.workplans = workplans;
	}

}
