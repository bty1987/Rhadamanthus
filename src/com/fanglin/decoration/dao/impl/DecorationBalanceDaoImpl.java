package com.fanglin.decoration.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.dao.DecorationBalanceDao;
import com.fanglin.decoration.po.DecorationBalancePO;
import com.fanglin.utils.Paging;

@Repository("decorationBalanceDao")
public class DecorationBalanceDaoImpl extends DaoImpl<DecorationBalancePO> implements DecorationBalanceDao {

	public DecorationBalanceDaoImpl() {
		super(DecorationBalancePO.class);
	}

	@Override
	public List<DecorationBalancePO> pageDecorationForBalance(Paging paging, List<Filter> filters) throws FLException {

		PagingQuery<DecorationBalancePO> query = pagingQuery(paging, DecorationBalancePO.class);

		queryFilterExcute(query, filters);

		query.desc("dbid");

		return query.list();
	}

	@Override
	public DecorationBalancePO queryDecorationBalance(Long doid) {

		return (DecorationBalancePO) session().createCriteria(DecorationBalancePO.class).createAlias("decoration", "decoration").add(Restrictions.eq(DecorationBalancePO.COLUMN_DOID_STR, doid)).uniqueResult();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) throws FLException {

		DecorationDaoImpl.queryFilterExcute(query, filters, "decoration");

	}
}
