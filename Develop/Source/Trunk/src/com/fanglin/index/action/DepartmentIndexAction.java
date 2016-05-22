/**
 * @File Name		: DepartmentIndexAction.java
 * @Package   	: com.fanglin.common.action
 * @Version		: 1.0
 * @Date			: 2015-5-7
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.index.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;

@ParentPackage("base")
@Namespace("/")
@Controller
public class DepartmentIndexAction extends BaseListAction {

	private static final long serialVersionUID = 573553938962862083L;
	
	@Action(value = "designRegionIndex", results = { @Result(name = "success", type = "dispatcher", location = "/views/department/designRegion.html") })
	public String designRegionIndex(){
		return SUCCESS;
	}
	
	@Action(value = "businessRegionIndex", results = { @Result(name = "success", type = "dispatcher", location = "/views/department/businessRegion.html") })
	public String businessRegionIndex(){
		return SUCCESS;
	}
	
	@Action(value = "designDeptIndex", results = { @Result(name = "success", type = "dispatcher", location = "/views/department/designDept.html") })
	public String designDeptIndex(){
		return SUCCESS;
	}
	
	@Action(value = "businessDeptIndex", results = { @Result(name = "success", type = "dispatcher", location = "/views/department/businessDept.html") })
	public String businessDeptIndex(){
		return SUCCESS;
	}
	
	@Action(value = "materialDeptIndex", results = { @Result(name = "success", type = "dispatcher", location = "/views/department/materialDept.html") })
	public String materialDeptIndex(){
		return SUCCESS;
	}
	
	@Action(value = "engineeringDeptIndex", results = { @Result(name = "success", type = "dispatcher", location = "/views/department/engineeringDept.html") })
	public String engineeringDeptIndex(){
		return SUCCESS;
	}
	
	@Action(value = "dutyDeptIndex", results = { @Result(name = "success", type = "dispatcher", location = "/views/department/dutyDept.html") })
	public String dutyDeptIndex(){
		return SUCCESS;
	}

}
