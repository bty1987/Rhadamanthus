package com.fanglin.communion.dao.impl;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.communion.dao.ConstantDao;
import com.fanglin.communion.po.ConstantPO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

@Repository("constantDao")
public class ConstantDaoImpl extends DaoImpl<ConstantPO> implements ConstantDao {

	public ConstantDaoImpl() {
		super(ConstantPO.class);
	}

	@Override
	public List<ConstantPO> pageConstant(Paging paging, List<Filter> filters) {

		PagingQuery<ConstantPO> query = pagingQuery(paging, ConstantPO.class);

		queryFilterExcute(query, filters);

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ConstantPO> queryConstant(String module, String clazz, String type) {

		Criteria query = session().createCriteria(ConstantPO.class);

		if (module != null) {
			query.add(Restrictions.eq("module", module));
		}

		if (clazz != null) {
			query.add(Restrictions.eq("clazz", clazz));
		}

		if (type != null) {
			query.add(Restrictions.eq("type", type));
		}

		return query.add(Restrictions.eq("status", ConstantPO.STATUS_ENABLE_INT)).list();
	}

	@Override
	public ConstantPO queryConstant(String module, String clazz, String type, String key) {
		return (ConstantPO) session().createCriteria(ConstantPO.class).add(Restrictions.eq("module", module)).add(Restrictions.eq("clazz", clazz)).add(Restrictions.eq("type", type)).add(Restrictions.eq("type", type)).setMaxResults(1).uniqueResult();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if (field.equals("name")) {
				query.add(query.getCriterion(field, data, op));
			} else if (field.equals("key")) {
				query.add(query.getCriterion(field, data, op));
			} else if (field.equals("field")) {
				query.add(query.getCriterion(field, data, op));
			} else if (field.equals("module")) {
				query.add(query.getCriterion(field, data, op));
			}
		}
	}

}
