/**
 * @File Name		: DingTalkDepartmentAction.java
 * @Package   	: com.fanglin.dingding.action
 * @Version		: 1.0
 * @Date			: 2015-11-9
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 钉钉部门管理 Action
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
import com.fanglin.dingding.bean.Department;
import com.fanglin.dingding.service.DingTalkDepartmentService;

@ParentPackage("base")
@Namespace("/")
@Controller
public class DingTalkDepartmentAction extends BaseListAction {

	private static final long serialVersionUID = -6593413211279089779L;

	@Autowired
	private DingTalkDepartmentService dingTalkDepartmentService;

	private List<Department> departments;

	private Department department;

	/**
	 * 查询钉钉部门列表
	 */
	@Action(value = "queryDingTalkDepartment", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDDDepartment() throws FLException {

		departments = dingTalkDepartmentService.queryDepartment(queryCompany());

		return SUCCESS;
	}

	// Getters and Setters

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
