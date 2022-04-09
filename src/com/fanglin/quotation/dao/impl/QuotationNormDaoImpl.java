package com.fanglin.quotation.dao.impl;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.quotation.dao.QuotationNormDao;
import com.fanglin.quotation.po.QuotationNormPO;

@Repository("quotationNormDao")
public class QuotationNormDaoImpl extends DaoImpl<QuotationNormPO> implements QuotationNormDao {

	public QuotationNormDaoImpl() {
		super(QuotationNormPO.class);
	}

	@Override
	public QuotationNormPO queryQuotationNorm(long qid) {
		return (QuotationNormPO) createCriteria(QuotationNormPO.class).add(Restrictions.eq("qid", qid)).uniqueResult();
	}
}
