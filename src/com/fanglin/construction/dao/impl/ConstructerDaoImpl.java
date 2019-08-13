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
public class ConstructerDaoImpl extends DaoImpl<ConstructerPO> implements ConstructerDao {

	public ConstructerDaoImpl() {
		super(ConstructerPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ConstructerPO> queryConstructerByOrderId(String orderId, Short schedule) {

		Criteria query = session().createCriteria(ConstructerPO.class).add(Restrictions.eq(ConstructerPO.COLUMN_ORDERID_STR, orderId)).add(Restrictions.eq(ConstructerPO.COLUMN_STATUS_STR, ConstructerPO.STATUS_ENABLE_SHORT));

		if (schedule != null) {
			query.add(Restrictions.eq("schedule", schedule));
		}

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ConstructerPO> queryConstructerByCid(long cid, Short schedule) {

		Criteria query = session().createCriteria(ConstructerPO.class).add(Restrictions.eq(ConstructerPO.COLUMN_CID_STR, cid)).add(Restrictions.eq(ConstructerPO.COLUMN_STATUS_STR, ConstructerPO.STATUS_ENABLE_SHORT));

		if (schedule != null) {
			query.add(Restrictions.eq("schedule", schedule));
		}

		return query.list();
	}

	@Override
	public ConstructerPO queryConstructerByCrId(long crid) {

		return (ConstructerPO) session().createCriteria(ConstructerPO.class).add(Restrictions.eq(ConstructerPO.COLUMN_CRID_STR, crid)).uniqueResult();

	}

	@Override
	public int countConstructer(long cid, int wuid, short schedule, short status) {

		String sql = "select count(*) from construction.constructer where cid = :cid and wuid = :wuid and schedule = :schedule and status = :status";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setLong("cid", cid).setInteger("wuid", wuid).setInteger("schedule", schedule).setShort("status", status).uniqueResult();

		return count.intValue();
	}
}
