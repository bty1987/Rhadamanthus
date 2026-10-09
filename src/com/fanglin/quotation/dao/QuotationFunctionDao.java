package com.fanglin.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.quotation.po.QuotationFunctionPO;
import com.fanglin.utils.Paging;

public interface QuotationFunctionDao extends Dao<QuotationFunctionPO> {

	public List<QuotationFunctionPO> pageQuotationFunction(Paging paging, List<Filter> filters);

	public List<QuotationFunctionPO> queryQuotationFunction(Short type);

	public List<QuotationFunctionPO> queryQuotationFunctionByName(String name);

	public long countQuotationFunctionRightByQfid(long qfid);

}
