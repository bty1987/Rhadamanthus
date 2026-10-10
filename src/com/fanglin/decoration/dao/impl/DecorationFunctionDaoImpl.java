package com.fanglin.decoration.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.dao.DecorationFunctionDao;
import com.fanglin.decoration.po.DecorationFunctionPO;
import com.fanglin.utils.Paging;

@Repository("decorationFunctionDao")
public class DecorationFunctionDaoImpl extends DaoImpl<DecorationFunctionPO> implements DecorationFunctionDao {

	public DecorationFunctionDaoImpl() {
		super(DecorationFunctionPO.class);
	}

	@Override
	public List<DecorationFunctionPO> pageDecorationFunction(Paging paging, List<Filter> filters) {
		PagingQuery<DecorationFunctionPO> query = pagingQuery(paging, DecorationFunctionPO.class);

		queryFilterExcute(query, filters);

		query.asc("sort").asc("dfid");

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
	public List<DecorationFunctionPO> queryDecorationFunction(Short type) {

		if (type != null) {
			return session().createCriteria(DecorationFunctionPO.class).add(Restrictions.eq("type", type)).list();
		} else {
			return session().createCriteria(DecorationFunctionPO.class).list();
		}
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationFunctionPO> queryDecorationFunctionByName(String name) {
		return session().createCriteria(DecorationFunctionPO.class).add(Restrictions.eq("name", name)).list();
	}

	@Override
	public long countDecorationFunctionRightByDfid(long dfid) {
		return ((Number) session().createQuery("select count(*) from DecorationFunctionRightPO where decorationFunction.dfid = :dfid").setParameter("dfid", dfid).uniqueResult()).longValue();
	}

}
