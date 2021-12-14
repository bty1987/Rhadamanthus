/**
 * Title: OrganizationAction
 * Description:
 * Copyright: Copyright (c) 2014 All rights reserved.
 * Company: JH Corporation, China, Ltd.
 * @author Howard
 *
 */

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
import com.fanglin.system.service.OrganizationService;
import com.fanglin.system.vo.OrganizationVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class OrganizationAction extends BaseListAction {

	private static final long serialVersionUID = -1055543784578173204L;

	@Autowired
	private OrganizationService organizationService;
	
	private List<OrganizationVO> organizations;
	
	private OrganizationVO organization;
	
	@Action(value = "pageOrganization", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageOrganization(){
		
		organizationService.pageOrganization(getPaging(), getFilters());
		
		return SUCCESS;
	}

	@Action(value = "addOrganization", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addOrganization() throws FLException{
		
		organizationService.addOrganization(organization);
		
		return SUCCESS;
	}
	
	@Action(value = "updateOrganization", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateOrganization() throws FLException{
		
		organizationService.updateOrganization(organization);
		
		return SUCCESS;
	}

	@Action(value = "updateOrganizationForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateOrganizationForStatus() throws FLException{
		
		organizationService.updateOrganizationForStatus(organization);
		
		return SUCCESS;
	}
	
	@Action(value = "queryOrganization", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryOrganization() throws FLException{
		
		organizations = organizationService.queryOrganization(organization, queryCompany());
		
		return SUCCESS;
	}

	public List<OrganizationVO> getOrganizations() {
		return organizations;
	}

	public void setOrganizations(List<OrganizationVO> organizations) {
		this.organizations = organizations;
	}

	public OrganizationVO getOrganization() {
		return organization;
	}

	public void setOrganization(OrganizationVO organization) {
		this.organization = organization;
	}

}
