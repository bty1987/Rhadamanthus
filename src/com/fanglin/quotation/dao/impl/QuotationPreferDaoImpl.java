package com.fanglin.quotation.dao.impl;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.quotation.dao.QuotationPreferDao;
import com.fanglin.quotation.po.QuotationPreferPO;

@Repository("quotationPreferDao")
public class QuotationPreferDaoImpl extends DaoImpl<QuotationPreferPO> implements QuotationPreferDao{

	public QuotationPreferDaoImpl() {
		super(QuotationPreferPO.class);
	}

	@Override
	public QuotationPreferPO queryQuotationPreferByQid(long qid) {
		return (QuotationPreferPO) createCriteria(QuotationPreferPO.class).add(Restrictions.eq("qid", qid)).setMaxResults(1).uniqueResult();
	}

}
