package com.fanglin.balance.dao.impl;

import java.math.BigInteger;
import java.util.List;

import org.hibernate.Query;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.balance.dao.BalancePictureDao;
import com.fanglin.balance.po.BalancePicturePO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("balancePictureDao")
public class BalancePictureDaoImpl extends DaoImpl<BalancePicturePO> implements BalancePictureDao {

	public BalancePictureDaoImpl() {
		super(BalancePicturePO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<BalancePicturePO> queryBalancePictureByBid(Long bid) {
		return createCriteria(BalancePicturePO.class).add(Restrictions.eq(BalancePicturePO.COLUMN_BID_STR, bid)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<BalancePicturePO> queryBalancePictureByPid(Long pid) {
		return session().createCriteria(BalancePicturePO.class).add(Restrictions.eq(BalancePicturePO.COLUMN_PID_STR, pid)).list();
	}

	@Override
	public int countBalancePicture(Long pid, short type) {

		String sql = "SELECT count(*) from balance.balancepicture bp where bp.pid = :pid and bp.type = :type";
		Query query = session().createSQLQuery(sql).setLong("pid", pid).setShort("type", type);

		return ((BigInteger) query.uniqueResult()).intValue();

	}

}
