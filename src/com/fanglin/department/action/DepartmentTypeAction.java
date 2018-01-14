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
import com.fanglin.department.service.DepartmentTypeService;
import com.fanglin.department.vo.DepartmentTypeVO;


@ParentPackage("base")
@Namespace("/")
@Controller
public class DepartmentTypeAction extends BaseListAction{
	
	private static final long serialVersionUID = -7594259855354916272L;

	private List<DepartmentTypeVO> departmentTypes ;
	
	private DepartmentTypeVO departmentType;
	

	@Autowired
	private DepartmentTypeService departmentService;
	
	@Action(value = "pageDepartmentType", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageDepartmentType() throws FLException{
				
		departmentService.pageDepartmentType(getPaging(), getFilters());
		
		return SUCCESS;
	}
	
	@Action(value = "queryDepartmentType", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDepartmentType() throws FLException{
				
		departmentTypes=departmentService.queryDepartmentType();
		
		return SUCCESS;
	}
	
	public List<DepartmentTypeVO> getDepartmentTypes() {
		return departmentTypes;
	}

	public void setDepartmentTypes(List<DepartmentTypeVO> departmentTypes) {
		this.departmentTypes = departmentTypes;
	}

	public DepartmentTypeVO getDepartmentType() {
		return departmentType;
	}

	public void setDepartmentType(DepartmentTypeVO departmentType) {
		this.departmentType = departmentType;
	}

}
