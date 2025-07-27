package com.fanglin.sales.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.sales.service.SalesProfileService;
import com.fanglin.sales.vo.SalesProfileVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class SalesProfileAction extends BaseListAction {

	private static final long serialVersionUID = -8203746982626094102L;

	@Autowired
	private SalesProfileService salesProfileService;

	private SalesProfileVO salesProfile;

	private List<SalesProfileVO> salesProfiles;

	@Action(value = "querySalesProfileByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String querySalesProfileByOrderId() throws FLException {

		salesProfile = salesProfileService.querySalesProfileByOrderId(salesProfile);

		return SUCCESS;
	}

	@Action(value = "makeSalesProfile", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String makeSalesProfile() throws FLException {

		salesProfile = salesProfileService.makeSalesProfile(salesProfile, queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "handleSalesProfile", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String handleSalesProfile() throws FLException {

		salesProfileService.handleSalesProfile(salesProfile);

		return SUCCESS;
	}
	
	@Action(value = "addSalesProfileBrand", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addSalesProfileBrand() throws FLException {

		salesProfileService.addSalesProfileBrand(salesProfile);

		return SUCCESS;
	}
	
	@Action(value = "updateSalesProfileBrand", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateSalesProfileBrand() throws FLException {

		salesProfileService.updateSalesProfileBrand(salesProfile);

		return SUCCESS;
	}

	public SalesProfileVO getSalesProfile() {
		return salesProfile;
	}

	public void setSalesProfile(SalesProfileVO salesProfile) {
		this.salesProfile = salesProfile;
	}

	public List<SalesProfileVO> getSalesProfiles() {
		return salesProfiles;
	}

	public void setSalesProfiles(List<SalesProfileVO> salesProfiles) {
		this.salesProfiles = salesProfiles;
	}

}
