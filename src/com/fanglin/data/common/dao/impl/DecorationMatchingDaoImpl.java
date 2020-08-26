package com.fanglin.data.common.dao.impl;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.data.common.dao.DecorationMatchingDao;
import com.fanglin.data.po.DecorationMatchingPO;

@Repository("decorationMatchingDao")
public class DecorationMatchingDaoImpl  extends DaoImpl<DecorationMatchingPO> implements DecorationMatchingDao{

	public DecorationMatchingDaoImpl() {
		super(DecorationMatchingPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationMatchingPO> queryDecorationMatching(List<Short> type, List<Short> typeness, int company) {
		
		Criteria session = session().createCriteria(DecorationMatchingPO.class);
		
		if (type != null && type.size() > 0) {
			session.add(Restrictions.in(DecorationMatchingPO.COLUMN_TYPE_STR, type));
		}

		if (typeness != null && typeness.size() > 0){
			session.add(Restrictions.in(DecorationMatchingPO.COLUMN_TYPENESS_STR, typeness));
		}
		
		return session.add(Restrictions.eq(DecorationMatchingPO.COLUMN_COMPANY_STR, company)).addOrder(Order.asc("dmid")).list();
	}
}
