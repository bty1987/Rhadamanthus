package com.fanglin.data.common.action;


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

@ParentPackage("common")
@Namespace("/")
@Controller
public class PlanUpdataAction extends BaseListAction{

	private static final long serialVersionUID = 3642430954133542082L;

	@Autowired
	private PlanService planService;

	private PlanVO plan;
	
	@Action(value = "updatePlanSchedule", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updatePlanSchedule() throws FLException {

		planService.updatePlanSchedule(plan);
		
		return SUCCESS;
	}

	
	public PlanVO getPlan() {
		return plan;
	}

	public void setPlan(PlanVO plan) {
		this.plan = plan;
	}

}
