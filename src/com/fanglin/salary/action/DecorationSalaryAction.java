package com.fanglin.salary.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.salary.service.DecorationSalaryService;
import com.fanglin.salary.vo.DecorationSalaryVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class DecorationSalaryAction extends BaseListAction {

	private static final long serialVersionUID = 6507673293586331423L;

	@Autowired
	private DecorationSalaryService decorationSalaryService;

	private DecorationSalaryVO decorationSalary;

	@Action(value = "pageDecorationSalary", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageDecorationSalary() throws FLException {

		decorationSalaryService.pageDecorationSalary(getPaging(), getFilters(), decorationSalary);

		return SUCCESS;
	}

	public DecorationSalaryVO getDecorationSalary() {
		return decorationSalary;
	}

	public void setDecorationSalary(DecorationSalaryVO decorationSalary) {
		this.decorationSalary = decorationSalary;
	}

}
