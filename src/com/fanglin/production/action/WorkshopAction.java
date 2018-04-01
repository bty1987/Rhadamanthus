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
import com.fanglin.production.service.WorkshopService;
import com.fanglin.production.vo.WorkshopVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class WorkshopAction extends BaseListAction {

	private static final long serialVersionUID = -611797342706303774L;

	@Autowired
	private WorkshopService workshopService;

	private WorkshopVO workshop;

	private List<WorkshopVO> workshops;

	@Action(value = "pageWorkshop", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageWorkshop() throws FLException {

		workshopService.pageWorkshop(getPaging(), getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryWorkshop", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryWorkshop() throws FLException {

		workshops = workshopService.queryWorkshop(queryCompany());

		return SUCCESS;
	}

	@Action(value = "addWorkshop", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addWorkshop() throws FLException {

		workshopService.addWorkshop(workshop, queryCompany());

		return SUCCESS;
	}

	@Action(value = "updateWorkshop", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateWorkshop() throws FLException {

		workshopService.updateWorkshop(workshop);

		return SUCCESS;
	}

	@Action(value = "updateWorkshopForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateWorkshopForStatus() throws FLException {

		workshopService.updateWorkshopForStatus(workshop);

		return SUCCESS;
	}

	public WorkshopVO getWorkshop() {
		return workshop;
	}

	public void setWorkshop(WorkshopVO workshop) {
		this.workshop = workshop;
	}

	public List<WorkshopVO> getWorkshops() {
		return workshops;
	}

	public void setWorkshops(List<WorkshopVO> workshops) {
		this.workshops = workshops;
	}

}
