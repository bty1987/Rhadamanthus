package com.fanglin.decoration.dao.impl;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.decoration.dao.DecorationAccountStatusDao;
import com.fanglin.decoration.po.DecorationAccountStatusPO;

@Repository("decorationAccountStatusDao")
public class DecorationAccountStatusDaoImpl extends DaoImpl<DecorationAccountStatusPO> implements DecorationAccountStatusDao {

	public DecorationAccountStatusDaoImpl() {
		super(DecorationAccountStatusPO.class);
	}

	@Override
	public DecorationAccountStatusPO queryDecorationAccountStatusByOrderId(String orderId) {
		return (DecorationAccountStatusPO) session().createCriteria(DecorationAccountStatusPO.class).add(Restrictions.eq(DecorationAccountStatusPO.COLUMN_ORDERID_STR, orderId)).setMaxResults(1).uniqueResult();
	}

}
