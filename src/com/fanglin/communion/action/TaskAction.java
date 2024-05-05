package com.fanglin.communion.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.communion.service.TaskService;
import com.fanglin.communion.vo.TaskVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.system.vo.RoleVO;
import com.fanglin.utils.SystemConfig;

@ParentPackage("base")
@Namespace("/")
@Controller
public class TaskAction extends BaseListAction {

	private static final long serialVersionUID = 4207577544187044863L;

	@Autowired
	private TaskService taskService;

	private TaskVO task;

	private List<TaskVO> tasks;

	private RoleVO role;

	private List<Long> tids;

	@Action(value = "pageTask", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageTask() {

		taskService.pageTask(getPaging(), getFilters());

		return SUCCESS;
	}

	@Action(value = "queryTask", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryTask() {

		tasks = taskService.queryTask(task);

		return SUCCESS;
	}

	@Action(value = "queryTaskByRid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryTaskByRid() {

		tasks = taskService.queryTaskByRid(role);

		return SUCCESS;
	}

	@Action(value = "queryTaskForSelf", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryTaskForSelf() throws FLException {

		tasks = taskService.queryTaskForSelf(queryUserId());

		return SUCCESS;
	}

	@Action(value = "addTask", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addTask() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		taskService.addTask(task);

		return SUCCESS;
	}

	@Action(value = "updateTask", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateTask() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		taskService.updateTask(task);

		return SUCCESS;
	}

	@Action(value = "updateTaskForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateTeakForStatus() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		taskService.updateTaskForStatus(task);

		return SUCCESS;
	}

	@Action(value = "updateTaskForIsShow", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateTaskForIsShow() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		taskService.updateTaskForIsShow(task);

		return SUCCESS;
	}

	@Action(value = "updateRoleTask", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) })
	public String updateRoleTask() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		taskService.updateRoleTask(role, task, queryUserId());

		return SUCCESS;
	}

	@Action(value = "deleteRoleTask", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) })
	public String deleteRoleTask() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		taskService.deleteRoleTask(role, task);

		return SUCCESS;
	}

	public TaskVO getTask() {
		return task;
	}

	public void setTask(TaskVO task) {
		this.task = task;
	}

	public List<TaskVO> getTasks() {
		return tasks;
	}

	public void setTasks(List<TaskVO> tasks) {
		this.tasks = tasks;
	}

	public RoleVO getRole() {
		return role;
	}

	public void setRole(RoleVO role) {
		this.role = role;
	}

	public List<Long> getTids() {
		return tids;
	}

	public void setTids(List<Long> tids) {
		this.tids = tids;
	}

}
