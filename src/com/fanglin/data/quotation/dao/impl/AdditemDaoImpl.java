package com.fanglin.data.quotation.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.AdditemPO;
import com.fanglin.data.quotation.dao.AdditemDao;
import com.fanglin.utils.Paging;

@Repository("additemDao")
public class AdditemDaoImpl extends DaoImpl<AdditemPO> implements AdditemDao {

	public AdditemDaoImpl() {
		super(AdditemPO.class);
	}

	@Override
	public List<AdditemPO> pageAdditem(Paging paging, List<Filter> filters, int company) {

		PagingQuery<AdditemPO> query = pagingQuery(paging, AdditemPO.class);

		query.add(Restrictions.eq("company", company));

		queryFilterExcute(query, filters);

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<AdditemPO> queryAdditem(short sort, int company) {
		return session().createCriteria(AdditemPO.class).createAlias("constructionNode", "constructionNode").add(Restrictions.eq("constructionNode.sort", sort)).add(Restrictions.eq("company", company)).list();
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
