package com.fanglin.information.action;

//import java.text.ParseException;
import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.information.service.PlanService;
import com.fanglin.information.vo.PlanVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class PlanAction extends BaseListAction{
	
	private static final long serialVersionUID = 3246937855994579649L;

	@Autowired
	private PlanService planService;
	
	private PlanVO plan;
	
	private List<PlanVO> plans;

	@Action(value = "pagePlan", results = {@Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pagePlan() throws FLException{
		
		planService.pagePlan(getPaging(),getFilters(),authentication(), queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value = "createPlan", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String createPlan() throws Exception{
		
		planService.createPlan(plan,queryUserId(), queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value = "cancelPlan", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String cancelPlan() throws FLException{
		
		planService.cancelPlan(plan,queryUserId());
		
		return SUCCESS;
	}
	public PlanVO getPlan() {
		return plan;
	}
	public void setPlan(PlanVO plan) {
		this.plan = plan;
	}

	public List<PlanVO> getPlans() {
		return plans;
	}

	public void setPlans(List<PlanVO> plans) {
		this.plans = plans;
	}
	
	
}
