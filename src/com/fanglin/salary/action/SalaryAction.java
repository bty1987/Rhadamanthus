package com.fanglin.salary.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.salary.service.SalaryService;
import com.fanglin.salary.vo.SalaryVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class SalaryAction extends BaseListAction {

	private static final long serialVersionUID = -1273872797458372209L;

	@Autowired
	private SalaryService salaryService;

	private SalaryVO salary;

	@Action(value = "pageSalary", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageSalary() throws FLException {

		salaryService.pageSalary(getPaging(), getFilters(), salary);

		return "success";
	}

	@Action(value = "addSalary", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addSalary() throws FLException {

		salaryService.addSalary(salary);

		return "success";
	}

	@Action(value = "passSalary", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String passSalary() throws FLException {

		salaryService.passSalary(salary, queryUserId());

		return "success";
	}

	@Action(value = "rejectSalary", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String rejectSalary() throws FLException {

		salaryService.rejectSalary(salary, queryUserId());

		return "success";
	}

	@Action(value = "cancelSalary", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String cancelSalary() throws FLException {

		salaryService.cancelSalary(salary, queryUserId());

		return "success";
	}

	public SalaryVO getSalary() {
		return salary;
	}

	public void setSalary(SalaryVO salary) {
		this.salary = salary;
	}

}
