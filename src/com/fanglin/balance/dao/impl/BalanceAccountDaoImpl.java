package com.fanglin.balance.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.balance.dao.BalanceAccountDao;
import com.fanglin.balance.po.BalanceAccountPO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

@Repository("balanceAccountDao")
public class BalanceAccountDaoImpl extends DaoImpl<BalanceAccountPO> implements BalanceAccountDao {

	public BalanceAccountDaoImpl() {
		super(BalanceAccountPO.class);
	}

	@Override
	public List<BalanceAccountPO> pageBalanceAccount(Paging paging, List<Filter> filters) {

		PagingQuery<BalanceAccountPO> query = pagingQuery(paging, BalanceAccountPO.class);

		queryFilterExcute(query, filters);

		query.desc("baid");

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<BalanceAccountPO> queryBalanceAccount(int buid) {
		return session().createCriteria(BalanceAccountPO.class).createAlias("belonger", "belonger").add(Restrictions.eq(BalanceAccountPO.COLUMN_BELONGER_UID_STR, buid)).add(Restrictions.eq(BalanceAccountPO.COLUMN_STATUS_STR, BalanceAccountPO.STATUS_VALID_SHORT)).add(Restrictions.eq(BalanceAccountPO.COLUMN_TYPE_STR, BalanceAccountPO.TYPE_VALID_SHORT)).list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<BalanceAccountPO> queryBalanceAccountForTeller(int company) {
		return session().createCriteria(BalanceAccountPO.class).add(Restrictions.eq(BalanceAccountPO.COLUMN_STATUS_STR, BalanceAccountPO.STATUS_VALID_SHORT)).add(Restrictions.eq(BalanceAccountPO.COLUMN_TYPE_STR, BalanceAccountPO.TYPE_UNVALID_SHORT)).add(Restrictions.eq("company", company)).list();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if (field.equals("name")) {
				query.add(query.getCriterion(field, data, op));
			} else if (field.equals("status")) {
				query.add(query.getCriterion(field, Short.valueOf(data), op));
			} else if (field.equals("type")) {
				query.add(query.getCriterion(field, Short.valueOf(data), op));
			}
		}
	}

}
