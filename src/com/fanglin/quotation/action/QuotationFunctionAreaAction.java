/**
 * @File Name		: QuotationFunctionAreaAction.java
 * @Package   	: com.fanglin.quotation.action
 * @Version		: 1.0
 * @Date			: 2016-6-5
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

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
import com.fanglin.quotation.service.QuotationFunctionAreaService;
import com.fanglin.quotation.vo.QuotationFunctionAreaVO;
import com.fanglin.quotation.vo.QuotationVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class QuotationFunctionAreaAction extends BaseListAction{

	private static final long serialVersionUID = 5551824414631095737L;
	
	@Autowired
	private QuotationFunctionAreaService quotationFunctionAreaService;
	
	private QuotationVO quotation;
	
	private List<QuotationFunctionAreaVO> quotationFunctionAreas;
	
	private QuotationFunctionAreaVO quotationFunctionArea;
	
	private List<Long> functionAreaIds;
	
	@Action(value = "queryQuotationFunctionAreaForCommonByQuotationId", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryQuotationFunctionAreaForCommonByQuotationId() throws FLException{
		
		quotationFunctionAreas = quotationFunctionAreaService.queryQuotationFunctionAreaForCommonByQuotationId(quotation);
	    
		return SUCCESS;
	}
	
	@Action(value = "queryQuotationFunctionAreaByQuotationId", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryQuotationFunctionAreaByQuotationId() throws FLException{
		
		quotationFunctionAreas = quotationFunctionAreaService.queryQuotationFunctionAreaByQuotationId(quotation);
		
		return SUCCESS;
	}
	
	@Action(value = "addQuotationFuctionAreaByFunctionAreaIds", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addQuotationFuctionAreaByFunctionAreaIds() throws FLException{
		
		quotationFunctionAreas = quotationFunctionAreaService.addQuotationFuctionAreaByFunctionAreaIds(functionAreaIds, quotation);
		
		return SUCCESS;
	}
	
	@Action(value = "addQuotationFunctionArea", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addQuotationFunctionArea() throws FLException{
		
		quotationFunctionAreaService.addQuotationFunctionArea(functionAreaIds, quotation);
		
		return SUCCESS;
	}

	@Action(value = "updateQuotationFunctionArea", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateQuotationFunctionArea() throws FLException{
		
		quotationFunctionAreaService.updateQuotationFunctionArea(quotationFunctionArea, quotation);
		
		return SUCCESS;
	}
	
	@Action(value = "deleteQuotationFunctionArea", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteQuotationFunctionArea() throws FLException{
		
		quotationFunctionAreaService.deleteQuotationFunctionArea(quotationFunctionArea, quotation);
		
		return SUCCESS;
	}

	public QuotationVO getQuotation() {
		return quotation;
	}

	public void setQuotation(QuotationVO quotation) {
		this.quotation = quotation;
	}

	public List<QuotationFunctionAreaVO> getQuotationFunctionAreas() {
		return quotationFunctionAreas;
	}

	public void setQuotationFunctionAreas(
			List<QuotationFunctionAreaVO> quotationFunctionAreas) {
		this.quotationFunctionAreas = quotationFunctionAreas;
	}

	public List<Long> getFunctionAreaIds() {
		return functionAreaIds;
	}

	public void setFunctionAreaIds(List<Long> functionAreaIds) {
		this.functionAreaIds = functionAreaIds;
	}

	public QuotationFunctionAreaVO getQuotationFunctionArea() {
		return quotationFunctionArea;
	}

	public void setQuotationFunctionArea(
			QuotationFunctionAreaVO quotationFunctionArea) {
		this.quotationFunctionArea = quotationFunctionArea;
	}
	
}
