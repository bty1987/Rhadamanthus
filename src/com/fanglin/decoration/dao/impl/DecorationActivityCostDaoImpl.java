package com.fanglin.decoration.dao.impl;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.decoration.dao.DecorationActivityCostDao;
import com.fanglin.decoration.po.DecorationActivityCostPO;

@Repository("decorationActivityCostDao")
public class DecorationActivityCostDaoImpl extends DaoImpl<DecorationActivityCostPO> implements DecorationActivityCostDao {

	public DecorationActivityCostDaoImpl() {
		super(DecorationActivityCostPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationActivityCostPO> queryDecorationActivityCostByOrderId(String orderId) {

		Criteria query = session().createCriteria(DecorationActivityCostPO.class);

		query.add(Restrictions.eq("orderId", orderId));
		query.addOrder(Order.asc("dacId"));

		return query.list();
	}

}
