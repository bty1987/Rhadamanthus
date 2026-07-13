/**
 * @File Name		: ApprovalFlowAction.java
 * @Package   		: com.fanglin.approval.action
 * @Version			: 1.0
 * @Description		: 审批流程定义管理控制器。提供流程+节点的增删改查接口,供后台配置页面使用。
 * 					  仿照现有 ProcessAction 的命名与结构。
 */

package com.fanglin.approval.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.approval.service.ApprovalFlowService;
import com.fanglin.approval.vo.ApprovalFlowNodeVO;
import com.fanglin.approval.vo.ApprovalFlowVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ApprovalFlowAction extends BaseListAction {

	private static final long serialVersionUID = 1L;

	@Autowired
	private ApprovalFlowService approvalFlowService;

	private ApprovalFlowVO flow;

	private List<ApprovalFlowVO> flows;

	private List<ApprovalFlowNodeVO> flowNodes;

	@Action(value = "pageApprovalFlow", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageApprovalFlow() throws FLException {

		approvalFlowService.pageApprovalFlow(getPaging(), getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryApprovalFlow", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryApprovalFlow() throws FLException {

		flows = approvalFlowService.queryApprovalFlow(queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryApprovalFlowByFlowId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryApprovalFlowByFlowId() throws FLException {

		flow = approvalFlowService.queryApprovalFlowByFlowId(flow);

		return SUCCESS;
	}

	@Action(value = "queryApprovalFlowNode", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryApprovalFlowNode() {

		flowNodes = approvalFlowService.queryApprovalFlowNode(flow);

		return SUCCESS;
	}

	@Action(value = "addApprovalFlow", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addApprovalFlow() throws FLException {

		approvalFlowService.addApprovalFlow(flow, flowNodes, queryCompany());

		return SUCCESS;
	}

	@Action(value = "updateApprovalFlow", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateApprovalFlow() throws FLException {

		approvalFlowService.updateApprovalFlow(flow, flowNodes);

		return SUCCESS;
	}

	@Action(value = "updateApprovalFlowForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateApprovalFlowForStatus() throws FLException {

		approvalFlowService.updateApprovalFlowForStatus(flow);

		return SUCCESS;
	}

	@Action(value = "deleteApprovalFlow", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteApprovalFlow() throws FLException {

		approvalFlowService.deleteApprovalFlow(flow);

		return SUCCESS;
	}

	public ApprovalFlowVO getFlow() {
		return flow;
	}

	public void setFlow(ApprovalFlowVO flow) {
		this.flow = flow;
	}

	public List<ApprovalFlowVO> getFlows() {
		return flows;
	}

	public void setFlows(List<ApprovalFlowVO> flows) {
		this.flows = flows;
	}

	public List<ApprovalFlowNodeVO> getFlowNodes() {
		return flowNodes;
	}

	public void setFlowNodes(List<ApprovalFlowNodeVO> flowNodes) {
		this.flowNodes = flowNodes;
	}

}
