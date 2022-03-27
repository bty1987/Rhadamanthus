package com.fanglin.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.quotation.po.QuotationNormriceItemPO;

public interface QuotationNormriceItemDao extends Dao<QuotationNormriceItemPO> {

	public List<QuotationNormriceItemPO> queryQuotationNormrice(long qid);

}
