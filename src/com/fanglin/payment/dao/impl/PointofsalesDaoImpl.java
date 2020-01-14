package com.fanglin.payment.dao.impl;

import java.math.BigInteger;
import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.payment.dao.PointofsalesDao;
import com.fanglin.payment.po.PointofsalesPO;

@Repository("pointofsalesDao")
public class PointofsalesDaoImpl extends DaoImpl<PointofsalesPO> implements PointofsalesDao {

	public PointofsalesDaoImpl() {
		super(PointofsalesPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<PointofsalesPO> queryPointofsalesByPid(String pid, Short type) {
		return session().createCriteria(PointofsalesPO.class).add(Restrictions.eq("pid", pid)).add(Restrictions.eq("type", type)).list();
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<PointofsalesPO> queryPointofsalesByPidAndRid(String pid, Long rid) {
		
		Criteria criteria = session().createCriteria(PointofsalesPO.class).add(Restrictions.eq("pid", pid));
		
		if(rid != null){
			criteria.add(Restrictions.eq("rid", rid));
		}
		
		return criteria.list();
	}

	@Override
	public void updatePointofsales(List<Long> posids, Long rid, Short status, Short type) {

		String sql = "update payment.pointofsales set status = :status, rid = :rid, type = :type where posid in :posids";

		session().createSQLQuery(sql).setShort("status", status).setLong("rid", rid).setShort("type", type).setParameterList("posids", posids).executeUpdate();
	}

	@Override
	public long countPointofsales(String sn, Short status) {

		String sql = "select count(*) from payment.pointofsales where sn = :sn and status = :status";
		BigInteger num = (BigInteger) session().createSQLQuery(sql).setString("sn", sn).setShort("status", status).uniqueResult();

		return num.longValue();
	}

	@Override
	public int countPointofsalesByPosids(List<Long> posids) {
		
		String sql = "select count(*) from payment.pointofsales where posid in :posids and status != :status";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setParameterList("posids", posids).setShort("status", PointofsalesPO.STATUS_SUCCESS_INT).uniqueResult();

		return count.intValue();
	}

}
