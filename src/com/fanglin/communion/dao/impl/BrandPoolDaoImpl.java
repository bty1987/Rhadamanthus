package com.fanglin.communion.dao.impl;

import java.util.List;

import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.communion.dao.BrandPoolDao;
import com.fanglin.communion.po.BrandPoolPO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

@Repository("brandPoolDao")
public class BrandPoolDaoImpl extends DaoImpl<BrandPoolPO> implements BrandPoolDao {

	public BrandPoolDaoImpl() {
		super(BrandPoolPO.class);
	}

	@Override
	public List<BrandPoolPO> pageBrandPool(Paging paging, List<Filter> filters) {

		PagingQuery<BrandPoolPO> query = pagingQuery(paging, BrandPoolPO.class);

		queryFilterExcute(query, filters);

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<BrandPoolPO> queryBrandPoolByName(String name) {
		return session().createCriteria(BrandPoolPO.class).add(Restrictions.eq("status", BrandPoolPO.STATUS_ENABLE_INT)).add(Restrictions.ilike("name", name, MatchMode.ANYWHERE)).list();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("name".equals(field)) {
				query.add(query.getCriterion("name", data, op));
			}
		}
	}
}
