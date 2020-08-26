package com.fanglin.data.common.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.data.common.service.TaskParamService;
import com.fanglin.data.common.vo.TaskParamVO;
import com.fanglin.data.common.vo.TaskVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class TaskParamAction extends BaseListAction {

	private static final long serialVersionUID = 7925148823839714105L;
	
	@Autowired
	private TaskParamService taskParamDaoService;
	
	private List<TaskParamVO> taskParams;
	
	private TaskVO task;
	
	private TaskParamVO taskParam;
	
	@Action(value = "queryTaskParam", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryTaskParam() {

		taskParams = taskParamDaoService.queryTaskParam(task);
		
		return SUCCESS;
	}
	
	@Action(value = "addTaskParam", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addTaskParam() {

		taskParamDaoService.addTaskParam(taskParam);
		
		return SUCCESS;
	}
	
	@Action(value = "updateTaskParam", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateTaskParam() {

		taskParamDaoService.updateTaskParam(taskParam);
		
		return SUCCESS;
	}
	
	@Action(value = "updateTaskParamForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateTaskParamForStatus() {

		taskParamDaoService.updateTaskParamForStatus(taskParam);
		
		return SUCCESS;
	}
	
	@Action(value = "deleteTaskParam", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteTaskParam() {

		taskParamDaoService.deleteTaskParam(taskParam);
		
		return SUCCESS;
	}
	

	public TaskParamService getTaskParamDaoService() {
		return taskParamDaoService;
	}

	public void setTaskParamDaoService(TaskParamService taskParamDaoService) {
		this.taskParamDaoService = taskParamDaoService;
	}

	public List<TaskParamVO> getTaskParams() {
		return taskParams;
	}

	public void setTaskParams(List<TaskParamVO> taskParams) {
		this.taskParams = taskParams;
	}

	public TaskParamVO getTaskParam() {
		return taskParam;
	}

	public void setTaskParam(TaskParamVO taskParam) {
		this.taskParam = taskParam;
	}

	public TaskVO getTask() {
		return task;
	}

	public void setTask(TaskVO task) {
		this.task = task;
	}
	
	
	
}
