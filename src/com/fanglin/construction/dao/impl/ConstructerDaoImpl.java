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

	@Override
	@SuppressWarnings("unchecked")
	public List<ConstructerPO> queryConstructerByCid(long cid, Integer schedule) {
		
		Criteria c =  session()
				.createCriteria(ConstructerPO.class)
				.add(Restrictions.eq(ConstructerPO.COLUMN_CID_STR, cid))
				.add(Restrictions.eq(ConstructerPO.COLUMN_STATUS_STR, ConstructerPO.STATUS_ENABLE_SHORT));
		
		if (schedule != null) {
			c.add(Restrictions.eq("schedule", schedule));
		}
		
		return c.list();
		
	}

	@Override
	public ConstructerPO queryConstructerByCrId(long crid) {
		
		return (ConstructerPO)session().createCriteria(ConstructerPO.class).add(Restrictions.eq(ConstructerPO.COLUMN_CRID_STR,crid)).uniqueResult();
	
	}

	@Override
	public int countConstructer(long cid, String userId, int schedule, short status) {
		
		String sql = "select count(*) from construction.constructer where cid = :cid and userId = :userId and schedule = :schedule and status = :status";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setLong("cid", cid).setString("userId", userId).setInteger("schedule", schedule).setShort("status", status).uniqueResult();
		
		return count.intValue();
		
	}
}
