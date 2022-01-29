package com.fanglin.data.quotation.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.PackitemPO;
import com.fanglin.data.quotation.dao.PackitemDao;
import com.fanglin.utils.Paging;

@Repository("packitemDao")
public class PackitemDaoImpl extends DaoImpl<PackitemPO> implements PackitemDao {

	public PackitemDaoImpl() {
		super(PackitemPO.class);
	}

	@Override
	public List<PackitemPO> pagePackitem(Paging paging, List<Filter> filters) {

		PagingQuery<PackitemPO> query = pagingQuery(paging, PackitemPO.class);

		queryFilterExcute(query, filters);

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<PackitemPO> queryPackitem(short sort) {
		return session().createCriteria(PackitemPO.class).createAlias("constructionNode", "constructionNode").add(Restrictions.eq("constructionNode.sort", sort)).list();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null)
			return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if (field.equals("name")) {
				query.add(query.getCriterion("name", data, op));
			} else if (field.equals("status")) {
				query.add(query.getCriterion("status", Short.parseShort(data), op));
			}
		}
	}

}
