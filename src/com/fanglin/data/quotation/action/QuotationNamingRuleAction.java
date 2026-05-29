package com.fanglin.data.quotation.action;

import java.util.ArrayList;
import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.common.vo.KeyValueVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.quotation.service.QuotationNamingRuleService;
import com.fanglin.data.quotation.vo.QuotationNamingRuleVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class QuotationNamingRuleAction extends BaseListAction {

	private static final long serialVersionUID = 1L;

	@Autowired
	private QuotationNamingRuleService quotationNamingRuleService;

	private List<QuotationNamingRuleVO> quotationNamingRules;

	private QuotationNamingRuleVO quotationNamingRule;

	private String pinyinName;

	private List<KeyValueVO> autoFillKeyValue;

	private List<String> autoFillList;

	@Action(value = "pageQuotationNamingRule", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageQuotationNamingRule() throws FLException {

		quotationNamingRuleService.pageQuotationNamingRule(getPaging(), getFilters());

		return SUCCESS;
	}

	@Action(value = "queryQuotationNamingRule", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryQuotationNamingRule() throws FLException {

		quotationNamingRules = quotationNamingRuleService.queryQuotationNamingRule(quotationNamingRule);

		return SUCCESS;
	}

	@Action(value = "queryQuotationNamingRuleByPinyin", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryQuotationNamingRuleByPinyin() throws FLException {

		Short type = quotationNamingRule != null ? quotationNamingRule.getType() : null;
		Short status = quotationNamingRule != null ? quotationNamingRule.getStatus() : null;

		List<QuotationNamingRuleVO> rules = quotationNamingRuleService.queryQuotationNamingRuleByPinyin(pinyinName, type, status);

		for (QuotationNamingRuleVO ruleVO : rules) {

			KeyValueVO keyValueVO = new KeyValueVO();
			keyValueVO.setKey(String.valueOf(ruleVO.getQnrid()));
			keyValueVO.setValue(ruleVO.getName());

			getAutoFillKeyValue().add(keyValueVO);
			getAutoFillList().add(ruleVO.getName());
		}

		return SUCCESS;
	}

	@Action(value = "addQuotationNamingRule", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addQuotationNamingRule() throws FLException {

		quotationNamingRuleService.addQuotationNamingRule(quotationNamingRule);

		return SUCCESS;
	}

	@Action(value = "updateQuotationNamingRule", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateQuotationNamingRule() throws FLException {

		quotationNamingRuleService.updateQuotationNamingRule(quotationNamingRule);

		return SUCCESS;
	}

	@Action(value = "updateQuotationNamingRuleForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateQuotationNamingRuleForStatus() throws FLException {

		quotationNamingRuleService.updateQuotationNamingRuleForStatus(quotationNamingRule);

		return SUCCESS;
	}

	@Action(value = "deleteQuotationNamingRule", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteQuotationNamingRule() throws FLException {

		quotationNamingRuleService.deleteQuotationNamingRule(quotationNamingRule);

		return SUCCESS;
	}

	public List<QuotationNamingRuleVO> getQuotationNamingRules() {
		return quotationNamingRules;
	}

	public void setQuotationNamingRules(List<QuotationNamingRuleVO> quotationNamingRules) {
		this.quotationNamingRules = quotationNamingRules;
	}

	public QuotationNamingRuleVO getQuotationNamingRule() {
		return quotationNamingRule;
	}

	public void setQuotationNamingRule(QuotationNamingRuleVO quotationNamingRule) {
		this.quotationNamingRule = quotationNamingRule;
	}

	public String getPinyinName() {
		return pinyinName;
	}

	public void setPinyinName(String pinyinName) {
		this.pinyinName = pinyinName;
	}

	public List<KeyValueVO> getAutoFillKeyValue() {
		if (autoFillKeyValue == null) {
			autoFillKeyValue = new ArrayList<KeyValueVO>();
		}
		return autoFillKeyValue;
	}

	public void setAutoFillKeyValue(List<KeyValueVO> autoFillKeyValue) {
		this.autoFillKeyValue = autoFillKeyValue;
	}

	public List<String> getAutoFillList() {
		if (autoFillList == null) {
			autoFillList = new ArrayList<String>();
		}
		return autoFillList;
	}

	public void setAutoFillList(List<String> autoFillList) {
		this.autoFillList = autoFillList;
	}

}
