package com.fanglin.construction.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.construction.service.MaterialPlanService;
import com.fanglin.construction.vo.MaterialPlanVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class MaterialPlanAction extends BaseListAction {

	private static final long serialVersionUID = -4216759309221783542L;

	@Autowired
	private MaterialPlanService materialPlanService;

	private MaterialPlanVO materialPlan;

	private List<MaterialPlanVO> materialPlans;

	@Action(value = "queryMaterialPlanByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryMaterialPlanByOrderId() throws FLException {

		materialPlans = materialPlanService.queryMaterialPlanByOrderId(materialPlan);

		return SUCCESS;
	}

	@Action(value = "makeMaterialPlan", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String makeMaterialPlan() throws FLException {

		materialPlanService.makeMaterialPlan(materialPlan);

		return SUCCESS;
	}

	@Action(value = "addMaterialPlan", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addMaterialPlan() throws FLException {

		materialPlanService.addMaterialPlan(materialPlan, queryUserId());

		return SUCCESS;
	}

	@Action(value = "updateMaterialPlan", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateMaterialPlan() throws FLException {

		materialPlanService.updateMaterialPlan(materialPlan);

		return SUCCESS;
	}

	@Action(value = "confirmMaterialPlan", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String confirmMaterialPlan() throws FLException {

		materialPlanService.confirmMaterialPlan(materialPlan, queryUserId());

		return SUCCESS;
	}

	@Action(value = "cancelMaterialPlan", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String cancelMaterialPlan() throws FLException {

		materialPlanService.cancelMaterialPlan(materialPlan, queryUserId());

		return SUCCESS;
	}

	@Action(value = "deleteMaterialPlan", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteMaterialPlan() throws FLException {

		materialPlanService.deleteMaterialPlan(materialPlan);

		return SUCCESS;
	}

	public MaterialPlanVO getMaterialPlan() {
		return materialPlan;
	}

	public void setMaterialPlan(MaterialPlanVO materialPlan) {
		this.materialPlan = materialPlan;
	}

	public List<MaterialPlanVO> getMaterialPlans() {
		return materialPlans;
	}

	public void setMaterialPlans(List<MaterialPlanVO> materialPlans) {
		this.materialPlans = materialPlans;
	}

}
