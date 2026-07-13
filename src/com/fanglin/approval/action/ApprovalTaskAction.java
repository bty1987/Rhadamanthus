/**
 * @File Name		: ApprovalTaskAction.java
 * @Package   		: com.fanglin.approval.action
 * @Version			: 1.0
 * @Description		: 审批任务操作控制器。暴露流程引擎的审批/驳回/转交/轨迹查询能力。
 * 					  与现有 ApprovalAction(approve/refuse 单 receiver 模式)并存,
 * 					  走新引擎的审批单用本 Action。
 */

package com.fanglin.approval.action;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.alibaba.fastjson.JSONObject;

import com.fanglin.approval.service.ApprovalFlowEngineService;
import com.fanglin.approval.vo.ApprovalTaskVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ApprovalTaskAction extends BaseListAction {

	private static final long serialVersionUID = 1L;

	@Autowired
	private ApprovalFlowEngineService approvalFlowEngineService;

	private ApprovalTaskVO task;

	private List<ApprovalTaskVO> tasks;

	private long taskId;

	private String transferTo;

	private String comment;

	private String code;

	private String forms;

	private long aid;

	@Action(value = "startGeneralApproval", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String startGeneralApproval() throws FLException {

		Map<String, String> formData = new HashMap<String, String>();

		if (forms != null && !forms.isEmpty()) {
			JSONObject jsonObj = JSONObject.parseObject(forms);
			for (Map.Entry<String, Object> entry : jsonObj.entrySet()) {
				formData.put(entry.getKey(), entry.getValue() == null ? "" : entry.getValue().toString());
			}
		}

		aid = approvalFlowEngineService.startGeneralFlow(code, queryUserId(), queryCompany(), formData);

		return SUCCESS;
	}

	@Action(value = "agreeApprovalTask", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String agreeApprovalTask() throws FLException {

		approvalFlowEngineService.agreeTask(taskId, queryUserId(), comment);

		return SUCCESS;
	}

	@Action(value = "refuseApprovalTask", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String refuseApprovalTask() throws FLException {

		approvalFlowEngineService.refuseTask(taskId, queryUserId(), comment);

		return SUCCESS;
	}

	@Action(value = "transferApprovalTask", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String transferApprovalTask() throws FLException {

		approvalFlowEngineService.transferTask(taskId, queryUserId(), transferTo, comment);

		return SUCCESS;
	}

	@Action(value = "queryApprovalTaskTrace", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryApprovalTaskTrace() throws FLException {

		long aid = task == null ? 0 : (task.getAid() == null ? 0 : task.getAid().longValue());

		tasks = approvalFlowEngineService.queryTaskTrace(aid);

		return SUCCESS;
	}

	@Action(value = "queryApprovalTodoTask", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryApprovalTodoTask() throws FLException {

		tasks = approvalFlowEngineService.queryTodoTasks(queryUserId());

		return SUCCESS;
	}

	public ApprovalTaskVO getTask() {
		return task;
	}

	public void setTask(ApprovalTaskVO task) {
		this.task = task;
	}

	public List<ApprovalTaskVO> getTasks() {
		return tasks;
	}

	public void setTasks(List<ApprovalTaskVO> tasks) {
		this.tasks = tasks;
	}

	public long getTaskId() {
		return taskId;
	}

	public void setTaskId(long taskId) {
		this.taskId = taskId;
	}

	public String getTransferTo() {
		return transferTo;
	}

	public void setTransferTo(String transferTo) {
		this.transferTo = transferTo;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getForms() {
		return forms;
	}

	public void setForms(String forms) {
		this.forms = forms;
	}

	public long getAid() {
		return aid;
	}

	public void setAid(long aid) {
		this.aid = aid;
	}

}
