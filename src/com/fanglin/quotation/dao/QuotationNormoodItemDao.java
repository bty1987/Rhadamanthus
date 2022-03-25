package com.fanglin.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.quotation.po.QuotationNormoodItemPO;

public interface QuotationNormoodItemDao extends Dao<QuotationNormoodItemPO> {

	public List<QuotationNormoodItemPO> queryQuotationNormoodItem(long qid);

}
