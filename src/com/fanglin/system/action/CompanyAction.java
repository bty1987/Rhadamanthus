package com.fanglin.system.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.system.service.CompanyService;
import com.fanglin.system.vo.CompanyVO;
import com.fanglin.utils.SystemConfig;

@ParentPackage("base")
@Namespace("/")
@Controller
public class CompanyAction extends BaseListAction{

	private static final long serialVersionUID = 3246937855994579649L;
	
	@Autowired
	private CompanyService companyService;
	
	private CompanyVO company;
	
	private List<CompanyVO> companys;
	
	@Action(value = "pageCompany", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageCompany() throws FLException{
		
		companyService.pageCompany(getPaging(), getFilters());
		
		return SUCCESS;
	}
	
	@Action(value = "queryCompany", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryCompanys() throws FLException{
		
		companys = companyService.queryCompany();
		
		return SUCCESS;
	}
	
	@Action(value = "queryCompanyByCid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryCompanyByCid() throws FLException{
		
		company = companyService.queryCompanyByCid(company);
		
		return SUCCESS;
	}
	
	@Action(value = "addCompany", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addCompany() throws FLException{
		
		if(SystemConfig.getString("communion") == null){
		    throw new FLException(-1, "无操作权限");
		}
	
		companyService.addCompany(company);
		
		return SUCCESS;
	}
	
	@Action(value = "updateCompanyForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateCompanyForStatus() throws FLException{
		
		if(SystemConfig.getString("communion") == null){
		    throw new FLException(-1, "无操作权限");
		}
		
		companyService.updateCompanyForStatus(company);
		
		return SUCCESS;
	}
	
	@Action(value = "updateCompany", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateCompany() throws FLException{
		
		if(SystemConfig.getString("communion") == null){
		    throw new FLException(-1, "无操作权限");
		}
		
		companyService.updateCompany(company);
		
		return SUCCESS;
	}
	
	public CompanyVO getCompany() {
		return company;
	}

	public void setCompany(CompanyVO company) {
		this.company = company;
	}

	public List<CompanyVO> getCompanys() {
		return companys;
	}

	public void setCompanys(List<CompanyVO> companys) {
		this.companys = companys;
	}

}
