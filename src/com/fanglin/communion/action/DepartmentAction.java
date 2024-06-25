/**
 * Title: DepartmentAction
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: BTY
 * @author bty1987
 *
 */

package com.fanglin.communion.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.communion.service.DepartmentService;
import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.system.service.impl.CompanyServiceImpl;
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

	private String company;

	@Action(value = "pageDepartment", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageDepartment() throws FLException {

		departmentService.pageDepartment(getPaging(), getFilters(), dept, queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryDepartment", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDepartment() throws FLException {

		deptList = departmentService.queryDepartment(dept, company != null ? CompanyServiceImpl.decode(company) : queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryDepartmentByDtid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDepartmentByDtid() throws FLException {

		deptList = departmentService.queryDepartmentByDtid(dept, company != null ? CompanyServiceImpl.decode(company) : queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryDepartmentByDid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDepartmentByDid() throws FLException {

		dept = departmentService.queryDepartmentByDid(dept);

		return SUCCESS;
	}

	@Action(value = "queryDepartmentByNo", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDepartmentByNo() throws FLException {

		dept = departmentService.queryDepartmentByNo(dept);

		return SUCCESS;
	}

	@Action(value = "queryDepartmentByName", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDepartmentByName() throws FLException {

		deptList = departmentService.queryDepartmentByName(dept, company != null ? CompanyServiceImpl.decode(company) : queryCompany());

		return SUCCESS;
	}

	@Action(value = "addDepartment", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addDepartment() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		departmentService.addDepartment(dept, queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "updateDepartment", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateDepartment() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		departmentService.updateDepartment(dept);

		return SUCCESS;
	}

	@Action(value = "updateDepartmentForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateDepartmentForStatus() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		departmentService.updateDepartmentForStatus(dept);

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

	public String getCompany() {
		return company;
	}

	public void setCompany(String company) {
		this.company = company;
	}

}
