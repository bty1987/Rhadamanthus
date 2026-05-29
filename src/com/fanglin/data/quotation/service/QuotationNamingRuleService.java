package com.fanglin.data.quotation.service;

import java.util.List;

import com.fanglin.core.vo.Filter;
import com.fanglin.data.quotation.vo.QuotationNamingRuleVO;
import com.fanglin.utils.Paging;

public interface QuotationNamingRuleService {

	public void pageQuotationNamingRule(Paging paging, List<Filter> filters);

	public List<QuotationNamingRuleVO> queryQuotationNamingRule(QuotationNamingRuleVO quotationNamingRuleVO);

	public int addQuotationNamingRule(QuotationNamingRuleVO quotationNamingRuleVO);

	public int updateQuotationNamingRule(QuotationNamingRuleVO quotationNamingRuleVO);

	public int updateQuotationNamingRuleForStatus(QuotationNamingRuleVO quotationNamingRuleVO);

	public int deleteQuotationNamingRule(QuotationNamingRuleVO quotationNamingRuleVO);

	public boolean validateNormaddName(String name);

	public List<QuotationNamingRuleVO> queryQuotationNamingRuleByPinyin(String pinyin, Short type, Short status);

}
