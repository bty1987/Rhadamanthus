package com.fanglin.quotation.dao.impl;

import java.math.BigInteger;
import java.util.List;

import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.quotation.dao.QuotetionDao;
import com.fanglin.quotation.po.QuotetionPO;

@Repository("quotetionDao")
public class QuotetionDaoImpl extends DaoImpl<QuotetionPO> implements QuotetionDao {

	public QuotetionDaoImpl() {
		super(QuotetionPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<QuotetionPO> queryQuotetionByCuid(long cuid) {
		return createCriteria(QuotetionPO.class).add(Restrictions.eq("cuid", cuid)).addOrder(Order.desc("createTime")).list();
	}

	@Override
	public QuotetionPO queryQuotetionByNo(String no) {
		return (QuotetionPO) createCriteria(QuotetionPO.class).add(Restrictions.eq("no", no)).setMaxResults(1).uniqueResult();
	}

	@Override
	public int countQuotetionByCuid(long cuid) {

		String sql = "select count(*) from quotetion.quotetion where cuid = :cuid";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setLong("cuid", cuid).uniqueResult();

		return count == null ? 0 : count.intValue();
	}

}
