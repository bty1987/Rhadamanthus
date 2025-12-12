package com.fanglin.balance.dao.impl;

import java.math.BigInteger;
import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.balance.dao.BalanceSelectionItemDao;
import com.fanglin.balance.po.BalanceSelectionItemPO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

@Repository("balanceSelectionItemDao")
public class BalanceSelectionItemDaoImpl extends DaoImpl<BalanceSelectionItemPO> implements BalanceSelectionItemDao {

	public BalanceSelectionItemDaoImpl() {
		super(BalanceSelectionItemPO.class);
	}

	@Override
	public List<BalanceSelectionItemPO> pageBalanceSelectionItem(Paging paging, List<Filter> filters, long bsid) throws FLException {

		PagingQuery<BalanceSelectionItemPO> query = pagingQuery(paging, BalanceSelectionItemPO.class);

		query.alias("selectionItem", "selectionItem").alias("selectionItem.decoration", "decoration").add(Restrictions.eq("bsid", bsid));

		queryFilterExcute(query, filters);

		query.desc("decoration.orderId");

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<BalanceSelectionItemPO> queryBalanceSelectionItem(long bsid) {
		return session().createCriteria(BalanceSelectionItemPO.class).add(Restrictions.eq("bsid", bsid)).list();
	}

	@Override
	public BalanceSelectionItemPO queryBalanceSelectionItemBySiid(long siid) {
		return (BalanceSelectionItemPO) session().createCriteria(BalanceSelectionItemPO.class).createAlias("selectionItem", "selectionItem").add(Restrictions.eq("selectionItem.siid", siid)).setMaxResults(1).uniqueResult();
	}

	@Override
	public int countBalanceSelectionItem(long bsid) {

		String sql = "select count(*) from balance.balanceselectionitem where bsid = :bsid";
		BigInteger num = (BigInteger) session().createSQLQuery(sql).setLong("bsid", bsid).uniqueResult();

		return num.intValue();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) throws FLException {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("decoration.orderId".equals(field)) {
				query.add(query.getCriterion("decoration.orderId", data, op));
			}
		}

	}

}
