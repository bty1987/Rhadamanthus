package com.fanglin.communion.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.communion.service.ConstructionNodeService;
import com.fanglin.communion.vo.ConstructionNodeVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.utils.SystemConfig;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ConstructionNodeAction extends BaseListAction {

	private static final long serialVersionUID = 369283426907698981L;

	@Autowired
	private ConstructionNodeService constructionNodeService;

	private ConstructionNodeVO constructionNode;

	private List<ConstructionNodeVO> constructionNodes;

	private String orderId;

	@Action(value = "pageConstructionNode", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageConstructionNode() throws FLException {

		constructionNodeService.pageConstructionNode(getPaging(), getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryConstructionNode", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryConstructionNode() throws FLException {

		constructionNodes = constructionNodeService.queryConstructionNode(queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryConstructionNodeByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryConstructionNodeByOrderId() throws FLException {

		constructionNodes = constructionNodeService.queryConstructionNodeByOrderId(orderId);

		return SUCCESS;
	}

	@Action(value = "addConstructionNode", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addConstructionNode() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		constructionNodeService.addConstructionNode(constructionNode);

		return SUCCESS;
	}

	@Action(value = "updateConstructionNodeForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateConstructionNodeForStatus() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		constructionNodeService.updateConstructionNodeForStatus(constructionNode);

		return SUCCESS;
	}

	public ConstructionNodeService getConstructionNodeService() {
		return constructionNodeService;
	}

	public void setConstructionNodeService(ConstructionNodeService constructionNodeService) {
		this.constructionNodeService = constructionNodeService;
	}

	public ConstructionNodeVO getConstructionNode() {
		return constructionNode;
	}

	public void setConstructionNode(ConstructionNodeVO constructionNode) {
		this.constructionNode = constructionNode;
	}

	public List<ConstructionNodeVO> getConstructionNodes() {
		return constructionNodes;
	}

	public void setConstructionNodes(List<ConstructionNodeVO> constructionNodes) {
		this.constructionNodes = constructionNodes;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

}
