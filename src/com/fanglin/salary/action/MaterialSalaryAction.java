package com.fanglin.salary.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.salary.service.MaterialSalaryService;
import com.fanglin.salary.vo.MaterialSalaryVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class MaterialSalaryAction extends BaseListAction {

	private static final long serialVersionUID = -2733097132938777680L;

	@Autowired
	private MaterialSalaryService materialSalaryService;

	private MaterialSalaryVO materialSalary;

	@Action(value = "pageMaterialSalary", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageMaterialSalary() throws FLException {

		materialSalaryService.pageMaterialSalary(getPaging(), getFilters(), materialSalary);

		return SUCCESS;
	}

	public MaterialSalaryVO getMaterialSalary() {
		return materialSalary;
	}

	public void setMaterialSalary(MaterialSalaryVO materialSalary) {
		this.materialSalary = materialSalary;
	}

}
