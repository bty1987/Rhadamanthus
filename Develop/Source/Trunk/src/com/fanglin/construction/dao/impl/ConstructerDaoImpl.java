package com.fanglin.construction.dao.impl;

import java.math.BigInteger;
import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.construction.dao.ConstructerDao;
import com.fanglin.construction.po.ConstructerPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("constructerDao")
public class ConstructerDaoImpl extends DaoImpl<ConstructerPO> implements
		ConstructerDao {

	public ConstructerDaoImpl() {
		super(ConstructerPO.class);
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<ConstructerPO> queryConstructerByOrderId(String orderId,Integer schedule) {
		Criteria c =  session()
				.createCriteria(ConstructerPO.class)
				.add(Restrictions.eq(ConstructerPO.COLUMN_ORDERID_STR, orderId))
				.add(Restrictions.eq(ConstructerPO.COLUMN_STATUS_STR, ConstructerPO.STATUS_ENABLE_SHORT));
		if (schedule != null) {
			c.add(Restrictions.eq("schedule", schedule));
		}
		return c.list();
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<ConstructerPO> queryConstructerByCsId(long csId, Integer schedule) {
		Criteria c =  session()
				.createCriteria(ConstructerPO.class)
				.add(Restrictions.eq(ConstructerPO.COLUMN_CSID_STR, csId))
				.add(Restrictions.eq(ConstructerPO.COLUMN_STATUS_STR, ConstructerPO.STATUS_ENABLE_SHORT));
		if (schedule != null) {
			c.add(Restrictions.eq("schedule", schedule));
		}
		return c.list();
	}

	@Override
	public ConstructerPO queryConstructerByCid(long cid) {
		return (ConstructerPO)session().createCriteria(ConstructerPO.class).add(Restrictions.eq(ConstructerPO.COLUMN_CID_STR,cid)).uniqueResult();
	}

	@Override
	public int countConstructer(long csId, String userId, int schedule, short status) {
		String sql = "select count(*) from platform.constructer where csId = :csId and userId = :userId and schedule = :schedule and status = :status";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setLong("csId", csId).setString("userId", userId).setInteger("schedule", schedule).setShort("status", status).uniqueResult();
		return count.intValue();
	}
}
