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

import java.util.Date;
import java.util.List;

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
import com.fanglin.utils.DateUtil;

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
	
	private long replicaOrderId;
	
	@Action(value = "queryQuotationByOrderId", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryQuotationByOrderId(){
		
		quotations = quotationService.queryQuotationByOrderId(quotation);

		return SUCCESS;
	}
	
	@Action(value = "queryQuotationForDefaultByOrderId", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryQuotationForDefaultByOrderId(){
		
		quotation = quotationService.queryQuotationForDefaultByOrderId(quotation);

		return SUCCESS;
	}
	
	@Action(value = "queryQuotationById", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryQuotationById(){
		
		quotation=quotationService.queryQuotationById(quotation.getAutoId());

		return SUCCESS;
	}
	
	@Action(value = "queryQuotationForStatusByOrderId", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryQuotationForStatusByOrderId(){
		
		canChange = quotationService.queryQuotationForStatusByOrderId(quotation, null);
	    
		return SUCCESS;
	}
	
	@Action(value = "addQuotation", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addQuotation() throws FLException{

		quotation.setDesignerId(getUserId());
		quotation.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		
		quotationService.addQuotation(quotation);
		
		return SUCCESS;
	}
	
	@Action(value = "updateQuotation", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateQuotation() throws FLException{ 
		
		quotationService.updateQuotation(quotation);
	    
		return SUCCESS;
	}
	
	@Action(value = "deleteQuotationById", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteQuotationById() throws FLException{
		
		quotationService.deleteQuotationById(quotation);
	    
		return SUCCESS;
	}

	@Action(value = "replicaQuotation", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String replicaQuotation() throws FLException{
		
		quotationService.replicaQuotation(replicaOrderId, quotation);
		
		return SUCCESS;
	}

	@Action(value = "copyQuotation", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String copyQuotation() throws FLException{ 
		
		quotation.setDesignerId(getUserId());
		quotation.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		quotationService.copyQuotation(quotation.getAutoId(), quotation);
	    
		return SUCCESS;
	}

	@Action(value = "changeQuotationForDefault", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String changeQuotationForDefault() throws FLException{ 
		
		quotationService.updateQuotationForDefault(quotation);
		
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

	public long getReplicaOrderId() {
		return replicaOrderId;
	}

	public void setReplicaOrderId(long replicaOrderId) {
		this.replicaOrderId = replicaOrderId;
	}

}
