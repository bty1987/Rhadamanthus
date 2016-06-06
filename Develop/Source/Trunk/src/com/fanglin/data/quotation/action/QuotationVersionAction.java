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
	
	private String versionId;
	
	@Action(value="pageQuotationVersion", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pageQuotationVersion(){

		quotationVersionService.pageQuotationVersion(getPaging(), getFilters());
	    
		return SUCCESS;
	}
	
	@Action(value="queryQuotationVersion", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryQuotationVersion(){
		
		quotationVersions = quotationVersionService.queryQuotationVersion();
	    
		return SUCCESS;
	}
	
	@Action(value="queryQuotationVersionByVersionId", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryQuotationVersionByVersionId(){
		
		quotationVersion = quotationVersionService.queryQuotationVersionById(quotationVersion);
	    
		return SUCCESS;
	}
	
	@Action(value="addQuotationVersion", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String addQuotationVersion(){
		
		quotationVersionService.saveQuotationVersion(quotationVersion);
	    
		return SUCCESS;
	}
	
	@Action(value="updateQuotationVersion", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String updateQuotationVersion(){
		
		quotationVersionService.updateQuotationVersion(quotationVersion);
		
		return SUCCESS;
	}
	
	@Action(value="copyQuotationVersion", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String copyQuotationVersion() throws FLException{
		
		quotationVersionService.copyQuotationVersion(quotationVersion, versionId);
	    
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

	public void setVersionId(String versionId){
		this.versionId = versionId;
	}

	public String getVersionId(){
		return versionId;
	}
	
}
