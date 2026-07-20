package com.fanglin.decoration.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.dao.DecorationAccountDao;
import com.fanglin.decoration.po.DecorationAccountPO;
import com.fanglin.utils.Paging;

@Repository("decorationAccountDao")
public class DecorationAccountDaoImpl extends DaoImpl<DecorationAccountPO> implements DecorationAccountDao {

	public DecorationAccountDaoImpl() {
		super(DecorationAccountPO.class);
	}

	@Override
	public List<DecorationAccountPO> pageDecorationAccount(Paging paging, List<Filter> filters, int company) throws FLException {

		PagingQuery<DecorationAccountPO> query = pagingQuery(paging, DecorationAccountPO.class);

		query.add(query.getCriterion("decoration.company", company, "eq"));

		queryFilterExcute(query, filters);

		query.desc("daid");

		return query.list();
	}

	@Override
	public DecorationAccountPO queryDecorationAccount(String orderId) {

		return (DecorationAccountPO) session().createCriteria(DecorationAccountPO.class).add(Restrictions.eq(DecorationAccountPO.DECORATIONACCOUNT_ORDERID_STR, orderId)).setMaxResults(1).uniqueResult();

	}

	private void queryFilterExcute(PagingQuery<DecorationAccountPO> query, List<Filter> filters) throws FLException {

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("decorationAccount.isAffirm".equals(field)) {
				query.add(query.getCriterion("isAffirm", Short.valueOf(data), op));
			} else if ("decorationAccount.name".equals(field)) {
				query.add(query.getCriterion("name", data, op));
			}
		}

		DecorationDaoImpl.queryFilterExcute(query, filters, "decoration");
	}

}
