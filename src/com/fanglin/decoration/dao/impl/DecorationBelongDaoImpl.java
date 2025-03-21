/**
 * @File Name		: DecorationBelongDaoImpl
 * @Package   	: com.fanglin.dao
 * @Version		: 1.0
 * @Date			: 2014-9-21
 * @Copyright	: Copyright Creators 2014
 * @Author		:  bty1987
 * @Email			: 
 * @Describing	: 
 */

package com.fanglin.decoration.dao.impl;

import java.math.BigInteger;
import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.decoration.dao.DecorationBelongDao;
import com.fanglin.decoration.po.DecorationBelongPO;

@Repository("decorationBelongDao")
public class DecorationBelongDaoImpl extends DaoImpl<DecorationBelongPO> implements DecorationBelongDao {

	public DecorationBelongDaoImpl() {
		super(DecorationBelongPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationBelongPO> queryDecorationBelong(String orderId, Short type, Short status) {

		Criteria query = createCriteria(DecorationBelongPO.class).add(Restrictions.eq("orderId", orderId));

		if (type != null) {
			query.add(Restrictions.eq("type", type));
		}

		if (status != null) {
			query.add(Restrictions.eq("status", status));
		}

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationBelongPO> queryDecorationBelongByOrderIds(List<String> orderIds) {
		return session().createCriteria(DecorationBelongPO.class).add(Restrictions.in("orderId", orderIds)).add(Restrictions.ne("status", DecorationBelongPO.STATUS_EFFCTIVE_INT)).list();
	}

	@Override
	public int countDecorationBelong(String orderId, short type, short status) {

		String sql = "select count(*) from decoration.decorationbelong where orderId = :orderId and type = :type and status = :status";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setString("orderId", orderId).setShort("type", type).setShort("status", status).uniqueResult();

		return count.intValue();
	}

	@Override
	public int changeDecorationBelongForOrderId(String source, String target) {

		String sql = "update decoration.decorationbelong set orderId=:source where orderId=:target";
		session().createSQLQuery(sql).setString("source", source).setString("target", target).executeUpdate();

		return 0;
	}

	@Override
	public int updateDecorationBelong(String orderId, Short type, Short source, Short target) {

		String sql = "update decoration.decorationbelong set status = :target where orderId=:orderId and status = :source and type = :type";
		session().createSQLQuery(sql).setString("orderId", orderId).setShort("type", type).setShort("source", source).setShort("target", target).executeUpdate();

		return 0;
	}

}
