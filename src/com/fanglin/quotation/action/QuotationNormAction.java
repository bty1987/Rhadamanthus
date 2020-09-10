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
import com.fanglin.data.quotation.vo.NormoodVO;
import com.fanglin.data.quotation.vo.NormriceVO;
import com.fanglin.quotation.service.QuotationNormService;
import com.fanglin.quotation.vo.QuotationFunctionAreaVO;
import com.fanglin.quotation.vo.QuotationVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class QuotationNormAction extends BaseListAction {

	private static final long serialVersionUID = 5551824414631095737L;

	@Autowired
	private QuotationNormService quotationNormService;

	private QuotationVO quotation;

	private List<QuotationFunctionAreaVO> quotationFunctionAreas;

	private List<NormoodVO> normoods;

	private List<NormriceVO> normrices;

	private Short schedule;

	@Action(value = "queryQuotationNormood", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryQuotationNormood() throws FLException {

		quotationFunctionAreas = quotationNormService.queryQuotationNormood(quotation);

		return SUCCESS;
	}

	@Action(value = "queryQuotationNormrice", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryQuotationNormrice() throws FLException {

		quotationFunctionAreas = quotationNormService.queryQuotationNormrice(quotation, schedule);

		return SUCCESS;
	}

	@Action(value = "amountQuotationNormood", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String amountQuotationNormood() throws FLException {

		normoods = quotationNormService.amountQuotationNormood(quotation);

		return SUCCESS;
	}

	@Action(value = "amountQuotationNormrice", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String amountQuotationNormrice() throws FLException {

		normrices = quotationNormService.amountQuotationNormrice(quotation);

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

	public void setQuotationFunctionAreas(List<QuotationFunctionAreaVO> quotationFunctionAreas) {
		this.quotationFunctionAreas = quotationFunctionAreas;
	}

	public List<NormoodVO> getNormoods() {
		return normoods;
	}

	public void setNormoods(List<NormoodVO> normoods) {
		this.normoods = normoods;
	}

	public List<NormriceVO> getNormrices() {
		return normrices;
	}

	public void setNormrices(List<NormriceVO> normrices) {
		this.normrices = normrices;
	}

	public Short getSchedule() {
		return schedule;
	}

	public void setSchedule(Short schedule) {
		this.schedule = schedule;
	}

}
