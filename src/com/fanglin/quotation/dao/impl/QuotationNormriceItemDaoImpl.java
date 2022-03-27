package com.fanglin.quotation.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.quotation.dao.QuotationNormriceItemDao;
import com.fanglin.quotation.po.QuotationNormriceItemPO;

@Repository("quotationNormriceItemDao")
public class QuotationNormriceItemDaoImpl extends DaoImpl<QuotationNormriceItemPO> implements QuotationNormriceItemDao {

	public QuotationNormriceItemDaoImpl() {
		super(QuotationNormriceItemPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<QuotationNormriceItemPO> queryQuotationNormrice(long qid) {
		return createCriteria(QuotationNormriceItemPO.class).add(Restrictions.eq("qid", qid)).list();
	}
}
