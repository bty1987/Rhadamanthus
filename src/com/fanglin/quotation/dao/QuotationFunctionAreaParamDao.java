package com.fanglin.quotation.dao;

import com.fanglin.core.dao.Dao;
import com.fanglin.quotation.po.QuotationFunctionAreaParamPO;

public interface QuotationFunctionAreaParamDao extends Dao<QuotationFunctionAreaParamPO> {

	public QuotationFunctionAreaParamPO queryQuotationFunctionAreaParam(Long qfaid);

}
