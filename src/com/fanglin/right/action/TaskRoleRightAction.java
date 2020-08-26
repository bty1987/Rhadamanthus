package com.fanglin.right.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.right.service.TaskRoleRightService;
import com.fanglin.right.vo.TaskRoleRightVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class TaskRoleRightAction extends BaseListAction {

	private static final long serialVersionUID = -2570111859695049956L;

	@Autowired
	private TaskRoleRightService taskRoleRightService;

	private List<TaskRoleRightVO> taskRoleRights;

	private TaskRoleRightVO taskRoleRight;

	private List<Long> tids;

	@Action(value = "queryTaskRoleRightByUserId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryTaskRoleRightByUserId() {

		taskRoleRights = taskRoleRightService.queryTaskRoleRightByUserId(taskRoleRight);

		return SUCCESS;
	}

	@Action(value = "updateTaskRoleRight", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateTaskRoleRight() {

		taskRoleRightService.updateTaskRoleRight(taskRoleRight, tids);

		return SUCCESS;
	}

	public TaskRoleRightService getTaskRoleRightService() {
		return taskRoleRightService;
	}

	public void setTaskRoleRightService(TaskRoleRightService taskRoleRightService) {
		this.taskRoleRightService = taskRoleRightService;
	}

	public List<TaskRoleRightVO> getTaskRoleRights() {
		return taskRoleRights;
	}

	public void setTaskRoleRights(List<TaskRoleRightVO> taskRoleRights) {
		this.taskRoleRights = taskRoleRights;
	}

	public TaskRoleRightVO getTaskRoleRight() {
		return taskRoleRight;
	}

	public void setTaskRoleRight(TaskRoleRightVO taskRoleRight) {
		this.taskRoleRight = taskRoleRight;
	}

	public List<Long> getTids() {
		return tids;
	}

	public void setTids(List<Long> tids) {
		this.tids = tids;
	}

}
