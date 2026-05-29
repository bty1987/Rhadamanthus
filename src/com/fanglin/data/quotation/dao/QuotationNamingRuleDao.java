package com.fanglin.data.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.QuotationNamingRulePO;
import com.fanglin.utils.Paging;

public interface QuotationNamingRuleDao extends Dao<QuotationNamingRulePO> {

	public List<QuotationNamingRulePO> pageQuotationNamingRule(Paging paging, List<Filter> filters);

	public List<QuotationNamingRulePO> queryQuotationNamingRule(short type);

	public QuotationNamingRulePO queryQuotationNamingRuleByName(String name, short type);

	public List<QuotationNamingRulePO> queryQuotationNamingRuleByPinyin(String pinyin, Short type, Short status);

}
