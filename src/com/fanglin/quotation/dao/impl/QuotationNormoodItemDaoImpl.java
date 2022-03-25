package com.fanglin.quotation.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.quotation.dao.QuotationNormoodItemDao;
import com.fanglin.quotation.po.QuotationNormoodItemPO;

@Repository("quotationNormoodItemDao")
public class QuotationNormoodItemDaoImpl extends DaoImpl<QuotationNormoodItemPO> implements QuotationNormoodItemDao {

	public QuotationNormoodItemDaoImpl() {
		super(QuotationNormoodItemPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<QuotationNormoodItemPO> queryQuotationNormoodItem(long qid) {
		return createCriteria(QuotationNormoodItemPO.class).add(Restrictions.eq("qid", qid)).list();
	}

}
