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
	public List<ConstructerPO> queryConstructerByOrderId(String orderId, Long csid) {

		Criteria query = session().createCriteria(ConstructerPO.class).add(Restrictions.eq(ConstructerPO.COLUMN_ORDERID_STR, orderId)).add(Restrictions.ne(ConstructerPO.COLUMN_STATUS_STR, ConstructerPO.STATUS_DISABLE_INT));

		if (csid != null) {
			query.add(Restrictions.eq("csid", csid));
		}

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ConstructerPO> queryConstructerByCid(long cid, Long csid) {

		Criteria query = session().createCriteria(ConstructerPO.class).add(Restrictions.eq(ConstructerPO.COLUMN_CID_STR, cid)).add(Restrictions.ne(ConstructerPO.COLUMN_STATUS_STR, ConstructerPO.STATUS_DISABLE_INT));

		if (csid != null) {
			query.add(Restrictions.eq("csid", csid));
		}

		return query.list();
	}

	@Override
	public ConstructerPO queryConstructerByUid(String orderId, long cnid, int wuid) {

		return (ConstructerPO) session().createCriteria(ConstructerPO.class).add(Restrictions.eq(ConstructerPO.COLUMN_ORDERID_STR, orderId)).add(Restrictions.eq("cnid", cnid)).add(Restrictions.ne(ConstructerPO.COLUMN_STATUS_STR, ConstructerPO.STATUS_DISABLE_INT)).add(Restrictions.eq(ConstructerPO.COLUMN_UID_STR, wuid)).setMaxResults(1).uniqueResult();
	}

	@Override
	public ConstructerPO queryConstructerByCrid(long crid) {

		return (ConstructerPO) session().createCriteria(ConstructerPO.class).add(Restrictions.eq(ConstructerPO.COLUMN_CRID_STR, crid)).setMaxResults(1).uniqueResult();
	}

	@Override
	public int countConstructer(long cid, int wuid, long csid) {

		String sql = "select count(*) from construction.constructer where cid = :cid and wuid = :wuid and csid = :csid and status != :status";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setLong("cid", cid).setInteger("wuid", wuid).setLong("csid", csid).setShort("status", ConstructerPO.STATUS_DISABLE_INT).uniqueResult();

		return count.intValue();
	}

}
