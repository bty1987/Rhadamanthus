/**
 * @File Name		: DDAction.java
 * @Package   	: com.fanglin.dingding.action
 * @Version		: 1.0
 * @Date			: 2015-11-9
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.dingding.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.dingding.po.Department;
import com.fanglin.dingding.po.User;
import com.fanglin.dingding.service.DepartmentService;
import com.fanglin.dingding.service.UserService;
import com.fanglin.dingding.utils.AuthHelper;

@ParentPackage("dingding")
@Namespace("/")
@Controller
public class DDAction extends BaseListAction {
	
	private static final long serialVersionUID = -6593413211279089778L;

	private String configInfo;
	
	private String url;
	
	private User user;
	
	private String userInfo;
	
	private String code;
	
	private List<Department> departments;
	
	private Department department;
	
	@Action(value = "requestDDConfig", results = { @Result(name = "success", type = "json", params={"ignoreHierarchy","false"}) }, params = {"contentType", "text/html" })
	public String requestDDConfig(){
		
		configInfo = AuthHelper.getConfig(url, null);
		
		return SUCCESS;
	}
	
	@Action(value = "queryDDUserInfo", results = { @Result(name = "success", type = "json", params={"ignoreHierarchy","false"}) }, params = {"contentType", "text/html" })
	public String queryUserInfo(){
		
		user = UserService.getUserInfo(code);
		
		return SUCCESS;
	}
	
	@Action(value = "queryDDUser", results = { @Result(name = "success", type = "json", params={"ignoreHierarchy","false"}) }, params = {"contentType", "text/html" })
	public String queryUser(){
		
		user = UserService.getUser(user.getUserid());
		
		return SUCCESS;
	}
	
	@Action(value = "queryDDDepartment", results = { @Result(name = "success", type = "json", params={"ignoreHierarchy","false"}) }, params = {"contentType", "text/html" })
	public String queryDDDepartment(){
		
		departments = DepartmentService.queryDepartment(department);
		
		return SUCCESS;
	}
	
	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String getConfigInfo() {
		return configInfo;
	}

	public void setConfigInfo(String configInfo) {
		this.configInfo = configInfo;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public String getUserInfo() {
		return userInfo;
	}

	public void setUserInfo(String userInfo) {
		this.userInfo = userInfo;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public List<Department> getDepartments() {
		return departments;
	}

	public void setDepartments(List<Department> departments) {
		this.departments = departments;
	}

	public Department getDepartment() {
		return department;
	}

	public void setDepartment(Department department) {
		this.department = department;
	}

}
