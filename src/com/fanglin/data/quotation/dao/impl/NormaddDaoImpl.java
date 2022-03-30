package com.fanglin.data.quotation.dao.impl;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.NormaddPO;
import com.fanglin.data.quotation.dao.NormaddDao;
import com.fanglin.utils.Paging;

@Repository("normaddDao")
public class NormaddDaoImpl extends DaoImpl<NormaddPO> implements NormaddDao {

	public NormaddDaoImpl() {
		super(NormaddPO.class);
	}

	@Override
	public List<NormaddPO> pageNormadd(Paging paging, List<Filter> filters, int company) {

		PagingQuery<NormaddPO> query = pagingQuery(paging, NormaddPO.class);

		query.add(Restrictions.eq("company", company));

		queryFilterExcute(query, filters);

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<NormaddPO> queryNormadd(Short sort, int company) {

		Criteria query = session().createCriteria(NormaddPO.class).add(Restrictions.eq("company", company));

		if (sort != null) {
			query.createAlias("constructionNode", "constructionNode").add(Restrictions.eq("constructionNode.sort", sort));
		}

		return query.list();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

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
