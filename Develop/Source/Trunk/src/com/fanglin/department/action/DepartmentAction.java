/**
 * Title: DepartmentAction
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: BTY
 * @author bty1987
 *
 */

package com.fanglin.department.action;

import java.util.ArrayList;
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
	
	@Action(value = "pageDepartment", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageDepartment() throws FLException{
		
		departmentService.pageDepartment(getPaging(), getFilters(), dept, queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value = "queryDepartment", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDepartment() throws FLException{
		
		deptList = departmentService.queryDepartment(dept.getType(), queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value = "queryDepartmentById", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDepartmentById(){
		
		dept = departmentService.queryDepartmentById(dept.getDeptId());
		
		return SUCCESS;
	}
	
	@Action(value = "queryDepartmentByName", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDepartmentByName() throws FLException{
		
		deptList = departmentService.queryDepartmentByName(dept, queryCompany());
		
		return SUCCESS;
	}
	
	public DepartmentVO getDept() {
		return dept;
	}

	public void setDept(DepartmentVO dept) {
		this.dept = dept;
	}

	public List<DepartmentVO> getDeptList(){
		if(deptList == null){
			deptList = new ArrayList<DepartmentVO>();
		}
		return deptList;
	}

	public void setDeptList(List<DepartmentVO> deptList){
		this.deptList = deptList;
	}

	public List<String> getDeptIds(){
		return deptIds;
	}

	public void setDeptIds(List<String> deptIds){
		this.deptIds = deptIds;
	}
}
