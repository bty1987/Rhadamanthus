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
import com.fanglin.data.common.service.ConstructionPeriodNodeService;
import com.fanglin.data.common.vo.ConstructionPeriodNodeVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ConstructionPeriodNodeAction extends BaseListAction {

	private static final long serialVersionUID = 8003189076507457679L;

	@Autowired
	private ConstructionPeriodNodeService constructionPeriodNodeService;

	private List<ConstructionPeriodNodeVO> constructionPeriodNodes;

	private ConstructionPeriodNodeVO constructionPeriodNode;

	@Action(value = "queryConstructionPeriodNodeByCpid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryConstructionPeriodNodeByCpid() throws FLException {

		constructionPeriodNodes = constructionPeriodNodeService.queryConstructionPeriodNodeByCpid(constructionPeriodNode);

		return SUCCESS;
	}

	@Action(value = "addConstructionPeriodNode", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addConstructionPeriodNode() throws FLException {

		constructionPeriodNodeService.addConstructionPeriodNode(constructionPeriodNode);

		return SUCCESS;
	}

	@Action(value = "deleteConstructionPeriodNodeByCpnid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addConstructionPeriod() throws FLException {

		constructionPeriodNodeService.deleteConstructionPeriodNodeByCpnid(constructionPeriodNode);

		return SUCCESS;
	}

	public List<ConstructionPeriodNodeVO> getConstructionPeriodNodes() {
		return constructionPeriodNodes;
	}

	public void setConstructionPeriodNodes(List<ConstructionPeriodNodeVO> constructionPeriodNodes) {
		this.constructionPeriodNodes = constructionPeriodNodes;
	}

	public ConstructionPeriodNodeVO getConstructionPeriodNode() {
		return constructionPeriodNode;
	}

	public void setConstructionPeriodNode(ConstructionPeriodNodeVO constructionPeriodNode) {
		this.constructionPeriodNode = constructionPeriodNode;
	}

}
