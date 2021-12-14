/**
 * @File Name		: ProtationDaoImpl.java
 * @Package   	: com.fanglin.quotation.dao.impl
 * @Version		: 1.0
 * @Date			: 2021-9-19
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.quotation.dao.impl;

import java.math.BigInteger;
import java.util.List;

import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.quotation.dao.ProtationDao;
import com.fanglin.quotation.po.ProtationPO;

@Repository("protationDao")
public class ProtationDaoImpl extends DaoImpl<ProtationPO> implements ProtationDao {

	public ProtationDaoImpl() {
		super(ProtationPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ProtationPO> queryProtationByOrderId(String orderId) {
		return createCriteria(ProtationPO.class).add(Restrictions.eq("orderId", orderId)).addOrder(Order.desc("createTime")).list();
	}

	@Override
	public ProtationPO queryProtationForDefaultByOrderId(String orderId) {
		return (ProtationPO) createCriteria(ProtationPO.class).add(Restrictions.eq("orderId", orderId)).add(Restrictions.eq("defaults", ProtationPO.DEFAULT_DEFAULT_INT)).uniqueResult();
	}

	@Override
	public int countProtationByOrderId(String orderId) {

		String sql = "select count(*) from quotation.protation where orderId = :orderId";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setString("orderId", orderId).uniqueResult();

		return count.intValue();
	}

	@Override
	public int clearProtationForDefaultByOrderId(String orderId) {

		String sql = "update quotation.protation p set p.defaults = 0 where p.orderId = :orderId";
		session().createSQLQuery(sql).setString("orderId", orderId).executeUpdate();

		return 0;
	}

}
