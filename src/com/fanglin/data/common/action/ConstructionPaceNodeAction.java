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
import com.fanglin.data.common.service.ConstructionPaceNodeService;
import com.fanglin.data.common.vo.ConstructionPaceNodeVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ConstructionPaceNodeAction extends BaseListAction {

	private static final long serialVersionUID = 9131310035331362798L;

	@Autowired
	private ConstructionPaceNodeService constructionPaceNodeService;

	private List<ConstructionPaceNodeVO> constructionPaceNodes;

	private ConstructionPaceNodeVO constructionPaceNode;

	@Action(value = "pageConstructionPaceNode", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageConstructionPaceNode() throws FLException {

		constructionPaceNodeService.pageConstructionPaceNode(getPaging(), getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryConstructionPaceNode", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryConstructionPaceNode() throws FLException {

		constructionPaceNodes = constructionPaceNodeService.queryConstructionPaceNode(constructionPaceNode);

		return SUCCESS;
	}

	@Action(value = "addConstructionPaceNode", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addConstructionPaceNode() throws FLException {

		constructionPaceNodeService.addConstructionPaceNode(constructionPaceNode, queryCompany());

		return SUCCESS;
	}

	@Action(value = "updateConstructionPaceNode", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateConstructionPaceNode() throws FLException {

		constructionPaceNodeService.updateConstructionPaceNode(constructionPaceNode);

		return SUCCESS;
	}

	@Action(value = "updateConstructionPaceNodeForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateConstructionPaceNodeForStatus() throws FLException {

		constructionPaceNodeService.updateConstructionPaceNodeForStatus(constructionPaceNode);

		return SUCCESS;
	}

	public List<ConstructionPaceNodeVO> getConstructionPaceNodes() {
		return constructionPaceNodes;
	}

	public void setConstructionPaceNodes(List<ConstructionPaceNodeVO> constructionPaceNodes) {
		this.constructionPaceNodes = constructionPaceNodes;
	}

	public ConstructionPaceNodeVO getConstructionPaceNode() {
		return constructionPaceNode;
	}

	public void setConstructionPaceNode(ConstructionPaceNodeVO constructionPaceNode) {
		this.constructionPaceNode = constructionPaceNode;
	}

}
