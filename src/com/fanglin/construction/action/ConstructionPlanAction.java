/**
 * @File Name	: AcceptanceAction.java
 * @Package   	: com.fanglin.action.constructionSchedule
 * @Version		: 1.0
 * @Date		: 2014-9-26
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email		: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.construction.service.ConstructionPlanService;
import com.fanglin.construction.vo.ConstructionPlanVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ConstructionPlanAction extends BaseListAction {

	private static final long serialVersionUID = -6171519762778197286L;

	@Autowired
	private ConstructionPlanService constructionPlanService;

	private ConstructionPlanVO constructionPlan;

	private List<ConstructionPlanVO> constructionPlans;

	@Action(value = "queryConstructionPlanByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryConstructionPlanByOrderId() throws FLException {

		constructionPlans = constructionPlanService.queryConstructionPlanByOrderId(constructionPlan);

		return SUCCESS;
	}

	@Action(value = "addConstructionPlan", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addConstructionPlan() throws FLException {

		constructionPlanService.addConstructionPlan(constructionPlan);

		return SUCCESS;
	}

	@Action(value = "deleteConstructionPlan", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteConstructionPlan() throws FLException {

		constructionPlanService.deleteConstructionPlan(constructionPlan);

		return SUCCESS;
	}

	public ConstructionPlanVO getConstructionPlan() {
		return constructionPlan;
	}

	public void setConstructionPlan(ConstructionPlanVO constructionPlan) {
		this.constructionPlan = constructionPlan;
	}

	public List<ConstructionPlanVO> getConstructionPlans() {
		return constructionPlans;
	}

	public void setConstructionPlans(List<ConstructionPlanVO> constructionPlans) {
		this.constructionPlans = constructionPlans;
	}

}