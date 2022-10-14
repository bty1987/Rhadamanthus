/**
 * @File Name		: QuotationVersionAction.java
 * @Package   	: com.fanglin.action
 * @Version		: 1.0
 * @Date			: 2014-7-25
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.data.quotation.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.quotation.service.QuotationVersionService;
import com.fanglin.data.quotation.vo.QuotationVersionVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class QuotationVersionAction extends BaseListAction {

	private static final long serialVersionUID = 1965087836085075507L;

	@Autowired
	private QuotationVersionService quotationVersionService;

	private List<QuotationVersionVO> quotationVersions;

	private QuotationVersionVO quotationVersion;

	@Action(value = "pageQuotationVersion", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageQuotationVersion() throws FLException {

		quotationVersionService.pageQuotationVersion(getPaging(), getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryQuotationVersion", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryQuotationVersion() throws FLException {

		quotationVersions = quotationVersionService.queryQuotationVersion(queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryQuotationVersionByVersionId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryQuotationVersionByVersionId() {

		quotationVersion = quotationVersionService.queryQuotationVersionById(quotationVersion);

		return SUCCESS;
	}

	@Action(value = "addQuotationVersion", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addQuotationVersion() throws FLException {

		quotationVersionService.saveQuotationVersion(quotationVersion, queryCompany());

		return SUCCESS;
	}

	@Action(value = "updateQuotationVersion", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateQuotationVersion() throws FLException {

		quotationVersionService.updateQuotationVersion(quotationVersion);

		return SUCCESS;
	}

	@Action(value = "updateQuotationVersionForDefault", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateQuotationVersionForDefault() throws FLException {

		quotationVersionService.updateQuotationVersionForDefault(quotationVersion, queryCompany());

		return SUCCESS;
	}

	public List<QuotationVersionVO> getQuotationVersions() {
		return quotationVersions;
	}

	public void setQuotationVersions(List<QuotationVersionVO> quotationVersions) {
		this.quotationVersions = quotationVersions;
	}

	public QuotationVersionVO getQuotationVersion() {
		return quotationVersion;
	}

	public void setQuotationVersion(QuotationVersionVO quotationVersion) {
		this.quotationVersion = quotationVersion;
	}

}
