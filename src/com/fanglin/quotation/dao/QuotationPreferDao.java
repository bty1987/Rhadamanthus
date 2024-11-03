package com.fanglin.quotation.dao;

import com.fanglin.core.dao.Dao;
import com.fanglin.quotation.po.QuotationPreferPO;

public interface QuotationPreferDao extends Dao<QuotationPreferPO>{

	public QuotationPreferPO queryQuotationPreferByQid(long qid);
}
