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
import com.fanglin.quotation.service.NormtionService;
import com.fanglin.quotation.vo.AddReduceVO;
import com.fanglin.quotation.vo.ExtensionVO;
import com.fanglin.quotation.vo.NormtionVO;
import com.fanglin.quotation.vo.QuotationFunctionAreaVO;
import com.fanglin.quotation.vo.QuotationVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class NormtionAction extends BaseListAction {

	private static final long serialVersionUID = 5551824414631095737L;

	@Autowired
	private NormtionService normtionService;

	private QuotationVO quotation;

	private ExtensionVO extension;

	private AddReduceVO addReduce;

	private List<QuotationFunctionAreaVO> quotationFunctionAreas;

	private List<ExtensionVO> extensions;

	private List<AddReduceVO> addReduces;

	private List<NormoodVO> normoods;

	private List<NormriceVO> normrices;

	private NormtionVO normtion;

	private Short schedule;

	@Action(value = "pageNormtion", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageNormtion() throws FLException {

		normtionService.pageNormtion(getPaging(), getFilters(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryQuotationNormood", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryQuotationNormood() throws FLException {

		quotationFunctionAreas = normtionService.queryQuotationNormood(quotation);

		return SUCCESS;
	}

	@Action(value = "queryExtensionNormood", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryExtensionNormood() throws FLException {

		extensions = normtionService.queryExtensionNormood(extension);

		return SUCCESS;
	}

	@Action(value = "queryAddReduceNormood", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryAddReduceNormood() throws FLException {

		addReduces = normtionService.queryAddReduceNormood(addReduce);

		return SUCCESS;
	}

	@Action(value = "queryQuotationNormrice", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryQuotationNormrice() throws FLException {

		quotationFunctionAreas = normtionService.queryQuotationNormrice(quotation, schedule);

		return SUCCESS;
	}

	@Action(value = "queryExtensionNormrice", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryExtensionNormrice() throws FLException {

		extensions = normtionService.queryExtensionNormrice(extension, schedule);

		return SUCCESS;
	}

	@Action(value = "queryAddReduceNormrice", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryAddReduceNormrice() throws FLException {

		addReduces = normtionService.queryAddReduceNormrice(addReduce, schedule);

		return SUCCESS;
	}

	@Action(value = "amountQuotationNormood", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String amountQuotationNormood() throws FLException {

		normoods = normtionService.amountQuotationNormood(quotation);

		return SUCCESS;
	}

	@Action(value = "amountExtensionNormood", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String amountExtensionNormood() throws FLException {

		normoods = normtionService.amountExtensionNormood(extension);

		return SUCCESS;
	}

	@Action(value = "amountAddReduceNormood", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String amountAddReduceNormood() throws FLException {

		normoods = normtionService.amountAddReduceNormood(addReduce);

		return SUCCESS;
	}

	@Action(value = "amountQuotationNormrice", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String amountQuotationNormrice() throws FLException {

		normrices = normtionService.amountQuotationNormrice(quotation);

		return SUCCESS;
	}

	@Action(value = "amountExtensionNormrice", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String amountExtensionNormrice() throws FLException {

		normrices = normtionService.amountExtensionNormrice(extension);

		return SUCCESS;
	}

	@Action(value = "amountAddReduceNormrice", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String amountAddReduceNormrice() throws FLException {

		normrices = normtionService.amountAddReduceNormrice(addReduce);

		return SUCCESS;
	}

	@Action(value = "queryNormtion", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryNormtion() throws FLException {

		normtion = normtionService.queryNormtion(normtion);

		return SUCCESS;
	}

	@Action(value = "printNormtion", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String printNormtion() throws FLException {

		normtionService.printNormtion(normtion);

		return SUCCESS;
	}

	public QuotationVO getQuotation() {
		return quotation;
	}

	public void setQuotation(QuotationVO quotation) {
		this.quotation = quotation;
	}

	public ExtensionVO getExtension() {
		return extension;
	}

	public void setExtension(ExtensionVO extension) {
		this.extension = extension;
	}

	public AddReduceVO getAddReduce() {
		return addReduce;
	}

	public void setAddReduce(AddReduceVO addReduce) {
		this.addReduce = addReduce;
	}

	public List<QuotationFunctionAreaVO> getQuotationFunctionAreas() {
		return quotationFunctionAreas;
	}

	public void setQuotationFunctionAreas(List<QuotationFunctionAreaVO> quotationFunctionAreas) {
		this.quotationFunctionAreas = quotationFunctionAreas;
	}

	public List<ExtensionVO> getExtensions() {
		return extensions;
	}

	public void setExtensions(List<ExtensionVO> extensions) {
		this.extensions = extensions;
	}

	public List<AddReduceVO> getAddReduces() {
		return addReduces;
	}

	public void setAddReduces(List<AddReduceVO> addReduces) {
		this.addReduces = addReduces;
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
