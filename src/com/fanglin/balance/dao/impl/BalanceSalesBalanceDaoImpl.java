package com.fanglin.balance.dao.impl;

import java.math.BigInteger;
import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.balance.dao.BalanceSalesBalanceDao;
import com.fanglin.balance.po.BalanceSalesBalancePO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

@Repository("balanceSalesBalanceDao")
public class BalanceSalesBalanceDaoImpl extends DaoImpl<BalanceSalesBalancePO> implements BalanceSalesBalanceDao {

	public BalanceSalesBalanceDaoImpl() {
		super(BalanceSalesBalancePO.class);
	}

	@Override
	public List<BalanceSalesBalancePO> pageBalanceSalesBalance(Paging paging, List<Filter> filters, long bsid) {

		PagingQuery<BalanceSalesBalancePO> query = pagingQuery(paging, BalanceSalesBalancePO.class);

		query.add(Restrictions.eq("bsid", bsid));

		query.asc("bsid");

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<BalanceSalesBalancePO> queryBalanceSalesBalance(long bsid) {
		return session().createCriteria(BalanceSalesBalancePO.class).add(Restrictions.eq("bsid", bsid)).list();
	}

	@Override
	public int countBalanceSalesBalance(long bsid) {
		String sql = "select count(*) from balance.balancesalesbalance where bsid = :bsid";
		BigInteger num = (BigInteger)session().createSQLQuery(sql).setLong("bsid", bsid).uniqueResult();
		return num.intValue();
	}

}
