package com.fanglin.decoration.dao.impl;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.decoration.dao.DecorationAdditionDao;
import com.fanglin.decoration.po.DecorationAdditionPO;

@Repository("decorationAdditionDao")
public class DecorationAdditionDaoImpl extends DaoImpl<DecorationAdditionPO> implements DecorationAdditionDao {

	public DecorationAdditionDaoImpl() {
		super(DecorationAdditionPO.class);
	}

	@Override
	public DecorationAdditionPO queryDecorationAdditionByOrderId(String orderId) {

		return (DecorationAdditionPO) session().createCriteria(DecorationAdditionPO.class).add(Restrictions.eq(DecorationAdditionPO.DECORATION_ORDERID_STR, orderId)).setMaxResults(1).uniqueResult();
	}

}
