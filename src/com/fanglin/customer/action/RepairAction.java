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
import com.fanglin.customer.service.RepairService;
import com.fanglin.customer.vo.RepairVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class RepairAction extends BaseListAction {

	private static final long serialVersionUID = 8337226898830528233L;
	
	@Autowired
	private RepairService repairService;
	
	private RepairVO repair;
	
	private List<RepairVO> repairs;
	
	@Action(value = "queryRepair", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryRepair() throws FLException {

		repairs = repairService.queryRepair(repair);

		return SUCCESS;
	}
	
	@Action(value = "addRepair", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addRepair() throws FLException {

		repairService.addRepair(repair, queryUserId());

		return SUCCESS;
	}
	
	@Action(value = "keepRepair", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String keepRepair() throws FLException {

		repairService.keepRepair(repair, queryUserId());

		return SUCCESS;
	}
	
	@Action(value = "finishRepair", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String finishRepair() throws FLException {

		repairService.finishRepair(repair, queryUserId());

		return SUCCESS;
	}

	public RepairVO getRepair() {
		return repair;
	}

	public void setRepair(RepairVO repair) {
		this.repair = repair;
	}

	public List<RepairVO> getRepairs() {
		return repairs;
	}

	public void setRepairs(List<RepairVO> repairs) {
		this.repairs = repairs;
	}

}
