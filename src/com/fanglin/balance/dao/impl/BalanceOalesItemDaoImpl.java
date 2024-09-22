package com.fanglin.balance.dao.impl;

import java.math.BigInteger;
import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.balance.dao.BalanceOalesItemDao;
import com.fanglin.balance.po.BalanceOalesItemPO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

@Repository("balanceOalesItemDao")
public class BalanceOalesItemDaoImpl extends DaoImpl<BalanceOalesItemPO> implements BalanceOalesItemDao {

	public BalanceOalesItemDaoImpl() {
		super(BalanceOalesItemPO.class);
	}

	@Override
	public List<BalanceOalesItemPO> pageBalanceOalesItem(Paging paging, List<Filter> filters, long boid) {

		PagingQuery<BalanceOalesItemPO> query = pagingQuery(paging, BalanceOalesItemPO.class);

		query.add(Restrictions.eq("boid", boid));

		query.asc("boid");

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<BalanceOalesItemPO> queryBalanceOalesItem(long boid) {
		return session().createCriteria(BalanceOalesItemPO.class).add(Restrictions.eq("boid", boid)).list();
	}

	@Override
	public int countBalanceOalesItem(long boid) {
		String sql = "select count(*) from balance.balanceoalesitem where boid = :boid";
		BigInteger num = (BigInteger) session().createSQLQuery(sql).setLong("boid", boid).uniqueResult();
		return num.intValue();
	}

}
