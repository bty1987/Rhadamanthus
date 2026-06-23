package com.fanglin.decoration.dao.impl;

import java.util.List;

import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.decoration.dao.DecorationAccountItemDao;
import com.fanglin.decoration.po.DecorationAccountItemPO;

@Repository("decorationAccountItemDao")
public class DecorationAccountItemDaoImpl extends DaoImpl<DecorationAccountItemPO> implements DecorationAccountItemDao {

	public DecorationAccountItemDaoImpl() {
		super(DecorationAccountItemPO.class);
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<DecorationAccountItemPO> queryDecorationAccountItem(String orderId) {

		return session().createCriteria(DecorationAccountItemPO.class).add(Restrictions.eq(DecorationAccountItemPO.COLUMN_ORDERID_STR, orderId)).addOrder(Order.asc("sort")).addOrder(Order.asc("daiid")).list();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<DecorationAccountItemPO> queryDecorationAccountItem(long daid) {

		return session().createCriteria(DecorationAccountItemPO.class).add(Restrictions.eq(DecorationAccountItemPO.COLUMN_DAID_STR, daid)).addOrder(Order.asc("sort")).addOrder(Order.asc("daiid")).list();
	}

	@Override
	public int deleteDecorationAccountItem(String orderId) {

		String sql = "delete from decoration.decorationaccountitem where orderId = :orderId";

		return session().createSQLQuery(sql).setString("orderId", orderId).executeUpdate();
	}

}
