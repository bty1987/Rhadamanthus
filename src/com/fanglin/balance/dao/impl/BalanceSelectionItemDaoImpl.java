package com.fanglin.balance.dao.impl;

import java.math.BigInteger;
import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.balance.dao.BalanceSelectionItemDao;
import com.fanglin.balance.po.BalanceSelectionItemPO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

@Repository("balanceSelectionItemDao")
public class BalanceSelectionItemDaoImpl extends DaoImpl<BalanceSelectionItemPO> implements BalanceSelectionItemDao {

	public BalanceSelectionItemDaoImpl() {
		super(BalanceSelectionItemPO.class);
	}

	@Override
	public List<BalanceSelectionItemPO> pageBalanceSelectionItem(Paging paging, List<Filter> filters, long bsid) {

		PagingQuery<BalanceSelectionItemPO> query = pagingQuery(paging, BalanceSelectionItemPO.class);

		query.add(Restrictions.eq("bsid", bsid));

		query.asc("bsid");

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<BalanceSelectionItemPO> queryBalanceSelectionItem(long bsid) {
		return session().createCriteria(BalanceSelectionItemPO.class).add(Restrictions.eq("bsid", bsid)).list();
	}

	@Override
	public int countBalanceSelectionItem(long bsid) {
		String sql = "select count(*) from balance.balanceselectionitem where bsid = :bsid";
		BigInteger num = (BigInteger)session().createSQLQuery(sql).setLong("bsid", bsid).uniqueResult();
		return num.intValue();
	}

}
