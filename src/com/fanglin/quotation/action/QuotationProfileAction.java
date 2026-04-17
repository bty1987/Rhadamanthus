package com.fanglin.quotation.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.quotation.service.QuotationProfileService;
import com.fanglin.quotation.vo.QuotationProfileVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class QuotationProfileAction extends BaseListAction {

	private static final long serialVersionUID = -7103746982626094203L;

	@Autowired
	private QuotationProfileService quotationProfileService;

	private QuotationProfileVO quotationProfile;

	private List<QuotationProfileVO> quotationProfiles;

	@Action(value = "pageQuotationProfile", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageQuotationProfile() throws FLException {

		quotationProfileService.pageQuotationProfile(getPaging(), getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryQuotationProfileByQid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryQuotationProfileByQid() throws FLException {

		quotationProfiles = quotationProfileService.queryQuotationProfileByQid(quotationProfile);

		return SUCCESS;
	}

	@Action(value = "queryQuotationProfileByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryQuotationProfileByOrderId() throws FLException {

		quotationProfiles = quotationProfileService.queryQuotationProfileByOrderId(quotationProfile);

		return SUCCESS;
	}

	@Action(value = "queryQuotationProfileByQpid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryQuotationProfileByQpid() throws FLException {

		quotationProfile = quotationProfileService.queryQuotationProfileByQpid(quotationProfile);

		return SUCCESS;
	}

	@Action(value = "addQuotationProfile", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addQuotationProfile() throws FLException {

		quotationProfileService.addQuotationProfile(quotationProfile, queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "makeQuotationProfile", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String makeQuotationProfile() throws FLException {

		quotationProfileService.makeQuotationProfile(quotationProfile, queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "handleQuotationProfile", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String handleQuotationProfile() throws FLException {

		quotationProfileService.handleQuotationProfile(quotationProfile);

		return SUCCESS;
	}

	public QuotationProfileVO getQuotationProfile() {
		return quotationProfile;
	}

	public void setQuotationProfile(QuotationProfileVO quotationProfile) {
		this.quotationProfile = quotationProfile;
	}

	public List<QuotationProfileVO> getQuotationProfiles() {
		return quotationProfiles;
	}

	public void setQuotationProfiles(List<QuotationProfileVO> quotationProfiles) {
		this.quotationProfiles = quotationProfiles;
	}

}
