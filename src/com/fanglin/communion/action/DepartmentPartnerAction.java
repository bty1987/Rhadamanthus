package com.fanglin.communion.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.communion.service.DepartmentPartnerService;
import com.fanglin.communion.vo.DepartmentPartnerVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class DepartmentPartnerAction extends BaseListAction {

	private static final long serialVersionUID = -7095865844585574943L;

	@Autowired
	private DepartmentPartnerService departmentPartnerService;

	private List<DepartmentPartnerVO> departmentPartners;

	private DepartmentPartnerVO departmentPartner;

	@Action(value = "queryDepartmentPartner", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDepartmentPartner() throws FLException {

		departmentPartners = departmentPartnerService.queryDepartmentPartner(departmentPartner);

		return SUCCESS;
	}

	@Action(value = "addDepartmentPartner", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addDepartmentPartner() throws FLException {

		departmentPartnerService.addDepartmentPartner(departmentPartner, queryCompany());

		return SUCCESS;
	}

	@Action(value = "deleteDepartmentPartner", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteDepartmentPartner() throws FLException {

		departmentPartnerService.deleteDepartmentPartner(departmentPartner);

		return SUCCESS;
	}

	public List<DepartmentPartnerVO> getDepartmentPartners() {
		return departmentPartners;
	}

	public void setDepartmentPartners(List<DepartmentPartnerVO> DepartmentPartners) {
		this.departmentPartners = DepartmentPartners;
	}

	public DepartmentPartnerVO getDepartmentPartner() {
		return departmentPartner;
	}

	public void setDepartmentPartner(DepartmentPartnerVO departmentPartner) {
		this.departmentPartner = departmentPartner;
	}
}
