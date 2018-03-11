/**
 * Title: DepartmentAction
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: BTY
 * @author bty1987
 *
 */

package com.fanglin.department.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.department.service.DepartmentService;
import com.fanglin.department.vo.DepartmentVO;
import com.fanglin.department.vo.DepartmentTypeVO;
import com.fanglin.utils.SystemConfig;

@ParentPackage("base")
@Namespace("/")
@Controller
public class DepartmentAction extends BaseListAction {

	private static final long serialVersionUID = -4862931541577735296L;

	@Autowired
	private DepartmentService departmentService;

	private DepartmentVO dept;
	
	private List<DepartmentVO> deptList;
	
	private List<String> deptIds;
	
	private List<String> deptType;
	
	private List<DepartmentTypeVO> depttypelist;

	@Action(value = "pageDepartment", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageDepartment() throws FLException{
		
		departmentService.pageDepartment(getPaging(), getFilters(), dept, queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value = "queryDepartment", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDepartment() throws FLException{
	
		deptList = departmentService.queryDepartment(dept, queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value = "queryDepartmentById", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDepartmentById() throws FLException{
		
		dept = departmentService.queryDepartmentById(dept.getDeptId());
		
		return SUCCESS;
	}
	
	@Action(value = "queryDepartmentByName", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDepartmentByName() throws FLException{
		
		deptList = departmentService.queryDepartmentByName(dept, queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value = "queryDepartmentByDtid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDepartmentByDtid() throws FLException{
				
		deptList=departmentService.queryDepartmentByDtid(dept,queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value = "updateDepartment", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateDepartment() throws FLException{
		
		if(SystemConfig.getString("communion") == null){
		    throw new FLException(-1, "无操作权限");
		}		
		
		departmentService.updateDepartment(dept);
		
		return SUCCESS;
	}
	
	@Action(value = "addDepartment", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addDepartment() throws FLException{
		
		if(SystemConfig.getString("communion") == null){
		    throw new FLException(-1, "无操作权限");
		}
		
		departmentService.addDepartment(dept, queryUserId(), queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value = "deleteDepartment", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteDepartment() throws FLException{
		
		if(SystemConfig.getString("communion") == null){
		    throw new FLException(-1, "无操作权限");
		}		
		
		departmentService.deleteDepartment(dept);
		
		return SUCCESS;
	}
	
	public DepartmentVO getDept() {
		return dept;
	}

	public void setDept(DepartmentVO dept) {
		this.dept = dept;
	}

	public List<DepartmentVO> getDeptList() {
		return deptList;
	}

	public void setDeptList(List<DepartmentVO> deptList) {
		this.deptList = deptList;
	}

	public List<String> getDeptIds() {
		return deptIds;
	}

	public void setDeptIds(List<String> deptIds) {
		this.deptIds = deptIds;
	}

	public List<String> getDeptType() {
		return deptType;
	}

	public void setDeptType(List<String> deptType) {
		this.deptType = deptType;
	}

	public List<DepartmentTypeVO> getDepttypelist() {
		return depttypelist;
	}

	public void setDepttypelist(List<DepartmentTypeVO> depttypelist) {
		this.depttypelist = depttypelist;
	}
	
}
