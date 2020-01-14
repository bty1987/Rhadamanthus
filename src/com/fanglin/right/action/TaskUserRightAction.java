package com.fanglin.right.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.common.vo.TaskVO;

import com.fanglin.personel.vo.UserVO;
import com.fanglin.right.service.TaskUserRightService;

@ParentPackage("base")
@Namespace("/")
@Controller
public class TaskUserRightAction extends BaseListAction {

	private static final long serialVersionUID = -9179677081761019112L;
	
	@Autowired
	private TaskUserRightService taskUserRightService;
	
	private List<TaskVO> tasks;
	
	private UserVO user;
	
	@Action(value="queryTaskUserRightByUserId", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryTaskUserRightByUserId() throws FLException{
		
		tasks = taskUserRightService.queryTaskUserRightByUserId(user, queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value="updateTaskUserRight", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String updateTaskUserRight() throws FLException{
		
		taskUserRightService.updateTaskUserRight(tasks, user, queryCompany());
		
		return SUCCESS;
	}

	public List<TaskVO> getTasks() {
		return tasks;
	}

	public void setTasks(List<TaskVO> tasks) {
		this.tasks = tasks;
	}

	public UserVO getUser() {
		return user;
	}

	public void setUser(UserVO user) {
		this.user = user;
	}
	
}
