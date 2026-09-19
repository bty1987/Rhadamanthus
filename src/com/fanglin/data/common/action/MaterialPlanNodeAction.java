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
import com.fanglin.data.common.service.MaterialPlanNodeService;
import com.fanglin.data.common.vo.MaterialPlanNodeVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class MaterialPlanNodeAction extends BaseListAction {

	private static final long serialVersionUID = 7816542930217456602L;

	@Autowired
	private MaterialPlanNodeService materialPlanNodeService;

	private MaterialPlanNodeVO materialPlanNode;

	private List<MaterialPlanNodeVO> materialPlanNodes;

	@Action(value = "pageMaterialPlanNode", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageMaterialPlanNode() throws FLException {

		materialPlanNodeService.pageMaterialPlanNode(getPaging(), getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryMaterialPlanNode", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryMaterialPlanNode() throws FLException {

		materialPlanNodes = materialPlanNodeService.queryMaterialPlanNode(queryCompany());

		return SUCCESS;
	}

	@Action(value = "addMaterialPlanNode", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addMaterialPlanNode() throws FLException {

		materialPlanNodeService.addMaterialPlanNode(materialPlanNode, queryCompany(), queryUserId());

		return SUCCESS;
	}

	@Action(value = "updateMaterialPlanNode", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateMaterialPlanNode() throws FLException {

		materialPlanNodeService.updateMaterialPlanNode(materialPlanNode, queryCompany());

		return SUCCESS;
	}

	@Action(value = "updateMaterialPlanNodeForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateMaterialPlanNodeForStatus() throws FLException {

		materialPlanNodeService.updateMaterialPlanNodeForStatus(materialPlanNode);

		return SUCCESS;
	}

	public MaterialPlanNodeVO getMaterialPlanNode() {
		return materialPlanNode;
	}

	public void setMaterialPlanNode(MaterialPlanNodeVO materialPlanNode) {
		this.materialPlanNode = materialPlanNode;
	}

	public List<MaterialPlanNodeVO> getMaterialPlanNodes() {
		return materialPlanNodes;
	}

	public void setMaterialPlanNodes(List<MaterialPlanNodeVO> materialPlanNodes) {
		this.materialPlanNodes = materialPlanNodes;
	}

}
