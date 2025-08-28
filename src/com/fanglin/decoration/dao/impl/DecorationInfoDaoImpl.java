package com.fanglin.decoration.dao.impl;

import java.util.List;

import org.hibernate.SQLQuery;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.decoration.dao.DecorationInfoDao;
import com.fanglin.decoration.po.DecorationInfoPO;
import com.fanglin.decoration.po.DecorationPO;

@Repository("decorationInfoDao")
public class DecorationInfoDaoImpl extends DaoImpl<DecorationInfoPO> implements DecorationInfoDao {

	public DecorationInfoDaoImpl() {
		super(DecorationInfoPO.class);
	}

	@Override
	public DecorationInfoPO queryDecorationInfoByOrderId(String orderId) {

		return (DecorationInfoPO) session().createCriteria(DecorationInfoPO.class).add(Restrictions.eq("orderId", orderId)).uniqueResult();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationPO> queryDecorationForChanceRefer(String orderId) {

		String sql = "select d.* from decoration.decoration d, customer.customersource cs, customer.customerchance cc where cs.referOrderId = :orderId and cs.csid = cc.csid and cc.orderId = d.orderId";

		SQLQuery query = session().createSQLQuery(sql).addEntity(DecorationPO.class);

		return query.setString("orderId", orderId).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationPO> queryDecorationForOriginRefer(String orderId) {

		String sql = "select d.* from decoration.decoration d, customer.customerorigin co where co.referOrderId = :orderId and co.orderId = d.orderId";

		SQLQuery query = session().createSQLQuery(sql).addEntity(DecorationPO.class);

		return query.setString("orderId", orderId).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationPO> queryDecorationForOrderRefer(String orderId) {

		String sql = "select d.* from decoration.decoration d, decoration.decorationInfo di where di.referOrderId = :orderId and di.orderId = d.orderId";

		SQLQuery query = session().createSQLQuery(sql).addEntity(DecorationPO.class);

		return query.setString("orderId", orderId).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationPO> queryDecorationForChanceReferd(String orderId) {

		String sql = "select d.* from decoration.decoration d, customer.customersource cs, customer.customerchance cc where cs.referOrderId = d.orderId and cs.csid = cc.csid and cc.orderId = :orderId";

		SQLQuery query = session().createSQLQuery(sql).addEntity(DecorationPO.class);

		return query.setString("orderId", orderId).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationPO> queryDecorationForOriginReferd(String orderId) {

		String sql = "select d.* from decoration.decoration d, customer.customerorigin co where co.referOrderId = d.orderId and co.orderId = :orderId";

		SQLQuery query = session().createSQLQuery(sql).addEntity(DecorationPO.class);

		return query.setString("orderId", orderId).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationPO> queryDecorationForOrderReferd(String orderId) {

		String sql = "select d.* from decoration.decoration d, decoration.decorationInfo di where di.referOrderId = d.orderId and di.orderId = :orderId";

		SQLQuery query = session().createSQLQuery(sql).addEntity(DecorationPO.class);

		return query.setString("orderId", orderId).list();
	}

}
