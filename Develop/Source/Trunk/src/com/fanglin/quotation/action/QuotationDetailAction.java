/**
 * @File Name		: QuotationDetailAction
 * @Package   	: com.fanglin.action.quotation
 * @Version		: 1.0
 * @Date			: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: mzy
 * @Email			: 739061411@qqcom
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
import com.fanglin.quotation.service.QuotationDetailService;
import com.fanglin.quotation.vo.CustomQuotationItemVO;
import com.fanglin.quotation.vo.QuotationDetailVO;
import com.fanglin.quotation.vo.QuotationFunctionAreaItemVO;
import com.fanglin.quotation.vo.QuotationFunctionAreaVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class QuotationDetailAction extends BaseListAction {

	private static final long serialVersionUID = -1599812124963548111L;

	@Autowired
	private QuotationDetailService quotationDetailService;
	
	private QuotationDetailVO quotationDetail;
	
	private QuotationFunctionAreaVO quotationFunctionArea;
	
	private QuotationFunctionAreaItemVO quotationFunctionAreaItem;
	
	private CustomQuotationItemVO customQuotationItem;

	private List<QuotationFunctionAreaVO> quotationFunctionAreas;

	private List<Long> functionAreaIds;
	
	private List<String> uuids;
	
	private List<Long> autoIds;
	
	@Action(value = "queryQuotationFunctionAreaByIds", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryQuotationFunctionAreaByIds(){
		
		quotationFunctionAreas = quotationDetailService.queryQuotationFunctionAreaByIds(functionAreaIds);

		return SUCCESS;
	}
	
	@Action(value = "queryQuotationFunctionAreaForCommonById", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryQuotationFunctionAreaForCommonById(){
		
		quotationFunctionAreas = quotationDetailService.queryQuotationFunctionAreaForCommonById(quotationDetail.getAutoId());
	    
		return SUCCESS;
	}

	@Action(value = "queryQuotationDetailById", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryQuotationDetailById() throws FLException{
		
		quotationDetail = quotationDetailService.queryQuotationDetailById(quotationDetail.getAutoId());

		return SUCCESS;
	}
	
	@Action(value = "queryQuotationDetailForAllInfoById", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryQuotationDetailForAllInfoById() throws FLException{
		
		quotationDetail = quotationDetailService.queryQuotationDetailForAllInfoById(quotationDetail.getAutoId());

		return SUCCESS;
	}
	
	@Action(value = "queryQuotationDetailForDefaultByOrderId", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryQuotationDetailForDefaultByOrderId() throws FLException{
		
		quotationDetail = quotationDetailService.queryQuotationDetailForDefaultByOrderId(quotationDetail.getOrderId());
	    
		return SUCCESS;
	}
	
	@Action(value = "addQuotationFunctionAreaByIds", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addQuotationFunctionAreaByIds() throws FLException{
		
		quotationFunctionAreas = quotationDetailService.addQuotationFuctionAreaByIds(functionAreaIds, quotationDetail);
		
		return SUCCESS;
	}
	
	@Action(value = "addQuotationFunctionArea", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addQuotationFunctionArea() throws FLException{
		
		quotationDetailService.addQuotationFuctionArea(quotationFunctionAreas, quotationDetail);
		
		return SUCCESS;
	}
	
	@Action(value = "addCustomQuotationItem", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addCustomQuotationItem() throws FLException{
		
		quotationDetailService.addCustomQuotationItem(customQuotationItem, quotationDetail);
		
		return SUCCESS;
	}
	
	@Action(value = "saveQuotaionDetail", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String saveQuotaionDetail() throws Exception{
		
		quotationDetailService.saveQuotationDetail(quotationDetail);
		
		return SUCCESS;
	}
	
	@Action(value = "updateQuotationDetail", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateQuotationDetail() throws FLException{
		
		quotationDetailService.updateQuotatoin(quotationDetail);
		
		return SUCCESS;
	}
	
	@Action(value = "updateQuotationFunctionArea", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateQuotationFunctionArea() throws FLException{
		
		quotationDetailService.updateQuotationFunctionArea(quotationFunctionArea, quotationDetail);
		
		return SUCCESS;
	}
	
	@Action(value = "updateQuotationFunctionAreaItem", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateQuotationFunctionAreaItem() throws FLException{
		
		quotationDetailService.updateQuotationFunctionAreaItem(quotationFunctionAreaItem, quotationDetail);
		
		return SUCCESS;
	}
	
	@Action(value = "updateCustomQuotationItem", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateCustomQuotationItem() throws FLException{
		
		quotationDetailService.updateCustomQuotationItem(customQuotationItem, quotationDetail);
		
		return SUCCESS;
	}
	
	@Action(value = "deleteQuotationFunctionArea", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteQuotationFunctionArea() throws FLException{
		
		quotationDetailService.deleteQuotationFunctionArea(quotationFunctionArea, quotationDetail);
		
		return SUCCESS;
	}
	
	@Action(value = "deleteQuotationFunctionAreaItemByUuids", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteQuotationFunctionAreaItemByUuids() throws FLException{
		
		quotationDetailService.deleteQuotationFunctionAreaItemByUuids(uuids, quotationDetail);
		
		return SUCCESS;
	}
	
	@Action(value = "deleteCustomQuotationItemByIds", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteCustomQuotationItemByIds(){
		
		quotationDetailService.deleteCustomQuotationItemByIds(autoIds, quotationDetail);
		
		return SUCCESS;
	}

	public QuotationDetailVO getQuotationDetail(){
		return quotationDetail;
	}

	public void setQuotationDetail(QuotationDetailVO quotationDetail){
		this.quotationDetail = quotationDetail;
	}

	public List<Long> getFunctionAreaIds() {
		return functionAreaIds;
	}

	public void setFunctionAreaIds(List<Long> functionAreaIds) {
		this.functionAreaIds = functionAreaIds;
	}

	public void setQuotationFunctionAreas(List<QuotationFunctionAreaVO> quotationFunctionAreas){
		this.quotationFunctionAreas = quotationFunctionAreas;
	}

	public List<QuotationFunctionAreaVO> getQuotationFunctionAreas(){
		return quotationFunctionAreas;
	}

	public QuotationFunctionAreaVO getQuotationFunctionArea() {
		return quotationFunctionArea;
	}

	public void setQuotationFunctionArea(QuotationFunctionAreaVO quotationFunctionArea) {
		this.quotationFunctionArea = quotationFunctionArea;
	}

	public QuotationFunctionAreaItemVO getQuotationFunctionAreaItem() {
		return quotationFunctionAreaItem;
	}

	public void setQuotationFunctionAreaItem(QuotationFunctionAreaItemVO quotationFunctionAreaItem) {
		this.quotationFunctionAreaItem = quotationFunctionAreaItem;
	}

	public CustomQuotationItemVO getCustomQuotationItem() {
		return customQuotationItem;
	}

	public void setCustomQuotationItem(CustomQuotationItemVO customQuotationItem) {
		this.customQuotationItem = customQuotationItem;
	}

	public List<String> getUuids() {
		return uuids;
	}

	public void setUuids(List<String> uuids) {
		this.uuids = uuids;
	}

	public List<Long> getAutoIds() {
		return autoIds;
	}

	public void setAutoIds(List<Long> autoIds) {
		this.autoIds = autoIds;
	}
	
}
