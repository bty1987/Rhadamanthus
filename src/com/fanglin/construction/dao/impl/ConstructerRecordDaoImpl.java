package com.fanglin.construction.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.construction.dao.ConstructerRecordDao;
import com.fanglin.construction.po.ConstructerRecordPO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

@Repository("constructerRecordDao")
public class ConstructerRecordDaoImpl extends DaoImpl<ConstructerRecordPO> implements ConstructerRecordDao {

	public ConstructerRecordDaoImpl() {
		super(ConstructerRecordPO.class);
	}

	@Override
	public List<ConstructerRecordPO> pageConstructerRecord(Paging paging, List<Filter> filters, int company) throws FLException {

		PagingQuery<ConstructerRecordPO> query = pagingQuery(paging, ConstructerRecordPO.class);

		query.add(query.getCriterion("company", company, "eq"));

		queryFilterExcute(query, filters, "");

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ConstructerRecordPO> queryConstructerRecord(long cid) {
		return session().createCriteria(ConstructerRecordPO.class).add(Restrictions.eq("cid", cid)).list();
	}

	private static void queryFilterExcute(PagingQuery<?> query, List<Filter> filters, String prefix) throws FLException {

		if (filters == null) return;
	}
}
