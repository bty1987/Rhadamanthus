package com.fanglin.construction.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.construction.dao.ConstructionFunctionDao;
import com.fanglin.construction.po.ConstructionFunctionPO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

@Repository("constructionFunctionDao")
public class ConstructionFunctionDaoImpl extends DaoImpl<ConstructionFunctionPO> implements ConstructionFunctionDao {

	public ConstructionFunctionDaoImpl() {
		super(ConstructionFunctionPO.class);
	}

	@Override
	public List<ConstructionFunctionPO> pageConstructionFunction(Paging paging, List<Filter> filters) {
		PagingQuery<ConstructionFunctionPO> query = pagingQuery(paging, ConstructionFunctionPO.class);

		queryFilterExcute(query, filters);

		query.asc("sort").asc("cfid");

		return query.list();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("name".equals(field)) {
				query.add(query.getCriterion("name", data, op));
			} else if ("key".equals(field)) {
				query.add(query.getCriterion("key", data, op));
			} else if ("type".equals(field)) {
				query.add(query.getCriterion("type", data, op));
			} else if ("subtype".equals(field)) {
				query.add(query.getCriterion("subtype", data, op));
			}
		}
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ConstructionFunctionPO> queryConstructionFunction(Short type) {

		if (type != null) {
			return session().createCriteria(ConstructionFunctionPO.class).add(Restrictions.eq("type", type)).list();
		} else {
			return session().createCriteria(ConstructionFunctionPO.class).list();
		}
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ConstructionFunctionPO> queryConstructionFunctionByName(String name) {
		return session().createCriteria(ConstructionFunctionPO.class).add(Restrictions.eq("name", name)).list();
	}

	@Override
	public long countConstructionFunctionRightByCfid(long cfid) {
		return ((Number) session().createQuery("select count(*) from ConstructionFunctionRightPO where constructionFunction.cfid = :cfid").setParameter("cfid", cfid).uniqueResult()).longValue();
	}

}
