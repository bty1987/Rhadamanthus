package com.fanglin.payment.dao.impl;

import java.math.BigInteger;
import java.util.List;

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
	public List<PointofsalesPO> queryPointofsalesByPid(String pid, short type) {
		return session().createCriteria(PointofsalesPO.class).add(Restrictions.eq("pid", pid)).add(Restrictions.eq("type", type)).list();
	}

	@Override
	public void updatePointofsales(List<Long> posids, Short status) {

		String sql = "update payment.pointofsales set status = :status where posid in :posids";

		session().createSQLQuery(sql).setShort("status", status).setParameterList("posids", posids).executeUpdate();
	}

	@Override
	public long countPointofsales(String sn, Short status) {

		String sql = "select count(*) from payment.pointofsales where sn = :sn and status = :status";
		BigInteger num = (BigInteger) session().createSQLQuery(sql).setString("sn", sn).setShort("status", status).uniqueResult();

		return num.longValue();
	}

}
