package com.fanglin.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.quotation.po.QuotationFunctionPO;

public interface QuotationFunctionDao extends Dao<QuotationFunctionPO> {

	public List<QuotationFunctionPO> queryQuotationFunction(Short type);

}
