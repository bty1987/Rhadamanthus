package com.fanglin.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.quotation.po.QuotationFunctionAreaParamPO;

public interface QuotationFunctionAreaParamDao extends Dao<QuotationFunctionAreaParamPO> {

	public QuotationFunctionAreaParamPO queryQuotationFunctionAreaParam(Long qfaid);

	public List<QuotationFunctionAreaParamPO> queryQuotationFunctionAreaParamByQfaid(Long qfaid);

}
