package com.fanglin.decoration.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.dao.DecorationHolonomyDao;
import com.fanglin.decoration.po.DecorationHolonomyPO;
import com.fanglin.utils.Paging;

@Repository("decorationHolonomyDao")
public class DecorationHolonomyDaoImpl extends DaoImpl<DecorationHolonomyPO> implements DecorationHolonomyDao {

	@Override
	public List<DecorationHolonomyPO> pagedecorationHolonomy(Paging paging, List<Filter> filters, int company) throws FLException {

		PagingQuery<DecorationHolonomyPO> query = pagingQuery(paging, DecorationHolonomyPO.class);

		query.add(query.getCriterion(DecorationHolonomyPO.COLUMN_COMPANY_STR, company, "eq"));

		queryFilterExcute(paging, filters, query);

		return query.list();
	}

	@Override
	public DecorationHolonomyPO queryDecorationHolonomyByOrderId(String orderId) {
		return (DecorationHolonomyPO) session().createCriteria(DecorationHolonomyPO.class).add(Restrictions.eq("decoration.orderId", orderId)).uniqueResult();
	}

	private void queryFilterExcute(Paging paging, List<Filter> filters, PagingQuery<DecorationHolonomyPO> query) throws FLException {
		DecorationDaoImpl.queryFilterExcute(query, filters, "decoration");
	}

}
