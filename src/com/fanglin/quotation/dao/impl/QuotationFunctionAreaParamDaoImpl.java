package com.fanglin.quotation.dao.impl;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.quotation.dao.QuotationFunctionAreaParamDao;
import com.fanglin.quotation.po.QuotationFunctionAreaParamPO;

@Repository("QuotationFunctionAreaParamDao")
public class QuotationFunctionAreaParamDaoImpl extends DaoImpl<QuotationFunctionAreaParamPO> implements QuotationFunctionAreaParamDao {

	public QuotationFunctionAreaParamDaoImpl() {
		super(QuotationFunctionAreaParamPO.class);
	}

	@Override
	public QuotationFunctionAreaParamPO queryQuotationFunctionAreaParam(Long qfaid) {
		return (QuotationFunctionAreaParamPO) session().createCriteria(QuotationFunctionAreaParamPO.class).add(Restrictions.eq(QuotationFunctionAreaParamPO.COLUMN_QFAID_STR, qfaid)).uniqueResult();
	}

}
