package com.fanglin.quotation.dao.impl;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.quotation.dao.QuotationFunctionDao;
import com.fanglin.quotation.po.QuotationFunctionPO;

@Repository("quotationFunctionDao")
public class QuotationFunctionDaoImpl extends DaoImpl<QuotationFunctionPO> implements QuotationFunctionDao {

	public QuotationFunctionDaoImpl() {
		super(QuotationFunctionPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<QuotationFunctionPO> queryQuotationFunction(Short type) {

		Criteria criteria = session().createCriteria(QuotationFunctionPO.class).add(Restrictions.eq("status", QuotationFunctionPO.STATUS_ENABLE_INT));

		if (type != null) {
			criteria.add(Restrictions.eq("type", type));
		}

		return criteria.list();
	}

}
