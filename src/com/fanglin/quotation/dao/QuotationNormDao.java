package com.fanglin.quotation.dao;

import com.fanglin.core.dao.Dao;
import com.fanglin.quotation.po.QuotationNormPO;

public interface QuotationNormDao extends Dao<QuotationNormPO> {

	public QuotationNormPO queryQuotationNorm(long qid);
}
