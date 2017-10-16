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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.dingding.po.Department;
import com.fanglin.dingding.po.User;
import com.fanglin.dingding.service.DepartmentService;
import com.fanglin.dingding.service.UserService;

@ParentPackage("base")
@Namespace("/")
@Controller
public class DDAction extends BaseListAction {
	
	private static final long serialVersionUID = -6593413211279089778L;	
	
	@Autowired
    private DepartmentService departmentDDService; 
    
	@Autowired
    private UserService userDDService;
    
	private User user;
	
	private String code;
	
	private List<Long> dids;
	
	private List<Department> departments;
	
	private Department department;
     
	private int errcode;
	
	@Action(value = "queryDDUser", results = { @Result(name = "success", type = "json", params={"ignoreHierarchy","false"}) }, params = {"contentType", "text/html" })
	public String queryUser() throws FLException{
		
		user = userDDService.getUser(user.getUserid(),queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value = "queryDDDepartment", results = { @Result(name = "success", type = "json", params={"ignoreHierarchy","false"}) }, params = {"contentType", "text/html" })
	public String queryDDDepartment() throws FLException{
		
		departments = departmentDDService.queryDepartment(queryCompany());
		
	  	return SUCCESS;
	}

	@Action(value = "addDDUser", results = { @Result(name = "success", type = "json", params={"ignoreHierarchy","false"}) }, params = {"contentType", "text/html" })
	public String addUser2() throws FLException{
		
		 errcode =userDDService.addDDUser(user,dids,queryCompany());
		
		 return SUCCESS;
	}
	
	@Action(value = "updateDDUser", results = { @Result(name = "success", type = "json", params={"ignoreHierarchy","false"}) }, params = {"contentType", "text/html" })
	public String updateUser() throws FLException{
		
		 errcode = userDDService.updateDDUser(user,dids,queryCompany());
		
		 return SUCCESS;
	}
	
	@Action(value = "deleteDDUser", results = { @Result(name = "success", type = "json", params={"ignoreHierarchy","false"}) }, params = {"contentType", "text/html" })
	public String deleteDDUser()throws FLException{
		
		 errcode= userDDService.deleteDDUser(user,queryCompany());
		
		return SUCCESS;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public List<Long> getDids() {
		return dids;
	}

	public void setDids(List<Long> dids) {
		this.dids = dids;
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

	public int getErrcode() {
		return errcode;
	}

	public void setErrcode(int errcode) {
		this.errcode = errcode;
	}
	
}
