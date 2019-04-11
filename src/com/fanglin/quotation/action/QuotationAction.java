/**
 * @File Name		: QuotationAction
 * @Package   	: com.fanglin.action.quotation
 * @Version		: 1.0
 * @Date			: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.quotation.action;

import java.util.List;
import java.util.Map;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.quotation.service.QuotationService;
import com.fanglin.quotation.vo.QuotationVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class QuotationAction extends BaseListAction {

	private static final long serialVersionUID = -1599812124963548111L;

	@Autowired
	private QuotationService quotationService;
	
	private QuotationVO quotation;
	
	private List<QuotationVO> quotations;
	
	private int canChange;
	
	private String no;
	
	private Map<String, List<String>> configs;
	
	@Action(value = "queryQuotationByOrderId", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryQuotationByOrderId(){
		
		quotations = quotationService.queryQuotationByOrderId(quotation);

		return SUCCESS;
	}
	
	@Action(value = "queryQuotationForDefaultByOrderId", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryQuotationForDefaultByOrderId() throws FLException{
		
		quotation = quotationService.queryQuotationForDefaultByOrderId(quotation);

		return SUCCESS;
	}
	
	@Action(value = "queryQuotationById", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryQuotationById(){
		
		quotation=quotationService.queryQuotationByQid(quotation.getQid());

		return SUCCESS;
	}
	
	@Action(value = "queryQuotationForConfig", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryQuotationForConfig() throws FLException{
		
		configs = quotationService.queryQuotationForConfig(queryCompany());
	    
		return SUCCESS;
	}
	
	@Action(value = "addQuotation", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addQuotation() throws FLException{

		quotationService.addQuotation(quotation, queryUserId(), queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value = "updateQuotation", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateQuotation() throws FLException{ 
		
		quotationService.updateQuotation(quotation);
	    
		return SUCCESS;
	}
	
	@Action(value = "updateQuotationForAdvance", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateQuotationForAdvance() throws FLException{
		
		quotationService.updateQuotationForAdvance(quotation);
		
		return SUCCESS;
	}
	
	@Action(value = "updateQuotationForStatus", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateQuotationForStatus() throws FLException{ 
		
		quotationService.updateQuotationForStatus(quotation, queryUserId());
	    
		return SUCCESS;
	}
	
	@Action(value = "deleteQuotationById", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteQuotationById() throws FLException{
		
		quotationService.deleteQuotationById(quotation);
	    
		return SUCCESS;
	}

	@Action(value = "replicaQuotation", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String replicaQuotation() throws FLException{
		
		quotationService.replicaQuotation(quotation,queryUserId(), queryCompany());
		
		return SUCCESS;
	}
	@Action(value = "cloneQuotation", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String cloneQuotation() throws FLException{
		
		quotationService.cloneQuotation(quotation,no,queryUserId(), queryCompany());
		
		return SUCCESS;
	}

	@Action(value = "copyQuotation", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String copyQuotation() throws FLException{ 
		
		quotationService.copyQuotation(quotation, queryUserId(), queryCompany());
	    
		return SUCCESS;
	}

	@Action(value = "changeQuotationForDefault", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String changeQuotationForDefault() throws FLException{ 
		
		quotationService.changeQuotationForDefault(quotation);
		
		return SUCCESS;
	}
	
	@Action(value = "lockQuotation", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String lockQuotation() throws FLException{ 
		
		quotationService.lockQuotation(quotation, queryUserId());
	    
		return SUCCESS;
	}
	
	@Action(value = "unlockQuotation", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String unlockQuotation() throws FLException{ 
		
		quotationService.unlockQuotation(quotation, queryUserId());
	    
		return SUCCESS;
	}

	public QuotationVO getQuotation(){
		return quotation;
	}

	public void setQuotation(QuotationVO quotation){
		this.quotation = quotation;
	}

	public void setQuotations(List<QuotationVO> quotations){
		this.quotations = quotations;
	}

	public List<QuotationVO> getQuotations(){
		return quotations;
	}

	public void setCanChange(int canChange){
		this.canChange = canChange;
	}

	public int getCanChange(){
		return canChange;
	}

	public Map<String, List<String>> getConfigs() {
		return configs;
	}

	public void setConfigs(Map<String, List<String>> configs) {
		this.configs = configs;
	}

	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}

}
