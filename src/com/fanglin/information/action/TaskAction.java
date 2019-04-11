package com.fanglin.information.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.information.service.TaskService;
import com.fanglin.information.vo.TaskVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class TaskAction extends BaseListAction {

	private static final long serialVersionUID = 3246937855994579649L;

	@Autowired
	private TaskService taskService;

	private TaskVO task;

	private List<TaskVO> tasks;

	@Action(value = "pageTask", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageTask() {

		taskService.pageTask(getPaging(), getFilters());

		return SUCCESS;
	}

	@Action(value = "queryTask", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryTask() {

		tasks = taskService.queryTask();

		return SUCCESS;
	}

	@Action(value = "addTask", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addTask() throws FLException {

		taskService.addTask(task);

		return SUCCESS;
	}

	@Action(value = "updateTaskForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateTeakForStatus() throws FLException {

		taskService.updateTaskForStatus(task);

		return SUCCESS;
	}
	
	@Action(value = "updateTaskForIsShow", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateTaskForIsShow() throws FLException {

		taskService.updateTaskForIsShow(task);

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

}
